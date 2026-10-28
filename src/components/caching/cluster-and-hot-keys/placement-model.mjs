// Figure 1: what adding a server does to a cache under three ways of placing keys.
// Pure; tested in node. Illustrative model: uniform keys product:0 … product:K-1.
import { crc16, keySlot, SLOTS } from './slots.mjs';

const encoder = new TextEncoder();

/** FNV-1a, 32 bits. On its own it spreads near-identical short strings poorly. */
export function fnv1a(text) {
  let h = 0x811c9dc5;
  for (const b of encoder.encode(text)) { h ^= b; h = Math.imul(h, 0x01000193) >>> 0; }
  return h >>> 0;
}

/** murmur3's 32-bit finaliser (fmix32): mixes every input bit into every output bit. */
export function fmix32(h) {
  h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

/** Position on the ring: FNV-1a followed by fmix32, so similar names land far apart. */
export const ringHash = text => fmix32(fnv1a(text));

/** Client-side sharding by hash modulo the number of servers. */
export const modOwner = (key, servers) => crc16(encoder.encode(key)) % servers;

/** A consistent-hashing ring with `points` positions per server (Karger et al. 1997). */
export function ring(servers, points = 160) {
  const marks = [];
  for (let s = 0; s < servers; s++) for (let v = 0; v < points; v++) marks.push([ringHash(`server-${s}#${v}`), s]);
  marks.sort((a, b) => a[0] - b[0]);
  const pos = marks.map(m => m[0]);
  return key => {
    const h = ringHash(key);
    let lo = 0, hi = pos.length;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (pos[mid] < h) lo = mid + 1; else hi = mid; }
    return marks[lo % marks.length][1];
  };
}

/**
 * Slot ranges for `servers` nodes, then the ranges after a new node takes an even
 * share from the start of each existing node's range (as redis-cli reshard --cluster-from all does).
 */
export function slotOwners(servers) {
  const before = new Int16Array(SLOTS);
  const per = SLOTS / servers;
  for (let s = 0; s < SLOTS; s++) before[s] = Math.min(servers - 1, Math.floor(s / per));
  const after = before.slice();
  const take = Math.floor(SLOTS / (servers + 1));
  for (let n = 0; n < servers; n++) {
    const share = Math.floor(take / servers) + (n < take % servers ? 1 : 0);
    let given = 0;
    for (let s = 0; s < SLOTS && given < share; s++) if (before[s] === n) { after[s] = servers; given++; }
  }
  return { before, after };
}

export const SCHEMES = ['mod', 'ring', 'slots'];

/**
 * Place `count` keys on `servers` servers, then on servers + 1.
 * Returns { moved, lost, cells, shares } where moved is the share of keys whose server changed,
 * lost the share that now miss (the data stayed behind), cells the first `show` keys, and
 * shares each server's share of the keys after the new one joins.
 */
export function addServer(scheme, servers, { count = 20000, show = 96 } = {}) {
  let ownerBefore, ownerAfter;
  if (scheme === 'mod') {
    ownerBefore = k => modOwner(k, servers);
    ownerAfter = k => modOwner(k, servers + 1);
  } else if (scheme === 'ring') {
    ownerBefore = ring(servers);
    ownerAfter = ring(servers + 1);
  } else {
    const { before, after } = slotOwners(servers);
    ownerBefore = k => before[keySlot(k)];
    ownerAfter = k => after[keySlot(k)];
  }
  let moved = 0;
  const cells = [];
  const after = new Array(servers + 1).fill(0);
  for (let i = 0; i < count; i++) {
    const key = `product:${i}`;
    const a = ownerBefore(key), b = ownerAfter(key);
    after[b]++;
    if (a !== b) moved++;
    if (i < show) cells.push({ key, before: a, after: b, moved: a !== b });
  }
  const share = moved / count;
  return { moved: share, lost: scheme === 'slots' ? 0 : share, cells, shares: after.map(c => c / count) };
}

export const serverName = i => String.fromCharCode(65 + i);
