# Writer report: article 1, Application caching with Redis (introduction)

Article: `src/articles/caching/introduction.astro` (page `/learn/databases/caching/`).
Components and models: `src/components/caching/introduction/`. Plan: `plan.md`.
Evidence: `../../evidence/introduction.txt`. Screenshots: `screens/`.
Not committed or pushed.

## Word count

About 4,100 words of body prose, about 4,400 including the collection map and
sources. Figure step texts and text alternatives are extra.

## Figures (10)

1. Repeated work (live): visitors, application and database; most queries repeat
   an answer already computed (about 180 queries, 42 distinct, 75% repeats in a minute).
2. The cache-aside read path (steps): miss, SELECT, SET … EX 60, then a hit.
3. Hit ratio (live): 100 products, 60 s TTL; climbs from zero, settles near 78%.
4. Misses and load (choice of hit ratio): 1,000-request grid, mean latency and
   database reads; 95% to 99% is five times fewer reads.
5. Latency spread (choice): histogram with p50, mean and p99; p99 stays a miss
   until fewer than 1% miss.
6. Popularity (slider s): cumulative share of requests for the top x% of
   100,000 products, against the even diagonal.
7. What a small cache holds (slider capacity, live): 2,500-product grid, LRU
   holdings against the ideal top-C outline.
8. Cache layers (static): browser, CDN, application, Redis, database.
9. A stale copy (steps): price update while Redis keeps £34 until expiry.
10. Cache outage (live, Redis up/down): database demand and failures against a
    40-read capacity; 1/(1 − h) jump, slow refill after restart.

Every figure was screenshotted light/dark, desktop/phone, and every control
exercised with Playwright; readouts matched the prose (fig1 181/43/76%, fig7
28/45, 61/73, 83/89, fig10 about 5–9 running, about 100–113 needed and 60–75 failed
when down). Model numbers quoted in prose are pinned by
`src/components/caching/introduction/model.test.mjs` (7 tests, passing).
`pnpm build` passed all site-check rules, with and without `CACHING_DRAFT_PREVIEW=1`.

## Evidence gathered (measured, Redis 8.10.3 on port 7101, now shut down)

- Fresh-server defaults: `maxmemory 0`, `maxmemory-policy noeviction`, libc allocator.
- `redis-cli` transcripts for miss, `SET … EX 60`, hit, `TTL`, stale copy with `PX`,
  `SET` without expiry (TTL −1), `SET` clearing an existing TTL, `EX 0` error.
- `keyspace_hits`/`keyspace_misses` move on `GET`, `TTL`, `EXISTS` and
  `OBJECT ENCODING`, not on `MEMORY USAGE`; the article warns the counters are
  not a pure cache hit ratio.
- `MEMORY USAGE` 96 bytes for the sample product (macOS/libc caveat stated).
- `redis-benchmark -c 1 -P 1` loopback: about 10,000 GET/s, median 0.095 ms.
- Zipf traffic through real Redis with `allkeys-lru` (100,000 items, s = 1):
  1% room 46.7% (exact LRU 50.6, ideal 61.9); 10% room 70.5% (73.7, 81.0);
  also 5%, 20% and s = 0.8 in the evidence file.
- Source checks: Breslau et al. INFOCOM 1999 (s 0.64–0.83, top-1% and
  top-10% shares); Bronson et al. HotOS 2021 §2.2 (90% hit rate, tenfold).

All other numbers are labelled as illustrative models in captions and in the
sources section.

## Claims not verified against a primary source

- Valkey history (fork of 7.2.4 in 2024, Linux Foundation) checked only against
  secondary sources; the article keeps to "a fork of 7.2 under the original licence".
- "Typically a fraction of a millisecond within one data centre" is general
  knowledge, not measured here.
- Denning 1968 cited from knowledge, not re-read.
- No source for Zipf exponents of application object caches (as opposed to web
  proxies); the article tells readers to measure their own logs instead.
- The 1 ms cache and 20 ms database costs in figures 4, 5 and 10 are assumptions,
  said so in the text.

## Coverage map: gaps and overlaps

- Overlap, deliberate and shallow: cache-aside basics (article 2), TTL as a
  staleness bound and the stale-copy sequence (4, 5), outage and metastable
  failure (6, 11), in-process caches (10), memory per key (3, 11), LRU
  approximation (4). Each points forward without teaching the mechanism.
- Gap: the licensing/Valkey paragraph is not in the coverage map; it is one
  paragraph here and may deserve a line in article 7 or 11.
- Browser/CDN caching is named as out of scope.

## Toolkit gaps

- No log-scale axis in `chart.mjs` (figure 6 used dense x samples instead).
- No grid or heat-map renderer; figure 7 uses a local canvas reading CSS
  variables, with a MutationObserver to redraw on theme change.
- No vertical/grouped bar comparison for two quantities side by side; figure 4
  uses two bar charts.
- No slot for a one-off action button (figure 10 uses a Choice for up/down).
- `LruCache.size` counts expired but not yet reaped entries.
- Choice radio inputs overlay their labels, so Playwright text clicks are
  intercepted; click the input by value instead.
- Long Readout labels wrap to two lines on phones.
