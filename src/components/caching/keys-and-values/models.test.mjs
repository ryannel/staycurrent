// Tests for the keys-and-values figure models. Each checks a result the
// article's prose quotes, with the seed the figure uses.
// Run: node --test src/components/caching/keys-and-values/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { granularity, expected, PAGES, PRODUCTS } from './granularity-model.mjs';
import { requests, evaluate, keyFor, SAMPLES, STEPS } from './normalise-model.mjs';
import { deploy, held } from './deploy-model.mjs';
import { readCost, MEASURED } from './compression-model.mjs';
import { fieldTtl } from './field-ttl-model.mjs';
import { negative, liveSentinels } from './negative-model.mjs';

test('granularity: 24 pages, 48 products, six pages per product', () => {
  assert.equal(PAGES.length, 24);
  assert.equal(PRODUCTS, 48);
  assert.equal(PAGES.filter(p => p.category === 0).length, 6);
});

test('granularity: the simulation agrees with r / (r + d)', () => {
  for (const changes of [12, 60, 120]) {
    const m = granularity({ changes, window: 1e6 }, 7);
    m.sim.advance(900000);
    const t = m.totals;
    const e = expected({ changes });
    assert.ok(Math.abs(t.pageHits / t.views - e.page) < 0.03, `page ${changes}`);
    assert.ok(Math.abs(t.productHits / t.productLookups - e.product) < 0.01, `product ${changes}`);
  }
});

test('granularity: prose numbers at 12 and 120 changes a minute', () => {
  const low = expected({ changes: 12 });
  const high = expected({ changes: 120 });
  assert.ok(low.page > 0.84 && low.page < 0.87);
  assert.ok(high.page > 0.45 && high.page < 0.48);
  assert.ok(high.product > 0.97);
  // Rows per view at 120 a minute: about 6 for pages against about 0.3 for products.
  const m = granularity({ changes: 120, window: 1e6 }, 7);
  m.sim.advance(900000);
  assert.ok(m.totals.pageRows / m.totals.views > 5.5);
  assert.ok(m.totals.productRows / m.totals.views < 0.5);
});

test('granularity: with no changes both caches always hit', () => {
  const m = granularity({ changes: 0 }, 7);
  m.sim.advance(60000);
  assert.equal(m.totals.pageHits, m.totals.views);
  assert.equal(m.totals.productHits, m.totals.productLookups);
});

test('normalise: quoted counts for 2,000 requests', () => {
  const list = requests();
  const r = Object.fromEntries(STEPS.map(s => [s.value, evaluate(list, s.value)]));
  assert.equal(r.raw.keys, 1620);
  assert.equal(r.sorted.keys, 1120);
  assert.equal(r.tracking.keys, 121);
  assert.equal(r.defaults.keys, 24);
  assert.equal(r.defaults.answers, 24);
  assert.equal(r.currency.keys, 12);
  assert.equal(r.defaults.wrong, 0);
  assert.ok(r.currency.wrong > 1000);
});

test('normalise: the six pound samples share one key once defaults are filled; euros stays apart', () => {
  const keys = SAMPLES.map(p => keyFor(p, 'defaults'));
  assert.equal(new Set(keys.slice(0, 6)).size, 1);
  assert.notEqual(keys[6], keys[0]);
  assert.equal(keyFor(SAMPLES[6], 'currency'), keyFor(SAMPLES[0], 'currency'));
});

test('deploy: strict readers keep failing after the last instance is replaced', () => {
  const m = deploy({ mode: 'strict' }, 4);
  const end = m.params.start + 5 * m.params.step;
  m.sim.advance(end + 5000);
  const before = m.totals.errors;
  m.sim.advance(10000);
  assert.ok(m.totals.errors > before, 'errors continue after the deploy finishes');
  m.sim.advance(m.params.ttl + 5000);
  const settled = m.totals.errors;
  m.sim.advance(10000);
  assert.equal(m.totals.errors, settled, 'errors stop once old entries expire');
});

test('deploy: tolerant and versioned never fail; tolerant reads the database more', () => {
  const tolerant = deploy({ mode: 'tolerant' }, 4);
  const versioned = deploy({ mode: 'versioned' }, 4);
  for (const m of [tolerant, versioned]) m.sim.advance(40000);
  assert.equal(tolerant.totals.errors, 0);
  assert.equal(versioned.totals.errors, 0);
  assert.ok(tolerant.totals.reads > versioned.totals.reads);
});

test('deploy: versioned keys go stale unless a change deletes every live version', () => {
  const own = deploy({ mode: 'versioned', start: 8000 }, 4);
  const all = deploy({ mode: 'versioned-all', start: 8000 }, 4);
  const shared = deploy({ mode: 'tolerant', start: 8000 }, 4);
  for (const m of [own, all, shared]) m.sim.advance(60000);
  assert.ok(own.totals.stale > 50, 'deleting only its own version leaves the other stale');
  assert.equal(all.totals.stale, 0);
  assert.equal(shared.totals.stale, 0);
  assert.ok(own.lastStale < 50000, 'stale reads end within about a TTL of the deploy');
});

test('deploy: versioned keys hold both versions during the deploy', () => {
  const m = deploy({ mode: 'versioned' }, 4);
  m.sim.advance(m.params.start + 5 * m.params.step);
  const h = held(m);
  assert.ok(h[1] > 50 && h[2] > 50);
});

test('compression: faster per read at 1 Gbit/s above 1 KB, slower at 10 Gbit/s', () => {
  for (let i = 1; i < MEASURED.length; i++) assert.ok(readCost(i, '1').saving > 10);
  for (let i = 0; i < MEASURED.length; i++) assert.ok(readCost(i, '10').saving < 0);
  assert.ok(readCost(0, '1').saving < 2);
});

test('field TTL: one TTL rebuilds the product about 11 times a minute; a field TTL never does', () => {
  const key = fieldTtl({ mode: 'key' }, 2);
  const field = fieldTtl({ mode: 'field' }, 2);
  key.sim.advance(600000); field.sim.advance(600000);
  assert.ok(key.totals.productBuilds / 10 > 10 && key.totals.productBuilds / 10 < 12);
  assert.equal(field.totals.productBuilds, 0);
  assert.ok(field.totals.stockReads / 10 > 10);
});

test('negative caching: absorbs repeated missing ids, not random ones', () => {
  const run = (neg, missing) => { const m = negative({ negative: neg, missing, animate: false }, 3); m.sim.advance(300000); return m; };
  const off = run('off', 'repeated');
  const onRepeated = run('on', 'repeated');
  const onRandom = run('on', 'random');
  const share = m => m.totals.absentDb / m.totals.absentLookups;
  assert.ok(share(off) > 0.98);
  assert.ok(share(onRepeated) < 0.2);
  assert.ok(share(onRandom) > 0.98);
  assert.ok(liveSentinels(onRandom) > 40);
});

test('negative caching: a filter of real ids stops random missing ids too, without markers', () => {
  const m = negative({ negative: 'filter', missing: 'random', animate: false }, 3);
  m.sim.advance(300000);
  const share = m.totals.absentDb / m.totals.absentLookups;
  assert.ok(share < 0.03, `share ${share}`);
  assert.equal(liveSentinels(m), 0);
});
