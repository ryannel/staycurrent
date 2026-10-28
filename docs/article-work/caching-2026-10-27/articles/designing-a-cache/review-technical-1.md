# Technical review 1: Designing a cache: a worked example

Reviewer: independent technical reviewer, round 1, 2026-10-28.
Source: `src/articles/caching/designing-a-cache.astro`, `src/components/caching/designing-a-cache/`.
My commands and output: `docs/article-work/caching-2026-10-27/evidence/designing-a-cache-review-1.txt` (sections M0–M4, R1–R3, P1 are cited below).

## Verdict

**Revise before publication.** The budget arithmetic is careful and almost every number in the prose comes out of the model as stated (M1). The illustrative numbers are labelled as illustrative throughout. The paced LRU/LFU measurement is valid for what it measures, and the article mostly does not claim more than it shows. However, Figure 2 runs at 1/100 of the shop's catalogue, and the prose then quotes its recovery times as the shop's. At the shop's real size those times are off by two orders of magnitude, and the design's two-minute ramp would fail. Several statements also contradict the earlier articles or Redis behaviour I observed: ACL users are not replicated, a full resync forks the primary, the app user can SCAN, and an AOF everysec store with an asynchronous replica can still lose a basket. The alert threshold is also mislabelled.

**Counts: 8 required, 14 suggested.**

## Required

### R1. Figure 2's times do not transfer to the shop, and the prose says they do

The playground uses 20,000 products and a 14,000-key cache (`PLAY`, playground-model.mjs). The shop has 2,000,000 products and holds 1.5 million. Refill time grows with the number of keys that must be filled, so recovery times scale roughly with the catalogue. The prose quotes the model's times as the shop's:

- "losing it costs ten seconds of downtime and then an empty cache. Pages fail for about 35 seconds while the database refills it". I ran a fluid model of the same limit (240 product queries a second admitted) at both scales (M4). At the playground's scale, refusals end after about 27 s, which agrees with the figure. At the shop's scale with one query per page, about 50% of pages are refused at 10 s, 23% at 5 minutes, and refusals end at about 33 minutes. With the design's real two keys per page (details and stock), they end at about 2.3 hours, with 1.2 million pages refused.
- The ramp: "sends 5% of reads to the new keys at first and all of them two minutes later … the limit refuses a few product pages for a second or two; no checkout fails". At the shop's scale a two-minute ramp is nearly a cold start. Peak demand is about 1,260 queries a second against 240 admitted, with refusals for about 2.3 hours (M4). Even a two-hour ramp still refuses pages.
- "The database is asked for over a thousand queries a second" understates the shop. Every page needs two keys, so an empty cache asks for more than 2,000 queries a second. The playground models one query per page.

A practitioner would come away thinking an empty restart of this shop costs half a minute and a two-minute ramp is safe. Neither is true, and the second is a recommendation in "The design on one page" ("key versions ramped").

**Correction.** Say in the caption and the prose that the scaled-down catalogue refills about 100 times faster than the shop's. State the shop-scale consequence: an empty restart or a new key version means hours of refused pages. That strengthens the case for the replica and changes the deploy advice. For this shop, a version change should either read the old key on a new-key miss and convert it ("reading the old cache first", which Operating a cache already names), or be warmed by a paced background job off-peak before traffic moves. A ramp measured in hours is a weaker fallback. Alternatively, scale the playground's time, for example by stating times as "per 1% of catalogue". Remove "for a second or two" and the two-minute ramp from the design table.

### R2. ACL users created with `ACL SETUSER` are not on the replica: the first failover locks the application out

The article creates the users with `ACL SETUSER` ("I created both users…" and the code block), and the design fails over to a replica through Sentinel. I ran a primary on 7172 and a replica on 7173 (R2). After the full sync, the replica's `ACL USERS` showed only `default`. A user created on the primary afterwards also never appeared. `AUTH` as `shop-app` on the replica failed with `WRONGPASS`. ACL rules are configuration, not data, and are not replicated. After a promotion, every application instance would fail to authenticate. The cache would effectively be lost, so the 5-second failover would become a cold start at shop scale (see R1). This combination is exactly what the article built the topology to avoid.

