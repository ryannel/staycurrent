# Final review 2: Cache expiration and eviction

Reviewer: independent pre-publication review, round 2 (fresh reader).
Read: `brief.md`, the full text of Gears and Load Balancing (several of their simulations run in a browser), this article's entry and its neighbours' in `plan.md` (including "Map changes after research"). Then I read the rendered article at `CACHING_DRAFT_PREVIEW=1`, port 4474, from top to bottom and used every figure and control (Playwright, 1280 px and 375 px, light and dark, reduced motion). I also checked the evidence file, the model code (`sampled-cache.mjs`, `scan-model.mjs`), the Redis 8.10.3 source (`expire.c`, `evict.c`, `server.h`), the redis.io eviction page, the ElastiCache serverless page and Valkey's `config.c`. On Redis 8.10.3 (port 7174, temporary directory, `--save ''`, shut down afterwards) I confirmed the ten policy names, the `lazyfree-lazy-eviction`/`-expire` defaults, and that a hash with only field TTLs is counted as `expires=0`: under `volatile-lru` it is never evicted, and writes are refused with OOM.

Screenshots are in `final-screens/`: `{light,dark}-{desktop,phone}-NN.png` for each figure, and `x-NN-*.png` for the interaction states quoted below.

## Verdict

**Publish after the two blocking fixes below.** Both are small. The article is strong and stands beside Gears and Load Balancing. It starts from a command the reader already wrote. It derives the TTL trade-off in a few lines and then shows it, and it measures what most writing on Redis only asserts: memory held by expired keys, the 26 ms expiry pause, a single 8 MB value emptying a cache. The pace dependence of LRU and LFU is handled better than anything I know of in print. Figures 2, 4, 5, 8 and 9 each isolate one variable and make the point at a glance.

Blocking: 2. Minor: 8.

## Blocking

### B1. Figure 1 shows the opposite of the lesson when the reader does what the prose asks

The prose says to drag the TTL to 30 s, then down to 3 s, where "the opposite happens". The copy stored while the TTL was 30 s keeps its 30-second TTL after the slider moves, which is realistic. But the "so far" readouts start counting at the slider change, so every read in the first stretch at 3 s is a hit on that old, increasingly stale copy. At 1× speed, after 10 → 30 (held 15 s) → 3, I saw:

| After moving to 3 s | Hit ratio so far / long run | Stale so far / long run |
| --- | --- | --- |
| +3 s, +6 s, +10 s | 100% / 75% | 100% / 5% |
| +20 s | 97% / 75% | 82% / 5% |
| +30 s | 92% / 75% | 72% / 5% |

(`x-01-ttl3.png` shows the same at 4×: 95% / 75% and 71% / 5% after about 30 simulated seconds.) For half a minute and more, the figure tells the reader that a 3-second TTL gives more hits and far more stale hits, which is exactly what the paragraph says it will not. The long-run figure beside it does not rescue this: a reader sees "100%" stale and stops trusting the figure. Round 1 R2 fixed the noise but not this carry-over.

*Fix:* start the "so far" counters at the first miss after a TTL change, when the first copy stored under the new TTL appears, and say so in the caption ("count from the first copy stored with the new TTL"). Alternatively, end the current copy when the TTL changes and say that this is a modelling convenience. Then check 10 → 30 → 3 at 1× again.

### B2. A model result is reported as a Redis result in "Approximated LRU"

"On the workload of the next section at a steady 5,000 requests a second, Redis's LRU with 5 samples came within 0.1 points of an exact LRU's hit ratio at the smallest cache size, and 10 or 64 samples gained less than that." This comes from the article's model (evidence M8: 0.1939 against an exact 0.1949; 10 samples 0.1945; 64 samples 0.1947). It was not measured on Redis, and an exact LRU cannot be run on Redis at all. The model matches real Redis only to within 0.6 points, so a 0.1-point difference presented as a Redis observation overstates what was observed. This is the one place where the article breaks its own model-versus-measurement discipline, and it does so in a measured eviction comparison.

*Fix:* "In this article's model of Redis's eviction, on the workload of the next section at a steady 5,000 requests a second (about 15 requests a minute per cached key at the smallest size), 5 samples came within 0.1 points of an exact LRU, and 10 or 64 samples gained less than that." The advice "Leave `maxmemory-samples` at 5" can stay. It is also supported by the measured benchmark row, where 64 samples recovered nothing (M8, 80,000/s).

## Minor

1. **The paced real-server check compares caches of different sizes, and one run lost its pace.** Under the same `maxmemory`, `allkeys-lru` held 3,773 keys, `allkeys-lfu` 5,029 and `lfu-decay-time 10` 4,448 (P1). The article says LRU's cache "held only 3,800 keys" but neither says why nor gives a like-for-like number. A reader will read 22.5% against 17.7% as a 5-point LFU lead at this pace. The model at equal size (C = 5,029) gives about 22.7% against 19.6%, roughly 3 points. Also, the LFU decay-1 run fell up to 48.6 s behind its 400-a-second schedule and then caught up in a burst; the article does not mention this. *Fix:* add the equal-size model comparison in one clause ("at equal size, the model puts LRU about 3 points behind"). Note that the key counts differed under the same limit on this libc-malloc build. Mention the 48 s lag, or rerun that case. Also give the full-speed run's pace: "as fast as possible (about 18,000 a second, roughly 240 a minute per cached key)". Change "5 to 6 a minute" to "about 5 to 6½", since the evidence gives 4.8 to 6.4.

