export default function* ({ search }) {
  // Select the pages
  const pages = search.pages("aliases!=undefined");
  for(const data of pages) {
    for(let alias of data.aliases) {
      if (!alias.endsWith(".html") && !alias.endsWith("/")) {
        alias += "/";
      }
      yield {
        layout: "layouts/redirect.vto",
        url: `${alias}`,
        title: data.title,
        target: data.url,
        metas: {
          description: "",
          icon: "",
          image: "",
          robots: "noindex, nofollow, noarchive",
          site: "",
          title: "",
          url: data.url,
        }
      };
    }
  }
}