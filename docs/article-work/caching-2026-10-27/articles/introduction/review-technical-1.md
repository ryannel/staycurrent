# Technical review, round 1: Application caching with Redis (introduction)

Source: `src/articles/caching/introduction.astro`, figures in
`src/components/caching/introduction/`. Commands, output and the scripts I ran are
in `docs/article-work/caching-2026-10-27/evidence/introduction-review-1.txt`.

## Verdict

Mostly accurate, and better sourced than most drafts. The arithmetic, the Zipf
shares, the Breslau and Bronson citations, the licensing history and the Redis
observations all check out. Three things need fixing before publication. The
explanation of the real-Redis LRU result is wrong. The staleness bound is
overstated. The only code in the article fails in the outage that Figure 10 assumes
it survives. Required: 3. Suggested: 10.

## What I checked and found correct

- **Hit-ratio and latency arithmetic.** Mean latency = Lc + (1 − h)·Ld gives 21,
  11, 3.0, 2.0, 1.2 and 1.02 ms. Database reads are 1,000, 500, 100, 50, 10 and 1.
  The fivefold drop from 95% to 99% is right, and so is "99% → 98% doubles database
  reads". The break-even condition is Lc + (1 − h)(Ld + Lc) < Ld, so
  h > 2Lc/(Ld + Lc) = 2/21 ≈ 9.5%. The prose is right. The jump when Redis is lost
  is 1/(1 − h): 10×, 20× and 100× are right.
- **Zipf shares (independent Python, N = 100,000).** At s = 1, the top 1% gets
  61.9%, the top 10% gets 81.0%, and 29.9% of items cover 90% of requests. At
  s = 0.64 the top 1% gets 18.0% and the top 10% gets 42.9%. At s = 0.83 the
  figures are 37.8% and 62.9%. At s = 1.2 the top 1% gets 85.2%, and 3.0% of items
  cover 90%. All match the prose, the text alternative and the rendered readouts.
- **Breslau et al. 1999.** I read the full text from the PostScript, not only the
  abstract. The paper used six traces with α from 0.64 to 0.83 (Table I: 0.77,
  0.78, 0.83, 0.69, 0.73, 0.64). It says "the top 1% of the documents account for
  about 20% to 35% of all requests" and "it takes 25% to 40% of all documents to
  account for 70% of the requests". The article quotes these correctly.
- **Exact LRU and ideal numbers.** The Che approximation for exact LRU, run
  independently, gives 50.6% and 73.7% (N = 100,000, C = 1%/10%). On the
  2,500-item grid it gives 29.2%, 62.2% and 84.4%. The ideal shares are 45.4%,
  72.6% and 89.1%. All match Figure 7 and the prose. The model tests pass
  (`node --test`, 7/7).
- **Redis 8.10.3 observations, reproduced.** These match the article:
  - `GET` on a missing key returns nil.
  - `SET … EX 60` followed by `TTL` gives 60.
  - `MEMORY USAGE` reports 96 bytes (libc malloc).
  - A plain `SET` leaves a TTL of −1 and removes an existing TTL. `KEEPTTL` keeps it.
  - `TTL`, `EXISTS`, `OBJECT ENCODING` and `TYPE` each increment `keyspace_hits`.
    Each also counts a miss on a missing key.
  - The defaults are `maxmemory 0` and `noeviction`.
  - `redis-benchmark -c 1 -t get`: about 10,000 a second, p50 0.095 ms, in all
    three runs.
- **Bronson et al., HotOS 2021, §2.2 "Look-aside Cache".** The paper describes the
  cache staying empty because application timeouts mark the queries as failed, and
  a "10× query amplification" at a 90% hit rate. The article's paraphrase and its
  Sources entry are accurate.
- **Licensing.** The 8.10.3 README says 7.2.x and earlier are BSDv3, 7.4.x to 7.8.x
  are RSALv2 or SSPLv1, and 8.0.x onwards is RSALv2/SSPLv1/AGPLv3. The Linux
  Foundation's 28 March 2024 release says Valkey continued from Redis 7.2.4 under
  BSD 3-clause, started by contributors who included former Redis maintainers.
  The article is correct.
