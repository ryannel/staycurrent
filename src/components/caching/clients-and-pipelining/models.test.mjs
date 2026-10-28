// Checks the numbers the article and figure text quote from these models.
// Run: node --test src/components/caching/clients-and-pipelining/
import test from 'node:test';
import assert from 'node:assert/strict';
import { schedule, totals, batchTime } from './ladder-model.mjs';
import { wall, predicted } from './tail-model.mjs';
import { create as retryModel } from './retry-model.mjs';
import { create as counterModel } from './counter-model.mjs';

const near = (actual, expected, tolerance, what) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${what}: ${actual} not within ${tolerance} of ${expected}`);

test('ladder: 24 and 48 values by each method', () => {
  const t24 = totals(24), t48 = totals(48);
  near(t24.sequential / 1000, 12.3, 0.05, '24 one at a time (ms)');
  near(t24.pipeline / 1000, 0.56, 0.01, '24 pipelined (ms)');
  near(t24.mget / 1000, 0.56, 0.01, '24 by MGET (ms)');
  near(t48.sequential / 1000, 24.5, 0.05, '48 one at a time (ms)');
  near(t48.pipeline / 1000, 0.6, 0.02, '48 pipelined (ms)');
  near(t48.mget / 1000, 0.62, 0.02, '48 by MGET (ms)');
  near(schedule({ n: 1, method: 'sequential' }).total / 1000, 0.51, 0.01, 'one value (ms)');
});

test('ladder: Redis is about 1.4% of the one-at-a-time wait', () => {
  const s = schedule({ n: 24, method: 'sequential' });
  assert.equal(s.trips, 24);
  near(s.redisTime / 1000, 0.17, 0.01, 'Redis time (ms)');
  near((100 * s.redisTime) / s.total, 1.4, 0.1, 'Redis share (%)');
  assert.equal(schedule({ n: 24, method: 'pipeline' }).trips, 1);
  assert.equal(schedule({ n: 24, method: 'mget' }).trips, 1);
});

test('batch arithmetic', () => {
  assert.equal(batchTime({ n: 1000, b: 100, rtt: 1, perValue: 0 }), 10);
  assert.equal(batchTime({ n: 1000, b: 1000, rtt: 1, perValue: 0.001 }), 2);
});

test('tail: independent slow round trips follow 1 − 0.99^k', () => {
  near(predicted(24), 0.214, 0.001, 'predicted at 24');
  near(predicted(100), 0.634, 0.001, 'predicted at 100');
  // Averaged over many walls of 100 pages.
  const avg = (k, pattern) => {
    let pages = 0;
    for (let seed = 1; seed <= 200; seed++) pages += wall({ k, pattern, seed }).slowPages;
    return pages / 200 / 100;
  };
  near(avg(1, 'independent'), 0.01, 0.005, 'k = 1');
  near(avg(24, 'independent'), 0.214, 0.02, 'k = 24');
  near(avg(100, 'independent'), 0.634, 0.02, 'k = 100');
  // The figure's first drawing (seed 8) is close to the expectation.
  assert.equal(wall({ k: 24, seed: 8 }).slowPages, 21);
  assert.equal(wall({ k: 24, pattern: 'bursts', seed: 8 }).slowPages, 4);
  const bursts = avg(24, 'bursts');
  assert.ok(bursts > 0.02 && bursts < 0.07, `bursts at 24: ${bursts}`);
});

test('retries: none and budget recover, unlimited retries do not', () => {
  const run = policy => {
    const m = retryModel({ policy }, 4);
    m.sim.advance(15000);
    const during = m.recentStats();
    m.sim.advance(10000);
    const after = m.recentStats();
    m.sim.advance(35000);
    return { during, after, end: m.recentStats() };
  };
  const none = run('none'), retry = run('retry'), budget = run('budget');
  assert.ok(none.after.queue < 10 && none.after.failedShare < 0.05, 'no retries recovers by 25 s');
  assert.ok(budget.after.queue < 10 && budget.after.failedShare < 0.05, 'budget recovers by 25 s');
  near(budget.during.perRequest, 1.1, 0.06, 'budget attempts per request during the slowdown');
  assert.ok(retry.after.perRequest > 3.5, `retry attempts per request ${retry.after.perRequest}`);
  assert.ok(retry.end.queue > retry.after.queue && retry.end.queue > 1000, 'retry queue keeps growing');
  assert.ok(retry.end.wastedShare > 0.99, 'every reply wasted');
  assert.ok(none.during.wastedShare > 0.5, 'more than half wasted during the slowdown');
});

test('counter: GET then SET loses increments; WATCH and INCR do not', () => {
  const run = method => { const m = counterModel({ method }, 2); m.sim.advance(60000); return m; };
  const getset = run('getset'), watch = run('watch'), incr = run('incr'), script = run('script');
  near(getset.stats.writes, 125, 10, 'GET-SET increments executed');
  near(getset.redis.value, 48, 8, 'GET-SET counter value');
  assert.equal(watch.lost(), 0);
  assert.equal(incr.lost(), 0);
  near(watch.redis.value, 37, 6, 'WATCH counter value');
  near(watch.stats.trips / watch.stats.writes, 8, 1, 'WATCH round trips per increment');
  near(watch.stats.aborted / (watch.stats.aborted + watch.stats.writes), 0.75, 0.06, 'WATCH share refused');
  near(incr.redis.value, 220, 10, 'INCR increments');
  near(incr.stats.trips / incr.stats.writes, 1, 0.02, 'INCR round trips per increment');
  near(getset.stats.trips / getset.stats.writes, 2, 0.05, 'GET-SET round trips per increment');
  assert.equal(script.lost(), 0);
  assert.equal(script.stats.aborted, 0);
  near(script.redis.value, 220, 10, 'script increments');
  near(script.stats.trips / script.stats.writes, 1, 0.02, 'script round trips per increment');
});
