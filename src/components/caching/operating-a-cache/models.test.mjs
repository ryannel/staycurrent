// node --test src/components/caching/operating-a-cache/models.test.mjs
// Checks the numbers the article and the figures' text alternatives quote.
import test from 'node:test';
import assert from 'node:assert/strict';
import { outage, warmup } from './shop-model.mjs';
import { zones, classify, loadLines, X_MAX } from './capacity-model.mjs';
import { clipPath } from '../shared/chart.mjs';
import { chain } from './sizing-model.mjs';
import { series, at } from './incidents-model.mjs';

const near = (actual, expected, tolerance, what) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${what}: ${actual} not within ${tolerance} of ${expected}`);

test('capacity zones (Figure 1)', () => {
  assert.equal(zones(0.9).stable, 300);
  near(zones(0.9).vulnerable, 3000, 1e-6, '90% warm limit');
  near(zones(0.99).vulnerable, 30000, 1e-6, '99% warm limit');
  assert.equal(classify(1000, 0.9), 'vulnerable');
  assert.equal(classify(1000, 0.5), 'overloaded');
});

test('Figure 1 lines keep their slope when they leave the plot', () => {
  // The chart's y axis stops at 1,200; a clipped line must still cross 300 where the arithmetic says.
  const W = 600, H = 200, xs = v => (v / X_MAX) * W, ys = v => H - (v / 1200) * H;
  const crossing = points => {
    const d = clipPath(points.map(([x, y]) => [xs(x), ys(y)]), 0, H);
    const pts = [...d.matchAll(/[ML](-?[\d.]+) (-?[\d.]+)/g)].map(m => [Number(m[1]), Number(m[2])]);
    const [a, b] = pts;
    const slope = (b[1] - a[1]) / (b[0] - a[0]);
    return ((ys(300) - a[1]) / slope + a[0]) / W * X_MAX;   // x where the drawn line meets 300
  };
  for (const h of [0.5, 0.8, 0.9, 0.95, 0.99]) {
    const lines = loadLines(h);
    near(crossing(lines.cold), 300, 15, `empty-cache line crosses capacity, h=${h}`);
    near(crossing(lines.warm), 300 / (1 - h), 15 / (1 - h), `warm line crosses capacity, h=${h}`);
  }
});

test('outage without a limit (Figure 2)', () => {
  const m = outage({ limit: 'none' }, 1); m.sim.advance(170000);
  const s = m.samples;
  near(s[10].answered, 0.41, 0.01, 'first second of outage');
  assert.equal(s[11].answered, 0);
  near(s[39].wait / 1000, 70, 1, 'queue at 40 s');
  const back = s.findIndex((x, i) => i >= 40 && s.slice(i, i + 5).every(y => y.answered > 0.995)) + 1;
  near(back, 144, 2, 'full recovery second');
  near(m.totals.wasted, 40000, 600, 'wasted queries');
});

test('outage with a limit of 60 (Figure 2)', () => {
  const m = outage({ limit: 60 }, 1); m.sim.advance(170000);
  const s = m.samples;
  const during = s.slice(10, 40).reduce((a, x) => a + x.answered, 0) / 30;
  near(during, 0.30, 0.02, 'answered during outage');
  assert.equal(m.totals.wasted, 0);
  assert.ok(s.slice(41, 60).every(x => x.answered > 0.995));
  near(s[39].wait / 1000 + 8 / 300, 0.2, 0.03, 'an admitted query finishes within a fifth of a second');
});

test('limits that are too low and too high (Figure 2)', () => {
  const run = limit => { const m = outage({ limit }, 1); m.sim.advance(170000); return m; };
  const during = m => m.samples.slice(10, 40).reduce((a, x) => a + x.answered, 0) / 30;
  const before = m => m.samples.slice(1, 10).reduce((a, x) => a + x.answered, 0) / 9;
  const four = run(4), three = run(300), six = run(600);
  near(during(four), 0.14, 0.01, 'limit 4 during outage');
  near(1 - before(four), 0.02, 0.01, 'limit 4 refuses some requests even before the outage');
  near(during(three), 0.18, 0.015, 'limit 300 during outage');
  near(three.totals.wasted, 3800, 200, 'limit 300 wasted');
  assert.ok(during(six) < 0.02, 'limit 600 answers almost nothing during the outage');
  assert.ok(six.samples.slice(43, 60).every(x => x.answered > 0.995), 'limit 600 recovers within 3 s');
});

test('warm-up strategies (Figure 3)', () => {
  const run = strategy => { const m = warmup({ strategy }, 1); m.sim.advance(170000); return m; };
  const first = (m, level) => m.samples.find(x => x.t > 10 && x.newHit != null && x.newHit >= level).t - 10;
  const all = run('all'), ramp = run('ramp'), old = run('old');
  near(all.totals.failed, 2000, 100, 'refused, all at once');
  near(first(all, 0.8), 30, 3, 'all at once reaches 80%');
  assert.equal(ramp.totals.failed, 0);
  assert.ok(ramp.peak <= 215, `ramp peak ${ramp.peak}`);
  assert.ok(all.peak <= 306, `all at once: finished queries a second stay at capacity, ${all.peak}`);
  near(first(ramp, 0.8), 70, 3, 'ramp reaches 80%');
  near(first(ramp, 0.85), 88, 4, 'ramp reaches 85%');
  assert.equal(old.totals.failed, 0);
  assert.ok(old.peak <= 125, `old-cache peak ${old.peak}`);
  near(first(old, 0.8), 25, 3, 'old-cache reads reach 80%');
});

test('sizing chain (Figure 5)', () => {
  const one = chain(1, 'cache');
  // Client buffers come out of maxmemory: 870 MB less about 20 MB leaves about 850 MB for data.
  near(one.maxmemory / 2 ** 20, 870.4, 0.1, 'maxmemory in 1 GB');
  near(one.clients / 2 ** 20, 20.5, 0.1, 'client buffers in 1 GB');
  near(one.dataBytes / 2 ** 20, 849.9, 0.1, 'cached data in 1 GB');
  assert.equal(one.products, Math.floor(one.dataBytes / 2130), 'products fill only the data');
  near(one.products, 418406, 1, 'products in 1 GB');
  near(one.hit, 0.814, 0.002, '1 GB hit ratio');
  near(one.dbReads, 186, 1, '1 GB database reads');
  const forked = chain(1, 'fork');
  near(forked.products, 241969, 1, 'products in 1 GB, 50% reserve');
  near(forked.dbReads / one.dbReads, 4 / 3, 0.05, '50% reserve raises the load by about a third');
  near(chain(0.5, 'fork').dbReads, 314, 1, '512 MB with the fork reserve is over capacity');
  const two = chain(2, 'cache'), four = chain(4, 'cache');
  near(four.catalogueShare, 0.84, 0.005, '4 GB catalogue share');
  near(four.hit, 0.98, 0.005, '4 GB hit ratio');
  near(one.dbReads - two.dbReads, 80, 8, 'first doubling saves');
  near(two.dbReads - four.dbReads, 80, 8, 'second doubling saves');
});

test('measured incidents (Figure 4)', () => {
  const small = series('small'), ttl = series('ttl'), rename = series('rename'), flush = series('flush');
  near(at(small.recent, 420), 0.78, 0.01, 'small, last 10 s');
  near(at(small.sinceStart, 420), 0.807, 0.002, 'small, since start');
  near(at(small.evictions, 300), 200, 20, 'small, evictions a second');
  near(at(ttl.recent, 420), 0.65, 0.01, 'ttl, last 10 s');
  near(at(ttl.keys, 420), 3753, 0, 'ttl, keys');
  assert.ok(Math.max(...ttl.evictions.map(p => p[1])) === 0, 'ttl, no evictions');
  near(Math.min(...rename.recent.map(p => p[1])), 0.62, 0.01, 'rename, lowest');
  near(Math.max(...rename.keys.map(p => p[1])), 25869, 0, 'rename, most keys');
  near(Math.min(...flush.recent.map(p => p[1])), 0.62, 0.01, 'flush, lowest');
  assert.ok(Math.min(...flush.keys.map(p => p[1])) < 100, 'flush empties the cache');
});
