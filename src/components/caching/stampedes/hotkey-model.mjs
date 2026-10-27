// Figures 1, 3, 5 and 7: one hot key read by four application processes, and
// what happens each time its cached copy expires. Pure: runs under node.
//
// Times are simulated milliseconds, slowed down so the reader can watch: a
// rebuild, from the miss reaching the application to the new copy being stored
// in Redis, takes 1 second (a 100 ms reply, an 800 ms query and a 100 ms SET).
// The rates are scaled to match: what matters is requests a second × rebuild
// time, which is 15 by default here and 100 in the article's example.
//
// mode decides what a process does when it reads no fresh copy:
//   'none':         query the database and store the result (plain cache-aside);
//   'singleflight': as 'none', but a process that is already loading the key
//                   makes later requests wait for that load (per process);
//   'lock':         take a lock in Redis with SET NX; the winner rebuilds, and
//                   everyone else polls GET until the copy appears;
//   'stale':        the copy is kept for 3 × ttl (the hard expiry) and counts as
//                   fresh for ttl (the soft expiry). A stale read is answered at
//                   once; the first reader to take the lock refreshes the copy in
//                   the background. A missing key falls back to 'lock'.
// The database has no capacity limit here; Figure 2 adds one.
import { Simulation, Movers, poissonArrivals } from '../shared/sim.mjs';

export const HOP = { client: 300, redis: 100 };
export const QUERY = 800;
export const DEFAULTS = { mode: 'none', rate: 15, processes: 4, ttl: 5000, poll: 150, lockTtl: 5000, warm: true };

