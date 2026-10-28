// The shop's own recovery times, at its full size, for "Designing a cache".
// Figure 3 runs the shop at 1/100 of its catalogue so it fits in a browser, and a
// cache refills in proportion to the keys it must fill, so its times are about a
// hundredth of these. This model computes the shop's.
//
// A fluid model: each popularity bucket holds a share x of its keys. Product pages
// arrive at `reads` a second over 2,000,000 products (Zipf-like, exponent 0.9).
// A page whose keys are missing needs `queries` database queries (2 after an
// empty restart: details and stock; 1 after a new product key version). The
// limit admits page misses up to `room` queries a second (300 of capacity less
// checkout's 60) and refuses the rest at once; each admitted miss fills its
// keys. Filling stops when the cache holds `keys` products (what 4 GB and a
// 24-hour TTL hold at peak). A key version change can also be ramped: a growing share of reads uses the new keys,
// and reads of the old ones hit at the steady ratio. Left out: expiry, deletes,
// and the 6 or 10 seconds Redis is unavailable before it refills.
import { buckets, SHOP } from './budget-model.mjs';

export function refill({ reads = SHOP.reads, queries = 2, room = 240, keys = 1_831_000, ramp = 0, steadyHit = 0.979, dt = 1, until = 8 * 3600, marks = [10, 60, 600, 3600] } = {}) {
  const list = buckets().map(b => ({ count: b.count, rate: reads * b.share, x: 0 }));
  let t = 0, refused = 0, lastRefused = null, peak = 0;
  const at = {};
  while (t < until) {
    const share = ramp > 0 ? Math.min(1, 0.05 + 0.95 * t / ramp) : 1;
    let missing = 0, held = 0;
    for (const b of list) { missing += b.count * b.rate * (1 - b.x); held += b.count * b.x; }
    const pageMisses = missing * share + reads * (1 - share) * (1 - steadyHit);
    const demand = pageMisses * queries;
    peak = Math.max(peak, demand);
    const admitted = Math.min(1, room / demand);
    if (admitted < 1) { refused += pageMisses * (1 - admitted) * dt; lastRefused = t + dt; }
    for (const m of marks) if (at[m] === undefined && t + dt >= m) at[m] = pageMisses * (1 - admitted) / reads;
    if (held < keys) for (const b of list) b.x = Math.min(1, b.x + b.rate * share * admitted * (1 - b.x) * dt);
    t += dt;
  }
  return { refusedUntil: lastRefused, refusedPages: refused, peakDemand: peak, refusedShareAt: at };
}

/** How many of the most popular products carry `share` of all reads. */
export function topFor(share, s = SHOP.skew) {
  let sum = 0, count = 0;
  for (const b of buckets(SHOP.products, s)) {
    if (sum + b.count * b.share >= share) return count + Math.ceil((share - sum) / b.share);
    sum += b.count * b.share; count += b.count;
  }
  return count;
}
