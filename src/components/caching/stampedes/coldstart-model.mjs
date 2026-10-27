// Figure 10: a cold start, with and without one rebuild per key. Pure.
//
// The scenario is the one in Caching patterns, Figure 4: 500 requests a second
// over 1,000 keys with Zipf popularity (s = 1); the database answers 100
// queries a second, one after another in arrival order; a request waits at most
// one second for a miss. Here Redis has room for every key and starts empty
// (a restart with nothing persisted), and every answer is stored however late
// it arrives (the fill outlives the request, the fix that article showed).
// The choice changes one thing:
//   'every':  every miss sends its own query, even if the same key is already
//             being loaded (cache-aside with no coordination);
//   'perkey': a miss for a key that is already being loaded waits for that
//             load instead of sending another query (a rebuild lock or lease
//             per key; the waiting request still gives up after one second).
// No retries, no TTL, no eviction. Illustrative, not measured.
import { Simulation, poissonArrivals, zipf } from '../shared/sim.mjs';

export const DEFAULTS = { mode: 'every', keys: 1000, skew: 1, rate: 500, dbRate: 100, timeout: 1000, horizon: 60000 };

export function coldStart(params = {}, seed = 1) {
  const p = { ...DEFAULTS, ...params };
  const sim = new Simulation({ seed });
  const popularity = zipf(p.keys, p.skew);
  const cached = new Set();
  const loading = new Map();          // key -> completion time of its load
  const service = 1000 / p.dbRate;
  let busyUntil = 0;
  const totals = { requests: 0, hits: 0, answered: 0, queries: 0, duplicates: 0, waited: 0 };
  const second = () => ({ requests: 0, hits: 0, answered: 0, queries: 0, duplicates: 0 });
  let current = second();
  const samples = [];
  const model = { sim, params: p, cached, samples, totals, recoveredAt: null };
  model.queueWait = () => Math.max(0, busyUntil - sim.now);

  poissonArrivals(sim, () => p.rate, () => {
    const key = popularity.sample(sim.random);
    current.requests++; totals.requests++;
    if (cached.has(key)) { current.hits++; current.answered++; totals.hits++; totals.answered++; return; }
    const pendingUntil = loading.get(key);
    if (pendingUntil !== undefined && p.mode === 'perkey') {
      totals.waited++;
      if (pendingUntil - sim.now <= p.timeout) { current.answered++; totals.answered++; }
      return;
    }
    if (pendingUntil !== undefined) { current.duplicates++; totals.duplicates++; }
    const done = Math.max(busyUntil, sim.now) + service;
    busyUntil = done;
    current.queries++; totals.queries++;
    if (done - sim.now <= p.timeout) { current.answered++; totals.answered++; }
    if (pendingUntil === undefined || done > pendingUntil) loading.set(key, Math.max(done, pendingUntil ?? 0));
    sim.at(done, () => { cached.add(key); if (loading.get(key) <= sim.now) loading.delete(key); });
  });

  sim.every(1000, () => {
    const s = current;
    const hitRatio = s.requests ? s.hits / s.requests : 0;
    samples.push({ t: sim.now / 1000, hitRatio, answered: s.requests ? s.answered / s.requests : 0, queries: s.queries, duplicates: s.duplicates, wait: model.queueWait(), cachedKeys: cached.size });
    if (model.recoveredAt === null && hitRatio >= 0.9) model.recoveredAt = sim.now / 1000;
    current = second();
  });
  return model;
}
