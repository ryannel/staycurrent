// Figure 1: Redis's event loop serving clients that each send GET, wait for the
// reply, then send the next (a closed loop). One main thread does everything:
// it reads and parses each ready client's request, executes it, and before it
// waits again it writes every pending reply. Pure: runs under node.
//
// Time is in microseconds of Redis time. The costs are illustrative proportions
// taken from one measurement on a laptop (evidence/how-redis-works.txt, section G):
// about 7.5 µs of main-thread CPU per un-pipelined GET in total, of which the
// command itself is a fraction of a microsecond. The network delay is a loopback
// round trip of about 0.1 ms; a real network is slower.
import { Simulation, Movers } from '../shared/sim.mjs';

export const COST = { read: 3.6, exec: 0.3, write: 3.6, poll: 0.2 };
export const NET = 50; // one-way network delay, µs

/**
 * params: clients (1 to 40).
 * Exposes: sim (µs), movers (dots, durations in µs), blocks (main-thread work for
 * the strip), stats, and rates over a trailing window.
 */
export function eventLoop(params = {}, seed = 1) {
  const p = { clients: 3, ...params };
  const sim = new Simulation({ seed });
  const movers = new Movers(sim);
  const blocks = []; // { start, end, kind: 'read' | 'exec' | 'write' | 'poll', client }
  const ready = []; // requests that have arrived and wait to be read: { client, arrived }
  const done = []; // completed requests: { t, wait } for trailing rates
  const stats = { served: 0 };
  let busyUntil = 0; // the main thread is busy until this time
  let looping = false;
  // settledAt: the last time a surplus client (one the slider removed) finished its final request.
  const model = { sim, params: p, movers, blocks, ready, done, stats, active: 0, settledAt: 0 };

  const send = client => {
    movers.add({ edge: 'clients-redis', duration: NET, kind: 'client', onArrive: () => {
      ready.push({ client, arrived: sim.now });
      wake();
    } });
  };

  const record = (kind, start, length, client) => {
    blocks.push({ kind, start, end: start + length, client });
    return start + length;
  };

  // One turn of the loop: poll for events, then read, parse and execute every
  // ready request in turn, then write all the replies. New arrivals during the
  // turn wait for the next turn.
  const turn = () => {
    let t = Math.max(sim.now, busyUntil);
    t = record('poll', t, COST.poll);
    const batch = ready.splice(0, ready.length);
    const replies = [];
    for (const request of batch) {
      const started = t;
      t = record('read', t, COST.read, request.client);
      t = record('exec', t, COST.exec, request.client);
      replies.push({ ...request, wait: started - request.arrived });
    }
    for (const reply of replies) {
      t = record('write', t, COST.write, reply.client);
      const leave = t;
      sim.at(leave, () => {
        done.push({ t: leave, wait: reply.wait, client: reply.client });
        stats.served++;
        movers.add({ edge: 'clients-redis', reverse: true, duration: NET, kind: 'hit', onArrive: () => {
          if (reply.client < model.params.clients) send(reply.client);
          else if (--model.active <= model.params.clients) model.settledAt = sim.now;
        } });
      });
    }
    busyUntil = t;
    // Look for more work once this turn's work is finished.
    sim.at(t, () => { if (ready.length) turn(); else looping = false; });
  };
  const wake = () => { if (!looping) { looping = true; sim.at(Math.max(sim.now, busyUntil), turn); } };

  model.setClients = n => {
    const target = Math.max(1, Math.round(n));
    // New clients start at random moments within one round trip, as real clients
    // would, rather than all in the same microsecond.
    while (model.active < target) { const c = model.active; sim.after(sim.random() * (2 * NET + 7.5), () => send(c)); model.active++; }
    model.params.clients = target; // surplus clients stop after their next reply
    if (model.active <= target) model.settledAt = sim.now;
    else model.settledAt = Infinity; // until the last surplus client has stopped
  };
  model.setClients(p.clients);

  /** Trailing statistics over the last `span` µs: requests a second, share of time busy, mean wait. */
  model.rates = (span = 2000) => {
    const from = sim.now - span;
    dropBefore(done, d => d.t >= from - 1);
    dropBefore(blocks, b => b.end >= from - 20000);
    // Count only clients that are still running. The surplus clients of a lowered slider
    // each finish one more request, and counting them would overstate the rate for a while.
    const live = model.params.clients;
    const recent = done.filter(d => d.t >= from && d.client < live);
    // The loop works in turns (a poll, then a batch of reads, then the writes). Measure from the
    // start of the turn that contains the window's start to the start of the latest turn, so the
    // window never cuts a batch in half. Cutting at an arbitrary moment can miscount by a whole
    // batch, which is a large error when only a few requests fall in the window. When one turn
    // is longer than the window, that single turn is measured whole.
    const polls = blocks.filter(b => b.kind === 'poll' && b.start <= sim.now);
    let t0 = from, t1 = sim.now, served = recent.length;
    if (polls.length >= 2) {
      let i0 = -1;
      polls.forEach((b, i) => { if (b.start <= from) i0 = i; });
      const i1 = polls.length - 1;
      if (i0 < 0) i0 = 0;
      if (i0 >= i1) i0 = i1 - 1;
      t0 = polls[i0].start;
      t1 = polls[i1].start;
      served = 0;
      for (const b of blocks) if (b.kind === 'read' && b.client < live && b.start >= t0 && b.start < t1) served++;
    }
    const perSecond = (served / ((t1 - t0) || 1)) * 1e6;
    let busy = 0;
    for (const b of blocks) if (b.client === undefined || b.client < live) busy += Math.max(0, Math.min(b.end, t1) - Math.max(b.start, t0));
    const elapsed = (t1 - t0) || 1;
    return {
      perSecond,
      busy: Math.min(1, busy / elapsed),
      wait: recent.length ? recent.reduce((s, d) => s + d.wait, 0) / recent.length : 0,
      waiting: ready.length,
    };
  };
  return model;
}

/** Removes the leading items before the first that satisfies `keep`, in one splice. */
function dropBefore(list, keep) {
  let i = 0;
  while (i < list.length && !keep(list[i])) i++;
  if (i) list.splice(0, i);
}

/** The throughput ceiling of one thread at these costs, requests a second. */
export const ceiling = () => 1e6 / (COST.read + COST.exec + COST.write);
