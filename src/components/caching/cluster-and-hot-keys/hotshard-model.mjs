// Figures 5 and 7: how Zipf-skewed reads load the shards of a cluster, and what
// each remedy for a hot key does to that load. Pure; tested in node.
// Illustrative model: keys product:0 … product:N-1, where product:k is the k-th most
// popular, placed by their real CRC16 hash slots on shards that own equal,
// contiguous slot ranges. Reads only; every number here comes from the model.
import { keySlot, SLOTS } from './slots.mjs';

export const KEYS = 100000;
export const RATE = 600000;       // reads a second offered to the whole cache (illustrative)
export const CAPACITY = 100000;   // reads a second one node can serve (illustrative; see article 7)
export const APP_SERVERS = 40;    // application processes, each with its own near cache
export const NEAR_TTL = 1;        // seconds a near cache keeps a copy
export const NEAR_KEYS = 1000;    // hottest keys a near cache holds
export const COPY_KEYS = 10;      // hottest keys split into copies
export const COPIES = 4;

let slotCache = null;
const slotsOf = () => (slotCache ??= Int16Array.from({ length: KEYS }, (_, k) => keySlot(`product:${k}`)));

const weightCache = new Map();
/** Zipf probabilities over KEYS keys for exponent s. */
export function zipfShares(s) {
  if (!weightCache.has(s)) {
    const w = new Float64Array(KEYS);
    let total = 0;
    for (let k = 0; k < KEYS; k++) { w[k] = 1 / Math.pow(k + 1, s); total += w[k]; }
    for (let k = 0; k < KEYS; k++) w[k] /= total;
    weightCache.set(s, w);
  }
  return weightCache.get(s);
}

const shardOf = (slot, shards) => Math.min(shards - 1, Math.floor(slot / (SLOTS / shards)));

export const REMEDIES = ['none', 'copies', 'replicas', 'near'];

/**
 * Reads a second arriving at each node, and (hotLoads) how many of them are for the
 * single hottest key.
 * remedy: 'none'; 'copies' (the COPY_KEYS hottest keys stored as COPIES keys each,
 * product:k:c, a read picks one at random); 'replicas' (every shard gets one replica
 * and reads are split evenly between primary and replica); 'near' (each of APP_SERVERS
 * processes keeps the NEAR_KEYS hottest keys for NEAR_TTL seconds, so Redis sees at most
 * APP_SERVERS / NEAR_TTL reads a second for each of them).
 */
export function nodeLoads({ shards = 12, s = 1, remedy = 'none', rate = RATE } = {}) {
  const p = zipfShares(s);
  const slots = slotsOf();
  const shard = new Float64Array(shards);
  const hot = new Float64Array(shards);   // reads of the single hottest key, product:0, on each shard
  let extraKeys = 0, redisReads = 0;
  for (let k = 0; k < KEYS; k++) {
    let reads = rate * p[k];
    if (remedy === 'near' && k < NEAR_KEYS) reads = Math.min(reads, APP_SERVERS / NEAR_TTL);
    redisReads += reads;
    if (remedy === 'copies' && k < COPY_KEYS) {
      for (let c = 0; c < COPIES; c++) {
        const at = shardOf(keySlot(`product:${k}:${c}`), shards);
        shard[at] += reads / COPIES;
        if (k === 0) hot[at] += reads / COPIES;
      }
      extraKeys += COPIES - 1;
    } else {
      shard[shardOf(slots[k], shards)] += reads;
      if (k === 0) hot[shardOf(slots[k], shards)] += reads;
    }
  }
  const perShard = Array.from(shard);
  const loads = remedy === 'replicas' ? perShard.flatMap(v => [v / 2, v / 2]) : perShard;
  const hotLoads = remedy === 'replicas' ? Array.from(hot).flatMap(v => [v / 2, v / 2]) : Array.from(hot);
  const labels = remedy === 'replicas'
    ? perShard.flatMap((_, i) => [`${i + 1}`, `${i + 1}r`])
    : perShard.map((_, i) => `${i + 1}`);
  const max = Math.max(...loads);
  const busiest = loads.indexOf(max);
  const mean = loads.reduce((a, b) => a + b, 0) / loads.length;
  // The most reads a second the cache could take, at this skew, before its busiest node is full.
  const ceiling = rate * (CAPACITY / max);
  return {
    loads, hotLoads, labels, nodes: loads.length, mean, max, busiest,
    ratio: max / mean, usable: mean / max, redisReads, extraKeys,
    ceiling, overloaded: loads.filter(v => v > CAPACITY).length,
    topKeyReads: rate * p[0],
  };
}
