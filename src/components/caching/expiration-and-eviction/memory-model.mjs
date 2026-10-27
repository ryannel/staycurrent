// Figure 5: what a full Redis does under three maxmemory policies.
// A Redis with room for `slots` keys receives cache writes that carry a TTL
// (long enough not to expire during the figure) and writes of keys without a
// TTL, such as sessions or counters, or cache keys written by code that forgot
// the TTL. Reads touch random keys, so recency differs. Eviction here takes
// the exact least recently used candidate; Redis samples (figure 6).
import { Simulation, poissonArrivals } from '../shared/sim.mjs';

export const POLICIES = ['noeviction', 'volatile-lru', 'allkeys-lru'];

export function memoryModel(params, seed = 1, options = {}) {
  const { slots = 48, cacheRate = 3, plainRate = 0.75, readRate = 4 } = options;
  const sim = new Simulation({ seed });
  const model = {
    sim, params, slots,
    cells: new Array(slots).fill(null),   // { id, ttl: boolean, used: last access ms, born }
    nextId: 1,
    stats: { refused: 0, evicted: 0, evictedPlain: 0, writes: 0 },
    events: [],                           // recent { slot, kind: 'evicted' | 'refused' | 'stored', t }
  };
  const candidates = ttlOnly => model.cells.map((c, i) => [c, i]).filter(([c]) => c && (!ttlOnly || c.ttl));
  const write = (ttl, now) => {
    model.stats.writes++;
    let slot = model.cells.indexOf(null);
    if (slot < 0) {
      const policy = model.params.policy;
      const pool = policy === 'allkeys-lru' ? candidates(false) : policy === 'volatile-lru' ? candidates(true) : [];
      if (!pool.length) {
        model.stats.refused++;
        model.events.push({ slot: -1, kind: 'refused', t: now, ttl });
        return;
      }
      const [victim, at] = pool.reduce((a, b) => (b[0].used < a[0].used ? b : a));
      model.stats.evicted++;
      if (!victim.ttl) model.stats.evictedPlain++;
      model.events.push({ slot: at, kind: 'evicted', t: now, ttl: victim.ttl });
      slot = at;
    }
    model.cells[slot] = { id: model.nextId++, ttl, used: now, born: now };
    model.events.push({ slot, kind: 'stored', t: now, ttl });
  };
  poissonArrivals(sim, cacheRate, s => write(true, s.now));
  poissonArrivals(sim, plainRate, s => write(false, s.now));
  poissonArrivals(sim, readRate, s => {
    const present = model.cells.filter(Boolean);
    if (present.length) present[s.random.int(present.length)].used = s.now;
  });
  sim.every(500, s => { model.events = model.events.filter(e => s.now - e.t < 1200); });
  return model;
}

export const plainCount = model => model.cells.filter(c => c && !c.ttl).length;
