import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {chromium} from '/private/tmp/staycurrent-browser/node_modules/playwright/index.mjs';
import {relationalCollection} from '../../../src/lib/relational-collection.ts';
const articles=relationalCollection.flatMap(g=>g.articles);
assert.equal(articles.length,27);assert(articles.every(a=>a.status==='published'));
const routes=['',...articles.map(a=>a.slug+'/'),'checkout/','practice/','sandbox/'];
for(const slug of routes){
 const html=await readFile(`dist/learn/databases/relational/${slug}index.html`,'utf8');
 assert(!/name="robots" content="noindex"/.test(html),slug+' still noindex');
 assert(!/Working draft|This article hasn’t been written yet|Planned deep dive|Planned guide:/.test(html),slug+' has stale publication copy');
}
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const base=process.env.REVIEW_URL||'http://127.0.0.1:4327';
const checks=[];const errors=[];
for(const width of [390,1280])for(const colorScheme of ['light','dark']){
 const page=await browser.newPage({viewport:{width,height:900},colorScheme});page.on('pageerror',e=>errors.push(e.message));
 for(const path of ['/','/articles/','/playgrounds/','/learn/databases/relational/','/learn/databases/relational/practice/','/learn/databases/relational/sandbox/']){
  const response=await page.goto(base+path);assert.equal(response.status(),200);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,path+' overflow');
  if(path==='/learn/databases/relational/'){
   assert.equal(await page.locator('.collection-map .article-status').count(),0);
   assert.equal(await page.locator('.collection-map details[open]').count(),relationalCollection.length);
  }
  if(path==='/articles/'){
   await page.locator('#article-query').fill('vacuum');
   assert(await page.locator('[data-reading-entry]:visible').count()>0);
   await page.getByRole('button',{name:'Clear',exact:true}).click();
  }
  if(path.endsWith('/sandbox/')){
   assert.equal(await page.locator('[data-tutorial] option').count(),30);
   assert.equal(await page.locator('.lesson-catalogue h4 a').count(),29);
   await page.locator('.lesson-catalogue > p a').click();
   assert.equal(new URL(page.url()).searchParams.get('tutorial'),'queries');
   assert.equal(await page.locator('[data-tutorial]').inputValue(),'queries');
  }
  checks.push({path,width,colorScheme});
  if(path==='/'||path==='/playgrounds/'||path==='/learn/databases/relational/')await page.screenshot({path:`/private/tmp/publication-${path.replaceAll('/','-')||'home'}-${width}-${colorScheme}.png`});
 }
 await page.close();
}
assert.deepEqual(errors,[]);await browser.close();
await writeFile('docs/article-work/relational-completion/publication-verification.json',JSON.stringify({publishedArticles:articles.length,publishedRoutes:routes.length,layoutAndNavigationChecks:checks,errors},null,2)+'\n');
console.log(`${articles.length} articles, ${routes.length} published routes and ${checks.length} layout/navigation checks passed.`);
