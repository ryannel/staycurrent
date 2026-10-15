import {chromium} from '/private/tmp/staycurrent-browser/node_modules/playwright/index.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
const slugs=['architecture','query-execution','indexes','row-versions','recovery','replication','sharding','json','full-text-search','vector-search','extensions'];
const root=process.env.FIGURE_OUTPUT||'/private/tmp/postgresql-rebuild-figures';
const base=process.env.REVIEW_URL||'http://127.0.0.1:4330';await mkdir(root,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});const report=[];
for(const slug of slugs)for(const width of [390,1280])for(const colorScheme of ['light','dark']){
 const page=await browser.newPage({viewport:{width,height:900},colorScheme});await page.goto(base+'/learn/databases/relational/postgresql/'+slug+'/');
 for(const [index,figure] of (await page.locator('article figure').all()).entries()){
  await figure.scrollIntoViewIfNeeded();const file=`${slug}-${index}-${width}-${colorScheme}.png`;await figure.screenshot({path:root+'/'+file});
  const metric=await figure.evaluate(el=>({overflow:el.scrollWidth>el.clientWidth,color:getComputedStyle(el).color,background:getComputedStyle(el).backgroundColor,rect:el.getBoundingClientRect().toJSON()}));
  report.push({slug,index,width,colorScheme,file,...metric});
 }await page.close();
}await browser.close();await writeFile('docs/article-work/postgresql-rebuild/figure-layout.json',JSON.stringify(report,null,2));console.log(report.length+' figure states captured; overflows: '+report.filter(x=>x.overflow).length);
