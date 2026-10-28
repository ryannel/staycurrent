import test from 'node:test';
import assert from 'node:assert/strict';
import * as restart from './restart-model.mjs';
import * as cow from './cow-model.mjs';
import * as aof from './aof-model.mjs';
import * as lag from './lag-model.mjs';
import { reconnect, MB, formatBytes } from './backlog-model.mjs';
import { sentinelPower, majority } from './quorum-model.mjs';
import * as sentinel from './sentinel-model.mjs';

test('restart model: steady hit ratios quoted in the article', () => {
  const at = ttl => restart.steady({ ttl });
  assert.ok(Math.abs(at(600).hitRatio - 0.964) < 0.002, `600 s: ${at(600).hitRatio}`);
  assert.ok(Math.abs(at(120).hitRatio - 0.89) < 0.02, `120 s: ${at(120).hitRatio}`);
  assert.ok(at(1800).hitRatio > 0.985);
});

test('restart model: an empty restart sends every request to the database at first, then decays', () => {
  const m = restart.create({}, 1);
  m.sim.advance(60000);
  const normal = m.reads;
  assert.ok(Math.abs(normal - m.normal) < 1, 'starts in steady state');
  m.fail('empty');
  m.sim.advance(1000);
  assert.ok(m.reads > 15 * normal, `first second ${m.reads} vs normal ${normal}`);
  m.sim.advance(59000);
  assert.ok(m.reads > 2.5 * normal && m.reads < 4 * normal, `after a minute ${m.reads}`);
  m.sim.advance(240000);
  assert.ok(m.reads < normal, 'below normal before the refill wave expires');
});

test('restart model: a warm copy after an outage is near normal at once', () => {
  for (const [rec, outage] of [['snapshot', 10], ['replica', 31]]) {
    const m = restart.create({}, 1);
    m.sim.advance(60000);
    m.fail(rec, outage);
    m.sim.advance(outage * 1000 - 500);
    assert.equal(Math.round(m.reads), m.params.rate, `${rec}: everything to the database while down`);
    m.sim.advance(3000);
    assert.ok(m.reads < 2.5 * m.normal, `${rec}: ${m.reads} just after`);
  }
});

test('copy-on-write: spread writes copy most pages, hot writes few', () => {
  const run = spread => { const m = cow.create({ spread, rate: 5 }, 3); m.sim.advance(2000); m.bgsave(); m.sim.advance(cow.FORK_MS + cow.SAVE_MS + 10); return m.peakCopied / cow.PAGES; };
  const spread = run('spread'), hot = run('hot');
  assert.ok(spread > 0.5 && spread < 0.9, `spread ${spread}`);
  assert.ok(hot <= cow.HOT_PAGES / cow.PAGES, `hot ${hot}`);
  assert.ok(Math.abs(cow.expectedCopied(60, 48) - 0.715) < 0.01);
});

test('AOF: a process crash loses nothing acknowledged; a power cut loses what is only in the page cache', () => {
  const m = aof.create({ fsync: 'no', rate: 3 }, 2);
  m.sim.advance(20000);
  assert.equal(m.fail('crash'), 0);
  const inCache = m.inCache;
  assert.ok(inCache > 20, `page cache holds ${inCache}`);
  assert.ok(m.ackedInCache <= inCache && m.ackedInCache > 20, `acknowledged in the page cache: ${m.ackedInCache}`);
  const acked = m.ackedInCache;
  assert.equal(m.fail('power'), acked);
  const e = aof.create({ fsync: 'everysec', rate: 3 }, 2);
  e.sim.advance(20500);
  assert.ok(e.inCache <= 8, `everysec holds at most about a second: ${e.inCache}`);
  const a = aof.create({ fsync: 'always', rate: 3 }, 2);
  a.sim.advance(20000);
  assert.equal(a.fail('power'), 0);
});

test('replica lag: stale share follows 1 − e^(−w·d)', () => {
  for (const delay of [50, 1000]) {
    const m = lag.create({ delay, readRate: 40 }, 5);
    m.sim.advance(600000);
    const share = m.staleReads / m.reads, expected = lag.expectedStale(2, delay);
    assert.ok(Math.abs(share - expected) < 0.04, `delay ${delay}: ${share} vs ${expected}`);
  }
});

