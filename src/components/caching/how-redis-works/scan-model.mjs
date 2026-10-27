// Figure 3: a real-time replay of measured walks over a million keys, with KEYS *
// or with SCAN at different COUNT values. Every number comes from walks.mjs, which
// holds my measurements; nothing here is modelled except where each call's
// execution sits inside its round trip (see genwalks.py). Pure: runs under node.
import { WALKS, BEFORE_MS } from './walks.mjs';

export { BEFORE_MS };
export const KEY_COUNT = 1000000;
export const OPTIONS = ['keys', '10', '100', '1000', '10000', '100000'];
export const AFTER_MS = 500; // the replay runs on this long after the last reply
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/** The longest walk among the options, in ms: the chart's fixed time axis covers it. */
export const LONGEST_WALK = Math.max(...OPTIONS.map(o => WALKS[o].wall));

/**
 * replay(option) -> a model whose clock (`sim.now`, ms since the first call was
 * sent) starts BEFORE_MS before the walk and stops AFTER_MS after it, with:
 *   keysAt(t), callsAt(t)    keys received and calls completed by time t
 *   execUpTo(t)              ms of execution on the main thread by time t
 *   busy(from, to)           [{ start, end, share }] runs of equal execution share per ms
 *   slowPings(from, to)      [[t, round trip ms]] PINGs of 0.5 ms or more
 */
export function replay(option) {
  const w = WALKS[option];
  const end = w.wall + AFTER_MS;
  const shares = Array.from(w.busy, c => B64.indexOf(c) / 63);
  const prefix = [0];
  for (const s of shares) prefix.push(prefix[prefix.length - 1] + s);
  const pings = [];
  for (let i = 0; i < w.slow.length; i += 2) pings.push([w.slow[i], w.slow[i + 1]]);
  const step = (list, t) => (t < 0 ? 0 : list[Math.min(list.length - 1, Math.floor(t / 10))]);
  const sim = {
    now: -BEFORE_MS,
    advance(ms) { sim.now = Math.min(end, sim.now + ms); },
  };
  return {
    option, data: w, sim, end,
    get done() { return sim.now >= w.wall; },
    keysAt: t => (t >= w.wall ? KEY_COUNT : step(w.keysAt, t)),
    callsAt: t => (t >= w.wall ? w.calls : step(w.callsAt, t)),
    execUpTo(t) {
      if (t <= 0) return 0;
      const i = Math.min(shares.length, Math.floor(t));
      return prefix[i] + (i < shares.length ? shares[i] * (t - i) : 0);
    },
    busy(from, to) {
      const runs = [];
      for (let i = Math.max(0, Math.floor(from)); i < Math.min(shares.length, Math.ceil(to)); i++) {
        const s = shares[i];
        if (!s) continue;
        const last = runs[runs.length - 1];
        if (last && last.end === i && last.share === s) last.end = i + 1;
        else runs.push({ start: i, end: i + 1, share: s });
      }
      return runs.map(r => ({ ...r, end: Math.min(r.end, to) })).filter(r => r.end > r.start);
    },
    slowPings: (from, to) => pings.filter(([t]) => t >= from && t <= to),
  };
}
