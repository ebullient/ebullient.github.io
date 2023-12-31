---
title: SSG with Obsidian and Lume
tags:
  - obsidian
  - lume
  - blog
description: Static site generation with Lume and Obsidian
draft: false
keywords:
  - lume
  - obsidian
---

All tech has a cycle, including what we use to make our websites. I come back to this place every few years[^1], and it is always a ramble when I do.

I am setting up a new website for someone else, which has given me the lovely excuse to revisit this perennial topic. While not a developer, they are familiar with [Obsidian](#sidebar-obsidian) (and its markdown extensions). Messing around with Obsidian and themes has also lead to some familiarity with CSS, which is a bonus.

I have a few objectives for the exercise this time around: I want site content (blog posts, section pages) to be previewable and editable in Obsidian. For simplicity, I will start by publishing the whole vault (no filters other than the ubiquitous draft frontmatter flag). I am thinking most "pre-process" stuff (markdown file/link construction) can just be done with the Templater plugin.

[^1]: [Movable Type](https://movabletype.org/documentation/) (2002?) -> [Textpattern](https://textpattern.com/) (2005) -> [NucleusCMS](http://nucleuscms.org/) (2007) -> [Jekyll](https://jekyllrb.com/) (2017) -> [Hugo](https://gohugo.io/) (2020), and now [Lume](https://lume.land/).

<!--more-->

## From CMS to SSG

When I first started my own blog back in the stone ages, we all used a database-backed Content Management System (CMS). In hindsight, this was wild! We didn't have containers, we didn't have easy-to-use virtual machines, we didn't have easy-to-use cloud hosting. We had to install and configure a web server, a database server, and a scripting language (PHP, Perl, Python, Ruby, etc). We had to configure the CMS, and then we had to write our content in a web form. We had to worry about security updates and database backups. And we did this for fun!

Static site generators (SSG) keep your content in flat files. No database, no web form. You write your content in a text editor, and then you run a command to generate your website. You upload those generated files to a web server. With the advent of GitHub and GitHub Pages, this has a lot of appeal, as the whole thing can be automated: your blog post is committed to a source code repository, and continuous integration (CI) pipelines (like GitHub Actions or Netlify) can generate and deploy your website. Easy peasy.

## Current Tool - Hugo

My current blog tool of choice is [Hugo](https://gohugo.io/). It uses markdown (or [asciidoc](./2020-03-06-hugo-with-markdown-and-asciidoc.md)) files to generate a website. It is fast. It is mostly easy to use, but there are some sticky spots here where you need to go remember what a shortcode is and how it works.

Hugo is written in [Go](https://go.dev/), and you work with it as a single binary command, which is orders of magnitude easier to deal with than [Jekyll](https://jekyllrb.com/) [^2].

[^2]: The ruby ecosystem is a nightmare, I avoid it whenever possible.

## Sidebar: Obsidian

Unrelated to web/blog things, I have been using (and abusing) [Obsidian](https://obsidian.md/) for the past few years. It is plastic and fluid and it evolves with my brain; it is also changing how I create and work with notes. I am starting to find that I want to work with my blog in the same way I work with my notes. I'm not sure I would merge my blog into my Obsidian Vault, but if I have more control over how content works and is rendered, it's a possibility.

## Obsidian and Hugo

There are some great resources for getting Obsidian to work with Hugo. It is definitely a fan favorite. [Obsidian + Hugo = ❤️‍🔥](https://quantick.dev/posts/obsidian-hugo/) is a great starting place.

The virtual file overlay provided by Hugo module mounts allows you to keep all of the Hugo files outside of the vault. Other improvements, like markdown render hooks[^3], make it easier to work with plain markdown. That said, I've run into some edge cases where I've had to do some weird things to get the output I want. [URL behavior](https://github.com/gohugoio/hugo/issues/4428) is also starting to irritate me.

[^3]: [Markdown Render Hooks](https://gohugo.io/templates/render-hooks/) alter the behavior of markdown rendering. These hooks make it possible to use standard markdown syntax for content links, but there are caveats for [finding the right link target](https://www.veriphor.com/articles/link-and-image-render-hooks/) that make this a less trivial exercise than it may seem on the surface.

## Looking at Lume

Given some Hugo gotchas and my own frustration at my limited ability to tweak behavior, I am looking at [Lume](https://lume.land/), another static site generator. It is in a corner of the ecosystem I hadn't noticed before (it uses [Deno](https://deno.land/)).

Configuration has been straight-forward, and while I haven't tried to adapt some of my more byzantine site constructions yet, I've already found it easier to customize behavior.

### Obsidian and Lume

Lume uses [markdown-it](https://markdown-it.github.io/) for markdown parsing. There are a few plugins that already claim to add Obsidian capabilities that I haven't evaluated in full.

- <https://github.com/jsepia/markdown-it-wikilinks#readme> - Obsidian-style wiki links
- <https://github.com/alexjv89/markdown-it-obsidian#readme> - Convert Obsidian-style links to markdown links
- <https://github.com/uuanqin/markdown-it-obsidian-imgsize#readme> - use sizes in Obsidian image links

What I could not find was a plugin that would support Obsidian-style admonitions and callouts.

I did find some promising options:

- <https://github.com/antfu/markdown-it-github-alerts> - GitHub alerts as annotated blockquotes (closest)
- <https://github.com/commenthol/markdown-it-admon> - rST-style admonitions
- <https://github.com/docarys/markdown-it-admonition> - Docarys admonitions
- <https://github.com/mdit-plugins/mdit-plugins> - collection of plugins for markdown-it, including callout-style admonitions

I created [ebullient/markdown-it-obsidian-callouts](https://github.com/ebullient/markdown-it-obsidian-callouts) to handle both Obsidian callouts and code-block admonitions care of the Admonition plugin. It uses Obsidian default icons and callout flavors.
