import { chromium } from '/private/tmp/staycurrent-browser/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
const browser = await chromium.launch({headless:true,executablePath:'/Users/ryannel/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'});
const root='/Users/ryannel/Workspace/staycurrent/docs/article-work/deep-dives-batch';
const report=[];
for(const theme of ['light','dark']) for(const width of [1280,390]) {
 const context=await browser.newContext({viewport:{width,height:900},colorScheme:theme});
 const page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const [slug,selector] of [['','[id="collection"]'],['modelling/','rd-design-rules'],['query-results/','[data-query-work]'],['transaction-boundaries/','transaction-recovery-lab']]) {
  await page.goto('http://127.0.0.1:4322/learn/databases/relational/'+slug,{waitUntil:'networkidle'});
  const name=(slug.replace('/','')||'introduction')+'-'+theme+'-'+width;
  const overflow=await page.evaluate(()=>({page:document.documentElement.scrollWidth>innerWidth,elements:[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth+2&&getComputedStyle(e).position!=='absolute').slice(0,12).map(e=>({tag:e.tagName,class:e.className,width:e.getBoundingClientRect().width}))}));
  const lab=page.locator(selector);
  if(await lab.count()) await lab.screenshot({path:root+'/screenshots/'+name+'.png'});
  else await page.screenshot({path:root+'/screenshots/'+name+'.png'});
  report.push({name,title:await page.title(),h1:await page.locator('h1').allTextContents(),overflow,errors:[...errors],labFound:await lab.count()});
 }
 await context.close();
}
await fs.writeFile(root+'/browser-layout.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
await browser.close();
