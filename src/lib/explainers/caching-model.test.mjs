import test from 'node:test';
import assert from 'node:assert/strict';
import { createCachingState, cachingStep } from './caching-model.mjs';
const step = cachingStep;
test('a reused response avoids a source read, until its absolute expiry', () => {
 let s = step(createCachingState(), {type:'read', id:'mug'});
 for (let i=0;i<4;i++) s=step(s,{type:'tick'});
 s=step(s,{type:'read',id:'mug'}); assert.equal(s.reads,1); assert.equal(s.hits,1);
 s=step(s,{type:'tick'}); s=step(s,{type:'read',id:'mug'}); assert.equal(s.reads,2);
});
test('invalidation gives next sequential reader new data; no invalidation leaves a stale hit', () => {
 for (const invalidate of [true,false]) {
  let s=createCachingState(); s.invalidate=invalidate; s=step(s,{type:'read',id:'mug'}); s=step(s,{type:'write'}); s=step(s,{type:'read',id:'mug'});
  assert.equal(s.last.version,invalidate?2:1); assert.equal(s.source[0].version,2);
 }
});
test('least recently used copy is evicted; outages bypass and restart rebuilds', () => {
 let s=createCachingState(); for(const id of ['mug','bowl','mug','plate']) s=step(s,{type:'read',id});
 assert.deepEqual(s.entries.map(e=>e.id).sort(),['mug','plate']);
 s=step(s,{type:'outage'}); s=step(s,{type:'read',id:'mug'}); assert.equal(s.last.from,'Catalogue');
 s=step(s,{type:'restart'}); assert.equal(s.entries.length,0); const n=s.reads;
 s=step(s,{type:'read',id:'mug'}); assert.equal(s.reads,n+1);
});
