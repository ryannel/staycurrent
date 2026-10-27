// Checks the numbers that the article and figure texts quote from these models.
// Run: node --test src/components/caching/expiration-and-eviction/models.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { hitRatio, staleShare, databaseReads, ttlForHitRatio, oneKey, setTtl } from './ttl-model.mjs';
import { expiryModel, heldCount } from './expiry-model.mjs';
import { refreshRates, peakBetween, firstWaveRate } from './jitter-model.mjs';
import { memoryModel, plainCount } from './memory-model.mjs';
import { samplingModel } from './sampling-model.mjs';
import { expectedAccesses, expectedCounter } from './lfu-model.mjs';
import { lfuIncrement, SampledCache } from './sampled-cache.mjs';
import { scanModel, meanBetween, paced } from './scan-model.mjs';
import { seededRandom } from '../shared/sim.mjs';

const near = (actual, expected, tolerance, what) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${what}: ${actual} not within ${tolerance} of ${expected}`);

test('TTL formulas: the numbers quoted for Figures 1 and 2', () => {
  near(hitRatio(1, 10), 10 / 11, 1e-12, 'hit ratio, r=1, T=10');
  near(staleShare(1 / 30, 10), 0.15, 0.005, 'stale share, Figure 1');
  near(databaseReads(1, 10), 1 / 11, 1e-12, 'database reads');
  near(ttlForHitRatio(1, 0.9), 9, 1e-9, 'TTL for 90% at one read a second');
  near(ttlForHitRatio(1 / 60, 0.9), 540, 1e-9, 'TTL for 90% at one read a minute');
  near(staleShare(1 / 3600, 9), 0.00125, 0.0001, 'stale share, 9 s TTL, hourly changes');
  near(staleShare(1 / 3600, 540), 0.071, 0.002, 'stale share, 9 min TTL, hourly changes');
  near(staleShare(1 / 3600, 1), 1 / 7200, 1e-6, 'small-λT approximation');
});

test('Figure 1 simulation agrees with the formulas over a long run', () => {
  const m = oneKey({ ttl: 10 }, 1);
  m.sim.advance(36000e3);
  const { hits, misses, stale } = m.stats;
  near(hits / (hits + misses), hitRatio(1, 10), 0.01, 'simulated hit ratio');
  near(stale / hits, staleShare(1 / 30, 10), 0.02, 'simulated stale share');
});

test('Figure 1: after a TTL change the counts start from the first copy with the new TTL', () => {
  const m = oneKey({ ttl: 10 }, 685);
  m.sim.advance(20e3); setTtl(m, { ttl: 30 });
  m.sim.advance(15e3); setTtl(m, { ttl: 3 });
  const changedAt = m.sim.now;
  assert.equal(m.copy, null, 'the old copy is dropped');
  m.sim.advance(10e3);
  const firstRead = m.reads.find(r => r.t >= changedAt);
  assert.equal(firstRead.kind, 'miss', 'the first read after the change stores a new copy');
  assert.equal(m.statsFrom, firstRead.t, 'counting starts at that miss');
  assert.ok(m.copies.filter(c => c.from >= changedAt).every(c => c.to - c.from === 3000), 'new copies carry the new TTL');
  const long = oneKey({ ttl: 30 }, 3); long.sim.advance(600e3); setTtl(long, { ttl: 3 }); long.sim.advance(36000e3);
  near(long.stats.hits / (long.stats.hits + long.stats.misses), hitRatio(1, 3), 0.01, 'hit ratio after the change');
  near(long.stats.stale / long.stats.hits, staleShare(1 / 30, 3), 0.01, 'stale share after the change');
});

test('Figure 3: without the active cycle, expired keys pile up', () => {
  const on = expiryModel({ active: true }, 1); on.sim.advance(60e3);
  const off = expiryModel({ active: false }, 1); off.sim.advance(60e3);
  assert.ok(heldCount(on) <= 5, `held with cycle on: ${heldCount(on)}`);
  assert.ok(heldCount(off) > 150, `held with cycle off: ${heldCount(off)}`);
});

test('Figure 4: jitter arithmetic and model', () => {
  near(firstWaveRate(10000, 600, 0.1), 83.3, 0.1, 'N / 2jT');
  const none = refreshRates({ jitter: 0 }, 7);
  assert.ok(peakBetween(none, 300, 900) >= 1000, 'no jitter: one 10-second bin holds every key');
  const ten = refreshRates({ jitter: 0.1 }, 7);
  const first = peakBetween(ten, 300, 900), fourth = peakBetween(ten, 2100, 2500);
  near(first, 90, 3, 'first wave at ±10%, busiest 10 s');
  near(fourth, 56, 3, 'fourth wave at ±10%');
  assert.ok(fourth < first * 0.8, `later waves are lower: ${fourth} vs ${first}`);
  near(peakBetween(refreshRates({ jitter: 0.3 }, 7), 300, 900), 33, 2, 'first wave at ±30%');
  assert.ok(peakBetween(refreshRates({ jitter: 0.05 }, 7), 300, 900) < 200, '±5% fits under the 200 axis');
});

test('Figure 5: policies', () => {
  const run = policy => { const m = memoryModel({ policy }, 5, { plainRate: 0.75 }); m.sim.advance(90e3); return m; };
  const no = run('noeviction'), vol = run('volatile-lru'), all = run('allkeys-lru');
  assert.ok(no.stats.refused > 0 && no.stats.evicted === 0, 'noeviction refuses and evicts nothing');
  assert.ok(vol.stats.refused > 0 && vol.stats.evictedPlain === 0, 'volatile-lru never evicts keys without a TTL, and starves');
  assert.equal(plainCount(vol), vol.slots, 'volatile-lru: keys without a TTL fill memory');
  assert.ok(all.stats.refused === 0 && all.stats.evictedPlain > 0, 'allkeys-lru refuses nothing and evicts keys without a TTL');
});

test('Figure 6: sampling sharpens eviction, with diminishing returns', () => {
  const share = samples => { const m = samplingModel({ samples }, 1); m.sim.advance(600e3); return m.fromOldestTenth / m.evictions; };
  near(share(1), 0.1, 0.04, 'one sample is random');
  near(share(5), 0.5, 0.08, 'five samples');
  near(share(10), 0.7, 0.08, 'ten samples');
  near(share(20), 0.75, 0.08, 'twenty samples');
  near(1 - 0.9 ** 5, 0.41, 0.005, 'pool-free formula, k=5');
  near(1 - 0.9 ** 10, 0.65, 0.005, 'pool-free formula, k=10');
});

test('Figure 7: LFU counter arithmetic', () => {
  assert.equal(expectedAccesses(10, 10), 105);
  near(expectedAccesses(50, 10), 10000, 100, 'to reach 50');
  near(expectedAccesses(255, 10), 311500, 1, 'to reach 255');
  near(expectedAccesses(255, 1), 31375, 1, 'factor 1');
  near(expectedAccesses(255, 100), 3112750, 1, 'factor 100');
  near(expectedCounter(100, 10), 10, 0.5, 'after 100');
  near(expectedCounter(1000, 10), 19, 1.5, 'after 1,000');
  near(expectedCounter(1e5, 10), 147, 1, 'after 100,000');
  // At 15, an access counts with probability 1/101.
  let hits = 0; const n = 200000; let seed = 1;
  const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < n; i++) if (lfuIncrement(15, 10, random) === 16) hits++;
  near(hits / n, 1 / 101, 0.001, 'increment probability at 15');
});

test('SampledCache keeps capacity and evicts through the pool', () => {
  const c = new SampledCache({ capacity: 50, policy: 'lru', random: seededRandom(3) });
  for (let i = 0; i < 500; i++) c.set(`k${i}`, i * 1000);
  assert.equal(c.entries.size, 50);
  assert.equal(c.evictions, 450);
});

test('Figure 9: a scan hurts sampled LRU and barely touches sampled LFU', () => {
  const m = scanModel({}, 1); m.sim.advance(80e3);
  const lruBefore = meanBetween(m, 'lru', 5, 20), lruDuring = meanBetween(m, 'lru', 20, 30);
  const lfuBefore = meanBetween(m, 'lfu', 5, 20), lfuDuring = meanBetween(m, 'lfu', 20, 30);
  assert.ok(lruDuring < lruBefore * 0.8, `LRU drops by about a quarter: ${lruBefore} → ${lruDuring}`);
  assert.ok(lfuDuring > lfuBefore * 0.93, `LFU barely moves: ${lfuBefore} → ${lfuDuring}`);
  assert.ok(meanBetween(m, 'lru', 35, 60) > lruBefore * 0.95, 'LRU recovers');
});

test('Figure 9 at 1 request a minute per cached key: decay costs LFU its scan resistance, a longer decay restores it', () => {
  const mean = (decay, id, from, to) => {
    let sum = 0;
    for (const seed of [1, 2, 3, 4, 5]) { const m = scanModel({}, seed, paced(36, decay)); m.sim.advance(140 * 36 * 1000); sum += meanBetween(m, id, from * 36, to * 36); }
    return sum / 5;
  };
  near(mean(1, 'lfu', 5, 20), 0.43, 0.01, 'LFU before, decay 1');
  near(mean(1, 'lfu', 20, 30), 0.34, 0.01, 'LFU during, decay 1');
  near(mean(1, 'lru', 5, 20), 0.42, 0.01, 'LRU before');
  near(mean(1, 'lru', 20, 30), 0.30, 0.01, 'LRU during');
  near(mean(10, 'lfu', 5, 20), 0.50, 0.01, 'LFU before, decay 10');
  near(mean(10, 'lfu', 20, 30), 0.49, 0.01, 'LFU during, decay 10');
});
