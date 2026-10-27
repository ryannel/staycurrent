// Figures 1 and 2: what a TTL buys and what it costs, for one cached key.
// The key is read as a Poisson stream at `rate` a second; its database value
// changes as a Poisson stream at `changeRate` a second; a miss reads the
// database and caches the value for `ttl` seconds. Nothing deletes the copy
// when the database changes, so the TTL alone bounds staleness.
import { Simulation, poissonArrivals } from '../shared/sim.mjs';

/** Hit ratio of one key: each fill is followed by about rate × ttl hits. */
export const hitRatio = (rate, ttl) => (rate * ttl) / (1 + rate * ttl);

/** Share of hits that return a value the database has since changed. */
export function staleShare(changeRate, ttl) {
  const x = changeRate * ttl;
  if (x < 1e-9) return x / 2;
  return 1 - (1 - Math.exp(-x)) / x;
}

/** Database reads a second for this key. */
export const databaseReads = (rate, ttl) => 1 / (ttl + 1 / rate);

/** The TTL that gives a target hit ratio: h = rT / (1 + rT), so T = h / ((1 − h) r). */
export const ttlForHitRatio = (rate, target) => target / ((1 - target) * rate);

/**
 * Live model for figure 1. params: { ttl } in seconds. Fixed: reads once a
 * second, a change every 30 seconds on average.
 */
export function oneKey(params, seed = 1, { rate = 1, changeRate = 1 / 30 } = {}) {
  const sim = new Simulation({ seed });
  const model = {
    sim, params, rate, changeRate,
    version: 1,
    copy: null,                 // { version, from, to } while Redis holds a copy
    copies: [],                 // past and present copies, for the timeline
    reads: [],                  // { t, kind: 'hit' | 'miss' | 'stale' }
    changes: [],                // { t, version }
    stats: { hits: 0, misses: 0, stale: 0 },
    counting: true,             // false after a TTL change, until the first copy stored with the new TTL
    statsFrom: 0,               // simulated ms when the current count began
  };
  poissonArrivals(sim, changeRate, s => {
    model.version++;
    model.changes.push({ t: s.now, version: model.version });
  });
  poissonArrivals(sim, rate, s => {
    const now = s.now;
    if (model.copy && now < model.copy.to) {
      const stale = model.copy.version < model.version;
      if (model.counting) {
        model.stats.hits++;
        if (stale) model.stats.stale++;
      }
      model.reads.push({ t: now, kind: stale ? 'stale' : 'hit' });
    } else {
      if (!model.counting) { model.counting = true; model.statsFrom = now; }
      model.stats.misses++;
      model.reads.push({ t: now, kind: 'miss' });
      model.copy = { version: model.version, from: now, to: now + model.params.ttl * 1000 };
      model.copies.push(model.copy);
    }
  });
  return model;
}

/**
 * Applies a new TTL to figure 1's model. The copy Redis holds is dropped, so the
 * next read is a miss that stores a copy with the new TTL, and the counts start
 * again from that miss. (In Redis a stored copy keeps the TTL it was stored
 * with; dropping it is a modelling convenience so the counts describe only the
 * new TTL from the first read after the change.)
 */
export function setTtl(model, params) {
  model.params = params;
  if (model.copy) {
    model.copy.to = Math.min(model.copy.to, model.sim.now);
    model.copy.dropped = true;
    model.copy = null;
  }
  model.stats = { hits: 0, misses: 0, stale: 0 };
  model.counting = false;
}

/** Drops timeline items older than `keep` ms, so a long run stays small. */
export function trimTimeline(model, keep = 90000) {
  const from = model.sim.now - keep;
  const drop = (list, end) => { let i = 0; while (i < list.length && end(list[i]) < from) i++; if (i) list.splice(0, i); };
  drop(model.reads, r => r.t);
  drop(model.changes, c => c.t);
  drop(model.copies, c => c.to);
}
