import {chromium} from '/private/tmp/staycurrent-browser/node_modules/playwright/index.mjs';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const results=[];
try {
 for(const id of ['index-order','join-work','policy-composition','outbox-delivery'])for(const width of [390,1280])for(const colorScheme of ['light','dark']){
  const p=await b.newPage({viewport:{width,height:1000},colorScheme});const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto('http://127.0.0.1:4330/learn/databases/relational/sandbox/?tutorial='+id);
  await p.waitForFunction(()=>!document.querySelector('[data-run]').disabled,{},{timeout:65000});
  await p.locator('[data-run]').click();await p.waitForFunction(()=>!document.querySelector('[data-run]').disabled);
  await p.locator('[data-continue]').click();await p.locator('[data-run]').click();await p.waitForFunction(()=>!document.querySelector('[data-run]').disabled);
  const overflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false);assert.deepEqual(errors,[]);
  if((id==='index-order'&&width===1280&&colorScheme==='light')||(id==='policy-composition'&&width===390&&colorScheme==='dark')){
   await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:`docs/article-work/relational-depth-review/visual/${id}-${width}-${colorScheme}.png`,fullPage:true});
  }
  results.push({id,width,colorScheme,step:2,overflow,errors});await p.close();
 }
}finally{await b.close();}
await writeFile('docs/article-work/relational-depth-review/lesson-layout.json',JSON.stringify(results,null,2));console.log(results.length+' new-lesson layout states passed');
