# Redis memory and performance — article 9

27 October 2026. In progress: primary research and first native lab complete.
No public article, figures or models yet. Keep manifest planned until full gate.

## Teaching design

Start with one extra hash field causing a larger-than-expected allocation change.
Avoid treating JSON bytes, MEMORY USAGE, used_memory, RSS and host memory as the
same number. Tie sizing to workload and application design rather than a magic
percentage. Command cost includes traversal, returned bytes, allocation/freeing
and contention; a cache hit can still be expensive.

Proposed four experiments:
1. Fixed measured observations: a 512-field listpack vs 513-field hashtable, plus
   payload/key/allocated-size samples. Show the representation change rather than
   imply smooth linear growth. Label exact build and no universal byte constants.
2. Capacity layers: logical payload, Redis allocation, process resident memory,
   excluded buffers and operational headroom. Do not add overlapping INFO fields.
   Let the reader vary workload/peak assumptions and see what maxmemory does and
   does not constrain. Explicit illustrative inputs, no production recommendation.
3. Copy-on-write page grid: fork shares pages; writing a previously unmodified page
   creates another physical copy; repeatedly changing that page does not allocate
   another snapshot copy each time. Completion releases snapshot-only pages.
   Separate fork overhead and transient physical-memory pressure from key expiry.
4. Incremental traversal vs one large command, or large aggregate deletion:
   preserve total work while allowing interleaving, explain SCAN cursor semantics
   and UNLINK's key invisibility vs delayed memory reclamation. Choose one strong
   visual argument; prose can connect the complementary command without stuffing
   everything into controls. Prior article already covers long execution queues.

Scope: practical measurement, key/value representation, large keys, command
complexity, bounded incremental maintenance, maxmemory vs host budget, COW and
measurement under representative load. Persistence/recovery guarantees belong to
article 10; eviction policy mechanics already taught in article 3. Connect rather
than repeat. No live production configuration changes.

## Native lab already executed

examples/caching/memory-lab currently contains package/lock/run/client (README,
public zip and final polish still needed). Reuses private Unix-socket runner;
Redis 8.2.2 official source, libc, 64-bit arm64 macOS, Node 24.16.0, node-redis 6.3.0.
Run with REDIS_SERVER=/private/tmp/redis-8.2.2/src/redis-server node examples/caching/memory-lab/run.mjs
First observations in evidence/memory.txt; all assertions passed:

- String payload 0/16/1024/65536 bytes: MEMORY USAGE 32/48/1312/81952 with key
  lengths 7/8/10/11. Encoding embstr/embstr/raw/raw. These are measured allocations,
  not general Redis sizing constants or pure overhead decomposition.
- Same value, key length 1 vs100: 48 vs144 bytes.
- CONFIG GET verifies default hash listpack limits 512 entries, 64-byte value.
  512 fields: listpack7200bytes. Add one field: hashtable37008bytes.
- HSCAN compact 512-field hash with COUNT1 returns cursor0 and all512 fields.
- SCAN MATCH no-such-prefix with COUNT1 returns six empty batches before cursor0.
  Number of batches is not a guarantee; asserts only full traversal and no matches.
- HGET returns one field; HGETALL returns513. SLOWLOG captured both after explicitly
  lowering threshold only on this disposable instance. Observed1us/27us are not
  benchmarking results and should not become a latency claim.
- UNLINK makes key absent immediately. No claim about time to release memory to OS.
- INFO values recorded: used_memory, dataset, overhead, rss,
  mem_not_counted_for_evict, lazyfree_pending_objects. Do NOT add all these together.
- No native COW timing test yet; a conceptual OS-page model can be sourced and
  explicitly labelled rather than forcing a timing-sensitive BGSAVE experiment.

## Primary references read / located

https://redis.io/docs/latest/commands/memory-usage/
Reports allocations for key/value; nested values sampled (default5), SAMPLES0
samples all. Current docs include Redis8.10 compact-template change, not baseline.
https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/memory-optimization/
Compact encodings, listpack512/64 defaults, conversion on crossing limits; raising
thresholds trades CPU for memory. Older sections contain historical recommendations
and Redis2.2 measurements: do not reproduce them as current constants.
https://redis.io/docs/latest/commands/info/
mem_not_counted_for_evict covers transient replica/AOF buffers. Read remaining
memory field definitions carefully before building accounting figure.
https://redis.io/docs/latest/commands/scan/
COUNT is work hint, not strict batch size. Compact encodings may return all entries.
Full iteration ends at returned cursor0, not an empty batch. Need verify duplicates
and concurrent-mutation guarantees before explaining those.
https://redis.io/docs/latest/commands/unlink/
Detach key in O(1) per key; reclaim allocation work in another thread. A command
with many keys is still proportional to number of keys. Inspect version source
before overclaiming every tiny value necessarily gets asynchronous reclamation.
https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/
Forked background snapshot and rewrite use COW. Read actual8.2 behaviour and avoid
older pre7AOF explanations. This article covers memory, not persistence guarantees.
https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/
Read selectively: expensive commands, fork, paging. Many examples and OS tuning
recommendations are old; do not present them as current universal configuration.

## Gate

Complete the causal illustrations and connected prose, then model invariants,
native evidence and downloadable lab, reference-teaching self-review, desktop
light/dark and phone/keyboard controls, build. Update manifest and article8link,
commit/push main and verify exact deployment/live control. Continue alone.

## Completion evidence

Four figures and connected prose implemented, native lab packaged and repeated,
four model tests added (43total), rendered desktop/phone review complete, final
build passes all13rules. See article-09-review.md. Publication underway.
