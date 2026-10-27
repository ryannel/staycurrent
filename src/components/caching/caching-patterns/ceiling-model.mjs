// Figure 2: each write costs the next read a miss. One key receives reads and
// writes as two independent random (Poisson) streams. The same stream is applied
// to two caches: one deletes the key on every write, the other updates it.
// No expiry and no eviction, so writes are the only cause of misses. Pure.
import { Simulation, poissonArrivals } from '../shared/sim.mjs';

/** Expected hit ratio with delete-on-write when a key gets k reads per write. */
export const deleteHitRatio = k => k / (k + 1);
/** Expected share of update-on-write cache writes overwritten before any read. */
export const unreadShare = k => 1 / (k + 1);

/** params: perWrite (reads per write, k), reads (a second). */
export function ceiling(params = {}, seed = 1) {
  const p = { perWrite: 4, reads: 2, ...params };
  const sim = new Simulation({ seed });
  const rows = {
    delete: { cached: true, events: [], reads: 0, hits: 0 },
    update: { cached: true, events: [], reads: 0, hits: 0, cacheWrites: 0, unread: 0, readSinceWrite: true },
  };
  const model = { sim, params: p, rows };
  const note = (row, kind) => {
    row.events.push({ t: sim.now, kind });
    while (row.events.length && row.events[0].t < sim.now - 60000) row.events.shift();
  };
  model.read = () => {
    for (const row of Object.values(rows)) {
      row.reads++;
      if (row.cached) { row.hits++; note(row, 'hit'); } else { note(row, 'miss'); row.cached = true; }
    }
    rows.update.readSinceWrite = true;
  };
  model.write = () => {
    rows.delete.cached = false;
    note(rows.delete, 'write');
    const u = rows.update;
    if (u.cacheWrites && !u.readSinceWrite) u.unread++;
    u.cacheWrites++;
    u.readSinceWrite = false;
    u.cached = true;
    note(u, 'write');
  };
  poissonArrivals(sim, () => model.params.reads, () => model.read());
  poissonArrivals(sim, () => model.params.reads / model.params.perWrite, () => model.write());
  return model;
}
