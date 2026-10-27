# Technical review, round 1: Cache stampedes and the thundering herd

Reviewer: independent technical review. Source reviewed:
`src/articles/caching/stampedes.astro` and `src/components/caching/stampedes/`.
Rendered at `http://localhost:4466/learn/databases/caching/stampedes/` with
`CACHING_DRAFT_PREVIEW=1`. Evidence (commands, output, scripts):
`docs/article-work/caching-2026-10-27/evidence/stampedes-review-1.txt`.

## Verdict

Technically strong. The central and most unusual claim, that XFetch gives
about e^(1/β) rebuilds per expiry and that the paper's e − 1/e is an (incorrect)
bound, is right. I checked it against the paper, an independent simulation and
the paper's own proof, and I can name the faulty step. The lock, release and
lock-hazard material matches the Redis documentation and what I observed on
Redis 8.10.3. The model figures reproduce the numbers the prose quotes, and the
real-Redis lab results reproduce within run-to-run variation.

There are three required fixes:

- an arithmetic slip in the opening (the hit ratio);
- a mislabelled quantity in the XFetch derivation;
- a missing re-check in the serve-stale design. I measured that this makes it
  refresh twice in many cycles, so the "one query per expiry" measurement does
  not reproduce.

The suggested items are mostly missing failure cases in the advice: what
happens when a lock holder crashes, polling load at scale, server-side query
timeouts, and the miss path behind a background refresher.

Counts: **3 required, 12 suggested.**

## What I checked and how

- **Vattani, Chierichetti and Lowenstein (2015).** I read the full PVLDB PDF,
  including the appendix proofs. I checked the XFetch pseudo-code (Figure 3),
  Definitions 1, 3 and 5, Theorem 7, Lemma 16 and its proof, and Section 6. I
  also rendered Figure 7 to read its values.
- **Independent derivation and simulation.** I wrote my own request-by-request
  simulator; it does not use the article's code. It covers Poisson, evenly
  spaced and bursty arrivals (coefficient of variation about 3.5, close to the
  paper's Goodreads trace), at 10, 100 and 1,000 requests per rebuild time, for
  β = 0.5 to 2, with 4,000 cycles per point.
- **Redis 8.10.3, port 7156, `--save ''`.**
  - `COMMAND DOCS` for `DELEX` and `SET`.
  - `SET … NX PX`, then `DELEX … IFEQ` with the wrong and the right token, and
    on a missing key.
  - The 300 ms lock and 400 ms rebuild timeline, with real sleeps, released
    once with `DEL` and once with `DELEX`.
  - `PTTL` on a missing key and on a key without a TTL; `HMGET` on a missing
    key; `SET … IFEQ`.
- **The writer's lab.** I re-ran it against my own server (a copy with the port
  changed): the cold key, the re-check, the 30-second cycles and the 120-second
  XFetch run.
- **Model code.**
  - Read `hotkey-model.mjs`, `pool-model.mjs`, `coldstart-model.mjs`,
    `xfetch-model.mjs` and `sequences.mjs`.
  - Ran `node --test` (10 passing).
  - Ran the models over other seeds and parameter values than the tests use.
- **Rendered page (Playwright).** No console errors and no horizontal overflow
  at 375 px. The Figure 9 readouts at every traffic choice and at β = 0.5, 1
  and 2 match the prose.
- **Secondary sources.**
  - The Redis "Distributed locks with Redis" page: both quotations are
    verbatim.
  - The Facebook memcache paper, Section 3.2.1: the 10 s token rate, 17K/s to
    1.3K/s, the stale values after a delete, and its narrower definition of a
    thundering herd.
  - RFC 5861 and Go's `singleflight`, as summarised.

## The XFetch claims (the reviewer's own check)

**The rule.** The article writes the rule as: head start = −δβ ln(U), and
refresh if now + head start ≥ expiry. This is the paper's Figure 3:
`Time() − Δβ log(rand()) ≥ expiry`, with D = Exp(1/β). The Python version is
also correct. `1 − random()` avoids log(0), and refreshing when
`head_start >= ttl_ms` is the same test as the paper's.

