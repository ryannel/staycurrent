// Levels for the site check. "error" fails `pnpm build`; "warn" reports;
// "off" skips. A new rule starts at "warn" while existing pages are brought
// into line; raise it to "error" once every page passes it.
export default {
  dist: 'dist',
  // Built files that aren't site pages.
  skip: ['/pagefind/', '/images/'],
  rules: {
    'single-h1': 'error',
    'heading-levels': 'error',
    'duplicate-ids': 'error',
    'image-alt': 'error',
    'internal-links': ['error', { ignorePrefixes: ['/pagefind/'] }],
    'no-heading-in-figure': 'error',
    'title-line': 'error',
    'contents-after-opening': ['error', { minSections: 3 }],
    // "Model notes" say what an interactive model simplifies; onward reading is
    // a list of what to read or try next, not sources.
    'sources-section': ['error', { headings: ['Sources and further reading', 'Sources and model notes'], onward: ['Further reading'] }],
    'figure-labels': 'error',
    'raw-colour': 'error',
    'viewport-width': 'error',
    'css-balanced': 'error',
  },
  // Pages a rule deliberately doesn't apply to, with the reason.
  exceptions: {
    // 'sources-section': { '/learn/example/': 'why this page is different' },
  },
};
