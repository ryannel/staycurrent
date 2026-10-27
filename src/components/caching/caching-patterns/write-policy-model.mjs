// Figure 1: what a write does to the cached copy. Six products are read with
// skewed popularity and occasionally repriced. Each product has a version in the
// database and, when cached, a version in Redis; a cached version older than the
// database's is stale. The policy decides what a write does to Redis after the
// database commit: 'leave' it, 'delete' the key, or 'update' it with the new
// version. Decisions are instantaneous; nothing here models latency. Pure.
import { Simulation, poissonArrivals, zipf } from '../shared/sim.mjs';

export const PRODUCTS = 6;

/**
 * params: policy ('leave' | 'delete' | 'update'), reads and writes (a second;
 * both follow the same popularity, so busy products also change more), ttl (ms).
 * Every product starts cached and fresh, so the first seconds show the policy
 * rather than a cold start.
 */
export function writePolicy(params = {}, seed = 1) {
  const p = { policy: 'delete', reads: 3, writes: 0.3, ttl: 12000, ...params };
  const sim = new Simulation({ seed });
  const popularity = zipf(PRODUCTS, 1);
  const rows = Array.from({ length: PRODUCTS }, (_, i) => ({
    id: i + 1, db: 1, redis: { version: 1, expiresAt: p.ttl * (0.4 + (0.6 * (PRODUCTS - i)) / PRODUCTS) }, events: [],
  }));
  const stats = { reads: 0, hits: 0, misses: 0, stale: 0, writes: 0 };
  const model = { sim, params: p, rows, stats, popularity };
  const note = (row, kind) => {
    row.events.push({ t: sim.now, kind });
    while (row.events.length && row.events[0].t < sim.now - 60000) row.events.shift();
  };
  const cached = row => row.redis && row.redis.expiresAt > sim.now;
  // Expiry is shown when it happens, not only when the next read finds it.
  const expireLater = row => {
    const entry = row.redis;
    sim.at(entry.expiresAt, () => { if (row.redis === entry) { row.redis = null; note(row, 'expiry'); } });
  };
  rows.forEach(expireLater);

  model.read = index => {
    const row = rows[index];
    stats.reads++;
    if (cached(row)) {
      stats.hits++;
      if (row.redis.version < row.db) { stats.stale++; note(row, 'stale'); } else note(row, 'hit');
      return;
    }
    stats.misses++;
    note(row, 'miss');
    row.redis = { version: row.db, expiresAt: sim.now + p.ttl };
    expireLater(row);
  };
  model.write = index => {
    const row = rows[index];
    stats.writes++;
    row.db++;
    note(row, 'write');
    if (model.params.policy === 'delete') row.redis = null;
    else if (model.params.policy === 'update') { row.redis = { version: row.db, expiresAt: sim.now + p.ttl }; expireLater(row); }
  };

  poissonArrivals(sim, () => model.params.reads, () => model.read(popularity.sample(sim.random)));
  poissonArrivals(sim, () => model.params.writes, () => model.write(popularity.sample(sim.random)));
  return model;
}

/** Share of reads that returned an outdated version, and the hit ratio (stale hits included). */
export const summary = model => ({
  hitRatio: model.stats.reads ? model.stats.hits / model.stats.reads : 0,
  staleShare: model.stats.reads ? model.stats.stale / model.stats.reads : 0,
});
