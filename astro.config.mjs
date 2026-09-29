import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://staycurrent.dev',
  trailingSlash: 'always',
  build: { format: 'directory' },
  markdown: {
    // Mermaid fences are rendered in the browser (see src/components/Mermaid.astro);
    // leave the source untouched so the script can find it.
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid'] },
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
  },
});
