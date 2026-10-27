// An illustrative cache-aside model for the toolkit test bench. Requests pick
// keys with Zipf popularity; the application asks Redis, and on a miss reads
// the database and stores the value. Travel times are animation timings, not
// measured latencies. Pure: runs under node.
import { Simulation, Movers, poissonArrivals, zipf, LruCache, Window, RecentRatio } from '../sim.mjs';

/** Animation timings for each hop, in simulated milliseconds. */
export const HOPS = { client: 420, redis: 300, database: 600 };

/**
 * params: capacity (keys Redis can hold), keys (distinct keys), skew (Zipf s),
 * rate (requests a second), warm (start with the most popular keys cached),
 * animate (schedule hops for drawing; false decides each request instantly).
 */
export function cacheAside(params = {}, seed = 1) {
  const p = { capacity: 20, keys: 100, skew: 1, rate: 3, warm: true, animate: true, ...params };
  const sim = new Simulation({ seed });
  const popularity = zipf(p.keys, p.skew);
  const cache = new LruCache(p.capacity);
  const movers = new Movers(sim);
  const stats = { requests: 0, hits: 0, misses: 0, databaseReads: 0 };
  const databaseWindow = new Window(5000);
  const recent = new RecentRatio(200);
  const samples = [];
  const model = { sim, params: p, cache, movers, stats, databaseWindow, recent, samples, popularity };

  model.warm = () => {
    // Most popular last, so it is the most recently used.
    for (let k = Math.min(p.capacity, p.keys) - 1; k >= 0; k--) if (!cache.peek(k)) cache.set(k, 'v', { now: sim.now });
  };
  if (p.warm) model.warm();

  const decide = key => {
    const hit = !!cache.get(key, sim.now);
    stats.requests++;
    recent.add(hit);
    if (hit) stats.hits++;
    else { stats.misses++; stats.databaseReads++; databaseWindow.add(sim.now); }
    return hit;
  };

  poissonArrivals(sim, () => model.params.rate, () => {
    const key = popularity.sample(sim.random);
    if (!p.animate) {
      if (!decide(key)) cache.set(key, 'v', { now: sim.now });
      return;
    }
    movers.add({ edge: 'client-app', duration: HOPS.client, kind: 'client', onArrive: () =>
      movers.add({ edge: 'app-redis', duration: HOPS.redis, kind: 'client', onArrive: () => {
        const hit = decide(key);
        const kind = hit ? 'hit' : 'miss';
        if (hit) {
          movers.add({ edge: 'app-redis', reverse: true, duration: HOPS.redis, kind, onArrive: () =>
            movers.add({ edge: 'client-app', reverse: true, duration: HOPS.client, kind }) });
          return;
        }
        movers.add({ edge: 'app-redis', reverse: true, duration: HOPS.redis, kind, onArrive: () =>
          movers.add({ edge: 'app-database', duration: HOPS.database, kind, onArrive: () =>
            movers.add({ edge: 'app-database', reverse: true, duration: HOPS.database, kind, onArrive: () => {
              movers.add({ edge: 'app-redis', duration: HOPS.redis, kind: 'write', onArrive: () => cache.set(key, 'v', { now: sim.now }) });
              movers.add({ edge: 'client-app', reverse: true, duration: HOPS.client, kind });
            } }) }) });
      } }) });
  });

  // One sample a second of simulated time, for charts.
  let lastReads = 0;
  sim.every(1000, () => {
    samples.push({ t: sim.now / 1000, databaseReads: stats.databaseReads - lastReads, hitRatio: recent.value });
    lastReads = stats.databaseReads;
  });
  return model;
}

/** Applies slider changes in place. Returns false when the model must be rebuilt. */
export function updateCacheAside(model, params) {
  if (params.keys !== undefined && params.keys !== model.params.keys) return false;
  if (params.skew !== undefined && params.skew !== model.params.skew) return false;
  Object.assign(model.params, params);
  model.cache.resize(model.params.capacity);
  if (model.params.warm) model.warm();
  return true;
}
