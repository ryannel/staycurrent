// One change, many cached pages: a tag set against a generation number. Pure;
// no DOM. Used by figure 8.
//
// A category has twelve cached listing pages (three sort orders × four pages).
// Product 42 appears on one page of each sort order (KETTLE_PAGES), so a change
// to it makes three of the twelve pages wrong. Pages are read at random, about
// six reads a second in all, more often for the first page of each sort order.
// A miss fills the page at once with a 20 s TTL. Product changes arrive about
// every 7 seconds.
//
// Tag set: a fill of a page that shows product 42 first adds the page's key to
// tag:product:42, then stores the page (SADD before SET). A change runs one
// script that reads the set's members and unlinks them and the set, so no fill
// can slip in between. Only the pages that show product 42 are deleted.
// Generation number: every read first fetches gen:category:7 and builds the key
// with it (category:7:g3:cheap:p1). A change is one INCR, which makes every
// page of the category unreachable, including those that do not show product
// 42. Old pages stay in memory until their TTL. Time is compressed.
import { Simulation, poissonArrivals } from '../shared/sim.mjs';

export const SORTS = ['top', 'cheap', 'new'];
export const PAGES = 4;
export const KETTLE_PAGES = ['top:p1', 'cheap:p1', 'new:p3'];
export const FANOUT_DEFAULTS = { mode: 'tags', readRate: 6, changeEvery: 7000, ttl: 20000 };

export const pageIds = () => SORTS.flatMap(sort => Array.from({ length: PAGES }, (_, i) => `${sort}:p${i + 1}`));

export function createFanout(params = {}, seed = 9) {
  const p = { ...FANOUT_DEFAULTS, ...params };
  const sim = new Simulation({ seed });
  const pages = pageIds();
  // Popularity: first pages are read four times as often as the last.
  const weights = pages.map(id => 1 / Number(id.slice(-1)));
  const total = weights.reduce((a, b) => a + b, 0);
  const pick = () => { let x = sim.random() * total; for (let i = 0; i < pages.length; i++) { x -= weights[i]; if (x <= 0) return pages[i]; } return pages.at(-1); };

  const model = {
    sim, params: p, mode: p.mode,
    gen: 1,
    keys: new Map(),        // redis key -> { page, gen, expiresAt, filledAt }
    tag: new Set(),         // names in tag:product:42
    stats: { reads: 0, hits: 0, misses: 0, lookups: 0, changes: 0, commands: 0, keysDeleted: 0, pagesDiscarded: 0 },
    flash: [],              // { t, key } recently deleted keys, for drawing
  };
  const now = () => sim.now;
  const keyFor = (page, gen) => (model.mode === 'gens' ? `category:7:g${gen}:${page}` : `category:7:${page}`);
  const expire = () => { for (const [k, v] of model.keys) if (v.expiresAt <= now()) model.keys.delete(k); };

  poissonArrivals(sim, () => p.readRate, () => {
    expire();
    model.stats.reads++;
    const page = pick();
    if (model.mode === 'gens') model.stats.lookups += 2; else model.stats.lookups += 1;
    const key = keyFor(page, model.gen);
    if (model.keys.has(key)) { model.stats.hits++; return; }
    model.stats.misses++;
    model.keys.set(key, { page, gen: model.gen, expiresAt: now() + p.ttl, filledAt: now() });
    if (model.mode === 'tags' && KETTLE_PAGES.includes(page)) model.tag.add(key);
  });

  const change = () => {
    expire();
    model.stats.changes++;
    if (model.mode === 'gens') {
      // Every reachable page of the category becomes unreachable.
      for (const v of model.keys.values()) if (v.gen === model.gen) model.stats.pagesDiscarded++;
      model.gen++;
      model.stats.commands += 1;
    } else {
      const names = [...model.tag];
      for (const name of names) if (model.keys.delete(name)) { model.stats.keysDeleted++; model.stats.pagesDiscarded++; model.flash.push({ t: now(), key: name }); }
      model.tag.clear();
      model.stats.commands += 1;   // one script: SMEMBERS, then UNLINK of the members and the set
    }
    sim.after(p.changeEvery * (0.6 + 0.8 * sim.random()), change);
  };
  sim.after(p.changeEvery, change);
  sim.every(500, () => { expire(); model.flash = model.flash.filter(f => now() - f.t < 1200); });

  model.view = () => {
    expire();
    const entries = [...model.keys.entries()].map(([key, v]) => ({ key, ...v, reachable: model.mode !== 'gens' || v.gen === model.gen }));
    const reachable = entries.filter(e => e.reachable).length;
    const orphaned = entries.length - reachable;
    const deadNames = model.mode === 'tags' ? [...model.tag].filter(n => !model.keys.has(n)).length : 0;
    return { entries, reachable, orphaned, tagNames: model.tag.size, deadNames };
  };
  return model;
}