**The expected size.** The paper's Definition 3 counts the requests that start
a rebuild in [Z, Z + 1), where Z is the first rebuild and time is measured in
rebuild times. With Poisson arrivals at rate n, the rebuild starts form a
thinned Poisson process with intensity n·e^(−λy) at y rebuild times before
expiry (λ = 1/β).

1. Let Λ(y) = (n/λ)·e^(−λy). It is the intensity accumulated from long before
   the expiry up to the moment y.
2. Λ at the first start is Exp(1).
3. Given that first start, the starts during the next unit of time are Poisson
   with mean Λ(y₁)(e^λ − 1).
4. So E[S] = 1 + (e^λ − 1) = e^λ = e^(1/β).

Two conditions are needed: Λ(1) must be large, so that the first start is at
least one rebuild before expiry, and n must be large. The derivation in the
article is right.

My independent simulation (evidence section S1), 4,000 cycles per point:

| Arrivals | Requests per rebuild | β | Simulated E[S] | e^(1/β) | Paper's (e^λ−1)(1/λ+1/e) |
|---|---|---|---|---|---|
| Poisson | 100 | 0.5 | 7.31 | 7.39 | 5.55 |
| Poisson | 100 | 1 | 2.69 | 2.72 | 2.35 |
| Poisson | 1,000 | 1 | 2.76 | 2.72 | 2.35 |
| Poisson | 100 | 2 | 1.65 | 1.65 | 1.54 |
| Even | 1,000 | 1 | 2.72 | 2.72 | 2.35 |
| Bursty (CV ≈ 3.5) | 100 | 1 | 2.96 | 2.72 | 2.35 |
| Bursty (CV ≈ 3.5) | 10 | 1 | 4.91 | 2.72 | 2.35 |

The mean lead of the first rebuild matched β(ln(nβ) + γ) to within 1% for
Poisson and even arrivals.

**The paper's number.** Theorem 7 says Exp(λ) is
((e^λ − 1)(1/λ + 1/e), (1/λ)·log n)-effective. By Definition 5, that means
E[S] ≤ (1 + o(1))·(e^λ − 1)(1/λ + 1/e). This is an asymptotic upper bound. At
λ = 1/β = 1 it is e − 1/e ≈ 2.35, and Section 3 then quotes it as "reduce the
stampede size to merely e − 1/e ≈ 2.4". The article is therefore right on both
counts:

- e − 1/e is the Theorem 7 formula evaluated at β = 1.
- The theorem states it as a bound.

The bound is below e^λ for every λ > 0. The ratio is (1 − e^(−λ))(1/λ + 1/e),
which is less than 1 throughout. Poisson arrivals are inside the theorem's
scope (Definition 1 with σ_I = 1), so the theorem as stated is false.

**Where the proof goes wrong.** I can confirm the writer's reading and make it
exact. The proof of Lemma 16 (appendix) uses
E[S | T ∈ (ν − i − 1, ν − i)] ≤ n·e^(−λ(ν−i)) = e^(λi), where T is the early
expiration gap. This multiplies n by the refresh probability at the *far* edge
of the gap interval. That probability is smaller than every refresh probability
in the stampede window [Z, Z + 1). The window runs from T down to T − 1 before
expiry, where the probabilities lie between e^(−λT) and e^(−λ(T−1)).

The correct conditional expectation is (n/λ)·e^(−λT)·(e^λ − 1), which exceeds
e^(λi)·(e^λ − 1)/λ, and (e^λ − 1)/λ > 1. So the inequality fails for every λ,
and that is where the factor is lost.

**The Goodreads experiment.** In the paper's Figure 7, rendered at 400 dpi, the
Exp(λ) curve sits at about 3 at β = 1, about 8 at β = 0.5, and crosses the
y = 2 line near β = 1.5. The text confirms that "increasing β = 1/λ to 1.5
already drops the average stampede size to less than 2". So the article's
reading is right. One nuance: that trace is bursty (σ_I ≈ 3.6, n ≈ 140). My
bursty simulation at 100 requests per rebuild gives 2.96 at β = 1, so part of
the "about 3" is burstiness, not only e^(1/β). See S2.

**Real Redis.** My re-run of the 120-second lab averaged 2.17 rebuilds per
expiry over 29 expiries; the writer's run averaged 2.75 over 28. With about 28
expiries, either sample carries a standard error of about 0.4, so both are
consistent with e (see S7). The lead time matched: 1,010 ms against the
predicted 1,036 ms. No request found the key missing.

