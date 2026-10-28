# Plan: Operating a cache: monitoring, capacity and failure (article 11)

## The reader's starting situation

The reader has read articles 1–10 (or at least 1–6). They have built the shop's
product cache: cache-aside, sensible keys, TTLs with jitter, an `allkeys` policy,
stampede protection, perhaps a replica. Now they are on call for it. They know
what a hit ratio is, why losing the cache multiplies database load by
1 / (1 − h) (introduction Figure 10, replication article Figure 1), that a
cold cache can trap a database in a metastable state (caching-patterns
Figure 4), and how client timeouts and retries behave (clients article). What
they do not yet have is the operator's view: how to tell whether the system
survives losing the cache, what the application should do while the cache is
gone, how to bring an empty cache back into service, what to watch and alert on,
how big to make it, how to keep strangers out of it, and what changes when
someone else runs it.

## Questions, in order

1. **Can the database live without the cache?** Latency cache versus capacity
   cache (SRE book). Derive the vulnerable band: warm load R(1 − h) ≤ C gives
   R ≤ C / (1 − h); cold load R ≤ C. Between the two the system is healthy but
   one trigger from failure (Bronson's vulnerable state). Traffic growth moves a
   latency cache into the band without anyone deciding it. Figure 1.
2. **How do you find out before an outage does?** Failure testing: arithmetic
   first, then deliberate drills. `CLIENT PAUSE` as a built-in hung-Redis drill
   (measured: refused connection fails in ~1 ms, a paused Redis holds every
   request until the client's timeout). Short; no figure.
3. **What should the application do while Redis is gone?** The degradation
   ladder: fail the cache call fast (timeouts, from article 8, plus a circuit
   breaker), then bound the work sent to the database (a concurrency limit sized
   by Little's law), then decide what the rest of the requests get (an error, a
   degraded page, stale data from a near cache). Figure 2: thirty seconds without
   Redis (a failover), with and without a limit. The surprise: with no limit the
   database answers almost no one in time, and keeps failing for minutes after
   Redis is back, because it is working through a backlog nobody is waiting for.
   Refers to caching-patterns Figure 4 for the refill trap rather than rebuilding
   it.
4. **How do you bring an empty cache into service?** Planned versus unplanned.
   Best: never empty it (replica promotion, replicate into the new one; link
   article 9). Otherwise: move traffic gradually, or fill misses from the old
   cache before the database (Facebook's cold cluster warm-up). Figure 3: a
   replacement cache cluster taking over from a warm one, all at once / ramped /
   misses read the old cache first. Pre-filling a key list: arithmetic N / S,
   and the Zipf head makes it worthwhile. Never `FLUSHALL` as a fix (measured
   pause).
5. **Is the cache healthy right now?** Monitoring: what to measure and why.
   Windowed hit ratio from cumulative counters; what counts as a hit; per-namespace
   ratios in the application; database queries as the signal that matters.
   Figure 4: measured on a real Redis 8.10.3 driven at 1,000 requests a second,
   four incidents (cache too small, TTL shortened, key names changed, flushed).
   The reader picks an incident and learns which counters move. Lifetime versus
   windowed hit ratio shown on the same chart.
   Then an alert table: signal, field, why, starting threshold.
6. **How big should it be?** Capacity: memory from the working set and measured
   bytes per item; what memory goes to besides data (fragmentation, buffers,
   fork copy-on-write, replica and AOF buffers not counted in `maxmemory`);
   managed services' reserve. Figure 5: the chain from RAM bought to hit ratio
   (one slider: memory per node; one choice: snapshots or replica on/off).
   Then throughput and bandwidth arithmetic, connections (link article 8).
7. **Who can reach it?** Security essentials: bind and protected mode, ACL users
   (measured: key patterns do not stop `FLUSHALL`), TLS, dangerous commands,
   `CONFIG`. No figure; a short configuration block.
8. **Who runs it, and which Redis?** Managed services: the node size is not the
   cache size; defaults differ (`volatile-lru`, reserve, forkless saves);
   commands you may not have. Licensing by version and Valkey, stated only where
   it changes a decision (which engine a provider offers; command names that
   differ, `DELEX … IFEQ` versus Valkey's `DELIFEQ`; lazy-free defaults).
9. **What you can now decide**, with forward link to article 12.

## Figures

| # | Title | One idea | Reader manipulates | What to notice | Model or measured |
| --- | --- | --- | --- | --- | --- |
| 1 | Latency cache or capacity cache | Between C and C/(1−h) the system depends on the cache | Slider: hit ratio | The band widens as hit ratio rises; today's traffic sits in it at 90% | Arithmetic |
| 2 | Thirty seconds without Redis | A limit on database work turns zero answered into capacity answered, and ends the outage when Redis returns | Choice: no limit / limit | No limit: answered in time falls to ~0 and stays there long after Redis is back | Model (queue) |
| 3 | Bringing an empty cache into service | How traffic meets an empty cache decides the database's peak | Choice: all at once / ramp / old cache first | Peak database load and failed requests | Model |
| 4 | What INFO shows during four incidents | Each cause leaves a different fingerprint in the counters | Choice: incident | evicted vs expired vs keys vs memory; lifetime ratio barely moves | Measured on Redis 8.10.3 |
| 5 | From memory to hit ratio | The node you buy is not the cache you get | Slider: RAM per node; choice: forks or not | Items held and hit ratio after every deduction | Measured bytes per item + arithmetic (ideal-cache hit ratio) |

## Where I stop

- Not teaching timeouts and retries (article 8), stampede mechanics (6), the
  refill trap's mechanism (2, Figure 4), restart cost curves and replica
  failover (9), latency diagnosis tools (7), hot-key tools (10), eviction
  internals (4).
- No vendor-by-vendor managed-service survey: ElastiCache as the one checked
  example, with the general lesson.
- Licensing: facts by version, and the decisions they change. No legal
  interpretation of the AGPL beyond pointing to it.
- No CoDel/LIFO/adaptive throttling detail: mentioned as further options.
