// Figure 4: keys filled at the same moment with the same TTL expire at the
// same moment. Each of `keys` keys is filled at time 0 with a TTL drawn
// uniformly from ttl × (1 ± jitter), and refilled the moment it expires (as a
// popular key would be) with a fresh random TTL. Returns refreshes a second in
// bins of `bin` seconds up to `horizon` seconds.
import { seededRandom } from '../shared/sim.mjs';

export function refreshRates({ keys = 10000, ttl = 600, jitter = 0.1, horizon = 2500, bin = 10 }, seed = 1) {
  const random = seededRandom(seed);
  const counts = new Array(Math.ceil(horizon / bin)).fill(0);
  for (let k = 0; k < keys; k++) {
    let t = 0;
    for (;;) {
      t += ttl * (1 + jitter * (2 * random() - 1));
      if (t >= horizon) break;
      counts[Math.floor(t / bin)]++;
    }
  }
  return counts.map((c, i) => ({ t: i * bin, rate: c / bin }));
}

/** The highest refresh rate between `from` and `to` seconds. */
export const peakBetween = (rates, from, to) => Math.max(0, ...rates.filter(r => r.t >= from && r.t < to).map(r => r.rate));

/** Spread of the first expiry: 2 × jitter × ttl seconds, so the rate during it is keys / (2 × jitter × ttl). */
export const firstWaveRate = (keys, ttl, jitter) => (jitter > 0 ? keys / (2 * jitter * ttl) : Infinity);
