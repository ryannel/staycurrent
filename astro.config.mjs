import { defineConfig } from 'astro/config';
import pagefind from 'astro-pagefind';

// https://astro.build/config
export default defineConfig({
  site: 'https://staycurrent.dev',
  trailingSlash: 'always',
  integrations: [pagefind({ indexConfig: { excludeSelectors: ['nav', '.essay-meta', 'button', 'input', 'select', 'textarea', 'svg'] } })],
  build: { format: 'directory' },
  vite: {
    optimizeDeps: { exclude: ['@electric-sql/pglite'] },
    worker: { format: 'es' },
  },
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
  },
});
