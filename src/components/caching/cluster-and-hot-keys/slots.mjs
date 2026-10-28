// Redis Cluster key placement: CRC16 (XMODEM), hash tags and slot ranges.
// Pure; tested in node against CLUSTER KEYSLOT output from a Redis 8.10.3 cluster.

export const SLOTS = 16384;

const TABLE = (() => {
  const t = new Uint16Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i << 8;
    for (let b = 0; b < 8; b++) c = c & 0x8000 ? ((c << 1) ^ 0x1021) & 0xffff : (c << 1) & 0xffff;
    t[i] = c;
  }
  return t;
})();

/** CRC16-CCITT (XMODEM): polynomial 0x1021, initial value 0, no reflection; the variant Redis uses. */
export function crc16(bytes) {
  let crc = 0;
  for (const b of bytes) crc = ((crc << 8) ^ TABLE[((crc >> 8) ^ b) & 0xff]) & 0xffff;
  return crc;
}

const encoder = new TextEncoder();

/**
 * The part of a key that Redis hashes, as character offsets [start, end).
 * If the key has a '{' with a '}' somewhere after it and at least one character
 * between the first '{' and the first '}' after it, only those characters count.
 */
export function hashedPart(key) {
  const open = key.indexOf('{');
  if (open !== -1) {
    const close = key.indexOf('}', open + 1);
    if (close !== -1 && close !== open + 1) return { start: open + 1, end: close, tagged: true };
  }
  return { start: 0, end: key.length, tagged: false };
}

export function keySlot(key) {
  const { start, end } = hashedPart(key);
  return crc16(encoder.encode(key.slice(start, end))) % SLOTS;
}

/** Contiguous slot ranges for `count` primaries, split as redis-cli --cluster create does. */
export function evenRanges(count) {
  const per = SLOTS / count;
  const ranges = [];
  let first = 0;
  for (let i = 0; i < count; i++) {
    const last = i === count - 1 ? SLOTS - 1 : Math.round(per * (i + 1)) - 1;
    ranges.push([first, last]);
    first = last + 1;
  }
  return ranges;
}

/** Owner index of a slot, given ranges [[first, last], …] per node (each node may have several). */
export function ownerOf(slot, nodeRanges) {
  for (let n = 0; n < nodeRanges.length; n++) for (const [a, b] of nodeRanges[n]) if (slot >= a && slot <= b) return n;
  return -1;
}

/**
 * Words of a command line, as redis-cli would split them, dropping a leading
 * command name if it is a known multi-key command. Returns { command, keys }.
 */
export function parseKeys(text) {
  const words = String(text).trim().split(/\s+/).filter(Boolean);
  // Multi-key reads and deletes, plus GET so a single-key command typed in full also works.
  const commands = ['MGET', 'GET', 'DEL', 'UNLINK', 'EXISTS', 'TOUCH', 'WATCH', 'SUNION', 'SINTER'];
  if (words.length && commands.includes(words[0].toUpperCase())) return { command: words[0].toUpperCase(), keys: words.slice(1) };
  return { command: null, keys: words };
}

/** Summary of where a set of keys lives in a cluster with the given node ranges. */
export function placement(keys, nodeRanges) {
  const rows = keys.map(key => {
    const slot = keySlot(key);
    return { key, slot, node: ownerOf(slot, nodeRanges), ...hashedPart(key) };
  });
  const slots = new Set(rows.map(r => r.slot));
  const nodes = new Set(rows.map(r => r.node));
  return { rows, slots: slots.size, nodes: nodes.size };
}
