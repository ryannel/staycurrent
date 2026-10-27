// Figure 7: caching "not found". Shoppers look up products that exist (always
// cached here, so they hit) and ids that do not exist. The missing ids are
// either a few repeated ones (old links, a deleted product) or a new random id
// each time (a scraper, a bug, an attack). Three ways to handle them:
//   'off'    cache nothing: every lookup for a missing id reaches the database
//   'on'     a lookup that finds nothing stores a short-lived "not found" entry
//   'filter' a Bloom filter of the ids that exist is checked in the same round
//            trip as the GET; it answers "definitely absent" for most missing
//            ids, and a false positive (1% here) goes on to the database
// Illustrative: the rates, TTL, false-positive rate and id mix are invented. Pure.
import { Simulation, Movers, poissonArrivals, zipf, Window } from '../shared/sim.mjs';

export const HOPS = { client: 380, redis: 280, database: 560 };

export function negative(params = {}, seed = 1) {
  const p = { negative: 'off', missing: 'repeated', found: 2, absent: 2, ttl: 30000, falsePositive: 0.01, animate: true, ...params };
  const sim = new Simulation({ seed });
  const repeated = zipf(8, 1);
  const movers = new Movers(sim);
  /** Not-found entries: id → expiresAt. */
  const sentinels = new Map();
  const totals = { lookups: 0, absentLookups: 0, absentDb: 0, sentinelHits: 0, foundHits: 0, filtered: 0 };
  /** Whether the filter wrongly says "maybe present" for an id: fixed per id, as in a real filter. */
  const falsePositives = new Map();
  const maybePresent = id => {
    if (!falsePositives.has(id)) falsePositives.set(id, sim.random() < p.falsePositive);
    return falsePositives.get(id);
  };
  const windows = { absentDb: new Window(20000), absent: new Window(20000) };
  const model = { sim, params: p, movers, sentinels, totals, windows };

  const travel = (edge, duration, kind, reverse, onArrive, data) => {
    if (p.animate) movers.add({ edge, duration, kind, reverse, onArrive, data });
    else sim.after(duration, onArrive ?? (() => {}));
  };

  model.lookup = (id, exists) => {
    totals.lookups++;
    if (!exists) { totals.absentLookups++; windows.absent.add(sim.now); }
    const tag = exists ? undefined : { absent: true };
    travel('client-app', HOPS.client, 'client', false, () => travel('app-redis', HOPS.redis, 'client', false, () => {
      if (exists) { totals.foundHits++; travel('app-redis', HOPS.redis, 'hit', true, () => travel('client-app', HOPS.client, 'hit', true)); return; }
      if (model.params.negative === 'filter' && !maybePresent(id)) {
        totals.filtered++;
        travel('app-redis', HOPS.redis, 'hit', true, () => travel('client-app', HOPS.client, 'hit', true));
        return;
      }
      const expiresAt = sentinels.get(id);
      if (expiresAt !== undefined && expiresAt > sim.now) {
        totals.sentinelHits++;
        travel('app-redis', HOPS.redis, 'hit', true, () => travel('client-app', HOPS.client, 'hit', true));
        return;
      }
      if (expiresAt !== undefined) sentinels.delete(id);
      travel('app-redis', HOPS.redis, 'miss', true, () => {
        totals.absentDb++; windows.absentDb.add(sim.now);
        travel('app-database', HOPS.database, 'miss', false, () => travel('app-database', HOPS.database, 'miss', true, () => {
          if (model.params.negative === 'on') {
            sentinels.set(id, sim.now + p.ttl);
            travel('app-redis', HOPS.redis, 'write', false);
          }
          travel('client-app', HOPS.client, 'miss', true);
        }));
      });
    }, tag), tag);
  };

  poissonArrivals(sim, () => p.found, () => model.lookup(`p${sim.random.int(200)}`, true));
  poissonArrivals(sim, () => p.absent, () => {
    const id = model.params.missing === 'repeated' ? `x${repeated.sample(sim.random)}` : `r${sim.random.int(1e9)}`;
    model.lookup(id, false);
  });
  return model;
}

/** Not-found entries still alive. */
export const liveSentinels = model => [...model.sentinels.values()].filter(t => t > model.sim.now).length;
