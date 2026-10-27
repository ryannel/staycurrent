// Pure simulation helpers for the caching figures. Nothing here touches the DOM,
// so models built from it run and test under node (see sim.test.mjs).
//
// Time is simulated milliseconds. A model reacts only to scheduled events, never
// to frame timing, so the same seed and parameters give the same run whether it
// is advanced in one call or in many small frames.

/** A seeded random number generator (mulberry32). Returns floats in [0, 1). */
export function seededRandom(seed = 1) {
  let a = seed >>> 0;
  const random = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  /** An integer in [0, n). */
  random.int = n => Math.floor(random() * n);
  /** A float in [min, max). */
  random.range = (min, max) => min + random() * (max - min);
  random.pick = items => items[random.int(items.length)];
  /** True with probability p. */
  random.chance = p => random() < p;
  return random;
}

/**
 * Time until the next event of a Poisson process with `perSecond` events a second,
 * in milliseconds, or in a model's own unit when `unitsPerSecond` is given
 * (1e6 for a model that counts microseconds).
 */
export const exponentialGap = (random, perSecond, unitsPerSecond = 1000) => (-Math.log(1 - random()) / perSecond) * unitsPerSecond;

/** A normally distributed value (Box–Muller). */
export function normal(random, mean = 0, sd = 1) {
  const u = 1 - random();
  const v = random();
  return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/** A log-normal value with the given median; `spread` is the sigma of the underlying normal. */
export const logNormal = (random, median, spread = 0.5) => median * Math.exp(normal(random, 0, spread));

/**
 * Zipf popularity over n keys: rank k (0 = most popular) has weight 1 / (k + 1)^s.
 * s = 0 is uniform; s near 1 is typical of web caches; larger s is more skewed.
 */
export function zipf(n, s = 1) {
  const cumulative = new Float64Array(n);
  let total = 0;
  for (let k = 0; k < n; k++) { total += 1 / Math.pow(k + 1, s); cumulative[k] = total; }
  for (let k = 0; k < n; k++) cumulative[k] /= total;
  return {
    n, s,
    /** A rank drawn with Zipf probability. */
    sample(random) {
      const u = random();
      let lo = 0, hi = n - 1;
      while (lo < hi) { const mid = (lo + hi) >> 1; if (cumulative[mid] < u) lo = mid + 1; else hi = mid; }
      return lo;
    },
    probability: k => cumulative[k] - (k > 0 ? cumulative[k - 1] : 0),
    /** Share of requests that go to the `count` most popular keys: the hit ratio of an ideal cache that size. */
    topShare: count => (count <= 0 ? 0 : cumulative[Math.min(count, n) - 1]),
  };
}

/** A discrete-event simulation clock with seeded randomness. */
export class Simulation {
  constructor({ seed = 1 } = {}) {
    this.seed = seed;
    this.now = 0;
    this.random = seededRandom(seed);
    this.heap = [];
    this.sequence = 0;
    this.cancelled = new Set();
  }
  /** Runs fn(sim) at simulated time `time`. Returns an id for cancel(). */
  at(time, fn) {
    const event = { time: Math.max(time, this.now), id: ++this.sequence, fn };
    push(this.heap, event);
    return event.id;
  }
  after(delay, fn) { return this.at(this.now + delay, fn); }
  /** Runs fn every `interval` ms, first after `first` ms (default: one interval). Returns a stop function. */
  every(interval, fn, first = interval) {
    let id;
    const tick = () => { fn(this); id = this.after(interval, tick); };
    id = this.after(first, tick);
    return () => this.cancel(id);
  }
  cancel(id) { this.cancelled.add(id); }
  /** Processes every event up to now + ms, in time order (ties in scheduling order). */
  advance(ms) {
    const end = this.now + ms;
    while (this.heap.length && this.heap[0].time <= end) {
      const event = pop(this.heap);
      if (this.cancelled.delete(event.id)) continue;
      this.now = event.time;
      event.fn(this);
    }
    this.now = end;
  }
  /** Advances until a predicate holds or `limit` ms pass, in steps. For tests and pre-warming. */
  runUntil(predicate, { step = 100, limit = 600000 } = {}) {
    const stop = this.now + limit;
    while (!predicate(this) && this.now < stop) this.advance(step);
  }
}

// A binary min-heap ordered by (time, id).
const less = (a, b) => a.time < b.time || (a.time === b.time && a.id < b.id);
function push(heap, item) {
  heap.push(item);
  let i = heap.length - 1;
  while (i > 0) {
    const parent = (i - 1) >> 1;
    if (!less(heap[i], heap[parent])) break;
    [heap[i], heap[parent]] = [heap[parent], heap[i]];
    i = parent;
  }
}
function pop(heap) {
  const top = heap[0];
  const last = heap.pop();
  if (heap.length) {
    heap[0] = last;
    let i = 0;
    for (;;) {
      const l = 2 * i + 1, r = l + 1;
      let m = i;
      if (l < heap.length && less(heap[l], heap[m])) m = l;
      if (r < heap.length && less(heap[r], heap[m])) m = r;
      if (m === i) break;
      [heap[i], heap[m]] = [heap[m], heap[i]];
      i = m;
    }
  }
  return top;
}

/**
 * Poisson arrivals: calls onArrival(sim) at random gaps averaging `rate` a second.
 * `rate` may be a function, read before each gap, so a slider can change it live.
 * The simulation clock counts milliseconds unless `unitsPerSecond` says otherwise
 * (1e6 for microseconds); `rate` is always per second.
 * Returns a stop function.
 */
export function poissonArrivals(sim, rate, onArrival, { unitsPerSecond = 1000 } = {}) {
  let id;
  const rateNow = () => (typeof rate === 'function' ? rate() : rate);
  const next = () => {
    const r = rateNow();
    id = sim.after(r > 0 ? exponentialGap(sim.random, r, unitsPerSecond) : unitsPerSecond / 4, s => { if (rateNow() > 0) onArrival(s); next(); });
  };
  next();
  return () => sim.cancel(id);
}

/**
 * Things moving along a route for the renderer to draw: request dots, responses,
 * invalidation messages. add() schedules arrival; active() reports progress.
 */
export class Movers {
  constructor(sim) { this.sim = sim; this.items = new Map(); this.sequence = 0; }
  /**
   * edge: the scene edge id; reverse: travel from the edge's `to` end back to `from`;
   * kind: colour and shape (see tokens.css); onArrive(sim, mover) runs on arrival.
   */
  add({ edge, duration, kind = 'client', reverse = false, onArrive, data }) {
    const mover = { id: ++this.sequence, edge, kind, reverse, start: this.sim.now, duration, data };
    this.items.set(mover.id, mover);
    this.sim.after(duration, s => { this.items.delete(mover.id); onArrive?.(s, mover); });
    return mover;
  }
  /** Movers in flight, each with t in [0, 1]. */
  active() {
    const now = this.sim.now;
    return [...this.items.values()].map(m => ({ ...m, t: Math.min(1, Math.max(0, (now - m.start) / m.duration)) }));
  }
  get size() { return this.items.size; }
}

/** Counts events in a trailing window, for rates such as database reads per second. */
export class Window {
  constructor(span = 1000) { this.span = span; this.times = []; }
  add(time, count = 1) { for (let i = 0; i < count; i++) this.times.push(time); }
  count(now) {
    const from = now - this.span;
    let drop = 0;
    while (drop < this.times.length && this.times[drop] <= from) drop++;
    if (drop) this.times.splice(0, drop);
    return this.times.length;
  }
  /** Events per second over the window. */
  rate(now) { return (this.count(now) * 1000) / this.span; }
}

/** Ratio over the last `size` outcomes, such as the recent hit ratio. */
export class RecentRatio {
  constructor(size = 200) { this.size = size; this.values = []; this.sum = 0; }
  add(yes) {
    const v = yes ? 1 : 0;
    this.values.push(v); this.sum += v;
    if (this.values.length > this.size) this.sum -= this.values.shift();
  }
  get value() { return this.values.length ? this.sum / this.values.length : 0; }
  get count() { return this.values.length; }
}

/** The q-quantile (0–1) of numbers, with linear interpolation. */
export function quantile(values, q) {
  if (!values.length) return NaN;
  const sorted = [...values].sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos), hi = Math.ceil(pos);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

/**
 * A size-limited key-value store with least-recently-used eviction and optional
 * expiry, as an illustrative cache. It models no memory sizes, only key counts.
 * get() and set() take the simulated time so expiry needs no timers.
 */
export class LruCache {
  constructor(capacity = 100) { this.capacity = capacity; this.map = new Map(); this.evictions = 0; this.expirations = 0; }
  get size() { return this.map.size; }
  /** The stored entry { value, expiresAt, storedAt } if present and unexpired; refreshes recency. */
  get(key, now = 0) {
    const entry = this.map.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= now) { this.map.delete(key); this.expirations++; return undefined; }
    this.map.delete(key); this.map.set(key, entry);
    return entry;
  }
  /** Reads without changing recency or expiring. */
  peek(key) { return this.map.get(key); }
  has(key, now = 0) { const e = this.map.get(key); return !!e && e.expiresAt > now; }
  set(key, value, { now = 0, ttl = Infinity } = {}) {
    if (this.capacity <= 0) return [];
    this.map.delete(key);
    this.map.set(key, { value, storedAt: now, expiresAt: now + ttl });
    return this.trim();
  }
  delete(key) { return this.map.delete(key); }
  /** Changes capacity, evicting least recently used keys if it shrinks. Returns evicted keys. */
  resize(capacity) { this.capacity = capacity; return this.trim(); }
  trim() {
    const evicted = [];
    while (this.map.size > Math.max(0, this.capacity)) {
      const oldest = this.map.keys().next().value;
      this.map.delete(oldest); this.evictions++; evicted.push(oldest);
    }
    return evicted;
  }
  /** Keys from least to most recently used. */
  keys() { return [...this.map.keys()]; }
}

