// Rendered evidence for the draft collection; run while its preview is available.
import { chromium } from '/Users/ryannel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const work = 'docs/article-work/application-caching-2026-10-28';
const base = process.env.CACHE_PREVIEW_URL || 'http://127.0.0.1:4326';
const selected = process.argv.slice(2);
const keys = (await readdir('src/articles/application-caching')).filter(f => f.endsWith('.meta.json')).map(f => f.replace('.meta.json', '')).filter(key => !selected.length || selected.includes(key));
await mkdir(`${work}/screens`, { recursive: true });
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const report = { base, capturedAt: new Date().toISOString(), sources: {}, pages: [], errors: [] };
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  page.on('pageerror', error => report.errors.push({ url: page.url(), message: error.message }));
  for (const key of keys) {
    report.sources[key] = createHash('sha256').update(await readFile(`src/articles/application-caching/${key}.astro`)).digest('hex');
    for (const width of [1280, 375]) for (const theme of ['light', 'dark']) {
      await page.setViewportSize({ width, height: 960 });
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
      await page.addInitScript(value => localStorage.setItem('staycurrent-theme', value), theme);
      const response = await page.goto(`${base}/review/application-caching/${key === 'index' ? '' : key + '/'}`);
      await page.evaluate(value => document.documentElement.setAttribute('data-theme', value), theme);
      await page.locator('article h1').waitFor();
      const state = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        h1: document.querySelectorAll('h1').length,
        noindex: !!document.querySelector('meta[name="robots"][content*="noindex"]'),
        kind: document.querySelector('meta[data-pagefind-meta="kind[content]"]')?.content,
        theme: document.documentElement.getAttribute('data-theme'),
        headings: [...document.querySelectorAll('article h2')].map(h => h.textContent.trim()),
        links: [...document.querySelectorAll('article a[href]')].map(a => a.getAttribute('href')),
        controls: [...document.querySelectorAll('article button, article input, article select')].map(el => ({ tag: el.tagName, type: el.getAttribute('type'), text: el.textContent.trim(), label: el.getAttribute('aria-label'), id: el.id })),
      }));
      await page.screenshot({ path: `${work}/screens/${key}-${width}-${theme}-opening.png` });
      const figures = page.locator('article figure');
      const figureCount = await figures.count();
      for (let i = 0; i < figureCount; i++) {
        await figures.nth(i).scrollIntoViewIfNeeded();
        await figures.nth(i).screenshot({ path: `${work}/screens/${key}-${width}-${theme}-figure-${i + 1}.png` });
      }
      report.pages.push({ key, width, theme, status: response.status(), figureCount, ...state });
    }
    console.log(`Captured ${key} at desktop/phone in both themes`);
  }
} finally { await browser.close(); }
await writeFile(`${work}/evidence/render-${selected.length ? selected.join('-') : 'collection'}.json`, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ pages: report.pages.length, errors: report.errors, overflow: report.pages.filter(p => p.overflow).map(p => [p.key, p.width, p.theme]) }));
