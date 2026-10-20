// Commission-only checks for unindexed review pages, outside public Article rules.
import {readFile,access} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import {makePage,before} from '../../../scripts/check-site/site.mjs';
const work=dirname(fileURLToPath(import.meta.url));
const root=resolve(work,'../../..');
const registry=JSON.parse(await readFile(resolve(work,'registry.json'),'utf8'));
const complete=process.argv.includes('--complete');
const errors=[],results=[];
for(const entry of registry){
 const source=resolve(root,'src/articles/relational-next',`${entry.id}.astro`);
 let available=true;try{await access(source);}catch{available=false;}
 if(!available){if(complete)errors.push(`${entry.id}: source missing`);continue;}
 const html=await readFile(resolve(root,'dist','.'+entry.href,'index.html'),'utf8');
 const page=makePage(entry.href,html);
 const article=page.article;
 const headings=article.querySelectorAll('h2').filter(h=>h.id!=='contextual-reading');
 const navs=article.querySelectorAll('nav').filter(n=>['In this article','Contents'].includes(n.getAttribute('aria-label')));
 const opening=article.querySelectorAll('p').find(p=>!p.closest('header')&&!p.closest('aside')&&!p.closest('nav'));
 if(navs.length!==1)errors.push(`${entry.id}: expected one article contents nav, found ${navs.length}`);
 const nav=navs[0];
 if(nav&&(!opening||!before(page,opening,nav)))errors.push(`${entry.id}: no opening before contents`);
 if(nav&&headings[0]&&!before(page,nav,headings[0]))errors.push(`${entry.id}: contents after first section`);
 if(headings.at(-1)?.text.trim()!=='Sources and further reading')errors.push(`${entry.id}: sources not final own section`);
 for(const s of entry.sections)if(!page.ids.has(s.anchor))errors.push(`${entry.id}: missing planned #${s.anchor}`);
 const ownLinks=article.querySelectorAll('a').filter(a=>!a.closest('.draft-reading')&&!a.closest('.draft-status')&&!a.closest('.draft-collection-link'));
 const bottom=article.querySelector('.draft-reading');
 for(const id of entry.children){
  const child=registry.find(c=>c.id===id);
  if(!ownLinks.some(a=>a.getAttribute('href')?.split('#')[0]===child.href))errors.push(`${entry.id}: missing contextual child ${id}`);
  if(!bottom?.querySelectorAll('a').some(a=>a.getAttribute('href')===child.href)){
   // Unwritten children remain explicit planned text until the corpus is complete.
   if(complete)errors.push(`${entry.id}: missing bottom child ${id}`);
  }
 }
 const robots=page.root.querySelectorAll('meta').find(m=>m.getAttribute('name')==='robots')?.getAttribute('content')??'';
 if(!robots.includes('noindex')||!robots.includes('nofollow'))errors.push(`${entry.id}: review indexing boundary missing`);
 if(!article.hasAttribute('data-pagefind-ignore'))errors.push(`${entry.id}: search exclusion missing`);
 if(complete&&/Planned article|Planned section/.test(article.text))errors.push(`${entry.id}: planned placeholder remains`);
 results.push({id:entry.id,href:entry.href,sections:headings.length,figures:article.querySelectorAll('figure').length,contentsLabel:nav?.getAttribute('aria-label')});
}
console.log(JSON.stringify({checked:results.length,total:registry.length,complete,errors,articles:results},null,2));
if(errors.length)process.exitCode=1;
