// Figure 1: caching whole listing pages or the products on them. One stream of
// page views and product changes runs through two caches at once. The page
// cache stores one entry per (category, sort order, currency); the product
// cache stores one entry per product and builds the page from twelve of them.
// A product change deletes every entry that contains the product. Both caches
// start full, have no size limit and no expiry, so every miss comes from a
// change. Illustrative: the shop, rates and counts are invented. Pure.
import { Simulation, poissonArrivals, zipf, RecentRatio } from '../shared/sim.mjs';

export const CATEGORIES = ['Shoes', 'Jackets', 'Layers', 'Kit'];
export const SORTS = ['Popular', 'Price', 'New'];
export const CURRENCIES = ['£', '€'];
export const PER_PAGE = 12;
export const PRODUCTS = CATEGORIES.length * PER_PAGE;

/** Every listing page, ordered category by category; a page shows its category's twelve products. */
export const PAGES = CATEGORIES.flatMap((category, c) =>
  SORTS.flatMap(sort => CURRENCIES.map(currency => ({ category: c, sort, currency, label: `${category}, ${sort.toLowerCase()}, ${currency}` }))));

const productsOf = page => Array.from({ length: PER_PAGE }, (_, i) => PAGES[page].category * PER_PAGE + i);
const categoryOf = product => Math.floor(product / PER_PAGE);

/**
 * params: views (page views a second), changes (product changes a minute), skew
 * (Zipf exponent over pages). Page popularity is Zipf over a shuffled page order,
 * so popular pages are spread across categories.
 */
export function granularity(params = {}, seed = 1) {
  const p = { views: 6, changes: 12, skew: 1, window: 300, ...params };
  const sim = new Simulation({ seed });
  const popularity = zipf(PAGES.length, p.skew);
  // A fixed shuffle of which page has which popularity rank.
  const order = PAGES.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) { const j = sim.random.int(i + 1); [order[i], order[j]] = [order[j], order[i]]; }
  const pages = new Array(PAGES.length).fill(true);
  const products = new Array(PRODUCTS).fill(true);
  const flash = { pages: new Map(), products: new Map() };
  const totals = { views: 0, changes: 0, pageHits: 0, productLookups: 0, productHits: 0, pageRows: 0, productRows: 0, pagesDeleted: 0, productsDeleted: 0 };
  const recent = { page: new RecentRatio(p.window), product: new RecentRatio(p.window * PER_PAGE), pageRows: [], productRows: [] };
  const model = { sim, params: p, pages, products, flash, totals, recent, lastChange: null, lastView: null };
  const mark = (map, index, kind) => map.set(index, { kind, at: sim.now });
  const keepRecent = (list, value) => { list.push(value); if (list.length > p.window) list.shift(); };

  model.view = page => {
    totals.views++;
    model.lastView = { page, at: sim.now };
    // Page cache: one lookup; a miss reads the page's twelve rows and stores the page.
    const pageHit = pages[page];
    recent.page.add(pageHit);
    if (pageHit) totals.pageHits++;
    else { pages[page] = true; totals.pageRows += PER_PAGE; }
    keepRecent(recent.pageRows, pageHit ? 0 : PER_PAGE);
    mark(flash.pages, page, pageHit ? 'hit' : 'miss');
    // Product cache: twelve lookups (one MGET); each miss reads one row.
    let rows = 0;
    for (const product of productsOf(page)) {
      const hit = products[product];
      totals.productLookups++;
      recent.product.add(hit);
      if (hit) totals.productHits++;
      else { products[product] = true; rows++; }
      mark(flash.products, product, hit ? 'hit' : 'miss');
    }
    totals.productRows += rows;
    keepRecent(recent.productRows, rows);
  };

  model.change = product => {
    totals.changes++;
    model.lastChange = { product, at: sim.now };
    if (products[product]) totals.productsDeleted++;
    products[product] = false;
    mark(flash.products, product, 'write');
    PAGES.forEach((page, i) => {
      if (page.category !== categoryOf(product)) return;
      if (pages[i]) totals.pagesDeleted++;
      pages[i] = false;
      mark(flash.pages, i, 'write');
    });
  };

  poissonArrivals(sim, () => model.params.views, () => model.view(order[popularity.sample(sim.random)]));
  poissonArrivals(sim, () => model.params.changes / 60, () => model.change(sim.random.int(PRODUCTS)));
  return model;
}

const mean = list => (list.length ? list.reduce((a, b) => a + b, 0) / list.length : 0);

/** Recent figures for the readouts: hit ratios over the last views, rows read from the database per view. */
export function summary(model) {
  const { recent } = model;
  return {
    pageHitRatio: recent.page.count ? recent.page.value : NaN,
    productHitRatio: recent.product.count ? recent.product.value : NaN,
    pageRowsPerView: mean(recent.pageRows),
    productRowsPerView: mean(recent.productRows),
  };
}

/**
 * Expected long-run hit ratios from the derivation in the article: an entry read
 * at rate r and deleted at rate d hits with probability r / (r + d).
 * views a second, changes a minute.
 */
export function expected({ views = 6, changes = 12, skew = 1 } = {}) {
  const popularity = zipf(PAGES.length, skew);
  const w = changes / 60;
  const pageDelete = (PER_PAGE * w) / PRODUCTS;            // any of the page's 12 products changes
  const productDelete = w / PRODUCTS;
  const pagesPerCategory = PAGES.length / CATEGORIES.length;
  let pageHits = 0, productHits = 0;
  // Every page has the same shape, so averaging over ranks is enough for the page cache.
  for (let k = 0; k < PAGES.length; k++) {
    const r = views * popularity.probability(k);
    pageHits += r * (r / (r + pageDelete || 1));
  }
  // A product is read whenever any page of its category is viewed. With pages
  // shuffled, use the average category read rate.
  const categoryRate = views / CATEGORIES.length;
  productHits = categoryRate / (categoryRate + productDelete || 1);
  return { page: pageHits / views, product: productHits, pageDelete, productDelete, pagesPerCategory };
}
