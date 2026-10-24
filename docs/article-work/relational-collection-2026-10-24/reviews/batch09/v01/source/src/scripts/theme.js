// Runs in the head so the saved theme is applied before the page is painted.
(() => {
  const key = 'staycurrent-theme';
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  const valid = value => ['system', 'dark', 'light'].includes(value) ? value : 'system';
  let preference = 'system';
  try { preference = valid(localStorage.getItem(key)); } catch {}

  function updatePicture(source) {
    if (!source.dataset.themeSource) {
      source.dataset.themeSource = source.media.includes('dark') ? 'dark' : 'light';
    }
    source.media = source.dataset.themeSource === root.dataset.theme ? 'all' : 'not all';
  }

  const sources = 'source[media*="prefers-color-scheme"], source[data-theme-source]';
  function apply() {
    const resolved = preference === 'system' ? (system.matches ? 'dark' : 'light') : preference;
    root.dataset.theme = resolved;
    root.dataset.themePreference = preference;
    root.style.colorScheme = resolved;
    document.querySelectorAll(sources).forEach(updatePicture);
    document.querySelectorAll('input[name="colour-theme"]').forEach(input => {
      input.checked = input.value === preference;
    });
  }
  apply();

  // Theme-aware picture sources can arrive as the rest of the document parses.
  const observer = new MutationObserver(records => {
    for (const record of records) for (const node of record.addedNodes) {
      if (!(node instanceof Element)) continue;
      if (node.matches(sources)) updatePicture(node);
      node.querySelectorAll(sources).forEach(updatePicture);
    }
  });
  observer.observe(root, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', () => {
    observer.disconnect();
    apply();
    document.querySelectorAll('[data-theme-switcher]').forEach(control => { control.hidden = false; });
  }, { once: true });
  document.addEventListener('change', event => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || input.name !== 'colour-theme') return;
    preference = valid(input.value);
    try {
      if (preference === 'system') localStorage.removeItem(key);
      else localStorage.setItem(key, preference);
    } catch {}
    apply();
  });
  system.addEventListener('change', () => { if (preference === 'system') apply(); });
  window.addEventListener('storage', event => {
    if (event.key !== key && event.key !== null) return;
    preference = valid(event.newValue);
    apply();
  });
})();
