# Caches and in-memory stores: proposed coverage map

18 October 2026. Proposal for discussion within the [field plan](../databases-and-storage-plan.md),
before independent planning review or writing. Use the [shared map conventions](databases-and-storage.md#map-conventions).

An expert user chooses what can be reused, specifies acceptable staleness, prevents
the relevant races and bounds the work when the cache is cold or unavailable.
Authoritative in-memory state needs a separate recovery promise from expendable
cached answers; the same product can perform either job.

Running example: P7's cached price changes from 20.00 to 22.00. Customer 42's
catalogue view may be stale; the purchase must honour its own price rule. Tenant
T4's request counter supplies the atomic-data-structure example.
Base: `/learn/databases/caching/`; retain the existing entrance.

| ID | Proposed page and role | Owned sections and reader outcome | Teaching form | Entry needs; onward homes | Existing material / destination |
| --- | --- | --- | --- | --- | --- |
| C01 | Caches and in-memory stores — introduction | Reused answer against source of truth; local/shared/client/edge cache roles; hit/miss and saved work; staleness; memory-first authoritative data; when the source is already fast enough. Choose a role before a product. | Repeated P7 reads, one changed price and a disappearing copy. | No cache knowledge. C02/C03/C08; O08 owns HTTP object-delivery specifics. | Existing `/learn/databases/caching/`; split current material into the proposed homes. |
| C02 | Freshness, invalidation and fill races — deep dive | Cache-aside; update/delete order; stale fill after invalidation; versioned keys and validation; TTL/negative caching; write-through/behind boundaries; defining the stale window. Preserve the application promise under concurrent reads/writes. | Pause an old price fill, update source, invalidate, then resume; repair and follow the repair's cost. | C01; F05 owns durable copy protocols, R11 external-write ambiguity. | New `freshness-and-invalidation/`. |
| C03 | Keys, admission and eviction — deep dive | Correct cache identity and variation; tenant/user leakage; cardinality; value/entry overhead; admission; LRU/LFU approximations; TTL against eviction; large-object and scan pollution. Spend memory on useful reusable work. | Same request with a missing tenant key; vary skew and capacity, count hits and source work. | C01; C06 implementation policies. R16 owns a database's page cache. | New `keys-and-eviction/`. |
| C04 | Miss storms and overloaded sources — deep dive | Stampedes; per-key request coalescing; jitter; refresh-ahead/stale-while-revalidate; hot keys; concurrency/time budgets; cold start; controlling source load. Bound misses rather than assuming every cache hit is independent. | Many simultaneous P7 misses and an unavailable cache; change one policy and inspect source concurrency. | C02/C03; F07 owns load methodology. A general queueing course remains outside scope. | New `misses-and-overload/`. |
| C05 | Losing a cache and recovering in-memory state — practical guide | Disposable against authoritative state; restart warm-up; persistence snapshots/logs; asynchronous replication/failover loss; partial outage/fallback; backup/restore; permissions, monitoring and capacity headroom. Specify and test the right recovery behaviour. | Cache disappears during traffic, then compare a counter that was the only authoritative copy. | C01/C04; R15 local durability principles, C06 native persistence settings. | New `recovery-and-operations/`. |
| C06 | Redis and Valkey request paths — product deep dive | Data structures and memory; command/script/transaction atomicity; expiry/eviction; persistence and fork costs; replication, WAIT and failover limits; cluster slots/hot keys; clients/access and diagnostics. Distinguish engine, topology and service guarantees. | Native price/counter traces, memory observation and restart/failover experiments with pinned versions. | C02–C05; F03 vocabulary supplied locally. | New `redis-and-valkey/`. |
| C07 | Counters, rate limits and short-lived ownership — practical guide | Atomic increments and expiry together; fixed/sliding/token-bucket windows; idempotent retries; time source; lease expiry and stale owners; fencing requirements and limits of a store-only lock. Use atomic primitives within an honest guarantee. | Tenant T4's requests around a window boundary; a paused owner acts after expiry. | C06-level atomic operations explained locally; R11 retry identity. General distributed locking programme stays parked. | New `atomic-patterns/`. |
| C08 | Choosing a cache arrangement — comparison | No cache/local/shared/edge; Redis/Valkey/Memcached and managed variants; lookup cost, staleness, memory, failure and operating work; authoritative uses assessed separately. Choose the least costly arrangement that survives the workload. | Repeated product read, session state and expensive report compared with direct source access. | C01/F02; F07 evaluation; O08 HTTP delivery. | New `choosing/`. |

The sequential existing browser model cannot prove the stale-fill race. A later
lesson should expose separately schedulable reads, source writes, invalidation and
fill. It remains a teaching model; native command/persistence semantics need their
own evidence. Broker/queue/stream internals remain in the planned messaging field.
