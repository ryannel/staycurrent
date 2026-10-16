import { chromium } from '/private/tmp/staycurrent-browser/node_modules/playwright/index.mjs';
import { readdir, writeFile } from 'node:fs/promises';
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const page=await browser.newPage();const report=[];
for(const file of (await readdir('public/images/drawing-systems')).filter(x=>x.endsWith('.svg'))) {
 await page.goto(`http://127.0.0.1:4331/images/drawing-systems/${file}`);
 const issues=await page.evaluate(()=>{const s=document.querySelector('svg');if(!s)return ['No SVG'];const v=s.viewBox.baseVal;return [...s.querySelectorAll('text')].map(t=>{const b=t.getBBox();return {text:t.textContent,x:b.x,y:b.y,w:b.width,h:b.height};}).filter(b=>b.x<v.x-1||b.y<v.y-1||b.x+b.w>v.x+v.width+1||b.y+b.h>v.y+v.height+1);});
 if(issues.length)report.push({file,issues});
}
await browser.close();await writeFile('docs/article-work/drawing-systems/svg-verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
