const fs = require('fs');
const path = require('path');

// Define the front matter
const frontMatter = `---
draft: false
layout: single
`;

// Function to add front matter to a file
function addFrontMatter(file) {
  const content = fs.readFileSync(file, 'utf8');
  const fileName = path.basename(file);
  let newFrontMatter = frontMatter;

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

// Function to create a symlink from README.md to _index.md
function renameFile(dir) {
  const oldPath = path.join(dir, 'README.md');
  const newPath = path.join(dir, '_index.md');

  if (fs.existsSync(oldPath) && !fs.existsSync(newPath)) {
    fs.renameSync(oldPath, newPath);
  }
}

// Function to add front matter to all markdown files in a directory
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      processDirectory(filePath);
    } else if (path.extname(file) === '.md') {
      addFrontMatter(filePath);
      if (file === 'README.md') {
        renameFile(dir);
      }
    }
  }
}

// Process the projects directory
processDirectory('projects');