export function hotKey(params = {}, seed = 1) {
  const p = { ...DEFAULTS, ...params };
  const sim = new Simulation({ seed });
  const movers = new Movers(sim);
  const hard = p.mode === 'stale' ? 3 * p.ttl : p.ttl;
  // Redis: the cached copy and the lock.
  const redis = { value: null, storedAt: -Infinity, expiresAt: -Infinity, lock: null, lockExpiresAt: -Infinity };
  const procs = Array.from({ length: p.processes }, () => ({ loading: null, polling: 0 }));
  const db = { running: 0, queries: 0 };
  // An episode runs from the moment the copy stops being fresh until the next copy is stored.
  const episode = { queries: 0, slowest: 0, stale: 0, waiting: 0, open: false, startedAt: 0 };
  const last = { queries: null, slowest: null, stale: null };
  const totals = { requests: 0, queries: 0, stale: 0 };
  const model = { sim, params: p, movers, redis, db, procs, episode, last, totals, episodes: [] };

  const now = () => sim.now;
  const fresh = () => redis.value !== null && now() < redis.storedAt + p.ttl;
  const present = () => redis.value !== null && now() < redis.expiresAt;
  const lockFree = () => !redis.lock || now() >= redis.lockExpiresAt;
  const openEpisode = () => {
    if (episode.open) return;
    Object.assign(episode, { queries: 0, slowest: 0, stale: 0, waiting: 0, open: true, startedAt: now() });
  };
  const closeEpisode = () => {
    if (!episode.open) return;
    episode.open = false;
    model.episodes.push({ queries: episode.queries, startedAt: episode.startedAt, storedAt: now() });
  };
  const store = () => {
    redis.value = 'v'; redis.storedAt = now(); redis.expiresAt = now() + hard;
    // Slowest responses can still arrive after the store; the episode keeps counting them.
    closeEpisode();
    last.queries = episode.queries;
  };
  if (p.warm) { redis.value = 'v'; redis.storedAt = -p.ttl * 0.4; redis.expiresAt = redis.storedAt + hard; }

  const edge = (kind, i) => `${kind}-${i}`;
  const respond = (req, kind) => {
    const took = now() - req.at;
    if (req.inEpisode) { episode.slowest = Math.max(episode.slowest, took); last.slowest = episode.slowest; }
    movers.add({ edge: edge('client', req.proc), reverse: true, duration: HOP.client, kind });
  };
  // A database query; done() runs when the result is back in the application.
  const query = (req, done) => {
    db.running++; db.queries++; totals.queries++;
    if (episode.open) episode.queries++;
    movers.add({ edge: edge('db', req.proc), duration: QUERY / 2, kind: 'miss', onArrive: () =>
      movers.add({ edge: edge('db', req.proc), reverse: true, duration: QUERY / 2, kind: 'miss', onArrive: () => { db.running--; done(); } }) });
  };
  const setValue = (req, then) => movers.add({ edge: edge('redis', req.proc), duration: HOP.redis, kind: 'write', onArrive: () => { store(); then?.(); } });

  // The lock path: SET lock NX PX; the winner re-checks, rebuilds, stores and releases.
  const lockPath = req => {
    movers.add({ edge: edge('redis', req.proc), duration: HOP.redis, kind: 'write', onArrive: () => {
      const won = lockFree() && !present();
      if (won) { redis.lock = req.id; redis.lockExpiresAt = now() + p.lockTtl; }
      movers.add({ edge: edge('redis', req.proc), reverse: true, duration: HOP.redis, kind: won ? 'write' : 'miss', onArrive: () => {
        if (won) query(req, () => setValue(req, () => { if (redis.lock === req.id) redis.lock = null; respond(req, 'miss'); }));
        else { procs[req.proc].polling++; episode.waiting++; poll(req); }
      } });
    } });
  };
  const poll = req => {
    sim.after(p.poll, () => movers.add({ edge: edge('redis', req.proc), duration: HOP.redis, kind: 'client', onArrive: () => {
      const hit = present();
      movers.add({ edge: edge('redis', req.proc), reverse: true, duration: HOP.redis, kind: hit ? 'hit' : 'miss', onArrive: () => {
        if (!hit) return poll(req);
        episode.waiting--; procs[req.proc].polling--;
        respond(req, 'hit');
      } });
    } }));
  };

  let ids = 0;
  poissonArrivals(sim, () => model.params.rate, () => {
    const req = { id: ++ids, proc: sim.random.int(p.processes), at: 0, inEpisode: false };
    totals.requests++;
    movers.add({ edge: edge('client', req.proc), duration: HOP.client, kind: 'client', onArrive: () => {
      req.at = now();
      movers.add({ edge: edge('redis', req.proc), duration: HOP.redis, kind: 'client', onArrive: () => {
        const isFresh = fresh(), isPresent = present();
        if (!isFresh) { openEpisode(); req.inEpisode = true; }
        const kind = isFresh ? 'hit' : isPresent ? 'stale' : 'miss';
        if (kind === 'stale') { episode.stale++; totals.stale++; last.stale = episode.stale; }
        movers.add({ edge: edge('redis', req.proc), reverse: true, duration: HOP.redis, kind, onArrive: () => {
          if (kind === 'hit') return respond(req, 'hit');
          if (kind === 'stale') {
            respond(req, 'stale');
            // Try the lock; the winner refreshes in the background.
            movers.add({ edge: edge('redis', req.proc), duration: HOP.redis, kind: 'write', onArrive: () => {
              const won = lockFree() && !fresh();
              if (!won) return;
              redis.lock = req.id; redis.lockExpiresAt = now() + p.lockTtl;
              movers.add({ edge: edge('redis', req.proc), reverse: true, duration: HOP.redis, kind: 'write', onArrive: () =>
                query(req, () => setValue(req, () => { if (redis.lock === req.id) redis.lock = null; })) });
            } });
            return;
          }
          // A miss.
          if (p.mode === 'none') return query(req, () => setValue(req, () => respond(req, 'miss')));
          if (p.mode === 'singleflight') {
            const proc = procs[req.proc];
            if (proc.loading) { proc.loading.push(req); return; }
            proc.loading = [req];
            return query(req, () => setValue(req, () => { const waiting = proc.loading; proc.loading = null; waiting.forEach(r => respond(r, 'miss')); }));
          }
          return lockPath(req);
        } });
      } });
    } });
  });
  return model;
}

/** Requests waiting in each process (single-flight) or polling (lock), for drawing queues. */
export function waitingBy(model) {
  const counts = new Array(model.params.processes).fill(0);
  model.procs.forEach((proc, i) => { counts[i] += proc.polling + (proc.loading ? proc.loading.length - 1 : 0); });
  return counts;
}
