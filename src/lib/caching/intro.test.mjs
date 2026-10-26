import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cacheAsideTrace, reuseTrace, latencyModel } from './intro.mjs';
test('a miss must load before filling; a hit cannot read the source', () => {
  const cold = cacheAsideTrace();
  assert.deepEqual(cold.map(s=>s.phase), ['ready','lookup','miss','load','source-return','fill','done']);
  assert.equal(cold.at(-1).cached, cold.at(-1).answer);
  const warm = cacheAsideTrace({cached:'v1',source:'v2'});
  assert.deepEqual(warm.map(s=>s.phase), ['ready','lookup','hit','done']);
  assert.equal(warm.at(-1).answer,'v1');
  assert.equal(warm.at(-1).source,'v2');
});
test('reuse depends on repeated keys, including empty cached strings', () => {
  assert.equal(cacheAsideTrace({cached:''})[2].phase,'hit');
  assert.equal(reuseTrace(Array(20).fill('A')).filter(s=>s.hit).length,19);
  assert.equal(reuseTrace(Array.from({length:20},(_,i)=>String(i))).filter(s=>s.hit).length,0);
  assert.equal(reuseTrace(['A','B','A'],1).filter(s=>s.hit).length,0);
});
test('latency model exposes miss penalty, break-even and percentile threshold', () => {
  assert.equal(latencyModel(0).mean,44);
  assert.equal(latencyModel(100).mean,2);
  assert.equal(latencyModel(90).sourceReads,10);
  assert.equal(latencyModel(98).p99,44);
  assert.equal(latencyModel(99).p99,2);
  const threshold=latencyModel(0).breakEven;
  assert.ok(Math.abs(latencyModel(threshold*100).mean-40)<1e-10);
});