**Correction.** Say that users are defined in every server's ACL file (`aclfile`) or configuration, kept identical, and deployed with the servers. Note that Sentinel and the replication link need their own users if `default` is disabled (`masteruser`/`masterauth`, `sentinel auth-user`; redis.io "ACL rules for Sentinel and Replicas"). Present the `ACL SETUSER` lines as the content of that file, or as a test, not as how the users get onto the servers.

### R3. "With persistence off there is no fork to allow for" is wrong for a primary with a replica

With `--save '' --appendonly no`, connecting a replica made the primary fork: the log shows "Starting BGSAVE for SYNC with target: replicas sockets", "Background RDB transfer started by pid …" and "Fork CoW for RDB", and `INFO stats` reported `total_forks:1` (R2). Diskless sync still forks. Every full resync forks the primary: the initial sync, a replacement replica, or a break longer than the backlog. Operating a cache already says copy-on-write pages appear "during a snapshot or a replica's full synchronisation". The 8 GB server probably still has room, because a read-mostly cache writes few pages during a sync, but the stated reason is wrong.

**Correction.** "With persistence off, the only fork is a replica's full synchronisation; on a read-mostly cache its copy-on-write cost is small, and 8 GB leaves room for it."

### R4. The page alert is mislabelled: "misses passing 210" pages at 90% of capacity

Figure 1's alert line is drawn on total database load: misses plus checkout's 60. The budget text derives 210 as 70% of capacity for all queries. Yet "Watching and securing it" says "Page on the database's queries a second from misses passing 210", and the design table says "Misses against 210". At the design point, misses are about 93 and the total is 153. If misses had to reach 210, the database would be at about 270 a second (90% of capacity) before anyone was paged.

**Correction.** Page on total database queries a second passing 210, or on misses passing 150. Fix both places.

### R5. Sessions and baskets: "never lost" is not what AOF `everysec` plus an asynchronous replica gives

The requirements table says sessions and baskets may be "Not at all [out of date], and never lost". The design gives them `appendfsync everysec` and a replica. Redis's persistence documentation says `everysec` can lose about a second of writes on a crash. Replication is asynchronous, and the replication article in this collection says Redis "can still lose acknowledged writes at failover" even with `WAIT`. Its own default for non-cache data is "AOF with everysec at least, WAITAOF or WAIT for writes that matter, perhaps min-replicas-to-write, and the knowledge that Redis replication can still lose acknowledged writes". As written, the design does not meet its own requirement and drops the earlier article's caveats.

**Correction.** Either relax the requirement ("may lose the last second of changes in a crash or failover") or keep baskets in the database. If baskets stay in Redis, add `WAITAOF`/`WAIT` for basket writes and `min-replicas-to-write`, and say what each does and does not guarantee.

### R6. Figure 1 treats stock as never evicted, though both families share one `allkeys-lru` Redis

`budget()` limits product details by memory, but computes stock with `family({ ttl })` and no capacity. Stock therefore stays at about 98% present ("about 1.8 million stock levels") while only 1.5 million products fit. In the one Redis the design specifies (one `maxmemory`, `allkeys-lru`), both keys are read together by one `MGET`. They have the same recency, so LRU keeps or evicts them together. Also, "3 GB for products" is not a Redis setting: with `maxmemory` 3.5 GB, LRU would give product and stock pairs about 3.5 GB between them. I recomputed with one LRU over pairs of 2,229 bytes (M3):

