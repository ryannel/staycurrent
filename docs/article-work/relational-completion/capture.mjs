// Run after pnpm build; serve dist on REVIEW_URL. Outputs are review artifacts.
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '/private/tmp/staycurrent-browser/node_modules/playwright/index.mjs';
const slugs = process.argv.slice(2);
const base = process.env.REVIEW_URL || 'http://127.0.0.1:4326';
const out = process.env.REVIEW_OUTPUT || '/private/tmp/relational-completion-review';
await mkdir(out, { recursive:true });
const browser = await chromium.launch({headless:true, executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const report = [];
for (const slug of slugs) {
  const key = slug.replaceAll('/','-') || 'introduction';
  await mkdir(`${out}/${key}`, { recursive:true });
  for (const width of [390,1280]) for (const colorScheme of ['light','dark']) {
    const page = await browser.newPage({viewport:{width,height:900},colorScheme});
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const path = slug.startsWith('@') ? '/' + slug.slice(1).replace(/^\//, '') : `/learn/databases/relational/${slug ? slug+'/' : ''}`;
    const response = await page.goto(base+path);
    await page.locator('article').waitFor();
    for (const figure of await page.locator('article figure').all()) {
      await figure.scrollIntoViewIfNeeded();
      await figure.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode().catch(()=>{}))));
    }
    await page.screenshot({path:`${out}/${key}/${width}-${colorScheme}.png`,fullPage:true});
    const metrics = await page.evaluate(()=>({
      scrollWidth:document.documentElement.scrollWidth,width:innerWidth,
      failedImages:[...document.images].filter(img=>img.complete&&!img.naturalWidth).map(img=>img.src),
      title:document.querySelector('h1')?.textContent,
      noindex:document.querySelector('meta[name=robots]')?.content,
    }));
    report.push({slug,width,colorScheme,status:response.status(),errors,...metrics});
    if (width===1280 && colorScheme==='light') {
      const chunks = await page.locator('article').evaluate(article => {
        const pieces = [];
        for (const child of article.children) {
          if (['SCRIPT','STYLE'].includes(child.tagName)) continue;
          const copy = child.cloneNode(true);
          copy.querySelectorAll('script,style,noscript').forEach(el=>el.remove());
          copy.querySelectorAll('details:not([open])').forEach(el=>{
            const p=document.createElement('p');p.textContent=`[Optional closed disclosure: ${el.querySelector('summary')?.textContent}]`;el.replaceWith(p);
          });
          copy.querySelectorAll('tr').forEach(row=>{
            const p=document.createElement('p');p.textContent=[...row.children].map(c=>c.textContent.trim()).join(' | ');row.replaceWith(p);
          });
          copy.querySelectorAll('p,h1,h2,h3,h4,pre,li,figcaption').forEach(el=>el.append('\n\n'));
          pieces.push(copy.textContent.trim());
        }
        return pieces;
      });
      for(let i=0;i<chunks.length;i++) await writeFile(`${out}/${key}/${String(i).padStart(2,'0')}.txt`,chunks[i]);
      await writeFile(`${out}/${key}/manifest.json`,JSON.stringify(chunks.map((text,i)=>({file:`${String(i).padStart(2,'0')}.txt`,characters:text.length})),null,2));
      await writeFile(`${out}/${key}/optional.txt`,await page.locator('article details').allTextContents().then(x=>x.join('\n\n')));
    }
    await page.close();
  }
}
await browser.close();
await writeFile(`${out}/report.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify(report));
