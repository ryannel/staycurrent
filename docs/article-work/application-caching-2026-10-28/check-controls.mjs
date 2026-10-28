import { chromium } from '/Users/ryannel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const work='docs/article-work/application-caching-2026-10-28';
const keys=process.argv.slice(2);
const selected=keys.length?keys:(await readdir('src/articles/application-caching')).filter(x=>x.endsWith('.astro')).map(x=>x.slice(0,-6));
const report={at:new Date().toISOString(),base:'http://127.0.0.1:4327',sources:{},figures:[],errors:[]};
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1280,height:960}});
 await page.clock.install();
 page.on('pageerror',e=>report.errors.push({url:page.url(),message:e.message}));
 for(const key of selected){
  report.sources[key]=createHash('sha256').update(await readFile(`src/articles/application-caching/${key}.astro`)).digest('hex');
  await page.goto(`${report.base}/review/application-caching/${key==='index'?'':key+'/'}`);
  await page.locator('article h1').waitFor();
  const figures=page.locator('article figure');
  for(let i=0;i<await figures.count();i++){
   const fig=figures.nth(i), result={key,figure:i+1,options:[],steps:[],keyboard:false,playback:false};
   const counter=fig.locator('[data-step]'), stepped=await counter.count()>0;
   async function walk(){
    if(!stepped)return;
    await fig.locator('[data-reset]').click();
    const total=Number((await counter.innerText()).split('/')[1]);
    assert.match(await counter.innerText(),/^1\s*\//);
    assert.equal(await fig.locator('[data-back]').getAttribute('aria-disabled'),'true');
    const states=[];
    for(let n=1;n<=total;n++){
     assert.equal(Number((await counter.innerText()).split('/')[0]),n);
     states.push((await fig.locator('[data-explanation]').innerText()).trim());
     if(n<total)await fig.locator('[data-next]').click();
    }
    assert.equal(await fig.locator('[data-next]').getAttribute('aria-disabled'),'true');
    await fig.locator('[data-next]').press('Enter');
    assert.equal(Number((await counter.innerText()).split('/')[0]),total);
    await fig.locator('[data-back]').press('Enter');
    assert.equal(Number((await counter.innerText()).split('/')[0]),Math.max(1,total-1));
    result.steps.push(states);result.keyboard=true;
   }
   await walk();
   const selects=fig.locator('select');
   for(let s=0;s<await selects.count();s++){
    const select=selects.nth(s), original=await select.inputValue();
    const options=await select.locator('option').evaluateAll(nodes=>nodes.map(n=>({value:n.value,label:n.textContent})));
    for(const option of options){
     await select.selectOption(option.value);await walk();result.options.push({select:s,...option});
     for(const checkbox of await fig.locator('input[type="checkbox"]').all())if(await checkbox.isEnabled()){
      await checkbox.check();await walk();await checkbox.focus();await checkbox.press('Space');assert.equal(await checkbox.isChecked(),false);result.keyboard=true;
     }
    }
    await select.selectOption(original);
    await select.focus();await select.press('Home');await select.press('ArrowDown');await select.press('Enter');
    result.keyboard=true;
   }
   if(stepped){
    await fig.locator('[data-reset]').click();
    await fig.locator('[data-play]').press('Enter');
    assert.equal((await fig.locator('[data-play]').innerText()).trim(),'Pause');
    await page.clock.runFor(1000);
    await fig.locator('[data-play]').press('Enter');
    const paused=await counter.innerText();await page.clock.runFor(20000);assert.equal(await counter.innerText(),paused);
    await fig.locator('[data-play]').click();await page.clock.runFor(600000);
    assert.equal((await fig.locator('[data-play]').innerText()).trim(),'Replay');
    await fig.locator('[data-play]').click();assert.match(await counter.innerText(),/^1\s*\//);
    await fig.locator('[data-reset]').click();result.playback=true;
   }
   for(const button of await fig.locator('button:not([data-play]):not([data-back]):not([data-next]):not([data-reset])').all())await button.press('Enter');
   for(const details of await fig.locator('details').all()){
    await details.locator('summary').press('Enter');assert.equal(await details.getAttribute('open'),'');
    await details.locator('summary').press('Enter');
   }
   report.figures.push(result);
  }
  if(key==='cache-benefits'){
   const cost=page.locator('[data-benefit-cost]');
   for(const source of [2,20])for(let hits=0;hits<=20;hits++){
    await cost.locator('[data-source]').selectOption(String(source));
    await cost.locator('[data-hits]').fill(String(hits));
    const text=await cost.locator('[data-result]').innerText();
    const expectedMean=(hits*2+(20-hits)*(source+5))/20;
    assert.ok(text.includes(`mean of ${Number(expectedMean.toFixed(2))} ms`),text);
    assert.ok(text.includes(`p95 is ${hits>=19?2:source+5} ms`),text);
    assert.equal(await cost.locator('[data-population] .hit').count(),hits);
   }
   await cost.locator('[data-hits]').focus();await cost.locator('[data-hits]').press('Home');assert.equal(await cost.locator('[data-hits]').inputValue(),'0');
   await cost.locator('[data-hits]').press('End');assert.equal(await cost.locator('[data-hits]').inputValue(),'20');
   report.costCases=42;
  }
  if(key==='index'){
   await page.locator('[data-burst-select]').selectOption('shared');assert.equal(await page.locator('[data-burst-count]').innerText(),'1');
   await page.locator('[data-burst-select]').selectOption('separate');assert.equal(await page.locator('[data-burst-count]').innerText(),'4');
   await page.locator('[data-memory-select]').selectOption('no');assert.equal(await page.locator('[data-memory-reads]').innerText(),'0');
   await page.locator('[data-memory-select]').selectOption('yes');assert.equal(await page.locator('[data-memory-reads]').innerText(),'3');
  }
  console.log(`Checked ${key}: options, step states, keyboard, playback, text alternatives`);
 }
 assert.deepEqual(report.errors,[]);
} finally {await browser.close();await writeFile(`${work}/evidence/controls-${selected.join('-')}.json`,JSON.stringify(report,null,2)+'\n');}
console.log(`Passed ${report.figures.length} figures; ${report.errors.length} browser errors.`);