| | Writer's model | One shared LRU |
|---|---|---|
| Keys in 3.17 GB (the article's product + stock memory) | 153 total; stock 41 | 180 total; stock 69 |
| Keys in 3.5 GB (`maxmemory`) | — | 147 total; stock 53 |
| Skew 0.8 at 3.5 GB | — | 181 |

The design survives, but its headroom below the alert line is not 57 queries a second. The stock row ("collapses to 41") and the memory slider label ("Memory for product details") describe something Redis does not do.

**Correction.** Model one LRU over both families with `maxmemory` as the slider, or say plainly that the figure assumes stock is never evicted and why. Then restate 153, the 41, the headroom figure in the bulk-reprice paragraph, and the "What would change" numbers from the corrected model.

### R7. The library's default retries contradict "not retried", and break the lease and lock on a timeout

"Talking to Redis" says a timed-out read "is treated as a miss, not retried". Redis clients established that redis-py 8 and go-redis v9 retry by default after timeouts. With 50 ms timeouts, redis-py took a median 3.6 s to fail. It also showed that a retried `SET … NX` "is refused, so the client believes someone else holds it". The design's lease and trending lock are both `SET … NX`. The design does not say to turn the library's retries off, so following it with default settings gives seconds-long reads and false "someone else holds the lease" results. That is the outcome the clients article warns about.

**Correction.** Add one sentence: turn the library's retries off (`retry=Retry(NoBackoff(), 0)` in redis-py; `MaxRetries: -1` in go-redis). Retry nothing on reads. Treat a lease or lock `SET … NX` that timed out as "unknown": go to the database without filling, or release with `DELEX … IFEQ`. Put "library retries off" in the design table's Client row.

### R8. "Neither can flush, scan or reconfigure the cache": the application user can SCAN every key

With the article's exact `shop-app` rule, `SCAN 0 COUNT 100` succeeded and returned `other:key`, a key outside `~shop:*` (R2). `SCAN` is `@keyspace @read @slow`, not `@dangerous`, and key patterns do not filter `SCAN`'s results. FLUSHALL, KEYS and CONFIG SET were refused as stated, and the relay's refusals were reproduced.

**Correction.** Add `-scan` to the application's rule, or drop "scan" from the Access row and say the application can list keys.

## Suggested

S1. **The LFU comparison compared unequal caches.** The writer's E2 output shows `allkeys-lru` held 29,851 keys and `allkeys-lfu` 30,824 (3% more), because each run sized `maxmemory` from its own bytes-per-key measurement. Che's approximation puts the size difference alone at about +0.55 points (M2), so about a fifth of LFU's 2.8-point lead is cache size. Each policy also had one run, with a 2-minute warm-up, which is short for LFU counters that decay per minute. The pace itself is valid. At 5,000 reads a second, keys at the cache's edge are read about every 47 s (M2), well above the 1-second LRU clock, so the LRU-against-Che check (76.9% against 77.3%) holds. The article does not claim LFU loses in the shop on the strength of the measurement; it reasons from the decay rule and says to replay real traffic. That reasoning is sound: a key read every 3 hours has decayed to a counter of 0 or 1, below a new key's 5. Report the key counts, or rerun at an equal number of keys, and say "one run each". Also reword "LFU's memory of a minute". A counter loses one per minute, so a high count lasts many minutes. What matters is that a key read less often than once a minute never builds a count above a new key's 5.

S2. **Name the departure from Cache invalidation's TTL rule.** That article says to give every key the TTL of "how long a wrong value may be shown" because it is "the only remedy that caps every failure". This design deliberately sets 24 hours against a 1-minute target. The reasoning is in the article; say explicitly that this is a departure and what it costs. Any unforeseen failure, such as a failover beyond the replay window, a key-building bug, or a missed key family, shows a wrong price on popular pages for up to a day. Consider a cheap guard: a background checker that samples cached prices against the database and alerts on mismatch. Checkout reading the database is what makes the risk acceptable; say so.

S3. **Lease details the design omits, all established in Cache invalidation.** Readers must recognise a placeholder that `MGET` returns. I observed that `MGET` returns `lease:r9` for both keys (R1). Say what a reader does when it finds another reader's lease: go to the database without filling, or wait briefly. The fill must pass `EX` with the jittered TTL. `SET … IFEQ` without `EX` left `PTTL` at -1, a key that never expires (R1). Fills must read the primary database, because leases do not cover a lagging replica.

S4. **Trending panel on a cold start.** Serve-stale needs a stale copy. After an empty restart there is none, and 500 requests a second find the key missing. Say what they do: poll briefly, then render a default or empty panel, as Cache stampedes advises, rather than going to the database. Also say that the 200 ms rebuild query has a database-enforced statement timeout shorter than the 5-second lock (that article's 2 s).

S5. **Pre-8.4 fallback and the ACL.** "Before Redis 8.4, the conditional fill is a short Lua script". The `shop-app` rule refuses `EVAL` (observed: NOPERM). Say that the fallback needs `+@scripting`.

S6. **Key-version rollback.** Cache keys and cached values says to keep deleting under the old version "until a rollback is no longer possible". With a 24-hour TTL, a rollback would serve old-version entries that nothing deleted for up to a day. Add the rollback case to the relay's both-names rule.

S7. **Bytes per entry come from libc malloc.** I reproduced 2,130 and 101 bytes (R3), in agreement with E1. However, the article sizes a production server from them. jemalloc's size classes (a ~1.8 KB allocation rounds up to 2 KB) can add several per cent on Linux. The brief asks not to present this build's memory as typical. Add "measure on your production build" next to the 2,131.

S8. **"Each of those reads finds its copy already expired"** is too strong. The products read less than once a minute hit up to rT ÷ (1 + rT) < 50% of their reads, not 0%. Say "most of those reads miss".

S9. **Twice the traffic: wording.** The 120 is checkout's queries, 80 reads and 40 writes, not "checkout reads". And checkout does not grow "fastest": at 3 GB, product misses double too (52 to 101, M3). Checkout is the part more memory cannot reduce. Say that.

S10. **Expiry ceiling with jitter.** With ±10% jitter the shortest TTL is 21.6 h, so the ceiling is about 2,000,000 ÷ 77,760 ≈ 26 a second, not 23. This is a small point, but the sentence says "at most".

S11. **Failover time.** The playground's 5 s sits below the 6 s that Redis replication, persistence and failover modelled for "a few seconds" of `down-after-milliseconds`. Sentinel's time is down-after plus election plus client rediscovery. Use 6 s, or say where 5 s comes from.

S12. **Replaying deletes after failover.** Say what triggers the replay, for example the relay subscribing to Sentinel's `+switch-master`. Otherwise "keeps the last few minutes" has no mechanism.

S13. **Figure 1 label overlap.** At 1280 px, the capacity-300 rule is drawn through the "578" segment label (P1). Offset the label or the rule. Otherwise the figures render without console errors and fit at 375 px.

S14. **Che source link.** The crystal.uta.edu PDF returned 403 to a plain request. It may block scripted fetches only. Check it in a browser, or add a DOI.

## Checked and correct

- The TTL table (42/62/80/93/98%; 578/377/204/69/21 misses), 4,152 products read at least once a minute, the 59% tail share, 80% of products under once an hour taking 19% of reads, 30 reads a second for the top product, the median product read about every 2.3 h, stock at 25% and 748, 1,386 and 0.07 GB, 222/153/95%/4 GB fits, 113 with checkout reading Redis, skew 0.8 (92%, about 180), twice traffic (282, 94%; 204 at 4 GB). All reproduced by an independent implementation (M1, M4 check4).
- The Che approximation is applied correctly: present share and hit share are 1 − e^(−r·t_C), with t_C solved so that the expected keys fill the capacity. The min(TTL, LRU) combination is a heuristic, but the writer's test checks it against a simulated LRU with TTLs to within one point. The least popular product kept at 3 GB is read about every 3.1–3.4 h (M2), matching "about once every three hours".
- The E2 measurement was paced in real time (5,000 a second, batches every 10 ms, 4 minutes), not replayed fast. LRU's clock resolution does not distort it (M2).
- The lease sequence, the refused late fill, `DELEX … IFEQ` replies, and the ACL refusals for FLUSHALL, KEYS, CONFIG SET, a foreign key, and the relay's GET and trending delete (R1, R2).
- Stampede scores (0.15, 0.5, 100), Little's law (60), the 45/60 split leaving 240 a second for products, the network estimate (≈3.3 MB/s), and jitter spreading refills over 4.8 h.
- Consistency with earlier articles: cache-aside with commit-then-delete and an outbox (Caching patterns, Invalidation), replaying deletes after failover (Invalidation; Replication), a rebuild lock with `SET NX PX 5000` and a `DELEX` release plus serve-stale (Stampedes), a replica with no persistence and no automatic restart, Sentinel and `SENTINEL FAILOVER` (Replication's default list), `allkeys-lru` with 5 samples and a separate `noeviction` instance for non-cache data (Expiration and eviction), and one round trip with no read retries and timeouts from measured latency (Clients). The exceptions are R2, R3, R5 and R7 above, and S2.
- Every `ArticleRef` hash exists in its target article. Breslau's 0.64–0.83, the SRE book's capacity-cache definition, and the memcache paper's regional invalidation and remote markers match their sources.
