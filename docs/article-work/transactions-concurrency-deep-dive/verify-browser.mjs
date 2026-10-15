import {chromium} from '/private/tmp/staycurrent-browser/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const root='/Users/ryannel/Workspace/staycurrent/docs/article-work/transactions-concurrency-deep-dive';
await fs.mkdir(root+'/application-screenshots',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/Users/ryannel/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'});
const report=[];
for(const theme of ['light','dark'])for(const width of [390,1280]){
 const page=await browser.newPage({viewport:{width,height:900},colorScheme:theme});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4322/learn/databases/relational/transaction-boundaries/',{waitUntil:'networkidle'});
 const practice=page.locator('#failure details').filter({has:page.locator('summary').filter({hasText:/psql/})});
 assert.equal(await practice.count(),1);assert.equal(await practice.getAttribute('open'),null);
 await page.locator('#working-through-checkout').screenshot({path:`${root}/application-screenshots/checkout-${theme}-${width}.png`});
 await page.locator('#failure').screenshot({path:`${root}/application-screenshots/failure-${theme}-${width}.png`});
 await practice.locator('summary').focus();await page.keyboard.press('Enter');assert.notEqual(await practice.getAttribute('open'),null);
 await practice.screenshot({path:`${root}/application-screenshots/practice-${theme}-${width}.png`});
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false);assert.deepEqual(errors,[]);
 report.push({theme,width,practiceClosedInitially:true,keyboardOpened:true,pageOverflow:overflow,errors});await page.close();
}
await fs.writeFile(root+'/application-browser.json',JSON.stringify(report,null,2)+'\n');await browser.close();console.log(report);
