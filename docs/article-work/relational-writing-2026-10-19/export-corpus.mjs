// A readable review copy of the built corpus; source articles remain authoritative.
import {readFile,writeFile,mkdir,access} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {makePage} from '../../../scripts/check-site/site.mjs';
const work=dirname(fileURLToPath(import.meta.url));
const root=resolve(work,'../../..');
const output=resolve(process.argv.slice(2).find(arg=>!arg.startsWith('--'))??'/private/tmp/rel3-corpus-reading');
const complete=process.argv.includes('--complete');
const registry=JSON.parse(await readFile(resolve(work,'registry.json'),'utf8'));
const tidy=s=>s.replace(/\s+/g,' ').trim();
function inline(node){
 if(node.nodeType!==1)return node.text??'';
 const text=node.childNodes.map(inline).join('');
 if(node.tagName==='A')return `[${text}](${node.getAttribute('href')})`;
 if(node.tagName==='CODE')return '`'+text+'`';
 if(['P','DIV','LI','UL','OL','BR','SUMMARY'].includes(node.tagName))return ' '+text+' ';
 return text;
}
function render(node){
 if(node.nodeType!==1)return '';
 const tag=node.tagName,classes=(node.getAttribute('class')??'').split(/\s+/);
 if(['NAV','SCRIPT','STYLE'].includes(tag)||classes.some(c=>['essay-header','draft-status','draft-reading','draft-collection-link'].includes(c)))return '';
 if(/^H[2-4]$/.test(tag))return '\n'+('#'.repeat(Number(tag[1])))+' '+tidy(node.text)+` {#${node.id}}`+'\n\n';
 if(tag==='FIGURE'){
  const choices=[...node.querySelectorAll('select option'),...node.querySelectorAll('button[data-choice]')].map(n=>tidy(n.text));
  return '\n> '+tidy(node.querySelector('figcaption')?.text??'Interactive figure')+'\n'+(choices.length?'> Compare: '+choices.join(' / ')+'\n':'')+'> Read the rendered article or its component for the full mechanism and interaction. Hidden transcripts are omitted from this reading copy.\n\n';
 }
 if(tag==='PRE')return '\n```\n'+makePage('',node.rawText).article.text.trim()+'\n```\n\n';
 if(tag==='TABLE')return (node.querySelector('caption')?'\n'+tidy(node.querySelector('caption').text)+'\n':'')+node.querySelectorAll('tr').map(row=>row.querySelectorAll('th,td').map(cell=>tidy(inline(cell))).join(' | ')).join('\n')+'\n\n';
 if(tag==='P')return tidy(inline(node))+'\n\n';
 if(tag==='SUMMARY')return '> '+tidy(inline(node))+'\n\n';
 if(tag==='LI')return '- '+tidy(inline(node))+'\n';
 if(['UL','OL'].includes(tag))return node.childNodes.map(render).join('')+'\n';
 return node.childNodes.map(render).join('');
}
await mkdir(output,{recursive:true});
const articles=[];
for(const entry of registry){
 const source=resolve(root,'src/articles/relational-next',entry.id+'.astro');
 try{await access(source);}catch{if(complete)throw Error(entry.id+' is missing');continue;}
 const html=await readFile(resolve(root,'dist','.'+entry.href,'index.html'),'utf8');
 const page=makePage(entry.href,html);
 const file=resolve(output,entry.id+'.md');
 await writeFile(file,'# '+entry.title+'\n\nSource: '+source+'\nRoute: '+entry.href+'\n\n'+render(page.article));
 articles.push({id:entry.id,title:entry.title,source,source_sha256:createHash('sha256').update(await readFile(source)).digest('hex'),reading:file,href:entry.href});
}
await writeFile(resolve(output,'manifest.json'),JSON.stringify({purpose:'Corpus review reading copies. All prose, tables, code and contextual links are retained; figures are cues, not substitutes for the actual interactive articles. Source articles are authoritative.',tree:resolve(root,'docs/coverage/relational-fanout-2026-10-19.yaml'),commission:resolve(work,'commission.md'),articles},null,2)+'\n');
console.log(`Exported ${articles.length}/${registry.length} reading copies to ${output}`);
