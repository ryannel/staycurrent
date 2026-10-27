// Checks that the numbers the introduction's prose and text alternatives quote
// come out of the models with the seeds the figures use.
// Run: node --test src/components/caching/introduction/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quantile } from '../shared/sim.mjs';
import { repeatedWork, cacheAside, updateCacheAside, expectedTtlHitRatio, costOf, missPositions, latencySamples, popularityGroups, itemsFor } from './model.mjs';

const near = (actual, expected, tolerance, what) => assert.ok(Math.abs(actual - expected) <= tolerance, `${what}: ${actual} not within ${tolerance} of ${expected}`);
const mean = values => values.reduce((a, b) => a + b, 0) / values.length;

test('figure 1: most database queries repeat an answer already computed', () => {
  const m = repeatedWork({ rate: 3 }, 6);
  m.sim.advance(61000);
  near(m.stats.queries, 170, 15, 'queries after a minute');
  near(m.stats.distinct, 42, 6, 'distinct products');
  near(m.repeatShare(), 0.75, 0.05, 'repeat share');
  near(m.computed[0], 40, 5, 'product:1 computations');
  // Doubling visitors doubles queries but not distinct answers.
  const fast = repeatedWork({ rate: 6 }, 6);
  fast.sim.advance(61000);
  near(fast.stats.queries / m.stats.queries, 2, 0.25, 'queries scale with rate');
  assert.ok(fast.stats.distinct < 50);
});

test('figure 3: the hit ratio climbs from zero and settles near the TTL model', () => {
  const p = { keys: 100, skew: 1, rate: 4, ttl: 60000 };
  near(expectedTtlHitRatio(p), 0.78, 0.005, 'expected long-run hit ratio');
  const m = cacheAside(p, 3);
  m.sim.advance(31000);
  const early = m.stats.hits / m.stats.requests;
  assert.ok(early > 0.5 && early < 0.68, `"a little over half" after 30 s: ${early}`);
  // Long run, non-animated (same seed sequence), averaged over many requests.
  const long = cacheAside({ ...p, animate: false }, 3);
  long.sim.advance(300000);
  const h0 = long.stats.hits, r0 = long.stats.requests;
  long.sim.advance(1200000);
  near((long.stats.hits - h0) / (long.stats.requests - r0), 0.78, 0.02, 'steady hit ratio');
});

test('figure 4: the arithmetic quoted in the text', () => {
  const rows = [[0, 21, 1000], [0.5, 11, 500], [0.9, 3, 100], [0.95, 2, 50], [0.99, 1.2, 10], [0.999, 1.02, 1]];
  for (const [h, latency, reads] of rows) {
    const c = costOf(h);
    near(c.mean, latency, 1e-9, `mean at ${h}`);
    near(c.databaseReads, reads, 1e-9, `reads at ${h}`);
    assert.equal(missPositions(h).size, reads);
  }
  near(costOf(0.95).databaseReads / costOf(0.99).databaseReads, 5, 1e-9, 'fivefold');
});

test('figure 5: the median is a hit; the p99 is a miss until under 1% miss', () => {
  const at = h => { const { hits, misses } = latencySamples(h); const all = [...hits, ...misses]; return { p50: quantile(all, 0.5), p99: quantile(all, 0.99), mean: mean(all) }; };
  for (const h of [0.8, 0.9, 0.95]) {
    const r = at(h);
    assert.ok(r.p50 < 1.5, `p50 at ${h} is a hit: ${r.p50}`);
    assert.ok(r.p99 >= 30, `p99 at ${h} is a miss of 30 ms or more: ${r.p99}`);
  }
  near(at(0.98).p99, 22, 1.5, 'p99 at 98%');
  near(at(0.995).p99, 2.5, 0.3, 'p99 at 99.5%');
  near(at(0.95).mean, 2.2, 0.15, 'mean at 95%');
});

