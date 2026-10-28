// Figures 1 and 2 of "Designing a cache": the shop's popularity curve and its
// database budget. Pure arithmetic.
//
// Product reads arrive at random (Poisson) and pick a product with Zipf-like
// popularity. Each product has two cache entries, read together by one MGET:
// its details (about 1.8 KB of JSON) and its stock level (a small integer). A key
// read at r reads a second, filled on a miss and kept for a TTL of T seconds,
// hits a share rT / (1 + rT) of its reads and is present that share of the time
// (article 4's derivation). Both families share one Redis with one maxmemory and
// allkeys-lru. An LRU cache keeps a key while it is read at least once every
// `a` seconds, the characteristic time, so the key hits a share 1 − e^(−ra)
// (Che's approximation); `a` is the same for every key in one LRU, and is chosen
// so that the bytes of the keys present fill maxmemory. Each key gets the smaller
// of its TTL share and its LRU share. Checked against a simulation of an LRU
// cache with TTLs (tests) and the LRU part against Redis 8.10.3 (evidence E2).
//
// All traffic and catalogue numbers are illustrative. Bytes per entry are
// measured on Redis 8.10.3 (macOS, libc malloc; evidence E1). The model gives
// all of maxmemory to entries.

export const SHOP = {
  products: 2_000_000,
  skew: 0.9,
  reads: 1000,            // product page views a second at peak; each reads details and stock
  bytesPerProduct: 2131,  // measured: 1.8 KB JSON value, key and TTL
  bytesPerStock: 98,      // measured: small integer value, key and TTL
  sales: 20,              // orders a second; each changes one product's stock
  edits: 1,               // price or description edits a second, spread over the catalogue
  checkoutQueries: 3,     // per order: read price, read stock, write the order
  checkoutReads: 2,       // of which reads that a cache could answer
  capacity: 300,          // database queries a second before latency climbs
  alert: 0.7,             // page when the database's load passes this share of capacity
  stockTtlOnly: 5,        // seconds: the most a stock level shown on a page may lag
  priceTarget: 60,        // seconds: the most a price shown on a page may lag
};

export const GB = 1024 ** 3;

// Ranks grouped into buckets of nearly equal popularity (1% wide), so a sum over
// two million products takes a few thousand terms. The first 200 ranks are exact.
// Each bucket records its first rank and its share of reads per product.
const cache = new Map();
export function buckets(n = SHOP.products, s = SHOP.skew) {
  const id = `${n}:${s}`;
  if (cache.has(id)) return cache.get(id);
  let harmonic = 0;
  for (let i = 1; i <= n; i++) harmonic += 1 / Math.pow(i, s);
  const list = [];
  let start = 1;
  while (start <= n) {
    const end = Math.min(n, start < 200 ? start : Math.max(start, Math.floor(start * 1.01)));
    let weight = 0;
    for (let i = start; i <= end; i++) weight += 1 / Math.pow(i, s);
    const count = end - start + 1;
    list.push({ start, count, share: weight / harmonic / count });
    start = end + 1;
  }
  cache.set(id, list);
  return list;
}

/** Share of a key's reads that hit, and of time it is present, under a TTL alone. */
export const ttlShare = (rate, ttl) => (ttl === Infinity ? 1 : (rate * ttl) / (1 + rate * ttl));
/** The same under LRU eviction alone, with characteristic time a (Che). */
export const lruShare = (rate, a) => (a === Infinity ? 1 : 1 - Math.exp(-rate * a));

/**
 * One LRU cache holding several key families over the same catalogue. Each
 * family: { ttl, bytes } (bytes 1 when counting keys). `room` is the cache's size
 * in the same unit (Infinity for no limit). Returns, per family, { hit, keys },
 * plus the characteristic time `a` and which cap binds: 'ttl' or 'memory'.
 */
export function lru({ families, room = Infinity, reads = SHOP.reads, n = SHOP.products, s = SHOP.skew }) {
  const list = buckets(n, s);
  const sums = a => {
    let used = 0;
    const out = families.map(() => ({ hit: 0, keys: 0 }));
    for (const b of list) {
      const rate = reads * b.share;
      const l = lruShare(rate, a);
      families.forEach((f, i) => {
        const p = Math.min(ttlShare(rate, f.ttl), l);
        out[i].keys += b.count * p; out[i].hit += b.count * b.share * p;
        used += b.count * p * f.bytes;
      });
    }
    return { out, used };
  };
  const free = sums(Infinity);
  if (free.used <= room) return { families: free.out, used: free.used, a: Infinity, limit: 'ttl' };
  let lo = 0, hi = 1e12;
  for (let k = 0; k < 90; k++) { const mid = (lo + hi) / 2; if (sums(mid).used < room) lo = mid; else hi = mid; }
  const r = sums(lo);
  return { families: r.out, used: r.used, a: lo, limit: 'memory' };
}

