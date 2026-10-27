// How often a slow fill puts an old value back, for keys under cache-aside
// with delete-on-write. Pure; no DOM. Used by the "a day of fifty keys"
// figure and its tests.
//
// Model, for each key independently: reads and writes arrive at random
// (Poisson). While the key is cached, reads are hits, and a hit is stale if the
// cached version is older than the database's. While the key is absent, every
// read is a miss and starts a fill: it reads the database at once, then stores
// what it read after a fill time drawn from a log-normal distribution (the
// query, serialisation, the network, the odd pause). Nothing coalesces fills.
// A write commits a new version and deletes the key 1 ms later. A stored value
// lives for the TTL. A race is a fill that stores a version older than the
// database's; the stale period it starts ends at the next delete or at expiry.
//
// Left out: eviction, failed deletes, replicas, coalescing of fills (which
// makes races rarer, not impossible), and load-dependent fill times.
// Hits are not simulated one by one: stale reads are the read rate times the
// stale time, which is their expected number.
import { seededRandom, exponentialGap, logNormal } from '../shared/sim.mjs';

class Heap {
  constructor() { this.items = []; }
  get size() { return this.items.length; }
  push(item) {
    const a = this.items; a.push(item);
    let i = a.length - 1;
    while (i > 0) { const p = (i - 1) >> 1; if (a[p].t <= a[i].t) break; [a[p], a[i]] = [a[i], a[p]]; i = p; }
  }
  pop() {
    const a = this.items; const top = a[0]; const last = a.pop();
    if (a.length) {
      a[0] = last; let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = l + 1; let m = i;
        if (l < a.length && a[l].t < a[m].t) m = l;
        if (r < a.length && a[r].t < a[m].t) m = r;
        if (m === i) break; [a[m], a[i]] = [a[i], a[m]]; i = m;
      }
    }
    return top;
  }
}

/** The log-normal median that gives a mean of `mean` with this spread. */
export const medianForMean = (mean, spread) => mean / Math.exp((spread * spread) / 2);

export const DEFAULTS = { readsPerSecond: 2, writesPerHour: 60, fillMs: 50, ttlSeconds: 600, hours: 24, spread: 1, deleteDelayMs: 1 };

/** One key for `hours`. Returns its race-caused stale intervals (seconds) and counts. */
export function simulateKey(params, seed = 1) {
  const p = { ...DEFAULTS, ...params };
  const random = seededRandom(seed);
  const end = p.hours * 3600 * 1000;
  const ttl = p.ttlSeconds * 1000;
  const median = medianForMean(p.fillMs, p.spread);
  const writeRate = p.writesPerHour / 3600;
  const heap = new Heap();
  let seq = 0;
  const push = (t, type, data) => heap.push({ t, type, data, seq: seq++ });

  let dbVersion = 0;
  let cache = null;              // { version, expiresAt }
  let readArmed = false;         // a read event is scheduled for the absent key
  let staleSince = null;
  const intervals = [];
  let writes = 0, fills = 0, races = 0;

  const close = t => { if (staleSince !== null) { intervals.push([staleSince / 1000, Math.min(t, end) / 1000]); staleSince = null; } };
  const becameAbsent = t => { cache = null; if (!readArmed) { readArmed = true; push(t + exponentialGap(random, p.readsPerSecond), 'read'); } };

  // The key starts absent, as after a deploy.
  becameAbsent(0);
  if (writeRate > 0) push(exponentialGap(random, writeRate), 'write');

  while (heap.size) {
    const ev = heap.pop();
    const t = ev.t;
    if (t > end) break;
    if (ev.type === 'expire') {
      if (cache && cache.expiresAt === t) { close(t); becameAbsent(t); }
    } else if (ev.type === 'read') {
      readArmed = false;
      if (!cache) {
        fills++;
        push(t + logNormal(random, median, p.spread), 'fill', dbVersion);
        readArmed = true;
        push(t + exponentialGap(random, p.readsPerSecond), 'read');
      }
    } else if (ev.type === 'write') {
      writes++;
      dbVersion++;
      push(t + p.deleteDelayMs, 'delete');
      push(t + exponentialGap(random, writeRate), 'write');
    } else if (ev.type === 'delete') {
      close(t);
      becameAbsent(t);
    } else if (ev.type === 'fill') {
      cache = { version: ev.data, expiresAt: t + ttl };
      push(t + ttl, 'expire');
      if (ev.data < dbVersion) { races++; if (staleSince === null) staleSince = t; }
      else close(t);
    }
  }
  close(end);
  return { writes, fills, races, intervals };
}

/**
 * simulateKeys(params, count, seed): `count` independent keys like one another.
 * Returns per-key intervals and totals, and the derivation's prediction.
 */
export function simulateKeys(params, count = 50, seed = 1) {
  const p = { ...DEFAULTS, ...params };
  const keys = [];
  let writes = 0, fills = 0, races = 0, staleSeconds = 0, longest = 0;
  for (let k = 0; k < count; k++) {
    const r = simulateKey(p, seed * 1000 + k + 1);
    keys.push(r.intervals);
    writes += r.writes; fills += r.fills; races += r.races;
    for (const [a, b] of r.intervals) { staleSeconds += b - a; longest = Math.max(longest, b - a); }
  }
  const total = count * p.hours * 3600;
  return {
    keys, writes, fills, races, staleSeconds, longest,
    staleShare: staleSeconds / total,            // share of time a key spends stale from races
    staleReads: staleSeconds * p.readsPerSecond, // expected stale hits
    predictedShare: (p.writesPerHour / 3600) * (p.fillMs / 1000),
  };
}
