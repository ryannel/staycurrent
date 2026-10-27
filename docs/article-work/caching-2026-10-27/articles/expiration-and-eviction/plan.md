# Plan: Cache expiration and eviction (article 4)

## The reader at the start

They have read articles 1 to 3. They write cache-aside reads with
`SET product:42 <json> EX 300`, know that the miss ratio sets database load,
know that popularity is skewed so a small cache catches most requests, and know
that a TTL bounds how long a copy can be wrong (introduction, figure 8). They
know delete-on-write from article 2 and how to name and size values from
article 3. What they do not know: where the 300 should come from, what Redis
actually does when the 300 seconds are up, and what happens when Redis runs out
of memory. Concrete situation: an online shop's product cache on one Redis.

## The questions, in order

1. Where should a TTL come from? One key, read at rate r, changing at rate λ.
   Derive hit ratio rT / (1 + rT) and stale share of hits
   1 − (1 − e^(−λT)) / (λT) ≈ λT/2. Figure 1 shows one key living through
   fills, hits, changes and expiries. Figure 2 shows that the cost (staleness)
   is the same for every key and the benefit (hit ratio) depends on how often
   the key is read: TTL is chosen from staleness tolerance; it barely matters
   for hot keys and cannot rescue cold ones.
2. What happens at the moment a TTL runs out? Reads stop seeing the key within
   about a millisecond (measured), but the memory is freed only when a command
   touches the key or the background cycle finds it. Figure 3 toggles the
   cycle. Measured: 200,000 expired keys held 38 MB with the cycle off. How the
   cycle samples (20 keys a loop, repeat above 10% expired, 25% CPU cap; the
   redis.io latency page is out of date). The commands that set, read, keep
   and clear a TTL, with the plain-`SET` trap (table, measured).
3. What if many keys get the same TTL at the same moment? Derivation of jitter
   (N / 2jT). Figure 4: 10,000 keys filled together; jitter spreads the first
   expiry and the spread grows each cycle. Measured inside Redis: a million
   keys expiring in the same millisecond gave about 1.5 s of 26 ms stalls; the
   same keys spread over 30 s gave none above 13 ms. Stampede load itself is
   article 6.
4. What happens when memory runs out? `maxmemory` 0 and `noeviction` are the
   defaults; a full Redis refuses writes (measured OOM). Figure 5: the same
   write stream into a full Redis under `noeviction`, `volatile-lru` and
   `allkeys-lru`, with some keys lacking a TTL. Notice: volatile policies only
   evict keys with a TTL and become `noeviction` when those run out; allkeys
   policies evict durable keys too. ElastiCache defaults to `volatile-lru`.
   A value bigger than `maxmemory` (measured).
5. The ten policies and how to choose: table; LRM is 8.6+.
6. How does Redis find the least recently used key without a list? 24-bit
   clock at one-second resolution, sampling `maxmemory-samples` keys, a pool
   of 16. Derivation 1 − (1 − q)^k. Figure 6: sampling and the pool on 100
   keys, slider for samples. Measured precision table (1 to 64 samples). The
   one-second clock and small, fast-churning caches.
7. How does LFU count to a million in eight bits? The Morris counter: start
   at 5, increment with probability 1 / ((c − 5)·F + 1); expected accesses
   derived. Figure 7: counter against accesses for factors 1, 10, 100 with
   measured points. Decay: one per `lfu-decay-time` minutes (source and
   measurement; the 2016 antirez post's halving is out of date).
8. Which policy gives the better hit ratio? Figure 8: measured hit ratio
   against size for oracle, LRU, LFU and random on a real Redis
   (Zipf 0.8, 4 million keys). LFU's lead shrinks as the cache grows. Figure 9:
   a batch job reading every item once, LRU against LFU, live model; measured
   counterpart on Redis.
9. How do you see all this on a running server? `INFO` fields and the docs'
   diagnosis recipe (a short table; alert thresholds are article 11's).
10. Closing: the decisions the reader can now make, and the link to
    invalidation (article 5) and stampedes (article 6).

## Figures

1. **One cached key under a TTL.** Live timeline. Lanes: database value
   (changes as write squares), Redis copy (bars from fill to expiry), reads
   (hit, miss, stale). Control: TTL. Notice: a longer TTL turns misses into
   hits and also turns more hits stale.
2. **What a longer TTL buys.** Chart, no clock. Hit ratio and stale share of
   hits against TTL (0 to 60 minutes), value changing once an hour. Control:
   how often the key is read (once an hour, minute, second). Readouts: TTL
   needed for a 90% hit ratio and the stale share at that TTL. Notice: the
   stale line never moves.
3. **Expired is not yet deleted.** Live. Keys in memory as cells, live or
   expired-but-held; chart of both counts. Control: background expiry cycle on
   or off. Notice: with the cycle off, dead keys pile up and only reads remove
   them.
4. **Keys cached together expire together.** Chart, no clock. Refreshes a
   second over four TTL cycles for 10,000 keys. Control: jitter. Notice: one
   spike per cycle without jitter; a spread that widens each cycle with it.
5. **When Redis is full.** Live. A grid of memory slots, cache keys with TTLs
   and keys without. Control: policy. Readouts: writes refused, keys evicted,
   keys without a TTL removed.
6. **Sampling for the oldest key.** Live, one eviction a second. 100 keys
   shaded by idle time; sampled keys outlined; a pool of 16 candidates.
   Control: `maxmemory-samples`. Readout: share of evictions that took a key
   from the oldest tenth.
7. **A counter that slows down as it climbs.** Chart. Expected counter
   against accesses (log axis drawn as powers of ten) and measured points.
   Control: `lfu-log-factor`.
8. **Hit ratio against cache size, measured.** Static chart from the real
   server.
9. **A batch job reads everything once.** Live chart of hit ratio over time
   for sampled LRU and LFU; the job starts at 20 s.

## Where I stop

- Stampede load and its remedies: one paragraph after jitter, link to
  article 6.
- Replica expiry and memory: one sentence each, link to article 9.
- Hash-field expiry: one sentence on its interaction with volatile policies,
  link to article 3.
- Per-key memory overhead and encodings: article 7. Alert thresholds and
  capacity planning: article 11. Hot-key detection with LFU: article 10.
- Keyspace notifications: one sentence on their timing.
- Not covered because no decision changes: the 16-bit LFU minute clock
  wrap-around, `maxmemory-eviction-tenacity` beyond one sentence, the
  exact cursor mechanics of the active cycle, TinyLFU and other admission
  policies beyond a pointer.
