export default function* ({ search, paginate }) {
  const posts = search.pages("type=post", "date=desc", 30);

  for (const data of paginate(posts, { url, size: 10 })) {
    data.layout = "layouts/index-recent.vto";
    if (data.pagination.page === 1) {
      data.title = "Home";
    } else {
      data.title = `Blog [${data.pagination.page} of ${data.pagination.totalPages}]`;
      data.canonical = 'none';
    }
    data.description = `Blog excerpts; page ${data.pagination.page} of ${data.pagination.totalPages}`;
    data.metas = data.metas || {};
    data.metas.robots = "noindex, noarchive";
    data.cssclasses = ['page'];
    yield data;
  }
}

function url(n) {
  if (n === 1) {
    return "/";
  }

  return `/page-${n}.html`;
}