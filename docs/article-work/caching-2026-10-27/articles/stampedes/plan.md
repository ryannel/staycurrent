# Plan: Cache stampedes and the thundering herd (article 6)

## The reader at the start

They have read articles 1 to 5. They write cache-aside reads with `GET` and
`SET ... EX`, know that miss ratio sets database load (1), that a cache lost
under overload can stop refilling unless fills outlive the request (2, Figure
4 there), that keys filled together expire together and jitter spreads them
(4, Figure 4 there, including the Redis-side cost), and that a lease is a token
written with `SET ... NX PX` that a delete can cancel (5). Article 2 promised
"a better rule for when to refresh" than refresh-ahead's fixed threshold.

Their situation: the home page shows "trending products", one key every
visitor needs, built by a 200 ms aggregate query and cached for a minute.
Traffic is 500 requests a second. Once a minute the database graph spikes and
the page is slow for a moment. Nothing is wrong with the hit ratio (99.9%+).
They need to know why, how big the spike is, and which of the standard
remedies to use where.

## The questions, in order

1. **What happens at the moment a hot key expires?** Every request that
   arrives before the first rebuild lands also misses and also rebuilds.
   Size = r·δ (requests a second × rebuild time), derived in two lines;
   500 × 0.2 = 100 identical queries. Figure 1 (live scene, rate slider).
   Measured on a real Redis with a simulated 200 ms database.
   Term: cache stampede (also dog-piling); "thundering herd" in common use,
   with the narrower Facebook meaning noted.
2. **Why is the database hurt more than 100 queries suggests?** It runs the
   99 duplicates after the first has already filled the cache; with a pool
   of 20 connections they queue for 1 s, and every other page waits behind
   them. Timeouts and retries add more; queries sharing CPU slow the first
   fill, which grows the stampede (Vattani's "cascading"). Figure 2 (chart of
   connections busy and waiting, plus another page's wait; rate slider).
3. **Is this the same as many keys expiring together?** No: different cause,
   different remedy. Short section, no figure; link to article 4's jitter
   figure. Rule: hot single key → coalesce or refresh early; many keys filled
   together → jitter. A key with r·δ < 1 cannot stampede on its own.
4. **Can one process stop asking twice?** Single-flight: in-process map of
   in-flight loads. Figure 3 (same scene; choice none / single-flight; four
   processes): queries fall from ~r·δ to one per process. Limits: per process,
   shared errors and latency, a hung leader holds everyone, shared object.
5. **How do processes agree on one rebuilder?** A rebuild lock in Redis:
   `SET lock:K token NX PX ms`, re-check the cache after acquiring, fill,
   release with `DELEX lock:K IFEQ token` (8.4+) or the Lua script. Figure 4
   (steps). Then Figure 5 (scene; choice single-flight / lock): one query,
   but every other request waits about one rebuild. Waiting strategies.
   The lease from article 5 is the same primitive written into the key
   itself; Facebook's numbers (17K/s → 1.3K/s).
6. **What can go wrong with the lock?** Figure 6 (steps; choice DEL /
   DELEX IFEQ): lock TTL shorter than the rebuild lets a second rebuilder in;
   a failing holder that releases with plain `DEL` deletes its successor's
   lock and lets a third in. Choosing the TTL. Efficiency lock, not a
   correctness lock (Kleppmann; Redis docs on failover); Redlock one sentence.
7. **Can readers avoid waiting?** Serve stale while one request refreshes:
   soft and hard expiry, read with `GET` + `PTTL`. Figure 7 (scene; choice
   lock / serve stale): one query and no waiting. Costs: staleness bounded by
   soft TTL + rebuild; memory; the cold path still needs the lock. Precedent:
   HTTP `stale-while-revalidate`, Facebook's stale-on-delete.
8. **Can requests refresh early without coordinating?** XFetch. The rule,
   derived: exponential head start; H(x) = rδβ·e^(−x/δβ); first rebuild about
   δβ(ln rδβ + γ) before expiry; e^(1/β) rebuilds per expiry independent of
   rate. Figure 8 (live timeline; β slider): each request's head start drawn
   as a line, rebuild when it reaches expiry. Figure 9 (β and rate sliders,
   chart of rebuilds per expiry vs β; readouts for lead): rate moves the lead
   only. Settle the e versus e − 1/e question in one paragraph. Redis
   implementation: store δ with the value, `PTTL`, no extra round trip.
   Limits: needs r·δ ≫ 1; duplicates remain; combine with a lock.
9. **What changes at a cold start?** Every key is missing at once, so every
   hot key stampedes together and the database spends its capacity on
   duplicates. Figure 10 (article 2's scenario, fills outlive requests;
   choice: every miss queries / one query per key): duplicate share and
   recovery time. Serving stale cannot help (nothing stale exists).
   Warming and controlled restarts: article 11.
10. **What to use where.** Table: technique, what it stops, what it costs,
    Redis commands. Decision questions. Closing with forward links (7, 10, 11).

## Figures

1. Live scene, one hot key, no protection; slider: requests a second.
   Notice: a burst of miss dots per expiry ≈ rate × rebuild time.
2. Chart, database pool of 20; slider: requests a second. Notice: the first
   query fills on time; the queue of duplicates keeps the database busy for
   r·δ·δ/c, and another page's query waits that long.
3. Scene, 4 processes; choice none / single-flight. Notice: four queries.
4. Steps: rebuild lock happy path with re-check and token release.
5. Scene; choice single-flight / lock. Notice: one query, waiting requests.
6. Steps; choice DEL / DELEX IFEQ: expiry overlap and successor's lock deleted.
7. Scene; choice lock / serve stale. Notice: no waits, stale responses.
8. Live XFetch timeline; slider β. Notice: lines reach expiry more often as
   it nears; 1–4 rebuilds per expiry.
9. Chart of rebuilds per expiry vs β; slider β, choice of rate (10 to 10,000
   requests per rebuild time). Notice: rate does
   not move the curve, only the lead.
10. Cold-start charts (hit ratio, database queue wait) showing both runs
    together, every miss queries and one query per key; slider: database
    capacity. Notice: duplicates matter most when the database is near its limit.
    (Changed while building: showing both runs at once compares them better
    than a choice between them.)

## Where to stop

- No distributed-locking theory beyond "efficiency lock"; Redlock and fencing
  tokens get one sentence and links.
- No queueing theory beyond Little's law and the pool drain arithmetic.
- No metastable-failure treatment beyond linking article 2's figure and 11.
- No warming procedure (article 11), no hot-key steady load (article 10),
  no atomic-operation teaching (article 8): use `DELEX` and show the Lua
  script for older versions.
- XFetch's known-rate variants (paper §7) are not decision-relevant.
