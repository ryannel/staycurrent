# Plan: Redis Cluster, sharding and hot keys (article 10)

## The reader's starting situation

The reader has read articles 1–9. They can design a cache-aside cache with good
keys, TTLs, eviction, invalidation and stampede protection, and they know Redis
as one process with one main thread (article 7, about 130,000 simple requests a
second on my laptop), reached by round trips that they now batch (article 8),
optionally with replicas and failover (article 9).

Their situation: the shop's product and session cache has outgrown one server.
It holds more than one machine's memory, or its main thread is near its ceiling
at peak. Then, during a flash sale, one product's key carries a large share of
all reads, and adding servers does nothing for it. They have heard of Redis
Cluster, hash slots, hot keys and "client-side caching", but have never run a
cluster.

## The questions, in order

1. **When does a cache need more than one server?** Memory, the one main thread,
   network. Replicas add reads and safety, not memory or writes. When not to
   shard. (Short; links to 7 and 9.)
2. **How do you split keys between servers without losing the cache when you add
   one?** `hash mod N` moves N/(N+1) of keys; a moved key in a cache is a miss.
   Consistent hashing (Karger et al. 1997) moves about 1/(N+1). Redis Cluster uses
   fixed hash slots and moves slots *with their data*. Figure 1.
3. **Which server holds a key?** `CRC16(key) mod 16384`, slot ranges per node;
   hash tags; why 16,384. Figure 2 (calculator, real CRC16).
4. **What can't you do any more?** Multi-key commands, transactions and scripts
   need one slot (`CROSSSLOT`); a client splits `MGET` per node; database 0 only;
   `SCAN` per node. What this does to articles 3, 5 and 8's patterns. Hash tags
   help and concentrate. Figure 2 covers this with several keys.
5. **How does a client find the right node, and what happens when slots move?**
   Slot map, `MOVED`, `ASK`, `ASKING`, `TRYAGAIN`. Figure 3 (stepped,
   observed on a real local cluster).
6. **How do you add a shard to a running cache?** Resharding: legacy
   key-by-key `MIGRATE` vs atomic slot migration (8.4). Measured on a local
   cluster under load: redirections and errors seen by a client, time taken.
   Table, maybe a figure if the data is striking.
7. **What happens when a node dies?** Cluster failover as it differs from
   Sentinel: failure detection by the cluster bus, `cluster-node-timeout` (15 s
   default), replica election; a shard without a replica takes the whole cluster
   down unless `cluster-require-full-coverage no`; `cluster-allow-reads-when-down`.
   Figure 4: measured requests per second by shard through a primary failure,
   three scenarios.
8. **Why can one key overload a cluster?** Zipf arithmetic: top key share
   1/H_N; the hottest shard caps usable capacity; adding shards helps less and
   less. Figure 5 (model, real CRC16 placement).
9. **How do you find hot keys?** `redis-cli --hotkeys` (LFU only; a logarithmic
   counter ranks but does not count), `HOTKEYS` (8.6, CPU and network share),
   `CLUSTER SLOT-STATS` (8.2), per-node `INFO`, `MONITOR`'s cost. Figure 6:
   measured, three tools against true counts.
10. **How do you relieve a hot key?** Ordered by cost: near cache, copies of the
    key, replica reads, moving neighbours away, splitting counters. Figure 7
    (same model as Figure 5, with a choice of remedy).
11. **How does a near cache stay correct?** In-process cache; staleness across
    processes; `CLIENT TRACKING` default mode (per-key, forget after one
    invalidation), broadcast mode (prefixes), `OPTIN`, `NOLOOP`; RESP3 push vs
    `REDIRECT`. Figure 8 (stepped, observed).
12. **What can go wrong with it?** Invalidation overtaking a read on a second
    connection (placeholder fix), lost connection (flush), tracking table full
    (spurious invalidations), no staleness bound (cap local TTL). Figure 9
    (stepped race).
13. **What you can now decide.** Checklist; forward link to article 11.

## Figures

| # | Idea | Reader manipulates | Should notice | Data |
| --- | --- | --- | --- | --- |
| 1 | Adding a server: how much of the cache goes cold | Choice: `hash mod N`, consistent hashing, hash slots; slider: servers before | mod N empties most of the cache; a ring 1/(N+1); slots move data so nothing misses | Model with real CRC16 for slots |
| 2 | Key → slot → node, and which keys can share a command | Text field of keys (an `MGET`), preset buttons | Only the tag is hashed; keys on several slots give `CROSSSLOT`; a client would split per node | Real CRC16, checked against `CLUSTER KEYSLOT` |
| 3 | `MOVED` and `ASK` | Steps; choice "slot has moved" / "slot is moving" | `MOVED` updates the map; `ASK` is one query only, with `ASKING` | Observed on a local 3-node cluster |
| 4 | One primary fails | Choice: with replica / no replica (full coverage yes) / no replica (full coverage no) | ~15 s gap only for the failed shard's slots; without a replica the whole cluster stops unless full coverage is off | Measured, local cluster, default node timeout |
| 5 | A hot key caps the cluster | Slider: shards; choice: skew | The hottest shard's load stays while fair share falls; usable capacity falls | Model |
| 6 | What the tools see | Choice: true counts / LFU counter / HOTKEYS CPU | LFU ranks roughly but compresses 100× into 2×; HOTKEYS measures cost | Measured |
| 7 | Remedies for a hot shard | Choice of remedy (same model as 5) | Near cache and copies flatten the hottest shard; replica reads only help a shard, not a key past one replica | Model |
| 8 | Client tracking: default and broadcast | Steps; choice of mode | Invalidate push; forgotten after one; broadcast sends for keys never read | Observed |
| 9 | The invalidation that overtakes the read | Steps; choice: no placeholder / placeholder | Stale value cached indefinitely without the placeholder | Sequence documented by Redis; illustrated |

## Where to stop

- No gossip protocol details, epochs or config-epoch collision handling beyond one
  sentence: they do not change a practitioner's decisions.
- No Sentinel (article 9) or persistence. Cluster failover only where it differs.
- No proxies (Envoy, twemproxy) beyond a sentence; managed services one paragraph.
- No consistent-hashing algorithm detail beyond the moved-fraction result.
- No near-cache library comparison; name versions that support tracking.
- Operational alerting and capacity planning belong to article 11.

## Evidence plan

- Single node on 7110: tracking (default, BCAST, OPTIN, NOLOOP, table limit),
  `--hotkeys` after a realistic-rate Zipf workload (minutes, so LFU decay and
  the one-second clock apply), `HOTKEYS`.
- Local cluster on 7195–7199 (bus 17195–17199): slots, `CROSSSLOT`, `MOVED`,
  `ASK`, `TRYAGAIN`; reshard to a fourth primary with `redis-cli --cluster
  reshard` (legacy) and `CLUSTER MIGRATION IMPORT` (atomic) under a steady
  client load, counting redirections and errors; failover with default
  `cluster-node-timeout`, a load generator logging successes per shard per
  100 ms; `CLUSTER SLOT-STATS` with `cluster-slot-stats-enabled yes`.
