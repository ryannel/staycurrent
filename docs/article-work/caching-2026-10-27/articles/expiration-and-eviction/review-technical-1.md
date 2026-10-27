# Technical review 1: Cache expiration and eviction

Reviewer: independent technical reviewer, round 1. Article: `src/articles/caching/expiration-and-eviction.astro`, figures in `src/components/caching/expiration-and-eviction/`.

Evidence: `docs/article-work/caching-2026-10-27/evidence/expiration-and-eviction-review-1.txt`. It has my Redis 8.10.3 runs on port 7154 (R1 to R6), model runs that use the article's own `.mjs` code (M1 to M4), the source excerpts (S1) and the scripts. I read the Redis source at tag 8.10.3 (`expire.c`, `evict.c`, `object.c`, `object.h`, `server.h`, `db.c`, `config.c`, `redis.conf`), plus `expire.c` at 5.0.0 and 6.0.0 and `config.c` at 8.4.0 and 8.6.0.

## Verdict

The article is mostly accurate and carefully sourced. The source-level claims about the expiry cycle, the LFU counter, decay, policy names and defaults are correct. Three problems need fixing before publication. The article says expired keys are reclaimed within a fraction of a second, which is wrong for a real server. The measured comparisons of LRU and LFU are presented without the timescale that decides them. The eviction pool is described wrongly. There are also three smaller sourcing errors.

**Counts: 6 required, 9 suggested.**

## Required

### R1. "An expired key is gone within a fraction of a second" is wrong for a real Redis

Where:
- Prose after Figure 3: "With the cycle on, an expired key is gone within a fraction of a second."
- Figure 3's text alternative: "dashed squares vanish within a fraction of a second".
- Closing section: "from memory, key counts and notifications a little later".

Evidence: The 10% rule the article quotes means the cycle stops after one 20-key pass whenever 10% or fewer of the keys it looked at had expired (`expire.c`: `repeat = … (expired*100/sampled) > 10`). The fast cycle also stays off below about 10% (it runs only after a time-limit exit or when `stat_expired_stale_perc` ≥ 10%). The cycle also does not pick keys at random. It walks the table of keys with a TTL with a cursor (`kvstoreScan(db->expires, db->expires_cursor, …)`). At `hz 10` and below the threshold, it therefore examines about 200 keys with a TTL a second.

I measured this (R5). I loaded 500,000 keys with `EX 3600` and 25,000 keys with `PX 2000`, interleaved, so the short keys were 4.8% of the keys with a TTL. Forty seconds after the short keys expired, the cycle had reclaimed 425 of the 25,000, about 10 a second. At that rate the rest would take about 40 minutes. A full `SCAN` removed all of them at once. The X4 drain in 0.5 s that the article cites is the opposite case: every key with a TTL had expired, so every pass found more than 10% and repeated.

Figure 3's model reclaims promptly only because its keyspace is tiny. About 35 keys are in memory, so a 20-key sample covers most of them every 100 ms.

Correction:
- Say that the cycle reclaims quickly only while expired keys are a large share of the keys with a TTL. Below about 10% (the default effort), it deliberately leaves them, and an individual expired key can stay in memory for minutes or longer on a large instance.
- In Figure 3's caption, say that the model's keyspace is so small that each pass sees most keys, which a large server's pass does not.
- Change "a little later" in the closing section, and in the notifications bullet, to say the delay can be long.
- The `expired_stale_perc` row in the INFO table is the right place to point readers to.

### R2. Redis LRU against random and exact LRU (X10): the clock artefact is misattributed and one range is wrong

Where: "Third, Redis's LRU beats random eviction by only 1 to 4 points at any size." Also in "A clock that ticks once a second": "at larger sizes the gap shrank to under a point. Sampling accounts for part of that gap and the coarse clock for the rest; these runs cannot separate the two."

