// Tests for the article's pure models. Run: node --test src/components/caching/cluster-and-hot-keys/*.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { crc16, keySlot, hashedPart, evenRanges, parseKeys, placement } from './slots.mjs';
import { addServer } from './placement-model.mjs';
import { nodeLoads, zipfShares, CAPACITY } from './hotshard-model.mjs';
import { RUNS, EVENTS, seriesFor, downtime } from './failover-data.mjs';
import { TOOL_ROWS } from './tools-data.mjs';
import { redirectSpecs, trackingSpecs, raceSpecs, asmSpec } from './sequences.mjs';

test('CRC16 matches the cluster specification check value', () => {
  assert.equal(crc16(new TextEncoder().encode('123456789')), 0x31c3);
});

test('key slots match CLUSTER KEYSLOT on Redis 8.10.3 (evidence C3)', () => {
  const observed = {
    'product:42': 12456, 'product:43': 8329, 'user:{123}:profile': 5970, 'foo{}{bar}': 8363,
    'foo{{bar}}zap': 4015, 'foo{bar}{zap}': 5061, '123456789': 12739, 'product:0': 4129, 'product:1': 0,
    '{user}:123:profile': 5474,
  };
  for (const [key, slot] of Object.entries(observed)) assert.equal(keySlot(key), slot, key);
});

test('hash tags: first { and the first } after it, non-empty', () => {
  assert.deepEqual(hashedPart('foo{}{bar}'), { start: 0, end: 10, tagged: false });
  assert.equal('foo{{bar}}zap'.slice(hashedPart('foo{{bar}}zap').start, hashedPart('foo{{bar}}zap').end), '{bar');
});

test('placement of an MGET', () => {
  const nodes = evenRanges(3).map(r => [r]);
  const { keys } = parseKeys('MGET product:42 product:43');
  assert.deepEqual(keys, ['product:42', 'product:43']);
  const p = placement(keys, nodes);
  assert.equal(p.slots, 2); assert.equal(p.nodes, 2);
  assert.equal(placement(['user:{123}:profile', 'user:{123}:cart'], nodes).slots, 1);
});

test('adding a server: mod moves about N/(N+1), slots about 1/(N+1) and lose nothing', () => {
  for (const n of [2, 3, 4, 5, 8]) {
    const mod = addServer('mod', n), slots = addServer('slots', n);
    assert.ok(Math.abs(mod.moved - n / (n + 1)) < 0.03, `mod ${n}: ${mod.moved}`);
    assert.ok(Math.abs(slots.moved - 1 / (n + 1)) < 0.02, `slots ${n}: ${slots.moved}`);
    assert.equal(slots.lost, 0);
    assert.equal(mod.lost, mod.moved);
  }
  // The figure's text quotes these for 4 → 5 servers.
  assert.equal(Math.round(addServer('mod', 4).moved * 100), 80);
  assert.equal(Math.round(addServer('ring', 4).moved * 100), 18);
  assert.equal(Math.round(addServer('slots', 4).moved * 100), 20);
});

test('the ring is well mixed: about 1/(N+1) moves and every server holds about 1/(N+1)', () => {
  for (let n = 2; n <= 8; n++) {
    const r = addServer('ring', n), ideal = 1 / (n + 1);
    assert.ok(Math.abs(r.moved - ideal) < 0.04, `ring ${n} moved ${r.moved}`);
    for (const share of r.shares) assert.ok(Math.abs(share - ideal) / ideal < 0.25, `ring ${n} share ${share}`);
  }
});

