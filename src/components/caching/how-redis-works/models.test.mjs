// Tests for the article 7 models: the numbers the prose quotes come out of them.
// node --test src/components/caching/how-redis-works/*.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { eventLoop, ceiling, COST } from './eventloop-model.mjs';
import { mainThread, jobFor, worstPing, FREE_BIG_SET } from './mainthread-model.mjs';
import { replay, OPTIONS, KEY_COUNT, BEFORE_MS } from './scan-model.mjs';
import { pages, emptyPageChance } from './pages-model.mjs';
import { VALUE_SIZES, BYTES_PER_KEY, BYTES_PER_KEY_TTL, HASH_USAGE, HASH_ENCODING_FROM } from './measured.mjs';

const run = (clients, us = 200000) => { const m = eventLoop({ clients }, 3); m.sim.advance(us); return m.rates(100000); };

test('one client is limited by the network round trip, not the thread', () => {
  const r = run(1);
  assert.ok(r.perSecond > 8500 && r.perSecond < 9800, `${r.perSecond}`);
  assert.ok(r.busy < 0.1, `busy ${r.busy}`);
  assert.ok(r.wait < 1, `wait ${r.wait}`);
});

test('many clients saturate the thread near its ceiling and start to wait', () => {
  const r = run(40);
  assert.ok(r.busy > 0.97, `busy ${r.busy}`);
  assert.ok(r.perSecond > 0.93 * ceiling() && r.perSecond <= ceiling() * 1.01, `${r.perSecond} vs ${ceiling()}`);
  assert.ok(r.wait > 100, `wait ${r.wait}`);
  // About 14 clients is where a 100 µs round trip and 7.5 µs per request meet.
  const perRequest = COST.read + COST.exec + COST.write;
  assert.ok(Math.abs((2 * 50 + perRequest) / perRequest - 14.3) < 0.1);
  const fifteen = run(15);
  assert.ok(fifteen.busy > 0.95 && fifteen.wait < 10, `${fifteen.busy} ${fifteen.wait}`);
});

test('main-thread blocks never overlap', () => {
  const m = eventLoop({ clients: 25 }, 2); m.sim.advance(50000);
  for (let i = 1; i < m.blocks.length; i++) assert.ok(m.blocks[i].start >= m.blocks[i - 1].end - 1e-9);
});

test('changing the number of clients in place keeps running', () => {
  const m = eventLoop({ clients: 30 }, 2); m.sim.advance(20000);
  m.setClients(2); m.sim.advance(50000);
  assert.ok(m.active <= 3, `active ${m.active}`);
  m.setClients(10); m.sim.advance(50000);
  assert.equal(m.active, 10);
});

test('KEYS over a million keys delays the probing client by about 100 ms', () => {
  const m = mainThread({}, 4); m.sim.advance(20000);
  const t = m.sim.now;
  m.run(jobFor('keys', { keys: 1000000 }));
  m.sim.advance(300000);
  const worst = worstPing(m.pings, t) / 1000;
  assert.ok(worst > 95 && worst < 102, `${worst} ms`);
});

test('ten million keys make the pause ten times longer', () => {
  const m = mainThread({}, 4); m.sim.advance(20000);
  m.run(jobFor('keys', { keys: 10000000 })); m.sim.advance(1500000);
  const worst = worstPing(m.pings, 0) / 1000;
  assert.ok(worst > 980 && worst < 1002, `${worst} ms`);
});

test('UNLINK leaves the main thread free; DEL and expiry do not', () => {
  for (const [kind, low, high] of [['del', 190, 200], ['unlink', 0, 1], ['expire', 190, 200]]) {
    const m = mainThread({}, 6); m.sim.advance(30000);
    m.run(jobFor(kind)); m.sim.advance(500000);
    const worst = worstPing(m.pings, 0) / 1000;
    assert.ok(worst >= low && worst <= high, `${kind}: ${worst} ms`);
    if (kind === 'unlink') assert.ok(m.blocks.some(b => b.lane === 'bg' && b.end - b.start === FREE_BIG_SET));
  }
});

test('the SCAN replay matches its measured walks', () => {
  for (const option of OPTIONS) {
    const r = replay(option);
    assert.equal(r.sim.now, -BEFORE_MS);
    assert.equal(r.keysAt(0), 0);
    assert.equal(r.keysAt(r.data.wall), KEY_COUNT);
    assert.equal(r.callsAt(r.data.wall + 1), r.data.calls);
    // The replayed execution adds up to the slow log's total, within the 1/63 quantisation.
    const replayed = r.execUpTo(r.data.wall + 1);
    assert.ok(Math.abs(replayed - r.data.exec) / r.data.exec < 0.1, `${option}: ${replayed} vs ${r.data.exec}`);
    // Keys arrive in order and never decrease.
    for (let i = 1; i < r.data.keysAt.length; i++) assert.ok(r.data.keysAt[i] >= r.data.keysAt[i - 1]);
    r.sim.advance(1e9);
    assert.ok(r.done && r.sim.now === r.end);
  }
  // The trade-off the prose describes: KEYS is one long call and the quickest walk;
  // COUNT 10 has the shortest calls and the slowest walk.
  const keys = replay('keys').data, ten = replay('10').data, thousand = replay('1000').data;
  assert.equal(keys.calls, 1);
  assert.ok(keys.max > 80000 && ten.max < 1000 && thousand.max < 1000);
  assert.ok(ten.wall > 20 * keys.wall && ten.wall > 10 * thousand.wall);
  assert.ok(replay('100000').data.calls === 10 && replay('100000').data.median > 10000);
});

test('lazy expiry moves the free to the background thread', () => {
  const m = mainThread({}, 6); m.sim.advance(30000);
  m.run(jobFor('expire-lazy')); m.sim.advance(500000);
  assert.ok(worstPing(m.pings, 0) / 1000 < 1);
  assert.ok(m.blocks.some(b => b.lane === 'bg' && b.end - b.start === FREE_BIG_SET));
});

test('deleting half the keys at random frees almost no pages', () => {
  const half = pages({ deleted: 0.5 });
  assert.equal(half.residentPages, 24);
  assert.ok(Math.abs(half.ratio - 2) < 0.05, `${half.ratio}`);
  assert.ok(emptyPageChance(0.5) < 0.0001);
  const refill = pages({ deleted: 0.5, added: 0.5 });
  assert.equal(refill.residentPages, 24);
  assert.ok(Math.abs(refill.ratio - 1) < 1e-9);
  assert.equal(pages({ deleted: 1 }).residentPages, 0);
  assert.ok(pages({ deleted: 0.5, added: 0.8 }).residentPages > 24);
});

test('measured data has the shapes the figures expect', () => {
  assert.equal(VALUE_SIZES.length, BYTES_PER_KEY.length);
  assert.equal(BYTES_PER_KEY_TTL.length, BYTES_PER_KEY.length);
  assert.equal(HASH_USAGE[20].length, 600);
  assert.deepEqual(HASH_ENCODING_FROM[20], [[1, 'listpack'], [513, 'hashtable']]);
  // Bytes per field roughly doubles when a hash with 20-byte values leaves its listpack.
  const before = HASH_USAGE[20][511] / 512, after = HASH_USAGE[20][512] / 513;
  assert.ok(after / before > 1.9 && after / before < 2.1, `${before} → ${after}`);
  // About 159 bytes per key for a 100-byte value, without a TTL.
  assert.equal(BYTES_PER_KEY[VALUE_SIZES.indexOf(100)], 159.3);
});
