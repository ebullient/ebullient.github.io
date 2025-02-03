import { basename, extname } from "@std/path";
import { Data, RawData } from "lume/core/file.ts";
import { extract, test } from "lume/deps/front_matter.ts";

export const IGNORE_FILES = [
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

export const BINARY_EXTENSIONS = [
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.webp',
    '.ico',
    '.avif',
    '.pdf',
    '.mp4',
    '.webm',
    '.mov',
    '.zip',
    '.gz',
    '.tar',
    '.tgz',
    '.rar',
    '.7z',
    '.bz2',
    '.mp3',
    '.wav',
    '.ogg',
    '.flac',
];

export function getExt(path: string): string {
    return extname(path);
}

export async function folderIndex(path: string): Promise<string> {
    let content = '';
    for await (const file of Deno.readDir(path)) {
        if (file.name !== "_index.md" && file.name !== "README.md") {
            content += `- [${file.name}](./${file.name})\n`;
        }
    }
    return content;
}

export function isBinaryFile(path: string): boolean {
    const ext = getExt(path).toLowerCase();
    return BINARY_EXTENSIONS.includes(ext);
}

export function extractTitle(data: Partial<Data>) {
    const content = data.content as string;
    const titleMatch = content.match(/^#\s+(.*)$/m);
    if (titleMatch) {
        data.hasContentTitle = true;
        if (!data.title) {
            data.title = titleMatch[1];
        }
    }
}

export async function toRawData(path: string, extractFrontMatter = true): Promise<Partial<Data>> {
    const content = isBinaryFile(path)
        ? await Deno.readFile(path)
        : await Deno.readTextFile(path);

    if (extractFrontMatter && getExt(path) === '.md' && test(content as string)) {
        const extracted: RawData = extract<RawData>(content as string);
        const bodyContent = extracted.body as string;
        return {
            ...extracted.attrs,
            content: bodyContent,
            hasTitle: bodyContent.match(/(^|\n)# /),
        };
    }

    return {
        content
    };
}

export function setFileData(data: Partial<Data>,
        path: string,
        dirEntry: Deno.DirEntry,
        projectRoot: string,
        repo: string) {

    data.fullPath = `${path}/${dirEntry.name}`;
    data.srcPath = data.fullPath.replace(`${Deno.cwd()}`, '');
    data.repoRelative = data.srcPath.replace(projectRoot, '').slice(1);
    data.githubUrl = `${repo}/blob/main/${data.repoRelative}`;
    data.url = `${data.srcPath}`
        .replace('.md', '.html')
        .replace('README.html', '')
        .replace('_index.html', '');
    data.genUrl = data.url;
}

export async function walkTree(dir: string, visit: (path: string, entry: Deno.DirEntry) => Promise<boolean>) {
    const files = Deno.readDirSync(dir);
    for (const file of files) {
        const follow = await visit(dir, file);
        if (follow && file.isDirectory) {
            await walkTree(`${dir}/${file.name}`, visit);
        }
        // else ignore / don't follow
    }
}