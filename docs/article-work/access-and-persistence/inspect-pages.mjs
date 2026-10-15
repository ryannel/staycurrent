// Serve dist locally first. PLAYWRIGHT_MODULE may point to an existing installation.
import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
const moduleName = process.env.PLAYWRIGHT_MODULE;
const { chromium } = await import(moduleName ? pathToFileURL(moduleName).href : 'playwright');
const base = process.env.REVIEW_URL || 'http://localhost:4321';
const out = new URL(`./${process.env.REVIEW_OUTPUT || 'browser'}/`, import.meta.url);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
for (const slug of ['indexes', 'query-execution', 'storage']) {
  for (const width of [390, 1280]) for (const colorScheme of ['light', 'dark']) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(`${base}/learn/databases/relational/${slug}/`);
    await page.locator('article').waitFor();
    const figures = page.locator('article figure');
    for (let i = 0; i < await figures.count(); i++) {
      const figure = figures.nth(i);
      await figure.scrollIntoViewIfNeeded();
      await figure.locator('img').evaluateAll(imgs => Promise.all(imgs.map(img => img.decode().catch(() => {}))));
      await figure.screenshot({ path: new URL(`${slug}-${width}-${colorScheme}-figure-${i + 1}.png`, out).pathname });
    }
    const metrics = await page.evaluate(() => ({
      width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
      failedImages: [...document.images].filter(img => img.complete && !img.naturalWidth).map(img => img.src),
      title: document.querySelector('h1')?.textContent,
      noindex: document.querySelector('meta[name="robots"]')?.content,
      controls: [...document.querySelectorAll('article button, article select, article input')].map(el => ({ tag: el.tagName, text: el.textContent, label: el.getAttribute('aria-label'), type: el.getAttribute('type') })),
    }));
    results.push({ slug, width, colorScheme, status: response.status(), errors, ...metrics });
    if (width === 1280 && colorScheme === 'light') {
      const chunks = await page.locator('article').evaluate(article => {
        function text(el) {
          const copy = el.cloneNode(true);
          copy.querySelectorAll('script,style,noscript').forEach(node => node.remove());
          copy.querySelectorAll('details').forEach(detail => {
            const note = document.createElement('p');
            note.textContent = `[Optional disclosure, closed by default: ${detail.querySelector('summary')?.textContent}]`;
            detail.replaceWith(note);
          });
          copy.querySelectorAll('table').forEach(table => {
            const rendered = document.createElement('pre');
            rendered.textContent = '\n' + (table.querySelector('caption')?.textContent || '') + '\n' +
              [...table.querySelectorAll('tr')].map(row => [...row.querySelectorAll('th,td')].map(cell => cell.textContent.trim()).join(' | ')).join('\n') + '\n';
            table.replaceWith(rendered);
          });
          copy.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
          copy.querySelectorAll('h1,h2,h3,h4,p,li,div,dt,dd,figcaption,pre').forEach(block => block.append('\n'));
          return copy.textContent.replace(/\n[ \t]+/g, '\n').trim();
        }
        return [...article.children].filter(el => !['SCRIPT','STYLE'].includes(el.tagName)).map((el, index) => ({ index, tag: el.tagName, id: el.id, text: text(el) }));
      });
      await writeFile(new URL(`${slug}-reading.json`, out), JSON.stringify(chunks, null, 2));
      const optional = await page.locator('article details').evaluateAll(nodes => nodes.map(node => ({ title: node.querySelector('summary')?.textContent, text: node.textContent })));
      await writeFile(new URL(`${slug}-optional.json`, out), JSON.stringify(optional, null, 2));
      await writeFile(new URL(`${slug}-rendered.html`, out), await page.locator('article').innerHTML());
    }
    await page.close();
  }
}
await browser.close();
await writeFile(new URL('layout.json', out), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
if (results.some(r => r.status !== 200 || r.errors.length || r.scrollWidth > r.width || r.failedImages.length)) process.exitCode = 1;
