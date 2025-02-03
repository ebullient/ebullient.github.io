const menuSelector = 'input[type="checkbox"].menu-toggle';
globalThis.addEventListener("load", function() {
  const checkboxes = document.body.querySelectorAll(menuSelector);
  checkboxes.forEach((checkbox) => {
    const key = `menu-${checkbox.id}`;
    const savedState = localStorage.getItem(key);
    if (savedState !== null) {
      checkbox.checked = savedState === 'true';
    }
    checkbox.addEventListener('change', function (e) {
      localStorage.setItem(key, e.currentTarget.checked);
    });
  });
});