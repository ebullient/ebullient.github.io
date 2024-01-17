---
title: Moving from Hugo to Lume (2, Indexes)
description: Part two of the migration from Hugo to Lume, focusing on rebuilding content indexes (by date and by tag).
keywords:
  - Hugo
  - Lume
tags:
  - blog
  - hugo
  - lume
---

Continuing the migration from [Hugo](https://gohugo.io/) to [Lume](https://lume.land/) that I started [here](./2024-01-04-moving-from-hugo-to-lume.md), the next few templates to address are indexes. Despite the substantial amount of template markup, there's not much text or old formatting to handle. Posts are another matter. Some of them are very old, and use some interesting markup.

- [Archive by Date](#archive-by-date)
- [Archive by Tag](#archive-by-tag)

<!--more-->

## Archive by Date

First, we tackle `index-date.vto`. This template creates a page that [lists all posts grouped by date](/archive/). The archive template applied a `page` class on the main element, so we'll use the `cssclasses` attribute for this purpose. The upper portion of the template is a semantic wrapper around the page content, which we can easily maintain:

```md
---
layout: layouts/base.vto
cssclasses: page
---
<header class="page-header">
  <h1 class="page-title">{{ page.data.title }}</h1>
</header>
<article>
{{ content }}
</article>
<section class="archive_list">
<!-- the complex part goes here -->
</section>
```

Adapting the core of the archive page is more complex. Here's the original Hugo version:

```md
    {{ range where .Site.Sections "Section" .Params.section }}
    {{ range .RegularPages.GroupByPublishDate "2006" }}
    <h2 id="y{{ .Key }}">{{ .Key }}</h2>
    <ul>
      {{ range .Pages }}
      <li>
        <span class="date">{{.Date.Format "02 Jan"}}</span> <a href="{{.RelPermalink}}">{{.Title}}</a>
      </li>
      {{ end }}
    </ul>
    {{ end }}
    {{ end }}
```

Hugo's capabilities are utilized here for searching and grouping pages.

In my `site/content/posts` directory, I created a `_data.yml` file with:

```yaml
layout: layouts/post.vto
type: post
```

This ensures all posts use the correct template and adds a `type` attribute to each, allowing us to filter by type.

My initial diagnostic attempt was straightforward:

```md
{{> console.log(search.pages("type=post")) }}
```

This command logged a list of all posts to the console. 🎉
Using Vento, we can set variables with `set`. The following command produced the same console output:

```md
{{ set posts = search.pages("type=post") }}
{{> console.log(posts) }}
```

Now, we can group posts by year using JavaScript:

```md
<section class="archive_list">
{{- set allPosts = search.pages("type=post", "date=desc") }}
{{- set postsByYear = allPosts.reduce((acc, post) => {
  const year = new Date(post.date).getFullYear();
  if (!acc[year]) {
    acc[year] = [];
  }
  acc[year].push(post);
  return acc;
}, {}) }}
{{- set sortedYears = Object.keys(postsByYear).sort((a, b) => b - a) }}
{{- for year of sortedYears }}
  <h2 id="y{{year}}">{{ year }}</h2>
  <ul>
  {{- set posts = postsByYear[year] }}
  {{- for post of posts }}
    <li>
      <time datetime="{{ post.date |> date('DATE') }}">{{ post.date |> date("dd MMM") }}</time>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {{- /for }}
  </ul>
{{- /for }}
</section>
```

## Archive by Tag

The approach for the tag archive is similar. The structure of the template remains the same, but the implementation differs slightly.

Here's the original Hugo template:

```md
    {{ range $name, $taxonomy := .Site.Taxonomies.tags }}
     <h2 id="{{ $name | urlize }}">{{ $name }}</h2>
     <ul>
     {{ range $taxonomy }}
     <li>
         {{.Date.Format "2006-01-02"}} | <a href="{{.RelPermalink}}">{{.Title}}</a>
     </li>
     {{ end }}
     </ul>
    {{ end }}
```

Hugo's taxonomy feature was essential here.

Lume's search feature should allow a similar implementation:

```md
{{> console.log(search.values("tags")) }}
```

This command displays the list of tags in the console. We can then build the tag archive using a similar structure to the date archive:

```md
{{- for tag of search.values("tags").sort() }}
  <h2 id="{{ tag }}">{{ tag}}</h2>
  <ul>
  {{- for post of search.pages(tag, "date=desc") }}
    <li>
      <time datetime="{{ post.date |> date('DATE') }}">{{ post.date |> date('DATE') }}</time>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {{- /for }}
  </ul>
{{- /for }}
```

And that's it, two more templates down. 🎉
