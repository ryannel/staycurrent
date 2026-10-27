// Stampede experiments against a real Redis 8.10.3 on port 7106. The database
// is simulated (a timer of `delta` ms, with a concurrency counter); every Redis
// command is real. Usage: node lab.mjs <experiment>
import { connect } from './resp.mjs';
import { randomBytes } from 'node:crypto';

const sleep = ms => new Promise(r => setTimeout(r, ms));
function seeded(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const q = (xs, p) => { if (!xs.length) return NaN; const s = [...xs].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };

function database(delta) {
  const db = { queries: 0, running: 0, peak: 0 };
  db.query = async () => { db.queries++; db.running++; db.peak = Math.max(db.peak, db.running); await sleep(delta); db.running--; return JSON.stringify({ trending: [42, 17, 8], at: Date.now() }); };
  return db;
}

// One request for key K under a strategy. Returns { stale, rebuilt, missed }.
const strategies = {
  async none(p, K, o) {
    const v = await p.r.call('GET', K);
    if (v !== null) return {};
    const fresh = await o.db.query();
    await p.r.call('SET', K, fresh, 'PX', o.ttl);
    return { missed: true };
  },
  async singleflight(p, K, o) {
    const v = await p.r.call('GET', K);
    if (v !== null) return {};
    let load = p.inflight.get(K);
    if (!load) {
      load = (async () => { const fresh = await o.db.query(); await p.r.call('SET', K, fresh, 'PX', o.ttl); })();
      p.inflight.set(K, load);
      load.finally(() => p.inflight.delete(K));
    }
    await load;
    return { missed: true };
  },
  async lock(p, K, o) {
    let v = await p.r.call('GET', K);
    if (v !== null) return {};
    const token = randomBytes(8).toString('hex');
    if (await p.r.call('SET', `lock:${K}`, token, 'NX', 'PX', o.lockTtl) === 'OK') {
      if (o.recheck && (await p.r.call('GET', K)) !== null) { await p.r.call('DELEX', `lock:${K}`, 'IFEQ', token); return { missed: true }; }
      const fresh = await o.db.query();
      await p.r.call('SET', K, fresh, 'PX', o.ttl);
      await p.r.call('DELEX', `lock:${K}`, 'IFEQ', token);
      return { missed: true };
    }
    const deadline = Date.now() + 3000;
    while (Date.now() < deadline) {
      await sleep(15 + o.random() * 10);           // poll every 20 ms ± 5 ms
      v = await p.r.call('GET', K);
      if (v !== null) return { missed: true, waited: true };
    }
    o.gaveUp++; await o.db.query(); return { missed: true };
  },
  // Stored with the hard TTL; stale once its age passes the soft TTL.
  async stale(p, K, o) {
    const [v, pttl] = await Promise.all([p.r.call('GET', K), p.r.call('PTTL', K)]);
    if (v === null) return strategies.lock(p, K, { ...o, ttl: o.hard });
    if (pttl > o.hard - o.soft) return {};
    const token = randomBytes(8).toString('hex');
    if (await p.r.call('SET', `lock:${K}`, token, 'NX', 'PX', o.lockTtl) === 'OK') {
      (async () => { const fresh = await o.db.query(); await p.r.call('SET', K, fresh, 'PX', o.hard); await p.r.call('DELEX', `lock:${K}`, 'IFEQ', token); })();
    }
    return { stale: true };
  },
  // XFetch: value and delta (ms) in a hash; recompute early with probability from the rule.
  async xfetch(p, K, o) {
    const [[v, d], pttl] = await Promise.all([p.r.call('HMGET', K, 'v', 'delta'), p.r.call('PTTL', K)]);
    const delta = Number(d);
    if (v !== null && !(-delta * o.beta * Math.log(1 - o.random()) >= pttl)) return {};
    const start = Date.now();
    const fresh = await o.db.query();
    const took = Date.now() - start;
    await p.r.call('HSET', K, 'v', fresh, 'delta', took);
    await p.r.call('PEXPIRE', K, o.ttl);
    o.rebuildTimes.push({ at: start, early: v !== null ? pttl : 0 });
    return { missed: v === null, rebuilt: true };
  },
};

async function run({ strategy, seed = 1, rate = 500, seconds = 3, delta = 200, processes = 4, warm = false, ...rest }) {
  const procs = [];
  for (let i = 0; i < processes; i++) procs.push({ r: await connect(7106), inflight: new Map() });
  const K = 'trending';
  await procs[0].r.call('DEL', K, `lock:${K}`);
  const random = seeded(seed);
  const o = { db: database(delta), ttl: 60000, lockTtl: 5000, recheck: true, random, gaveUp: 0, beta: 1, soft: 5000, hard: 15000, rebuildTimes: [], ...rest };
  if (warm) {
    if (strategy === 'xfetch') { await procs[0].r.call('HSET', K, 'v', 'warm', 'delta', delta); await procs[0].r.call('PEXPIRE', K, o.ttl); }
    else await procs[0].r.call('SET', K, 'warm', 'PX', strategy === 'stale' ? o.hard : o.ttl);
  }
  const lat = [], results = [];
  const t0 = Date.now(); let tNext = 0; const pending = [];
  while (tNext < seconds * 1000) {
    tNext += -Math.log(1 - random()) / rate * 1000;
    const wait = t0 + tNext - Date.now();
    if (wait > 1) await sleep(wait);
    const p = procs[Math.floor(random() * processes)];
    const s = Date.now();
    pending.push(strategies[strategy](p, K, o).then(res => { lat.push(Date.now() - s); results.push(res); }));
  }
  await Promise.all(pending);
  await sleep(delta + 100);
  for (const p of procs) p.r.close();
  return {
    strategy, seed, requests: lat.length, dbQueries: o.db.queries, peakConcurrent: o.db.peak,
    p50: q(lat, 0.5), p99: q(lat, 0.99), max: Math.max(...lat), slow: lat.filter(x => x > 50).length,
    stale: results.filter(r => r.stale).length, waited: results.filter(r => r.waited).length, gaveUp: o.gaveUp,
    hardMisses: strategy === 'xfetch' ? results.filter(r => r.missed).length : undefined,
    rebuildTimes: o.rebuildTimes,
  };
}

const fmt = r => `${r.strategy.padEnd(12)} seed ${r.seed}: requests ${r.requests}, database queries ${r.dbQueries}, peak concurrent ${r.peakConcurrent}, latency p50 ${r.p50} ms p99 ${r.p99} ms max ${r.max} ms, slower than 50 ms ${r.slow} (${(100 * r.slow / r.requests).toFixed(1)}%), served stale ${r.stale}, waited on lock ${r.waited}${r.hardMisses !== undefined ? `, requests that found no value ${r.hardMisses}` : ''}`;

const which = process.argv[2];
if (which === 'cold') {
  console.log('# Experiment G: a cold hot key. Key absent at start; Poisson 500 req/s for 3 s; 4 application processes; database 200 ms.');
  for (const strategy of ['none', 'singleflight', 'lock']) for (const seed of [1, 2, 3]) console.log(fmt(await run({ strategy, seed })));
}
if (which === 'recheck') {
  console.log('# Experiment H: does skipping the re-check after taking the lock cause duplicate rebuilds? 30 runs each, 0.6 s bursts at 500 req/s.');
  for (const recheck of [false, true]) {
    const counts = [];
    for (let seed = 1; seed <= 30; seed++) counts.push((await run({ strategy: 'lock', seed, seconds: 0.6, recheck })).dbQueries);
    console.log(`recheck=${recheck}: database queries per run: ${counts.join(' ')}; runs with more than one: ${counts.filter(c => c > 1).length}`);
  }
}
if (which === 'cycles') {
  console.log('# Experiment I: a warm hot key over 30 s. Poisson 500 req/s, 4 processes, database 200 ms. TTL 5 s (none, lock, xfetch); stale: soft 5 s, hard 15 s.');
  for (const strategy of ['none', 'lock', 'stale', 'xfetch']) {
    const r = await run({ strategy, seed: 7, seconds: 30, warm: true, ttl: 5000 });
    console.log(fmt(r));
    if (strategy === 'xfetch') {
      // Group rebuilds into expiry cycles: starts within one rebuild time (200 ms) of the cycle's first start.
      const starts = r.rebuildTimes.sort((a, b) => a.at - b.at); const cycles = [];
      for (const s of starts) { const c = cycles.at(-1); if (c && s.at - c.first < 200) c.n++; else cycles.push({ first: s.at, n: 1, early: s.early }); }
      console.log(`  xfetch cycles: ${cycles.length}; rebuilds per cycle: ${cycles.map(c => c.n).join(' ')}; mean ${(starts.length / cycles.length).toFixed(2)}; first rebuild started this many ms before expiry: ${cycles.map(c => c.early).join(' ')}`);
    }
  }
}
if (which === 'xfetch') {
  console.log('# Experiment J: XFetch on real Redis, longer run. Poisson 500 req/s, TTL 5 s, beta 1, 120 s.');
  const r = await run({ strategy: 'xfetch', seed: 11, seconds: 120, warm: true, ttl: 5000 });
  console.log(fmt(r));
  const starts = r.rebuildTimes.sort((a, b) => a.at - b.at); const cycles = [];
  for (const s of starts) { const c = cycles.at(-1); if (c && s.at - c.first < 200) c.n++; else cycles.push({ first: s.at, n: 1, early: s.early }); }
  const early = cycles.map(c => c.early);
  console.log(`  cycles ${cycles.length}; mean rebuilds per cycle ${(starts.length / cycles.length).toFixed(2)}; max ${Math.max(...cycles.map(c => c.n))}; first rebuild before expiry: mean ${(early.reduce((a, b) => a + b, 0) / early.length).toFixed(0)} ms, min ${Math.min(...early)} ms, max ${Math.max(...early)} ms`);
}
