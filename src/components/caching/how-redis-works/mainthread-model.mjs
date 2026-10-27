// Figures 2 and 4: the main thread at millisecond scale, with ordinary traffic,
// a client that sends PING about once a millisecond and records each round trip
// (as the probe in evidence/how-redis-works.txt did), and one expensive job the
// reader starts. Pure: runs under node.
//
// Time is in microseconds of Redis time. Ordinary requests cost about 7 µs of
// main-thread time each and travel 50 µs each way; jobs cost what I measured on a
// laptop with Redis 8.10.3 (see JOBS). Requests are served first come, first
// served: the real event loop's order between clients is unspecified, but no
// request can be served while a command is running, which is what matters here.
import { Simulation, poissonArrivals } from '../shared/sim.mjs';

export const REQUEST = 7; // µs of main-thread time for an ordinary request
export const NET = 50; // one-way network delay, µs
export const PING_GAP = 1000; // the probing client sleeps 1 ms between PINGs
export const EXPIRE_PERIOD = 100000; // hz 10: the expiry cycle runs 10 times a second

/** Measured costs, µs. KEYS: 99.4 ms of execution for 1,000,000 keys (SLOWLOG). Freeing a 2,000,000-member set: 195 ms. */
export const KEYS_PER_KEY = 0.0994;
export const FREE_BIG_SET = 195000;

/** The work each job puts on the main thread and on the background (lazy-free) thread. */
export function jobFor(kind, { keys = 1000000 } = {}) {
  switch (kind) {
    case 'keys': return { label: 'KEYS *', main: keys * KEYS_PER_KEY, bg: 0 };
    case 'del': return { label: 'DEL', main: FREE_BIG_SET, bg: 0 };
    case 'unlink': return { label: 'UNLINK', main: 4, bg: FREE_BIG_SET };
    case 'expire': return { label: 'key expires', main: FREE_BIG_SET, bg: 0, atExpiryCycle: true };
    case 'expire-lazy': return { label: 'key expires, lazy', main: 4, bg: FREE_BIG_SET, atExpiryCycle: true };
    default: throw new Error(`Unknown job ${kind}`);
  }
}

/**
 * params: background (ordinary requests a second, default 400).
 * Returns a model with run(job), blocks, pings, and current queue length.
 */
export function mainThread(params = {}, seed = 1) {
  const p = { background: 400, ...params };
  const sim = new Simulation({ seed });
  const queue = []; // { kind: 'request' | 'ping' | 'job', cost, job?, onDone? }
  const blocks = []; // { lane: 'main' | 'bg', start, end, kind, label }
  const pings = []; // { sent, t, rtt } in µs
  let busy = false;
  let bgFree = 0; // the background thread is busy until this time
  const model = { sim, params: p, queue, blocks, pings, lastJob: null, pending: 0 };

  const next = () => {
    if (busy || !queue.length) return;
    const item = queue.shift();
    busy = true;
    const start = sim.now;
    const end = start + item.cost;
    blocks.push({ lane: 'main', start, end, kind: item.kind, label: item.job?.label });
    sim.at(end, () => {
      busy = false;
      item.onDone?.(end);
      next();
    });
  };
  const arrive = item => { queue.push(item); next(); };

  // Ordinary traffic, open loop. The shared helper works in milliseconds and this
  // clock is in microseconds, so the rate is given per thousand seconds.
  poissonArrivals(sim, () => model.params.background / 1000, () => {
    sim.after(NET, () => arrive({ kind: 'request', cost: REQUEST }));
  });

  // The probing client: PING, wait for the reply, sleep 1 ms, repeat.
  const ping = () => {
    const sent = sim.now;
    sim.after(NET, () => arrive({ kind: 'ping', cost: REQUEST, onDone: () => sim.after(NET, () => {
      pings.push({ sent, t: sim.now, rtt: sim.now - sent });
      sim.after(PING_GAP, ping);
    }) }));
  };
  sim.after(300, ping);

  /** Starts a job now (a client sends the command) or at the next expiry cycle. */
  model.run = job => {
    const record = { ...job, requested: sim.now, started: null, finished: null };
    model.lastJob = record;
    model.pending++;
    const enqueue = () => arrive({ kind: 'job', cost: job.main, job, onDone: end => {
      record.started = end - job.main;
      record.finished = end;
      if (job.bg) {
        const start = Math.max(end, bgFree);
        bgFree = start + job.bg;
        blocks.push({ lane: 'bg', start, end: bgFree, kind: 'free', label: 'freeing memory' });
      }
      model.pending--;
    } });
    if (job.atExpiryCycle) sim.at(Math.ceil((sim.now + 1) / EXPIRE_PERIOD) * EXPIRE_PERIOD, enqueue);
    else sim.after(NET, enqueue);
    return record;
  };

  /** Drops history older than `keep` µs before now. */
  model.trim = (keep = 1500000) => {
    const from = sim.now - keep;
    let i = 0;
    while (i < blocks.length && blocks[i].end < from && blocks[i].lane === 'main') i++;
    if (i) blocks.splice(0, i);
    if (pings.length > 4000) pings.splice(0, pings.length - 4000);
  };
  model.waiting = () => queue.length;
  return model;
}

/** The largest PING round trip at or after time `from` (µs). */
export function worstPing(pings, from = 0) {
  let worst = 0;
  for (const s of pings) if (s.t >= from && s.rtt > worst) worst = s.rtt;
  return worst;
}
