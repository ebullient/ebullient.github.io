import { format } from "lume/deps/date.ts";
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
import { stripHtml } from "https://deno.land/x/core@0.1.9/mod.ts";

import anchor from "npm:markdown-it-anchor";
import footnote from "npm:markdown-it-footnote";
import callouts from "npm:markdown-it-obsidian-callouts";
import { undefinedType } from "https://deno.land/std@0.210.0/yaml/_type/undefined.ts";
import { encodeUrl } from "https://deno.land/x/encodeurl@1.0.0/mod.ts";

const markdown = {
    options: {
        breaks: false,
        linkify: true,
        xhtmlOut: true,
        html: true,
    }, plugins: [
        callouts,
        [anchor, { level: 2 }],
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
    //.use(favicon())
    .use(feed())
    .use(metas())
    .use(nav())
    .use(resolve_urls())
    .use(sass({
        includes: "_includes/scss",
    }))
    .use(sitemap())
    .use(slugify_urls({
        replace: {
            "&": "and",
            "@": "",
        },
    }))
    .use(source_maps());

// Copy the content of "static" directory to the root of your site
site.copy("static", "/");

const ignore = ["node_modules", ".git", ".github", ".pandoc", "templates"];
site.ignore((path) => {
    if (path.startsWith("/projects") && ignore.some(segment => path.includes(segment))) {
        console.log(path);
        return true;
    }
    return false; // included by default
});

// Update URLs for posts (third parameter)
site.data("url", (page: Page) => {
    return page.data.url.replace("content/posts", format(page.data.date, "yyyy/MM/dd"));
}, "/content/posts");


const mdValue = site.renderer.helpers.get('md');
const md = mdValue ? mdValue[0] : (text: string) => text;

// Handle some older Hugo shortcodes here
site.preprocess([".md"], async (pages) => {
    // 's' spans newline characters; 'g' to match all
    const embedRegex = /{{<\s*\/?\s*embed\s*?>}}/g;
    const figureRegex = /{{<\s*figure\s+(.*?)\s*>}}/gs;
    const ghcardRegex = /{{<\s*gh_card "([^"]+)"\s*>}}/g;
    const gistRegex = /{{<\s*gist ([^\s]+)\s+([^\s]+)\s+([^\s>]+)?\s*>}}/g;
    const pdfRegex = /{{<\s*pdf "([^"]+)"\s*>}}/g;
    const skillBlockRegex = /{{<\s*skill\s+(.*?)\s*>}}/gs;
    const rawHtmlRegex = /{{<\s*\/?raw_html\s*>}}/g;
    const tweetRegex = /{{<\s*tweet\s+(.*?)\s*>}}/gs;
    const youtubeRegex = /{{<\s*youtube ([\w\d-]+)\s*>}}/g;

    const now = new Date();
    for(const page of pages) {
        if (typeof page.data.content !== "string") {
            continue;
        }
        let result = page.data.content as string;
        // Hacky, but handle Hugo shortcodes here
        // SKILLS
        result = result.replace(skillBlockRegex, (match, skills) => {
            const skillData = extractAttributes(skills);
            const start = parseInt(skillData.start);
            const end = skillData.end && skillData.end !== 'current' ? parseInt(skillData.end) : now.getFullYear();
            const howMany = end - start;
            let inner = '<tr class="bullet"><td>';
            inner += skillData.url
                ? `<a href="${skillData.url}">${skillData.name}</a>`
                : skillData.name;
            inner += withValue('<span class="version">(', skillData.version, ')</span>');
            inner += withValue('<br />&nbsp;&nbsp;<span class="version">[', skillData.details, ']</span>');
            inner += '</td><td class="duration">';
            if (howMany > 0) {
                inner += `${howMany} year${howMany > 1 ? 's' : ''}`;
            } else {
                inner += 'less than a year';
            }
            if (start !== now.getFullYear()) {
                inner += `<br /><small>(${start}-${end})</small>`
            }
            inner += '</td></tr>';
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
        result = result.replace(gistRegex, (match, user, gist, file) => {
            return `
            <script src="https://gist.github.com/${user}/${gist}.js${withValue('?file=', file, '')}"></script>
            `.trim();
        });
        // RAW_HTML: allowed in Lume, remove
        result = result.replace(rawHtmlRegex, (_) => {
            return '';
        });
        // PDF embed
        result = result.replace(pdfRegex, (_, url) => {
            return `<div class="embed-container"><iframe src="${url}" width="100%" height="480"></iframe></div>`;
        });
        // Youtube embed
        result = result.replace(youtubeRegex, (_, id) => {
            return `<div class="embed video-player"><iframe name="${id}"  class="youtube-player" frameborder="0" allowfullscreen allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" src="https://www.youtube.com/embed/${id}"></iframe></div>`;
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

        // Async fetch: Find all tweet shortcodes
        const tweets = Array.from(result.matchAll(tweetRegex));
        // Fetch tweet content for each shortcode
        const tweetContents = await Promise.all(tweets.map(async ([_, data]) => {
            const attr = extractAttributes(data);
            const url = `https://twitter.com/${attr.user}/status/${attr.id}`;

            const response = await fetch(`https://publish.twitter.com/oembed?dnt=true&url=${encodeUrl(url)}`);
            const tweetData = JSON.parse(await response.text());
            return tweetData.html
                ? tweetData.html
                : `<img src="/images/twitter-${attr.id}.png" />`;
        }));

        // Replace each tweet shortcode with its content
        result = tweets.reduce((result, [match], i) => result.replace(match, tweetContents[i]), result);


        page.data.content = result;
    }
});

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
