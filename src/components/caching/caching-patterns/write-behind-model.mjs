// Figure 5: write-behind for page-view counters. Each view increments a counter
// in Redis (INCR) and is acknowledged at once. A flusher runs every `interval`
// and, for each counter with views waiting, takes the count with GETDEL and adds
// it to the database in one write. A restart of Redis (persistence off) loses
// every view not yet flushed. Travel times are animation timings; nothing here
// is a measured latency. Pure.
import { Simulation, Movers, poissonArrivals, zipf } from '../shared/sim.mjs';

export const COUNTERS = 4;
export const HOPS = { client: 420, redis: 380, database: 700 };

/** params: interval (s between flushes), rate (views a second), animate (schedule dots). */
export function writeBehind(params = {}, seed = 1) {
  const p = { interval: 5, rate: 8, animate: true, ...params };
  const sim = new Simulation({ seed });
  const movers = new Movers(sim);
  const popularity = zipf(COUNTERS, 0.8);
  const redis = new Array(COUNTERS).fill(0);
  const database = new Array(COUNTERS).fill(0);
  const stats = { views: 0, acknowledged: 0, flushed: 0, lost: 0, databaseWrites: 0, restarts: 0, lastLoss: 0 };
  const model = { sim, params: p, movers, redis, database, stats, nextFlush: p.interval * 1000 };

  model.pending = () => redis.reduce((a, b) => a + b, 0);
  model.restart = () => {
    const lost = model.pending();
    stats.lost += lost; stats.lastLoss = lost; stats.restarts++;
    redis.fill(0);
    model.restartedAt = sim.now;
    return lost;
  };

  const incr = key => { redis[key]++; stats.acknowledged++; };
  poissonArrivals(sim, () => model.params.rate, () => {
    const key = popularity.sample(sim.random);
    stats.views++;
    if (!p.animate) { incr(key); return; }
    movers.add({ edge: 'client-app', duration: HOPS.client, kind: 'client', onArrive: () =>
      movers.add({ edge: 'app-redis', duration: HOPS.redis, kind: 'write', onArrive: () => incr(key) }) });
  });

  const flush = () => {
    for (let key = 0; key < COUNTERS; key++) {
      const count = redis[key]; // GETDEL: read and remove in one step
      if (!count) continue;
      redis[key] = 0;
      stats.databaseWrites++;
      const land = () => { database[key] += count; stats.flushed += count; };
      if (p.animate) movers.add({ edge: 'redis-database', duration: HOPS.database, kind: 'write', onArrive: land });
      else land();
    }
  };
  let flushId;
  model.schedule = (at = sim.now + model.params.interval * 1000) => {
    if (flushId) sim.cancel(flushId);
    model.nextFlush = at;
    flushId = sim.at(at, () => { flush(); model.schedule(); });
  };
  model.schedule();
  return model;
}

/** Changes the interval in place. A shorter interval brings the next flush forward. */
export function updateWriteBehind(model, params) {
  Object.assign(model.params, params);
  const sooner = model.sim.now + model.params.interval * 1000;
  if (sooner < model.nextFlush) model.schedule(sooner);
  return true;
}
