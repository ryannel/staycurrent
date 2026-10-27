// Figure 2: what the database sees during one stampede, when the application
// reaches it through a pool of a fixed number of connections. Pure.
//
// The key expires at time 0. Requests for it arrive evenly at `rate` a second;
// each one misses until the first query's result is stored, `rebuild` ms after
// the first miss, so rate × rebuild requests miss. Every miss queues for a
// connection in arrival order and then holds it for `rebuild` ms. One unrelated
// query (another page) arrives at `otherAt` ms and queues the same way.
// Queries do not slow each other down once they hold a connection, and nothing
// times out or retries: both would make it worse. Illustrative.

export const DEFAULTS = { rate: 500, rebuild: 200, connections: 20, otherAt: 100 };

export function poolStampede(params = {}) {
  const p = { ...DEFAULTS, ...params };
  const misses = Math.ceil((p.rate * p.rebuild) / 1000);
  const arrivals = Array.from({ length: misses }, (_, i) => ({ at: (i * 1000) / p.rate, other: false }));
  arrivals.push({ at: p.otherAt, other: true });
  arrivals.sort((a, b) => a.at - b.at || (a.other ? 1 : -1));
  // Connections as the times they next become free.
  const free = new Array(p.connections).fill(0);
  const jobs = arrivals.map(job => {
    let best = 0;
    for (let i = 1; i < free.length; i++) if (free[i] < free[best]) best = i;
    const start = Math.max(job.at, free[best]);
    free[best] = start + p.rebuild;
    return { ...job, start, end: start + p.rebuild };
  });
  const stampede = jobs.filter(j => !j.other);
  const other = jobs.find(j => j.other);
  const busyUntil = Math.max(...stampede.map(j => j.end));
  return {
    params: p,
    misses,
    jobs,
    firstStored: stampede[0].end,
    busyUntil,
    otherWait: other.start - other.at,
    duplicates: misses - 1,
    /** Connections in use and queries waiting for one, at time t (ms). */
    at(t) {
      let busy = 0, waiting = 0;
      for (const j of jobs) {
        if (j.at <= t && t < j.start) waiting++;
        else if (j.start <= t && t < j.end) busy++;
      }
      return { busy, waiting };
    },
  };
}

/** Points for the chart: [t, busy] and [t, waiting] every `step` ms up to `until`. */
export function poolSeries(result, until, step = 5) {
  const busy = [], waiting = [];
  for (let t = 0; t <= until; t += step) {
    const s = result.at(t);
    busy.push([t, s.busy]); waiting.push([t, s.waiting]);
  }
  return { busy, waiting };
}
