// Figure 3 of "Designing a cache": the shop's design under failure. Pure: no DOM.
//
// The shop is scaled down to 1/100 of its catalogue so it can run in a browser,
// as in "Operating a cache": at peak, 1,000 product reads a second over 20,000
// products with Zipf-like popularity (exponent 0.9), and 20 checkouts a second;
// `traffic` multiplies both. Redis is an LRU cache of 14,000 products; warmed by
// earlier traffic it answers about 92% of reads. TTLs are the design's 24 hours,
// so nothing expires within the few minutes the figure runs. A cache refills in
// proportion to the keys it must fill, so this one refills far faster than the
// shop's 2,000,000-product cache would: recovery-model.mjs gives the shop's times.
//
// The database is one queue that does 300 units of work a second in arrival
// order. A product query is one unit; a checkout is three (read the price, read
// the stock, write the order). It finishes every query it accepts, even after the
// request has given up. A request waits at most one second; a product answer that
// arrives later is a failure and is not cached.
//
// Decisions:
//   topology  'replica': losing the primary makes Redis unavailable for 6 s, then a
//             promoted replica serves the same data.
//             'single':  Redis is unavailable for 10 s, then restarts empty.
//   limit     'none':     every query joins the queue.
//             'shared':   a query is refused at once if the database already holds
//                         60 units of work (Little's law: 300 a second × 0.2 s).
//             'checkout': product queries are refused above 45 units; checkout's
//                         may use all 60, so checkouts are served first.
//   rollout   what a read does after a deploy changes the product key version:
//             'all': it reads only the new key, so every product misses once;
//             'convert': a miss on the new key reads the old key, and if it is
//             there converts it, stores it under the new name and deletes the old
//             one, so only products missing under both names go to the database.
// Incidents (called by the figure): failPrimary(), deploy().
//
// Everything is illustrative. Not modelled: retries, Redis's own capacity,
// network time, expiry, writes to products.
import { Simulation, Movers, poissonArrivals, zipf, LruCache, seededRandom } from '../shared/sim.mjs';

export const PLAY = {
  products: 20000, skew: 0.9, reads: 1000, capacity: 14000,
  checkouts: 20, checkoutCost: 3, dbRate: 300, timeout: 1000,
  maxWork: 60, browseWork: 45,
  failoverDown: 6000, restartDown: 10000,
};

/** Animation timings for sampled dots, in simulated ms; not latencies. */
export const HOPS = { client: 1500, redis: 1100, database: 1500 };

const blank = () => ({ reads: 0, hits: 0, converted: 0, readFails: 0, checkouts: 0, checkoutFails: 0, demand: 0 });

