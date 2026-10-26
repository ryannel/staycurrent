/** Bounded, serial models of application decisions, not a Redis emulator. */
export const keyRequests = [
  { shop:'Harbour', language:'en', currency:'GBP', viewer:'Ada', product:42 },
  { shop:'Hill', language:'en', currency:'GBP', viewer:'Bo', product:42 },
  { shop:'Harbour', language:'fr', currency:'GBP', viewer:'Cleo', product:42 },
  { shop:'Harbour', language:'en', currency:'EUR', viewer:'Dan', product:42 },
  { shop:'Harbour', language:'en', currency:'GBP', viewer:'Eve', product:42 },
  { shop:'Hill', language:'en', currency:'GBP', viewer:'Finn', product:42 },
];
export function publicCard(r) {
  const mug=r.shop==='Harbour';
  return { shape:mug?'mug':'bowl', name:mug?(r.language==='fr'?'Tasse bleue':'Blue mug'):(r.language==='fr'?'Bol rouge':'Red bowl'),
    price:r.currency==='GBP'?(mug?'£12':'£18'):(mug?'€14':'€21') };
}
export function keyFor(r, included=[]) {
  return 'card:v1:'+JSON.stringify([r.product,...['shop','language','currency','viewer'].filter(f=>included.includes(f)).map(f=>r[f])]);
}
export function keyTrace(included=[], count=6) {
  const slots=new Map(), results=[];
  for(const [index,r] of keyRequests.slice(0,count).entries()) {
    const key=keyFor(r,included), expected=publicCard(r), hit=slots.has(key);
    if(!hit)slots.set(key,{value:expected,writer:index});
    const saved=slots.get(key);
    results.push({index,key,expected,actual:saved.value,writer:saved.writer,hit,correct:JSON.stringify(expected)===JSON.stringify(saved.value)});
  }
  return { slots:[...slots].map(([key,v])=>({key,...v})), results };
}
export function representationState(mode='response', change='none') {
  const original={product:'Blue mug',category:'Kitchen',price:'£12'};
  const source={...original, ...(change==='category'?{category:'Gifts'}:change==='price'?{price:'£15'}:{})};
  const dependencies=mode==='response'?['product','category','price']:['product'];
  const cached=Object.fromEntries(dependencies.map(k=>[k,original[k]]));
  const answer=mode==='response'?{...cached}:{...source,product:cached.product};
  return {source,cached,answer,dependencies,stale:dependencies.some(k=>cached[k]!==source[k]),reads:mode==='response'?0:2};
}
export function negativeInitial() { return {now:0,source:false,cached:null,reads:0,message:'Product 99 does not exist. Read it to cache the absence.'}; }
export function negativeStep(state,action,{cacheAbsence=true}={}) {
  const s={...state};
  if(action==='reset')return negativeInitial();
  if(action==='create'){s.source=true;s.message='Product 99 now exists in the source. The cached answer has not been changed.';return s;}
  if(action==='advance'){s.now+=5;if(s.cached&&s.now>=s.cached.expires)s.cached=null;s.message=`Time is ${s.now} seconds. ${s.cached?'The cached answer still has time left.':'There is no usable cached answer.'}`;return s;}
  if(action==='delete'){s.cached=null;s.message='The cache entry is deleted. The source is unchanged.';return s;}
  if(action==='read'){
    if(s.cached&&s.now<s.cached.expires){s.message=`Cache hit: ${s.cached.found?'found':'not found'}. No source lookup.`;return s;}
    s.reads++;s.cached=s.source||cacheAbsence?{found:s.source,expires:s.now+10}:null;
    s.message=`Cache miss: source says ${s.source?'found':'not found'}. ${s.cached?'Save that answer for 10 seconds.':'Do not save the absence; the next read must try again.'}`;return s;
  }
  if(action==='error'){s.message='The source request failed. An error does not establish absence; no not-found entry is written.';return s;}
  throw new Error(`Unknown action ${action}`);
}
export function encodeTuple(parts) { return JSON.stringify(parts); }
