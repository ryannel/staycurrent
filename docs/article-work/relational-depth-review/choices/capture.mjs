import { chromium } from '/private/tmp/staycurrent-browser/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const output = new URL('./visual/', import.meta.url);
await mkdir(output, { recursive: true });
const results = [];
try {
  for (const [slug, selector] of [
    ['access-control', '[aria-label="How permissive and restrictive row policies combine"]'],
    ['adding-another-system', '.outbox-sequence'],
    ['product-comparison', '[aria-label="Two ordinary reads with another committed insert between them"]'],
  ]) {
    for (const width of [390, 1280]) for (const theme of ['light', 'dark']) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: theme, deviceScaleFactor: 1 });
      const errors = [];
      page.on('pageerror', error => errors.push(String(error)));
      const response = await page.goto(`http://127.0.0.1:4330/learn/databases/relational/${slug}/`, { waitUntil: 'networkidle' });
      await page.locator(selector).screenshot({ path: new URL(`${slug}-${width}-${theme}.png`, output).pathname });
      const dimensions = await page.evaluate(() => ({ viewport: innerWidth, page: document.documentElement.scrollWidth }));
      results.push({ slug, width, theme, status: response.status(), errors, ...dimensions });
      await page.close();
    }
  }
  await writeFile(new URL('./layout-observed.json', import.meta.url), JSON.stringify(results, null, 2) + '\n');
  console.log(JSON.stringify(results, null, 2));
} finally { await browser.close(); }
