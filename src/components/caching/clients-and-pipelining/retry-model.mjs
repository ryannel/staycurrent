// An application sending requests to a Redis that slows down for a few seconds,
// under three retry policies. Pure; time in milliseconds.
//
// Illustrative units, not a benchmark: Redis serves requests one at a time from
// a queue at CAPACITY a second (SLOW_CAPACITY during the slowdown); the
// application sends RATE new requests a second, waits TIMEOUT for each reply,
// and in normal times TRANSIENT of attempts fail at once (a reset connection,
// say), which is what retries are for. A request whose client has timed out
// stays in Redis's queue and is still executed: Redis cannot know nobody is
// waiting. Left out: the network, several connections, users giving up.
import { Simulation, poissonArrivals, Window } from '../shared/sim.mjs';

export const RATE = 60;
export const CAPACITY = 100;
export const SLOW_CAPACITY = 20;
export const SLOW_FROM = 10000;
export const SLOW_TO = 15000;
export const TIMEOUT = 1000;
export const TRANSIENT = 0.02;
export const MAX_RETRIES = 3;
export const BUDGET = { ratio: 0.1, cap: 10 };
export const POLICIES = ['none', 'retry', 'budget'];

export const capacityAt = t => (t >= SLOW_FROM && t < SLOW_TO ? SLOW_CAPACITY : CAPACITY);

/** create({ policy }, seed) -> model with sim, counters and trailing windows. */
export function create({ policy = 'retry' } = {}, seed = 1) {
  const sim = new Simulation({ seed });
  const span = 1000;
  const w = { sent: new Window(span), used: new Window(span), wasted: new Window(span), failed: new Window(span), arrived: new Window(span) };
  const recent = { sent: new Window(5000), arrived: new Window(5000), used: new Window(5000), wasted: new Window(5000), failed: new Window(5000) };
  const totals = { arrived: 0, sent: 0, used: 0, wasted: 0, failed: 0, retries: 0, refused: 0 };
  const queue = [];
  let busy = false;
  let tokens = BUDGET.cap;
  const model = { sim, policy, w, recent, totals, queue, samples: [] };

  const count = (name, n = 1) => { totals[name] += n; w[name]?.add(sim.now, n); recent[name]?.add(sim.now, n); };

  const serveNext = () => {
    if (busy || !queue.length) return;
    busy = true;
    const attempt = queue.shift();
    sim.after(1000 / capacityAt(sim.now), () => {
      busy = false;
      attempt.done = true;
      if (attempt.abandoned) count('wasted');
      else { count('used'); sim.cancel(attempt.timer); }
      serveNext();
    });
  };

  const send = request => {
    request.attempts++;
    count('sent');
    const attempt = { request, done: false, abandoned: false, timer: 0 };
    if (sim.random() < TRANSIENT) {
      sim.after(5, () => fail(request));
      return;
    }
    queue.push(attempt);
    attempt.timer = sim.after(TIMEOUT, () => {
      if (attempt.done) return;
      attempt.abandoned = true;
      fail(request);
    });
    serveNext();
  };

  const fail = request => {
    const retriesUsed = request.attempts - 1;
    let retry = model.policy !== 'none' && retriesUsed < MAX_RETRIES;
    if (retry && model.policy === 'budget') {
      if (tokens >= 1) tokens -= 1;
      else { retry = false; totals.refused++; }
    }
    if (!retry) { count('failed'); return; }
    totals.retries++;
    // Capped exponential backoff with full jitter: 0 to 50 ms, 0 to 100 ms, 0 to 200 ms.
    const ceiling = Math.min(1000, 50 * 2 ** retriesUsed);
    sim.after(sim.random() * ceiling, () => send(request));
  };

  poissonArrivals(sim, RATE, () => {
    count('arrived');
    if (model.policy === 'budget') tokens = Math.min(BUDGET.cap, tokens + BUDGET.ratio);
    send({ attempts: 0 });
  });

  sim.every(250, () => {
    const now = sim.now;
    model.samples.push({ t: now, sent: w.sent.rate(now), used: w.used.rate(now), wasted: w.wasted.rate(now), capacity: capacityAt(now - 1), queue: queue.length });
    if (model.samples.length > 400) model.samples.shift();
  });

  /** Figures over the last five seconds. */
  model.recentStats = () => {
    const now = sim.now;
    const arrived = recent.arrived.count(now), sent = recent.sent.count(now);
    const used = recent.used.count(now), wasted = recent.wasted.count(now), failed = recent.failed.count(now);
    return {
      perRequest: arrived ? sent / arrived : 0,
      wastedShare: used + wasted ? wasted / (used + wasted) : 0,
      failedShare: arrived ? failed / arrived : 0,
      queue: queue.length,
    };
  };
  return model;
}