## Required

### R1. The opening's hit ratio is wrong for its own numbers

Line 16 says: "The site serves about 500 page views a second. The hit ratio for
the key is above 99.9%". The key has `EX 60` and the article itself computes
about 100 misses per expiry (500 × 0.2). That is 100 misses in 30,000 reads a
minute, a hit ratio of about 99.67%, below 99.9%.

The point of the sentence, that a very high hit ratio hides the spike, still
stands. But the number is wrong, and readers of this collection are taught to
compute it (article 1).

**Correction:** "The hit ratio for the key is about 99.7%". Alternatively, keep
"above 99.9%" and change the scenario (for example a 5-minute TTL gives
100/150,000 = 99.93%).

### R2. The XFetch derivation mislabels H(y)

Lines 148–150 say that "the expected number of starts still to come from y on
is H(y) = rβδ·e^(−y/βδ)", and that "the first refresh happens, on average,
where about one start is still expected".

H(y) = ∫ from y to ∞ of r·e^(−s/βδ) ds is the intensity accumulated *before*
the moment y, from long before expiry up to y. It is not the number still to
come: it grows as y approaches the expiry, while starts still to come would
shrink. The starts still to come between y and the expiry would be
rβδ(1 − e^(−y/βδ)).

Every later step in the article (H at the first start averages 1; extra
refreshes = H(y − δ) − H(y)) is correct only under the "accumulated so far"
meaning. A reader who checks the derivation with the stated meaning will find
it does not add up. This is the article's flagship derivation and the basis of
its disagreement with a published paper, so it must be exact.

**Correction:**

- Line 148: "…and the expected number of starts from long before the expiry up
  to the moment y, if every request that drew a long enough head start counted,
  is H(y) = rβδ·e^(−y/βδ)".
- Line 150: "The first refresh happens, on average, about where one start
  would have been expected so far. More precisely, H at the first start is
  random with an average of exactly 1 (it is exponentially distributed)."
- The same mislabel is in the comment on `fastCycle` in `xfetch-model.mjs`
  ("the cumulative intensity still ahead at y"). Fix it there too.

### R3. Serving stale, as described, refreshes twice in many cycles; the "one query per expiry" measurement does not reproduce

Lines 133 and 135 have two problems:

- **The description.** It says to "return it at once, and let one request,
  the one that takes the rebuild lock, refresh it in the background". It has no
  re-check after the lock is taken.
- **The measurement.** It says: "serving stale sent the same 5 queries".

The race is the same one the article carefully closes for the lock path
(lines 73 and 90):

1. A request pipelines `GET`+`PTTL` and sees a stale copy.
2. Before its `SET NX` arrives, the current refresher stores the new copy and
   releases the lock with `DELEX`.
3. The request wins the now-free lock and refreshes a copy that is already
   fresh.

The window is roughly the round trip between the refresher's `SET` and its
`DELEX`. During that window, every reader that saw the old copy is racing for
the lock. At 500 requests a second, that is likely in a large share of cycles.

**Observed.** I re-ran the writer's own lab code (`lab.mjs`, stale strategy,
unchanged apart from the port), then ran an instrumented copy that logs each
refresh. Expected refreshes were 5–6 per 30-second run:

| Run | Queries | Refresh pairs about 200 ms apart |
|---|---|---|
| Writer's code, seed 7 | 6 | not logged |
| Instrumented, seed 7 | 7 | 2 |
| Instrumented, seed 8 | 9 | 4 |
| Instrumented, seed 9 | 7 | 2 |

In each pair, the second refresher had read a `PTTL` of about 9,790 ms, meaning
the old copy, about 200 ms after the first refresh started. That is exactly
this race (evidence L3 and L5). The writer's single run showing 5 was a
favourable draw.

The extra load is bounded (at most a few extra queries per expiry), so this is
not dangerous. But the article states one query per expiry as a property of the
design, and as a measurement. The model behind Figure 7 hides the race too:
`hotkey-model.mjs` checks `!fresh()` atomically at lock time
(`const won = lockFree() && !fresh()`).

**Correction:**

