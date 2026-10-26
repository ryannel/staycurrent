import test from 'node:test';import assert from 'node:assert/strict';
import {expiryTrace,evictionTrace,byteTrace} from './lifetimes.mjs';
test('fixed expiry forces fresh reload; sliding hits preserve source age',()=>{
 const fixed=expiryTrace(6,false),sliding=expiryTrace(6,true);
 assert.equal(fixed.events.find(e=>e.time===6).value,15);assert.equal(fixed.reads,5);
 assert.equal(sliding.reads,1);assert.equal(sliding.cached.value,12);assert.equal(sliding.cached.loaded,0);assert.equal(sliding.cached.expires,30);
 assert.equal(expiryTrace(3,true).hits,0);
 assert.equal(expiryTrace(6,false,2).cached.value,12);
});
test('capacity threshold and frequency change outcomes without changing requests',()=>{
 assert.equal(evictionTrace('cycle',2).hits,0);assert.equal(evictionTrace('cycle',3).hits,6);
 assert.ok(evictionTrace('hot',2,'lfu').hits>evictionTrace('hot',2,'lru').hits);
 for(const policy of ['lru','lfu'])for(const capacity of [2,3,4])for(const pattern of ['hot','cycle','shift']){
  const s=evictionTrace(pattern,capacity,policy);for(const e of s.events){assert.ok(e.resident.length<=capacity);assert.equal(new Set(e.resident.map(x=>x.key)).size,e.resident.length);assert.ok(e.resident.some(x=>x.key===e.key));}
 }
});
test('one large admission can displace several small values; bypass preserves reuse',()=>{
 const admitted=byteTrace(true),bypassed=byteTrace(false);
 assert.deepEqual(admitted.events[3].evicted,['A','B']);assert.equal(admitted.misses,7);
 assert.equal(bypassed.misses,4);assert.equal(bypassed.hits,3);
 for(const s of [admitted,bypassed])for(const e of s.events)assert.ok(e.resident.reduce((sum,v)=>sum+v.size,0)<=s.budget);
});
