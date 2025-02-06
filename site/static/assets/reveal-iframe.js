let fullPresentation = '';
globalThis.addEventListener("DOMContentLoaded", () => {
  const contentEl = document.getElementById('slideContent');
  const controls = contentEl.getAttribute('data-controls') || 'false';
  const center = contentEl.getAttribute('data-center') || 'true';
  const history = contentEl.getAttribute('data-history') || 'false';
  const progress = contentEl.getAttribute('data-progress') || 'false';
  const transition = contentEl.getAttribute('data-transition') || 'fade';
  const theme = contentEl.getAttribute('data-theme') || 'black';
  const highlight = contentEl.getAttribute('data-highlight') || 'vs2015';
  const slideContent = contentEl.innerHTML;

  fullPresentation = `<html>
  <link rel="stylesheet" href="/revealjs/dist/reset.css">
  <link rel="stylesheet" href="/revealjs/dist/reveal.css">
  <link rel="stylesheet" href="/revealjs/css/slides-extended.css" />
  <link rel="stylesheet" href="/revealjs/dist/theme/${theme}.css" id="theme">
  <link rel="stylesheet" href="/revealjs/plugin/highlight/${highlight}.css">

  <span id="internalConfig" data-controls="${controls}"
    data-center="${center}"
    data-history="${history}"
    data-progress="${progress}"
    data-transition="${transition}" />

  <div class="reveal">
      <div class="slides">
          <section data-markdown
                  data-separator="^---"
                  data-separator-vertical="^___"
                  data-separator-notes="^Note:"
                  data-charset="utf8">
            <textarea data-template>
              ${slideContent}
            </textarea>
          </section>
      </div>
  </div>

  <script src="/revealjs/dist/reveal.js"></script>
  <script src="/revealjs/plugin/notes/notes.js"></script>
  <script src="/revealjs/plugin/markdown/markdown.js"></script>
  <script src="/revealjs/plugin/highlight/highlight.js"></script>
  <script src="/revealjs/plugin/zoom/zoom.js"></script>
  <script src="/assets/reveal-launch.js"></script>
  `;

  globalThis.addEventListener(
    "message",
    (event) => {
      if (event.data === 'ready') {
        contentWindow._initSlides();
      }
    },
    false,
  );

  const contentWindow = document.getElementById('slideFrame').contentWindow;
  contentWindow.document.write(fullPresentation);
});