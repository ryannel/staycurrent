// Figure 9: a batch job reads every item once while normal traffic continues.
// Normal reads follow Zipf popularity over `keys` keys at `rate` a second, as
// cache-aside (a miss stores the key). From `scanAt` seconds, for `scanFor`
// seconds, a job also reads one-off keys at `scanRate` a second, each stored
// on its miss. Two Redis-like caches of the same size see the same stream: one
// evicts by sampled LRU, the other by sampled LFU (sampled-cache.mjs). The
// figure plots the hit ratio of normal reads only.
//
// `slow` stretches the whole run in time by that factor (rates divided by it,
// times multiplied by it), so the same requests arrive at a slower pace. The
// LRU clock and LFU decay run on wall-clock time, so pace changes the result.
// `decay` is lfu-decay-time in minutes.
import { Simulation, seededRandom, zipf } from '../shared/sim.mjs';
import { SampledCache } from './sampled-cache.mjs';

export const SCAN_DEFAULTS = { keys: 5000, skew: 0.8, capacity: 500, rate: 300, scanRate: 300, scanAt: 20, scanFor: 10, warm: 60, bin: 1, decay: 1 };

/** Options for a run stretched in time by `slow`, with lfu-decay-time `decay` minutes. */
export const paced = (slow = 1, decay = 1) => ({ rate: 300 / slow, scanRate: 300 / slow, warm: 60 * slow, scanAt: 20 * slow, scanFor: 10 * slow, bin: slow, decay });

export function scanModel(params = {}, seed = 1, options = {}) {
  const o = { ...SCAN_DEFAULTS, ...options };
  const sim = new Simulation({ seed });
  const popularity = zipf(o.keys, o.skew);
  const caches = {
    lru: new SampledCache({ capacity: o.capacity, policy: 'lru', random: seededRandom(seed + 11) }),
    lfu: new SampledCache({ capacity: o.capacity, policy: 'lfu', random: seededRandom(seed + 23), decayMinutes: o.decay }),
  };
  const model = { sim, params, o, caches, samples: [], scanning: false, scanned: 0, bin: { lru: 0, lfu: 0, n: 0 }, totals: { lru: [0, 0], lfu: [0, 0] } };
  // Warm both caches before the figure's clock starts, so the chart begins in steady state.
  const offset = o.warm * 1000;
  let scanId = 0;
  const request = (key, now, normal) => {
    for (const id of ['lru', 'lfu']) {
      const cache = caches[id];
      const hit = cache.get(key, now);
      if (!hit) cache.set(key, now);
      if (normal && now >= offset) { model.bin[id] += hit ? 1 : 0; model.totals[id][0] += hit ? 1 : 0; model.totals[id][1]++; }
    }
    if (normal && now >= offset) model.bin.n++;
  };
  // Evenly spaced requests keep the two streams interleaved and the model cheap to run.
  sim.every(1000 / o.rate, s => request(popularity.sample(s.random), s.now, true), 0);
  sim.every(1000 / o.scanRate, s => {
    const t = s.now / 1000 - o.warm;
    model.scanning = t >= o.scanAt && t < o.scanAt + o.scanFor;
    if (model.scanning) { request(`scan:${scanId++}`, s.now, false); model.scanned++; }
  }, 0);
  sim.every(o.bin * 1000, s => {
    if (s.now <= offset) return;
    const t = (s.now - offset) / 1000;
    const n = model.bin.n || 1;
    model.samples.push({ t, lru: model.bin.lru / n, lfu: model.bin.lfu / n, scanning: model.scanning });
    model.bin = { lru: 0, lfu: 0, n: 0 };
  }, 0);
  sim.advance(offset);
  return model;
}

/** Mean hit ratio of normal reads in [from, to) seconds of figure time. */
export function meanBetween(model, id, from, to) {
  const rows = model.samples.filter(r => r.t > from && r.t <= to);
  return rows.length ? rows.reduce((s, r) => s + r[id], 0) / rows.length : NaN;
}

/** Simulated time in the figure's own clock (seconds after warm-up). */
export const figureTime = model => model.sim.now / 1000 - model.o.warm;
