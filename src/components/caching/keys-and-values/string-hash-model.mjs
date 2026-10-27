// Figure: the same product stored as a JSON string and as a hash, and what each
// common operation sends over the network. The product, its JSON length (129
// bytes) and memory (194 and 155 bytes by MEMORY USAGE) were measured on Redis
// 8.10.3 (evidence/keys-and-values.txt, Part 2). Byte counts below are value
// bytes (names and values), not counting the protocol's framing. Pure.

export const FIELDS = [
  ['id', '42'],
  ['name', 'Trail running shoe'],
  ['price', '4900'],
  ['currency', 'GBP'],
  ['stock', '17'],
  ['brand', 'Fellside'],
  ['category', 'shoes'],
  ['rating', '4.6'],
];

const quote = v => (/^[0-9.]+$/.test(v) ? v : `"${v}"`);
/** The JSON string, one line per field, as stored. */
export const JSON_LINES = FIELDS.map(([k, v], i) => `${i === 0 ? '{' : ''}"${k}":${quote(v)}${i === FIELDS.length - 1 ? '}' : ','}`);
export const JSON_BYTES = JSON_LINES.join('').length;
/** HGETALL returns every name and value. */
export const HASH_BYTES = FIELDS.reduce((n, [k, v]) => n + k.length + v.length, 0);
export const MEMORY = { string: 194, hash: 155 };

const all = FIELDS.map(([k]) => k);

/**
 * For each operation, per layout: the fields that move, how (read or write),
 * the commands sent, value bytes moved, commands, and a one-line result.
 */
export const OPERATIONS = {
  page: {
    string: { fields: all, kind: 'hit', commands: ['GET product:42'], bytes: JSON_BYTES, count: 1, note: 'The whole value comes back and is parsed.' },
    hash: { fields: all, kind: 'hit', commands: ['HGETALL product:42'], bytes: HASH_BYTES, count: 1, note: 'Every field comes back with its name.' },
  },
  price: {
    string: { fields: all, kind: 'hit', commands: ['GET product:42'], bytes: JSON_BYTES, count: 1, note: 'All of it comes back and is parsed for one field.' },
    hash: { fields: ['price'], kind: 'hit', commands: ['HGET product:42 price'], bytes: '4900'.length, count: 1, note: 'Only the price comes back.' },
  },
  sell: {
    string: { fields: all, kind: 'write', commands: ['GET product:42', '… parse, stock 17 → 16 …', 'SET product:42 {…}'], bytes: JSON_BYTES * 2, count: 2, note: 'A second sale between GET and SET is overwritten.', warn: true },
    hash: { fields: ['stock'], kind: 'write', commands: ['HINCRBY product:42 stock -1'], bytes: '-1'.length + '16'.length, count: 1, note: 'Redis changes the field in place; two sales both count.' },
  },
  listing: {
    string: { fields: all, kind: 'hit', commands: ['MGET product:1 … product:12'], bytes: JSON_BYTES * 12, count: 1, note: 'One command returns twelve values.', times: 12 },
    hash: { fields: all, kind: 'hit', commands: ['HGETALL product:1', '… one for each product …', 'HGETALL product:12'], bytes: HASH_BYTES * 12, count: 12, note: 'Twelve commands, sent together in one round trip.', times: 12 },
  },
};
