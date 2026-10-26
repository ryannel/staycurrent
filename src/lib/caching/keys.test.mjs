import {test} from 'node:test';
import assert from 'node:assert/strict';
import {keyRequests,keyFor,keyTrace,representationState,negativeInitial,negativeStep,encodeTuple} from './keys.mjs';
test('incomplete keys produce unsafe hits; full answer identity produces useful reuse',()=>{
  const bad=keyTrace();assert.equal(bad.slots.length,1);assert.equal(bad.results.filter(r=>r.hit).length,5);assert.equal(bad.results.filter(r=>!r.correct).length,4);
  const good=keyTrace(['shop','language','currency']);assert.equal(good.slots.length,4);assert.equal(good.results.filter(r=>r.hit).length,2);assert.ok(good.results.every(r=>r.correct));
  assert.equal(keyTrace(['shop','language','currency','viewer']).slots.length,6);
});
test('all request pairs with complete keys agree on answers; selection order is canonical',()=>{
  assert.equal(keyFor(keyRequests[0],['currency','shop']),keyFor(keyRequests[0],['shop','currency']));
  for(const r of keyTrace(['shop','language','currency']).results)assert.ok(r.correct);
  assert.notEqual(encodeTuple(['a:b','c']),encodeTuple(['a','b:c']));
  assert.equal(['a:b','c'].join(':'),['a','b:c'].join(':'));
});
test('cached dependency choice determines which source change can stale the answer',()=>{
  assert.equal(representationState('response','category').answer.category,'Kitchen');
  assert.equal(representationState('response','category').stale,true);
  assert.equal(representationState('entity','category').answer.category,'Gifts');
  assert.equal(representationState('entity','category').stale,false);
  assert.equal(representationState('entity','price').reads,2);
});
test('cached absence survives source creation until expiry or invalidation',()=>{
  let s=negativeStep(negativeInitial(),'read');assert.equal(s.reads,1);assert.equal(s.cached.found,false);
  s=negativeStep(s,'create');s=negativeStep(s,'read');assert.equal(s.reads,1);assert.equal(s.cached.found,false);
  s=negativeStep(s,'advance');s=negativeStep(s,'advance');assert.equal(s.cached,null);
  s=negativeStep(s,'read');assert.equal(s.reads,2);assert.equal(s.cached.found,true);
});
test('uncached absence repeats work and a failed source lookup cannot become not found',()=>{
  let s=negativeStep(negativeInitial(),'read',{cacheAbsence:false});s=negativeStep(s,'read',{cacheAbsence:false});assert.equal(s.reads,2);assert.equal(s.cached,null);
  assert.equal(negativeStep(negativeInitial(),'error').cached,null);
});
