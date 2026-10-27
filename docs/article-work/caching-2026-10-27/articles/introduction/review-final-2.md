# Final review, round 2: Application caching with Redis (introduction)

Reviewer: fresh, independent pre-publication review, 27 October 2026.
Page: `http://localhost:4471/learn/databases/caching/` (`CACHING_DRAFT_PREVIEW=1`).
Source: `src/articles/caching/introduction.astro`, figures in
`src/components/caching/introduction/`.

## Verdict

**Publish after the one blocking fix below.** One blocking problem, nine minor.

The article reaches the standard of Gears and Load Balancing for an opening
piece. It starts from a situation every reader has built (a product page that
asks the database the same thing for every visitor), shows the waste live
before naming a cache, and then builds the mental model the rest of the
collection needs, one figure at a time: hit and miss, hit ratio, why the miss
ratio sets database load, why the mean hides the tail, why skew lets a small
cache work, and the three costs (staleness, dependency, memory). Each figure
isolates one variable (visitors a second; hit ratio; exponent s; cache size;
Redis up or down), the prose tells the reader what to look for, and the
arithmetic is derived in a few lines rather than asserted. It is honest about its
models and keeps them apart from the measured Redis results (the LRU replay
against Redis 8.10 is a particularly good touch). A newcomer finishes with a
sound map of the problem space and a clear reason to read on: each cost is posed
as a question and handed to the article that answers it, and the closing map
explains the order.

The blocking problem is in the one piece of code a reader will copy.

## Blocking

### B1. The fail-open code does not fail open quickly: redis-py retries ten times by default

The read-path code sets 50 ms timeouts and catches `RedisError`, and the prose
says that with these "the application treats an unreachable Redis as a miss and
goes to the database instead", while without them "redis-py 8.1 waits up to five
seconds by default". Both statements leave out redis-py's default retry policy.

In redis-py 8.1.0, `Redis.__init__` defaults to
`retry=Retry(backoff=ExponentialWithJitterBackoff(base=0.01, cap=1), retries=10)`
(`redis/_defaults.py`: `DEFAULT_RETRY_COUNT = 10`, `DEFAULT_RETRY_BASE = 0.01`,
`DEFAULT_RETRY_CAP = 1`; `redis/client.py` lines 285–290), and `Retry` retries on
`ConnectionError`, `TimeoutError` and `socket.timeout` (`redis/retry.py`). Each
failed command is therefore attempted 11 times with jittered backoff of up to one
second between later attempts, before the `except` clause ever runs.

I ran the article's `product_page()` exactly as written (same client arguments)
with redis-py 8.1.0 on Python 3.14:

```
up                                         5 ms, then 0 ms
refused (nothing listening on the port)    8279 ms, 8961 ms, 7936 ms per request
accepts but never answers                  9228 ms, 9759 ms, 8135 ms per request
never answers, retry=Retry(NoBackoff(), 0) 106 ms, 104 ms, 105 ms per request
```

So with Redis down, every page request waits about 8–10 seconds (about 4 s for the
`GET`, then about 4 s again for the `SET`). That is the site outage the code and
the third "detail" claim to prevent, and Figure 10 (which assumes misses go
straight to the database) does not describe what this code does. The "five
seconds by default" sentence also understates the default case: with the default
5 s socket timeout and ten retries, a server that accepts connections but does
not answer would hold a request for tens of seconds.

**Fix.** Turn off the client's retries for cache reads, or limit them to one
immediate retry, and say why in one sentence:

```python
from redis.backoff import NoBackoff
from redis.retry import Retry

cache = redis.Redis(host="cache.internal", decode_responses=True,
                    socket_timeout=0.05, socket_connect_timeout=0.05,
                    retry=Retry(NoBackoff(), 0))   # a cache miss is cheaper than waiting
```

Then rewrite the third detail along these lines: "Without them, a Redis that is
down or not answering makes every request fail or wait. redis-py 8.1 waits up to
five seconds for each attempt and retries a failed command ten times, so one
lookup can take many seconds. With short timeouts, no retries and the two
`except` clauses, the application treats an unreachable Redis as a miss…" Point to
article 8 (which owns retries and backoff) for when a retry is worth it. Add the
`_defaults.py`/`client.py` retry defaults to the redis-py source bullet, and re-run
the timing so the evidence file holds it.

## Minor

1. **Valkey "behaves the same for everything in this collection" is too strong.**
   The collection plan assigns Redis-only or Redis-first features to later articles
   (`SET … IFEQ`/`DELEX`/`MSETEX` from 8.4, `allkeys-lrm`/`volatile-lrm` and
   `HOTKEYS` from 8.6, `CLUSTER SLOT-STATS`, atomic slot migration, hash-field
   expiry). Fix: "behaves the same for the caching ideas and core commands in this
   collection; where an article relies on a feature added to Redis after the fork,
   it names the version, and article 11 covers the licences…".

2. **Figure 6 prose contradicts what the histogram shows near 2 ms.** The text says
   "A mean of about 2 ms … No request does" and the text alternative says the mean
   lies "where almost no request actually falls", but at 95% the mean marker
   (2.2 ms) sits on a visible green bar of slow hits (about 150 requests between
   2 and 2.5 ms). Also, on the square-root axis the 250 misses spread over 90 bins
   read as a low flat band, not the "orange hump" the prose tells the reader to
   look for. Fix: "Almost no request does", and "the low orange band of misses".

3. **Figure 4's text alternative quotes a long-run 78% the reader will not see.**
   After one press of "Skip ahead 5 minutes" I saw 73% so far and 71% over the last
   100; after a second press, 74% and 67%. 78% is the analytic value for a model
   that stores instantly (`expectedTtlHitRatio`); the animated model stores after
   the database round trip and the last-100 window moves by several points. The
   main prose ("around three in four") is right. Fix: drop the 78% or say "over any
   100 requests it wanders between about 65% and 80%".

