// Tests for the pure toolkit helpers. Run: node --test src/components/caching/shared/
import test from 'node:test';
import assert from 'node:assert/strict';
import { seededRandom, exponentialGap, zipf, Simulation, poissonArrivals, Movers, LruCache, Window, RecentRatio, quantile, formatValue } from './sim.mjs';
import { niceTicks, niceMax } from './chart.mjs';
import { stateAt } from './sequence.mjs';
import { cacheAside, updateCacheAside } from './demo/cache-aside-model.mjs';

test('seeded random numbers repeat for a seed and differ between seeds', () => {
  const a = seededRandom(42), b = seededRandom(42), c = seededRandom(43);
  const run = r => Array.from({ length: 50 }, () => r());
  const first = run(a);
  assert.deepEqual(first, run(b));
  assert.notDeepEqual(first, run(c));
  assert.ok(first.every(v => v >= 0 && v < 1));
});

test('exponential gaps average 1000 / rate milliseconds', () => {
  const r = seededRandom(1);
  let total = 0;
  for (let i = 0; i < 20000; i++) total += exponentialGap(r, 5);
  assert.ok(Math.abs(total / 20000 - 200) < 6, `mean gap ${total / 20000}`);
});

test('Zipf probabilities sum to one and samples follow them', () => {
  const z = zipf(1000, 1);
  let sum = 0;
  for (let k = 0; k < 1000; k++) sum += z.probability(k);
  assert.ok(Math.abs(sum - 1) < 1e-9);
  // Rank 0 has weight 1 / H(1000) ≈ 0.1336.
  assert.ok(Math.abs(z.probability(0) - 1 / 7.485470860550345) < 1e-9);
  const r = seededRandom(9);
  const counts = new Array(1000).fill(0);
  const n = 200000;
  for (let i = 0; i < n; i++) counts[z.sample(r)]++;
  for (const k of [0, 1, 9, 99]) {
    const expected = z.probability(k) * n;
    assert.ok(Math.abs(counts[k] - expected) < 4 * Math.sqrt(expected) + 5, `rank ${k}: ${counts[k]} vs ${expected.toFixed(0)}`);
  }
  assert.ok(counts[0] > counts[1] && counts[1] > counts[9] && counts[9] > counts[99]);
  // The top 10% of keys take well over half the requests at s = 1.
  assert.ok(z.topShare(100) > 0.65 && z.topShare(100) < 0.7);
  assert.equal(z.topShare(0), 0);
  assert.ok(Math.abs(z.topShare(1000) - 1) < 1e-12);
});

test('Zipf with s = 0 is uniform', () => {
  const z = zipf(10, 0);
  for (let k = 0; k < 10; k++) assert.ok(Math.abs(z.probability(k) - 0.1) < 1e-12);
});

test('events run in time order, ties in scheduling order', () => {
  const sim = new Simulation();
  const order = [];
  sim.at(50, () => order.push('b'));
  sim.at(10, () => order.push('a'));
  sim.at(50, () => order.push('c'));
  const id = sim.at(20, () => order.push('cancelled'));
  sim.cancel(id);
  sim.after(5, s => s.after(100, () => order.push('d')));
  sim.advance(60);
  assert.deepEqual(order, ['a', 'b', 'c']);
  assert.equal(sim.now, 60);
  sim.advance(60);
  assert.deepEqual(order, ['a', 'b', 'c', 'd']);
});

test('a model gives the same run however time is chunked', () => {
  const once = cacheAside({ capacity: 20 }, 5);
  once.sim.advance(60000);
  const chunked = cacheAside({ capacity: 20 }, 5);
  for (let i = 0; i < 3600; i++) chunked.sim.advance(1000 / 60);
  assert.ok(Math.abs(chunked.sim.now - 60000) < 1e-6);
  assert.deepEqual(chunked.stats, once.stats);
  assert.ok(once.stats.requests > 100);
});

