# Plan: Redis clients: round trips, pipelining and atomic operations (article 8)

## The reader at the start

They have read articles 1 to 7. They write cache-aside reads and writes, they
know Redis runs every command on one thread, that a `GET` costs the server well
under a microsecond of execution, and that most of the server's time per request
goes on socket work (article 7, which showed the 16-per-round-trip benchmark and
named pipelining). Earlier articles left them four promises to collect here:

- Article 2: "set both a connect timeout and a command timeout"; this article
  says how to choose them.
- Article 3: a page built from twelve cached products is "one `MGET`, so one
  round trip"; this article says what a round trip costs and why one is better
  than twelve. Article 3 also warned that two processes rewriting one JSON value
  can lose an update; this article shows the remedy.
- Article 5 uses `SET … IFEQ` for leases and a Lua "set only if newer" script
  for versioned values, without teaching either mechanism.
- Article 6 uses `SET … NX PX` for a rebuild lock and needs a safe release.

Their situation in the opening: a product listing page with 24 products, all
cached, a 99% hit ratio, Redis reporting about a microsecond per command, and
yet the page spends 12 ms waiting for Redis. The code reads the 24 products in a
loop.

## The questions, in order

1. **What does one request to Redis cost the application?** What the client
   sends (RESP, the bytes, observed) and the two parts of the cost: the network
   round trip and the server's work. Measured: loopback round trip about
   0.1 ms against about 1 µs of execution. A real network is slower: docs give
   about 200 µs for 1 Gbit/s; same-zone cloud figures are illustrative.
2. **Why is the page slow?** Twenty-four requests one after another pay 24
   round trips. Derivation: T ≈ n × (RTT + e) ≈ n × RTT. Figure 1.
3. **How do we pay one round trip instead of 24?** Pipelining (send all, then
   read all) and multi-key commands (`MGET`, `MSET`, `MSETEX` 8.4+). Figure 2.
   Measured table on loopback and through a delay proxy at about 1 ms.
   What a pipeline is not: not atomic, other clients interleave, errors are per
   command, a later command cannot use an earlier reply. Choosing between
   `MGET` and a pipeline; batch size (formula with ⌈n/b⌉ round trips, measured
   table); replies queue in server memory (measured `omem`). Cluster: one
   sentence and a link to article 10.
4. **Why does a page with many round trips have a worse tail than its mean
   suggests?** If one round trip in 100 is slow, a page that waits for k of them
   is slow with probability 1 − 0.99^k (Dean and Barroso). Figure 3. Batching
   cuts k, which is a second reason, often the bigger one.
5. **What does a connection cost, and how many do we need?** Opening a
   connection per request (measured 3.2× on loopback; TCP handshake one extra
   round trip, TLS one or two more, `AUTH`/`HELLO` one more). Figure 4 (steps).
   Pools and multiplexed connections; sizing a pool from Little's law; pools
   multiply across instances against `maxclients` 10,000.
6. **What should the client do when Redis is slow or unreachable?** Timeouts:
   connect and command; library defaults vary (5 s, 2 s, 60 s); choose from the
   latency distribution (Brooker: a false-timeout rate such as 0.1% → p99.9).
   A timeout does not cancel the command (measured: INCR executes after the
   client hangs up). Figure 5 (steps): retrying `INCR` after a timeout counts
   twice; `SET` does not. Retries: safe only for idempotent commands; each layer
   multiplies (243×); retries add load when Redis is slowest; capped backoff
   with jitter, a retry budget (SRE book: 10% → about 1.1×). Figure 6 (live):
   a Redis stall with no retries, 3 retries, 3 retries with a budget. Stop at
   the client; circuit breakers and falling back belong to article 11.
7. **How do two clients change one value without losing an update?** The
   read-modify-write race (measured 376 of 4,000 increments survived). Figure 7
   (live): clients incrementing one counter, choice GET+SET / WATCH / one atomic
   command. Single commands as the first answer (`INCR`, `HINCRBY`, `SET NX`,
   `SET … GET`, `GETDEL`, `GETEX`).
8. **What if no single command does it?** `MULTI`/`EXEC`: all or nothing in
   execution, no rollback, cannot branch (measured error behaviour). `WATCH`:
   optimistic check-and-set; aborts on any write including the same value,
   expiry and eviction. Figure 8 (steps). Cost under contention (measured
   retries). Lua scripts: one round trip, atomic, read-compute-write on the
   server; `EVALSHA`, `NOSCRIPT`, volatile script cache; a slow script blocks
   everyone (measured `BUSY`, `UNKILLABLE`); declare keys. Functions (7.0+):
   stored, replicated, persisted, but an ephemeral cache still loses them.