export function create(params = {}, seed = 1) {
  const p = { ...PLAY, topology: 'replica', limit: 'checkout', rollout: 'all', traffic: 1, sample: 0, ...params };
  const sim = new Simulation({ seed });
  const popularity = zipf(p.products, p.skew);
  let cache = new LruCache(p.capacity);
  // Warm: replay earlier reads through LRU, so the cache starts in the state it
  // would reach by itself rather than holding the ideal set of products.
  const warmRandom = seededRandom(seed + 7919);
  for (let i = 0; i < 200000; i++) {
    const key = popularity.sample(warmRandom);
    if (!cache.get(key, 0)) cache.set(key, 1, { now: 0 });
  }

  const service = 1000 / p.dbRate;            // ms per unit of work
  let busyUntil = 0;
  const db = {
    work: () => Math.max(0, (busyUntil - sim.now) / service),   // units held, waiting or running
    wait: () => Math.max(0, busyUntil - sim.now),
    enqueue(units) { busyUntil = Math.max(busyUntil, sim.now) + units * service; return busyUntil; },
  };
  const admit = (units, checkout) => {
    if (p.limit === 'none') return true;
    const cap = p.limit === 'checkout' && !checkout ? p.browseWork : p.maxWork;
    return db.work() + units <= cap + 1e-9;
  };

  const movers = new Movers(sim);
  const samples = [];
  const totals = { reads: 0, readFails: 0, checkouts: 0, checkoutFails: 0 };
  let current = blank(), counter = 0;
  const model = {
    sim, params: p, db, movers, samples, totals, events: [],
    redis: 'up',        // 'up' or 'down'
    redisNote: 'warm',  // what the scene says under Redis
    version: 0,         // the product key version in use
    deployAt: null,
    get cache() { return cache; },
  };

  const draw = outcome => {
    movers.add({ edge: 'shoppers-app', duration: HOPS.client, kind: 'client', onArrive: () => {
      if (outcome === 'hit') {
        movers.add({ edge: 'app-redis', duration: HOPS.redis, kind: 'client', onArrive: () =>
          movers.add({ edge: 'app-redis', reverse: true, duration: HOPS.redis, kind: 'hit', onArrive: () =>
            movers.add({ edge: 'shoppers-app', reverse: true, duration: HOPS.client, kind: 'hit' }) }) });
        return;
      }
      if (outcome === 'refused') { movers.add({ edge: 'shoppers-app', reverse: true, duration: HOPS.client, kind: 'error' }); return; }
      const back = outcome === 'late' ? 'error' : 'miss';
      movers.add({ edge: 'app-database', duration: HOPS.database, kind: 'miss', onArrive: () =>
        movers.add({ edge: 'app-database', reverse: true, duration: HOPS.database, kind: back, onArrive: () =>
          movers.add({ edge: 'shoppers-app', reverse: true, duration: HOPS.client, kind: back }) }) });
    } });
  };

  // Product reads.
  poissonArrivals(sim, () => p.reads * p.traffic, () => {
    const id = popularity.sample(sim.random);
    const key = model.version * p.products + id;
    current.reads++; totals.reads++;
    const show = p.sample > 0 && ++counter % p.sample === 0;
    if (model.redis === 'up' && cache.get(key, sim.now)) { current.hits++; if (show) draw('hit'); return; }
    if (model.redis === 'up' && p.rollout === 'convert' && model.version > 0) {
      const old = (model.version - 1) * p.products + id;
      if (cache.get(old, sim.now)) {
        cache.delete(old); cache.set(key, 1, { now: sim.now });
        current.hits++; current.converted++; if (show) draw('hit'); return;
      }
    }
    current.demand += 1;
    if (!admit(1, false)) { current.readFails++; totals.readFails++; if (show) draw('refused'); return; }
    const done = db.enqueue(1);
    const inTime = done - sim.now <= p.timeout;
    if (!inTime) { current.readFails++; totals.readFails++; }
    if (show) draw(inTime ? 'answered' : 'late');
    if (inTime) sim.at(done, () => { if (model.redis === 'up') cache.set(key, 1, { now: sim.now }); });
  });

  // Checkouts: always read the database.
  poissonArrivals(sim, () => p.checkouts * p.traffic, () => {
    current.checkouts++; totals.checkouts++;
    current.demand += p.checkoutCost;
    const ok = admit(p.checkoutCost, true) && db.enqueue(p.checkoutCost) - sim.now <= p.timeout;
    if (!ok) { current.checkoutFails++; totals.checkoutFails++; }
  });

  model.failPrimary = () => {
    if (model.redis === 'down') return false;
    const down = p.topology === 'replica' ? p.failoverDown : p.restartDown;
    model.redis = 'down';
    model.redisNote = p.topology === 'replica' ? 'primary lost' : 'down, restarting';
    model.events.push({ t: sim.now, kind: 'fail', until: sim.now + down });
    sim.after(down, () => {
      model.redis = 'up';
      if (p.topology === 'single') { cache = new LruCache(p.capacity); model.redisNote = 'back, empty'; }
      else model.redisNote = 'replica promoted';
    });
    return true;
  };
  model.deploy = () => {
    model.version++;
    model.deployAt = sim.now;
    model.redisNote = `key version v${model.version + 3}`;
    model.events.push({ t: sim.now, kind: 'deploy' });
    return true;
  };

  sim.every(1000, () => {
    const s = current;
    samples.push({
      t: sim.now / 1000,
      demand: s.demand,
      hit: s.reads ? s.hits / s.reads : 0,
      readFail: s.reads ? s.readFails / s.reads : 0,
      checkoutFail: s.checkouts ? s.checkoutFails / s.checkouts : 0,
      wait: db.wait(),
    });
    current = blank();
  });
  return model;
}

/** Mean of a field over the samples whose time t lies in (from, to]. */
export function mean(samples, field, from, to) {
  const list = samples.filter(s => s.t > from && s.t <= to);
  return list.length ? list.reduce((a, s) => a + s[field], 0) / list.length : NaN;
}

/** The first sample after `from` from which `field` stays at or below `level` for `hold` seconds. */
export function settledAt(samples, field, level, from, hold = 10) {
  for (let i = 0; i < samples.length; i++) {
    if (samples[i].t <= from) continue;
    const run = samples.slice(i, i + hold);
    if (run.length === hold && run.every(s => s[field] <= level)) return samples[i].t;
  }
  return null;
}
