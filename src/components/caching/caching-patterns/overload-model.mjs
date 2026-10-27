// Figure 4: what happens to a load nobody is waiting for, after Redis restarts.
// Requests pick keys with Zipf popularity; Redis holds a limited number of keys
// (LRU). The database answers queries one after another at a fixed rate, in
// arrival order. The application waits `timeout` for a miss; after that the
// request fails. `abandoned` decides what happens to a query whose request will
// have given up by the time it could be answered:
//
// 'discard': the database still runs it, and the answer is thrown away, because
//            the code that would have cached it belonged to the request
//            (cache-aside as usually written, or a loader cancelled with its caller).
// 'cache':   the database still runs it, and the answer is cached however late,
//            because the load is not tied to the request (a detached loader).
// 'drop':    the database never runs it: the query is dropped as soon as it is
//            clear it cannot be answered in time (a deadline, a bounded queue, a
//            pool that gives up before sending it). Simplified: the model knows
//            this on arrival.
// Nothing coalesces duplicate loads of one key (article 6 covers that). No
// retries. All numbers are illustrative. Pure.
import { Simulation, Movers, poissonArrivals, zipf, LruCache } from '../shared/sim.mjs';

/** Animation timings for the sampled dots, in simulated ms; not latencies. */
export const HOPS = { client: 350, redis: 250, database: 400 };

// sample: draw one request in this many as a moving dot (0 draws none).
export const DEFAULTS = { abandoned: 'discard', keys: 1000, skew: 1, capacity: 600, rate: 500, dbRate: 100, timeout: 1000, restartAt: 10000, sample: 0 };

export function overload(params = {}, seed = 1) {
  const p = { ...DEFAULTS, ...params };
  const sim = new Simulation({ seed });
  const popularity = zipf(p.keys, p.skew);
  const cache = new LruCache(p.capacity);
  const service = 1000 / p.dbRate;
  let busyUntil = 0;
  const second = () => ({ requests: 0, hits: 0, answered: 0, queries: 0, fills: 0 });
  let current = second();
  const samples = [];
  const totals = { requests: 0, hits: 0, answered: 0, failed: 0, wasted: 0, dropped: 0 };
  const movers = new Movers(sim);
  const model = { sim, params: p, cache, samples, totals, movers, restarted: false };
  let counter = 0;
  // A sampled request's dots. The decision is made at arrival; the dots only show it.
  const draw = (hit, inTime) => {
    movers.add({ edge: 'client-app', duration: HOPS.client, kind: 'client', onArrive: () =>
      movers.add({ edge: 'app-redis', duration: HOPS.redis, kind: 'client', onArrive: () =>
        movers.add({ edge: 'app-redis', reverse: true, duration: HOPS.redis, kind: hit ? 'hit' : 'miss', onArrive: () => {
          if (hit) { movers.add({ edge: 'client-app', reverse: true, duration: HOPS.client, kind: 'hit' }); return; }
          movers.add({ edge: 'app-database', duration: HOPS.database, kind: 'miss' });
          const answer = inTime ? 'miss' : 'error';
          sim.after(inTime ? HOPS.database * 2 : p.timeout, () => movers.add({ edge: 'client-app', reverse: true, duration: HOPS.client, kind: answer }));
        } }) }) });
  };

  // Start warm: the most popular keys, most popular last (most recently used).
  for (let k = p.capacity - 1; k >= 0; k--) cache.set(k, 1, { now: 0 });

  model.queueLength = () => Math.max(0, Math.round((busyUntil - sim.now) / service));
  model.wait = () => Math.max(0, busyUntil - sim.now);
  model.restart = () => { cache.map.clear(); model.restarted = true; model.restartedAt = sim.now; };

  const finish = (answeredInTime, key) => {
    current.queries++;
    if (answeredInTime || model.params.abandoned === 'cache') { cache.set(key, 1, { now: sim.now }); current.fills++; }
    if (!answeredInTime) totals.wasted++;
  };

  poissonArrivals(sim, () => model.params.rate, () => {
    const key = popularity.sample(sim.random);
    current.requests++; totals.requests++;
    const show = p.sample > 0 && ++counter % p.sample === 0;
    if (cache.get(key, sim.now)) { current.hits++; current.answered++; totals.hits++; totals.answered++; if (show) draw(true, true); return; }
    const done = Math.max(busyUntil, sim.now) + service;
    const inTime = done - sim.now <= model.params.timeout;
    if (!inTime && model.params.abandoned === 'drop') {
      // Never sent to the database: the request fails, and the database spends nothing on it.
      totals.failed++; totals.dropped++;
      if (show) draw(false, false);
      return;
    }
    busyUntil = done;
    if (inTime) { current.answered++; totals.answered++; } else totals.failed++;
    if (show) draw(false, inTime);
    sim.at(done, () => finish(inTime, key));
  });

  if (p.restartAt != null) sim.at(p.restartAt, () => model.restart());

  sim.every(1000, () => {
    const s = current;
    samples.push({
      t: sim.now / 1000,
      hitRatio: s.requests ? s.hits / s.requests : 0,
      answered: s.requests ? s.answered / s.requests : 0,
      queries: s.queries, fills: s.fills, queue: model.queueLength(), wait: model.wait(),
    });
    current = second();
  });
  return model;
}
