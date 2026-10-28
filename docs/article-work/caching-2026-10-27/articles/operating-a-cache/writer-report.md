# Writer report: article 11, Operating a cache: monitoring, capacity and failure

Draft: `src/articles/caching/operating-a-cache.astro`, with its figures in `src/components/caching/operating-a-cache/`. Plan: `plan.md` in this folder. Nothing has been committed. The collection entry is still `planned`.

## Size

About 7,150 words, counting the sources and code. That is within the range of the collection's other articles (6,200 to 7,600). There are 5 figures and 2 tables (alerts, licences).

## Figures

1. **Which traffic the database survives without the cache** (static, hit-ratio slider). This is arithmetic. It shows the stable, vulnerable and overloaded ranges for C = 300 and marks the shop's 1,000 reads a second.
2. **Thirty seconds without Redis** (live; choice between no limit and a limit of 60; skip 30 s). This is a model. Without the limit, 42% of requests are answered in the first second of the outage and none after. The database is 70 s behind when Redis returns, and the 1 in 10 misses keep failing until 144 s, with about 40,000 wasted queries. With the limit, 30% are served during the outage and recovery is immediate.
3. **Bringing an empty cache into service** (live; all at once, a two-minute ramp, or reading the old cache first). This is a model.
   - All at once: about 2,000 requests are refused, and the new cache reaches 80% after about 30 s.
   - Ramp: peak about 220 queries a second, nothing refused, 80% after about 70 s.
   - Reading the old cache: peak about 120, nothing refused, 80% after about 25 s.
4. **What INFO shows during four incidents** (static; choice of incident). This replays **measured** Redis 8.10.3 recordings: maxmemory cut to 6 MB, TTL cut to 10 s, key names changed, and FLUSHALL. Each recording has three charts: hit ratio over the last 10 s against the ratio since start; misses, evictions and expirations; and keys.
5. **From the memory you buy to the load on the database** (static; size slider and reserve choice). The bytes per product are measured; everything else is illustrative.

All five have a number, title, caption and text alternative. I checked each in light and dark themes at 1280 px and 375 px (`screens/`, with states in `screens/states/`). Playwright exercised every control: all slider stops, every choice, Step, Skip and Reset, and opening every text alternative. There were no page errors. Under reduced motion both live figures load paused. The model tests are in `models.test.mjs` (6 pass) and check every number quoted in the prose and in the text alternatives. `pnpm build` passes with every site-check rule ok.

During the screenshot check I found that the shop model filled the warm cache with the ideal top-N keys. As a result, Figure 3's database load settled at a different level after the switch than before it. I now warm the caches by replaying 200,000 reads through the LRU cache, and raised the capacity to 12,500 so that the warm hit ratio stays about 90%. All quoted numbers were updated.

## Evidence

`evidence/operating-a-cache.txt`, with the scripts in `evidence/operating-a-cache-scripts/` and the raw recordings in `evidence/operating-a-cache-data/`:

- **E1:** defaults.
- **E2 and E3:** ACLs. A `~tenant1:*` user can still FLUSHALL everything; `-flushall` stops it.
- **E4:** a stopped Redis fails in 0.9 ms; under CLIENT PAUSE a GET waits the full 3 s unless it has a timeout.
- **E5:** 2,130 bytes for each 2,000-byte value.
- **E6:** FLUSHALL. See the note below.
- **E7:** what counts as a hit or a miss.
- **E8:** the four incident recordings (420 s each, 1,000 requests a second).
- **E9:** the counters reset on RESETSTAT and on restart.
- **E10:** the INFO fields used in the alert table, and an OOM rejection.

All Redis servers have been stopped and their data deleted; the dev server has been stopped.

The FLUSHALL measurement changed a claim. In Redis 7.4 and later, a plain (SYNC) FLUSHALL frees memory in a background thread and blocks only its caller. I measured a reply after 130–200 ms, while another client's PING was barely affected. Inside MULTI every client waits (128–300 ms). I confirmed this in `src/db.c` at 8.10.3 and checked it was absent in 7.2.0. Valkey 9.0 has no such path, but it defaults to asynchronous flushes. The article now says this.

## Claims not verified by me

- Fowler and Nygard on circuit breakers: summarised from general knowledge, not re-read.
- That PostgreSQL's `statement_timeout` cancels the query: standard behaviour, but I did not re-read the documentation.
- That many pools wait "often for many seconds" by default: a generalisation, with no particular library checked.
- That Redis 7.4–7.8 are licensed RSALv2/SSPLv1 and 8.0+ add AGPLv3, and that ElastiCache's engine versions and default `volatile-lru` apply: the first two were checked against the README and AWS pages earlier in this session; the eviction default was not re-checked.
- That "up to" network bandwidth on small cloud instances is burstable: general knowledge, with no provider cited.

## Coverage map

- **Links rather than re-teaching:**
  - Timeouts and retries: clients-and-pipelining.
  - Refill trap: caching-patterns Figure 4.
  - Cold-start mechanics: stampedes.
  - Restart cost and Sentinel: replication-and-persistence.
  - The eviction/expiry diagnosis: expiration-and-eviction#observing.
  - Per-key memory, fragmentation and diagnosis tools: how-redis-works.
  - Near caches: cluster-and-hot-keys.
- **Possible overlap:**
  - The introduction already says that `keyspace_*` counts any command. I link to it and add only measured specifics (MGET, a missing hash field, negative markers).
  - Valkey's lazyfree defaults are mentioned in both the warming and services sections.
- **Gap:** cluster-and-hot-keys points here for "what to measure" in a cluster. This article does not cover per-shard monitoring (slot imbalance, per-node memory). A sentence there or here may be wanted.

## Toolkit gaps

- `lineChart` computes its left margin from the y-tick label width, so stacked charts with different units do not line up. I worked around it by padding tick labels with figure spaces. A shared `marginLeft` option would be cleaner.
- `tickStep` cannot vary by width. I chose coarser steps so phone layouts do not crowd.
- A node's badge sits above it and collides with a node directly above. Figure 3 uses sublabels instead.
