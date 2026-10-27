// Figure 8: hit ratio against cache size, at two request rates.
//
// Workload (evidence file, X10 and M6): cache-aside reads over 4,000,000 keys
// with Zipf-like popularity, exponent 0.8. Sizes are the share of all keys the
// cache can hold.
//
// MEASURED: Redis 8.10.3 at about 80,000 requests a second (X10), 3,000,000
// warm-up requests then 2,000,000 counted, one run each; each run lasted about
// a minute. The oracle (the most popular keys) and exact LRU are calculated
// from the same requests.
//
// MODEL: the article's Redis-like cache (sampled-cache.mjs: 5 samples, a pool
// of 16, the one-second LRU clock, the logarithmic LFU counter with decay) fed
// the same kind of requests, evenly spaced, at 80,000 a second (the X10
// conditions, which it reproduces to within 0.6 points) and at 5,000 a second
// after an hour of simulated warm-up. Runs: pace.mjs in the evidence file.

export const KEYS = 4000000;
export const SIZES = [20000, 40000, 120000, 400000, 1200000];

export const ORACLE = [0.3175, 0.3706, 0.4727, 0.6125, 0.7727];

export const MEASURED = {
  exact: [0.1945, 0.2426, 0.3414, 0.4945, 0.6940],
  'allkeys-lru': [0.1783, 0.2300, 0.3375, 0.4894, 0.6878],
  'allkeys-lfu': [0.2782, 0.3222, 0.4124, 0.5368, 0.6948],
  'allkeys-random': [0.1729, 0.2158, 0.3071, 0.4502, 0.6598],
};

export const MODEL = {
  80000: {
    exact: [0.1946, 0.2427, 0.3415, 0.4944, 0.6943],
    'allkeys-lru': [0.1793, 0.2307, 0.3388, 0.4925, 0.6923],
    'allkeys-lfu': [0.2811, 0.3255, 0.4161, 0.5409, 0.6984],
    'allkeys-random': [0.1741, 0.2185, 0.3108, 0.4561, 0.6659],
  },
  5000: {
    exact: [0.1949, 0.2432, 0.3421, 0.4950, 0.6944],
    'allkeys-lru': [0.1939, 0.2422, 0.3407, 0.4935, 0.6922],
    'allkeys-lfu': [0.2432, 0.2823, 0.3674, 0.4956, 0.6697],
    'allkeys-lfu-decay10': [0.2922, 0.3430, 0.4371, 0.5626, 0.7132],
    'allkeys-random': [0.1744, 0.2188, 0.3110, 0.4566, 0.6541],
  },
};

/** The three settings the figure offers. */
export const SETTINGS = {
  benchmark: { rate: 80000, lfu: MODEL[80000]['allkeys-lfu'], series: MODEL[80000], measured: MEASURED },
  steady: { rate: 5000, lfu: MODEL[5000]['allkeys-lfu'], series: MODEL[5000], measured: null },
  decay10: { rate: 5000, lfu: MODEL[5000]['allkeys-lfu-decay10'], series: MODEL[5000], measured: null },
};

/** Points for the chart: x is the index of the size (sizes grow roughly threefold), y the hit ratio. */
export const points = values => values.map((v, i) => [i, v]);

/** Requests a minute for each key the cache holds, at `rate` requests a second. */
export const perKeyPerMinute = (rate, size) => (rate * 60) / size;

export const sizeLabel = i => {
  const share = (SIZES[i] / KEYS) * 100;
  return share === undefined || Number.isNaN(share) ? '' : `${share < 1 ? share.toFixed(1) : Math.round(share)}%`;
};
