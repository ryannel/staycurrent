// When each request and reply of one page's cache reads leaves and arrives, for
// three ways of reading n values: one GET at a time, n GETs in one pipeline, or
// one MGET. Pure; times in microseconds of real (not on-screen) time.
//
// Illustrative costs, chosen to be the right size rather than measured on any
// one system: a network round trip of 500 µs; on Redis, about 7 µs of socket
// work per round trip and 0.2 µs to execute each GET (article 7 measured these
// on a laptop); on the client, 2 µs to write each command and 2 µs to read each
// reply. Bandwidth and network jitter are left out.

export const COSTS = { rtt: 500, socket: 7, exec: 0.2, send: 2, parse: 2 };
export const METHODS = ['sequential', 'pipeline', 'mget'];

/**
 * schedule({ n, method, ...costs }) -> {
 *   messages: [{ dir: 'out' | 'back', t0, t1, label, count }],   lines between the lanes
 *   work: [{ lane: 'app' | 'redis', t0, t1 }],                    stretches of work on a lane
 *   total, trips, redisTime
 * }
 */
export function schedule({ n, method, ...overrides }) {
  const c = { ...COSTS, ...overrides };
  const half = c.rtt / 2;
  const messages = [];
  const work = [];
  let redisTime = 0;
  const serve = (t0, commands) => {
    const dt = c.socket + commands * c.exec;
    work.push({ lane: 'redis', t0, t1: t0 + dt });
    redisTime += dt;
    return t0 + dt;
  };

  if (method === 'sequential') {
    let t = 0;
    for (let i = 0; i < n; i++) {
      work.push({ lane: 'app', t0: t, t1: t + c.send });
      const leave = t + c.send;
      messages.push({ dir: 'out', t0: leave, t1: leave + half, label: 'GET', count: 1 });
      const done = serve(leave + half, 1);
      messages.push({ dir: 'back', t0: done, t1: done + half, label: 'value', count: 1 });
      work.push({ lane: 'app', t0: done + half, t1: done + half + c.parse });
      t = done + half + c.parse;
    }
    return { messages, work, total: t, trips: n, redisTime };
  }

  if (method === 'pipeline') {
    // The client writes every command before reading anything. Redis reads what
    // has arrived, executes it, and replies; a burst of commands arriving close
    // together pays the per-round-trip socket work once.
    work.push({ lane: 'app', t0: 0, t1: n * c.send });
    let serverFree = 0;
    let parseFree = 0;
    let first = true;
    for (let i = 0; i < n; i++) {
      const leave = (i + 1) * c.send;
      messages.push({ dir: 'out', t0: leave, t1: leave + half, label: 'GET', count: 1 });
      const start = Math.max(leave + half, serverFree);
      const dt = (first ? c.socket : 0) + c.exec;
      first = false;
      work.push({ lane: 'redis', t0: start, t1: start + dt });
      redisTime += dt;
      serverFree = start + dt;
      messages.push({ dir: 'back', t0: serverFree, t1: serverFree + half, label: 'reply', count: 1 });
      const read = Math.max(serverFree + half, parseFree);
      parseFree = read + c.parse;
    }
    const lastBack = messages[messages.length - 1].t1;
    work.push({ lane: 'app', t0: lastBack, t1: parseFree });
    return { messages, work, total: parseFree, trips: 1, redisTime };
  }

  // One MGET: one command carrying n keys, one reply carrying n values.
  const leave = c.send + 0.1 * n;
  work.push({ lane: 'app', t0: 0, t1: leave });
  messages.push({ dir: 'out', t0: leave, t1: leave + half, label: `MGET (${n} key${n === 1 ? '' : 's'})`, count: n });
  const done = serve(leave + half, n);
  messages.push({ dir: 'back', t0: done, t1: done + half, label: `${n} value${n === 1 ? '' : 's'}`, count: n });
  const total = done + half + n * c.parse;
  work.push({ lane: 'app', t0: done + half, t1: total });
  return { messages, work, total, trips: 1, redisTime };
}

/** Time for n values by each method, for the bar chart. */
export function totals(n, overrides = {}) {
  return Object.fromEntries(METHODS.map(method => [method, schedule({ n, method, ...overrides }).total]));
}

/**
 * The batch-size arithmetic from the text: reading n values in batches of b
 * takes ceil(n / b) round trips plus a per-value cost on both ends.
 */
export const batchTime = ({ n, b, rtt, perValue }) => Math.ceil(n / b) * rtt + n * perValue;