- Add the re-check to the serve-stale description: "the request that takes
  the lock reads `PTTL` again and refreshes only if the copy is still stale,
  as in the lock code above".
- Re-run the measurement with the re-check, and report those numbers.
- The model can stay as it is, since it now represents the re-checked design.
  Say in the Figure 7 caption that the winner re-checks.

## Suggested

### S1. State the proof flaw concretely, since it now has independent support

Line 155 says: "My reading is that the proof's estimate is too optimistic, but
I have not confirmed that with the authors." That can be firmer and more
useful. Suggested replacement: "The step that fails is in the proof of Lemma
16. It bounds the stampede after an early refresh by the refresh probability
at the earliest moment in the window, but the duplicates start later, closer
to the expiry, where each request is up to e^(2/β) times more likely to
refresh."

The source note is good as it stands ("derived and simulated in this article
… not taken from the paper"). Keep the "not confirmed with the authors"
caveat if you like.

### S2. Say that e^(1/β) assumes independent (Poisson-like) arrivals; bursts raise it

"The rate r has dropped out … about 2.7 whether the key is read 100 or 10,000
times" holds for Poisson and evenly spaced arrivals. With bursty arrivals (CV
about 3.5, as in the paper's trace), my simulation gives:

- 2.96 at 100 requests per rebuild;
- 4.9 at 10 requests per rebuild.

That explains part of the paper's "about 3". The practical advice ("plan for
about three") survives. Add one sentence: "This assumes requests arrive
independently; bursty traffic gives somewhat more (the paper's real trace,
which is bursty, averaged about 3)".

### S3. Figure 9's simulation shares the derivation's model; say so

`summarise` uses `fastCycle`. It samples the first start and the number of
duplicates from the Poisson-process intensity, which is the same structure the
derivation uses. It is correct, and `models.test.mjs` checks it against the
request-by-request `cycle`. My independent simulator agrees too. But "Figure 9
simulates the rule many thousands of times so you can check both claims"
slightly oversells it as an independent check.

**Caption:** "…sampled exactly from the Poisson model of arrivals (a
request-by-request simulation gives the same values)".

Also, the caption says "the dotted line is the formula the paper quotes for
β = 1". The line is actually Theorem 7's general expression (e^(1/β) − 1)(β +
1/e) plotted for every β. Reword: "the dotted line is the paper's Theorem 7
bound, (e^(1/β) − 1)(β + 1/e), which gives e − 1/e at β = 1".

### S4. "β = 2 … starts them twice as early" understates it

At 100 requests per rebuild time, the mean lead is 5.2 rebuild times at β = 1
and 11.75 at β = 2: 2.3 times as early. The ratio grows with traffic, because
lead = β(ln(rβδ) + γ) and ln(rβδ) also rises with β.

**Correction:** "more than twice as early".

### S5. A crashed lock holder means errors (or waits) for up to the lock expiry

The article says the lock expiry exists "so a process that crashes while
holding it does not block the key for ever", and later says to choose the
expiry from the slowest rebuild. It does not say what happens between the crash
and the expiry. With the article's code:

1. Every reader of the hot key fails `SET NX`.
2. It polls for 1 s.
3. It raises `CacheBusy`.

That continues for up to the remaining lock time: 5 s in the recommended
configuration, or about 2,500 failed page views at 500 a second. This is the
other side of the expiry trade-off: too short lets duplicates in, too long
lengthens the outage after a crash.

Add one sentence to "What can go wrong with the lock". Mention the usual
mitigations:

