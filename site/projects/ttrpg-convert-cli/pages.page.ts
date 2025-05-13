import { Data } from "lume/core/file.ts";
import { extractTitle, getExt, IGNORE_FILES, setFileData, toRawData, walkTree } from "../../_plugins/walkTree.ts";
import { basename } from "@std/path/basename";

const ttrpgBase = `${Deno.cwd()}/projects/ttrpg-convert-cli`;
const interestingFiles = [
    ".md",
    ".css",
    ".json",
    ".txt",
    ".yml",
    ".yaml",
];

const TTRPG_IGNORE_FILES = [
    'convertData.json',
    'sourceMap.yaml'
];

function isInterestingFile(path: string, ext: string): boolean {
    return path.includes('/docs/')
        || interestingFiles.includes(ext);
}

function langWrapper(content: string, lang: string, note: string): string {
    return `${note}
~~~${lang == 'txt' ? 'md' : lang}
${content}
~~~
`;
}

function getNoteForLang(lang: string, githubUrl: string): string {
    switch (lang) {
        case 'css':
            return `> [!NOTE]
            > This is a CSS file that is built using Sass. The SCSS source is available on <a href="${githubUrl}src/scss">GitHub</a>.\n`;
        case 'txt':
            return `> [!NOTE]
            > This is a <a href="/projects/ttrpg-convert-cli/docs/templates/">Qute template</a> for creating notes in markdown.\n`;
        default:
            return '';
    }
}

async function ttrpgConvertCli(dir: string, dirEntry: Deno.DirEntry, data: Partial<Data>): Promise<Partial<Data> | null> {
    const ext = getExt(dirEntry.name);
    if (!isInterestingFile(dir, ext)) {
        return null; // skip these files
    }
    const rawData = await toRawData(data.fullPath);
    if (rawData.content === undefined) {
        return null;
    }
    Object.assign(data, rawData);

    if (ext === '.md') {
        extractTitle(data);
        data.type = 'project-doc';
        data.cssclasses = ['docs'];
    } else if (ext.match(/\.(png|jpg)/)) {
        return data;
    } else {
        data.type = 'project-file';
        data.cssclasses = ['docs', 'files'];
        data.download = data.githubUrl
                .replace('github.com', 'raw.githubusercontent.com').replace('/blob', '');
        data.title = basename(data.download);
        data.lang = dirEntry.name.substring(dirEntry.name.lastIndexOf('.') + 1)
                .replace('yml', 'yaml');
        data.url += '.html';

        const note = getNoteForLang(data.lang, data.githubUrl);
        data.content = langWrapper(
                data.content as string,
                data.lang, note);
    }

    data.projectRoot = "/projects/ttrpg-convert-cli/";
    data.layout = 'layouts/project-doc.vto';
    data.url = data.url
        ? data.url.replace('src/main/resources/templates', 'examples/templates/defaults')
        : undefined;

    data.templateEngine = data.templateEngine
        || ['md', 'vto'];
    data.description = data.description
        || 'Documentation for TTRPG Convert CLI: a command-line utility to convert 5eTools or Pf2eTools JSON data into Obsidian-friendly Markdown.';

    return data;
}

export default async function* () {
    const pages: Data[] = [];
    await walkTree(ttrpgBase, async (path, dirEntry) => {
        if (dirEntry.name.startsWith('.')
            || dirEntry.name.startsWith('_')
            || dirEntry.name.endsWith('.java')
            || dirEntry.name.endsWith('.properties')
            || dirEntry.name.endsWith('.svg')
            || IGNORE_FILES.includes(dirEntry.name)
            || TTRPG_IGNORE_FILES.includes(dirEntry.name)) {
            return false;
        }
        if (dirEntry.isFile) {
            let data: Partial<Data> | null = {};
            setFileData(data, path, dirEntry, ttrpgBase,
                "https://github.com/ebullient/ttrpg-convert-cli");
            data = await ttrpgConvertCli(path, dirEntry, data);
            if (data) {
                pages.push(data as Data);
            }
        }
        return true;
    });
    console.log("🚀 Done, ttprg", pages.length);

    for (const data of pages) {
        yield data;
    }
}