/** Formats a parameter for its <output>: 'percent' (0–1 → %), 'multiplier' (×), or a number with a unit. */
export function formatValue(value, format = 'number', unit = '') {
  const v = Number(value);
  if (format === 'percent') return `${Math.round(v * 100)}%`;
  if (format === 'multiplier') return `${v}×`;
  if (format === 'seconds') return `${v} s`;
  const text = Number.isInteger(v) ? v.toLocaleString('en-GB') : String(Math.round(v * 100) / 100);
  return unit ? `${text} ${unit}` : text;
}

/**
 * The text shown for a parameter: its entry in `labels` (keyed by value) if there
 * is one, otherwise formatValue(value, format, unit).
 */
export function paramText(value, { format = 'number', unit = '', labels } = {}) {
  const custom = labels?.[String(Number(value))] ?? labels?.[String(value)];
  return custom ?? formatValue(value, format, unit);
}

/** Milliseconds in one unit of simulated time. */
export const TIME_UNITS = { us: 0.001, ms: 1, s: 1000 };
const short = v => String(Number(v.toPrecision(3)));

/** A duration given in `unit` ('us', 'ms' or 's') as text in the largest fitting unit: 50 µs, 1.5 ms, 300 s. */
export function formatDuration(value, unit = 'ms') {
  const ms = Number(value) * (TIME_UNITS[unit] ?? 1);
  if (Math.abs(ms) >= 1000) return `${short(ms / 1000)} s`;
  if (ms === 0) return `0 ${{ us: 'µs', s: 's' }[unit] ?? 'ms'}`;
  if (Math.abs(ms) >= 1) return `${short(ms)} ms`;
  return `${short(ms * 1000)} µs`;
}

/**
 * The simulated clock as text for a model whose time counts `unit`. Milliseconds
 * and seconds show seconds, as the default clock does; microseconds show µs, then
 * ms with one decimal, then seconds.
 */
export function clockText(now, unit = 'ms') {
  const ms = now * (TIME_UNITS[unit] ?? 1);
  if (unit === 'us' && ms < 1) return `${Math.round(ms * 1000)} µs`;
  if (unit === 'us' && ms < 1000) return `${ms.toFixed(ms < 10 ? 2 : 1)} ms`;
  const seconds = ms / 1000;
  return `${seconds < 100 ? seconds.toFixed(1) : Math.round(seconds)} s`;
}