- **Denning, 1968.** "The Working Set Model for Program Behavior", CACM 11(5) is
  cited correctly.

## Required

### R1. The real-Redis LRU shortfall is attributed to the wrong cause

The article says (§ "Why a small cache can catch most requests", last paragraph):

> Redis falls a few points short of exact LRU because it approximates LRU by
> sampling a few keys at a time instead of tracking a precise order.

**Evidence.** Redis records each key's last access to the nearest second.
`src/object.h` in 8.10.3 has `#define LRU_CLOCK_RESOLUTION 1000`, and
`estimateObjectIdleTime()` in `src/evict.c` multiplies whole clock ticks by it. The
writer's run replayed 560,000 requests in about 7 s, roughly 80,000 a second, so a
1,000-key cache turned over many times within one clock tick. Most keys then look
equally idle, and eviction becomes close to random. I reproduced the run on port
7151 (Zipf s = 1, 100,000 keys):

| Run | 1% cache | 10% cache |
| --- | --- | --- |
| Exact-LRU simulation | 50.7% | 73.8% |
| Fast (~200k req/s), `allkeys-lru`, samples 5 | 43.3% | 70.2% |
| Fast, `allkeys-lru`, samples **64** | 43.3% | 70.3% |
| Fast, `allkeys-random` | 44.6% | 70.1% |
| Random-replacement model, same sizes | 45.7–46.5% | 70.1% |
| **Paced (~680 req/s), `allkeys-lru`, samples 5** | **50.9%** | not run |

Raising the sample count changes nothing. Random eviction scores the same as
`allkeys-lru`, and the writer's 46.7% and 70.5% sit on the random-replacement
prediction. Paced so that the cache turns over in seconds rather than fractions of
a second, Redis's sampled LRU matched exact LRU within the noise. The paced run
held 1,064 keys; the Che model at that size gives 51.2%.

**Why it matters.** A practitioner who reads this will think Redis's LRU costs
several points of hit ratio, and will try `maxmemory-samples` to win them back. In
a production cache whose contents turn over in minutes, sampled LRU is close to
exact. The real hazard is the opposite case: a cache so small for its traffic that
it turns over in under a second.

**Correction.** Either re-run paced and report that Redis came within about a
point of exact LRU, or keep the fast numbers and give the true reason. For
example: "In my replay the whole cache turned over many times a second, faster
than the one-second clock Redis uses to record when a key was last used, so its
choices were close to random; paced more slowly, it matched exact LRU (50.9%
against 50.7%). Article 4 explains how Redis approximates LRU." Update the Sources
sentence about measurements and the writer's evidence to match.

### R2. "Up to 60 seconds after a change, and no longer" is not a hard bound

The article says (§ "A copy can be wrong"):

> With a 60-second TTL, a cached copy can be out of date for up to 60 seconds
> after a change, and no longer. That makes the TTL a bound on staleness…

**Evidence.** Under cache-aside, a miss reads the database at time t_r and stores
the answer at t_s. If the change lands between the two, the old value lives until
t_s + 60. That is 60 seconds plus the length of the miss path after the change.
The miss path can be seconds long under the overload the article describes in the
next section. If the application reads from a database replica, replication lag
adds to the bound too. The next paragraph of the article already says concurrent
requests can put an old value back, so the earlier sentence contradicts it.

**Correction.** "…can be out of date for about 60 seconds after a change: the TTL,
plus however long the request that stored it took between reading the database and
writing to Redis. The TTL is therefore a rough bound on staleness, not an exact
one." Article 5 can own the detail.

### R3. The code sample turns a Redis outage into a site outage

**Evidence.** Figure 10's caption says "While Redis is down, the application treats
every lookup as a miss", and the prose analyses the database load that results.
The article's only code, `product_page()`, calls `redis.get()` and `redis.set()`
with no error handling. In redis-py both raise `ConnectionError` or `TimeoutError`
when Redis is unreachable. The default client has no socket timeout
(`socket_timeout=None`), so a half-open connection can block the request
indefinitely. Copied as written, the code fails every request while Redis is down.
It does not fall back to the database as the figure assumes. A reader learns about
the outage scenario from the figure, then copies code that behaves differently.

**Correction.** Add a short timeout and treat cache errors as a miss, or add one
sentence saying so. For example:

