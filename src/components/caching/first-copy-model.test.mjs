import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reuseTrace, cacheCost, copyAt, requestJourney } from './first-copy-model.mjs';
test('reuse counts first observations as misses and preserves the key identity', () => {
  for (const distinct of [1, 4, 12, 24]) {
    const trace = reuseTrace(distinct);
    assert.equal(trace.filter(r => !r.hit).length, distinct);
    assert.equal(trace.at(-1).copies, distinct);
    assert.ok(trace.slice(0, distinct).every(r => !r.hit));
    assert.ok(trace.slice(distinct).every(r => r.hit));
  }
});
test('cost is the average of explicitly enumerated request paths', () => {
  for (const h of [0, 50, 90, 100]) for (const d of [1, 20, 80]) {
    const c = cacheCost(h, d);
    const paths = Array.from({length:100}, (_, i) => i < h ? 2 : 2+d+2);
    assert.ok(Math.abs(paths.reduce((a,b)=>a+b,0)/100-c.mean) < 1e-9);
  }
  assert.ok(cacheCost(100, 1).mean > 1);
  assert.ok(Math.abs(cacheCost(100*4/22,20).mean - 20) < 1e-9);
});
test('expiry does not refresh and invalidation leaves source records intact', () => {
  assert.deepEqual(copyAt(0), {source:18,cached:18,stale:false,ttl:10});
  assert.deepEqual(copyAt(5), {source:15,cached:18,stale:true,ttl:5});
  assert.equal(copyAt(9.9).cached,18);
  assert.equal(copyAt(10).cached,null);
  assert.equal(copyAt(12).cached,null);
  assert.equal(copyAt(5,true).cached,null);
  assert.equal(copyAt(5,true).source,15);
});
test('only the miss queries the source; fill precedes a synchronous reply', () => {
  assert.ok(!requestJourney(true).some(s=>s.to==='source'));
  const steps=requestJourney(false);
  assert.equal(steps.filter(s=>s.to==='source').length,1);
  assert.equal(steps.at(-1).to,'reader');
  assert.match(steps[5].label,/SET/);
});
