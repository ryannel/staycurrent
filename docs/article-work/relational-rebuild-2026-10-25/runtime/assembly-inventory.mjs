import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { parse } from 'node-html-parser';
const repo='/Users/ryannel/Workspace/staycurrent';
const work=path.join(repo,'docs/article-work/relational-rebuild-2026-10-25');
const output=path.join(work,'assembly');fs.mkdirSync(output,{recursive:true});
const registry=JSON.parse(fs.readFileSync(path.join(repo,'src/articles/relational-rebuild/collection.json'),'utf8'));
const accepted=JSON.parse(fs.readFileSync(path.join(work,'planning/accepted-map/collection-map.json'),'utf8'));
const base='http://127.0.0.1:4606';const prefix='/review/relational-rebuild/';
const entries=registry.entries;const pages=new Map();const issues=[];const records=[];const links=new Set();
const home=e=>prefix+(e.slug?e.slug+'/':'');
const get=async pathname=>{if(pages.has(pathname))return pages.get(pathname);const response=await fetch(base+pathname);const raw=await response.text();const record={status:response.status,raw,dom:parse(raw)};pages.set(pathname,record);return record;};
const expectedOrder=accepted.learning_journey.slice(0,-1).flatMap(stage=>stage.article_keys);
if(JSON.stringify(registry.readingOrder)!==JSON.stringify(expectedOrder))issues.push('Foundation reading order differs from accepted learning journey');
for(const entry of entries){
 const url=home(entry);const page=await get(url);const meta=JSON.parse(fs.readFileSync(path.join(repo,'src/articles/relational-rebuild',entry.key+'.meta.json'),'utf8'));
 if(page.status!==200)issues.push(entry.key+': HTTP'+page.status);
 const h1=page.dom.querySelector('h1')?.textContent.trim();if(h1!==meta.title)issues.push(entry.key+': rendered title mismatch');
 const sources=page.dom.querySelector('details.article-sources');if(!sources||sources.hasAttribute('open'))issues.push(entry.key+': sources missing or initially open');
 if(sources&&sources.parentNode.childNodes.filter(node=>node.nodeType===1).at(-1)!==sources)issues.push(entry.key+': sources are not the absolute last collection element');
 const subjects=page.dom.querySelectorAll('details.subject');if(subjects.some(s=>s.hasAttribute('open')))issues.push(entry.key+': subject group initially open');
 const tree=page.dom.querySelector('.rebuild-navigation:not(.compact)');const current=tree?.querySelector('[aria-current="page"]');if(!current)issues.push(entry.key+': current-article tree marker missing');
 const article=parse(page.dom.querySelector('article')?.outerHTML||'').querySelector('article');for(const nav of article?.querySelectorAll('.rebuild-navigation')||[])nav.remove();
 for(const a of [...(article?.querySelectorAll('a[href]')||[]),...(sources?.querySelectorAll('a[href]')||[])]){const href=a.getAttribute('href');if(href?.startsWith('/')||href?.startsWith('#'))links.add(new URL(href,base+url).href);}
 const pager=page.dom.querySelector('.collection-pager');const previous=pager?.querySelector('a.previous')?.getAttribute('href');const next=pager?.querySelector('a.next')?.getAttribute('href');
 const index=expectedOrder.indexOf(entry.key);const prior=index>=0?entries.find(e=>e.key===expectedOrder[index-1]):entries.find(e=>e.key===entry.parent);const following=index>=0?entries.find(e=>e.key===expectedOrder[index+1]):undefined;
 if(previous!==(prior?home(prior):undefined)||next!==(following?home(following):undefined))issues.push(entry.key+': pager does not follow core sequence/parent return');
 records.push({key:entry.key,title:h1,url,parent:entry.parent,group:entry.group,status:entry.status,headings:article?.querySelectorAll('h2,h3').map(h=>h.textContent.trim()),previous,next,closedSources:!!sources&&!sources.hasAttribute('open'),closedSubjectGroups:subjects.length,currentTreeMarker:!!current,html_sha256:crypto.createHash('sha256').update(page.raw).digest('hex')});
}
const linkChecks=[];for(const href of links){const u=new URL(href);const p=await get(u.pathname);const anchor=decodeURIComponent(u.hash.slice(1));if(p.status!==200)issues.push('Link HTTP'+p.status+': '+href);if(anchor&&!p.dom.querySelectorAll('[id]').some(el=>el.getAttribute('id')===anchor))issues.push('Missing anchor: '+href);linkChecks.push({href,status:p.status,anchorPresent:!anchor||p.dom.querySelectorAll('[id]').some(el=>el.getAttribute('id')===anchor)});}
const downloads=[];for(const p of pages.keys())if(p.startsWith(prefix+'downloads/')){const relative=decodeURIComponent(p.slice((prefix+'downloads/').length)).replace(/\/$/,'');const source=path.resolve(repo,'src/article-downloads/relational-rebuild',relative);const root=path.resolve(repo,'src/article-downloads/relational-rebuild');if(!source.startsWith(root+path.sep))throw Error('Unsafe download');const raw=Buffer.from(await(await fetch(base+p)).arrayBuffer());const exact=fs.readFileSync(source).equals(raw);if(!exact)issues.push('Download byte mismatch: '+p);downloads.push({url:p,bytes:raw.length,sha256:crypto.createHash('sha256').update(raw).digest('hex'),exactSource:exact});}
const retainedRelationalExits=linkChecks.filter(row=>new URL(row.href).pathname.startsWith('/learn/databases/relational/'));
const result={articleCount:records.length,readingOrder:registry.readingOrder,issues,articles:records,linkChecks,downloads,retainedRelationalExits};fs.writeFileSync(path.join(output,'inventory.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({articles:records.length,links:linkChecks.length,downloads:downloads.length,issues,retainedRelationalExits}));if(issues.length)process.exitCode=1;
