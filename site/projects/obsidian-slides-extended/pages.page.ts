import { dirname } from "@std/path";
import { Data } from "lume/core/file.ts";
import { extractTitle, getExt, IGNORE_FILES, setFileData, toRawData, walkTree } from "../../_plugins/walkTree.ts";
import { fetchGitHubContributors } from "../../_plugins/ghContributors.ts";

// 's' spans newline characters; 'g' to match all
const childrenRegex = /{{% ?children(.*?)?%}}/g;
const ghContributorsRegex = /{{% ?ghcontributors "([^"]+)" ?%}}/g;
const iconRegex = /{{% ?icon .*? ?%}}/g;
const revealjsRegex = /{{< ?revealjs([^>]*)>}}([\s\S]*?){{< ?\/revealjs ?>}}/gs;

const slidesBase = `${Deno.cwd()}/projects/obsidian-slides-extended`;

const ghContributors = new Map<string, string>();

async function gitContributors(url: string): Promise<string> {
    if (ghContributors.has(url)) {
        return ghContributors.get(url)!;
    }
    const html = await fetchGitHubContributors(url);
    ghContributors.set(url, html);
    return html;
}

async function replaceShortCodes(data: Partial<Data>): Promise<string> {
    // Replace Hugo shortcodes with desired content
    let content = data.content as string;

    const ghContributorsMatches = content.matchAll(ghContributorsRegex);
    for (const match of ghContributorsMatches) {
        const url = match[1];
        const html = await gitContributors(url);
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
    if (childrenRegex.test(content)) {
        // const dir = dirname(data.fullPath);
        // const index = await folderIndex(dir);
        content = content.replace(childrenRegex, (_) => {
            return`
            {{ set menu = nav.menu(page.data.url, "", "weight sortOrder url") }}
            {{ include "layouts/project-index.vto" { menu } }}`
        });
    }
    return content;
}

async function slidesExtended(dirEntry: Deno.DirEntry, data: Partial<Data>): Promise<Partial<Data> | null> {
    const ext = getExt(dirEntry.name);
    const rawData = await toRawData(data.fullPath);
    if (rawData.content === undefined) {
        return null;
    }
    Object.assign(data, rawData);

    if (ext === '.md') {
        extractTitle(data);
        data.weight = data.weight || 99;
        data.projectRoot = "/projects/obsidian-slides-extended/";
        data.cssclasses = ['docs'];
        data.templateEngine = ['vto', 'md'];
        data.type = 'project-doc';
        data.layout = data.layout
            || 'layouts/project-doc.vto';
        data.description = data.description
            || 'Documentation for Slides Extended, an open source plugin that allows you to create reveal.js presentations in Obsidian.';
        data.content = await replaceShortCodes(data);
    }
    return data;
}

export default async function* () {
    const pages: Data[] = [];

    await walkTree(`${slidesBase}/docs`, async (path, dirEntry) => {
        if(dirEntry.name.startsWith('.')
            || IGNORE_FILES.includes(dirEntry.name)) {
            console.log(`Ignoring ${path}/${dirEntry.name}`);
            return false;
        }
        if (dirEntry.isFile) {
            let data: Partial<Data> | null = {};
            setFileData(data, path, dirEntry, slidesBase,
                "https://github.com/ebullient/obsidian-slides-extended");
            data = await slidesExtended(dirEntry, data);
            if (data) {
                pages.push(data as Data);
            }
        }
        return true;
    });
    console.log("🚀 Done, slides-extended", pages.length);

    for (const data of pages) {
        if (data.url?.includes('docs')) {
            data.url = data.url.replace('docs/', '').replace('content/', '');
        }
        if (data.srcPath.match(/.*\/examples\/[^/]+\/.*/)) {
            const target = data.srcPath.replace('docs/content/', '');
            // Examples should not be parsed at all.
            // Copy the file to the public folder, and remove it from the build.
            const targetFile = `${Deno.cwd()}/public/${target}`;
            const dir = dirname(targetFile);
            await Deno.mkdir(dir, { recursive: true });
            await Deno.copyFile(data.fullPath, targetFile);
            continue;
        }
        yield data;
    }
};