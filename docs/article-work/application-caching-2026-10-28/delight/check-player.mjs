// Controlled behaviour checks; actual browser appearance is reviewed separately.
import assert from 'node:assert/strict';
import { mountScene } from '../../../../src/components/application-caching/delight/player.mjs';
import { scenes } from '../../../../src/components/application-caching/delight/scenes.mjs';
function harness(reduce=false) {
  const element = () => ({ hidden:false, dataset:{}, handlers:new Map(), setAttribute(n,v){this[n]=v;}, addEventListener(n,f){this.handlers.set(n,f);}, removeEventListener(n){this.handlers.delete(n);} });
  const drawing=element(), controls=element(), pause=element(), replay=element(), slider=element(), output=element(), action=element();
  drawing.getBoundingClientRect=()=>({height:600}); slider.value='3'; action.dataset.variantAction='hit';
  const nodes={'.delight-stage':drawing,'.delight-controls':controls,'[data-pause]':pause,'[data-replay]':replay,'input[type="range"]':slider,output};
  const root={dataset:{variant:'story'},querySelector:s=>nodes[s],querySelectorAll:()=>[action]};
  const document=element(), window=element(), motion=element(); document.hidden=false; document.querySelectorAll=()=>[root]; motion.matches=reduce;
  let observer, count=0;const frames=new Map();
  Object.assign(globalThis,{document,window,innerHeight:720,matchMedia:()=>motion,
    requestAnimationFrame:f=>{frames.set(++count,f);return count;},cancelAnimationFrame:id=>frames.delete(id),
    IntersectionObserver:class {constructor(fn,o){observer={fn,o};}observe(){}disconnect(){}}
  });
  const scene={title:'Audit',duration:300,range:{unit:'KiB'},render:(t,v)=>`${v}:${t}`,altFor:v=>v};
  const cleanup=mountScene(root,scene);
  return {root,drawing,controls,pause,replay,slider,output,action,motion,document,window,frames,cleanup,
    intersect:r=>observer.fn([{intersectionRatio:r}]),
    tick:now=>{const q=[...frames.values()];frames.clear();q.forEach(f=>f(now));},
    click:e=>e.handlers.get('click')()
  };
}
const reduced=harness(true);
assert.equal(reduced.drawing.innerHTML,'story:1');assert.equal(reduced.pause.hidden,true);assert.equal(reduced.replay.hidden,true);
reduced.intersect(1);assert.equal(reduced.frames.size,0);
reduced.click(reduced.action);assert.equal(reduced.drawing.innerHTML,'hit:1');assert.equal(reduced.frames.size,0);
reduced.cleanup();
const h=harness();h.intersect(.5);assert.equal(h.frames.size,0);h.intersect(.9);h.tick(100);h.tick(200);
assert.equal(h.root.dataset.progress,String(1/3));h.click(h.pause);assert.equal(h.frames.size,0);
h.intersect(0);h.intersect(1);assert.equal(h.frames.size,0);h.click(h.pause);assert.equal(h.frames.size,1);
h.document.hidden=true;h.document.handlers.get('visibilitychange')();assert.equal(h.frames.size,0);
h.document.hidden=false;h.document.handlers.get('visibilitychange')();h.tick(300);h.tick(400);h.tick(500);
assert.equal(h.root.dataset.progress,'1');assert.equal(h.pause.hidden,true);
h.click(h.action);assert.equal(h.drawing.innerHTML,'hit:0');assert.equal(h.drawing['aria-label'],'hit');
h.slider.value='1';h.slider.handlers.get('input')();assert.equal(h.drawing.innerHTML,'1:1');assert.equal(h.output.textContent,'1 KiB');assert.equal(h.frames.size,0);
h.click(h.replay);assert.equal(h.drawing.innerHTML,'1:0');assert.equal(h.frames.size,1);
h.motion.matches=true;h.motion.handlers.get('change')();assert.equal(h.drawing.innerHTML,'1:1');assert.equal(h.frames.size,0);
h.cleanup();assert.equal(h.window.handlers.size,0);assert.equal(h.document.handlers.size,0);assert.equal(h.motion.handlers.size,0);
assert.equal(h.action.handlers.size,0);assert.equal(h.slider.handlers.size,0);assert.equal(h.pause.handlers.size,0);
const ids=new Set();let framesChecked=0;
for(const [kind,scene] of Object.entries(scenes)){
  const variants=new Set([scene.defaultVariant??'story',...(scene.actions??[]).map(a=>a.value),...(scene.range?['1','2','3']:[])]);
  for(const variant of variants)for(let i=0;i<=100;i++){
    const svg=scene.render(i/100,variant);assert.ok(svg.startsWith('<svg'),kind);assert.ok(!/NaN|Infinity|undefined/.test(svg),`${kind}:${variant}:${i}`);framesChecked++;
  }
  const svg=scene.render(1,scene.defaultVariant??'story');
  for(const [,id]of svg.matchAll(/\bid="([^"]+)"/g)){assert.ok(!ids.has(id),`Duplicate id:${id}`);ids.add(id);}
}
console.log(`PASS: player visibility, reduced motion, pause/resume, background suspension, completion, actions, range, replay and cleanup; ${framesChecked} finite scene frames; document-wide SVG IDs unique.`);
