// Models for Figures 2 and 3 of "Operating a cache". Pure: no DOM.
//
// The shop: product reads arrive at random (Poisson) at `rate` a second; each
// picks a product with Zipf popularity. Redis is an LRU cache of `capacity`
// products. The database runs `workers` queries at once, each taking
// workers / dbRate seconds, so it answers `dbRate` queries a second when it is
// busy. Queries start in arrival order, and the database finishes every query
// it accepts even when the request that sent it has given up (nothing cancels
// it). A request waits at most `timeout` for its query; an answer later than
// that is a failure and, as in cache-aside as usually written, is not cached.
//
// A limit, when present, caps the queries the database holds (waiting or
// running). A miss that finds the database at its limit fails at once and the
// database never sees it: what a bounded connection pool that refuses rather
// than waits, or a semaphore around database calls, does.
//
// All numbers are illustrative. The model has no retries, no coalescing of
// duplicate loads and no TTLs.
import { Simulation, Movers, poissonArrivals, zipf, LruCache, seededRandom } from '../shared/sim.mjs';

export const SHOP = { rate: 1000, keys: 20000, skew: 0.9, capacity: 12500, dbRate: 300, workers: 8, timeout: 1000, limit: 60 };

/** Limits offered in Figure 2: queries the database may hold, waiting or running. */
export const LIMITS = ['none', 4, 60, 300, 600];

/** Animation timings for the sampled dots, in simulated ms; not latencies. */
export const HOPS = { client: 350, redis: 250, database: 400 };

/**
 * Database shared by both figures: `workers` queries run at once, the rest wait
 * in arrival order. With identical workers and a fixed service time, queries
 * also finish in arrival order, so a plain list of completion times is enough.
 */
function database(sim, p) {
  const workers = p.workers ?? 1;
  const service = (1000 * workers) / p.dbRate;
  const free = new Array(workers).fill(0);
  let finishing = [], head = 0;
  const settle = () => {
    while (head < finishing.length && finishing[head] <= sim.now) head++;
    if (head > 4096 && head * 2 > finishing.length) { finishing = finishing.slice(head); head = 0; }
  };
  const nextFree = () => { let i = 0; for (let k = 1; k < workers; k++) if (free[k] < free[i]) i = k; return i; };
  return {
    /** Outstanding queries (waiting or running). */
    outstanding: () => { settle(); return finishing.length - head; },
    /** How long a query arriving now would wait for a free worker. */
    wait: () => Math.max(0, free[nextFree()] - sim.now),
    /** Queue one query; returns its completion time. */
    enqueue() {
      const i = nextFree();
      free[i] = Math.max(free[i], sim.now) + service;
      finishing.push(free[i]);
      return free[i];
    },
  };
}

/**
 * A warm cache is one that has been in use: fill it by replaying `draws` reads
 * through LRU, so it starts in the same state it would reach by itself, not
 * holding the ideal set of most popular products. Uses its own random stream.
 */
function warm(cache, popularity, seed, draws = 200000) {
  const random = seededRandom(seed + 7919);
  for (let i = 0; i < draws; i++) { const key = popularity.sample(random); if (!cache.get(key, 0)) cache.set(key, 1, { now: 0 }); }
}

const blank = () => ({ requests: 0, hits: 0, answered: 0, failedFast: 0, late: 0, queries: 0, wasted: 0, lookups: 0 });

/**
 * Figure 2: Redis is unavailable from `downAt` to `upAt` (a failover); it comes
 * back with its data. While it is down every read goes to the database.
 * params.limit: 'none', or the most queries the database may hold at once.
 */
