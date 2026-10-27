// Illustrative models for the introduction's figures. Pure: no DOM, so each
// runs and is tested under node (model.test.mjs). Every latency, rate and
// capacity here is an assumption chosen to show one idea, not a measurement.
import { Simulation, Movers, poissonArrivals, zipf, LruCache, Window, RecentRatio, seededRandom, logNormal } from '../shared/sim.mjs';

/** Animation timings for each hop, in simulated milliseconds. */
export const HOPS = { client: 420, redis: 300, database: 650 };

/** Assumed costs for figures 4 and 5: a Redis read and a database read, in milliseconds. */
export const COSTS = { cache: 1, database: 20, rate: 1000 };

/**
 * Figure 1: an application with no cache. Each request asks the database for a
 * product page; popularity is Zipf-like. Counts how often each product's answer
 * was computed, to show how much of the work repeats.
 * params: rate (requests a second), keys, skew, animate.
 */
export function repeatedWork(params = {}, seed = 1) {
  const p = { rate: 3, keys: 50, skew: 1, animate: true, ...params };
  const sim = new Simulation({ seed });
  const popularity = zipf(p.keys, p.skew);
  const movers = new Movers(sim);
  const computed = new Array(p.keys).fill(0);
  const stats = { queries: 0, distinct: 0 };
  const reads = new Window(10000);
  const model = { sim, params: p, movers, computed, stats, reads };
  const answer = key => {
    if (computed[key] === 0) stats.distinct++;
    computed[key]++;
    stats.queries++;
    reads.add(sim.now);
  };
  poissonArrivals(sim, () => model.params.rate, () => {
    const key = popularity.sample(sim.random);
    if (!p.animate) { answer(key); return; }
    movers.add({ edge: 'client-app', duration: HOPS.client, kind: 'client', onArrive: () =>
      movers.add({ edge: 'app-database', duration: HOPS.database, kind: 'client', onArrive: () => {
        answer(key);
        movers.add({ edge: 'app-database', reverse: true, duration: HOPS.database, kind: 'database', onArrive: () =>
          movers.add({ edge: 'client-app', reverse: true, duration: HOPS.client, kind: 'database' }) });
      } }) });
  });
  /** The `count` most computed products, as [{ key, count }]. */
  model.top = (count = 6) => computed.map((c, key) => ({ key, count: c })).sort((a, b) => b.count - a.count || a.key - b.key).slice(0, count);
  /** Share of queries whose answer the database had already computed before. */
  model.repeatShare = () => (stats.queries ? (stats.queries - stats.distinct) / stats.queries : 0);
  return model;
}

/**
 * Figures 3, 7 and 10: cache-aside. The application asks Redis; on a miss it
 * reads the database and stores the value with an expiry.
 * params:
 *   keys, skew       how many products and how unevenly they are requested (Zipf s)
 *   rate             requests a second
 *   capacity         keys Redis can hold (least recently used removed first); Infinity for no limit
 *   ttl              expiry in simulated ms; Infinity for none
 *   dbCapacity       database reads it can serve in any one second; misses beyond it fail
 *                    and are not stored (Infinity for no limit)
 *   animate          schedule hops for drawing; false decides each request at once
 *   warm             start with the most popular keys cached (capacity permitting); 'staggered'
 *                    also gives each a random remaining time to live, so expiries are spread out
 *                    as they would be in a cache that has been running for a while
 *   redis            'up', or 'down': every lookup fails and is treated as a miss, nothing is stored,
 *                    and Redis comes back empty, as after a restart without persistence
 *   sample           milliseconds between chart samples (default 1000)
 *   prerun           simulated ms to run before the figure first draws (non-animated models)
 */