Evidence:
- **The range.** From the writer's X10 table, Redis LRU minus random is 0.5, 1.4, 3.0, 3.9 and 2.8 points. At the smallest size the margin is 0.5, not 1 to 4.
- **Exact LRU is no better against random.** The writer's exact-LRU column beats random by only 2.2 to 4.4 points at every size. So the small margin is a property of independent Zipf requests, not of Redis's approximation. The reader is not told this and will conclude that Redis's approximation is barely better than random.
- **The gap to exact LRU.** It is 1.3 points at 40,000 keys, so "under a point" holds only from 120,000 keys.
- **The two causes can be separated.** I used the article's own `SampledCache`, with requests spaced at 80,000 a second as in X10 (M1). The model reproduces Redis to within 0.1 point: 0.1793 against a measured 0.1783 at 20,000 keys, and 0.2307 against 0.2300 at 40,000. Changing only the clock from 1 s to 1 ms raises sampled LRU (5 samples) to 0.1938, against 0.1945 for exact LRU. The one-second clock therefore accounts for nearly all of the gap (1.45 of 1.53 points). Sampling accounts for almost none.
- **More samples do not help here.** With the one-second clock, 64 samples give 0.1797 against 0.1793 with 5. At this turnover, `maxmemory-samples` appears useless. This is exactly the artefact the commission warned about.

Correction:
- State the request rate, about 80,000 a second.
- Say that Redis LRU beats random by 0.5 to 4 points and exact LRU by 2 to 4.
- Say that at the smallest size Redis's LRU is close to random because the cache turns over in a third of a second, which the one-second clock cannot resolve.
- Replace "these runs cannot separate the two" with the model result, labelled as a model: almost all of the gap is the clock, and raising `maxmemory-samples` does not recover it.
- Add one sentence to the clock subsection: raising `maxmemory-samples` cannot fix ties in whole seconds.

X8 (the samples table) is free of this artefact, because its idle times are set with `RESTORE IDLETIME` and run from 1 to 50,000 s. That is worth saying, because it is the measurement that supports "leave it at 5".

### R3. The LFU results depend on request rate, and the article does not say so

Where:
- "Second, LFU beats LRU at every size, by 10 points at the smallest".
- Figure 9 and its prose: "The LFU cache barely notices".
- X11b ("53% to 51%").
- Closing advice: "`allkeys-lfu` when popularity is stable or scans read through the cache".

Evidence: Both of Redis's approximations run on wall-clock time. LRU has a one-second clock. LFU loses 1 per `lfu-decay-time` minutes. Every measured run lasted about one to two minutes at about 75,000 to 80,000 requests a second, so LFU counters barely decayed. The cache sizes made LRU's one-second clock matter at the small end.

The article's own model shows how much the timescale matters:
- **X10, 20,000 keys (M2).** At 80,000 requests a second, LFU scores 0.281 and LRU 0.179, a 10-point lead. At 5,000 a second, LFU scores 0.243 and LRU 0.194, a 5-point lead. At 1,000 a second, LFU scores 0.217 and LRU 0.194, a 2-point lead.
- **Figure 9 with its timescale stretched (M4).** Rates were divided by k and times multiplied by k. At 300 requests a second, LFU drops from 0.493 to 0.483 during the job, 2%. At 10 requests a second, LFU starts at only 0.435 and drops to 0.345 during the job, 21%. LRU is unchanged at about 0.418 falling to 0.302.

The mechanism is in the source, and the article already states it ("Once it falls below 5, it is a better eviction candidate than a key that was just added"). A key read less often than about once per `lfu-decay-time` decays below the starting value of 5 that every one of the job's keys receives. Under LFU, such keys are evicted before the scan's keys.

The figure has 0.6 requests a second per cached key, and X10's smallest size has about 4. A production cache of a million keys at 10,000 requests a second has 0.01, which is the regime where decay dominates.

