import { chromium } from '/private/tmp/staycurrent-browser/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.env.REVIEW_URL || 'http://127.0.0.1:4331';
const browser = await chromium.launch({headless:true, executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const page = await browser.newPage();
const out = 'docs/article-work/drawing-systems/screenshots';
await mkdir(out,{recursive:true});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const report=[];
const slugs=process.argv.slice(2);
for(const slug of slugs.length?slugs:['index','architecture','processes','sequences','domains','states','whiteboarding','vocabulary','layout','maintaining']) {
 for(const width of [390,1280])for(const colorScheme of ['light','dark']) {
  await page.setViewportSize({width,height:900});await page.emulateMedia({colorScheme});
  const response=await page.goto(`${base}/learn/drawing-systems/${slug==='index'?'':slug+'/'}`);
  await page.locator('article img').evaluateAll(imgs=>Promise.all(imgs.map(i=>{i.loading='eager';return i.decode().catch(()=>{});})));
  const result=await page.evaluate(()=>({
   title:document.querySelector('h1')?.textContent,
   overflow:document.documentElement.scrollWidth>innerWidth,
   images:[...document.querySelectorAll('article img')].map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0,alt:!!i.alt})),
   badAnchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash),
   noindex:document.querySelector('meta[name="robots"]')?.content,
  }));
  report.push({slug,width,colorScheme,status:response.status(),...result});
  await page.screenshot({path:`${out}/${slug}-${width}-${colorScheme}.png`,fullPage:true});
 }
}
await writeFile('docs/article-work/drawing-systems/browser-verification.json',JSON.stringify({report,errors},null,2));
await browser.close();
const bad=report.filter(r=>r.status!==200||r.overflow||r.badAnchors.length||r.images.some(i=>!i.loaded||!i.alt)||!r.noindex);
console.log(JSON.stringify({views:report.length,failures:bad,errors},null,2));
if(bad.length||errors.length) process.exitCode=1;
