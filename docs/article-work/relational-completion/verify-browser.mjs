import { chromium } from '/private/tmp/staycurrent-browser/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { sandboxTutorials } from '../../../src/lib/sql-sandbox-tutorials.ts';
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const page=await browser.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
let acceptDialog=true;page.on('dialog',d=>acceptDialog?d.accept():d.dismiss());
const base=process.env.REVIEW_URL||'http://127.0.0.1:4326';
const url=base+'/learn/databases/relational/sandbox/';
const report=[];
async function ready(){await page.waitForFunction(()=>document.querySelector('[data-status]').textContent.startsWith('Shop ready'),{},{timeout:60000});}
async function run(sql){
  if(sql!==undefined)await page.locator('[data-editor]').fill(sql);
  await page.locator('[data-run]').click();
  await page.waitForFunction(()=>!document.querySelector('[data-run]').disabled,{},{timeout:25000});
  return page.locator('.sandbox-run').first().innerText();
}
for(const tutorial of sandboxTutorials){
  await page.goto(url+'?tutorial='+tutorial.id);
  await page.locator('[data-start]').click();await ready();
  for(const [index,step] of tutorial.steps.entries()){
    assert.equal(await page.locator('[data-continue]').isVisible(),false,'Loading a step is not running it');
    const response=await run();
    if(step.expectedError)assert.match(response,new RegExp(step.expectedError));
    else assert.doesNotMatch(response,/Error · SQLSTATE/);
    report.push({lesson:tutorial.id,step:index+1,error:step.expectedError||null});
    if(index<tutorial.steps.length-1)await page.locator('[data-next]').click();
  }
}
await page.goto(url);await page.locator('[data-start]').click();await ready();
await run("SELECT 'NULL' AS text_null, NULL AS actual_null, '<img src=x onerror=alert(1)>' AS harmless;");
assert.equal(await page.locator('.sandbox-run img').count(),0);
assert.equal(await page.locator('td[aria-label="SQL NULL: no value"]').count(),1);
assert.match(await run('SELECT generate_series(1,210);'),/display shortened/);
await run('BEGIN; SELECT 1/0;');
assert.equal(await page.locator('[data-transaction]').getAttribute('data-state'),'E');
acceptDialog=false;await page.locator('[data-reset]').click();
assert.equal(await page.locator('[data-transaction]').getAttribute('data-state'),'E');
acceptDialog=true;await page.locator('[data-reset]').click();await ready();
assert.equal(await page.locator('[data-transaction]').getAttribute('data-state'),'I');
await page.locator('[data-editor]').fill('SELECT pg_sleep(30);');await page.locator('[data-run]').click();
await page.locator('[data-editor]').fill('SELECT 42;');await page.locator('[data-stop]').click();
assert.match(await page.locator('.sandbox-run').first().innerText(),/pg_sleep/);
assert.equal(await page.locator('[data-start]').isEnabled(),true);
await page.locator('[data-start]').click();await ready();
await page.locator('[data-editor]').fill('SELECT 42;');await page.locator('[data-editor]').press('Control+Enter');
await page.waitForFunction(()=>document.querySelector('[data-results]').textContent.includes('42'));
for(const width of [390,1280])for(const colorScheme of ['light','dark']){
  await page.setViewportSize({width,height:900});await page.emulateMedia({colorScheme});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.screenshot({path:`/private/tmp/relational-sandbox-${width}-${colorScheme}.png`,fullPage:true});
}
assert.deepEqual(errors,[]);
await writeFile('docs/article-work/relational-completion/browser-verification.json',JSON.stringify({steps:report,edgeCases:['NULL accessibility','safe literal text','row display limit','failed transaction','reset cancellation and acceptance','stop preserves pending SQL','restart','keyboard run','phone/desktop both themes'],errors},null,2));
await browser.close();console.log(`${report.length} browser lesson steps and recovery checks passed.`);
