// A cache that evicts the way Redis does when maxmemory is reached: it samples
// a few keys, ranks them by the policy's score, keeps the best candidates in a
// pool of 16 between evictions, and evicts the best candidate in the pool.
// Modelled on evictionPoolPopulate and performEvictions in Redis 8.10.3
// (src/evict.c). It counts keys, not bytes, and samples keys uniformly at
// random, where Redis samples neighbouring hash-table buckets from a random
// starting point.
//
// Policies:
//   'lru'    score = idle time, with Redis's one-second clock resolution
//   'lfu'    score = 255 - counter; an 8-bit logarithmic counter that starts at
//            5 and loses one per `decayMinutes` minutes without access
//   'random' evict a random key, no pool

export const POOL_SIZE = 16;
export const LFU_INIT = 5;

/** One logarithmic increment: Redis's LFULogIncr. */
export function lfuIncrement(counter, logFactor, random) {
  if (counter >= 255) return 255;
  const base = Math.max(0, counter - LFU_INIT);
  return random() < 1 / (base * logFactor + 1) ? counter + 1 : counter;
}

export class SampledCache {
  constructor({ capacity, policy = 'lru', samples = 5, random, logFactor = 10, decayMinutes = 1, clockResolution = 1000 }) {
    Object.assign(this, { capacity, policy, samples, random, logFactor, decayMinutes, clockResolution });
    this.entries = new Map();   // key -> { lru, counter, ldt }
    this.list = [];             // keys, for uniform sampling
    this.index = new Map();     // key -> position in list
    this.pool = [];             // [{ key, score }], best candidate last
    this.lastSample = [];
    this.evictions = 0;
  }
  get size() { return this.list.length; }
  has(key) { return this.entries.has(key); }
  clock(now) { return Math.floor(now / this.clockResolution); }
  minutes(now) { return Math.floor(now / 60000); }

  /** The decayed LFU counter, without storing it: LFUDecrAndReturn. */
  counter(entry, now) {
    if (!this.decayMinutes) return entry.counter;
    const periods = Math.floor((this.minutes(now) - entry.ldt) / this.decayMinutes);
    return Math.max(0, entry.counter - Math.max(0, periods));
  }
  touch(entry, now) {
    entry.lru = this.clock(now);
    if (this.policy === 'lfu') {
      entry.counter = lfuIncrement(this.counter(entry, now), this.logFactor, this.random);
      entry.ldt = this.minutes(now);
    }
  }
  /** A read: true on a hit (and the key's recency or frequency is updated). */
  get(key, now) {
    const entry = this.entries.get(key);
    if (!entry) return false;
    this.touch(entry, now);
    return true;
  }
  /** Stores a new key, evicting first if the cache is full. Returns the evicted keys. */
  set(key, now) {
    const existing = this.entries.get(key);
    if (existing) { this.touch(existing, now); return []; }
    const evicted = [];
    while (this.list.length >= this.capacity && this.list.length) evicted.push(this.evictOne(now));
    // A new key starts with the current clock and, under LFU, the initial counter (createObject).
    this.entries.set(key, { lru: this.clock(now), counter: LFU_INIT, ldt: this.minutes(now) });
    this.index.set(key, this.list.length);
    this.list.push(key);
    return evicted;
  }
  remove(key) {
    const i = this.index.get(key);
    if (i === undefined) return;
    const last = this.list.pop();
    if (last !== key) { this.list[i] = last; this.index.set(last, i); }
    this.index.delete(key);
    this.entries.delete(key);
  }
  score(entry, now) {
    if (this.policy === 'lfu') return 255 - this.counter(entry, now);
    return this.clock(now) - entry.lru;   // idle time in clock ticks (seconds)
  }
  /** Samples keys into the pool: evictionPoolPopulate. */
  populate(now) {
    const n = Math.min(this.samples, this.list.length);
    const picked = new Set();
    while (picked.size < n) picked.add(this.list[this.random.int(this.list.length)]);
    this.lastSample = [...picked];
    for (const key of picked) {
      const score = this.score(this.entries.get(key), now);
      if (this.pool.some(p => p.key === key)) continue;
      // The pool is sorted by ascending score. A key worse than every candidate in a full pool is skipped.
      if (this.pool.length >= POOL_SIZE && score <= this.pool[0].score) continue;
      let k = 0;
      while (k < this.pool.length && this.pool[k].score < score) k++;
      this.pool.splice(k, 0, { key, score });
      if (this.pool.length > POOL_SIZE) this.pool.shift();
    }
  }
  /** Evicts one key and returns it. */
  evictOne(now) {
    let victim;
    if (this.policy === 'random') {
      this.lastSample = [];
      victim = this.list[this.random.int(this.list.length)];
    } else {
      while (!victim) {
        this.populate(now);
        // Take the best candidate; entries for keys that no longer exist are skipped.
        while (this.pool.length && !victim) {
          const best = this.pool.pop();
          if (this.entries.has(best.key)) victim = best.key;
        }
      }
    }
    this.remove(victim);
    this.evictions++;
    return victim;
  }
}
