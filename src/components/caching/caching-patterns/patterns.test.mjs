// Checks that the numbers the caching-patterns article quotes come out of its
// models with the figures' seeds. Run: node --test src/components/caching/caching-patterns/*.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { writePolicy, summary } from './write-policy-model.mjs';
import { ceiling, deleteHitRatio, unreadShare } from './ceiling-model.mjs';
import { overload } from './overload-model.mjs';
import { writeBehind } from './write-behind-model.mjs';

test('figure 1: leaving the cache serves stale reads; delete and update do not', () => {
  const run = policy => { const m = writePolicy({ policy }, 11); m.sim.advance(600000); return summary(m); };
  const leave = run('leave'), del = run('delete'), update = run('update');
  assert.ok(leave.staleShare > 0.05, `leave stale ${leave.staleShare}`);
  assert.equal(del.staleShare, 0);
  assert.equal(update.staleShare, 0);
  assert.ok(update.hitRatio > del.hitRatio, `update ${update.hitRatio} vs delete ${del.hitRatio}`);
});

test('figure 1: the first seconds of each policy show its effect (seed 11)', () => {
  for (const policy of ['leave', 'delete', 'update']) {
    const m = writePolicy({ policy }, 11);
    m.sim.advance(30000);
    assert.ok(m.stats.writes >= 5, `${policy}: ${m.stats.writes} writes in 30 s`);
  }
});

test('figure 2: delete-on-write hit ratio tracks k / (k + 1); update never misses', () => {
  for (const k of [1, 4, 9]) {
    const m = ceiling({ perWrite: k, reads: 2 }, 29);
    m.sim.advance(20_000_000);
    const del = m.rows.delete.hits / m.rows.delete.reads;
    const upd = m.rows.update.hits / m.rows.update.reads;
    const unread = m.rows.update.unread / m.rows.update.cacheWrites;
    assert.ok(Math.abs(del - deleteHitRatio(k)) < 0.02, `k=${k}: ${del} vs ${deleteHitRatio(k)}`);
    assert.equal(upd, 1);
    assert.ok(Math.abs(unread - unreadShare(k)) < 0.02, `k=${k}: unread ${unread} vs ${unreadShare(k)}`);
  }
});

test('figure 4: discarding late answers stays stuck; caching them or never running them recovers (seed 1)', () => {
  const run = abandoned => { const m = overload({ abandoned }, 1); m.sim.advance(70000); return m; };
  const discard = run('discard'), cache = run('cache'), drop = run('drop');
  const before = s => s.filter(x => x.t <= 10);
  const late = s => s.filter(x => x.t > 40);
  const mean = (list, f) => list.reduce((a, x) => a + f(x), 0) / list.length;
  assert.ok(mean(before(discard.samples), x => x.hitRatio) > 0.85, 'warm cache before the restart');
  assert.ok(mean(late(discard.samples), x => x.answered) < 0.65, `discard answered ${mean(late(discard.samples), x => x.answered)}`);
  assert.ok(mean(late(discard.samples), x => x.fills) === 0, 'discard fills nothing once stuck');
  assert.ok(discard.samples.at(-1).queue > 5000, `discard queue ${discard.samples.at(-1).queue}`);
  assert.ok(discard.cache.size > 80 && discard.cache.size < 130, `discard keys ${discard.cache.size}`);
  for (const [name, m, by] of [['cache', cache, 30], ['drop', drop, 20]]) {
    assert.ok(mean(late(m.samples), x => x.answered) > 0.99, `${name} answered ${mean(late(m.samples), x => x.answered)}`);
    const recovered = m.samples.find(x => x.t > 10 && x.answered > 0.99);
    assert.ok(recovered && recovered.t <= by, `${name} recovered at ${recovered?.t}`);
  }
  // Headroom: more database capacity or a longer timeout lets even the first option recover.
  for (const extra of [{ dbRate: 150 }, { timeout: 5000 }]) {
    const m = overload({ abandoned: 'discard', ...extra }, 1); m.sim.advance(70000);
    assert.ok(mean(late(m.samples), x => x.hitRatio) > 0.85, `headroom ${JSON.stringify(extra)}`);
  }
});

test('figure 2: the seeded run is near k / (k + 1) within the first minutes (seed 29)', () => {
  for (const k of [1, 2, 4, 19]) {
    const m = ceiling({ perWrite: k, reads: 2 }, 29);
    for (const t of [30, 60, 120]) {
      m.sim.advance(t * 1000 - m.sim.now);
      const del = m.rows.delete.hits / m.rows.delete.reads;
      assert.ok(Math.abs(del - deleteHitRatio(k)) < 0.06, `k=${k} t=${t}: ${del}`);
    }
  }
});

test('figure 5: database writes fall with the interval; a restart loses about rate × interval / 2', () => {
  for (const interval of [1, 5, 20]) {
    const m = writeBehind({ interval, rate: 8, animate: false }, 3);
    m.sim.advance(1_000_000);
    const perSecond = m.stats.databaseWrites / 1000;
    assert.ok(perSecond <= 4 / interval + 1e-9, `interval ${interval}: ${perSecond} writes/s`);
    assert.equal(m.stats.flushed + m.pending(), m.stats.acknowledged);
  }
  // Average loss over restarts at random moments.
  for (const interval of [2, 10]) {
    let lost = 0; const n = 400;
    const m = writeBehind({ interval, rate: 8, animate: false }, 9);
    for (let i = 0; i < n; i++) { m.sim.advance(1000 * interval * (0.5 + m.sim.random()) * 3.1); lost += m.restart(); }
    const expected = 8 * interval / 2;
    assert.ok(Math.abs(lost / n - expected) / expected < 0.15, `interval ${interval}: ${lost / n} vs ${expected}`);
  }
});
