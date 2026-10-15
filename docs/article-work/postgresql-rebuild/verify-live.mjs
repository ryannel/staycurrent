import {chromium} from '/private/tmp/staycurrent-browser/node_modules/playwright/index.mjs';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const page=await browser.newPage({viewport:{width:1280,height:900}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const base='https://staycurrent.dev';
const slugs=['architecture','query-execution','indexes','row-versions','recovery','replication','sharding','json','full-text-search','vector-search','extensions'];
const pages=[],downloads=[];
for(const slug of slugs){
 const response=await page.goto(base+'/learn/databases/relational/postgresql/'+slug+'/');
 assert.equal(response.status(),200,slug);
 const robots=await page.locator('meta[name="robots"]').count()?await page.locator('meta[name="robots"]').getAttribute('content'):null;
 assert.ok(!robots?.includes('noindex'),slug+' should be published');
 assert.equal(await page.getByText('Working draft',{exact:true}).count(),0);
 pages.push({slug,status:response.status(),title:await page.locator('h1').innerText(),figures:await page.locator('article figure').count()});
 if(slug==='architecture')assert.equal(await page.locator('a[href="/learn/databases/relational/postgresql/sharding/"]').count()>0,true);
 if(slug==='query-execution')assert.match(await page.locator('article').innerText(),/A small tenant needs 50 matching heap rows/);
 for(const anchor of await page.locator('a[download]').all()){
  const href=await anchor.getAttribute('href');const file=await anchor.getAttribute('download');
  const asset=await page.request.get(new URL(href,base).href);assert.equal(asset.status(),200,file);
  const sql=await asset.text();assert.match(sql,/CREATE (?:EXTENSION|TABLE)/);
  downloads.push({file,url:new URL(href,base).href,status:asset.status(),bytes:sql.length});
 }
}
await page.goto(base+'/learn/databases/relational/sandbox/?tutorial=pg-range-rules');
await page.waitForFunction(()=>!document.querySelector('[data-run]').disabled,{},{timeout:65000});
await page.locator('[data-run]').click();
await page.waitForFunction(()=>!document.querySelector('[data-run]').disabled);
assert.doesNotMatch(await page.locator('[data-results]').innerText(),/Error · SQLSTATE/);
await page.locator('[data-continue]').click();await page.locator('[data-run]').click();
await page.waitForFunction(()=>!document.querySelector('[data-run]').disabled);
assert.doesNotMatch(await page.locator('[data-results]').innerText(),/Error · SQLSTATE/);
await page.locator('[data-continue]').click();await page.locator('[data-run]').click();
await page.waitForFunction(()=>!document.querySelector('[data-run]').disabled);
assert.match(await page.locator('[data-results]').innerText(),/23P01/);
await page.locator('.workspace-actions [data-browse]').click();
assert.equal(await page.locator('[data-lesson-card]:visible').count(),39);
assert.deepEqual(errors,[]);
const report={verifiedAt:new Date().toISOString(),commit:'6069e2db8a6d40a88c6adc02580c493db3a6b6c7',pages,downloads,sandbox:{lessonCount:39,rangeSetup:true,adjacentBooking:true,overlapRejection:'23P01'},errors};
await writeFile('docs/article-work/postgresql-rebuild/live-verification.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));await browser.close();