test('Poisson arrivals follow a rate that can change while running', () => {
  const sim = new Simulation({ seed: 3 });
  let rate = 10, count = 0;
  poissonArrivals(sim, () => rate, () => count++);
  sim.advance(100000);
  assert.ok(Math.abs(count - 1000) < 100, `count ${count}`);
  rate = 0; const before = count;
  sim.advance(10000);
  assert.equal(count, before);
});

test('movers report progress and arrive', () => {
  const sim = new Simulation();
  const movers = new Movers(sim);
  let arrived = 0;
  movers.add({ edge: 'a-b', duration: 200, kind: 'hit', onArrive: () => arrived++ });
  sim.advance(50);
  assert.equal(movers.active()[0].t, 0.25);
  sim.advance(200);
  assert.equal(arrived, 1);
  assert.equal(movers.size, 0);
});

test('LRU cache evicts the least recently used key and honours expiry', () => {
  const c = new LruCache(2);
  c.set('a', 1); c.set('b', 2);
  c.get('a');
  assert.deepEqual(c.set('c', 3), ['b']);
  assert.deepEqual(c.keys(), ['a', 'c']);
  c.set('t', 4, { now: 0, ttl: 100 });
  assert.ok(c.get('t', 99));
  assert.equal(c.get('t', 100), undefined);
  assert.equal(c.expirations, 1);
  assert.deepEqual(c.resize(0), ['c']);
  assert.equal(c.size, 0);
});

test('windows, recent ratios and quantiles', () => {
  const w = new Window(1000);
  w.add(0); w.add(500); w.add(900);
  assert.equal(w.count(950), 3);
  assert.equal(w.rate(1200), 2);
  const r = new RecentRatio(4);
  [1, 1, 0, 0, 1].forEach(v => r.add(v));
  assert.equal(r.value, 0.5);
  assert.equal(quantile([1, 2, 3, 4, 5], 0.5), 3);
  assert.equal(quantile([0, 10], 0.99), 9.9);
});

test('an LRU cache-aside model hits less often than an ideal cache of its size', () => {
  const model = cacheAside({ capacity: 20, keys: 100, skew: 1, rate: 200, animate: false }, 2);
  model.sim.advance(60000);
  const ideal = model.popularity.topShare(20);
  const observed = model.stats.hits / model.stats.requests;
  // LRU keeps some unpopular keys that were requested recently, so it falls short of
  // holding exactly the 20 most popular keys (about 69% of requests here).
  assert.ok(observed > 0.5 && observed < ideal, `observed ${observed}, ideal ${ideal}`);
  assert.equal(updateCacheAside(model, { capacity: 100 }), true);
  assert.equal(model.cache.size, 100);
  assert.equal(updateCacheAside(model, { keys: 50 }), false);
});

test('axis ticks are round and cover the range', () => {
  assert.deepEqual(niceTicks(0, 250, 4), [0, 100, 200]);
  assert.deepEqual(niceTicks(0, 60, 6), [0, 10, 20, 30, 40, 50, 60]);
  assert.deepEqual(niceTicks(0, 1, 4), [0, 0.25, 0.5, 0.75, 1]);
  assert.equal(niceMax(87), 100);
  assert.equal(niceMax(0), 1);
});

test('sequence lane state accumulates to the current step', () => {
  const spec = { initial: { redis: 'empty', db: 'v1' }, steps: [{ state: { db: 'v2' } }, {}, { state: { redis: 'v1' } }] };
  assert.deepEqual(stateAt(spec, -1).state, { redis: 'empty', db: 'v1' });
  const at2 = stateAt(spec, 2);
  assert.deepEqual(at2.state, { redis: 'v1', db: 'v2' });
  assert.deepEqual([...at2.changed], ['redis']);
});

test('parameter formatting', () => {
  assert.equal(formatValue(0.8, 'percent'), '80%');
  assert.equal(formatValue(2500, 'number', 'keys'), '2,500 keys');
  assert.equal(formatValue(2, 'multiplier'), '2×');
});
