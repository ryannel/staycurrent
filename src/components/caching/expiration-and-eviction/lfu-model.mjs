// Figure 7: Redis's LFU counter. A new key starts at 5. Each access raises a
// counter c by one with probability 1 / ((c − 5) × factor + 1), so climbing
// from c to c + 1 takes (c − 5) × factor + 1 accesses on average, and
// reaching c from 5 takes the sum: (c − 5) + factor × (c − 5)(c − 6) / 2.

export const LFU_INIT = 5;

/** Expected accesses for a new key's counter to reach `counter`. */
export const expectedAccesses = (counter, factor) => {
  const d = Math.max(0, counter - LFU_INIT);
  return d + (factor * d * (d - 1)) / 2;
};

/** The expected counter after `accesses` accesses (inverse of expectedAccesses), capped at 255. */
export function expectedCounter(accesses, factor) {
  if (factor === 0) return Math.min(255, LFU_INIT + accesses);
  // Solve (F/2) d² + (1 − F/2) d − n = 0 for d.
  const a = factor / 2, b = 1 - factor / 2, c = -accesses;
  const d = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
  return Math.min(255, LFU_INIT + Math.max(0, d));
}

/** Points for a chart with a log10 x axis from 0 (one access) to `maxPower`. */
export function counterCurve(factor, maxPower = 7, step = 0.05) {
  const points = [];
  for (let p = 0; p <= maxPower + 1e-9; p += step) points.push([Number(p.toFixed(2)), expectedCounter(10 ** p, factor)]);
  return points;
}

/**
 * Measured on Redis 8.10.3 (evidence file, X9a): OBJECT FREQ of one key after
 * about N accesses (INCR through redis-benchmark), one run per cell, so each
 * value carries the counter's randomness. Keys are log10(N).
 */
export const MEASURED = {
  1: [[2, 18], [3, 52], [4, 145], [5, 255], [6, 255]],
  10: [[2, 10], [3, 22], [4, 44], [5, 147], [6, 255]],
  100: [[2, 9], [3, 9], [4, 20], [5, 53], [6, 146]],
};
