export default function* ({ page }) {
  const codeFiles = /\(([^)]*?\.(json|yaml|yml|css|txt))\)/g;
  const htmlLinks = /(href="[^"]*\.)md((#[^"]*)?")/g;
  const projectMeta = JSON.parse(Deno.readTextFileSync('./site/_includes/projects.json'));
  for (const [name, data] of Object.entries(projectMeta)) {

    data.templateEngine = ['md', 'vto'];
    data.content = Deno.readFileSync(`${Deno.cwd()}/site/${name}`);
    data.content = new TextDecoder().decode(data.content)
      .replace(codeFiles, (match, group1) => {
        if (group1.startsWith('http')) {
          return match;
        }
        const target = group1
          .replace('src/main/resources/', 'src-main-resources-')
          .replace('README', '')
          + '.html';
        return `(${target})`;
      }).replace(htmlLinks, (_, group1, group2) => {
        return `${group1}html${group2}`;
      });

    if (name.endsWith('.md')) {
      // Markdown content
      const titleMatch = data.content.match(/^#\s+(.*)$/m);
      if (titleMatch) {
        data.title = titleMatch[1];
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