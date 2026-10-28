import { articleTypes } from '../../src/lib/article-types.ts';

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
    // A companion's type reads "Companion to …".
    'title-line': ['error', { types: [...articleTypes] }],
    'contents-after-opening': ['error', { minSections: 3 }],
    'sources-section': ['error', { headings: ['Sources and further reading'] }],
    'figure-labels': 'error',
    'raw-colour': 'error',
    'viewport-width': 'error',
    'css-balanced': 'error',
    // Limits measured on human-written explainers; see the rule's header.
    'dense-prose': ['warn', { sentence: 45, paragraph: 33, paragraphWords: 90 }],
  },
  // Pages a rule deliberately doesn't apply to, with the reason.
  exceptions: {
    // 'sources-section': { '/learn/example/': 'why this page is different' },
  },
};
