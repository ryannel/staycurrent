import {chromium} from '/private/tmp/staycurrent-browser/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {sandboxTutorials} from '../../../src/lib/sql-sandbox-tutorials.ts';
const base=process.env.REVIEW_URL||'https://staycurrent.dev';
const output=process.env.LIVE_REPORT||'docs/article-work/relational-depth-review/live-verification.json';
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const page=await browser.newPage({viewport:{width:1280,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const articles=[],downloads=[],steps=[];
const pages={isolation:'40001','schema-changes':'Deploy application release B','backup-and-restore':'Recovering beyond the base backup','access-control':'restrictive','data-lifecycle':'deletion ledger intact','product-comparison':'SQLITE_BUSY_SNAPSHOT','adding-another-system':'Follow a delivery through interruption',indexes:'index-order lesson','query-execution':'join-work lesson'};
try {
 for(const [slug,phrase]of Object.entries(pages)){
  const response=await page.goto(base+'/learn/databases/relational/'+slug+'/');assert.equal(response.status(),200);
  assert.ok((await page.locator('article').innerText()).includes(phrase),slug);
  assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(),0);
  articles.push({slug,status:response.status(),title:await page.locator('h1').innerText()});
  for(const anchor of await page.locator('a[download]').all()){
   const href=await anchor.getAttribute('href'),file=await anchor.getAttribute('download');const asset=await page.request.get(new URL(href,base).href);assert.equal(asset.status(),200,file);const body=await asset.text();assert.ok(body.length>100);assert.doesNotMatch(body,/<!doctype html>/i);downloads.push({file,url:new URL(href,base).href,bytes:body.length});
  }
 }
 const ids=['index-order','join-work','policy-composition','outbox-delivery'];
 for(const id of ids){
  const tutorial=sandboxTutorials.find(t=>t.id===id);await page.goto(base+'/learn/databases/relational/sandbox/?tutorial='+id);
  const ready=()=>page.waitForFunction(()=>!document.querySelector('[data-run]').disabled,{},{timeout:65000});await ready();
  assert.equal(await page.locator('[data-session-title]').innerText(),tutorial.title);
  assert.equal(await page.locator('[data-lesson-card]').count(),sandboxTutorials.length);
  for(const [index,step]of tutorial.steps.entries()){
   await page.locator('[data-run]').click();await ready();const result=await page.locator('[data-results]').innerText();
   if(step.expectedError)assert.match(result,new RegExp(step.expectedError));else assert.doesNotMatch(result,/Error · SQLSTATE/);
   if(id==='index-order'&&index===1){const plan=page.locator('[data-results] .sandbox-output-plan');assert.equal(await plan.count(),1);assert.equal(await plan.locator('td').first().evaluate(e=>getComputedStyle(e).whiteSpace),'pre');}
   steps.push({id,step:index+1,expectedError:step.expectedError||null});
   if(index<tutorial.steps.length-1)await page.locator('[data-continue]').click();
  }
  assert.equal(await page.locator('[data-complete]').isVisible(),true);
 }
 assert.deepEqual(errors,[]);
 await writeFile(output,JSON.stringify({base,checkedAt:new Date().toISOString(),articles,downloads,steps,errors},null,2));console.log(`${articles.length} articles, ${downloads.length} downloads and ${steps.length} lesson steps verified at ${base}`);
}finally{await browser.close();}
