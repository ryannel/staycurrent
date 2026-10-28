import test from 'node:test';
import assert from 'node:assert/strict';
import { createWorkload, advance, arrive, finalWorkload, readRequests } from './workload.mjs';
import { scene } from './scene.mjs';
import { lessons } from './lessons.mjs';

for (const interval of [1600, 800, 320]) test(`same workload at ${interval}ms: six local misses, three shared`, () => {
  const state = createWorkload();
  let next = 19000, index = 0, maximum = 0;
  for (let time = 0; time <= 125000; time += 20) {
    advance(state, time);
    if (time >= next && index < 64) { arrive(state, time, index++); next = time + interval; }
    maximum = Math.max(maximum, state.requests.length);
    if (time % 1000 === 0) assert.doesNotMatch(lessons.placement.render(Math.min(1, time / 19000), 'story', state), /NaN|Infinity/);
  }
  assert.deepEqual(state.panels[0].misses, [3, 3]);
  assert.deepEqual(state.panels[1].misses, [3, 0]);
  assert.equal(state.panels[0].reads, 6);
  assert.equal(state.panels[1].reads, 3);
  assert.equal(state.panels[0].lookups, 66);
  assert.equal(state.panels[1].lookups, 66);
  assert(maximum <= 14);
  assert.equal(state.requests.length, 0);
});

test('a shared lookup before its fill still misses; requests are not silently coalesced', () => {
  const state = createWorkload();
  advance(state, 19000);
  arrive(state, 19000, 0); // P8 on A
  arrive(state, 19100, 8); // P8 on B, deliberately before the fill
  advance(state, 20000);
  assert.equal(state.panels[1].misses[0], 3); // P7 plus both P8 lookups
  assert(!state.panels[1].caches[0].has(1));
  advance(state, 23000);
  assert(state.panels[1].caches[0].has(1));
});

test('first diagram ends after one P7 miss, fill and reply', () => {
  assert.deepEqual(readRequests, [{ at: .6, key: 0, miss: true, speed: 1 }]);
  assert.equal(scene.duration, 10000);
  assert(readRequests[0].at + 8.8 < scene.duration / 1000);
  for (let i = 0; i <= 100; i++) assert.doesNotMatch(scene.render(i / 100), /NaN|Infinity/);
  assert.match(scene.render(1), /1 cache miss/);
  assert.doesNotMatch(scene.render(1), /P8|P9/);
  assert.deepEqual(finalWorkload().panels.map(p => p.misses.reduce((a,b) => a+b)), [6,3]);
});
