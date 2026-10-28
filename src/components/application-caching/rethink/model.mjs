// A paced illustration, not a latency benchmark or a running Redis client.
export const starts = [0.7, 5.6, 9.6, 13.6, 17.6];
export const duration = 22000;
export const clamp = x => Math.max(0, Math.min(1, x));
export const progress = (t, a, b) => clamp((t - a) / (b - a));
export function stateAt(seconds, cached) {
  const index = starts.findLastIndex(start => seconds >= start);
  const age = index < 0 ? -1 : seconds - starts[index];
  const hit = cached && index > 0;
  const finish = hit ? 1.65 : cached ? 3.75 : 3.4;
  const reads = starts.filter((start, i) => (!cached || i === 0) && seconds >= start + 1.5).length;
  const builds = starts.filter((start, i) => (!cached || i === 0) && seconds >= start + 2.65).length;
  const answers = starts.filter((start, i) => seconds >= start + (cached ? i === 0 ? 3.75 : 1.65 : 3.4)).length;
  return { index, age, hit, finish, reads, builds, answers, saved: cached && seconds >= starts[0] + 3.1 };
}