```python
try:
    cached = redis.get(key)          # client created with socket_timeout=0.05
except redis_exceptions.RedisError:
    cached = None                    # treat an unavailable cache as a miss
```

Wrap the `set` the same way, or ignore its failure. Point to article 2 or 11 for
the full treatment.

## Suggested

- **S1. The "top 1%" share depends on catalogue size.** For s ≤ 1, the share the
  top 1% receives grows with the number of items. "At s = 1 the most popular 1% of
  products receive 62%" holds for 100,000 products; with 1,000,000 it is about 68%
  (research dossier B8.2 agrees). Add "of 100,000 products" in the prose sentence,
  not only in the caption. The same applies to "Set the slider to 0.64 or 0.83":
  it gives 18% and 38% for the top 1%, which brackets Breslau's 20–35% only
  because the trace sizes differ. Saying so would stop a reader from comparing the
  numbers directly.
- **S2. Figure 5's mean is 2.2 ms, but the prose says 2 ms.** The prose says "A
  mean of 2 ms at 95%", while the figure's readout shows 2.2 ms. The log-normal
  spread uses medians of 1 and 20 ms, so the mean miss is about 23 ms, not "about
  21 ms" as the caption says. Either say the figure's costs are medians, or add a
  clause explaining why the readout is 2.2 rather than 2.0.
- **S3. Figure 5's markers overlap at 99.5%.** The p50, p99 and mean labels sit on
  top of each other and are unreadable (see the evidence file). Offset or stack the
  labels.
- **S4. Figure 1's numbers are an unlucky seed.** With 50 products at s = 1,
  product:1 receives 22.2% of requests, so about 40 of 180 queries in a minute.
  Seed 7 shows 28 (about 2σ low), and the prose says "nearly 30". This is not
  wrong for the figure as drawn, but a seed near the expected value would teach
  the proportion better. "Different products asked for barely moves" is mostly
  because only 50 products exist; say so, or use more products.
- **S5. Figure 10's opening readout is unrepresentative.** At load it shows "Hit
  ratio, last second 99%" and "1 read a second". Over the next 20 simulated
  seconds the readouts average about 92% and 7 reads a second, against the
  prose's "about 5". Average the readouts over more samples (5 s, say), or choose
  a seed whose first frame is near 95%.
- **S6. Pages with many lookups.** Put a number on "if it needs 20 answers, it is
  slow whenever any of them misses". At 99% per lookup, 18% of such pages include
  a miss; at 95%, 64%. This is a strong, cheap illustration of the tail point.
  Note that `MGET` or pipelining keeps the round trip single, but not the misses.
- **S7. `keyspace_hits` wording.** "It counts every lookup by every client and
  command" is close but not exact. Writes (`SET`, `INCR`) did not change either
  counter. Say "every read of a key, by any command". The observed list (`TTL`,
  `EXISTS`, `OBJECT ENCODING`, and also `TYPE`) is correct.
- **S8. Managed-service defaults.** The paragraph on `maxmemory 0` and
  `noeviction` is right for a self-run server. Managed services commonly set a
  memory limit and a `volatile-lru` default, which evicts only keys that have a
  TTL; keys stored without one can still fill memory and cause OOM errors. Mark the
  paragraph as describing self-run Redis, with one clause on managed services, as
  the brief asks for differences that change a decision.
- **S9. Name the 7.4 licences.** "From 7.4 the licence changed" followed by
  "AGPLv3 as a third licence option" leaves the reader to guess the first two. Say
  "from 7.4 it moved to a choice of RSALv2 or SSPLv1, which are not open-source
  licences". Optionally add "(7.2.4, March 2024, under the Linux Foundation)" for
  Valkey.
- **S10. Small wording points.**
  - "From 250 to 1,000, four times as much memory again": the previous step was
    tenfold, so "again" misleads. Write "four times as much memory".
  - Figure 7's model draws requests independently. Real traffic has bursts that
    favour LRU more than this model does. The caption could say so.
  - In the Python sample, `redis.get` returns `bytes` while `build_page` returns
    whatever the application uses. This is harmless here, but it is worth
    `decode_responses=True` or a comment if the article is meant to be copied.