test('hot-shard numbers quoted in the prose', () => {
  const r = s => n => nodeLoads({ shards: n, s });
  const s1 = r(1);
  assert.equal(Math.round(s1(3).max / 1000), 250);
  assert.equal(Math.round(s1(3).usable * 100), 80);
  assert.equal(Math.round(s1(12).max / 1000), 100);
  assert.equal(Math.round(s1(12).usable * 100), 50);
  assert.equal(Math.round(s1(48).max / 1000), 75);
  assert.equal(Math.round(s1(48).usable * 100), 17);
  assert.equal(Math.round(s1(48).ceiling / 1e5), 8);
  assert.equal(Math.round(s1(12).topKeyReads / 100), 496);
  assert.equal(Math.round(r(1.2)(12).topKeyReads / 1000), 118);
  assert.ok(r(1.2)(48).topKeyReads > CAPACITY);
  assert.equal(Math.round(r(0.8)(12).topKeyReads / 1000), 13);
  assert.equal(Math.round(CAPACITY / zipfShares(1)[0] / 1e5), 12);
});

test('the hottest key\'s segment: all of its reads, on one node unless a remedy spreads them', () => {
  for (const n of [3, 12, 48]) {
    const r = nodeLoads({ shards: n, s: 1 });
    assert.equal(r.hotLoads.filter(v => v > 0).length, 1);
    assert.ok(Math.abs(r.hotLoads.reduce((a, b) => a + b, 0) - r.topKeyReads) < 1e-6);
  }
  assert.equal(nodeLoads({ shards: 12, s: 1, remedy: 'copies' }).hotLoads.filter(v => v > 0).length, 4);
  assert.equal(Math.round(nodeLoads({ shards: 12, s: 1, remedy: 'near' }).hotLoads.reduce((a, b) => a + b, 0)), 40);
  assert.equal(Math.round(nodeLoads({ shards: 6, s: 1 }).max / 1000), 138);
});

test('remedy numbers quoted in the prose', () => {
  const at = remedy => nodeLoads({ shards: 12, s: 1, remedy });
  assert.equal(Math.round(at('copies').max / 1000), 56);
  assert.equal(Math.round(at('copies').usable * 100), 89);
  assert.equal(at('copies').extraKeys, 30);
  assert.equal(Math.round(at('replicas').max / 1000), 50);
  assert.equal(at('replicas').nodes, 24);
  assert.equal(Math.round(at('replicas').usable * 100), 50);
  assert.equal(Math.round(at('near').redisReads / 10000), 27);
  assert.equal(Math.round(at('near').max / 1000), 23);
});

test('failover data: lengths, events and outages', () => {
  for (const run of Object.values(RUNS)) for (const series of Object.values(run)) assert.equal(series.length, 72);
  assert.equal(seriesFor('replica').failedDown, 21);
  assert.equal(seriesFor('replica').othersDown, 1);
  assert.equal(seriesFor('nocover').othersDown, 10);
  assert.equal(seriesFor('partial').othersDown, 0);
  assert.equal(downtime(RUNS.partial.C), 30);
  assert.equal((EVENTS.replica.promoted - EVENTS.replica.detected).toFixed(1), "1.1");
});

test('tool data: true counts in order, LFU compresses them', () => {
  const ranked = TOOL_ROWS.filter(r => r.lfu !== null);
  for (let i = 1; i < ranked.length; i++) assert.ok(ranked[i].requests < ranked[i - 1].requests);
  assert.equal(Math.round(ranked[0].requests / ranked.at(-1).requests), 17);
});

test('sequence specs name only their own lanes', () => {
  for (const specs of [redirectSpecs, trackingSpecs, raceSpecs, { asmSpec }]) for (const spec of Object.values(specs)) {
    const ids = new Set(spec.lanes.map(l => l.id));
    for (const step of spec.steps) for (const id of [step.from, step.to, step.at].filter(Boolean)) assert.ok(ids.has(id), `${spec.label}: ${id}`);
  }
});

test('a sloped reply leaves the lane its request arrived at, at an earlier step', () => {
  for (const spec of Object.values(raceSpecs)) for (const [i, step] of spec.steps.entries()) if (step.departs !== undefined) {
    const origin = spec.steps[step.departs];
    assert.ok(step.departs < i && origin.to === step.from && origin.from === step.to, `${spec.label}: step ${i + 1}`);
  }
});
