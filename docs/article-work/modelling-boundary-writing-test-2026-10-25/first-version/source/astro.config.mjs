import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://staycurrent.dev',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
