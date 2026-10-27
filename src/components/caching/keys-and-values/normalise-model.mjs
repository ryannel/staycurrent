// Figure 3: one answer, many names. Generates listing-page requests whose URLs
// vary in ways that do not change the answer (parameter order, tracking
// parameters, explicit defaults, letter case), then builds a cache key from each
// with a chosen amount of normalisation. Counts distinct keys, the hit ratio of
// an unlimited cache that never expires, and requests given a page built for a
// different currency. The URL mix is invented to show the effect. Pure.
import { seededRandom, zipf } from '../shared/sim.mjs';

export const CATEGORIES = ['shoes', 'jackets', 'layers', 'kit'];
export const SORTS = ['popular', 'price', 'new'];
export const CURRENCIES = ['GBP', 'EUR'];
const DEFAULTS = { sort: 'popular', page: '1' };
const ANSWER_PARAMS = ['category', 'sort', 'page', 'currency'];

/** The steps, cumulative: each includes every earlier one. */
export const STEPS = [
  { value: 'raw', label: 'The URL as sent' },
  { value: 'sorted', label: 'Sort the parameters' },
  { value: 'tracking', label: 'Drop tracking parameters' },
  { value: 'defaults', label: 'Fill defaults, lower-case' },
  { value: 'currency', label: 'Drop currency too' },
];
const level = step => Math.max(0, STEPS.findIndex(s => s.value === step));

/** A request: the URL as sent and the answer it should get. */
function request(random, popularity) {
  const answer = popularity.sample(random);
  const category = CATEGORIES[Math.floor(answer / (SORTS.length * CURRENCIES.length))];
  const sort = SORTS[Math.floor(answer / CURRENCIES.length) % SORTS.length];
  const currency = CURRENCIES[answer % CURRENCIES.length];
  const params = [];
  const cased = random.chance(0.2) ? category[0].toUpperCase() + category.slice(1) : category;
  params.push(['category', cased]);
  if (sort !== DEFAULTS.sort || random.chance(0.4)) params.push(['sort', sort]);
  if (random.chance(0.3)) params.push(['page', '1']);
  params.push(['currency', currency]);
  if (random.chance(0.45)) params.push(['utm_source', random.pick(['newsletter', 'social', 'ads'])]);
  if (random.chance(0.3)) params.push(['utm_campaign', `c${100 + random.int(900)}`]);
  if (random.chance(0.15)) params.push(['ref', `r${random.int(100000)}`]);
  // Links and forms emit parameters in different orders.
  for (let i = params.length - 1; i > 0; i--) { const j = random.int(i + 1); [params[i], params[j]] = [params[j], params[i]]; }
  return { answer: `${category}/${sort}/${currency}`, currency, params };
}

/** Builds the cache key for one request at a normalisation step. */
export function keyFor(params, step) {
  const n = level(step);
  let list = params.map(([k, v]) => [k, v]);
  if (n >= 2) list = list.filter(([k]) => ANSWER_PARAMS.includes(k));
  if (n >= 3) {
    list = list.map(([k, v]) => [k, v.toLowerCase()]);
    for (const [k, v] of Object.entries(DEFAULTS)) if (!list.some(([name]) => name === k)) list.push([k, v]);
  }
  if (n >= 4) list = list.filter(([k]) => k !== 'currency');
  if (n >= 1) list.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  // From the defaults step the key is built from named fields in a fixed order, in the house form.
  if (n >= 3) {
    const field = name => list.find(([k]) => k === name)?.[1];
    return ['shop:listing:v3', field('category'), field('sort'), field('currency'), field('page')].filter(Boolean).join(':');
  }
  return `listing?${list.map(([k, v]) => `${k}=${v}`).join('&')}`;
}

export const urlOf = params => `/listing?${params.map(([k, v]) => `${k}=${v}`).join('&')}`;

/** n requests with a fixed seed, so every reader sees the same sample. */
export function requests(n = 2000, seed = 5) {
  const random = seededRandom(seed);
  const popularity = zipf(CATEGORIES.length * SORTS.length * CURRENCIES.length, 0.8);
  return Array.from({ length: n }, () => request(random, popularity));
}

/**
 * Runs the requests through an unlimited cache keyed at `step`. The first request
 * for a key misses and stores its answer; later ones hit and receive that answer,
 * which is wrong when it was built for a different currency.
 */
export function evaluate(list, step) {
  const stored = new Map();
  let hits = 0, wrong = 0;
  for (const r of list) {
    const key = keyFor(r.params, step);
    const cached = stored.get(key);
    if (cached === undefined) { stored.set(key, r.answer); continue; }
    hits++;
    if (cached !== r.answer) wrong++;
  }
  const answers = new Set(list.map(r => r.answer)).size;
  return { requests: list.length, keys: stored.size, answers, hits, hitRatio: hits / list.length, wrong };
}

/** A few requests for the same page, plus one in euros, to show how keys merge. */
export const SAMPLES = [
  [['category', 'shoes'], ['currency', 'GBP']],
  [['currency', 'GBP'], ['category', 'shoes']],
  [['category', 'shoes'], ['currency', 'GBP'], ['utm_source', 'newsletter']],
  [['utm_campaign', 'c417'], ['category', 'shoes'], ['currency', 'GBP']],
  [['category', 'Shoes'], ['sort', 'popular'], ['currency', 'GBP']],
  [['page', '1'], ['currency', 'GBP'], ['category', 'shoes']],
  [['category', 'shoes'], ['currency', 'EUR']],
];
