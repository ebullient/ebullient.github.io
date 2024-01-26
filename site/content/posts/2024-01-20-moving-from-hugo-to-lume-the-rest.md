---
title: Moving from Hugo to Lume (3, formatting and shortcodes)
description: The final chapter in our series on migrating from Hugo to Lume, focusing on adapting existing content, including formatting quirks and Hugo shortcodes.
tags:
  - blog
  - hugo
  - lume
---
Welcome to the grand finale of our [Hugo](https://gohugo.io/) to [Lume](https://lume.land/) migration saga!
In [part 1](./2024-01-04-moving-from-hugo-to-lume-1-templates.md), we talked about motivations and initial setup. [Part 2](./2024-01-05-moving-from-hugo-to-lume-2-indexes.md) covered index generation. Now, we face the ultimate challenge: tackling the 'gorpy bits'—the formatting quirks and embedded Hugo shortcodes in our site's content.

<!--more-->

## URL Structures

My blog posts are organized using a date-based URL pattern.
I crafted a custom URL function in `_config.ts` to maintain this structure and
update the post date from the file name.

```ts
site.data("url", (page: Page) => {
    const dateRegex = /content\/posts\/(\d{4})-(\d{2})-(\d{2})-(.*)/;
    const match = page.src.path.match(dateRegex);
    if (match) {
        const [_, year, month, day, slug] = match;
        page.data.date.setFullYear(parseInt(year));
        page.data.date.setMonth(parseInt(month) - 1);
        page.data.date.setDate(parseInt(day));
        return `/${year}/${month}/${day}/${slug}.html`;
    }
    return page.data.url.replace("content/posts/", "");
}, "/content/posts");
```

## Shortcodes

My early blog posts were written in different content management systems that used their own markup syntax. When I moved from one system to another, I kept only the HTML-rendered post content so I wouldn't have to deal with markup conversion.

When I moved from Jekyll to Hugo, I had a problem. Hugo does not play as well with raw HTML in posts. I converted simpler posts to markdown, and created a `{{< raw_html >}}` shortcode to allow the inclusion of raw HTML for the rest.

My usage of
<code>&#123;{< raw_html >}}</code>, Hugo-specific shortcodes like
<code>&#123;{< figure >}}</code>,
<code>&#123;{< gh_card >}}</code>,
<code>&#123;{< gist >}}</code>,
<code>&#123;{< tweet >}}</code>, and
<code>&#123;{< youtube >}}</code>, along with other custom shortcodes I'd created for embedding content and performing date math, needed reevaluation.

I decided to port some of the shortcodes to typescript, and use a pre-processor to transform shortcode content.

You declare a pre-processor in `_config.ts` like this:

```ts
site.preprocess(['.md'], (pages) => {
    for(const page of pages) {
        if (typeof page.data.content !== "string") {
            continue;
        }
        if (page.src.path.startsWith('/content')) {
           page.data.content = shortcodes(page.data.content);
        }
    }
});
```

This snippet checks if page.data.content is a string (which excludes pages like my tag index, that only have frontmatter). Files in the `content` directory have their content transformed by the `shortcodes` function.

The shortcodes function is a bit of a beast. It looks for and replaces instances of each known shortcode with content constructed from the shortcode's attributes. Here's an example of the <code>&#123;{< figure >}}</code> shortcode:

```ts
function shortcodes(result: string): string {
  // ... 
    const figureRegex = /{{<\s*figure\s+(.*?)\s*>}}/gs;

    // figure
    result = result.replace(figureRegex, (_, data) => {
        const figureData = extractAttributes(data);
        const altText = stripHtml(md(figureData.alt || figureData.caption || figureData.title || ''));

        let inner = '';
        inner += `<figure${withValue(' class="', figureData.class, '"')}>`;
        if (figureData.link) {
            inner += `<a href="${figureData.link}"${withValue(' target="', figureData.target, '"')}${withValue(' rel="', figureData.rel, '"')}>`;
        }
        inner += `<img src="${figureData.src}"${withValue(' alt="', altText, '"')}${withValue(' width="', figureData.width, '"')}${withValue(' height="', figureData.height, '"')} />`
        ifValue(figureData.link, '</a>');

        if (figureData.title || figureData.caption || figureData.attr) {
            inner += `<figcaption>`;
            inner += withValue('<h4>', figureData.title, '</h4>');
            inner += md(figureData.caption || '');
            if (figureData.attr) {
                inner += withValue('<a href="', figureData.attrlink, '">');
                inner += md(figureData.attr);
                inner += ifValue(figureData.attrlink, '</a>');
            }
            inner += `</figcaption>`;
        }
        return inner;
    });
    // ...
    return result;
}
```

Functions like `withValue` and `ifValue` streamline this process. `withValue` concatenates strings if the second argument exists and isn't empty; otherwise, it returns an empty string. `ifValue` behaves similarly, joining its arguments if the first is defined, or returning an empty string.

I use another helper function `extractAttributes` to extract shortcode attributes:

```ts
function extractAttributes(input: string): Record<string, any> {
    const attributeRegex = /(\w+)="([^"]+)"/g;
    const matches = input.replace(/\s*\n\s*/g, ' ').matchAll(attributeRegex);
    const attributeData: Record<string, any> = {};
    for (const match of matches) {
        attributeData[match[1]] = match[2];
    }
    return attributeData;
}
```

With Lume's (and markdown-it's) ability to handle raw HTML, the `{{< raw_html >}}` shortcode became obsolete and was removed.

This migration to Lume ranks among the most seamless transitions I've ever undertaken.

Lume provides 'just enough' structure to guide content processing without overwhelming complexity.
The effort I spent on this transition was all focused on cleaning up my old messes, not on understanding how Lume works.

At the end of last year, I started integrating documentation for one of my projects into my website just to see how it would work (and if it was more readable in the end). It was a slog. What I wanted to do was not what Hugo wanted me to do. I made it work, but it was complicated and messy. I could throw all that mess away and pull in this content in a much more straightforward way with Lume.

Amazing. Super good. 10/10. Would recommend.