// Figures 1 and 11: what losing Redis does to the database. An expected-value
// model, not a simulation of individual requests. A catalogue of `products`
// keys has Zipf popularity; requests arrive at `rate` a second; cache-aside
// stores each missed key for `ttl` seconds. Keys are grouped into buckets of
// similar popularity, and for each bucket the model tracks the share of its
// keys that Redis does not hold. A miss on an absent key fills it; a fill
// expires `ttl` seconds later. Time advances in one-second steps.
//
// Losing Redis can be followed by one of three recoveries, each after an
// outage of `outage` seconds (Figure 11):
//   'empty'    Redis comes back with nothing in it (at once, for a process restart).
//   'snapshot' Redis is unavailable while it loads a snapshot, then holds what
//              it held when it stopped (keys that expired meanwhile are gone).
//   'replica'  Redis is unavailable until a replica is promoted, which then
//              holds what the primary held.
// While Redis is unavailable every request goes to the database (the
// application fails open). Nothing models the database slowing down under
// load. Pure: no DOM.
import { Simulation } from '../shared/sim.mjs';

export const DEFAULTS = { products: 50000, skew: 0.9, rate: 2000, ttl: 600, buckets: 80 };

/** Groups ranks 1..n into `count` log-spaced buckets: [{ n, lambda }] with lambda per key per second. */
export function buckets({ products, skew, rate, buckets: count }) {
  let norm = 0;
  for (let k = 1; k <= products; k++) norm += Math.pow(k, -skew);
  const edges = [1];
  for (let i = 1; i <= count; i++) edges.push(Math.max(edges[i - 1] + 1, Math.round(Math.pow(products, i / count))));
  edges[edges.length - 1] = products + 1;
  const out = [];
  for (let i = 0; i < edges.length - 1; i++) {
    const a = edges[i], b = Math.min(edges[i + 1], products + 1);
    if (b <= a) continue;
    let share = 0;
    for (let k = a; k < b; k++) share += Math.pow(k, -skew) / norm;
    out.push({ n: b - a, lambda: (share * rate) / (b - a) });
  }
  return out;
}

/** Steady-state share of a bucket's keys that are absent, for Poisson requests and a fixed TTL. */
export const steadyAbsent = (lambda, ttl) => 1 / (1 + lambda * ttl);

/** Steady database reads a second and hit ratio for the parameters. */
export function steady(params = {}) {
  const p = { ...DEFAULTS, ...params };
  const bs = buckets(p);
  const reads = bs.reduce((sum, b) => sum + b.n * b.lambda * steadyAbsent(b.lambda, p.ttl), 0);
  return { reads, hitRatio: 1 - reads / p.rate };
}

export function create(params = {}, seed = 1) {
  const p = { ...DEFAULTS, ...params };
  const sim = new Simulation({ seed });
  const bs = buckets(p).map(b => ({ ...b, absent: steadyAbsent(b.lambda, p.ttl), fills: new Float64Array(p.ttl) }));
  // Start in steady state: fills spread evenly over the last ttl seconds.
  for (const b of bs) b.fills.fill(b.absent * (1 - Math.exp(-b.lambda)));
  const normal = steady(p).reads;
  const model = { sim, params: p, buckets: bs, normal, reads: normal, hitRatio: 1 - normal / p.rate,
    down: false, downUntil: 0, recovery: null, events: [], samples: [], stepIndex: 0, outageReads: 0 };

  const step = () => {
    const slot = model.stepIndex % p.ttl; // fills[slot] holds the fills made ttl seconds ago
    let reads = 0;
    if (model.down) {
      reads = p.rate; // Redis unavailable: every request falls through to the database
      for (const b of bs) { b.expiredWhileDown += b.fills[slot]; b.fills[slot] = 0; }
    } else {
      for (const b of bs) {
        b.absent = Math.min(1, b.absent + b.fills[slot]);  // copies stored ttl seconds ago expire now
        const fill = b.absent * (1 - Math.exp(-b.lambda)); // absent keys requested at least once this second
        reads += b.n * fill;
        b.absent -= fill;
        b.fills[slot] = fill;
      }
    }
    model.stepIndex++;
    model.reads = reads;
    model.hitRatio = Math.max(0, 1 - reads / p.rate);
    model.samples.push([sim.now / 1000, reads]);
    if (model.down && sim.now + 1 >= model.downUntil) model.finishOutage();
  };
  sim.every(1000, step);

  /**
   * Redis fails. 'empty': it restarts at once with nothing. 'snapshot' or 'replica':
   * it is unavailable for `outage` seconds, then a copy holding what it held at the
   * failure takes over, less anything whose TTL ran out in between.
   */
  model.fail = (recovery = 'empty', outage = 0) => {
    if (model.recovery) return false;
    model.recovery = recovery;
    model.failedAt = sim.now;
    model.events.push({ t: sim.now / 1000, type: 'fail', recovery });
    if (outage <= 0) {
      if (recovery === 'empty') model.empty();
      model.events.push({ t: sim.now / 1000, type: 'back', recovery });
      return true;
    }
    model.down = true;
    model.downUntil = sim.now + outage * 1000;
    for (const b of bs) b.expiredWhileDown = 0;
    return true;
  };
  model.empty = () => { for (const b of bs) { b.absent = 1; b.fills.fill(0); } };
  model.finishOutage = () => {
    model.down = false;
    if (model.recovery === 'empty') model.empty();
    else for (const b of bs) b.absent = Math.min(1, b.absent + b.expiredWhileDown);
    model.events.push({ t: model.downUntil / 1000, type: 'back', recovery: model.recovery });
  };
  return model;
}

/** Database reads a second for each second from `before` seconds before a failure to `after` seconds after it. */
export function trace(recovery, outage, { before = 60, after = 900, ...params } = {}) {
  const m = create(params, 1);
  m.sim.advance(before * 1000);
  m.fail(recovery, outage);
  m.sim.advance(after * 1000);
  return { normal: m.normal, points: m.samples.map(([t, r]) => [t - before, r]) };
}

/**
 * Summary of a trace against a database capacity: seconds above it, peak reads a
 * second, and extra reads above normal. Seconds above capacity do not depend on the
 * window for capacities above the second wave (about 260 reads a second at a 10-minute
 * TTL); extra reads do, which is why Figure 11 does not show them.
 */
export function cost({ normal, points }, capacity) {
  const after = points.filter(([t]) => t > 0);
  return {
    over: after.filter(([, r]) => r > capacity).length,
    extra: after.reduce((a, [, r]) => a + Math.max(0, r - normal), 0),
    peak: Math.max(...after.map(([, r]) => r)),
  };
}