Correction:
- Give the request rate and run length of X10 and X11.
- Say that LFU's lead and its resistance to scans hold for keys read several times per `lfu-decay-time`. Slower keys decay below new keys, and scans then displace them too.
- Qualify the closing advice. Keeping batch jobs out of the cache is the robust remedy. `allkeys-lfu` helps only when the keys you want to protect are read more often than the decay period, and `lfu-decay-time` can be raised.
- Ideally, confirm one point on a real server with a rate-limited run. The numbers above are from the article's model, which matched Redis at 80,000 a second, and are labelled as a model in the evidence.
- Figure 9's caption should say that its timescale is compressed, so LFU's decay never acts.

### R4. The eviction pool is misdescribed

Where: "picks `maxmemory-samples` keys at random … and adds the most idle of them to a pool of up to 16 candidates".

Evidence: `evictionPoolPopulate` (`evict.c`, 8.10.3) inserts every sampled key that fills an empty slot or is idler than the least idle candidate in the pool. When the pool is full, the least idle candidate drops out. The article's own `sampled-cache.mjs` and Figure 6's text alternative ("adds the ones that have been idle longest") do this correctly. Only the prose is wrong.

Correction: "…and puts each of them into a pool of the 16 most idle candidates seen so far, if it is idler than the least idle one already there."

### R5. "Two older descriptions disagree with this" names only one

Where: the LFU decay paragraph.

Evidence: Only antirez's 2016 post (news/109) describes halving: "the value of the counter is halved if it is an high value, or just decremented if it is a lower value". The redis.io eviction page says "Decay the counter every one minute" and "the amount of minutes a counter should be decayed". It does not mention halving, so it does not disagree with the source.

My observation agrees with the source and the article (R4 in my evidence file). Keys restored at 100, 30 and 12 read 99/29/11, then 98/28/10, then 97/27/9, losing 1 at each minute boundary. Halving would have given 50 and 15.

Correction: "An older description disagrees…", or name the second source if there is one.

### R6. The Facebook figure is attributed to the wrong change

Where: "short-lived keys sat in memory long after they had expired until it added a structure to remove them promptly; for one heavily used family of keys their share of the pool fell from 6% to 0.3%".

Evidence: Nishtala et al. 2013, section 6.3: "When we added a short expiration time to a heavily used set of keys whose items have short useful lifespans; the proportion of memcache pool used by this key family was reduced from 6% to 0.3% without affecting the hit rate." The reduction followed from giving those keys a short expiration time, which the Transient Item Cache then reclaimed promptly. The keys did not already have short TTLs that were waiting to be found.

Correction: "…Facebook added a structure that removes short-lived keys as soon as they expire; when it then gave one heavily used family of keys a short expiration time, that family's share of the pool fell from 6% to 0.3% without affecting the hit rate."

## Suggested

1. **Cycle timing.** "Ten times a second … 25 ms out of each 100 ms" holds at `hz 10`. `dynamic-hz` is on by default (X1) and doubles `hz` while there are more than 200 clients per tick. The limit is still 25% (`timelimit = 25%·10⁶/hz`), but each slice is shorter, so the 26 ms pause measured in X5 is specific to `hz 10`. The limit is also on elapsed time, not CPU time, and is checked every 16 passes. The extra fast cycles also run when the estimated stale share is 10% or more, not only after a cycle runs out of time.
2. **`DEBUG SET-ACTIVE-EXPIRE`** works only when `enable-debug-command` allows it, which is off by default since Redis 7.0. Say so, and say it is not for production.
3. **The `noeviction` paragraph.** "Every command that would add data failed" understates it. Any command flagged as possibly needing memory (`denyoom`) is refused, including a plain `SET` that overwrites an existing key (`redis.conf`: "commands that create new keys, add data or modify existing keys"). That matters for update-on-write.
4. **TTL table, `GT`.** Redis treats a key without a TTL as having an infinite one for `GT` and `LT`. `EXPIRE key 600 GT` on a key with no TTL therefore does nothing, which can surprise someone using `GT` to extend TTLs.
5. **Jitter snippet.** `EX` takes an integer, so `EX 600 × (0.9 + 0.2 × random())` needs rounding, or use `PX`.
6. **X7 arithmetic.** `evicted_keys` was 2,368 in total, including the 8 MB value, so 2,367 small keys were evicted, not 2,368.
7. **X11a pause sentence.** An exact LRU would also keep none of the 1,000 popular keys, with or without the pause. The pause stops Redis's coarse clock from tying the popular keys with the job's first keys, which would have saved some of them by chance. Suggested: "An exact LRU would keep none either way; the two-second pause stops Redis's one-second clock from tying the popular keys with the job's first keys."
8. **LRM in Valkey.** Valkey's source (unstable `config.c`) has no `lrm` policies. You can state that Valkey does not have them, rather than "not in Valkey's documentation".
9. **Wording of the expiry cycle.** "Takes up to 20 keys that have a TTL" would be clearer as "walks on through the keys that have a TTL, 20 at a time". Since 6.0 it uses a cursor, not random picks, which also explains R1. The redis.io EXPIRE page still says "tests a few keys at random", which describes the older algorithm.

