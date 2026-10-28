# Writer report: Redis Cluster, sharding and hot keys (article 10)

## The article

- File: `src/articles/caching/cluster-and-hot-keys.astro`. It is about 6,860 words including Sources, and about 6,500 words of prose.
- Sections:
  1. When one server is not enough
  2. Placing keys on servers
  3. Hash slots
  4. What a cluster cannot do
  5. Finding the right node: MOVED and ASK
  6. Adding a shard to a running cache
  7. When a node dies
  8. One hot key
  9. Finding hot keys
  10. Relieving a hot key
  11. A near cache that Redis keeps up to date
  12. What can still go wrong with a near cache
  13. What you can now decide
  14. Sources
- The collection entry in `src/lib/caching-collection.ts` is untouched and still `planned`. Nothing is committed.
- Checks:
  - `pnpm build` passed. A build with `CACHING_DRAFT_PREVIEW=1` also passed and rendered this page; all 13 site-check rules passed in both.
  - The model tests pass: `node --test src/components/caching/cluster-and-hot-keys/*.test.mjs`, 10 tests.

## Figures (all in `src/components/caching/cluster-and-hot-keys/`)

| # | Component | Kind | Data |
| --- | --- | --- | --- |
| 1 | `PlacementFigure` | Choice (mod N, ring, slots) and a servers slider; grid of 96 keys; readouts for keys moved and lost | Model (`placement-model.mjs`, real CRC16 for slots) |
| 2 | `KeySlotFigure` | Text field of keys plus 4 presets; slot bar, table with the hashed part marked, CROSSSLOT verdict | Real CRC16 (`slots.mjs`), checked against `CLUSTER KEYSLOT` |
| 3 | `RedirectFigure` | Steps; choice of MOVED or ASK/ASKING/TRYAGAIN | Observed replies (evidence C3, C5) |
| 4 | `FailoverFigure` | Line chart; choice of with replica, no replica, or full coverage off; outage readouts | Measured (`failover-data.mjs`, C8) |
| 5 | `HotShardFigure` | Column chart; shards slider (3 to 48); skew choice (0.8, 1, 1.2); 4 readouts | Model (`hotshard-model.mjs`) |
| 6 | `ToolsFigure` | Bars; choice of true counts, LFU, HOTKEYS bytes or HOTKEYS CPU | Measured (`tools-data.mjs`, C9) |
| 7 | `RemediesFigure` | Same model at 12 shards; choice of remedy | Model |
| 8 | `TrackingFigure` | Steps; default or broadcast mode | Observed (C11) |
| 9 | `RaceFigure` | Steps; no placeholder or placeholder | Documented race; illustrated, not reproduced |

How I checked them:

- I screenshotted every figure in light and dark themes, at desktop and phone width (`screens/`).
- With Playwright I exercised every control: every choice, the slider extremes, every preset and typed input (including escaping and empty input), and every step of every sequence to its end. I also tried keyboard operation of a Choice.
- No console errors and no horizontal overflow at 375 px.
- Fixes made along the way:
  - Slot-mark labels collided at phone width.
  - Sequence labels were too long at phone width.
  - Figure 2 treated a leading `GET` as a key.
  - Some wording in the verdict and notes.

## Evidence gathered

All of it is in `evidence/cluster-and-hot-keys.txt`, sections C1–C12. I used Redis 8.10.3, a cluster on ports 7195–7199 (bus ports 17195–17199), a single node on 7110, and redis-py 8.1.0 plus raw RESP3 sockets.

- **C1–C3.** Cluster creation and replicas. Default settings:
  - `cluster-node-timeout` 15000
  - `cluster-require-full-coverage` yes
  - `cluster-allow-reads-when-down` no
  - replica validity factor 10

  I also captured `KEYSLOT` values, MOVED, CROSSSLOT (`MGET`, `EVAL`) and `SELECT`.
- **C4/C4b.**
  - Transactions: MOVED at queue time then EXECABORT; same node but different slots gives CROSSSLOT at EXEC, and nothing ran.
  - `SCAN` sees only one node's keys.
  - redis-py `mget` raises, while `mget_nonatomic` and pipelines work.
- **C5.** ASK, ASKING (one command only), TRYAGAIN, and MOVED after the handoff, during a legacy migration.
- **C6.** Atomic reshard with `redis-cli`: 4,096 slots and 49,894 keys moved in 3.07 s under 4,000 GET/s. All 180,016 reads hit, there were 60 MOVED, and no errors.

  `redis-cli` 8.10.3 uses atomic slot migration automatically when every node is 8.4.0 or later (source checked).
