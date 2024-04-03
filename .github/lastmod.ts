import url from "lume/plugins/url.ts";

const interestingFiles = [
    '.css',
    '.json',
    '.md',
    '.txt',
    '.yaml',
    '.yml',
 ];
const ignore = [
    'jitpack.yml',
    'jreleaser.yml',
    'migration',
    'test',
];

const projectPath = './site/projects';
const metaPath = './site/_includes/projects.json';
const projectMeta = Deno.readTextFileSync(metaPath);
const now = new Date().toISOString();

// deno-lint-ignore no-explicit-any
const meta: Record<string, any> = JSON.parse(projectMeta);

function getGithubUrl(repoDir: string): string {
    const data = Deno.readFileSync(`${Deno.cwd()}/.gitmodules`);
    const gitmodules = new TextDecoder("utf-8").decode(data);

    // Extract the project name from the directory path
    const projectName = repoDir.substring(repoDir.lastIndexOf('/') + 1);

    // Use a regular expression to find the URL for the project
    const regex = new RegExp(`(https.*?/${projectName})\\.git`, 'i');
    const match = gitmodules.match(regex);
    const githubUrl = match ? match[1] + '/blob/main/' : '';
    console.log(`GitHub URL: ${githubUrl}`)

    return githubUrl;
}

// Get last commit date for a file
function gitLastCommitDate(filePath: string, repo: string): Date {
    const command = new Deno.Command('git', {
        args: ['--no-pager', 'log', '--format=%cI', '-1', '--', filePath],
        cwd: repo,
    });

    const { code, stdout, stderr } = command.outputSync();
    const output = new TextDecoder().decode(stdout).trim();
    console.assert(code === 0);
    return new Date(output);
}

async function readDir(path: string, relative: string, repo: string, repoRelative: string, ghUrl: string) {
    for await (const dirEntry of Deno.readDir(path)) {
        if(dirEntry.name.startsWith('.') || dirEntry.name.startsWith('_') || ignore.includes(dirEntry.name)) {
            continue;
        }
        if (dirEntry.isFile) {
            if (!interestingFiles.some((ext) => dirEntry.name.endsWith(ext))) {
                continue;
            }
            const filePath = `${relative}${dirEntry.name}`;
            const struct = meta[filePath] = meta[filePath] || {};
            if (struct) {
                struct.visited = now;
                const repoPath = `${repoRelative}${dirEntry.name}`;
                struct.date = gitLastCommitDate(repoPath, repo);
                struct.srcPath = filePath;
                struct.githubUrl = `${ghUrl}`;
                struct.repoUrl = `${ghUrl}${repoPath}`;
                if (ghUrl.includes('ttrpg-convert-cli')) {
                    struct.description = 'Documentation for TTRPG Convert CLI: a command-line utility to convert 5eTools or Pf2eTools JSON data into Obsidian-friendly Markdown.';
                }
                if (dirEntry.name.endsWith('.md')) {
                    struct.type = 'project-doc';
                    struct.layout = 'layouts/project-doc.vto';
                    struct.cssclasses = ['docs'];
                } else {
                    struct.download = struct.repoUrl
                            .replace('github.com', 'raw.githubusercontent.com').replace('/blob', '');
                    struct.type = 'project-file';
                    struct.layout = 'layouts/project-wrapper.vto';
                    struct.lang = dirEntry.name.substring(dirEntry.name.lastIndexOf('.') + 1)
                            .replace('yml', 'yaml');
                    struct.cssclasses = ['docs', 'files'];
                    struct.title = repoPath;
                }
                struct.url = `/${filePath}.html`
                        .replace('.md', '')
                        .replace('README.html', '')
                        .replace('src/main/resources/', 'src-main-resources-');
                struct.genUrl = url;
            }
        } else if (dirEntry.isDirectory) {
            const nextDir = `${path}/${dirEntry.name}`;
            let nextRepoRel = `${repoRelative}${dirEntry.name}/`;
            if (path === projectPath) {
                repo = nextDir;
                relative = 'projects/';
                ghUrl = getGithubUrl(repo);
                nextRepoRel = '';
            }
            await readDir(nextDir, `${relative}${dirEntry.name}/`, repo, nextRepoRel, ghUrl);
        }
    }
}

await readDir(projectPath, '', '', '', '');
for (const key in meta) {
    if (meta[key].visited !== now) {
        console.log(`Removing ${key}`);
        delete meta[key];
    } else {
        delete meta[key].visited;
    }
}

// Write updated foundation metadata
Deno.writeTextFileSync(metaPath, JSON.stringify(meta, null, 2));
