import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const base = process.env.REVIEW_URL || 'http://localhost:4321';
const browser = await chromium.launch({ headless:true });
const page = await browser.newPage({ viewport:{width:390,height:844} });
const hash = value => createHash('sha256').update(value).digest('hex');
const paths = { indexes:['indexes/experiment.sql'], 'query-execution':['query-execution/setup.sql','query-execution/experiments.sql'], storage:[] };
const results = [];
for (const [slug, sources] of Object.entries(paths)) {
  await page.goto(`${base}/learn/databases/relational/${slug}/`);
  const links = await page.locator('article a[download]').evaluateAll(nodes => nodes.map(node => ({text:node.textContent,url:node.href})));
  const expected = await Promise.all(sources.map(async source => ({source,sha256:hash(await readFile(new URL(`../${source}`, import.meta.url)))})));
  const downloads = [];
  for (const link of links) {
    const response = await page.request.get(link.url);
    const sha256 = hash(await response.body());
    downloads.push({...link,status:response.status(),sha256,matchesSource:expected.find(item => item.sha256 === sha256)?.source || null});
  }
  const scroll = page.locator('article [tabindex="0"]').first();
  let keyboard = null;
  if (await scroll.count()) {
    await scroll.focus();
    const before = await scroll.evaluate(el => ({scrollLeft:el.scrollLeft,clientWidth:el.clientWidth,scrollWidth:el.scrollWidth,focused:document.activeElement===el,outline:getComputedStyle(el).outlineStyle}));
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(250);
    const after = await scroll.evaluate(el => el.scrollLeft);
    keyboard = {before,after,passed:before.focused && before.outline!=='none' && (before.scrollWidth<=before.clientWidth || after>before.scrollLeft)};
  }
  results.push({slug,downloads,expectedDownloads:expected.length,keyboard});
}
await page.goto(`${base}/articles/`);
const directory = {};
for (const slug of Object.keys(paths)) directory[slug] = await page.locator(`a[href="/learn/databases/relational/${slug}/"]`).count();
await browser.close();
const output={results,directory};
await writeFile(new URL('./reader-path.json',import.meta.url),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify(output,null,2));
if (results.some(row => row.downloads.length!==row.expectedDownloads || row.downloads.some(item=>item.status!==200||!item.matchesSource) || row.keyboard && !row.keyboard.passed) || Object.values(directory).some(n=>n<1)) process.exitCode=1;