- **C7.** Key-by-key migration with my Python script: 220 s, 328 MOVED and 2 ASK, all reads hit, p99 20.9 ms. The caveat is CPU contention, which the article states.
- **C8.** Failover, four scenarios, with per-shard reads per second and server log lines.
  - Detection took 17–20 s.
  - Healthy shards also paused for about 1 s during a failover with a replica.
  - With no replica, the whole cluster went down (CLUSTERDOWN).
  - With full coverage off, the healthy shards kept serving.
  - With reads-when-down, reads worked and writes were refused.
- **C9.** Zipf workload for 180 s at 3,000 GET/s with allkeys-lfu.
  - Per-node INFO: the busiest node had 1.31× its fair share.
  - Compared OBJECT FREQ and `--hotkeys`, `HOTKEYS` by CPU and by bytes, and `CLUSTER SLOT-STATS` against client-side counts.
- **C10.** READONLY on a replica.
- **C11.** CLIENT TRACKING:
  - default mode, NOLOOP, BCAST PREFIX, OPTIN
  - RESP2 REDIRECT
  - a full table producing spurious invalidations
  - a write-to-invalidation delay of 268 µs median and 639 µs p99 on loopback
- **C12.** `--hotkeys` without an LFU policy.

All Redis processes on 7110 and 7195–7199 are stopped, and the dev server on 4410 is stopped.

## Claims I could not verify, or that rest on one source

- The Redis atomic slot migration benchmark (6.4 s against 192–219 s) is the vendor's own; the article says so.
- My key-by-key duration (220 s) is not a fair measure of the legacy protocol in C. The article says so.
- I did not check whether Valkey offers `HOTKEYS`, `CLUSTER SLOT-STATS` or atomic slot migration, and the article makes no Valkey claims. Valkey 9.0's atomic slot migration and multi-database cluster mode appear only in press coverage.
- The client library versions with built-in tracking caches (redis-py 5.1.0, Jedis 5.2.0, node-redis 5.1.0, go-redis 9.22.0) come from Redis's documentation. I did not test them.
- "After a failover the near cache must be emptied" is inferred from tracking being per connection. It is not a documented sentence.
- I did not reproduce the two-connection race in Figure 9. It is from the client-side caching reference, and the caption says so.
- All timings come from one laptop on loopback, and none are Linux or production figures. Failover was one run per scenario; detection time comes from four runs.
- `memory-bytes` in SLOT-STATS "from 8.4" comes from the dossier and the ASM blog. I did not check it against source.

## Coverage map: gaps and overlaps

- **Article 9** (replication-and-persistence) now exists. I link to its Sentinel, failover-loss, replication and rdb sections rather than re-teaching them. Cluster failover is described only where it differs: node-timeout, election by rank, full coverage, and reads-when-down. READONLY appears here only as a hot-key remedy.
- **Article 7** already mentions the main-thread trimming interaction between ASM and tracking in passing. I give it one sentence.
- **Article 8** mentions CROSSSLOT and KEYS in scripts. I link to it and add the transaction and `mget` behaviour.
- **Possible gaps for article 11:**
  - alerting on MOVED/ASK rates
  - per-node `INFO` dashboards
  - choosing `cluster-node-timeout` from measured pauses
  - managed-service differences (ElastiCache cluster mode)
- **Cut on purpose:**
  - proxies (Envoy, twemproxy)
  - gossip and epoch details
  - managed services
  - Valkey multi-database clusters
- **Collection index:** the introduction links to this article as "Article 10". The collection entry's status stays `planned` until publication.

## Toolkit gaps (extended locally, not in `shared/`)

- **No text-input control.** Figure 2 uses a local `<input>` styled in `cluster.css`.
- **No vertical column chart with a capacity line.** I added a local `columns.mjs`.
- **`sequenceFigure` cannot switch specs with a Choice.** I copied article 8's `switch-sequence.mjs` locally. This is the same gap that article reported.
- **No legend for `cellGrid` fills.** I added local `.cluster-cell-legend` swatches.
- **No helper for replaying measured time series.** Figure 4 sets lineChart series from data, which works. A replay with a moving cursor would need a local addition.