export function outage(params = {}, seed = 1) {
  const p = { ...SHOP, limit: 'none', downAt: 10000, upAt: 40000, sample: 0, ...params };
  const limit = p.limit === 'none' ? Infinity : Number(p.limit);
  const sim = new Simulation({ seed });
  const popularity = zipf(p.keys, p.skew);
  const cache = new LruCache(p.capacity);
  warm(cache, popularity, seed);
  const db = database(sim, p);
  const movers = new Movers(sim);
  const samples = [];
  const totals = { requests: 0, answered: 0, failedFast: 0, late: 0, wasted: 0 };
  let current = blank(), counter = 0;
  const model = { sim, params: p, cache, db, movers, samples, totals };
  model.redisUp = () => sim.now < p.downAt || sim.now >= p.upAt;

  const draw = outcome => {
    const back = { hit: 'hit', answered: 'miss', fast: 'error', late: 'error' }[outcome];
    movers.add({ edge: 'client-app', duration: HOPS.client, kind: 'client', onArrive: () => {
      if (outcome === 'hit') {
        movers.add({ edge: 'app-redis', duration: HOPS.redis, kind: 'client', onArrive: () =>
          movers.add({ edge: 'app-redis', reverse: true, duration: HOPS.redis, kind: 'hit', onArrive: () =>
            movers.add({ edge: 'client-app', reverse: true, duration: HOPS.client, kind: 'hit' }) }) });
        return;
      }
      if (outcome === 'fast') { movers.add({ edge: 'client-app', reverse: true, duration: HOPS.client, kind: 'error' }); return; }
      movers.add({ edge: 'app-database', duration: HOPS.database, kind: 'miss' });
      sim.after(outcome === 'answered' ? HOPS.database * 2 : p.timeout, () => movers.add({ edge: 'client-app', reverse: true, duration: HOPS.client, kind: back }));
    } });
  };

  poissonArrivals(sim, () => p.rate, () => {
    const key = popularity.sample(sim.random);
    current.requests++; totals.requests++;
    const show = p.sample > 0 && ++counter % p.sample === 0;
    if (model.redisUp() && cache.get(key, sim.now)) {
      current.hits++; current.answered++; totals.answered++;
      if (show) draw('hit');
      return;
    }
    if (db.outstanding() >= limit) {
      current.failedFast++; totals.failedFast++;
      if (show) draw('fast');
      return;
    }
    const done = db.enqueue();
    current.queries++;
    const inTime = done - sim.now <= p.timeout;
    if (inTime) { current.answered++; totals.answered++; } else { current.late++; totals.late++; }
    if (show) draw(inTime ? 'answered' : 'late');
    sim.at(done, () => {
      if (inTime) { if (model.redisUp()) cache.set(key, 1, { now: sim.now }); }
      else totals.wasted++;
    });
  });

  sim.every(1000, () => {
    const s = current;
    samples.push({ t: sim.now / 1000, answered: s.requests ? s.answered / s.requests : 0, failedFast: s.requests ? s.failedFast / s.requests : 0,
      late: s.requests ? s.late / s.requests : 0, queries: s.queries, wait: db.wait(), outstanding: db.outstanding() });
    current = blank();
  });
  return model;
}

/**
 * Figure 3: an empty replacement cache takes over from a warm one at `switchAt`.
 * params.strategy:
 *   'all'   every request uses the new cache from the switch;
 *   'ramp'  a share of requests that grows from 5% to 100% over `rampFor` ms;
 *           the rest still use the old cache;
 *   'old'   every request uses the new cache, and a miss there reads the old
 *           cache before the database.
 * The database limit from Figure 2 is in place throughout.
 */
