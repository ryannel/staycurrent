// Figure 6: how Redis picks a key to evict without keeping keys in order.
// 100 keys; each simulated second a few random keys are read (their idle time
// returns to zero) and one new key arrives, which forces one eviction by
// SampledCache's Redis-like sampling and pool. The model records which keys
// were sampled, the pool, and whether the evicted key was among the oldest
// tenth of keys at that moment.
import { Simulation, seededRandom } from '../shared/sim.mjs';
import { SampledCache } from './sampled-cache.mjs';

export function samplingModel(params, seed = 1, { keys = 100, readsPerSecond = 6, warm = 120 } = {}) {
  const sim = new Simulation({ seed });
  const random = seededRandom(seed * 7 + 1);
  const cache = new SampledCache({ capacity: keys, policy: 'lru', samples: params.samples, random });
  // Slots let the figure draw each key in a fixed place; a new key takes the evicted key's slot.
  const slotOf = new Map();
  let next = 0;
  for (let i = 0; i < keys; i++) { cache.set(next, 0); slotOf.set(next, i); next++; }
  // Keys were last read up to `warm` seconds before the figure starts.
  for (const key of cache.list) cache.entries.get(key).lru = -Math.floor(random() * warm);
  const model = { sim, params, cache, slotOf, evictions: 0, fromOldestTenth: 0, last: null };
  const idleOf = (key, now) => cache.clock(now) - cache.entries.get(key).lru;

  // Remember the victim's idle time as it is removed.
  let victimIdle = 0;
  const remove = cache.remove.bind(cache);
  cache.remove = key => { if (cache.entries.has(key)) victimIdle = idleOf(key, sim.now); remove(key); };

  sim.every(1000, s => {
    for (let i = 0; i < readsPerSecond; i++) cache.get(cache.list[s.random.int(cache.list.length)], s.now);
    const idles = cache.list.map(k => idleOf(k, s.now)).sort((a, b) => b - a);
    const cutoff = idles[Math.floor(keys / 10) - 1];   // idle time of the tenth-oldest key
    cache.samples = model.params.samples;
    const [victim] = cache.set(next, s.now);
    const slot = slotOf.get(victim);
    const sampled = cache.lastSample.map(k => (k === victim ? slot : slotOf.get(k)));
    slotOf.delete(victim);
    slotOf.set(next, slot);
    next++;
    model.evictions++;
    const oldest = victimIdle >= cutoff;
    if (oldest) model.fromOldestTenth++;
    model.last = { slot, sampled, idle: victimIdle, cutoff, oldest, oldestIdle: idles[0] };
  });
  return model;
}

/** Idle time in seconds of the key in each slot, for shading. */
export function slotIdle(model) {
  const { cache, slotOf, sim } = model;
  const idle = new Array(slotOf.size).fill(0);
  for (const [key, slot] of slotOf) idle[slot] = cache.clock(sim.now) - cache.entries.get(key).lru;
  return idle;
}

/** The pool's candidates, best first: their slot (or null if the key has gone) and recorded idle time. */
export function poolSlots(model) {
  return [...model.cache.pool].reverse().map(p => ({ slot: model.slotOf.get(p.key) ?? null, idle: p.score }));
}
