// Illustrative sequential requests. No concurrency, expiry, eviction or queues.
export function reuseTrace(distinct = 4, count = 24) {
  const seen = new Set();
  return Array.from({ length: count }, (_, i) => {
    const key = i % distinct + 1;
    const hit = seen.has(key);
    seen.add(key);
    return { key, hit, copies: seen.size };
  });
}

// All durations include the relevant round trip; a miss waits for its fill.
export function cacheCost(hitPercent, sourceMs, lookupMs = 2, fillMs = 2) {
  const h = hitPercent / 100;
  return { hit: lookupMs, miss: lookupMs + sourceMs + fillMs,
    mean: lookupMs + (1 - h) * (sourceMs + fillMs),
    sourceReads: 100 - hitPercent, direct: sourceMs,
    breakEven: (lookupMs + fillMs) / (sourceMs + fillMs) * 100 };
}

export function copyAt(time, invalidate = false) {
  // A copy of €18 is filled at t=0, source changes at 5, expires at 10.
  // No later reads/refills: the slider reveals stored state, not a request.
  const source = time >= 5 ? 15 : 18;
  const present = time < 10 && !(invalidate && time >= 5);
  return { source, cached: present ? 18 : null,
    stale: present && source !== 18, ttl: present ? Math.max(0, 10 - time) : null };
}

export function requestJourney(warm = false) {
  return warm ? [
    { from: 'reader', to: 'app', label: 'Ask for the mug' },
    { from: 'app', to: 'cache', label: 'GET the saved answer' },
    { from: 'cache', to: 'app', label: 'Hit: return the €18 copy' },
    { from: 'app', to: 'reader', label: 'Reply with the saved answer' },
  ] : [
    { from: 'reader', to: 'app', label: 'Ask for the mug' },
    { from: 'app', to: 'cache', label: 'GET the saved answer' },
    { from: 'cache', to: 'app', label: 'Miss: there is no copy' },
    { from: 'app', to: 'source', label: 'Query the catalogue' },
    { from: 'source', to: 'app', label: 'Read €18 and build the answer' },
    { from: 'app', to: 'cache', label: 'SET a copy of the answer' },
    { from: 'cache', to: 'app', label: 'The copy is saved' },
    { from: 'app', to: 'reader', label: 'Reply with the answer' },
  ];
}
