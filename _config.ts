import { Page } from "lume/core/file.ts";
import lume from "lume/mod.ts";
import attributes from "lume/plugins/attributes.ts";
import code_highlight from "lume/plugins/code_highlight.ts";
import date from "lume/plugins/date.ts";
import favicon from "lume/plugins/favicon.ts";
import feed from "lume/plugins/feed.ts";
import metas from "lume/plugins/metas.ts";
import nav from "lume/plugins/nav.ts";
import resolve_urls from "lume/plugins/resolve_urls.ts";
import sass from "lume/plugins/sass.ts";
import sitemap from "lume/plugins/sitemap.ts";
import slugify_urls from "lume/plugins/slugify_urls.ts";
import source_maps from "lume/plugins/source_maps.ts";
import toc from "https://deno.land/x/lume_markdown_plugins@v0.7.0/toc.ts";
import { stripHtml } from "https://deno.land/x/core@0.1.9/mod.ts";

import anchor from "npm:markdown-it-anchor";
import footnote from "npm:markdown-it-footnote";
import callouts from "npm:markdown-it-obsidian-callouts";
import { markdownItAttrs, markdownItDeflist } from "lume/deps/markdown_it.ts";

const markdown = {
    options: {
        breaks: false,
        linkify: true,
        xhtmlOut: true,
        html: true,
    }, plugins: [
        markdownItAttrs,
        markdownItDeflist,
        callouts,
        [anchor, {
            level: 2,
            permalink: anchor.permalink.linkAfterHeader({
                style: 'visually-hidden',
                assistiveText: _ => 'Permalink',
                visuallyHiddenClass: 'invisible',
                wrapper: ['<header>', '\n</header>']
              }),
            slugify: slHelperSlugify,
        }],
        footnote,
    ]
};

const site = lume({
    src: "site",
    dest: "public",
    prettyUrls: false,
    location: new URL("https://www.ebullient.dev")
}, { markdown });

site.use(attributes())
    .use(code_highlight())
    .use(date())
    .use(toc())
    //.use(favicon())
    .use(feed({
        output: ["/index.rss", "/index.json"],
        query: "type=post",
        info: {
          title: "ebullient·works",
          description: "Nothing poetic here, just a collection of things. Some are \"how I did this so I can remember later\", others are \"this is totally cool!\", and some are something else entirely.",
          published: new Date()
        },
        items: {
          title: "=title",
          description: "=description",
          published: "=date",
        },
    }))
    .use(metas())
    .use(nav())
    .use(resolve_urls())
    .use(sass({
        includes: "_includes/scss",
    }))
    .use(sitemap({
        sort: "url=desc",
        // only include things that are not redirects
        query: "target=undefined"
    }))
    .use(slugify_urls({
        lowercase: false, // Converts all characters to lowercase
        replace: {
            "&": "and",
            "@": "",
        },
    }))
    .use(source_maps());

// Copy the content of "static" directory to the root of your site
site.copy("static", "/");
site.mergeKey("cssclasses", "stringArray");

site.ignore((path) => {
    return path.startsWith('/projects/') && !path.startsWith('/projects/index'); // included by default
});

const mdValue = site.renderer.helpers.get('md');
const md = mdValue ? mdValue[0] : (text: string) => text;

const slValue = site.renderer.helpers.get('slugify');
const slHelper = slValue ? slValue[0] : (text: string) => text;
function slHelperSlugify(s: string) {
    return slHelper(s).toLowerCase();
}

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

// Update URLs and Dates for posts (third parameter)
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

