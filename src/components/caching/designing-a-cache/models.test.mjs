// node --test src/components/caching/designing-a-cache/models.test.mjs
// Checks the numbers the article quotes come out of the models.
import test from 'node:test';
import assert from 'node:assert/strict';
import { budget, family, saleMisses, ttlShare, ttlCurve, rateAt, GB } from './budget-model.mjs';
import { refill, topFor } from './recovery-model.mjs';
import { create, mean, settledAt } from './playground-model.mjs';
import { zipf, LruCache, seededRandom } from '../shared/sim.mjs';

const near = (actual, expected, tolerance, label) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: ${actual} not within ${tolerance} of ${expected}`);

test('a TTL alone caps the product hit ratio whatever the memory', () => {
  near(family({ ttl: 60 }).hit, 0.422, 0.002, '1 minute');
  near(family({ ttl: 600 }).hit, 0.623, 0.002, '10 minutes');
  near(family({ ttl: 3600 }).hit, 0.796, 0.002, '1 hour');
  near(family({ ttl: 21600 }).hit, 0.931, 0.002, '6 hours');
  near(family({ ttl: 86400 }).hit, 0.979, 0.002, '24 hours');
  near(family({ ttl: 5 }).hit, 0.252, 0.002, 'stock, 5 seconds');
  near(ttlShare(1, 9), 0.9, 1e-9, 'rT / (1 + rT)');
});

test('the popularity curve against a TTL', () => {
  const minute = ttlCurve(60);
  assert.equal(minute.above, 4152, 'products read at least once a minute');
  near(minute.belowReads, 0.592, 0.002, 'their share of reads');
  near(ttlCurve(3600).belowReads, 0.193, 0.002, 'reads of products read less than hourly');
  near(ttlCurve(3600).above / 2e6, 0.196, 0.002, 'share of products read at least hourly');
  near(ttlCurve(60, { s: 0.8 }).hit, 0.276, 0.002, 'exponent 0.8, 1 minute');
  near(rateAt(1), 30.1, 0.1, 'the most popular product');
  near(1 / rateAt(1e6) / 3600, 2.32, 0.01, 'the median product, hours between reads');
});

test('the budget for the steps the article walks through', () => {
  const naive = budget({ fresh: 'ttl', ttl: 60, maxmemory: 2 });
  near(naive.total, 1386, 2, 'TTL only, 1 minute');
  near(naive.rows.stock, 748, 1, 'stock with a 5-second TTL');
  near(naive.memoryBytes / GB, 0.07, 0.01, 'memory in use');
  near(budget({ fresh: 'ttl', ttl: 86400, maxmemory: 4 }).total, 829, 2, 'TTL only, 24 hours, 4 GB');
  near(budget({ fresh: 'delete', ttl: 60, maxmemory: 2 }).total, 1236, 2, 'deletes, 1 minute');
  near(budget({ fresh: 'delete', ttl: 86400, maxmemory: 2 }).total, 336, 2, '2 GB');
  near(budget({ fresh: 'delete', ttl: 86400, maxmemory: 3 }).total, 199, 2, '3 GB');
  const at35 = budget({ fresh: 'delete', ttl: 86400, maxmemory: 3.5 });
  near(at35.total, 147, 1, '3.5 GB');
  near(at35.hit, 0.956, 0.002, '3.5 GB: page reads that hit');
  assert.equal(at35.limit, 'memory', '3.5 GB: memory still the limit');
  const design = budget({ fresh: 'delete', ttl: 86400, maxmemory: 4 });
  assert.equal(design.limit, 'ttl', 'the design, 4 GB: memory stops being the limit');
  near(design.total, 123, 1, 'the design');
  near(design.rows.product, 22, 1, 'the design: products');
  near(design.rows.stock, 41, 1, 'the design: stock');
  near(design.hit, 0.969, 0.002, 'the design: page reads that hit');
  near(design.product.hit, 0.979, 0.002, 'the design: product details that hit');
  near(design.product.keys, 1.831e6, 2e3, 'the design: products held');
  near(design.memoryBytes / GB, 3.80, 0.01, 'the design: memory used');
  near(budget({ maxmemory: 5 }).total, design.total, 0.01, '5 GB buys nothing more');
  near(budget({ maxmemory: 4, checkout: 'cache' }).total, 83, 1, 'checkout from Redis');
  near(budget({ maxmemory: 3.5, skew: 0.8 }).total, 181, 1, 'exponent 0.8, 3.5 GB');
  near(budget({ maxmemory: 4, skew: 0.8 }).total, 124, 1, 'exponent 0.8, 4 GB');
  near(budget({ maxmemory: 3.5, traffic: 2 }).total, 284, 1, 'twice the traffic, 3.5 GB');
  const twice = budget({ maxmemory: 4, traffic: 2 });
  near(twice.total, 204, 1, 'twice the traffic, 4 GB');
  near(twice.memoryBytes / GB, 3.97, 0.01, 'twice the traffic, 4 GB: memory used');
  near(saleMisses(), 19.6, 0.1, 'stock misses after sales');
});

test('the hit ratio needed follows the budget, not a fixed 92.5%', () => {
  const today = budget({ maxmemory: 4 });
  near(today.need, 0.925, 1e-9, 'today: 1 − (210 − 60) ÷ 2,000');
  assert.ok(today.hit >= today.need && !today.overAlert, 'today: met, under the alert line');
  near(budget({ maxmemory: 4, checkout: 'cache' }).need, 0.905, 1e-9, 'checkout from Redis: 1 − (210 − 20) ÷ 2,000');
  const twice35 = budget({ maxmemory: 3.5, traffic: 2 });
  near(twice35.need, 0.9775, 1e-9, 'twice the peak: 1 − (210 − 120) ÷ 4,000');
  assert.ok(twice35.hit < twice35.need, 'twice the peak at 3.5 GB: 95.9% does not meet the need');
  assert.ok(twice35.overAlert && !twice35.overCapacity, 'twice the peak at 3.5 GB: over the alert line, under capacity');
  const twice4 = budget({ maxmemory: 4, traffic: 2 });
  assert.ok(twice4.hit >= twice4.need && !twice4.overAlert, 'twice the peak at 4 GB: just met');
  for (const d of [{ fresh: 'ttl', ttl: 60, maxmemory: 2 }, { maxmemory: 2 }, { maxmemory: 3 }, { maxmemory: 3.5, skew: 0.8 }, { maxmemory: 4, traffic: 2, skew: 0.8 }]) {
    const b = budget(d);
    assert.equal(b.hit >= b.need, !b.overAlert, `need met exactly when under the alert line: ${JSON.stringify(d)}`);
  }
});

test('the shop at full size refills in hours', () => {
  const restart = refill({ queries: 2 });
  near(restart.refusedUntil / 3600, 2.33, 0.05, 'empty restart: hours of refusals');
  near(restart.refusedPages, 1.2e6, 0.05e6, 'empty restart: pages refused');
  const version = refill({ queries: 1, room: 199 });
  near(version.refusedUntil / 3600, 0.86, 0.05, 'new key version: hours of refusals');
  near(version.refusedPages, 404e3, 10e3, 'new key version: pages refused');
  assert.ok(refill({ queries: 1, room: 199, ramp: 120 }).refusedPages > 350e3, 'a two-minute ramp barely helps');
  assert.equal(refill({ queries: 1, room: 199, ramp: 1.25 * 3600, until: 12 * 3600 }).refusedPages, 0, 'a ramp of an hour and a quarter refuses nothing');
  near(topFor(0.80), 370e3, 3e3, 'products carrying 80% of reads');
});

test('the LRU-with-TTL approximation agrees with a simulation', () => {
  const n = 20000, reads = 1000, capacity = 6000, ttl = 120;
  const keys = zipf(n, 0.9), random = seededRandom(5), cache = new LruCache(capacity);
  let hits = 0, count = 0;
  const total = 1_600_000, dt = 1 / reads;
  for (let i = 0; i < total; i++) {
    const now = i * dt, key = keys.sample(random), entry = cache.get(key, now);
    if (i >= total / 2) { count++; if (entry) hits++; }
    if (!entry) cache.set(key, 1, { now, ttl });
  }
  near(family({ n, reads, ttl, capacity }).hit, hits / count, 0.01, 'model against simulation');
});

function run(params, incident, at = 30, until = 240) {
  const m = create(params, 1);
  m.sim.advance(at * 1000);
  if (incident) m[incident]();
  m.sim.advance((until - at) * 1000);
  return m;
}

test('the playground starts warm', () => {
  const m = run({}, null, 0, 60);
  near(mean(m.samples, 'hit', 10, 60), 0.925, 0.01, 'hit ratio');
  near(mean(m.samples, 'demand', 10, 60), 139, 8, 'database work a second');
});

test('losing the primary, by decision', () => {
  const design = run({}, 'failPrimary');
  assert.equal(design.totals.checkoutFails, 0, 'the design: no checkout fails');
  assert.equal(settledAt(design.samples, 'readFail', 0.01, 31), 37, 'the design: pages back 6 to 7 s after');
  near(mean(design.samples, 'readFail', 30, 60), 0.15, 0.02, 'the design: pages failed over the half minute');
  const noLimit = run({ limit: 'none' }, 'failPrimary');
  near(mean(noLimit.samples, 'checkoutFail', 30, 60), 0.98, 0.02, 'no limit: checkouts failing for the next 30 s');
  assert.equal(settledAt(noLimit.samples, 'readFail', 0.01, 31), 64, 'no limit: pages fail until the backlog clears');
  const single = run({ topology: 'single' }, 'failPrimary');
  assert.equal(single.totals.checkoutFails, 0, 'one server with the limit: no checkout fails');
  assert.equal(settledAt(single.samples, 'readFail', 0.01, 31), 65, 'one server: pages back after the cold start');
  const stuck = run({ topology: 'single', limit: 'none' }, 'failPrimary');
  assert.ok(stuck.samples.at(-1).readFail > 0.95 && stuck.samples.at(-1).hit < 0.01, 'one server, no limit: never recovers');
  const shared = run({ topology: 'single', limit: 'shared' }, 'failPrimary');
  near(mean(shared.samples, 'checkoutFail', 30, 60), 0.81, 0.05, 'one shared limit: checkouts fail during the cold start');
});

test('a key version change, by rollout', () => {
  const all = run({}, 'deploy');
  assert.equal(all.totals.checkoutFails, 0, 'all at once with the limit: no checkout fails');
  assert.equal(settledAt(all.samples, 'readFail', 0.01, 31), 62, 'all at once: pages refused while it fills');
  const stuck = run({ limit: 'none' }, 'deploy');
  assert.ok(stuck.samples.at(-1).readFail > 0.3, 'all at once, no limit: stuck');
  const convert = run({ rollout: 'convert', limit: 'none' }, 'deploy');
  assert.equal(convert.totals.readFails + convert.totals.checkoutFails, 0, 'converting old entries needs no limit');
  near(mean(convert.samples, 'hit', 30, 60), 0.925, 0.01, 'converting old entries keeps the hit ratio');
});
