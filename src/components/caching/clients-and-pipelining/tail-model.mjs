// Pages that wait for k round trips each, when some round trips are slow. Pure.
// The round trips form one stream in time, cut into pages of k; a page is slow
// if any of its round trips is. Slow round trips are either independent (each
// slow with probability p) or come in bursts of `burst` consecutive round trips,
// started often enough that the long-run share of slow round trips is still p.
import { seededRandom } from '../shared/sim.mjs';

export const SLOW_SHARE = 0.01;
export const BURST = 8;

/** The chance a page of k independent round trips includes a slow one. */
export const predicted = (k, p = SLOW_SHARE) => 1 - (1 - p) ** k;

/**
 * wall({ k, pages, p, pattern: 'independent' | 'bursts', burst, seed })
 *   -> { rows: boolean[][], slowTrips, trips, slowPages }
 */
export function wall({ k, pages = 100, p = SLOW_SHARE, pattern = 'independent', burst = BURST, seed = 1 }) {
  const random = seededRandom(seed);
  const trips = k * pages;
  const stream = new Array(trips).fill(false);
  if (pattern === 'bursts') {
    // A burst starts with probability p / burst at each round trip, so that
    // slow round trips are still a share p of the whole stream on average.
    // Warm up so a burst can already be running when the first page starts.
    let left = 0;
    for (let i = -burst; i < trips; i++) {
      if (left === 0 && random() < p / burst) left = burst;
      if (left > 0) { if (i >= 0) stream[i] = true; left--; }
    }
  } else {
    for (let i = 0; i < trips; i++) stream[i] = random() < p;
  }
  const rows = [];
  for (let page = 0; page < pages; page++) rows.push(stream.slice(page * k, (page + 1) * k));
  return {
    rows,
    trips,
    slowTrips: stream.filter(Boolean).length,
    slowPages: rows.filter(row => row.some(Boolean)).length,
  };
}
