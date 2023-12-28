const fs = require('fs');
const path = require('path');

function getGithubUrl(dir) {
  const gitmodules = fs.readFileSync(path.relative(process.cwd(), '.gitmodules'), 'utf8');

  // Extract the project name from the directory path
  const projectName = path.basename(dir);

  // Use a regular expression to find the URL for the project
  const regex = new RegExp(`(https.*?/${projectName})\\.git`, 'i');
  const match = gitmodules.match(regex);

  let githubUrl = match ? match[1] + '/blob/main/' : null;

  console.log(`GitHub URL: ${githubUrl}`)
  return githubUrl;
}

function githubPath(dir, githubUrl) {
  // Split the path into segments
  let segments = dir.split(path.sep);

  // Remove the first two segments
  segments = segments.slice(2);

  return `${githubUrl}${segments.join('/')}`;
}

// Define the front matter
const singleFrontMatter = `---
layout: single
`;

// Function to add front matter to a file
function addFrontMatter(file) {
  // Regular expression to match .json, .yaml, .css, and .txt links
  const regex = /\(([^)]*?\.(json|yaml|css|txt))\)/g;
  const content = fs.readFileSync(file, 'utf8').replace(regex, '($1.md)');
  const fileName = path.basename(file);
  let newFrontMatter = singleFrontMatter;

  if (fileName === '_index.md') {
    return;
  }

  // Extract the title from the first H1 header in the content
  const titleMatch = content.match(/^#\s+(.*)$/m);
  if (titleMatch) {
    newFrontMatter += `title: "${titleMatch[1]}"\n`;
  }

  // Add alias for README.md
  if (fileName === 'README.md') {
    const relativePath = path.relative(process.cwd(), path.dirname(file));
    newFrontMatter += `url: "/${relativePath}/"\n`;
  }
  newFrontMatter += '---\n';

  fs.writeFileSync(file, newFrontMatter + content);
}

function addWrapper(file, githubUrl) {
  const relativePath = path.relative(process.cwd(), file);
  const target = file + '.md';
  const url = githubPath(file, githubUrl);
  const lang = path.extname(file).replace('.', '');
  console.log(relativePath, "\n  ", target, "\n  ", url);
  const code = fs.readFileSync(file, 'utf8');
  const content = `---
layout: file
title: "${relativePath}"
language: ${lang}
canonical: "${url}"
---

\`\`\`${lang}
${code}
\`\`\`
`;

  fs.writeFileSync(target, content);
}

// Function to create a symlink from README.md to _index.md
function renameFile(dir) {
  const oldPath = path.join(dir, 'README.md');
  const newPath = path.join(dir, '_index.md');

  if (fs.existsSync(oldPath) && !fs.existsSync(newPath)) {
    fs.renameSync(oldPath, newPath);
  }
}

// Function to add front matter to all markdown files in a directory
function processDirectory(dir, githubUrl = null) {
  const isChildOfProjects = path.dirname(dir) === 'projects';
  if (isChildOfProjects) {
    console.log(`Processing directory: ${dir}`)
    githubUrl = getGithubUrl(dir);
  }

  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    const ext = path.extname(file);
    if (stats.isDirectory()) {
      processDirectory(filePath, githubUrl);
    } else if (ext == '.css' || ext == '.json' || ext == '.txt' || ext == '.yaml') {
      addWrapper(filePath, githubUrl);
    } else if (ext === '.md') {
      addFrontMatter(filePath);
      if (file === 'README.md') {
        renameFile(dir);
      }
    }
  }
}

// Process the projects directory
processDirectory('projects');