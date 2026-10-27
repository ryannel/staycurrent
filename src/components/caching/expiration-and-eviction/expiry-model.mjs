// Figure 3: an expired key is invisible to reads at once, but its memory is
// freed only when a command touches it (passive expiry) or the background
// cycle finds it (active expiry).
//
// New keys arrive at `writeRate` a second with TTLs between `minTtl` and
// `maxTtl` seconds, and are read only while they are recent, as with one-off
// keys such as search results or sessions. The background cycle follows the
// shape of activeExpireCycle in Redis 8.10.3 (src/expire.c): every 100 ms it
// samples up to 20 keys that have a TTL, deletes the expired ones, and repeats
// while more than 10% of the sample had expired. Redis also stops after 25 ms
// of work in each 100 ms; this model caps the repeats at `maxLoops` instead.
import { Simulation, poissonArrivals } from '../shared/sim.mjs';

export const CYCLE_MS = 100;
export const KEYS_PER_LOOP = 20;
export const ACCEPTABLE_STALE = 0.1;

export function expiryModel(params, seed = 1, options = {}) {
  const { writeRate = 6, readRate = 6, minTtl = 4, maxTtl = 8, readWindow = 10, maxLoops = 16 } = options;
  const sim = new Simulation({ seed });
  const model = {
    sim, params,
    keys: [],                // keys in creation order: { id, created, expiresAt, removedAt? }; removed keys stay 500 ms for drawing
    nextId: 1,
    stats: { passive: 0, active: 0, created: 0, reads: 0, hits: 0 },
    samples: [],             // { t, live, held } every 250 ms
  };
  const present = () => model.keys.filter(k => k.removedAt === undefined);
  const remove = (key, how, now) => {
    key.removedAt = now;
    model.stats[how]++;
  };
  const compact = now => { model.keys = model.keys.filter(k => k.removedAt === undefined || now - k.removedAt < 500); };

  poissonArrivals(sim, writeRate, s => {
    const ttl = (minTtl + s.random() * (maxTtl - minTtl)) * 1000;
    model.keys.push({ id: model.nextId++, created: s.now, expiresAt: s.now + ttl });
    model.stats.created++;
  });
  poissonArrivals(sim, readRate, s => {
    // A read asks for a recent key. If that key has expired, Redis deletes it now and answers "not found".
    const recent = present().filter(k => s.now - k.created < readWindow * 1000);
    if (!recent.length) return;
    const key = recent[s.random.int(recent.length)];
    model.stats.reads++;
    if (key.expiresAt <= s.now) remove(key, 'passive', s.now);
    else model.stats.hits++;
  });
  sim.every(CYCLE_MS, s => {
    if (!model.params.active) return;
    for (let loop = 0; loop < maxLoops; loop++) {
      const pool = present();
      if (!pool.length) break;
      const n = Math.min(KEYS_PER_LOOP, pool.length);
      const picked = new Set();
      while (picked.size < n) picked.add(pool[s.random.int(pool.length)]);
      let expired = 0;
      for (const key of picked) if (key.expiresAt <= s.now) { remove(key, 'active', s.now); expired++; }
      if (expired / n <= ACCEPTABLE_STALE) break;
    }
    compact(s.now);
  });
  sim.every(250, s => {
    compact(s.now);
    const keys = present();
    const held = keys.filter(k => k.expiresAt <= s.now).length;
    model.samples.push({ t: s.now / 1000, live: keys.length - held, held });
  }, 0);
  return model;
}

/** Keys still in memory (not deleted). */
export const inMemory = model => model.keys.filter(k => k.removedAt === undefined);

/** Keys whose TTL has passed but which still occupy memory. */
export const heldCount = model => inMemory(model).filter(k => k.expiresAt <= model.sim.now).length;
