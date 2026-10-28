import { chromium } from '/Users/ryannel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';
const out = '/private/tmp/application-caching-references';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  for (const name of ['sequences', 'indexes', 'storage']) {
    await page.goto(`http://127.0.0.1:4326/review/examples/${name}/`);
    await page.screenshot({ path: `${out}/${name}-opening.png` });
    const figures = page.locator('article figure');
    for (const i of [0, 1, 2, 4]) {
      if (i >= await figures.count()) continue;
      await figures.nth(i).screenshot({ path: `${out}/${name}-figure-${i + 1}.png` });
    }
    console.log(name, await figures.count(), 'figures captured in', out);
  }
} finally { await browser.close(); }
