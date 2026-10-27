// node --test src/components/caching/invalidation/*.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { simulateKeys } from './race-model.mjs';
import { racingSetTimes, caughtShare, replicaRaceShare } from './double-delete-model.mjs';
import { createWindow } from './window-model.mjs';
import { createFanout, pageIds } from './fanout-model.mjs';
import { stateAt } from '../shared/sequence.mjs';
import { raceSpecs, leaseSpecs, versionSpecs, outboxSpecs, markerSpecs } from './sequences.mjs';

const finalState = spec => stateAt(spec, spec.steps.length - 1).state;

test('race model: share of time stale is close to writes a second × mean fill time', () => {
  for (const [writesPerHour, fillMs] of [[60, 50], [60, 200], [600, 50]]) {
    const r = simulateKeys({ writesPerHour, fillMs, ttlSeconds: 600 }, 50, 1);
    const ratio = r.staleShare / r.predictedShare;
    assert.ok(ratio > 0.7 && ratio < 1.3, `${writesPerHour}/h ${fillMs} ms: ratio ${ratio}`);
  }
});

test('race model: a shorter TTL gives more, shorter stale periods for about the same share', () => {
  const short = simulateKeys({ writesPerHour: 60, fillMs: 50, ttlSeconds: 60 }, 50, 1);
  const long = simulateKeys({ writesPerHour: 60, fillMs: 50, ttlSeconds: 3600 }, 50, 1);
  assert.ok(short.races > long.races, `${short.races} vs ${long.races}`);
  assert.ok(short.longest <= 61, `longest with a 60 s TTL is ${short.longest}`);
  assert.ok(Math.abs(short.staleShare - long.staleShare) / long.staleShare < 0.3);
});

test('race model: the figure default (one write a minute, 50 ms fills) gives tens of races a day across fifty keys', () => {
  const r = simulateKeys({ writesPerHour: 60, fillMs: 50, ttlSeconds: 600 }, 50, 1);
  assert.ok(r.races >= 30 && r.races <= 150, String(r.races));
});

test('double delete: a longer delay catches more, and never all, of the primary races', () => {
  const t = racingSetTimes({ source: 'primary' });
  const at100 = caughtShare(t, 100), at500 = caughtShare(t, 500), at2000 = caughtShare(t, 2000);
  assert.ok(at100 < at500 && at500 < at2000);
  assert.ok(at2000 < 0.97, `2 s catches ${at2000}`);
  assert.ok(at500 < 0.9, `500 ms catches ${at500}`);
});

test('double delete: reading a lagging replica moves stale sets later', () => {
  const p = racingSetTimes({ source: 'primary' }), r = racingSetTimes({ source: 'replica', lag: 500 });
  assert.ok(caughtShare(r, 100) < caughtShare(p, 100));
  assert.ok(Math.abs(replicaRaceShare(500, 2) - (1 - Math.exp(-1))) < 1e-9);
});

test('window model: while deletes are lost, every stale stretch ends by expiry, within the TTL', () => {
  for (const deleteDelay of [0, 400, 3000]) {
    const m = createWindow({ deleteDelay }, 3);
    m.sim.advance(20000);
    assert.ok(m.longest() <= deleteDelay + 50, `longest before losing deletes ${m.longest()}`);
    const before = { ...m.stats.endedBy };
    m.params.loseDeletes = true;
    m.sim.advance(120000);
    assert.equal(m.stats.endedBy.delete, before.delete, 'no delete ends a stretch while deletes are lost');
    assert.ok(m.stats.endedBy.expiry - before.expiry >= 5);
    assert.ok(m.longest() > 5000, `longest after ${m.longest()}`);
    assert.ok(m.longest() <= 15000 + 1e-6, `longest after ${m.longest()}`);
    // Switching back: deletes end the stretches again.
    m.params.loseDeletes = false;
    const lost = m.stats.lost, deletes = m.stats.endedBy.delete;
    m.sim.advance(60000);
    assert.equal(m.stats.lost, lost);
    assert.ok(m.stats.endedBy.delete > deletes);
  }
});

test('fan-out: generations leave unreachable keys, tags do not', () => {
  const g = createFanout({ mode: 'gens' }, 9), t = createFanout({ mode: 'tags' }, 9);
  g.sim.advance(60000); t.sim.advance(60000);
  assert.ok(g.view().orphaned > 0);
  assert.equal(t.view().orphaned, 0);
  assert.equal(pageIds().length, 12);
  assert.ok(g.stats.lookups / g.stats.reads === 2 && t.stats.lookups / t.stats.reads === 1);
  // Tags delete only the three pages that show product 42; a generation discards the category.
  assert.ok(t.stats.pagesDiscarded / t.stats.changes <= 3);
  assert.ok(g.stats.pagesDiscarded / g.stats.changes > 6, String(g.stats.pagesDiscarded / g.stats.changes));
});

test('sequences end in the states the prose describes', () => {
  assert.equal(finalState(raceSpecs.slow).redis, '£39');
  assert.equal(finalState(raceSpecs.replica).redis, '£39');
  assert.equal(finalState(raceSpecs.replica).replica, '£35');
  assert.equal(finalState(leaseSpecs.with).redis, '£35');
  assert.equal(finalState(versionSpecs.plain).redis, '£37 v8');
  assert.equal(finalState(versionSpecs.newer).redis, '£35 v9');
  assert.equal(finalState(versionSpecs.evicted).redis, '£37 v8');
  assert.equal(finalState(versionSpecs.tombstone).redis, '£35 v8');
  assert.equal(finalState(outboxSpecs.app).redis, 'empty');
  assert.equal(finalState(outboxSpecs.outbox).redis, 'empty');
  assert.equal(finalState(markerSpecs.marker).editor, 'Samira');
  assert.equal(finalState(markerSpecs.plain).redis, 'empty');
  for (const specs of [raceSpecs, leaseSpecs, versionSpecs, outboxSpecs, markerSpecs]) {
    for (const spec of Object.values(specs)) {
      assert.ok(spec.lanes.length <= 5);
      for (const s of spec.steps) {
        if (s.from) assert.ok(spec.lanes.some(l => l.id === s.from) && spec.lanes.some(l => l.id === s.to), s.label);
        if (s.at) assert.ok(spec.lanes.some(l => l.id === s.at));
        if (s.label) assert.ok(s.label.length <= 16, `label too long: ${s.label}`);
        if (s.note) assert.ok(s.note.length <= 20, `note too long: ${s.note}`);
      }
    }
  }
});
