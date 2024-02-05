import { path } from "https://deno.land/x/vento@v0.10.0/deps.ts";

export default function* ({ page }) {
  const projectMeta = JSON.parse(Deno.readTextFileSync('./site/_includes/projects.json'));

  for (const [name, data] of Object.entries(projectMeta)) {
    data.templateEngine = ['md', 'vto'];
    data.content = Deno.readFileSync(`${Deno.cwd()}/site/${name}`);
    data.content = new TextDecoder().decode(data.content);
    if (name.endsWith('.md')) {
      // Markdown content
      const titleMatch = data.content.match(/^#\s+(.*)$/m);
      if (titleMatch) {
        data.title = titleMatch[1];
      }
      if (data.content.includes('type: fileIndex')) {
        data.content += '';
        const current = path.basename(`${Deno.cwd()}/site/${name}`);
        const dir = path.dirname(`${Deno.cwd()}/site/${name}`);
        const files = Deno.readDirSync(dir);
        for (const file of files) {
          if (file.name !== current) {
            data.content += `- [${file.name}](./${file.name})\n`;
          }
        }
      }
    } else if (data.lang) {
      // File wrapper around css/json/yaml/txt
      const cssNote = data.lang === 'css'
        ? `> [!NOTE] This is a CSS file that is built using Sass. The SCSS source is available on [GitHub](${data.githubUrl}src/scss).`
        : '';
      data.content = `${cssNote}
~~~${data.lang}
${data.content}
~~~
`;
    }

    yield data;
  }

  const newPage = { ...page.data };
  newPage.title = 'Projects';
  newPage.content = `
  - [TTRPG Convert CLI](/projects/ttrpg-convert-cli/)
  `;
  newPage.templateEngine = ['md', 'vto'];
  newPage.layout = 'layouts/page.vto';
  newPage.cssclasses = ['page'];
  yield newPage;
}