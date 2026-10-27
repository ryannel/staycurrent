// Figure 8: why RSS stays high after deleting keys. An illustrative allocator:
// memory comes from the operating system in pages, each page holds `slots`
// equal-sized allocations, and a page can go back to the operating system only
// when every allocation on it is free. Keys were written in order, so they fill
// pages in order; deletions hit keys at random; new keys reuse free slots before
// new pages are taken. Pure: runs under node.
import { seededRandom } from '../shared/sim.mjs';

/**
 * params: deleted (0–1, share of the original keys deleted at random),
 * added (0–1, new keys as a share of the original count).
 * Returns { pages: [[state per slot]], used, resident, ratio } with slot states
 * 'live' (original key), 'new' (a key added later) or 'free'.
 */
export function pages({ deleted = 0, added = 0, pageCount = 24, slots = 16, seed = 5 } = {}) {
  const total = pageCount * slots;
  const random = seededRandom(seed);
  // A fixed random deletion order, so dragging the slider deletes more of the same keys.
  const order = Array.from({ length: total }, (_, i) => i);
  for (let i = total - 1; i > 0; i--) { const j = random.int(i + 1); [order[i], order[j]] = [order[j], order[i]]; }
  const state = new Array(total).fill('live');
  const removeCount = Math.round(deleted * total);
  for (let i = 0; i < removeCount; i++) state[order[i]] = 'free';
  // New keys take the first free slot, then extend into new pages.
  let toAdd = Math.round(added * total);
  for (let i = 0; i < total && toAdd > 0; i++) if (state[i] === 'free') { state[i] = 'new'; toAdd--; }
  const extra = [];
  while (toAdd > 0) { extra.push('new'); toAdd--; }
  while (extra.length % slots) extra.push('free');
  const all = state.concat(extra);
  const grid = [];
  for (let i = 0; i < all.length; i += slots) grid.push(all.slice(i, i + slots));
  const used = all.filter(s => s !== 'free').length;
  const residentPages = grid.filter(page => page.some(s => s !== 'free')).length;
  const resident = residentPages * slots;
  return { pages: grid, used, resident, residentPages, ratio: used ? resident / used : Infinity, slots };
}

/** Probability that a page of `slots` allocations is entirely free after deleting a share `d` at random. */
export const emptyPageChance = (d, slots = 16) => Math.pow(d, slots);
