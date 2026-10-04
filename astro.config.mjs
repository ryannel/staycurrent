import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://staycurrent.dev',
  trailingSlash: 'always',
  build: { format: 'directory' },
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
  },
});
