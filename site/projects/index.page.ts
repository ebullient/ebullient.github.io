import { Data, Page } from "lume/core/file.ts";
import { basename, dirname } from "@std/path";
import { fetchGitHubContributors } from "../_plugins/ghContributors.ts";

// 's' spans newline characters; 'g' to match all
const childrenRegex = /{{% ?children(.*?)%}}/g;
const ghContributorsRegex = /{{% ?ghcontributors "([^"]+)" ?%}}/g;
const iconRegex = /{{% ?icon .*? ?%}}/g;
const revealjsRegex = /{{< ?revealjs([^>]*)>}}([\s\S]*?){{< ?\/revealjs ?>}}/gs;

const ignore = [
    'dco.txt',
    'ide-config',
    'jitpack.yml',
    'jreleaser.yml',
    'migration',
    'mvnw',
    'mvnw.cmd',
    'pom.xml',
    'test',
];

function langWrapper(content: string, lang: string, cssNote: string): string {
    return `${cssNote}
~~~${lang}
${content}
~~~
`;
}

function folderIndex(path: string): string {
    let content = '';
    const current = basename(path);
    const files = Deno.readDirSync(path);
    for (const file of files) {
        if (file.name !== current) {
            content += `- [${file.name}](./${file.name})\n`;
        }
    }
    return content;
}

function ttrpgConvertCli(dirEntry: Deno.DirEntry, data: Partial<Data>): Partial<Data> | null {
    data.templateEngine = ['md', 'vto'];
    data.description = 'Documentation for TTRPG Convert CLI: a command-line utility to convert 5eTools or Pf2eTools JSON data into Obsidian-friendly Markdown.';

    const bytes = Deno.readFileSync(data.fullPath);
    const content = new TextDecoder().decode(bytes);

    if (dirEntry.name.endsWith('.md')) {
        data.type = 'project-doc';
        data.layout = 'layouts/project-doc.vto';
        data.cssclasses = ['docs'];
        // Markdown content: not much frontmatter on this path.
        // We have to extract the title/fileIndex from the content.
        const titleMatch = content.match(/^#\s+(.*)$/m);
        if (titleMatch) {
            data.title = titleMatch[1];
        }
        data.content = content;
    } else if (dirEntry.name.match(/.*\.(css|json|txt|yml|yaml)$/)) {
        if (dirEntry.name.match(/(convertData|sourceMap).*/)) {
            return null; // skip these files
        }
        data.cssclasses = ['docs', 'files'];
        data.download = data.githubUrl
                .replace('github.com', 'raw.githubusercontent.com').replace('/blob', '');
        data.layout = 'layouts/project-wrapper.vto';
        data.lang = dirEntry.name.substring(dirEntry.name.lastIndexOf('.') + 1)
                .replace('yml', 'yaml');
        data.title = data.repoRelative;
        data.type = 'project-file';
        data.url += '.html';

        const cssNote = data.lang === 'css'
            ? `> [!NOTE] This is a CSS file that is built using Sass. The SCSS source is available on [GitHub](${data.githubUrl}src/scss).\n`
            : '';
        data.content = langWrapper(content, data.lang, cssNote);
    } else {
        return null;
    }
    return data;
}

async function replaceShortCodes(data: Data): Promise<string> {
    // Replace Hugo shortcodes with desired content
    let content = data.content as string;

    const ghContributorsMatches = content.matchAll(ghContributorsRegex);
    for (const match of ghContributorsMatches) {
        const url = match[1];
        const html = await fetchGitHubContributors(url);
        content = content.replace(match[0], html);
    }
    content = content.replace(iconRegex, (_, iconClass) => {
        return `<i class="fa ${iconClass}"></i>`;
    });
    content = content.replace(revealjsRegex, (_, options, innerContent) => {
        // See site/_plugins/revealjs.ts for the RevealJsOptions type
        // and for delayed (post-markdown render) processing of the content.
        data.revealjs = {
            controls: options.match(/controls="([^"]*)"/)?.[1] || "false",
            center: options.match(/center="([^"]*)"/)?.[1] || "true",
            history: options.match(/history="([^"]*)"/)?.[1] || "false",
            progress: options.match(/progress="([^"]*)"/)?.[1] || "false",
            transition: options.match(/transition="([^"]*)"/)?.[1] || "concave",
            width: options.match(/width="([^"]*)"/)?.[1] || "100%",
            height: options.match(/height="([^"]*)"/)?.[1] || "30em",
            theme: options.match(/theme="([^"]*)"/)?.[1] || "white",
            highlight: options.match(/highlight="([^"]*)"/)?.[1] || "zenburn",
            innerContent,
        }
        return '<!-- revealjs -->';
    });
    content = content.replace(childrenRegex, (_) => {
        const dir = dirname(data.fullPath);
        return folderIndex(dir);
    });
    return content;
}

