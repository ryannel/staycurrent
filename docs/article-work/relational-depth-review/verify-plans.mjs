import {chromium} from '/private/tmp/staycurrent-browser/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});const results=[];
try {
 for(const width of [390,1280])for(const colorScheme of ['light','dark']){
  const p=await b.newPage({viewport:{width,height:1000},colorScheme});const errors=[];p.on('pageerror',e=>errors.push(e.message));
  const ready=()=>p.waitForFunction(()=>!document.querySelector('[data-run]').disabled,{},{timeout:65000});
  const run=async(sql)=>{if(sql)await p.locator('[data-editor]').fill(sql);await p.locator('[data-run]').click();await ready();};
  await p.goto('http://127.0.0.1:4330/learn/databases/relational/sandbox/?tutorial=index-order');await ready();await run();await p.locator('[data-continue]').click();await run();
  const plan=p.locator('[data-results] .sandbox-output-plan');assert.equal(await plan.count(),1);
  const rows=await plan.locator('td').allTextContents();assert.ok(rows.some(s=>/^\s+->/.test(s)));assert.ok(rows.some(s=>/Rows Removed by Filter: 45/.test(s)));
  const style=await plan.locator('td').first().evaluate(e=>({whiteSpace:getComputedStyle(e).whiteSpace,font:getComputedStyle(e).fontFamily,border:getComputedStyle(e).borderBottomWidth}));assert.equal(style.whiteSpace,'pre');assert.equal(style.border,'0px');
  await p.waitForFunction(()=>document.querySelector('[data-results-title]')===document.activeElement);
  const scrollable=await plan.evaluate(e=>e.scrollWidth>e.clientWidth);
  if(scrollable){await plan.focus();await p.keyboard.press('ArrowRight');await p.waitForFunction(()=>document.querySelector('[data-results] .sandbox-output-plan').scrollLeft>0);}
  await plan.evaluate(e=>e.scrollLeft=0);
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:`docs/article-work/relational-depth-review/visual/plan-${width}-${colorScheme}.png`,fullPage:true});
  await run('SELECT \'<img src=x onerror=alert(1)>\' AS "QUERY PLAN", NULL AS missing;');assert.equal(await p.locator('[data-results] .sandbox-output-plan').count(),0);assert.equal(await p.locator('[data-results] img').count(),0);assert.equal(await p.locator('[data-results] td[aria-label="SQL NULL: no value"]').count(),1);
  await run("EXPLAIN (VERBOSE) SELECT '<img src=x onerror=alert(1)>' AS payload;");assert.equal(await p.locator('[data-results] .sandbox-output-plan').count(),1);assert.equal(await p.locator('[data-results] img').count(),0);assert.match(await p.locator('[data-results]').innerText(),/<img src=x/);
  await run("EXPLAIN (VERBOSE) SELECT repeat('x',3000) AS payload;");assert.match(await p.locator('[data-results]').innerText(),/Cells exceeding the display budget/);
  assert.deepEqual(errors,[]);results.push({width,colorScheme,style,planRows:rows.length,keyboardScroll:true,literalSafe:true,ordinaryTable:true,truncationNotice:true,errors});await p.close();
 }
}finally{await b.close();}
await writeFile('docs/article-work/relational-depth-review/plan-presentation.json',JSON.stringify(results,null,2));console.log('Plan hierarchy, scrolling, literal safety and display limits passed in four states');
