/** Explicit teaching models: serial requests, fixed costs, no network failures. */
export function cacheAsideTrace({ cached = null, source = 'Blue mug · £12' } = {}) {
  const hit = cached !== null;
  const value = hit ? cached : source;
  const steps = [
    { phase: 'ready', cached, source, answer: null, path: null, explanation: 'The application needs the blue mug’s product details.' },
    { phase: 'lookup', cached, source, answer: null, path: 'lookup', explanation: 'The application sends GET product:42 to Redis.' },
    { phase: hit ? 'hit' : 'miss', cached, source, answer: null, path: 'cache-return', explanation: hit ? 'Redis returns the saved value. This is a cache hit.' : 'Redis returns nil: this key is absent. This is a cache miss.' },
  ];
  if (!hit) steps.push(
    { phase: 'load', cached, source, answer: null, path: 'load', explanation: 'The application reads the database and builds the product details.' },
    { phase: 'source-return', cached, source, answer: value, path: 'source-return', explanation: 'The database result reaches the application. Redis did not fetch it.' },
    { phase: 'fill', cached: value, source, answer: value, path: 'fill', explanation: 'The application saves a copy with SET product:42 … EX 60.' },
  );
  steps.push({ phase: 'done', cached: value, source, answer: value, path: null, explanation: hit ? 'The application returns the cached details. The database did no work for this request.' : 'The application returns the details. A later request can reuse the saved copy.' });
  return steps;
}
export function reuseTrace(keys, capacity = Infinity) {
  const cache = new Map();
  return keys.map(key => {
    const hit = cache.has(key);
    cache.delete(key);
    cache.set(key, true);
    while (cache.size > capacity) cache.delete(cache.keys().next().value);
    return { key, hit, cache: [...cache.keys()] };
  });
}
export function latencyModel(hitPercent, sourceMs = 40, lookupMs = 2, fillMs = 2) {
  const h = hitPercent / 100;
  const hit = lookupMs;
  const miss = lookupMs + sourceMs + fillMs;
  return { hit, miss, mean: h * hit + (1 - h) * miss,
    breakEven: (lookupMs + fillMs) / (sourceMs + fillMs),
    p99: hitPercent >= 99 ? hit : miss,
    sourceReads: 100 - hitPercent };
}
