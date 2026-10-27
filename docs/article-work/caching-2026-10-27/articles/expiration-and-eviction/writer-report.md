# Writer report: Cache expiration and eviction (article 4)

Article: `src/articles/caching/expiration-and-eviction.astro`
Components: `src/components/caching/expiration-and-eviction/`
Evidence: `docs/article-work/caching-2026-10-27/evidence/expiration-and-eviction.txt` (X0–X11, with the scripts appended)
Screens: `docs/article-work/caching-2026-10-27/articles/expiration-and-eviction/screens/` (and `controls/`)

## Size

About 6,000 words of prose, excluding figure captions, text alternatives and sources. That is above the 4,500–5,500 I planned; the "map changes after research" added LRM, the one-second LRU clock and the oversized value, and the measured hit-ratio comparison grew a section. Candidates to cut if an editor wants it shorter: the TTL command table (partly overlaps article 2), the `INFO` field table (overlaps article 11), the X11b paragraph.

## Figures (9)

1. One cached key under a TTL (live, TTL slider): model.
2. What a longer TTL buys, and what it costs (read-rate choice): the derived formulas.
3. Expired is not yet deleted (cycle on/off): model of the 8.10.3 cycle rule.
4. Keys cached together expire together (jitter slider): model.
5. When Redis is full (noeviction / volatile-lru / allkeys-lru): model.
6. Sampling for an old key (maxmemory-samples slider): model of sampling plus the 16-entry pool.
7. A counter that slows down as it climbs (lfu-log-factor choice): expected curve plus measured OBJECT FREQ points.
8. Hit ratio against cache size, measured (static): Redis 8.10.3 measurements plus a calculated oracle.
9. A batch job reads everything once (live): model of sampled LRU and LFU on one stream.

Each figure says in its caption whether it is a model or a measurement. Pure logic is in `.mjs` files. `models.test.mjs` checks every model number quoted in the prose and figure texts (`node --test src/components/caching/expiration-and-eviction/models.test.mjs`: 9 tests pass). I took screenshots of all nine figures in light and dark, at desktop and 375 px widths, and looked at each one, both at first paint and after stepping each live figure forward. A Playwright script exercised every radio, every slider at its minimum, maximum and default, and speed, reset and play/pause on each figure. It found no console errors and no overflow, and with reduced motion every figure stays paused. Fixes made after looking: Fig 1's version labels overlapped the lane label on phones, Fig 1's seed showed no database change in the first minute, Fig 5's tray count was clipped on phones, Fig 3's y axis, and Fig 6's "darker" wording, which was wrong in the dark theme.

`pnpm build` passed. The site check also passed with `CACHING_DRAFT_PREVIEW=1` (111 pages, all 13 rules OK), and I then ran a normal build to restore `dist`.

## Evidence gathered (Redis 8.10.3, macOS arm64, libc malloc, port 7104, one run per setting)

- X1 defaults; X2 TTL semantics for every command in the table (plain SET clears, KEEPTTL, GETEX, EXPIRE NX/XX/GT/LT, RENAME, SET NX).
- X3 expiry precision: last hit at 200.1–200.7 ms for PX 200.
- X4 expired keys hold memory: 200,000 expired keys still counted at 39.1 MB with the active cycle off; drained in about 0.5 s with it on.
- X5 synchronised expiry of 1M keys: the slowest PING was about 26 ms in every half second for 1.5 s, against at most 12.7 ms when expiries were spread over 30 s. CPU spent on expiry: 0.6 s for the burst and 1.26 s spread.
- X6 policies at 20 MB: noeviction refusals and the OOM error text; volatile-lru with no TTLs behaves like noeviction; with half the keys carrying a TTL, only TTL keys are evicted.
- X7: one 8 MB value under a 6 MB limit is accepted, then evicted along with 2,368 small keys.
- X8: precision of approximated LRU at samples 1 to 64 (40% to 99%).
- X9: LFU counter growth by factor (the N=10 column is invalid because of pipelining, as noted in the file); decay of 1 per minute.
- X10: hit ratio by cache size and policy over 4M Zipf-0.8 keys, with a calculated oracle and exact LRU.
- X11: scan pollution, both with a pause (LRU kept 0 of 1,000 hot keys, LFU kept 969) and interleaved with live traffic (LRU dropped from 49% to 37%, LFU from 53% to 51%).

Followed the 8.10.3 source over redis.io prose on the active-expiry threshold (10%, not 25%) and LFU decay (subtract one per period, not halving); the article says so.

## Claims not verified first-hand

- ElastiCache: the default `volatile-lru` comes from AWS documentation. Azure Cache, Memorystore and Valkey-based services were not checked. Valkey's lack of LRM rests on its documentation not mentioning it ("not in Valkey's documentation").
- TTL jitter as a practice is not named in a primary source; the arithmetic is mine.
- Replica handling of expiry and the timing of keyspace notifications come from the documentation and were not observed.
- That an `expired` event arrives late was not measured.
- Facebook figures (6% to 0.3%) are quoted from the NSDI 2013 paper via the dossier.
- That Redis runs "ten times a second" assumes `hz 10`; `dynamic-hz` can raise it with many clients. The article does not mention this.
- I cannot separate the effect of the 1-second LRU clock from sampling in X10; the article says so.
- All memory numbers come from macOS with libc malloc, and the sources list says they are not typical of Linux with jemalloc.

## Coverage map: overlaps and gaps

- Plain `SET` clearing the TTL is also in article 1 (one sentence) and article 2 (paragraph with measurement). Here it is one table row and a short paragraph that points to article 2.
- TTL as a staleness bound is introduced in article 1. This article builds on it and does not re-teach it.
- `HEXPIRE` is owned by article 3. Here there is one sentence plus the eviction consequence (field-only TTLs are not eviction candidates, from the dossier's B5.4).
- Jitter is here and stampedes are in article 6; the boundary is stated in the text.
- `INFO` fields and diagnosis overlap article 11, which should own the alerts.
- Article 1 measured allkeys-lru against exact LRU with Zipf 1. This article uses Zipf 0.8 and says why its numbers differ.
- Article 7 (how Redis works) may cover lazyfree and main-thread deletes. Here only the expiry pause is measured.
- Gap: `volatile-ttl` and the LRM policies are described from the source and documentation, with no figure or measurement.

## Toolkit gaps (shared code not edited; worked round locally)

- `lineChart` has no vertical bands or markers. I used `chartBand` in `draw.mjs`, which reads the axis path, so it is brittle.
- No log axis. I plotted log10 values with a tick formatter (Fig 7) and an index axis with labels (Fig 8).
- No point markers and no direct line labels on `lineChart`, so measured points are joined by a dotted line.
- No cell-grid or lane-timeline primitives. `cellGrid` and the lane drawing are local to this article.
- Series that share a kind cannot get distinct colours, so I told them apart with dashes and the `neutral` kind.
- The clock cannot be offset after a warm-up inside `create` (Fig 9 uses `clock={false}` and its own time readout).
- `Choice` changes cannot ask `mountSim` to keep the time while rebuilding the model; Fig 5 restarts on each policy.

## Openings compared with the references

The reference essays open with a concrete thing the reader can picture, then the question. This opening does the same: the introduction's `SET product:42 … EX 60` and "why 60?". It then names the two ways keys leave and the two bad defaults. Its third paragraph, a list of what the reader will be able to do, is plainer and longer than the references' openings, which let the first figure carry that. An editor might cut it to one sentence.
