// Figure 6: one TTL for the whole product, or one for the stock field. A product
// page is read at random; the stock it shows may be at most 5 s old, the rest
// may be an hour old. With one TTL on the key, the whole product is rebuilt
// whenever the key expires. With a TTL on the stock field (Redis 7.4+), only
// the stock is re-read. The query costs are assumptions, not measurements. Pure.
import { Simulation, poissonArrivals, Window } from '../shared/sim.mjs';

export const FIELDS = [
  { id: 'name', label: 'name', bytes: 18 },
  { id: 'description', label: 'description', bytes: 1200 },
  { id: 'images', label: 'images', bytes: 320 },
  { id: 'price', label: 'price', bytes: 4 },
  { id: 'stock', label: 'stock', bytes: 2 },
];
/** Assumed database time to build the whole product (joins for description, images, reviews) and to read stock alone. */
export const COST = { product: 40, stock: 1 };

export function fieldTtl(params = {}, seed = 1) {
  const p = { mode: 'key', reads: 2, stockTtl: 5000, longTtl: 3600000, ...params };
  const sim = new Simulation({ seed });
  // Each field's absolute expiry time; null when the field is absent.
  const expires = Object.fromEntries(FIELDS.map(f => [f.id, null]));
  const totals = { views: 0, productBuilds: 0, stockReads: 0, dbMs: 0, bytes: 0 };
  const windows = { dbMs: new Window(60000), bytes: new Window(60000) };
  const model = { sim, params: p, expires, totals, windows, last: null };
  const present = id => expires[id] !== null && expires[id] > sim.now;

  const buildAll = () => {
    totals.productBuilds++; totals.dbMs += COST.product; windows.dbMs.add(sim.now, COST.product);
    const bytes = FIELDS.reduce((a, f) => a + f.bytes, 0);
    totals.bytes += bytes; windows.bytes.add(sim.now, bytes);
    for (const f of FIELDS) {
      const ttl = p.mode === 'key' ? p.stockTtl : f.id === 'stock' ? p.stockTtl : p.longTtl;
      expires[f.id] = sim.now + ttl;
    }
  };
  const readStock = () => {
    totals.stockReads++; totals.dbMs += COST.stock; windows.dbMs.add(sim.now, COST.stock);
    totals.bytes += 2; windows.bytes.add(sim.now, 2);
    expires.stock = sim.now + p.stockTtl;
  };

  model.view = () => {
    totals.views++;
    // Expired fields disappear; when the last field goes, the key goes with it.
    for (const f of FIELDS) if (expires[f.id] !== null && expires[f.id] <= sim.now) expires[f.id] = null;
    const missing = FIELDS.filter(f => !present(f.id)).map(f => f.id);
    let outcome;
    if (missing.length === 0) outcome = 'hit';
    else if (missing.length === 1 && missing[0] === 'stock') { readStock(); outcome = 'stock'; }
    else { buildAll(); outcome = 'miss'; }
    model.last = { outcome, at: sim.now };
    return outcome;
  };

  buildAll();
  // The first build is the cache warming up, not part of the comparison.
  totals.productBuilds = 0; totals.dbMs = 0; totals.bytes = 0; windows.dbMs.times = []; windows.bytes.times = [];
  poissonArrivals(sim, () => p.reads, () => model.view());
  return model;
}

/** Remaining life of each field as a share of its TTL, for the drawing. */
export function remaining(model) {
  const { sim, expires, params: p } = model;
  return FIELDS.map(f => {
    const ttl = p.mode === 'key' || f.id === 'stock' ? p.stockTtl : p.longTtl;
    const left = expires[f.id] === null ? 0 : Math.max(0, expires[f.id] - sim.now);
    return { ...f, left, share: left / ttl, ttl };
  });
}