test('figure 6: request shares quoted for each exponent', () => {
  const top = (s, groups) => popularityGroups(s).slice(0, groups).reduce((a, b) => a + b, 0);
  near(top(0, 10), 0.10, 1e-9, 'uniform top 10%');
  near(top(0.64, 1), 0.18, 0.005, 's=0.64 top 1%');
  near(top(0.83, 1), 0.38, 0.005, 's=0.83 top 1%');
  near(top(0.64, 10), 0.43, 0.005, 's=0.64 top 10%');
  near(top(0.83, 10), 0.63, 0.005, 's=0.83 top 10%');
  near(top(1, 1), 0.62, 0.005, 's=1 top 1%');
  near(top(1, 10), 0.81, 0.005, 's=1 top 10%');
  near(itemsFor(0.9, 1), 0.30, 0.005, 's=1 items for 90%');
  near(top(1.2, 1), 0.85, 0.005, 's=1.2 top 1%');
  near(itemsFor(0.9, 1.2), 0.03, 0.002, 's=1.2 items for 90%');
});

test('figure 7: LRU falls short of the ideal cache of the same size', () => {
  const run = capacity => {
    const m = cacheAside({ keys: 2500, skew: 1, rate: 500, capacity, animate: false, warm: true, prerun: 30000 }, 2);
    const h0 = m.stats.hits, r0 = m.stats.requests;
    m.sim.advance(200000);
    return { lru: (m.stats.hits - h0) / (m.stats.requests - r0), ideal: m.popularity.topShare(capacity) };
  };
  const quoted = { 25: [0.29, 0.45], 250: [0.62, 0.73], 1000: [0.84, 0.89] };
  for (const [capacity, [lru, ideal]] of Object.entries(quoted)) {
    const r = run(Number(capacity));
    near(r.lru, lru, 0.015, `LRU at ${capacity}`);
    near(r.ideal, ideal, 0.006, `ideal at ${capacity}`);
  }
});

test('figure 10: losing Redis multiplies database reads by about 1 / (1 - h)', () => {
  const p = { keys: 400, skew: 1, rate: 100, ttl: 60000, dbCapacity: 40, animate: false, sample: 500, prerun: 120000, warm: 'staggered' };
  near(expectedTtlHitRatio(p), 0.945, 0.005, 'expected hit ratio');
  const m = cacheAside(p, 5);
  const window = (from, to) => m.samples.filter(s => s.t > from && s.t <= to);
  // Staggered expiry: the 40 s of history shown on arrival is level, not a wave.
  const history = window(80, 120).map(s => s.demand);
  near(mean(history), 5, 1.5, 'reads needed in the history shown on arrival');
  // The readouts (last 2 s) on arrival are near the steady state.
  const arrival = m.samples.slice(-4);
  near(mean(arrival.map(s => s.hitRatio)), 0.95, 0.03, 'hit ratio readout on arrival');
  m.sim.advance(30000);
  near(mean(window(120, 150).map(s => s.demand)), 5, 1.5, 'reads needed while running');
  near(mean(window(120, 150).map(s => s.hitRatio)), 0.95, 0.015, 'hit ratio while running');
  updateCacheAside(m, { redis: 'down' });
  m.sim.advance(30000);
  const down = window(151, 180);
  near(mean(down.map(s => s.demand)), 100, 6, 'reads needed while down');
  near(mean(down.map(s => s.failed)), 60, 6, 'failed while down');
  updateCacheAside(m, { redis: 'up' });
  assert.equal(m.cache.size, 0, 'Redis returns empty');
  m.sim.advance(60000);
  const back = window(180, 240);
  assert.ok(back.slice(0, 2).some(s => s.failed > 0), 'failures in the first second back');
  assert.ok(back.slice(10).every(s => s.demand < 40), 'under capacity after five seconds');
  assert.ok(mean(back.slice(20).map(s => s.demand)) < 10, 'a handful a second after ten seconds');
});
