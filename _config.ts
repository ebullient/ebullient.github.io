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

import anchor from "npm:markdown-it-anchor";
import footnote from "npm:markdown-it-footnote";
import callouts from "npm:markdown-it-obsidian-callouts";

const markdown = {
    options: {
        breaks: false,
        linkify: true,
        xhtmlOut: true
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

export default site;
