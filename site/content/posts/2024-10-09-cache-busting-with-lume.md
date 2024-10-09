---
title: Cache Busting in Lume
description: "Implement cache busting in your Lume site using a simple custom plugin."
tags:
  - blog
  - lume
---
In this post, I'll show you how to implement cache busting in your [Lume](https://lume.land/) site using a custom plugin.

Cache busting is a technique used to force browsers to load the most recent version of a file by appending a hash to the file's URL.
This ensures that users always get the latest version of your assets, even if their browser has cached an older version.

<!--more-->

### Exprimental cache busting plugin

Lume provides an experimental cache busting plugin that you can find [here](https://github.com/lumeland/experimental-plugins/blob/main/cache_busting/mod.ts). This plugin appends a hash to the URLs of your assets, ensuring that they are always up-to-date.

### Defining and invoking the plugin

I created a local file (`site/_plugins/contentHash.ts`) for the plugin (code [below](#cache-busting-implementation)), and include it in my configuration in the usual way:

```typescript
import contentHash from "./site/_plugins/contentHash.ts";

site.use(contentHash({
    attribute: "data-hash",
}))
```

This configuration specifies that elements that should have hashes added to the url will have a `data-hash` attribute on them.

### Cache busting implementation

I cleaned up the experimental plugin a little bit.
Here's my code to generate content hashes and update the referencing URLs:

```typescript
import binaryLoader from "lume/core/loaders/binary.ts";
import { getPathAndExtension } from "lume/core/utils/path.ts";
import { merge } from "lume/core/utils/object.ts";
import { encodeHex } from "lume/deps/hex.ts";
import { posix } from "lume/deps/path.ts";
import modifyUrls from "lume/plugins/modify_urls.ts";
import { Page } from "lume/core/file.ts";

export interface Options {
    attribute: string;
    hashLength: number;
}

const defaults: Options = {
    attribute: "hash",
    hashLength: 10,
};

const cache = new Map<string, Promise<string>>();

export default function (userOptions?: Partial<Options>): Lume.Plugin {
    const options = merge(defaults, userOptions);

    // This is the entry point for the plugin
    // Note the plugin can now call methods on site just as you do in _config.ts
    return (site: Lume.Site) => {
        const selector = `[${options.attribute}]`;

        site.use(modifyUrls({ fn: replaceUrls }));

        async function replaceUrls(url: string, page: Page, element: Element) {
            if (url && element.matches(selector)) {
                return await addHashToUrl(url, page);
            }
            return url;
        }

        async function addHashToUrl(url: string, page: Page) {
            if (page.data.url && url.startsWith(".")) {
                url = posix.join(page.data.url, url);
            }
            url = posix.join("/", url);

            if (!cache.has(url)) {
                cache.set(url, generateHash(url));
            }

            const hash = await cache.get(url)!;
            const [path, ext] = getPathAndExtension(url);
            return `${path}-${hash}${ext}`;
        }

        async function generateHash(url: string) {
            const content = await fetchContent(url);
            const contentHash = await computeHash(content);
            updateFileUrl(url, contentHash);
            return contentHash;
        }

        async function fetchContent(url: string): Promise<Uint8Array> {
            const content = await site.getContent(url, binaryLoader);
            if (!content) {
                throw new Error(`Unable to find the file "${url}"`);
            }

            return typeof content === "string"
                    ? new TextEncoder().encode(content)
                    : content as Uint8Array;
        }

        function updateFileUrl(url: string, hash: string) {
            const [path, ext] = getPathAndExtension(url);
            const page = site.pages.find((page) => page.data.url === url);
            if (page) {
                page.data.url = `${path}-${hash}${ext}`;
                return;
            }

            const staticFile = site.files.find((file) => file.outputPath === url);
            if (staticFile) {
                staticFile.outputPath = `${path}-${hash}${ext}`;
                return;
            }

            throw new Error(`Unable to find the file "${url}"`);
        }

        async function computeHash(content: Uint8Array): Promise<string> {
            const hashBuffer = await crypto.subtle.digest("SHA-1", content);
            const hash = encodeHex(new Uint8Array(hashBuffer));
            return hash.substring(0, options.hashLength);
        }
    };
}
```

Feel free to experiment with the plugin and adjust the options to suit your needs.

Happy coding!