- serve the stale copy (the article's own recommendation);
- keep the expiry as short as the query timeout allows;
- or have waiters retry `SET NX` in their polling loop, so that one of them
  takes over as soon as the dead holder's lock expires.

### S6. Polling load scales with traffic × rebuild time; give the formula

"A loop of GETs every 20 ms from a few hundred requests is a few thousand
cheap commands a second" is right for the example. The load during a rebuild is
about (r × rebuild time) waiters × (1 / poll interval). Examples:

- 10,000 requests a second and a 200 ms rebuild: about 2,000 waiters × 50 a
  second = 100,000 `GET`s a second at one key on one Redis main thread.
- A slow 2-second rebuild multiplies that again.

The final recommendation already says single-flight keeps waiters from all
polling. Move that point, with the formula, to the "Poll and then give up"
bullet, where the reader chooses a waiting strategy. Also suggest jittering the
poll interval, which the lab does (15–25 ms) but the code does not.

### S7. The real-Redis XFetch count is one noisy sample; say so

Line 174 reports 2.75 rebuilds per expiry over 28 expiries as agreement with
e^(1/β). Under the model, the per-expiry count has a variance of
(e − 1) + (e − 1)² ≈ 4.7 (standard deviation about 2.2). So the mean of 28
expiries has a standard error of about 0.4.

My re-run of the same 120-second lab (seed 11, port 7156) gave:

- 2.17 rebuilds per expiry over 29 expiries, with a maximum of 5;
- a first rebuild 1,010 ms before expiry on average;
- no request that found the key missing;
- 79 requests slower than 50 ms against 63 queries.

That is consistent with 2.72, but so is the writer's 2.75, and neither sample
pins the value down. The derivation and the simulation carry the claim. The
real run shows that the code works on Redis, that the lead time matches, and
that nobody misses.

**Correction:** "averaged 2.75 rebuilds per expiry (a 28-expiry sample, so
±0.4 or so)". Also drop or soften "77 of those were the requests that ran a
rebuild themselves": in my run, 16 of the 79 slow requests were not
rebuilders, which is event-loop noise in a one-process load generator.

### S8. Query timeouts should be enforced by the database

Line 123 says: "set the database query's timeout comfortably below the lock's
expiry". A client-side timeout often stops the application waiting but leaves
the query running in the database. The lock is released or expires, a second
rebuilder starts, and the abandoned query is still using the capacity the
article was trying to protect.

**Correction:** "set a timeout that the database enforces (for example
PostgreSQL's `statement_timeout`, or MySQL's `MAX_EXECUTION_TIME` for reads)
comfortably below the lock's expiry". Also, Figure 6's steps describe a query
that "times out at 400 ms" under a 300 ms lock. That is exactly this
misconfiguration, so say so in the prose next to the figure ("a query timeout
longer than the lock").

### S9. "Only a longer expiry fixes it" contradicts the later note on extension

Line 122 says the overlap is "caused by the expiry being too short, and only a
longer expiry fixes it". The next paragraph says some libraries extend the lock
while the holder works. Say "a longer expiry, or extending the lock while the
rebuild runs, fixes it".

### S10. Background refresh does not "remove the stampede entirely" on its own

Line 207 overstates this. A scheduled refresher prevents expiry stampedes, but
readers still need a miss path:

- the key can be evicted under `maxmemory`;
- it can be flushed, or lost on a restart or failover;
- the refresher itself can fail.

When that happens, every reader misses at once, which is a stampede. The
paper's wording ("prevents cache stampedes all together") is the source of
this, but practitioners need the caveat. Add: "readers still need a protected
miss path (a lock or single-flight) for when the key is evicted, flushed or the
job fails".

### S11. Valkey and older managed Redis: name the release equivalent

`DELEX` is Redis 8.4+ (`COMMAND DOCS`: since 8.4.0). Many readers run Redis
7.x managed services or Valkey, which have no `DELEX`. Valkey 9.0 added
`DELIFEQ key value`, which does the same compare-and-delete. The article
already gives the Lua script, which works everywhere. Add half a sentence: "On
Valkey 9.0+ the equivalent is `DELIFEQ`; elsewhere use the script". This
matters to a decision because the article's Python code would raise "unknown
command" inside `finally`, masking the original error.

Minor: the Sources entry for SET lists `IFEQ`, which the article never uses
(`SET … IFEQ` is a compare-and-set, since 8.4.0). Remove it, or keep it only if
the text uses it.

### S12. Small clarifications

- **Line 108.** "the slowest request took 206 to 230 ms against 202 to 206 ms
  without the lock". "Without the lock" here means single-flight (the lab's
  comparison). Say "against 202 to 206 ms with single-flight". My re-run gave
  lock 213–218 ms with 96–119 waiting, and single-flight 202–204 ms, which is
  consistent.
