// Tests for the stampedes article's models: the numbers the prose quotes must
// come out of these models with their seeds.
// Run: node --test src/components/caching/stampedes/*.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { seededRandom } from '../shared/sim.mjs';
import { hotKey } from './hotkey-model.mjs';
import { poolStampede } from './pool-model.mjs';
import { coldStart } from './coldstart-model.mjs';
import { cycle, fastCycle, summarise, expectedSize, paperBound, expectedLead, rebuildChance } from './xfetch-model.mjs';
import { lockSpec, hazardSpecs } from './sequences.mjs';

const mean = xs => xs.reduce((a, b) => a + b, 0) / xs.length;
const episodesAfterWarmup = m => m.episodes.slice(1);

test('unprotected: queries per expiry average rate × rebuild time (1 s here)', () => {
  for (const rate of [5, 15, 30]) {
    const m = hotKey({ mode: 'none', rate }, 7);
    m.sim.advance(600000);
    const q = mean(episodesAfterWarmup(m).map(e => e.queries));
    assert.ok(Math.abs(q - rate) / rate < 0.12, `rate ${rate}: ${q}`);
  }
});

test('single-flight: at most one query per process per expiry', () => {
  const m = hotKey({ mode: 'singleflight', rate: 15 }, 7);
  m.sim.advance(300000);
  for (const e of m.episodes) assert.ok(e.queries <= 4);
  assert.ok(mean(episodesAfterWarmup(m).map(e => e.queries)) > 3.5);
});

test('lock: one query per expiry; waiters take longer than a hit', () => {
  const m = hotKey({ mode: 'lock', rate: 15 }, 7);
  m.sim.advance(300000);
  for (const e of m.episodes) assert.equal(e.queries, 1);
  assert.ok(m.last.slowest >= 1200);
});

test('serve stale: one query per expiry and no request waits for the database', () => {
  const m = hotKey({ mode: 'stale', rate: 15 }, 7);
  m.sim.advance(300000);
  for (const e of m.episodes) assert.equal(e.queries, 1);
  assert.ok(m.last.slowest <= 200, `slowest ${m.last.slowest}`);
  assert.ok(m.totals.stale > 0);
});

test('pool: 500 a second, 200 ms, 20 connections', () => {
  const r = poolStampede({ rate: 500 });
  assert.equal(r.misses, 100);
  assert.equal(r.firstStored, 200);
  assert.equal(r.busyUntil, 1200);
  assert.ok(Math.abs(r.otherWait - 322) < 1);
  const small = poolStampede({ rate: 100 });
  assert.equal(small.misses, 20);
  assert.equal(small.otherWait, 0);
  assert.ok(Math.abs(poolStampede({ rate: 1000 }).otherWait - 901) < 1);
});

test('cold start: one rebuild per key removes the duplicate third and recovers sooner', () => {
  const every = coldStart({ mode: 'every' }, 1); every.sim.advance(60000);
  const perkey = coldStart({ mode: 'perkey' }, 1); perkey.sim.advance(60000);
  const dup = every.totals.duplicates / every.totals.queries;
  assert.ok(dup > 0.3 && dup < 0.42, `duplicate share ${dup}`);
  assert.equal(perkey.totals.duplicates, 0);
  assert.equal(every.recoveredAt, 10);
  assert.equal(perkey.recoveredAt, 7);
  const peak = m => Math.max(...m.samples.map(s => s.wait));
  assert.ok(peak(every) > 4000 && peak(perkey) < 2000, `${peak(every)} ${peak(perkey)}`);
});

test('XFetch: the paper’s quoted value and the derived expectation', () => {
  assert.ok(Math.abs(paperBound(1) - (Math.E - 1 / Math.E)) < 1e-12);
  assert.ok(Math.abs(expectedSize(1) - Math.E) < 1e-12);
  assert.equal(rebuildChance(0, 1), 1);
  assert.ok(Math.abs(rebuildChance(1, 1) - 1 / Math.E) < 1e-12);
  // 500 requests a second, 200 ms rebuild: 100 requests per rebuild time.
  assert.ok(Math.abs(expectedLead(100, 1) * 0.2 - 1.036) < 0.001);
});

test('XFetch: simulated stampede size is e^(1/β), whatever the rate', () => {
  for (const beta of [0.5, 1, 2]) for (const rate of [100, 10000]) {
    const s = summarise(seededRandom(3), { rate, beta, cycles: 40000 });
    assert.ok(Math.abs(s.size - expectedSize(beta)) / expectedSize(beta) < 0.03, `beta ${beta} rate ${rate}: ${s.size}`);
    assert.ok(Math.abs(s.lead - expectedLead(rate, beta)) < 0.05 * expectedLead(rate, beta));
  }
});

test('XFetch: request-by-request cycles agree with the fast sampler (Poisson and evenly spaced)', () => {
  for (const arrivals of ['poisson', 'even']) {
    const s = summarise(seededRandom(5), { rate: 100, beta: 1, cycles: 3000, method: 'brute', arrivals });
    assert.ok(Math.abs(s.size - Math.E) < 0.15, `${arrivals}: ${s.size}`);
  }
  const c = cycle(seededRandom(1), { rate: 10, beta: 1 });
  assert.ok(c.requests.length > 0 && c.size >= 1);
  assert.ok(fastCycle(seededRandom(1), { rate: 10, beta: 1 }).size >= 1);
});

test('sequences: every step has an explanation', () => {
  for (const spec of [lockSpec, hazardSpecs.del, hazardSpecs.delex]) for (const s of spec.steps) assert.ok(s.explanation.length > 10);
});
