// Invented event traces, not a cache server or a throughput benchmark.
export function burstTrace({ shared = false, duration = 100 } = {}) {
  const callers = ['A', 'B', 'C', 'D'].map((id, i) => ({ id, at: i * 20, state: 'Not arrived', loader: null }));
  const loaders = [];
  const snapshots = [];
  let cached = false;
  const save = (time, explanation) => snapshots.push({
    time, explanation, callers: callers.map(c => ({ ...c })),
    loaders: loaders.map(l => ({ ...l })), cached,
    started: loaders.length, active: loaders.filter(l => !l.done).length,
    waiting: callers.filter(c => c.state === 'Waiting').length,
    answered: callers.filter(c => c.state === 'Source answer' || c.state === 'Cache hit').length,
  });
  save(0, 'P7 has just expired. Four callers will arrive, 20 ms apart. No replacement read has started.');
  const arrivals = [...callers];
  while (arrivals.length || loaders.some(l => !l.done)) {
    const arrivalTime = arrivals[0]?.at ?? Infinity;
    const completionTime = Math.min(...loaders.filter(l => !l.done).map(l => l.end), Infinity);
    // A completion at the same time as an arrival is processed first.
    if (completionTime <= arrivalTime) {
      const loader = loaders.find(l => !l.done && l.end === completionTime);
      loader.done = true;
      cached = true;
      const recipients = callers.filter(c => c.loader === loader.id);
      recipients.forEach(c => { c.state = 'Source answer'; });
      save(completionTime, `${loader.id} finishes and saves P7. Caller${recipients.length > 1 ? 's' : ''} ${recipients.map(c => c.id).join(', ')} receive the result. Other source reads already started keep running.`);
    } else {
      const caller = arrivals.shift();
      if (cached) {
        caller.state = 'Cache hit';
        save(caller.at, `Caller ${caller.id} finds the completed fill and receives a cache hit. No source read starts.`);
      } else {
        let loader = shared ? loaders.find(l => !l.done) : undefined;
        const joined = Boolean(loader);
        if (!loader) {
          loader = { id: `L${loaders.length + 1}`, start: caller.at, end: caller.at + duration, done: false };
          loaders.push(loader);
        }
        caller.loader = loader.id;
        caller.state = 'Waiting';
        save(caller.at, joined
          ? `Caller ${caller.id} misses, then joins ${loader.id}. There is another waiter, but no extra source read.`
          : `Caller ${caller.id} misses and starts ${loader.id}, a ${duration} ms source read. The caller waits for its result.`);
      }
    }
  }
  return snapshots;
}

export function admissionTrace({ duration = 100 } = {}) {
  // Two execution slots, two queue places, a 150 ms overall deadline.
  // Six distinct keys arrive together, ordered P7–P12. No retries or cache hits.
  const jobs = Array.from({ length: 6 }, (_, i) => ({ key: `P${i + 7}`, state: 'Not arrived', end: null }));
  const snapshots = [];
  let started = 0;
  const save = (time, explanation) => snapshots.push({ time, explanation,
    jobs: jobs.map(j => ({ ...j })), started,
    active: jobs.filter(j => j.state === 'Running').length,
    queued: jobs.filter(j => j.state === 'Queued').length,
    answered: jobs.filter(j => j.state === 'Answered').length,
    rejected: jobs.filter(j => ['Rejected', 'Queue deadline', 'Insufficient time'].includes(j.state)).length,
  });
  save(0, 'Six different product cards are missing. There are two source slots and two queue places. Each caller has until 150 ms.');
  jobs.forEach(job => {
    const active = jobs.filter(j => j.state === 'Running').length;
    const queued = jobs.filter(j => j.state === 'Queued').length;
    if (active < 2) { job.state = 'Running'; job.end = duration; started++; }
    else if (queued < 2) job.state = 'Queued';
    else job.state = 'Rejected';
    save(0, job.state === 'Running' ? `${job.key} takes a source slot.` : job.state === 'Queued' ? `${job.key} waits in the bounded queue.` : `${job.key} is rejected promptly: the slots and queue are full. No source work starts for it.`);
  });
  // At 100 ms (fast) or 200 ms (slow), active work settles. The queued
  // callers leave at 150 ms if it has not settled. Running work is not
  // modelled as stopped merely because its caller's deadline has passed.
  if (duration > 150) {
    jobs.filter(j => j.state === 'Queued').forEach(j => { j.state = 'Queue deadline'; });
    save(150, 'P9 and P10 leave the queue at their deadline. P7 and P8 also stop waiting, but their source reads still occupy both slots until they settle.');
    jobs.filter(j => j.state === 'Running').forEach(j => { j.state = 'Late completion'; });
    save(duration, 'The two source reads finally settle. Both slots are released. No caller receives an on-time product answer in this run.');
  } else {
    jobs.filter(j => j.state === 'Running').forEach(j => { j.state = 'Answered'; });
    save(duration, 'P7 and P8 finish within their deadlines. Their callers receive answers and both slots become free.');
    // Fixed, known service time is a teaching assumption. Do not start work
    // known to finish after the caller's deadline in this illustrative policy.
    jobs.filter(j => j.state === 'Queued').forEach(j => { j.state = 'Insufficient time'; });
    save(duration, 'P9 and P10 have 50 ms left. Another 100 ms read cannot fit, so this model rejects them before starting it. Two source reads served two callers; four callers were rejected.');
  }
  return snapshots;
}
