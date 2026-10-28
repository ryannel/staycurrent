// Figure 5: from the memory a node has to the hit ratio it buys. Pure arithmetic.
//
// Memory per cached product is measured: 2,000-byte values under 14-byte keys,
// each with a TTL, grew used_memory by 2,130 bytes a key on Redis 8.10.3
// (macOS, libc malloc; evidence E5). The catalogue, its popularity skew and the
// traffic are illustrative. The hit ratio is an upper bound: that of a cache
// that always holds the most popular products (Zipf, exponent 0.9).

export const BYTES_PER_PRODUCT = 2130;
export const VALUE_BYTES = 2000;
export const CATALOGUE = 2_000_000;
export const SKEW = 0.9;
export const RATE = 1000;      // product reads a second
export const DB_CAPACITY = 300; // database queries a second
export const GB = 1024 ** 3;
/** Client buffers' share of the node, drawn small as it normally is. Illustrative. */
export const CLIENT_SHARE = 0.02;

/**
 * Reserve options: the share of the node's memory kept out of maxmemory, and an
 * illustrative split of that reserve by what it is for (shares of the node).
 * Client buffers are not here: they count against maxmemory (CLIENT_SHARE).
 */
export const RESERVES = {
  cache: { share: 0.15, label: 'no snapshots or replica', parts: { frag: 0.15, repl: 0, cow: 0 } },
  managed: { share: 0.25, label: 'ElastiCache default', parts: { frag: 0.10, repl: 0.05, cow: 0.10 } },
  fork: { share: 0.5, label: 'snapshots under heavy writes', parts: { frag: 0.10, repl: 0.05, cow: 0.35 } },
};

// Cumulative Zipf weights, computed once: prefix[k] = sum of 1/i^s for i ≤ k.
let prefix = null;
function weights() {
  if (prefix) return prefix;
  prefix = new Float64Array(CATALOGUE + 1);
  for (let i = 1; i <= CATALOGUE; i++) prefix[i] = prefix[i - 1] + 1 / Math.pow(i, SKEW);
  return prefix;
}

/** Share of reads for the `count` most popular products. */
export function topShare(count) {
  const w = weights();
  const c = Math.max(0, Math.min(CATALOGUE, Math.floor(count)));
  return w[c] / w[CATALOGUE];
}

/** Every step of the chain for a node with `gb` gigabytes and a reserve option. */
export function chain(gb, reserve = 'cache') {
  const ram = gb * GB;
  const share = RESERVES[reserve].share;
  const maxmemory = ram * (1 - share);
  // Client buffers come out of maxmemory, so the data gets what they leave.
  const clients = ram * CLIENT_SHARE;
  const dataBytes = maxmemory - clients;
  const products = Math.min(CATALOGUE, Math.floor(dataBytes / BYTES_PER_PRODUCT));
  const valueBytes = products * VALUE_BYTES;
  const hit = topShare(products);
  const dbReads = RATE * (1 - hit);
  return { ram, maxmemory, clients, dataBytes, products, valueBytes, catalogueShare: products / CATALOGUE, hit, dbReads, dbShare: dbReads / DB_CAPACITY };
}
