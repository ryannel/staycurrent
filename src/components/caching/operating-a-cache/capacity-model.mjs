// Figure 1: whether a database survives without its cache. Pure arithmetic.
// A database that can answer C queries a second sees R(1 − h) with a warm
// cache and R with an empty one, so it copes with any traffic up to C warm or
// cold, and up to C / (1 − h) only while the cache is warm.

export const CAPACITY = 300;   // database queries a second (illustrative)
export const TODAY = 1000;     // product reads a second today (illustrative)
export const X_MAX = 6000;

/** The three ranges of read traffic for hit ratio h. */
export function zones(h, capacity = CAPACITY) {
  const warmLimit = capacity / (1 - h);
  return { stable: capacity, vulnerable: warmLimit };
}

/** Which range traffic R falls in. */
export function classify(rate, h, capacity = CAPACITY) {
  const { stable, vulnerable } = zones(h, capacity);
  return rate <= stable ? 'stable' : rate <= vulnerable ? 'vulnerable' : 'overloaded';
}

/** Database load lines for the chart: warm and empty, sampled across the x range. */
export function loadLines(h, xMax = X_MAX) {
  const xs = [0, xMax];
  return { warm: xs.map(x => [x, x * (1 - h)]), cold: xs.map(x => [x, x]) };
}

/** Multiplier on database load when the cache empties: 1 / (1 − h). */
export const amplification = h => 1 / (1 - h);
