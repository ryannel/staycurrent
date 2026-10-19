import {readFile,access} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
const work=dirname(fileURLToPath(import.meta.url));
const root=resolve(work,'../../..');
const registry=JSON.parse(await readFile(resolve(work,'registry.json'),'utf8'));
const complete=process.argv.includes('--complete');
let written=0,errors=[];
for(const article of registry){
 const path=resolve(root,'src/articles/relational-next',`${article.id}.astro`);
 try{await access(path);}catch{if(complete)errors.push(`${article.id}: article missing`);continue;}
 written++;
 const text=await readFile(path,'utf8');
 for(const section of article.sections){
  if(!text.includes(`id="${section.anchor}"`)&&!text.includes(`id='${section.anchor}'`))errors.push(`${article.id}: reserved anchor #${section.anchor} missing`);
 }
 for(const childId of article.children){
  const child=registry.find(x=>x.id===childId);
  if(!text.includes(`href="${child.href}`)&&!text.includes(`href='${child.href}`))errors.push(`${article.id}: contextual child link to ${childId} missing (bottom list does not substitute)`);
 }
 if(/<h1[\s>]/i.test(text))errors.push(`${article.id}: fragment duplicates wrapper h1`);
}
console.log(`${written}/${registry.length} article fragments present; ${errors.length} scope/link integration issues.`);
for(const error of errors)console.error(error);
if(errors.length)process.exitCode=1;