2. **Two pace claims go beyond the paces modelled.** The closing says `allkeys-lru` "at a production pace, matches an exact LRU". Para 149 says keys "live for minutes, as most production caches' do". The support is the 5,000-a-second model (0.25 to 15 requests a minute per cached key) on a stationary Zipf 0.8 workload. *Fix:* bound the claim to that pace: "once each cached key is read no more than about once every few seconds, it comes within a fraction of a point of an exact LRU in the model". Drop "as most production caches' do", or replace it with the condition (keys that stay cached for minutes).

3. **"Up to about a tenth" is the expiry cycle's aim, not a bound to size memory by.** The article's own evidence shows more. In E1, 20% expired on an idle server was still about 17% after 40 s, reclaimed at about 350 a second, which is minutes for 100,000 keys. In X5b, about a fifth of the keys were expired but held at +6 s. Para 46 reports only the busy-server half of the 20% experiment. *Fix* (para 47, and the matching clause in "What you can now decide"): "about a tenth on a busy server in steady state; after a burst of expiries, and on a quiet server where only the 10-a-second cycle runs, a fifth or more for minutes".

4. **Length.** At about 5,800 words and nine figures, the length is earned almost everywhere. Every section changes a decision: the TTL formula sets the TTL; the expiry measurements set memory headroom and rule out expiry events as timers; the latency run makes jitter a Redis concern; the 8 MB story, the policy figure and the ElastiCache default set the policy; the LFU counter and decay sections set `lfu-decay-time`; the scan section sets batch-job routing. The one stretch that spends reading time without changing a decision is the second half of "How Redis expires keys" (paras 45–46, about 300 words). That is the fast-cycle trigger rules and the two reclamation experiments, given in full. The reader needs the outcome: about 200 keys a second examined once the expired share is low, so a full pass takes the number of TTL keys ÷ 200 seconds, and a burst is cleared quickly only on a busy server. *Fix:* compress both paragraphs to about half and keep those numbers. Moving the 4.8% and 20% runs into the evidence note costs the reader nothing.

5. **`expired_time_cap_reached_count`.** The source (`expire.c`) increments it whenever any cycle hits its time limit: the 25 ms slow cycle or a 1 ms fast cycle. "Used its whole 25% slice" describes only the first. *Fix:* "How often an expiry cycle ran out of its time budget and stopped".

6. **The 26 ms pause is specific to `hz 10`.** `dynamic-hz` is on by default and raises `hz` when many clients are connected, which shortens each slice but keeps the 25% share. *Fix:* add one clause after "at `hz` 10": "(with many clients connected, Redis raises `hz` and the slices get shorter, but not the total)".

7. **"Climbs by 10 to 20 points for each tripling of the cache."** The first step on the axis (0.5% → 1%) is a doubling, and LFU's steps are 4 to 16 points. *Fix:* "climbs by roughly 5 to 20 points at each step of the axis".

8. **LRM and the documentation.** The redis.io eviction page pitches `allkeys-lrm` for read-heavy workloads where you want to "preserve frequently read data". The article reads the mechanism correctly: reads do not count, so keys that are only read are evicted first. A reader who goes to the docs will find what looks like the opposite claim. *Fix (optional):* add half a sentence: "despite the documentation's framing, a key that is read constantly but never rewritten is the first to go".

## Checked and correct

- **TTL arithmetic.** 10/11 hits and about 15% stale at T = 10 s; 1 in 800 at 9 s with one change an hour; about 7% at 9 minutes; jitter at 83 refills a second against 16.7. All re-derived, and the figures' long-run values match.
- **Expiry cycle (8.10.3 `expire.c`).** 20 keys per loop, repeat while more than 10% expired, 25% time limit, fast cycles of 1 ms when the stale estimate is 10% or more or after a time-limit exit, and `active-expire-effort` adjustments. The `redis.conf` quotation is accurate.
- **Eviction (`evict.c`, `server.h`).** Pool of 16, the insertion rule as described, LFU starting value 5, increment probability `1/((c−5)F+1)`, and decay subtracting one per period. The access counts 105, about 9,945 and 311,500 are right.
- **Ten policies, defaults and freeing.** All ten policy names are accepted on 8.10.3, and lazy freeing for eviction and expiry is `no` by default (both checked live). Volatile policies ignore hashes with only field TTLs (checked live). Replica and AOF buffers are excluded from `maxmemory`.
- **redis.io eviction page.** It calls `allkeys-lru` a good default, recommends separate instances for cache and persistent data, says `volatile-*` behaves like `noeviction` without TTLs, and gives the `evicted_keys`/`expired_keys` diagnosis. All are as stated. ElastiCache serverless fixes `maxmemory-policy` at `volatile-lru`, and Valkey's `config.c` has no LRM policies.
- **Evidence numbers.** Every measured number in the text matches its evidence entry: X4, X5a/b, X6, X7 (2,367 + 1), X9a/b, X10, X11b, P1 and E1. The model reproduces X10 to within 0.6 points.
- **Pace statements (apart from B2 and minor 2).** Figure 8's caption and readouts give the pace of each line ("4 to 240" and "0.25 to 15" requests a minute per cached key) and keep the measured circles separate from the modelled lines. Figure 9 labels its paces, and its text alternative matches the model runs (M7).
- **Figures.** No console errors and no horizontal overflow at 375 px. Both themes are legible. With reduced motion, nothing autoplays (Play is shown and time is 0). Every figure has a caption that says what is modelled and a text alternative that carries the result. Figure 5's glyph clash from round 1 is fixed. Internal links go through `ArticleRef`, and `how-redis-works#freeing` resolves.
