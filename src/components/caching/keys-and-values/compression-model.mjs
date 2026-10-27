// Figure 5: is compression worth it on a read? Measured sizes and times for real
// JSON compressed with zstd level 3 (Python 3.14.5 on an Apple arm64 laptop; see
// docs/article-work/caching-2026-10-27/evidence/keys-and-values.txt). The
// network part is a model: transfer time = bytes × 8 / link speed, ignoring the
// round trip, which both cases pay equally. Pure.

/** Measured: prose-heavy JSON (TypeScript's German diagnostic messages, sliced), zstd level 3. */
export const MEASURED = [
  { bytes: 1149, compressed: 583, compressUs: 5.5, decompressUs: 3.0, parseUs: 2.8 },
  { bytes: 4232, compressed: 1665, compressUs: 13.7, decompressUs: 6.0, parseUs: 7.8 },
  { bytes: 16546, compressed: 5327, compressUs: 39.7, decompressUs: 14.7, parseUs: 28.3 },
  { bytes: 65540, compressed: 18421, compressUs: 112.9, decompressUs: 47.4, parseUs: 162.3 },
  { bytes: 262221, compressed: 68241, compressUs: 558.0, decompressUs: 175.2, parseUs: 686.5 },
];

export const LINKS = { '1': 1e9, '10': 10e9 };

/** Microseconds to move `bytes` over a link of `bitsPerSecond`. */
export const transferUs = (bytes, bitsPerSecond) => (bytes * 8 * 1e6) / bitsPerSecond;

/** Per-read cost with and without compression for measured point `index` on link `link` ('1' or '10' Gbit/s). */
export function readCost(index, link) {
  const m = MEASURED[index];
  const speed = LINKS[link];
  const plain = transferUs(m.bytes, speed);
  const packedTransfer = transferUs(m.compressed, speed);
  const packed = packedTransfer + m.decompressUs;
  return {
    ...m,
    plain,
    packedTransfer,
    packed,
    saving: plain - packed,
    ratio: m.compressed / m.bytes,
    /** Link share used by 1,000 reads a second, uncompressed and compressed. */
    linkShare: { plain: (m.bytes * 8 * 1000) / speed, packed: (m.compressed * 8 * 1000) / speed },
  };
}
