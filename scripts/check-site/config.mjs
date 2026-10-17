// Levels for the site check. "error" fails `pnpm build`; "warn" reports;
// "off" skips. Every rule starts at "warn" while existing pages are brought
// into line; raise a rule to "error" once every page passes it.
export default {
  dist: 'dist',
  // Built files that aren't site pages.
  skip: ['/pagefind/', '/images/'],
  rules: {
    'single-h1': 'warn',
    'heading-levels': 'warn',
    'duplicate-ids': 'warn',
    'image-alt': 'warn',
    'internal-links': ['warn', { ignorePrefixes: ['/pagefind/'] }],
    'no-heading-in-figure': 'warn',
    'title-line': 'warn',
    'contents-after-opening': ['warn', { minSections: 3 }],
    'sources-section': ['warn', { heading: 'Sources and further reading' }],
    'figure-labels': 'warn',
    'raw-colour': 'warn',
    'viewport-width': 'warn',
  },
  // Pages a rule deliberately doesn't apply to, with the reason.
  exceptions: {
    // 'sources-section': { '/learn/example/': 'why this page is different' },
  },
};