test('backlog: default 1 MB at 5,000 writes a second', () => {
  const r = reconnect({ writesPerSecond: 5000, outage: 1, backlogBytes: MB });
  assert.ok(r.partial);
  assert.ok(Math.abs(r.covers - 1.52) < 0.01, `covers ${r.covers}`);
  assert.equal(reconnect({ writesPerSecond: 5000, outage: 30, backlogBytes: MB }).partial, false);
  assert.equal(formatBytes(reconnect({ writesPerSecond: 5000, outage: 60, backlogBytes: MB }).needed), '39 MB');
});

test('quorum and majority', () => {
  assert.deepEqual([2, 3, 4, 5, 7].map(majority), [2, 2, 3, 3, 4]);
  assert.equal(sentinelPower({ n: 3, quorum: 2, lost: 1 }).failover, true);
  assert.equal(sentinelPower({ n: 3, quorum: 2, lost: 2 }).failover, false);
  assert.equal(sentinelPower({ n: 2, quorum: 1, lost: 1 }).detect, true);
  assert.equal(sentinelPower({ n: 2, quorum: 1, lost: 1 }).failover, false);
  assert.equal(sentinelPower({ n: 5, quorum: 2, lost: 2 }).failover, true);
  assert.equal(sentinelPower({ n: 5, quorum: 4, lost: 2 }).failover, false);
});

test('Sentinel: clients are back about 31 s after the kill with default settings', () => {
  const m = sentinel.create({ downAfter: 30000 }, 4);
  m.sim.advance(5000);
  m.kill();
  m.sim.advance(31000);
  assert.equal(m.clientsOn, 'p');
  m.sim.advance(500);
  assert.equal(m.clientsOn, 'r1');
  assert.ok(Math.abs(sentinel.outageSeconds(30000) - 31.2) < 0.1);
  assert.ok(Math.abs(sentinel.outageSeconds(5000) - 6.2) < 0.1);
  const failedShare = m.totals.failed / (m.totals.ok + m.totals.failed);
  assert.ok(failedShare > 0.8, `failed share ${failedShare}`);
});

test('restart model: traces and costs used by Figure 11', () => {
  const empty = restart.cost(restart.trace('empty', 1), 500);
  const replica = restart.cost(restart.trace('replica', 31), 500);
  const fast = restart.cost(restart.trace('replica', 6), 500);
  const reboot = restart.cost(restart.trace('empty', 120), 500);
  assert.ok(empty.over >= 18 && empty.over <= 22, `empty over ${empty.over}`);
  assert.equal(replica.over, 31);
  assert.equal(fast.over, 6);
  assert.ok(reboot.over > 130, `reboot over ${reboot.over}`);
  // The verdict depends on the database's capacity (Figure 11's slider).
  const at = cap => [restart.cost(restart.trace('empty', 0), cap).over, restart.cost(restart.trace('replica', 31), cap).over];
  const [e300, r300] = at(300), [e380, r380] = at(380), [e800] = at(800);
  assert.ok(e300 > r300, `at 300 an empty restart (${e300} s) is worse than a 31 s failover`);
  assert.ok(Math.abs(e380 - r380) <= 1, `at 380 they tie (${e380} s against ${r380} s)`);
  assert.ok(e800 <= 6, `at 800 an empty restart is short (${e800} s)`);
  // Seconds above capacity do not change with a longer window at these capacities.
  for (const cap of [300, 380, 500, 800]) assert.equal(restart.cost(restart.trace('empty', 0, { after: 3600 }), cap).over, restart.cost(restart.trace('empty', 0), cap).over);
});

test('appendfsync always: a power cut loses no acknowledged write', async () => {
  const { create } = await import('./aof-model.mjs');
  const m = create({ fsync: 'always', rate: 20 }, 2);
  m.sim.advance(5000);
  assert.equal(m.fail('power'), 0);
  assert.equal(m.inCache, 0);
});
