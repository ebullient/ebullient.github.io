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
    const prelimString="<body>RevealJS example</body>";
return `
<!-- based on hugo shortcode: https://github.com/vjeantet/hugo-theme-docdock/blob/master/layouts/shortcodes/revealjs.html -->
<div class="embed-container">
<iframe id="slideFrame" class="embed video-player" src="javascript:'${prelimString}'" srcdoc="${prelimString}"></iframe>
</div>

<div id="slideContent"
    data-controls="${options.controls}"
    data-center="${options.center}"
    data-history="${options.history}"
    data-progress="${options.progress}"
    data-transition="${options.transition}"
    data-theme="${options.theme}"
    data-highlight="${options.highlight}">
${options.innerContent.trim()}
</div>

<script src="/assets/reveal-iframe.js"></script>
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