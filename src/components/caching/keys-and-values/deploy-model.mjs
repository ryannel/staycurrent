// Figure 4: a rolling deploy changes the shape of a cached value. Six
// application instances share one Redis. From `start`, one instance every
// `step` ms is replaced by version 2, which writes and expects a new shape.
// Four ways to handle it:
//   'strict'        same key; a reader that meets the other version's shape fails the request
//   'tolerant'      same key; a reader treats the other shape as a miss, reads the database and overwrites
//   'versioned'     the version is part of the key; a product change deletes the key of the
//                   version that handled it, so the other version's copy goes stale
//   'versioned-all' the version is part of the key; a product change deletes the key under
//                   every version still running
// Products also change (`changes` a second, more often for popular products),
// and every change deletes the cached copy, as in cache-aside. A hit on an entry
// filled before the latest change is a stale read. Every entry has the same TTL.
// Redis starts full of version 1 entries with spread-out remaining lifetimes.
// Illustrative: rates and timings are invented. Pure.
import { Simulation, poissonArrivals, zipf, Window } from '../shared/sim.mjs';

export const INSTANCES = 6;
export const MODES = ['strict', 'tolerant', 'versioned', 'versioned-all'];

export function deploy(params = {}, seed = 1) {
  const p = { mode: 'strict', rate: 60, keys: 300, skew: 1, ttl: 30000, start: 6000, step: 3000, changes: 2, ...params };
  const sim = new Simulation({ seed });
  const popularity = zipf(p.keys, p.skew);
  const versions = new Array(INSTANCES).fill(1);
  const versionedKeys = p.mode === 'versioned' || p.mode === 'versioned-all';
  /** Redis: key string → { version, rev, expiresAt }. */
  const redis = new Map();
  /** The database: each product's revision, raised by every change. */
  const revs = new Array(p.keys).fill(0);
  const keyOf = (k, v) => (versionedKeys ? `product:v${v}:${k}` : `product:${k}`);
  // Start in steady state: a key read at rate r with lifetime T is cached for a
  // share rT / (1 + rT) of the time, with the rest of its lifetime spread evenly.
  for (let k = 0; k < p.keys; k++) {
    const rt = (p.rate * popularity.probability(k) * p.ttl) / 1000;
    if (sim.random() < rt / (1 + rt)) redis.set(keyOf(k, 1), { version: 1, rev: 0, expiresAt: sim.random() * p.ttl });
  }
  const totals = { requests: 0, errors: 0, reads: 0, hits: 0, stale: 0, changes: 0 };
  const windows = { errors: new Window(2000), reads: new Window(2000), stale: new Window(2000) };
  const model = { sim, params: p, versions, redis, revs, totals, windows, flashes: new Array(INSTANCES).fill(null), lastStale: -Infinity };

  versions.forEach((_, i) => sim.at(p.start + i * p.step, () => { versions[i] = 2; }));

  const get = key => {
    const entry = redis.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= sim.now) { redis.delete(key); return undefined; }
    return entry;
  };
  const fill = (key, k, version) => {
    totals.reads++; windows.reads.add(sim.now);
    redis.set(key, { version, rev: revs[k], expiresAt: sim.now + p.ttl });
  };

  model.request = (instance, k) => {
    totals.requests++;
    const version = versions[instance];
    const key = keyOf(k, version);
    const entry = get(key);
    let outcome;
    if (!entry) { fill(key, k, version); outcome = 'miss'; }
    else if (entry.version === version) {
      totals.hits++;
      if (entry.rev < revs[k]) { totals.stale++; windows.stale.add(sim.now); model.lastStale = sim.now; outcome = 'stale'; }
      else outcome = 'hit';
    }
    else if (p.mode === 'strict') { totals.errors++; windows.errors.add(sim.now); outcome = 'error'; }
    else { fill(key, k, version); outcome = 'miss'; }
    model.flashes[instance] = { kind: outcome, at: sim.now };
    return outcome;
  };

  /** A product change handled by `instance`: update the database, then delete the cached copy. */
  model.change = (instance, k) => {
    totals.changes++;
    revs[k]++;
    if (p.mode === 'versioned-all') for (const v of [1, 2]) redis.delete(keyOf(k, v));
    else redis.delete(keyOf(k, versions[instance]));
  };

  poissonArrivals(sim, () => p.rate, () => model.request(sim.random.int(INSTANCES), popularity.sample(sim.random)));
  poissonArrivals(sim, () => p.changes, () => model.change(sim.random.int(INSTANCES), popularity.sample(sim.random)));
  return model;
}

/** Entries in Redis by the version that wrote them, ignoring those already expired. */
export function held(model) {
  const counts = { 1: 0, 2: 0 };
  for (const entry of model.redis.values()) if (entry.expiresAt > model.sim.now) counts[entry.version]++;
  return counts;
}

export const upgraded = model => model.versions.filter(v => v === 2).length;
