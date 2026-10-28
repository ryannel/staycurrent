// Records what INFO shows during four cache incidents, at a realistic pace.
// A synthetic application reads product keys with Zipf popularity (s = 1.0)
// at a fixed rate, cache-aside: GET, and on a miss SET with a TTL (the
// "database" is instant; each miss counts as one database query). Every second
// it samples INFO stats, memory and keyspace from a second connection.
//
// Usage: node incident.mjs <port> <scenario> <out.jsonl>
// scenario: small | ttl | rename | flush
// The incident happens at INCIDENT seconds; the run lasts DURATION seconds.
import { connect } from './resp.mjs';
import fs from 'node:fs';

const [port, scenario, out] = [Number(process.argv[2]), process.argv[3], process.argv[4]];
const RATE = 1000;            // requests a second
const KEYS = 50000;           // products
const SKEW = 1.0;
const VALUE = 'x'.repeat(400);
const TTL = 120;              // seconds, with ±50% jitter
const SHORT_TTL = 10;         // the mistaken TTL in scenario "ttl"
const INCIDENT = 240;
const SMALL = process.env.SMALL || '6mb';   // the mistaken maxmemory in scenario "small"
const DURATION = 420;

// Seeded random and Zipf sampling.
// mulberry32: a small seeded generator with a full 2^32 period.
let seed = 12345;
const rnd = () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const cdf = new Float64Array(KEYS);
{ let sum = 0; for (let k = 0; k < KEYS; k++) { sum += 1 / Math.pow(k + 1, SKEW); cdf[k] = sum; } for (let k = 0; k < KEYS; k++) cdf[k] /= sum; }
const sample = () => { const u = rnd(); let lo = 0, hi = KEYS - 1; while (lo < hi) { const m = (lo + hi) >> 1; if (cdf[m] < u) lo = m + 1; else hi = m; } return lo; };

const app = await connect(port);
const mon = await connect(port);
await app.call('FLUSHALL');
await app.call('CONFIG', 'SET', 'maxmemory', '64mb');
await app.call('CONFIG', 'SET', 'maxmemory-policy', 'allkeys-lru');
await app.call('CONFIG', 'RESETSTAT');

let prefix = 'product:v1:';
let ttl = TTL;
const second = () => ({ requests: 0, hits: 0, misses: 0 });
let current = second();
const rows = [];
const parseInfo = text => Object.fromEntries(text.split('\r\n').filter(l => l && !l.startsWith('#')).map(l => { const i = l.indexOf(':'); return [l.slice(0, i), l.slice(i + 1)]; }));

const start = performance.now();
let issued = 0, incidentDone = false, note = '';
async function tick() {
  const elapsed = (performance.now() - start) / 1000;
  if (!incidentDone && elapsed >= INCIDENT) {
    incidentDone = true;
    if (scenario === 'small') { await app.call('CONFIG', 'SET', 'maxmemory', SMALL); note = `CONFIG SET maxmemory ${SMALL}`; }
    if (scenario === 'ttl') { ttl = SHORT_TTL; note = `application TTL ${TTL} s -> ${SHORT_TTL} s`; }
    if (scenario === 'rename') { prefix = 'product:v2:'; note = 'key prefix v1 -> v2'; }
    if (scenario === 'flush') { await app.call('FLUSHALL'); note = 'FLUSHALL'; }
  }
  const due = Math.floor(elapsed * RATE) - issued;
  if (due > 0) {
    const keys = Array.from({ length: due }, () => prefix + sample());
    issued += due;
    const replies = await Promise.all(keys.map(k => app.call('GET', k)));
    const sets = [];
    replies.forEach((v, i) => {
      current.requests++;
      if (v === null) { current.misses++; const ex = Math.round(ttl * (0.5 + rnd())); sets.push(app.call('SET', keys[i], VALUE, 'EX', String(Math.max(1, ex)))); }
      else current.hits++;
    });
    await Promise.all(sets);
  }
}

let nextSample = 1;
for (;;) {
  await tick();
  const elapsed = (performance.now() - start) / 1000;
  if (elapsed >= nextSample) {
    const info = parseInfo(await mon.call('INFO', 'stats', 'memory', 'keyspace'));
    const db = (info.db0 || 'keys=0,expires=0').split(',').reduce((o, kv) => { const [k, v] = kv.split('='); o[k] = Number(v); return o; }, {});
    rows.push({
      t: nextSample, app: current,
      keyspace_hits: Number(info.keyspace_hits), keyspace_misses: Number(info.keyspace_misses),
      evicted_keys: Number(info.evicted_keys), expired_keys: Number(info.expired_keys),
      used_memory: Number(info.used_memory), maxmemory: Number(info.maxmemory), keys: db.keys || 0,
      note: nextSample === INCIDENT + 1 ? note : undefined,
    });
    current = second();
    nextSample++;
    if (nextSample > DURATION) break;
  }
  await new Promise(r => setTimeout(r, 5));
}
fs.writeFileSync(out, rows.map(r => JSON.stringify(r)).join('\n') + '\n');
app.close(); mon.close();
console.log(scenario, 'done', rows.length, 'samples; achieved rate', (issued / ((performance.now() - start) / 1000)).toFixed(0), '/s');