4. **Figure 10's outage line is a jagged sawtooth that touches the top of the
   axis.** With half-second samples, "Database reads needed" alternates between
   about 70 and 125 during the outage, and the peaks reach the 0–125 domain limit,
   so they may be clipped. The readouts (averaged over 2 s) are steady at about
   100. Fix: plot one-second (or two-sample moving average) values, or raise the
   domain to 150, so the reader sees "about 100, far above 40" rather than noise.

5. **Figure 7's caption writes "1/k^s"** with a caret, while the prose uses a
   superscript. Use `1/k<sup>s</sup>`.

6. **Momentum dips between the problem and the solution.** After Figure 1 makes the
   reader want a cache, two expository sections ("What Redis is", "Where Redis sits
   among other caches") come before the reader sees one work in Figure 3. Consider
   moving "Where Redis sits among other caches" to after the read path (for
   example just before "What a cache costs", or after Figure 4), keeping only "What
   Redis is" before the code that needs `GET` and `SET`.

7. **"after which Redis deletes it"** (TTL definition) is slightly loose: the key
   becomes invisible at once, but memory is reclaimed on access or by the active
   expiry cycle (article 4). Fix: "after which Redis treats it as gone and removes
   it".

8. **Figure 3 draws no reply for the miss.** Step 1's explanation says Redis
   "replies nil", but only the request arrow is drawn, whereas the hit later gets an
   "answer" arrow. Consider a short return arrow labelled `nil` so the two `GET`s
   read as the same shape with different outcomes.

9. **Figure 1's "queries a second" readout is noisy.** At 6 visitors a second my run
   showed 5.0 queries/s against the prose's "they double too" (about 6). It is a
   5-second window over a Poisson process; a text note "about" is already in the
   alternative. Consider a 10-second window so the doubling reads cleanly.

## What I checked and found correct

- Reference standard refreshed: read the full text of Gears and Load Balancing and
  used the Gears disc and velocity sliders and three Load Balancing simulations
  before reading the article.
- Every figure used as a reader: Figure 1 to 60 s and at 6 visitors (167 queries,
  42 products, 75% repeats; product:1 computed 42 times, matching "about 40");
  Figure 3 and 9 stepped to the end; Figure 4 live and skipped; Figure 5 and 6 at
  every option (readouts match the prose and text alternatives exactly: 1,000/500/
  100/50/10/1 reads; 21/11/3.0/2.0/1.2/1.02 ms; p99 43/36/32/22/2.5 ms); Figure 7 at
  s = 0, 0.64, 0.83, 1, 1.2 (18%/43%/75%, 38%/63%/58%, 62%/81%/30%, 85%/94%/3%);
  Figure 8 at 25, 250, 1,000 keys (28–29%/45%, 61–62%/73%, 83–84%/89%); Figure 10
  down and back up (about 100 reads needed and 60–68 failing while down; back
  under the 40 line about 4 s after recovery).
- Reduced motion: Figures 1, 4, 8 and 10 do not advance on their own.
- Screenshots in `final-screens/` (light and dark, 1280 px and 375 px): no
  horizontal overflow, no console errors, both themes legible, phone layouts of
  Figures 2, 5 and 9 adapt well.
- Arithmetic: mean latency and database-read formulas; the break-even derivation
  `h > 2Lc/(Ld + Lc)` (2/21 ≈ 10%); 0.05/0.01 = 5; 0.99^20 = 0.818 and 0.95^20 =
  0.358; 1/(1 − h) amplification; Zipf shares at N = 100,000 (s = 1: 61.9% and
  81.0%).
- Redis 8.10.3 on port 7171 (temporary directory, `--save ''`, shut down with
  `SHUTDOWN NOSAVE`): the `GET`/`SET … EX 60`/`GET`/`TTL` transcript; `MEMORY USAGE`
  96 bytes; `TTL`, `EXISTS`, `TYPE`, `OBJECT ENCODING` (and `STRLEN`) each add one
  to `keyspace_hits`; `EXISTS` on a missing key adds a miss; defaults
  `maxmemory 0` and `maxmemory-policy noeviction`. A single-client
  `redis-benchmark` on the (busy) laptop gave a 0.20 ms median, consistent with the
  article's 0.095 ms measured on a quieter machine and with 1 ms as a cautious
  assumption.
- The paced LRU replay figures (49%/74% against exact LRU 50%/74%) match the
  recorded evidence in `evidence/introduction.txt`.
- Breslau et al. (α 0.64–0.83; top 1% draw 20–35%; 25–40% of documents for 70%)
  and Bronson et al. §2.2 (90% hit rate, tenfold amplification, cache fails to
  refill) agree with the quotations recorded from the primary texts in the
  evidence files; I did not re-extract the PostScript myself.
- Valkey as a fork of Redis 7.2 in 2024 after the licence change; managed
  `volatile-lru` defaults (ElastiCache, Azure).
- Model tests: `node --test model.test.mjs` passes; the Figure 10 model's warm hit
  ratio is 94.5% ("near 95%").

## Evidence for B1

Script `failopen.py` (scratchpad), redis-py 8.1.0 installed from PyPI into a
Python 3.14 venv, Redis 8.10.3 on port 7171 for the "up" case, nothing on port
7179 for "refused", and a Python socket that accepts and never replies on port
7178 for "never answers". `product_page()` is the article's function verbatim,
with `build_page` replaced by a constant. Source lines read from
`https://raw.githubusercontent.com/redis/redis-py/v8.1.0/redis/` (`_defaults.py`,
`client.py`, `retry.py`, `backoff.py`).
