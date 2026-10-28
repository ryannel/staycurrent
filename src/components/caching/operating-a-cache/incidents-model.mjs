// Figure 4: derives what an operator would chart from INFO's raw counters,
// using the measured recordings in incidents-data.mjs.

import { FROM, INCIDENT, RECORDINGS } from './incidents-data.mjs';

export { INCIDENT };
export const WINDOW = 10; // seconds in the windowed hit ratio
export const START = FROM + WINDOW; // first second the charts show

/** Every chart series for one recording, as [time, value] pairs from START. */
export function series(name) {
  const r = RECORDINGS[name];
  const out = { recent: [], sinceStart: [], misses: [], evictions: [], expirations: [], keys: [] };
  for (let i = WINDOW; i < r.hits.length; i++) {
    const t = FROM + i;
    const hits = r.hits[i] - r.hits[i - WINDOW], misses = r.misses[i] - r.misses[i - WINDOW];
    out.recent.push([t, hits / (hits + misses)]);
    out.sinceStart.push([t, r.hits[i] / (r.hits[i] + r.misses[i])]);
    // Rates are averaged over the same window, as a monitoring system's rate() would.
    out.misses.push([t, misses / WINDOW]);
    out.evictions.push([t, (r.evicted[i] - r.evicted[i - WINDOW]) / WINDOW]);
    out.expirations.push([t, (r.expired[i] - r.expired[i - WINDOW]) / WINDOW]);
    out.keys.push([t, r.keys[i]]);
  }
  return out;
}

/** Value of a series at time t (exact second). */
export const at = (points, t) => points.find(p => p[0] === t)?.[1];

/** Mean of a series over [t0, t1]. */
export function mean(points, t0, t1) {
  const sel = points.filter(p => p[0] >= t0 && p[0] <= t1);
  return sel.reduce((s, p) => s + p[1], 0) / sel.length;
}