export function warmup(params = {}, seed = 1) {
  const p = { ...SHOP, switchAt: 10000, rampFor: 120000, strategy: 'all', sample: 0, ...params };
  const sim = new Simulation({ seed });
  const popularity = zipf(p.keys, p.skew);
  const oldCache = new LruCache(p.capacity);
  const newCache = new LruCache(p.capacity);
  warm(oldCache, popularity, seed);
  const db = database(sim, p);
  const movers = new Movers(sim);
  const samples = [];
  const totals = { requests: 0, failed: 0, queries: 0 };
  let current = { ...blank(), newRequests: 0, newHits: 0, oldReads: 0, completed: 0 }, counter = 0;
  const model = { sim, params: p, oldCache, newCache, db, movers, samples, totals, peak: 0 };
  model.share = () => {
    if (sim.now < p.switchAt) return 0;
    if (p.strategy !== 'ramp') return 1;
    return Math.min(1, 0.05 + 0.95 * (sim.now - p.switchAt) / p.rampFor);
  };

  const draw = (cacheEdge, outcome) => {
    movers.add({ edge: 'client-app', duration: HOPS.client, kind: 'client', onArrive: () =>
      movers.add({ edge: cacheEdge, duration: HOPS.redis, kind: 'client', onArrive: () => {
        if (outcome === 'hit') {
          movers.add({ edge: cacheEdge, reverse: true, duration: HOPS.redis, kind: 'hit', onArrive: () =>
            movers.add({ edge: 'client-app', reverse: true, duration: HOPS.client, kind: 'hit' }) });
          return;
        }
        movers.add({ edge: cacheEdge, reverse: true, duration: HOPS.redis, kind: 'miss', onArrive: () => {
          if (outcome === 'old') {
            movers.add({ edge: 'app-old', duration: HOPS.redis, kind: 'miss', onArrive: () =>
              movers.add({ edge: 'app-old', reverse: true, duration: HOPS.redis, kind: 'hit', onArrive: () =>
                movers.add({ edge: 'client-app', reverse: true, duration: HOPS.client, kind: 'hit' }) }) });
            return;
          }
          if (outcome === 'fast') { movers.add({ edge: 'client-app', reverse: true, duration: HOPS.client, kind: 'error' }); return; }
          movers.add({ edge: 'app-database', duration: HOPS.database, kind: 'miss', onArrive: () =>
            movers.add({ edge: 'app-database', reverse: true, duration: HOPS.database, kind: 'miss', onArrive: () =>
              movers.add({ edge: 'client-app', reverse: true, duration: HOPS.client, kind: 'miss' }) }) });
        } });
      } }) });
  };

  const query = () => {
    if (db.outstanding() >= p.limit) return null;
    const done = db.enqueue();
    current.queries++; totals.queries++;
    return done;
  };

  poissonArrivals(sim, () => p.rate, () => {
    const key = popularity.sample(sim.random);
    current.requests++; totals.requests++;
    const show = p.sample > 0 && ++counter % p.sample === 0;
    const useNew = sim.random() < model.share();
    const cache = useNew ? newCache : oldCache;
    const edge = useNew ? 'app-new' : 'app-old';
    if (useNew) current.newRequests++;
    if (cache.get(key, sim.now)) {
      current.hits++; current.answered++; if (useNew) current.newHits++;
      if (show) draw(edge, 'hit');
      return;
    }
    if (useNew && p.strategy === 'old' && oldCache.get(key, sim.now)) {
      // The old cache answers; the value is copied into the new one.
      current.oldReads++; current.answered++;
      newCache.set(key, 1, { now: sim.now });
      if (show) draw(edge, 'old');
      return;
    }
    const done = query();
    if (done == null) { current.failedFast++; totals.failed++; if (show) draw(edge, 'fast'); return; }
    // Under the limit every admitted query is answered in time.
    current.answered++;
    if (show) draw(edge, 'db');
    sim.at(done, () => { current.completed++; cache.set(key, 1, { now: sim.now }); if (useNew && p.strategy === 'old') oldCache.set(key, 1, { now: sim.now }); });
  });

  sim.every(1000, () => {
    const s = current;
    model.peak = Math.max(model.peak, s.completed);
    samples.push({ t: sim.now / 1000, queries: s.queries, completed: s.completed, failed: s.requests ? s.failedFast / s.requests : 0,
      newHit: s.newRequests ? s.newHits / s.newRequests : null, share: model.share(), oldReads: s.oldReads,
      answered: s.requests ? s.answered / s.requests : 0 });
    current = { ...blank(), newRequests: 0, newHits: 0, oldReads: 0, completed: 0 };
  });
  return model;
}