/** Hit ratio of one key family with room for `capacity` keys: { hit, keys, limit }. */
export function family({ reads = SHOP.reads, ttl, capacity = Infinity, n = SHOP.products, s = SHOP.skew }) {
  const r = lru({ families: [{ ttl, bytes: 1 }], room: capacity, reads, n, s });
  return { ...r.families[0], limit: r.limit, a: r.a };
}

/** Stock misses caused by deleting a product's stock key on each sale. Sales follow popularity. */
export function saleMisses({ reads = SHOP.reads, sales = SHOP.sales, s = SHOP.skew } = {}) {
  let misses = 0;
  for (const b of buckets(SHOP.products, s)) {
    const rate = reads * b.share, sold = sales * b.share;
    misses += b.count * sold * (rate / (rate + sold));   // the next event after a sale is a read
  }
  return misses;
}

/** The popularity curve: reads a second of the product at `rank` (1 is the most popular). */
export function rateAt(rank, { reads = SHOP.reads, s = SHOP.skew } = {}) {
  return reads * buckets(SHOP.products, s)[0].share * Math.pow(rank, -s);
}

/** The rank of the least popular product read at least `rate` times a second. */
export function rankAt(rate, { reads = SHOP.reads, s = SHOP.skew } = {}) {
  return Math.min(SHOP.products, Math.floor(Math.pow(reads * buckets(SHOP.products, s)[0].share / rate, 1 / s)));
}

/**
 * What a TTL alone does to the whole catalogue, with unlimited memory:
 * the hit ratio, how many products are read at least once per TTL ("above the
 * line"), and the share of reads that go to the rest.
 */
export function ttlCurve(ttl, { reads = SHOP.reads, s = SHOP.skew } = {}) {
  const above = rankAt(1 / ttl, { reads, s });
  let hit = 0, belowReads = 0;
  for (const b of buckets(SHOP.products, s)) {
    hit += b.count * b.share * ttlShare(reads * b.share, ttl);
    // Reads of the products ranked below `above`, splitting the bucket that straddles it.
    const from = Math.max(b.start, above + 1), to = b.start + b.count - 1;
    if (to >= from) belowReads += (to - from + 1) * b.share;
  }
  return { hit, above, belowReads };
}

/**
 * The whole budget for a set of decisions:
 *   fresh:     'ttl' (copies expire, nothing deletes them) or 'delete' (deleted on change, TTL as a backstop)
 *   ttl:       the product TTL in seconds (also the stock TTL under 'delete')
 *   maxmemory: gigabytes for the one Redis holding product details and stock levels
 *   checkout:  'database' or 'cache' (where checkout reads the price and stock)
 *   skew:      the popularity exponent
 *   traffic:   a multiple of the peak's product page views and orders
 */
export function budget({ fresh = 'delete', ttl = 86400, maxmemory = 4, checkout = 'database', skew = SHOP.skew, traffic = 1 } = {}, shop = SHOP) {
  const reads = shop.reads * traffic, sales = shop.sales * traffic;
  const stockTtl = fresh === 'ttl' ? shop.stockTtlOnly : ttl;
  const cacheState = lru({
    families: [{ ttl, bytes: shop.bytesPerProduct }, { ttl: stockTtl, bytes: shop.bytesPerStock }],
    room: maxmemory * GB, reads, s: skew,
  });
  const [product, stock] = cacheState.families;
  const productMisses = reads * (1 - product.hit) + (fresh === 'delete' ? shop.edits * Math.min(1, product.keys / shop.products) : 0);
  const stockMisses = reads * (1 - stock.hit) + (fresh === 'delete' ? saleMisses({ reads, sales, s: skew }) : 0);
  const checkoutQueries = sales * (checkout === 'database' ? shop.checkoutQueries : shop.checkoutQueries - shop.checkoutReads);
  const total = productMisses + stockMisses + checkoutQueries;
  // The hit ratio the budget demands at this traffic: page-read misses may use
  // whatever the alert line leaves after checkout's own queries.
  const alertLine = shop.capacity * shop.alert;
  const need = 1 - (alertLine - checkoutQueries) / (2 * reads);
  const priceLag = fresh === 'ttl' ? ttl : null;   // null: about a second, unless a delete is lost
  return {
    reads, sales, product, stock, limit: cacheState.limit, a: cacheState.a,
    rows: { product: productMisses, stock: stockMisses, checkout: checkoutQueries },
    total, load: total / shop.capacity,
    hit: 1 - (productMisses + stockMisses) / (2 * reads),   // of all page reads of Redis, details and stock
    need, overAlert: total > alertLine, overCapacity: total > shop.capacity,
    memoryBytes: cacheState.used,
    priceLag, stockLag: fresh === 'ttl' ? stockTtl : null,
    chargedLag: checkout === 'database' ? 0 : priceLag,
  };
}