## Checked and correct

- **Expiry cycle (8.10.3 `expire.c`).** 20 keys per pass, repeat while more than 10%, 25% time limit, 1 ms fast cycles, `active-expire-effort` from 1 to 10 with the stated direction of each change. The 25% rule is confirmed in 5.0.0 and the 10% rule plus effort in 6.0.0. The `redis.conf` "ten percent" quotation is exact.
- **The LRU clock** is 24 bits with 1,000 ms resolution (`object.h`). I observed keys written 300 ms apart sharing one `lru` value (R3).
- **LFU.** A 16-bit minutes field plus an 8-bit counter; `LFU_INIT_VAL` 5; increment probability `1/((c−5)·F+1)`; decay subtracts one per period. The arithmetic gives 105 accesses for 10, about 9,945 for 50 and 311,500 for 255. The figure's measured points match X9a's valid columns.
- **Policies.** Ten policies, names accepted by `CONFIG SET` on 8.10.3 (R1). LRM is absent from 8.4.0 `config.c`, present at 8.6.0 and in the 8.6.0 release notes, and does not update the clock on reads (`db.c`). Defaults on 8.10.3 are `noeviction`, `maxmemory 0`, samples 5, factor 10, decay 1 and effort 1.
- **`OBJECT FREQ` and `OBJECT IDLETIME`** each work only under the stated policies; with an LRM policy, `IDLETIME` still works (R2).
- **Volatile policies** sample only `db->expires`, so a hash with only field TTLs is not a candidate.
- **Eviction memory** excludes replica and AOF buffers (`freeMemoryGetNotCountedMemory`). Memory is checked before each command.
- **Documentation claims.** The redis.io eviction page says `allkeys-lru` is a good default, `volatile-*` behaves like `noeviction` without TTLs, and suggests two instances. Replicas wait for the primary's `DEL` but hide logically expired keys from reads. `expired` events are sent on deletion. EXPIRE accuracy is 0 to 1 ms.
- **ElastiCache** defaults to `volatile-lru` in node-based and serverless parameter documentation.
- **Breslau's range** of 0.64 to 0.83, Morris 1978, and the TinyLFU arXiv id are correct. All source links return 200.
- **TTL formulas and quoted numbers.** These are 10/11, about 15%, 1 in 800, about 7% and 83 a second. They follow from the stated assumptions, and `models.test.mjs` passes (9 of 9).
- **X5 (0.6 s against 1.26 s of expiry CPU, the 26 ms pause) and the "up to a fifth" stale share in the spread run** are consistent with the writer's raw output, which reaches 20% at +6.2 s.
- **Figure 9's LRU curve** is not distorted by the one-second clock. With a 1 ms clock the model gives the same result (M3). Its problem is LFU decay (R3).
- **The rendered page** showed 9 figures and no console errors.