9. **The worked example: set only if newer.** The versioned compare-and-set
   that article 5 uses: as a `WATCH` loop, as a script (the one article 5 uses),
   as a function. Redis 8.4+: `SET … IFEQ`, `IFNE`, `IFDEQ`/`DIGEST`,
   `DELEX` — equality only, so "newer than" still needs a script; `DELEX lock
   IFEQ token` as the safe lock release article 6 relies on. A table: which
   tool for which job.
10. **Serialisation on the client**, briefly: measured microseconds for JSON
    against a round trip; matters only for values of tens of KB. Format choice
    is article 3's.
11. **What you can now decide**, and a link to article 9.

## Figures

1. **Twenty-four reads, one at a time** (live). A ladder (time runs left to
   right; the application's lane above Redis's): each request a line down, each
   reply a line back up. Slider: values the page reads (1–48). Readouts: round
   trips, time waiting for Redis, of which Redis was executing. Notice: the time
   grows in equal steps per value; Redis's own work is a sliver at each turn.
2. **Three ways to read 24 values** (live). The same ladder. Choice: one at a
   time / pipeline / `MGET`. Slider: values (1–48). Notice: the pipeline sends
   every request before the first reply returns; `MGET` sends one request; both
   finish after about one round trip.
3. **Slow round trips and pages that wait for many** (live). A wall of 100 page
   views, each a row of cells, one per round trip; a slow round trip is marked.
   Slider: round trips per page (1–100). 1% of round trips slow. Readouts: slow
   round trips, slow pages (observed in the model), predicted 1 − 0.99^k.
   Notice: at 24 round trips about one page in five is slow.
4. **What opening a connection costs** (steps). Choice: new connection per
   request (TCP, TLS, `HELLO`/`AUTH`, `GET`) / pooled connection (`GET`).
   Notice: the useful request is the last of four or five round trips.
5. **A timeout does not cancel the command** (steps). Choice: `INCR` / `SET`.
   Notice: the server executed the first attempt; the retry counts again for
   `INCR`, and changes nothing for `SET`.
6. **Retries during a Redis stall** (live). Offered attempts, replies the
   application used and replies nobody waited for, against Redis's capacity,
   over 60 s with a stall at 10–20 s. Choice: no retries / 3 retries / 3 retries
   with a 10% budget. Notice: retries raise the load during the stall, most
   work done during the stall is for clients that have gone, and recovery is
   slower.
7. **Lost updates on a shared counter** (live). Eight clients adding 1 to one
   key. Choice: `GET` then `SET` / `WATCH` and retry / `INCR`. Readouts:
   increments made, value in Redis, lost, retries, round trips per increment.
8. **WATCH aborts a transaction** (steps). Two clients; A watches, reads,
   B writes, A's `EXEC` returns nil, A retries. Notice: nothing A queued ran.

## Measured versus illustrative

Measured on Redis 8.10.3, port 7108 (evidence/clients-and-pipelining.txt): RESP
bytes, loopback round trip, sequential/pipeline/`MGET` table (loopback and
through a delay proxy), batch sizes, connection per request, pipeline
interleaving and errors, output buffer growth, `INCR` executing after the client
leaves, lost updates and `WATCH` retries, `MULTI` errors, `WATCH` semantics,
`NOSCRIPT`, script error without rollback, `BUSY`/`UNKILLABLE`, functions,
`SET IFEQ`/`DELEX`/`DIGEST`/`MSETEX`, set-only-if-newer script, `maxclients`,
serialisation timings. Illustrative: every number in Figures 1–3, 6 and 7
(models with stated parameters); Figures 4 and 5 are sequences. Cited: 200 µs
(Redis docs), 63% (Dean and Barroso, read in the original), 243× (Brooker),
1.1× (Google SRE book), 24 keys per batch (Nishtala et al.).

## Where to stop

- RESP3 types, push messages and `HELLO` options: one sentence. Client-side
  caching (`CLIENT TRACKING`): article 10.
- Cluster: `CROSSSLOT` and slot-splitting of pipelines in one sentence, linked
  to article 10.
- Circuit breakers, falling back to the database, load shedding, metastable
  recovery: article 11. TLS and ACLs as security: article 11.
- Lock correctness (lease expiry, fencing): article 6. The invalidation races
  themselves: article 5.
- Server-side cost of socket work and I/O threads: article 7.
- No benchmark of client libraries against each other; defaults named only to
  show that they differ and must be set.