export function cacheAside(params = {}, seed = 1) {
  const p = { keys: 100, skew: 1, rate: 4, capacity: Infinity, ttl: Infinity, dbCapacity: Infinity, animate: true, warm: false, redis: 'up', sample: 1000, prerun: 0, ...params };
  const sim = new Simulation({ seed });
  const popularity = zipf(p.keys, p.skew);
  const cache = new LruCache(p.capacity);
  const movers = new Movers(sim);
  const stats = { requests: 0, hits: 0, misses: 0, databaseReads: 0, failed: 0 };
  // Database capacity is enforced over quarter-second slots, so overload sheds
  // requests evenly instead of in one-second bursts.
  const databaseWindow = new Window(250);
  const readsWindow = new Window(5000);
  const recent = new RecentRatio(p.animate ? 100 : 2000);
  const samples = [];
  const model = { sim, params: p, cache, movers, stats, databaseWindow, readsWindow, recent, samples, popularity };

  model.warm = () => {
    // Most popular last, so it is the most recently used.
    const stagger = p.warm === 'staggered' && Number.isFinite(model.params.ttl);
    for (let k = Math.min(model.params.capacity, p.keys) - 1; k >= 0; k--) {
      if (!cache.peek(k)) cache.set(k, 'v', { now: sim.now, ttl: stagger ? Math.max(1, sim.random() * model.params.ttl) : model.params.ttl });
    }
  };
  if (p.warm) model.warm();
  /** Empties Redis, as a restart without persistence or a FLUSHALL would. */
  model.flush = () => { for (const key of cache.keys()) cache.delete(key); model.flushedAt = sim.now; };

  const lookup = key => {
    const hit = model.params.redis !== 'down' && !!cache.get(key, sim.now);
    stats.requests++;
    recent.add(hit);
    if (hit) stats.hits++; else stats.misses++;
    return hit;
  };
  // A database read: succeeds if the database has spare capacity this second.
  const readDatabase = () => {
    if (databaseWindow.count(sim.now) >= model.params.dbCapacity / 4) { stats.failed++; return false; }
    databaseWindow.add(sim.now);
    readsWindow.add(sim.now);
    stats.databaseReads++;
    return true;
  };
  const store = key => { if (model.params.redis !== 'down') cache.set(key, 'v', { now: sim.now, ttl: model.params.ttl }); };

  poissonArrivals(sim, () => model.params.rate, () => {
    const key = popularity.sample(sim.random);
    if (!p.animate) {
      if (!lookup(key) && readDatabase()) store(key);
      return;
    }
    movers.add({ edge: 'client-app', duration: HOPS.client, kind: 'client', onArrive: () =>
      movers.add({ edge: 'app-redis', duration: HOPS.redis, kind: 'client', onArrive: () => {
        if (lookup(key)) {
          movers.add({ edge: 'app-redis', reverse: true, duration: HOPS.redis, kind: 'hit', onArrive: () =>
            movers.add({ edge: 'client-app', reverse: true, duration: HOPS.client, kind: 'hit' }) });
          return;
        }
        movers.add({ edge: 'app-redis', reverse: true, duration: HOPS.redis, kind: 'miss', onArrive: () =>
          movers.add({ edge: 'app-database', duration: HOPS.database, kind: 'miss', onArrive: () => {
            const ok = readDatabase();
            movers.add({ edge: 'app-database', reverse: true, duration: HOPS.database, kind: ok ? 'miss' : 'error', onArrive: () => {
              if (ok) movers.add({ edge: 'app-redis', duration: HOPS.redis, kind: 'write', onArrive: () => store(key) });
              movers.add({ edge: 'client-app', reverse: true, duration: HOPS.client, kind: ok ? 'miss' : 'error' });
            } });
          } }) });
      } }) });
  });

  // Regular samples of simulated time for charts; rates are per second.
  let last = { requests: 0, misses: 0, hits: 0, databaseReads: 0, failed: 0 };
  const perSecond = 1000 / p.sample;
  sim.every(p.sample, () => {
    const d = Object.fromEntries(Object.keys(last).map(k => [k, stats[k] - last[k]]));
    samples.push({ t: sim.now / 1000, demand: d.misses * perSecond, served: d.databaseReads * perSecond, failed: d.failed * perSecond, hitRatio: d.requests ? d.hits / d.requests : 0 });
    last = { ...stats };
  });
  if (p.prerun) { sim.advance(p.prerun); model.prerun = p.prerun; }
  return model;
}

/** Applies parameter changes in place; returns false when the model must be rebuilt. */
export function updateCacheAside(model, params) {
  for (const name of ['keys', 'skew']) if (params[name] !== undefined && params[name] !== model.params[name]) return false;
  const wasDown = model.params.redis === 'down';
  Object.assign(model.params, params);
  // Redis going down loses its contents: it comes back empty.
  if (!wasDown && model.params.redis === 'down') model.flush();
  model.cache.resize(model.params.capacity);
  return true;
}

/**
 * Expected hit ratio of cache-aside with unlimited room and expiry `ttl` (ms):
 * a key requested λ times a second misses once, then hits about λ·T times
 * before it expires, so its hit share is λT / (1 + λT). Used to check the model.
 */
export function expectedTtlHitRatio({ keys, skew, rate, ttl }) {
  const z = zipf(keys, skew);
  let h = 0;
  for (let k = 0; k < keys; k++) {
    const share = z.probability(k);
    const perExpiry = share * rate * (ttl / 1000);
    h += share * (perExpiry / (1 + perExpiry));
  }
  return h;
}

/** Figure 4: mean latency (ms) and database reads a second for hit ratio h. */
export function costOf(h, costs = COSTS) {
  const miss = 1 - h;
  return { mean: costs.cache + miss * costs.database, databaseReads: costs.rate * miss, missRatio: miss };
}

/** Figure 4: which of n requests miss, exactly round((1 - h) n) of them, scattered by a seeded shuffle. */
export function missPositions(h, n = 1000, seed = 5) {
  const misses = Math.round((1 - h) * n);
  const random = seededRandom(seed);
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) { const j = random.int(i + 1); [order[i], order[j]] = [order[j], order[i]]; }
  return new Set(order.slice(0, misses));
}

/**
 * Figure 5: request latencies for hit ratio h. A hit costs a Redis round trip
 * (median 1 ms); a miss adds a database read (median 20 ms). Exactly
 * round(h · n) requests hit, so the figure does not jitter between choices.
 */
export function latencySamples(h, n = 5000, seed = 11) {
  const random = seededRandom(seed);
  const hitCount = Math.round(h * n);
  const hits = [], misses = [];
  for (let i = 0; i < n; i++) {
    const redis = logNormal(random, COSTS.cache, 0.35);
    const database = logNormal(random, COSTS.database, 0.45);
    if (i < hitCount) hits.push(redis); else misses.push(redis + database);
  }
  return { hits, misses };
}

/**
 * Figure 6: share of requests received by each of `groups` equal slices of the
 * items, from most to least popular, for Zipf exponent s over n items.
 */
export function popularityGroups(s, n = 100000, groups = 100) {
  const z = zipf(n, s);
  const size = n / groups;
  return Array.from({ length: groups }, (_, g) => z.topShare(Math.round((g + 1) * size)) - z.topShare(Math.round(g * size)));
}

/** Smallest share of items (0–1) whose requests add up to at least `target` of all requests. */
export function itemsFor(target, s, n = 100000) {
  const z = zipf(n, s);
  let lo = 1, hi = n;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (z.topShare(mid) >= target) hi = mid; else lo = mid + 1; }
  return lo / n;
}