- **XFetch code, line 163.** If the hash ever lacks a TTL (`PTTL` returns −1,
  for example after a manual `PERSIST` or a write path that forgets
  `PEXPIRE`), `head_start < -1` is never true, so every request refreshes. I
  observed `PTTL` −1 on a hash written with `HSET` alone. A one-line guard
  (`if ttl_ms < 0 and value is not None: treat as due for refresh once`), or a
  note that the write must always set the expiry in the same `MULTI`, avoids a
  self-inflicted stampede.
- **Line 41, "r × δ × δ / c".** This is fine. The model's exact busy-until is
  1.2 s, because the unrelated query takes one slot. The figure text already
  says so.

## Checked and correct (no change needed)

- **Stampede size and the measurement.** r × δ, and the 1 + rδ refinement. The
  real-Redis cold-key counts reproduced exactly: 114, 115 and 92 with no
  protection, 4 with single-flight and 1 with the lock (evidence L1).
- **The re-check measurement.** 2 of 30 bursts sent a duplicate without the
  re-check, 0 of 30 with it (evidence L2, identical to the writer's).
- **Figure 2 (pool).** The model gives 100 misses, first copy stored at 200 ms,
  pool busy until 1.2 s, and the other page waiting 322 ms. At 100 requests a
  second there are 20 misses and no wait; at 1,000 a second the pool is busy
  until 2.2 s and the other page waits 901 ms. All follow from the stated
  assumptions (FIFO queue, 20 connections, no slow-down).
- **Figures 1, 3, 5 and 7 (hot-key model).**
  - Queries per expiry, with no protection, over three seeds: 5.6 at 5
    requests a second, 14–15 at 15, and 36–37 at 40 ("about 40" is fair; the
    1 + rδ form fits better at low rates).
  - Single-flight: about 3.9 queries per expiry, slowest response 1.1 s.
  - Lock: exactly 1 query, slowest 1.30–1.45 s.
  - Serve stale: exactly 1 query, slowest 0.2 s.
- **Figure 10 (cold start).** Duplicates are 37–38% of queries. Time to a 90%
  hit ratio, every miss querying against one query per key:

  | Database capacity | Every miss queries | One query per key |
  |---|---|---|
  | 100 queries a second | 10–11 s, peak queue 4.3–4.4 s | 7 s, peak queue 1.5–1.6 s |
  | 60 queries a second | 21–22 s | 10–11 s |
  | 150 queries a second | 6 s | 5–6 s |

  This is consistent across two seeds and matches the prose.
- **Lock commands.**
  - `SET … NX PX` replies OK, then nil.
  - `DELEX … IFEQ` replies 0 for a wrong token, 1 for the right one, and 0 for
    a missing key.
  - In the expired-lock timeline, `DEL` removed B's lock and C got OK;
    `DELEX` replied 0, C got nil, and the lock still held tok-B. All observed
    on 8.10.3 (evidence R2, R3).
- **Redis lock page quotations.** "where a race condition from time to time is
  acceptable" and "Redis is not using monotonic clock for TTL expiration
  mechanism" are verbatim. The failover race, the release script and the
  statement that DELEX was introduced in 8.4 all match the page.
- **Facebook memcache, Section 3.2.1.** Tokens are issued once every 10 s per
  key, other clients are told to wait a short time, the peak falls from 17K/s
  to 1.3K/s, stale values are kept after a delete, and a thundering herd is
  defined as heavy read *and write* activity. All as stated.
- **RFC 5861 and Go's singleflight.** Summarised correctly.
- **PTTL.** −2 for a missing key and −1 for a key without a TTL. `GET` and
  `PTTL`, pipelined, return the value and the remaining milliseconds.
- **Lead of the first rebuild.** βδ(ln(rβδ) + γ) is right: with H at the first
  start distributed Exp(1), E[−ln E] = γ. It gives 1.036 s for the trending
  key, and the real-Redis run averaged 1,028 ms.
- **Low traffic.** "Only with very little traffic … and a small β does the rule
  start too late" is right. At 10 requests per rebuild time and β = 0.5, the
  chance of starting too late is e^(−5e^(−2)) ≈ 0.51 ("about half", as Figure
  9 says). At β = 1 it is 2.5%.
- **Illustrative against measured.** The Sources entry separates the
  illustrative figures from the observed sequences and the lab measurements
  clearly, and states the platform (macOS, libc malloc).
