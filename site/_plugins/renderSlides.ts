export type RevealJsOptions = {
    controls: string | boolean;
    center: string | boolean;
    history: string | boolean;
    progress: string | boolean;
    transition: string;
    width: string;
    height: string;
    theme: string;
    highlight: string;
    innerContent: string;
}

function generateRevealContent(options: RevealJsOptions): string {
return `
<!-- based on hugo shortcode: https://github.com/vjeantet/hugo-theme-docdock/blob/master/layouts/shortcodes/revealjs.html -->
<iframe id="slideFrame" src="none.html" style="width:${options.width}; height:${options.height}; border:0px"></iframe>

<div id="slideContent">
    <link rel="stylesheet" href="/revealjs/dist/reveal.css">
    <link rel="stylesheet" href="/revealjs/dist/theme/${options.theme}.css" id="theme">
    <link rel="stylesheet" href="/revealjs/plugin/highlight/${options.highlight}.css">

    <div class="reveal">
        <div class="slides">
            <section data-markdown
                    data-separator="^---"
                    data-separator-vertical="^___"
                    data-separator-notes="^Note:"
                    data-charset="utf8">
                ${options.innerContent}
            </section>
        </div>
    </div>

    <script src="/revealjs/dist/reveal.js"></script>
    <script src="/revealjs/plugin/notes/notes.js"></script>
    <script src="/revealjs/plugin/markdown/markdown.js"></script>
    <script src="/revealjs/plugin/highlight/highlight.js"></script>
    <script src="/revealjs/plugin/zoom/zoom.js"></script>

    <script>
    function initSlides() {
        Reveal.initialize({
            embedded : true,

            controls: ${options.controls},
            center: ${options.center},
            history: ${options.history},
            progress: ${options.progress},
            transition: ${options.transition},

            plugins: [ RevealMarkdown, RevealHighlight, RevealNotes ]
        });
    }
    </script>
</div>

<p><a href="#" onclick="_slideFullScreen(
    ${options.controls || true},
    ${options.center || true},
    ${options.history || true},
    ${options.progress || true},
    ${options.transition || true});">See it fullscreen</a></p>
`;
}

export default function (): Lume.Plugin {
    return (site: Lume.Site) => {
        site.process([".html"], (pages) => {
            for (const page of pages) {
                if (page.data.revealjs) {
                    const content = page.content as string;
                    // replace the placeholder with revealjs content
                    page.content = content.replace('<!-- revealjs -->',
                        generateRevealContent(page.data.revealjs as RevealJsOptions)
                    );
                }
            }
        });
    };
};