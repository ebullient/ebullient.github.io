import { Data } from "lume/core/file.ts";
import { extractTitle, getExt, IGNORE_FILES, setFileData, toRawData, walkTree } from "../../_plugins/walkTree.ts";

const admonitionBase = `${Deno.cwd()}/projects/obsidian-admonition`;

async function admonition(dirEntry: Deno.DirEntry, data: Partial<Data>): Promise<Partial<Data> | null> {
    const ext = getExt(dirEntry.name);
    const rawData = await toRawData(data.fullPath);
    if (rawData.content === undefined) {
        return null;
    }
    Object.assign(data, rawData);

    if (ext === '.md') {
        extractTitle(data);
        data.weight = data.weight || 99;
        data.projectRoot = "/projects/obsidian-admonition/";
        data.cssclasses = ['docs'];
        data.templateEngine = ['vto', 'md'];
        data.type = 'project-doc';
        data.layout = data.layout || 'layouts/project-doc.vto';
        data.description = data.description
            || 'Documentation for Obsidian Admonition: a plugin that adds block-styled admonition content and callout functionality to Obsidian notes.';
    } else if (!ext.match(/\.(png|gif|jpg|jpeg|webp)$/)) {
        return null;
    }
    return data;
}

export default async function* () {
    const pages: Data[] = [];

    await walkTree(`${admonitionBase}/docs`, async (path, dirEntry) => {
        if (dirEntry.name.startsWith('.')
            || IGNORE_FILES.includes(dirEntry.name)) {
            console.log(`Ignoring ${path}/${dirEntry.name}`);
            return false;
        }
        if (dirEntry.isFile) {
            let data: Partial<Data> | null = {};
            setFileData(data, path, dirEntry, admonitionBase,
                "https://github.com/ebullient/obsidian-admonition");
            data = await admonition(dirEntry, data);
            if (data) {
                pages.push(data as Data);
            }
        }
        return true;
    });
    console.log("🚀 Done, obsidian-admonition", pages.length);

    for (const data of pages) {
        if (data.url?.includes('docs/')) {
            data.url = data.url.replace('docs/', '');
        }
        yield data;
    }
};