function slidesExtended(dirEntry: Deno.DirEntry, data: Partial<Data>): Partial<Data> | null {
    if (data.srcPath.match(/.*\/examples\/[^/]+\/.*/)) {
        // Examples should not be parsed at all.
        // Copy the file to the public folder, and remove it from the build.
        const targetFile = `${Deno.cwd()}/public/${data.target}`;
        const dir = dirname(targetFile);
        Deno.mkdirSync(dir, { recursive: true });
        Deno.copyFileSync(data.fullPath, targetFile);
        return null;
    }

    const bytes = Deno.readFileSync(data.fullPath);
    if (dirEntry.name.match(/.*\.(gif|jpg|jpeg|png|svg)/)) {
        // light processing of images. Assign the content and return.
        // The URL is already set, and keeping the image in the build helps
        // ensure correct URLs.
        data.content = bytes;
        return data;
    }

    const content = new TextDecoder().decode(bytes);

    // page content has yaml frontmatter and markdown content.
    // but lume hasn't parsed the frontmatter yet, so we need to fish
    if (!content.includes('title: ')) {
        const titleMatch = content.match(/^#\s+(.*)$/m);
        if (titleMatch) {
            data.title = titleMatch[1];
        }
    }

    data.content = content;
    data.cssclasses = ['docs'];
    data.templateEngine = ['md', 'vto'];
    data.type = 'project-doc';
    data.layout = 'layouts/project-doc.vto';
    data.description = 'Documentation for Slides Extended, an open source plugin that allows you to create reveal.js presentations in Obsidian.';

    // We need to parse the content to replace shortcodes (later)
    data.shortcodes = true;

    return data;
}

function walkTree(dir: string, visit: (path: string, entry: Deno.DirEntry) => boolean) {
    const files = Deno.readDirSync(dir);
    for (const file of files) {
        if (!visit(dir, file)) {
            continue; // ignore / don't follow
        }
        if (file.isDirectory) {
            walkTree(`${dir}/${file.name}`, visit);
        }
    }
}

function setFileData(data: Partial<Data>,
            path: string,
            dirEntry: Deno.DirEntry,
            projectRoot: string,
            repo: string) {
    data.fullPath = `${path}/${dirEntry.name}`;
    data.srcPath = data.fullPath.replace(`${Deno.cwd()}/site`, '');
    data.repoRelative = data.srcPath.replace(projectRoot, '').slice(1);
    data.githubUrl = `${repo}/blob/main/${data.repoRelative}`;
    data.target = data.srcPath
            .replace('docs/content/', '')
            .replace('docs/images/', 'images/');
    data.url = `${data.target}`
        .replace('.md', '.html')
        .replace('README.html', '')
        .replace('_index.html', '')
        .replace('src/main/resources/', 'examples/defaults/');
    data.genUrl = data.url;
}

export default async function* ({ page }: { page: Page }) {
    const ttrpgBase = `${Deno.cwd()}/site/projects/ttrpg-convert-cli`;
    const pages: Data[] = [];
    walkTree(ttrpgBase, (path, dirEntry) => {
        if(dirEntry.name.startsWith('.')
            || dirEntry.name.startsWith('_')
            || dirEntry.name.endsWith('.java')
            || dirEntry.name.endsWith('.properties')
            || dirEntry.name.endsWith('.svg')
            || ignore.includes(dirEntry.name)) {
            return false;
        }
        if (dirEntry.isFile) {
            let data: Partial<Data> | null = {};
            setFileData(data, path, dirEntry, ttrpgBase,
                "https://github.com/ebullient/ttrpg-convert-cli");
            data.description = 'Documentation for TTRPG Convert CLI: a command-line utility to convert 5eTools or Pf2eTools JSON data into Obsidian-friendly Markdown.';
            data = ttrpgConvertCli(dirEntry, data);
            if (data) {
                pages.push(data as Data);
            }
        }
        return true;
    });

    const slidesBase = `${Deno.cwd()}/site/projects/obsidian-slides-extended`;
    walkTree(`${slidesBase}/docs`, (path, dirEntry) => {
        if(dirEntry.name.startsWith('.') || ignore.includes(dirEntry.name)) {
            console.log(`Ignoring ${path}/${dirEntry.name}`);
            return false;
        }
        if (dirEntry.isFile) {
            let data: Partial<Data> | null = {};
            setFileData(data, path, dirEntry, slidesBase,
                "https://github.com/ebullient/obsidian-slides-extended");
            data.description = 'Documentation for Slides Extended, an open source plugin that allows you to create reveal.js presentations in Obsidian.';
            data = slidesExtended(dirEntry, data);
            if (data) {
                pages.push(data as Data);
            }
        }
        return true;
    });

    for (const data of pages) {
        if (data.shortcodes) {
            data.content = await replaceShortCodes(data);
        }
        yield data;
    }

    page.data = {
        ...page.data,
        content: `
- [TTRPG Convert CLI](/projects/ttrpg-convert-cli/)
- [Slides Extended](/projects/obsidian-slides-extended/)
`,
        templateEngine: ['md', 'vto'],
        layout: 'layouts/page.vto',
        cssclasses: ['page'],
    }
    yield page;
}