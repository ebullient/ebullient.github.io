---
title: Moving from Hugo to Lume (1, base template)
tags:
  - lume
  - blog
  - hugo
description: Part one of migration from Hugo to Lume, starting with general file conversion and reconstructing the base template.
keywords:
  - lume
---

I've decided to move my blog from [Hugo](https://gohugo.io/) to [Lume](https://lume.land/). As noted in [my previous post](./2023-12-30-ssg-with-obsidian-and-lume.md), I've been using Hugo for a while, and it's been pretty great! But putting together made me realize how many small friction points there are. I also want to embed the documentation for some of my projects in the site, and (based on an experiment), I think that will be much easier to do with Lume.

This will be a multi-step process, and I'll document it as I go. I'm starting with the base template, and will work my way through the rest of the site.

<!--more-->

My favorite kind of refactoring (or cleaning my office, for that matter) is to dump everything on the floor to start with a clean slate, and then put things back together. So that's what I'm going to do here.

## Backup Hugo config

1. Create a `hugo` directory (or `old` or `backup` or whatever).
2. Move `site` and other supporting directories into that folder.

## Set up a new `site` for Lume

Create a new `site` directory with the following subdirectories:

1. `_data`
2. `_includes`
3. `_includes/layouts`
4. `_includes/scss`
5. `assets`
6. `projects`

## Move content from the Hugo folder into the Lume structure

1. Move `hugo/site/content` to `site/content`[^1].
2. Move `hugo/site/static` to `site/static`[^1].
3. For SCSS files:
    - Move `hugo/site/assets/css/blog.scss` into `site/assets/`.
    - Move `hugo/site/assets/css/*.scss` into `site/_includes/scss`.

[^1]: I know, I know. I could have just kept them where they were to begin with. But in the spirit of "dumping everything on the floor and starting clean", it was useful to have the clean site directory, and then to put things back in where I wanted them. I could also copy the content to keep a backup in case I broke something, but that's what git is for.

## Creating Lume layouts with Vento

The syntax and functionality differ between Hugo and Lume templating engines. I prefer Vento for its simplicity, although other engines can be used if necessary.

In `site/_includes/layouts`, create empty layout files:

- `base.vto`
- `index-date.vto`
- `index-tag.vto`
- `page.vto`
- `post.vto`
- `skills.vto`

Fill in the contents of everything except `base.vto` with the following Vento code:

```md
---
layout: layouts/base.vto
---
{{ content }}
```

Update `layout:` lines in existing content to reference the new layouts, e.g., `layout: layouts/post.vto`.

## Reconstruct the base template

Let's open `site/_includes/layouts/base.vto` and start migrating the base template to get the main elements of the page back in place.

Rather than copy and paste the template w/ keys I have to fix, I sarted with the bare-bones structure common to both Hugo and Lume (and any other semantic HTML page):

```md
<!DOCTYPE html>
<html lang="en-us">
<head>
</head>
<body>
  <header>
  </header>
  <main>
  </main>
  <footer>
  </footer>
</body>
</html>
```

When I looked between the two templates, I noticed that my Hugo template included a div around the header and main elements (easy to add back). The header and footer were mostly copied verbatim from Hugo. I had to change a Hugo date reference: `{{ now.Format "2006"}}` with a Vento function: `{{ new Date().getFullYear() }}`.

I added a `cssclasses` variable (a convention from Obsidian that is now baked into my brain) to the main element for page-specific styling:

```md
<main {{ if page.data.cssclasses }} class="{{ page.data.cssclasses  |> join(' ') }}"{{ /if }}>
  {{ content -}}
</main>
```

The page head required adaptations for inline styles and scripts, and changes in template syntax for titles and meta tags.

For CSS, Lume directly pulls in the file:

```md
<link rel="stylesheet" href="/assets/css/blog.css">
```

Canonical URLs handling was also adjusted for Vento syntax:

```md
<link rel="canonical" href="{{ (page.data.canonical ? page.data.canonical : page.data.url) |> url(true) }}" />
```

After starting the live server (`deno task serve`), the canonical links rendered correctly, though they will resolve with the correct target when the site is built, provided there's a [location set in your config file](https://lume.land/docs/configuration/config-file/#location).

## Closing note

As a final recommendation for Part 1, consider using the [metas plugin](https://lume.land/plugins/metas/) for SEO optimizations. Site-wide defaults can be set in a `_data/metas.yaml` file to minimize individual page configurations.
