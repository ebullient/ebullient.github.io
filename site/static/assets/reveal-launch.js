globalThis._initSlides = () => {
  const revealConfig = document.getElementById('internalConfig');
  const controls = revealConfig.getAttribute('data-controls') || 'false';
  const center = revealConfig.getAttribute('data-center') || 'true';
  const history = revealConfig.getAttribute('data-history') || 'false';
  const progress = revealConfig.getAttribute('data-progress') || 'false';
  const transition = revealConfig.getAttribute('data-transition') || 'fade';

  Reveal.initialize({
    embedded : false,
    width: 960, // aspect ratio
    height: 700,  // aspect ratio
    controls, center, history, progress, transition,
    markdown: {
      gfm: true,
      mangle: true,
      pedantic: false,
      smartLists: false,
      smartypants: false,
    },
    plugins: [ RevealMarkdown, RevealHighlight, RevealNotes ]
  }).then(() => {
    console.log("Reveal.js started")
  });
};
parent.postMessage('ready');