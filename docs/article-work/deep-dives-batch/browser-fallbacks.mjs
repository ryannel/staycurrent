import {chromium} from '/private/tmp/staycurrent-browser/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true,executablePath:'/Users/ryannel/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'});
const root='/Users/ryannel/Workspace/staycurrent/docs/article-work/deep-dives-batch';
for (const [theme,width] of [['light',390],['dark',1280]]){
 const page=await browser.newPage({viewport:{width,height:900},colorScheme:theme});
 await page.goto('http://127.0.0.1:4322/learn/databases/relational/query-results/');
 await page.locator('.receipt-trace').screenshot({path:`${root}/screenshots/query-plan-${theme}-${width}.png`});
 await page.close();
}
const report=[];
const context=await browser.newContext({javaScriptEnabled:false});
for(const [slug,selector] of [['modelling','rd-design-rules'],['query-results','[data-query-work]'],['transaction-boundaries','transaction-recovery-lab']]){
 const page=await context.newPage();await page.goto(`http://127.0.0.1:4322/learn/databases/relational/${slug}/`);
 const l=page.locator(selector);report.push({slug,visible:await l.isVisible(),text:await l.innerText(),visibleControls:await l.locator('select:visible,button:visible,input:visible').count()});await page.close();
}
await fs.writeFile(root+'/browser-no-script.json',JSON.stringify(report,null,2));await browser.close();console.log(report);
