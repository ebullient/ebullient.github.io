---
tags:
- hugo
- blog
- asciidoc
title: Hugo with markdown and asciidoc
---
All done!

Building on [the previous post]({{< relref "2020-01-08-from-jekyll-and-gitbook-to-hugo-and-asciidoc-care-of-github-actions" >}}), here is a summary of what I had to do to collapse two sites (one a date-oriented blog, and the other an outline-based gitbook) into a single site.

<!--more-->

I loathe maintaining dates inside of files. As a customization, hugo is configured to lift the date from the file name first, then git data, and only after those two have been tried will it fall back to dates in the file header:

```yaml
frontmatter:
  date:
    - ":filename"
    - ":git"
    - ":default"
```

The permalink structure for blog posts is also explicitly configured to match the URL pattern used by Jekyll:

```yaml
permalinks:
  posts: /:year/:month/:day/:slug
```

To preserve previous links, I'm also using ugly URLs!

```yaml
uglyURLs: true
```

I am also generally unbothered about having a `.html` extension on pages. These are static html files after all. This does require index files to fix top-level section behavior, as described below.

I almost never use pre-defined themes. Call me picky, or whatever, but I prefer defining resources that behave the way I want them to. For hugo, this means creating layouts and supporting files.

## Blog posts / markdown

For the blog, I used a "posts" layout. Which means the header for blog entries minimally contains the following:

```yaml
---
layout: post
title: ...
author: ...
---
```

Specifying the layout in this way tells hugo to look for files in `layouts/posts`. I have two files defined there, one for the list of blog entries ([list.html](https://github.com/gameontext/gameontext-docs/blob/to-hugo/site/layouts/posts/list.html)), and one for each entry ([post.html](https://github.com/gameontext/gameontext-docs/blob/to-hugo/site/layouts/posts/post.html)). The contents for these two templates are pretty standard fare, and take advantage of hugo's support for sections to create navigation between posts. This allows the date-based URL space to remain distinct from the book pages.

The posts directory contains an `_index.md` file that assigns the list of blog posts to the `/blog/` path:

```yaml
---
title: "Blog: Events and other (mis-)adventures"
url: "/blog/"
---
```

## GitBook / asciidoc

Managing book pages was a little more challenging. The book sprawled across multiple directories as a hierarchy of topics. The gitbook display format also included a TOC along the left side, which I was going to need to emulate one way or the other.

In this case, I opted to define a type:

```yaml
---
title: ...
weight: 1
type: book
---
```

The default sorting mechanism in hugo uses the page weight first. By explicitly specifying the weight, I can control the order of the pages in the book, which is tiresome, but also exactly what I want.

This yaml metadata needs to be present at the top of all files, both section indexes and asciidoc content. The type similarly instructs hugo to look for layout pages in a `book` subdirectory, for either [lists](https://github.com/gameontext/gameontext-docs/blob/to-hugo/site/layouts/book/list.html) or individual [pages](https://github.com/gameontext/gameontext-docs/blob/to-hugo/site/layouts/book/single.html).

Navigation was a real challenge, as links within a section weren't going to be enough.

For list pages, I ended up with a layout that would either use a [partial](https://github.com/gameontext/gameontext-docs/blob/to-hugo/site/layouts/partials/section-index.html) to recursively list all content (used by the `/about/` section), or would list all the pages in the current section followed by a list of all top-level sections including subsections of the current section. Sounds complicated, and it kind of is, but it provides reasonable navigavtion between sections, and that's important.

Navigation for pages was also laborious. I created another [partial](https://github.com/gameontext/gameontext-docs/blob/to-hugo/site/layouts/partials/prevnext-section.html) to navigate to the previous or next page in the current section. If there wasn't a previous or next page in the section, it links to the previous or next section instead.

Both of the partials use `.Scratch` to propagate context between scopes. Somewhat annoyingly previous and next were inverted. I could have gone back and adjusted all the page weights so the pages sorted into reverse order, or just flipped the link. Numbering from 1 to whatever makes more sense, so I flipped the links. I am sure this will confuse future me at some point.

Anyway, maybe someone will find all of that cleverness useful.
