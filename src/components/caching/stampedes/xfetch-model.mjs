// Probabilistic early expiration (XFetch; Vattani, Chierichetti and Lowenstein,
// PVLDB 8(8), 2015) for one hot key. Pure: runs under node.
//
// Time is measured in rebuild times: one rebuild takes 1 unit, so `rate` is the
// number of requests that arrive during one rebuild (r·δ in the article).
// Every request draws a gap g = −β·ln(u) and rebuilds if g reaches past the
// expiry. Nothing coordinates the rebuilds: every request that decides to
// rebuild does so, until the first rebuild finishes one unit after it started.
// The stampede size follows the paper's Definition 3: the number of requests
// that start a rebuild in [Z, Z + 1), where Z is the first start.

import { Simulation, poissonArrivals } from '../shared/sim.mjs';

export const EULER_GAMMA = 0.5772156649015329;

/** Expected rebuilds per expiry for a high request rate: e^(1/β). Derived in the article. */
export const expectedSize = beta => Math.exp(1 / beta);

/** The paper's Theorem 7 bound evaluated at λ = 1/β: (e^λ − 1)(1/λ + 1/e). For β = 1 this is e − 1/e. */
export const paperBound = beta => { const l = 1 / beta; return (Math.exp(l) - 1) * (1 / l + 1 / Math.E); };

/** Expected lead of the first rebuild before expiry, in rebuild times: β(ln(rate·β) + γ). */
export const expectedLead = (rate, beta) => beta * (Math.log(rate * beta) + EULER_GAMMA);

/** Probability that a request `y` rebuild times before expiry decides to rebuild: e^(−y/β), or 1 after expiry. */
export const rebuildChance = (y, beta) => (y <= 0 ? 1 : Math.exp(-y / beta));

/**
 * One expiry cycle, request by request (for drawing, and for checking the fast
 * version). arrivals: 'poisson' or 'even' (equally spaced, random phase).
 * Returns { requests: [{ y, gap, rebuild }], first, size, lead, missed }:
 * y is time remaining before expiry (negative after it); `missed` counts
 * requests that arrived after expiry before the first rebuild finished.
 * `window` limits how far before expiry requests are drawn (default: far enough
 * that an earlier rebuild has probability below 1e-9).
 */
export function cycle(random, { rate, beta = 1, arrivals = 'poisson', window, keep = true } = {}) {
  const span = window ?? beta * Math.max(0, Math.log((rate * beta) / 1e-9));
  const requests = [];
  let y = span;
  const step = () => (arrivals === 'even' ? 1 / rate : -Math.log(1 - random()) / rate);
  y -= arrivals === 'even' ? random() / rate : step();
  let first = null, size = 0, missed = 0;
  for (;;) {
    if (first !== null && y <= first - 1) break;
    const gap = -beta * Math.log(1 - random());
    const rebuild = y <= 0 || gap >= y;
    if (rebuild) { if (first === null) first = y; size++; if (y <= 0) missed++; }
    if (keep) requests.push({ y, gap, rebuild });
    y -= step();
  }
  return { requests, first, size, lead: first, missed };
}

/**
 * The same cycle for Poisson arrivals, sampled exactly from the rebuild hazard
 * instead of request by request, so a high rate costs nothing. Rebuild starts
 * form a Poisson process with intensity rate·e^(−y/β) before expiry and `rate`
 * after it. H(y) = rate·β·e^(−y/β) is the intensity accumulated from long before
 * the expiry up to the moment y: the number of starts expected to have happened by
 * then. Its value at the first start is Exp(1).
 */
export function fastCycle(random, { rate, beta = 1 }) {
  const total = rate * beta;               // H(0): all the early-rebuild intensity before expiry
  const e = -Math.log(1 - random());
  const first = e < total ? beta * Math.log(total / e) : -(e - total) / rate;
  // Intensity integrated over (first − 1, first]: the window in which duplicates start.
  const H = y => (y >= 0 ? rate * beta * Math.exp(-y / beta) : total + rate * -y);
  const extra = H(first - 1) - H(first);
  return { first, size: 1 + poisson(random, extra), lead: first };
}

function poisson(random, mean) {
  if (mean > 50) return Math.max(0, Math.round(mean + Math.sqrt(mean) * gaussian(random)));
  const limit = Math.exp(-mean);
  let k = 0, p = random();
  while (p > limit) { k++; p *= random(); }
  return k;
}
function gaussian(random) {
  const u = 1 - random(), v = random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/** Summary over `cycles` cycles: mean size, mean lead, share of cycles whose first rebuild started after expiry. */
export function summarise(random, { rate, beta = 1, cycles = 2000, method = 'fast', arrivals = 'poisson' }) {
  let size = 0, lead = 0, late = 0, max = 0;
  for (let i = 0; i < cycles; i++) {
    const c = method === 'fast' ? fastCycle(random, { rate, beta }) : cycle(random, { rate, beta, arrivals, keep: false });
    size += c.size; lead += c.lead; if (c.lead < 1) late++; if (c.size > max) max = c.size;
  }
  return { size: size / cycles, lead: lead / cycles, lateShare: late / cycles, max };
}

/**
 * A live XFetch run for Figure 8, in simulated milliseconds: one key, requests
 * at `rate` a second, a rebuild of `rebuild` ms, a TTL of `ttl` ms counted from
 * the moment a rebuild stores its result. Keeps the current and the previous
 * expiry cycle for drawing, and a running summary.
 */
export const LIVE = { rate: 8, rebuild: 1000, ttl: 8000, beta: 1 };

export function xfetchLive(params = {}, seed = 1) {
  const p = { ...LIVE, ...params };
  const sim = new Simulation({ seed });
  const fresh = () => ({ expiresAt: 0, requests: [], rebuilds: [], first: null, misses: 0 });
  let current = fresh();
  current.expiresAt = p.ttl * 0.75;          // start part-way through a copy's life
  const model = { sim, params: p, current, previous: null, completedAt: -Infinity, cycles: 0, rebuilds: 0, leads: 0, missed: 0 };
  const store = () => {
    // The first rebuild of a cycle stores the new copy and starts the next cycle. (Its duplicates
    // would store again a little later and restart the TTL; the model leaves that out.)
    model.completedAt = sim.now;
    model.cycles++; model.rebuilds += current.rebuilds.length; model.leads += (current.expiresAt - current.first) / p.rebuild;
    if (current.misses) model.missed++;
    model.previous = current;
    current = fresh();
    model.current = current;
    current.expiresAt = sim.now + p.ttl;
  };
  poissonArrivals(sim, () => p.rate, () => {
    const y = current.expiresAt - sim.now;
    const gap = -p.rebuild * model.params.beta * Math.log(1 - sim.random());
    const rebuild = y <= 0 || gap >= y;
    const req = { y, gap, rebuild };
    current.requests.push(req);
    if (!rebuild) return;
    if (y <= 0) current.misses++;
    const cycleOf = current;
    cycleOf.rebuilds.push({ y });
    if (cycleOf.first === null) {
      cycleOf.first = sim.now;
      sim.after(p.rebuild, () => { if (current === cycleOf) store(); });
    }
  });
  return model;
}