function shortcodes(result: string): string {
    const now = new Date();
    // 's' spans newline characters; 'g' to match all
    const embedRegex = /{{<\s*\/?\s*embed\s*?>}}/g;
    const figureRegex = /{{<\s*figure\s+(.*?)\s*>}}/gs;
    const ghcardRegex = /{{<\s*gh_card "([^"]+)"\s*>}}/g;
    const gistRegex = /{{<\s*gist ([^\s]+)\s+([^\s]+)\s+([^\s>]+)?\s*>}}/g;
    const pdfRegex = /{{<\s*pdf "([^"]+)"\s*>}}/g;
    const skillBlockRegex = /{{<\s*skill\s+(.*?)\s*>}}/gs;
    const tweetRegex = /{{<\s*tweet\s+(.*?)\s*>}}/gs;
    const youtubeRegex = /{{<\s*youtube ([\w\d-]+)\s*>}}/g;

    // Hacky, but handle Hugo shortcodes here
    // SKILLS
    result = result.replace(skillBlockRegex, (_, skills) => {
        const skillData = extractAttributes(skills);
        const start = parseInt(skillData.start);
        const end = skillData.end && skillData.end !== 'current' ? parseInt(skillData.end) : now.getFullYear();
        const howMany = end - start;
        let inner = '\n<tr class="bullet">\n<td>';
        inner += skillData.url
            ? `<a href="${skillData.url}">${skillData.name}</a>`
            : skillData.name;
        inner += withValue('\n<span class="version">(', skillData.version, ')</span>');
        inner += withValue('\n<br />&nbsp;&nbsp;<span class="details">', skillData.details, '</span>');
        inner += '</td>\n<td class="duration">';
        if (howMany > 0) {
            inner += `${howMany} year${howMany > 1 ? 's' : ''}`;
        } else {
            inner += 'less than a year';
        }
        if (start !== now.getFullYear()) {
            inner += `<br />\n<small>(${start}-${end})</small>`
        }
        inner += '</td>\n</tr>';
        return inner;
    });
    // EMBED
    result = result.replace(embedRegex, (match) => {
        return match.includes('/')
            ? '</div>'
            : '<div class="embed-container">';
    });
    // GITHUB CARD
    result = result.replace(ghcardRegex, (_, data) => {
        return `
<div class="github-card" data-github="${data}" data-width="400" data-height="" data-theme="default"></div>
<script src="//cdn.jsdelivr.net/github-cards/latest/widget.js"></script>
        `.trim();
    });
    // GIST
    result = result.replace(gistRegex, (_, user, gist, file) => {
        return `
        <script src="https://gist.github.com/${user}/${gist}.js${withValue('?file=', file, '')}"></script>
        `.trim();
    });
    // PDF embed
    result = result.replace(pdfRegex, (_, url) => {
        return `<div class="embed-container"><iframe src="${url}" width="100%" height="480"></iframe></div>`;
    });
    // Tweet embed
    result = result.replace(tweetRegex, (_, data) => {
        const tweetData = extractAttributes(data);
        const url = `https://twitter.com/${tweetData.user}/status/${tweetData.id}`;
        return `<div class="embed-container"><a href="${url}" rel="external"><img src="/images/twitter-${tweetData.id}.png" /></a></div>`;
    });
    // Youtube embed
    result = result.replace(youtubeRegex, (_, id) => {
        return `<div class="embed-container"><div class="embed video-player"><iframe name="${id}"  class="youtube-player" frameborder="0" allowfullscreen allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" src="https://www.youtube.com/embed/${id}"></iframe></div></div>`;
    });
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
    return result;
}

site.filter("htmlAttr", (value: string) => value.replace(/"/g, '&quot;'));

function ifValue(value: string, text: string): string {
    return value
        ? `${text}`
        : '';
}

function withValue(prefix: string, value: string, suffix: string): string {
    return value
        ? `${prefix}${value}${suffix}`
        : '';
}

function extractAttributes(input: string): Record<string, any> {
    const attributeRegex = /(\w+)="([^"]+)"/g;
    const matches = input.replace(/\s*\n\s*/g, ' ').matchAll(attributeRegex);
    const attributeData: Record<string, any> = {};
    for (const match of matches) {
        attributeData[match[1]] = match[2];
    }
    return attributeData;
}

export default site;
