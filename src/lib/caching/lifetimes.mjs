/** Deliberately small deterministic teaching models, not Redis implementations. */
export function expiryTrace(ttl=6,sliding=false,until=24) {
 let cached=null,source=12;const events=[];
 for(let time=0;time<=until;time++) {
  if(time===1)source=15;
  if(cached&&cached.expires<=time)cached=null;
  if(time%3===0){const hit=!!cached;if(!hit)cached={value:source,loaded:time,expires:time+ttl};else if(sliding)cached={...cached,expires:time+ttl};events.push({time,hit,value:cached.value,stale:cached.value!==source,expires:cached.expires});}
 }
 return {now:until,source,cached,events,hits:events.filter(e=>e.hit).length,reads:events.filter(e=>!e.hit).length};
}
export const accessPatterns={hot:['A','B','A','B','A','B','C','D','A','B'],cycle:['A','B','C','A','B','C','A','B','C'],shift:['A','B','A','B','A','B','C','D','C','D','C','D']};
export function evictionTrace(pattern='hot',capacity=2,policy='lru',count=accessPatterns[pattern].length) {
 const resident=new Map(),events=[];const requests=accessPatterns[pattern];
 requests.slice(0,count).forEach((key,index)=>{
  const hit=resident.has(key);let evicted=null;
  if(!hit&&resident.size>=capacity){const candidates=[...resident.values()].sort((a,b)=>policy==='lfu'?(a.frequency-b.frequency||a.last-b.last):a.last-b.last);evicted=candidates[0].key;resident.delete(evicted);}
  const old=resident.get(key);resident.set(key,{key,last:index,frequency:(old?.frequency||0)+1});
  events.push({key,hit,evicted,resident:[...resident.values()].map(x=>({...x})).sort((a,b)=>a.last-b.last)});
 });
 return {requests,events,resident:events.at(-1)?.resident||[],hits:events.filter(e=>e.hit).length,misses:events.filter(e=>!e.hit).length};
}
export function byteTrace(admitLarge=true,count=7) {
 const requests=['A','B','C','L','A','B','C'],sizes={A:2,B:2,C:2,L:6},budget=8;
 const resident=new Map(),events=[];
 for(const [index,key] of requests.slice(0,count).entries()){
  const hit=resident.has(key),evicted=[],admitted=hit||key!=='L'||admitLarge;
  if(!hit&&admitted){while([...resident.values()].reduce((s,v)=>s+v.size,0)+sizes[key]>budget){const victim=[...resident.values()].sort((a,b)=>a.last-b.last)[0];resident.delete(victim.key);evicted.push(victim.key);}}
  if(admitted)resident.set(key,{key,size:sizes[key],last:index});
  events.push({key,hit,admitted,evicted,resident:[...resident.values()].map(x=>({...x}))});
 }
 return {requests,budget,events,resident:events.at(-1)?.resident||[],misses:events.filter(e=>!e.hit).length,hits:events.filter(e=>e.hit).length};
}
