import {chromium} from '/private/tmp/staycurrent-browser/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({headless:true,executablePath:'/Users/ryannel/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'});
const context=await browser.newContext({viewport:{width:1280,height:900}});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const report={base:'http://127.0.0.1:4322',designCases:0,queryCases:0,recoveryStates:0,keyboard:[],errors};
const goto=async slug=>{const r=await page.goto(`${report.base}/learn/databases/relational/${slug}/`,{waitUntil:'networkidle'});assert.equal(r.status(),200);};
const text=async(l,s)=>((await l.locator(s).textContent())??'').trim();
try {
 await goto('modelling');
 const lab=page.locator('rd-design-rules');await lab.waitFor({state:'visible'});
 assert.equal(await lab.getAttribute('data-ready'),'true');
 const names=['identity','required','positive','reference','product'];
 for(let mask=0;mask<32;mask++) {
  for(let i=0;i<5;i++) await lab.locator(`[data-rule="${names[i]}"]`).setChecked(!!(mask&(1<<i)));
  for(const kind of ['same','bowl','duplicate','missing','zero','unknown']) {
   await lab.locator('[data-proposal]').selectOption(kind);
   const fails=!!((mask&1&&kind==='duplicate')||(mask&2&&kind==='missing')||(mask&4&&kind==='zero')||(mask&8&&kind==='unknown')||(mask&16&&!['bowl','unknown'].includes(kind)));
   assert.equal(await lab.locator('[data-status]').getAttribute('data-outcome'),fails?'rejected':'accepted',`${mask}/${kind}`);
   assert.equal(await text(lab,'[data-line]'),kind==='duplicate'?'1':'2');
   assert.equal(await text(lab,'[data-product]'),kind==='bowl'?'P8':kind==='unknown'?'P99':'P7');
   assert.equal(await text(lab,'[data-quantity]'),kind==='missing'?'SQL NULL':kind==='zero'?'0':'1');report.designCases++;
  }
 }
 await lab.locator('[data-proposal]').selectOption('missing');
 await lab.locator('[data-reset]').click();
 assert.equal(await lab.locator('[data-proposal]').inputValue(),'missing');
 for(const n of names)assert.equal(await lab.locator(`[data-rule="${n}"]`).isChecked(),n!=='product');
 const required=lab.locator('[data-rule="required"]');await required.focus();await page.keyboard.press('Space');
 assert.equal(await lab.locator('[data-status]').getAttribute('data-outcome'),'accepted');
 await lab.locator('[data-reset]').focus();await page.keyboard.press('Enter');
 assert.equal(await lab.locator('[data-status]').getAttribute('data-outcome'),'rejected');report.keyboard.push('Design: Space toggles required rule; Enter restores rules without losing proposal.');
 await goto('query-results');
 const q=page.locator('[data-query-work]');
 for(const size of [2,20,200])for(const count of [1,2,6])for(const method of ['scan','lookup']){
  await q.locator('[data-catalogue]').selectOption(String(size));await q.locator('[data-lines]').selectOption(String(count));await q.locator('[data-method]').selectOption(method);
  assert.equal(await q.locator('[data-rows] tr').count(),count);
  const values=await q.locator('[data-rows] tr').evaluateAll(rows=>rows.map(r=>[...r.children].map(c=>c.textContent)));
  assert.deepEqual(values,Array.from({length:count},(_,i)=>[String(i+1),i%2?'P8':'P7',i%2?'Bowl':'Blue mug',i%2?'24.00':'20.00']));
  const counts=await text(q,'[data-count]');
  assert.ok(method==='scan'?counts.startsWith(`${(size*count).toLocaleString()} product-ID comparisons`):counts.startsWith(`${size} lookup entries stored, then ${count}`),counts);
  assert.equal(await q.locator('[data-route] li').count(),method==='scan'?count:count+1);report.queryCases++;
 }
 await q.locator('[data-method]').selectOption('scan');await q.locator('[data-method]').focus();await page.keyboard.press('b');await page.keyboard.press('Tab');
 assert.equal(await q.locator('[data-method]').inputValue(),'lookup');assert.match(await text(q,'[data-count]'),/lookup entries/);report.keyboard.push('Query: keyboard changes method and updates counts.');
 await goto('transaction-boundaries');
 const t=page.locator('transaction-recovery-lab');assert.equal(await t.getAttribute('data-ready'),'true');
 for(const commits of [true,false])for(const same of [true,false]){
  await t.locator('[data-ending]').selectOption(commits?'commit':'rollback');await t.locator('[data-key]').selectOption(same?'same':'new');
  for(let step=0;step<=5;step++){
   const orders=Number(commits&&step>=2)+Number(step===5&&(!commits||!same));
   assert.equal(await text(t,'[data-step]'),`Step ${step} of 5`);
   assert.equal(Number(await text(t,'[data-orders]')),orders);assert.equal(Number(await text(t,'[data-stock]')),5-orders*2);
   assert.equal(await t.locator('[data-back]').isDisabled(),step===0);assert.equal(await t.locator('[data-next]').isDisabled(),step===5);
   if(step===2)assert.equal(await text(t,'[data-application]'),'Connection lost. Outcome unknown.');
   report.recoveryStates++;if(step<5)await t.locator('[data-next]').click();
  }
  for(let step=4;step>=0;step--){await t.locator('[data-back]').click();assert.equal(await text(t,'[data-step]'),`Step ${step} of 5`);}
  await t.locator('[data-next]').focus();await page.keyboard.press('Enter');assert.equal(await text(t,'[data-step]'),'Step 1 of 5');
  await t.locator('[data-reset]').focus();await page.keyboard.press('Space');assert.equal(await text(t,'[data-step]'),'Step 0 of 5');
  assert.equal(await t.locator('[data-key]').inputValue(),same?'same':'new');
 }
 report.keyboard.push('Recovery: Enter advances; Space resets; choices retained; all Previous steps restore step sequence.');
 await goto('modelling');
 const f=page.locator('design-fact-change');report.factChangeLayouts=0;
 for(const layout of ['copies','reference']){
  await f.locator('[data-layout]').selectOption(layout);await f.locator('[data-reset]').click();
  await f.locator('[data-correct]').click();
  const state=await text(f,'[data-message]');
  assert.match(state,layout==='copies'?/1 order copy still says Ada/:/Both orders show Ada Noor/);
  if(layout==='copies')await f.locator('[data-next]').click();
  assert.match(await text(f,'[data-message]'),/Both orders show Ada Noor/);
  await f.locator('[data-price]').click();assert.match(await text(f,'[data-message]'),/Catalogue: EUR 20. O12’s purchase total: EUR 36/);
  await f.locator('[data-reset]').click();assert.match(await text(f,'[data-message]'),/Both orders show Ada.*Catalogue: EUR 18. O12’s purchase total: EUR 36/);
  assert.equal(await f.locator('[data-layout]').inputValue(),layout);report.factChangeLayouts++;
 }
 await goto('transaction-boundaries');const c=page.locator('concurrent-schedule');report.concurrentStates=0;
 for(const method of ['unsafe','guard','lock'])for(const commits of [true,false]){
  await c.locator('[data-method]').selectOption(method);await c.locator('[data-ending]').selectOption(commits?'commit':'rollback');
  for(let step=0;step<=5;step++){
   const bBuys=method==='unsafe'||!commits;
   assert.equal(await text(c,'[data-step]'),`Step ${step} of 5`);
   assert.equal(Number(await text(c,'[data-stock]')),step===5?0:step>=4&&commits?0:1);
   assert.equal(Number(await text(c,'[data-orders]')),step===5?Number(commits)+Number(bBuys):step>=4&&commits?1:0);
   assert.equal(await c.locator('[data-back]').isDisabled(),step===0);assert.equal(await c.locator('[data-next]').isDisabled(),step===5);
   report.concurrentStates++;if(step<5)await c.locator('[data-next]').click();
  }
  for(let step=4;step>=0;step--){await c.locator('[data-back]').click();assert.equal(await text(c,'[data-step]'),`Step ${step} of 5`);}
  await c.locator('[data-next]').click();await c.locator('[data-reset]').click();assert.equal(await text(c,'[data-step]'),'Step 0 of 5');
  assert.equal(await c.locator('[data-method]').inputValue(),method);assert.equal(await c.locator('[data-ending]').inputValue(),commits?'commit':'rollback');
 }
 assert.deepEqual(errors,[]);
 report.result='Passed';
} catch(e){report.result='Failed';report.failure=e.stack;throw e;} finally {
 await writeFile('docs/article-work/deep-dives-batch/browser-interactions.json',JSON.stringify(report,null,2)+'\n');await browser.close();console.log(JSON.stringify(report,null,2));
}
