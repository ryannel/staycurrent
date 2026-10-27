// One cached price under cache-aside with delete-on-write, over time. Pure; no
// DOM. Used by figure 1, "The copy is behind the database for a while".
//
// Reads arrive at random about four times a second. A read that finds the key
// cached is a hit, stale if the cached version is older than the database's. A
// read that misses fills the key after 150 ms with what the database held when
// the read began; reads that miss while that fill is under way share it rather
// than storing a second copy, so each stored copy lives exactly 15 seconds. A write commits a new price and the delete reaches Redis
// `deleteDelay` ms later, unless the reader has chosen "Deletes are lost", in
// which case every delete is dropped until they choose "Arrive" again.
// Cached values live for 15 seconds. Time is compressed: a real delete usually
// lands within a millisecond or two, and a real TTL is minutes.
import { Simulation, poissonArrivals } from '../shared/sim.mjs';

export const PRICES = ['£39', '£35', '£37', '£34', '£36', '£38'];
export const WINDOW_DEFAULTS = { deleteDelay: 400, loseDeletes: false, readRate: 4, writeEvery: 6000, fillTime: 150, ttl: 15000 };

export function createWindow(params = {}, seed = 3) {
  const p = { ...WINDOW_DEFAULTS, ...params };
  const sim = new Simulation({ seed });
  const model = {
    sim, params: p,
    db: { version: 0 },
    cache: null,                          // { version, expiresAt }
    dbHistory: [{ t: 0, version: 0 }],
    cacheHistory: [{ t: 0, version: null }],
    events: [],                           // { t, kind, row: 'reads' | 'db' | 'redis' }
    // How each stale stretch ended: by a delete, by expiry, or by a newer fill.
    stats: { reads: 0, stale: 0, longest: 0, lost: 0, endedBy: { delete: 0, expiry: 0, fill: 0 } },
    staleSince: null,
    filling: false,
  };
  const now = () => sim.now;
  const live = () => (model.cache && model.cache.expiresAt > now() ? model.cache : null);
  const setCache = (value, cause) => {
    model.cache = value;
    model.cacheHistory.push({ t: now(), version: value ? value.version : null });
    track(cause);
  };
  // Keeps the current stale run and the longest one, and records what ended each run.
  const track = cause => {
    const c = live();
    const stale = !!c && c.version < model.db.version;
    if (stale && model.staleSince === null) model.staleSince = now();
    if (!stale && model.staleSince !== null) {
      model.stats.longest = Math.max(model.stats.longest, now() - model.staleSince);
      if (cause) model.stats.endedBy[cause]++;
      model.staleSince = null;
    }
  };
  model.currentStale = () => (model.staleSince === null ? 0 : now() - model.staleSince);
  model.longest = () => Math.max(model.stats.longest, model.currentStale());

  poissonArrivals(sim, () => p.readRate, () => {
    model.stats.reads++;
    const c = live();
    if (c) {
      const stale = c.version < model.db.version;
      if (stale) model.stats.stale++;
      model.events.push({ t: now(), kind: stale ? 'stale' : 'hit', row: 'reads' });
      return;
    }
    if (model.cache) setCache(null, 'expiry');   // expired: record the gap
    model.events.push({ t: now(), kind: 'miss', row: 'reads' });
    if (model.filling) return;
    model.filling = true;
    const version = model.db.version;
    sim.after(p.fillTime, () => {
      model.filling = false;
      setCache({ version, expiresAt: now() + p.ttl }, 'fill');
      sim.after(p.ttl, () => { if (model.cache && model.cache.expiresAt <= now()) { setCache(null, 'expiry'); model.events.push({ t: now(), kind: 'expiry', row: 'redis' }); } });
    });
  });

  const write = () => {
    model.db.version++;
    model.dbHistory.push({ t: now(), version: model.db.version });
    model.events.push({ t: now(), kind: 'write', row: 'db' });
    track();
    // Whether a delete is lost is decided when it is due to land, so switching
    // "Deletes are lost" on or off also applies to a delete already on its way.
    sim.after(p.deleteDelay, () => {
      if (p.loseDeletes) {
        model.stats.lost++;
        model.events.push({ t: now(), kind: 'error', row: 'redis' });
      } else {
        setCache(null, 'delete');
        model.events.push({ t: now(), kind: 'write', row: 'redis' });
      }
    });
    // Writes come roughly every `writeEvery` ms, never closer than 3 s, so each stays readable.
    sim.after(3000 + sim.random() * 2 * (p.writeEvery - 3000), write);
  };
  sim.after(2500, write);

  // Old history is trimmed so a long run stays light.
  sim.every(5000, () => {
    const cut = now() - 60000;
    const trim = list => { while (list.length > 1 && list[1].t < cut) list.shift(); };
    trim(model.dbHistory); trim(model.cacheHistory);
    model.events = model.events.filter(e => e.t >= cut);
  });
  return model;
}

/** The price label for a version. */
export const priceOf = version => PRICES[version % PRICES.length];
