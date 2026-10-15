import { chromium } from '/private/tmp/staycurrent-browser/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {sandboxTutorials} from '../../../src/lib/sql-sandbox-tutorials.ts';
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
let acceptDialog=true;page.on('dialog',d=>acceptDialog?d.accept():d.dismiss());
const base=process.env.REVIEW_URL||'http://127.0.0.1:4330';
const url=base+'/learn/databases/relational/sandbox/';const report=[];
async function ready(){await page.waitForFunction(()=>!document.querySelector('[data-run]').disabled,{},{timeout:65000});}
async function run(sql){
 if(sql!==undefined)await page.locator('[data-editor]').fill(sql);
 await page.locator('[data-run]').click();await ready();
 return page.locator('[data-results] .sandbox-run').innerText();
}
for(const tutorial of sandboxTutorials){
 console.log('Checking '+tutorial.id);await page.goto(url+'?tutorial='+tutorial.id);await ready();
 assert.equal(await page.locator('[data-launch]').isVisible(),false);
 for(const [index,step] of tutorial.steps.entries()){
  assert.equal(await page.locator('[data-continue]').isVisible(),false);
  assert.equal(await page.locator('[data-results] .sandbox-run').count(),0,'Previous result must not appear to answer the next step');
  const response=await run();
  if(step.expectedError)assert.match(response,new RegExp(step.expectedError));else assert.doesNotMatch(response,/Error · SQLSTATE/);
  assert.equal(await page.locator('[data-expected-panel]').isVisible(),true);
  assert.equal(await page.locator('[data-results] .sandbox-run').count(),1);
  assert.ok(await page.locator('[data-history] .sandbox-run').count()<=4);
  report.push({lesson:tutorial.id,step:index+1,error:step.expectedError||null});
  if(index<tutorial.steps.length-1)await page.locator('[data-continue]').click();
 }
 assert.equal(await page.locator('[data-complete]').isVisible(),true);
 assert.equal(await page.locator('[data-progress]').getAttribute('value'),String(tutorial.steps.length));
}
// Search and subject filters; native dialog keyboard dismissal and focus return.
await page.locator('.workspace-actions [data-browse]').click();
await page.locator('[data-search]').fill('index');
assert.ok(await page.locator('[data-lesson-card]:visible').count()>0);
await page.locator('[data-subject]').selectOption('Indexes');
assert.equal(await page.locator('[data-lesson-card]:visible').count(),1);
await page.locator('[data-search]').fill('nothingmatchesxyz');assert.equal(await page.locator('[data-no-lessons]').isVisible(),true);
await page.keyboard.press('Escape');assert.equal(await page.locator('[data-chooser]').isVisible(),false);
assert.equal(await page.locator('.workspace-actions [data-browse]').evaluate(el=>el===document.activeElement),true);
await page.locator('.workspace-actions [data-browse]').click();
await page.locator('[data-search]').fill('');await page.locator('[data-subject]').selectOption('');
assert.equal(await page.locator('[data-lesson-card]:visible').count(),sandboxTutorials.length);
acceptDialog=false;await page.locator('[data-choose="queries"]').click();
assert.equal(await page.locator('[data-chooser]').isVisible(),true);assert.equal(new URL(page.url()).searchParams.get('tutorial'),sandboxTutorials.at(-1).id);
acceptDialog=true;await page.locator('[data-choose="queries"]').click();await ready();assert.match(page.url(),/tutorial=queries/);
// Unexpected errors do not advance; a changed example is identified without grading it.
await run('SELECT 1/0;');assert.equal(await page.locator('[data-continue]').isVisible(),false);
await run('SELECT 42;');assert.equal(await page.locator('[data-edited]').isVisible(),true);
acceptDialog=false;await page.locator('[data-continue]').click();assert.match(await page.locator('[data-step-count]').innerText(),/Step 1/);
acceptDialog=true;await page.locator('[data-continue]').click();assert.match(await page.locator('[data-step-count]').innerText(),/Step 2/);
// Free exploration and database safety controls.
await page.locator('.workspace-actions [data-browse]').click();await page.locator('[data-free-choice]').click();await ready();
assert.equal(await page.locator('[data-free-guide]').isVisible(),true);
await run("SELECT 'NULL' AS text_null, NULL AS actual_null, '<img src=x onerror=alert(1)>' AS harmless;");
assert.equal(await page.locator('[data-results] img').count(),0);assert.equal(await page.locator('td[aria-label="SQL NULL: no value"]').count(),1);
assert.match(await run('SELECT generate_series(1,210);'),/display shortened/);
await run('BEGIN; SELECT 1/0;');assert.equal(await page.locator('[data-transaction]').getAttribute('data-state'),'E');
acceptDialog=false;await page.locator('[data-reset]').click();assert.equal(await page.locator('[data-transaction]').getAttribute('data-state'),'E');
acceptDialog=true;await page.locator('[data-reset]').click();await ready();assert.equal(await page.locator('[data-transaction]').getAttribute('data-state'),'I');
await page.locator('[data-editor]').fill('SELECT pg_sleep(30);');await page.locator('[data-run]').click();
assert.equal(await page.locator('[data-editor]').getAttribute('readonly'),'');
await page.locator('[data-stop]').click();assert.match(await page.locator('[data-results]').innerText(),/pg_sleep/);
assert.equal(await page.locator('[data-reset]').isEnabled(),true);assert.equal(await page.locator('[data-run]').isEnabled(),false);
await page.locator('[data-reset]').click();await ready();
await page.locator('[data-editor]').fill('SELECT 42;');await page.locator('[data-editor]').press('Control+Enter');await ready();
assert.match(await page.locator('[data-results]').innerText(),/42/);
await page.locator('[data-clear]').click();assert.equal(await page.locator('.sandbox-run').count(),0);
// Mobile result focus, both themes, narrow viewport, and catalogue reflow.
for(const width of [320,390,640,1440])for(const colorScheme of ['light','dark']){
 await page.setViewportSize({width,height:900});await page.emulateMedia({colorScheme});
 await page.goto(url+'?tutorial=queries');await ready();await run();
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.waitForFunction(()=>document.querySelector('[data-results-title]')===document.activeElement);
 if(width<=800){ await page.waitForFunction(()=>{const box=document.querySelector('.sandbox-results').getBoundingClientRect();return box.top>=0&&box.bottom<=innerHeight+1;}); }
 await page.locator('.workspace-actions [data-browse]').click();
 for(let i=0;i<12;i++)await page.keyboard.press('Tab');
 assert.equal(await page.locator('[data-chooser]').evaluate(el=>el.contains(document.activeElement)),true);
 assert.equal(await page.locator('[data-chooser]').evaluate(el=>el.scrollWidth>el.clientWidth),false);
 await page.keyboard.press('Escape');
}
// Existing article links into the catalogue and unknown lesson URLs remain useful.
await page.goto(url+'#lessons');assert.equal(await page.locator('[data-chooser]').isVisible(),true);
await page.keyboard.press('Escape');await page.goto(url+'?tutorial=not-found');assert.match(await page.locator('[data-entry-message]').innerText(),/not found/);
assert.equal(await page.locator('[data-start]').isEnabled(),true);
assert.deepEqual(errors,[]);
await writeFile('docs/article-work/postgresql-rebuild/browser-verification.json',JSON.stringify({steps:report,checks:['all lessons and completion','current result isolated from history','history bounded','search and subject filtering','no matches','dialog Escape and focus return','cancelled lesson change','unexpected error stops progression','edited SQL and step cancellation','free exploration','NULL accessibility','safe literal output','result limit','failed transaction','restart cancellation and acceptance','read-only running SQL','stop preserves SQL','restart after stop','keyboard run','clear results','320/390/640/1440 both themes','mobile result focus','modal keyboard focus','catalogue deep link','unknown lesson fallback'],errors},null,2));
await browser.close();console.log(`${report.length} browser steps and UX checks passed.`);
