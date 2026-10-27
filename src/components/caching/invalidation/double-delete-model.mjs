// When does a racing fill store its old value, measured from the writer's
// first delete? Pure; no DOM. Used by figure 4, "Deleting again after a delay".
//
// Fill time (from the database read to the SET in Redis) is log-normal with a
// median of 20 ms, and one fill in fifty is held up for between 0.2 and 6 s,
// spread evenly on a logarithmic scale (a garbage-collection pause, a retried
// query, a slow network). Illustrative, not measured.
//
// Reads from the primary: a fill races a write only if it is in progress when
// the write commits. Long fills are more likely to be caught in progress (in
// proportion to their length), and the write lands at a uniformly random point
// inside the fill, so the old value arrives (1 - u) × fill time after the commit.
// The delete lands 1 ms after the commit.
//
// Reads from a replica `lag` ms behind: after the delete, the next read misses
// (reads arrive about twice a second) and reads the replica. If it reads before
// the replica has the write, it gets the old value and stores it one fill time
// later. Only the first miss after a delete is counted.
import { seededRandom, logNormal, exponentialGap } from '../shared/sim.mjs';

export const FILL = { median: 20, spread: 0.8, pauseShare: 0.02, pauseMin: 200, pauseMax: 6000 };

export function fillTime(random) {
  if (random() < FILL.pauseShare) return FILL.pauseMin * Math.pow(FILL.pauseMax / FILL.pauseMin, random());
  return logNormal(random, FILL.median, FILL.spread);
}

/** Times (ms after the first delete) at which racing fills store an old value. */
export function racingSetTimes({ source = 'primary', lag = 500, readsPerSecond = 2, count = 4000 } = {}, seed = 5) {
  const random = seededRandom(seed);
  const out = [];
  if (source === 'primary') {
    // Length-biased sample of fill times, by rejection against the longest possible fill.
    const maxFill = FILL.pauseMax;
    while (out.length < count) {
      const d = Math.min(fillTime(random), maxFill);
      if (random() * maxFill > d) continue;
      const after = (1 - random()) * d - 1;
      if (after > 0) out.push(after);
    }
  } else {
    while (out.length < count) {
      const s = exponentialGap(random, readsPerSecond);
      if (s >= lag) continue;            // the replica had caught up: no race
      out.push(s + fillTime(random));
    }
  }
  return out;
}

/** Share of racing fills a second delete `delay` ms after the first one removes. */
export function caughtShare(times, delay) {
  if (!times.length) return 0;
  let caught = 0;
  for (const t of times) if (t < delay) caught++;
  return caught / times.length;
}

/** For a replica `lag` ms behind and reads at `readsPerSecond`: share of writes followed by a stale fill. */
export const replicaRaceShare = (lag, readsPerSecond) => 1 - Math.exp(-(readsPerSecond * lag) / 1000);
