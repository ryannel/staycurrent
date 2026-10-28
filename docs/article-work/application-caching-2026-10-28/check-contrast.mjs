// Computed text contrast on the finished default states. Graphics and alternate
// states also receive visual review; this calculation does not replace it.
import { chromium } from '/Users/ryannel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {readdir,writeFile} from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const page=await browser.newPage({viewport:{width:375,height:960}}),report=[];
const keys=(await readdir('src/articles/application-caching')).filter(x=>x.endsWith('.astro')).map(x=>x.slice(0,-6));
try {
 for(const key of keys)for(const theme of ['light','dark']){
  await page.goto(`http://127.0.0.1:4327/review/application-caching/${key==='index'?'':key+'/'}`);
  await page.evaluate(t=>document.documentElement.setAttribute('data-theme',t),theme);
  const result=await page.evaluate(()=>{
   const ctx=document.createElement('canvas').getContext('2d',{willReadFrequently:true});
   const rgba=color=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].map((x,i)=>i===3?x/255:x);};
   const blend=(a,b)=>{const alpha=a[3]+b[3]*(1-a[3]);if(!alpha)return [0,0,0,0];return [...a.slice(0,3).map((v,i)=>(v*a[3]+b[i]*b[3]*(1-a[3]))/alpha),alpha];};
   const lum=c=>c.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
   const failures=[];let checked=0,min=100;
   for(const e of document.querySelectorAll('article figure *, article pre *')){
    if(![...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())||!e.getClientRects().length)continue;
    const s=getComputedStyle(e);let back=[0,0,0,0],visible=true;
    for(let n=e;n;n=n.parentElement){const st=getComputedStyle(n);if(st.opacity==='0'||st.visibility==='hidden')visible=false;back=blend(back,rgba(st.backgroundColor));}
    if(!visible)continue;
    back=blend(back,[255,255,255,1]);const front=blend(rgba(s.color),back);const l=[lum(front),lum(back)].sort((a,b)=>b-a);const ratio=(l[0]+.05)/(l[1]+.05);
    if(!Number.isFinite(ratio))throw new Error('Invalid colour calculation');
    const size=parseFloat(s.fontSize),large=size>=24||(size>=18.66&&Number(s.fontWeight)>=700);const need=large?3:4.5;checked++;min=Math.min(min,ratio);
    if(ratio+.01<need)failures.push({text:e.textContent.trim().slice(0,100),tag:e.tagName,ratio,need,size});
   }
   return {checked,min,failures};
  });report.push({key,theme,...result});
 }
}finally{await browser.close();}
await writeFile('docs/article-work/application-caching-2026-10-28/evidence/contrast.json',JSON.stringify({at:new Date().toISOString(),scope:'Default visible figure/code text; alpha backgrounds composed; no gradients or partial element-opacity modelling',pages:report},null,2)+'\n');
const failures=report.flatMap(r=>r.failures.map(f=>({key:r.key,theme:r.theme,...f})));
console.log(JSON.stringify({pages:report.length,min:Math.min(...report.map(r=>r.min)),failures}));
if(failures.length)process.exitCode=1;
