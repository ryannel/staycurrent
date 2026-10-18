# Caches and in-memory stores: practitioner abilities

Independent derivation, 18 October 2026. Planning only. This file was saved before assigning units to pages. It derives the subject from engineering work and primary sources, without using a collection inventory, coverage map or another derivation. The required content-structure document contains historical relational planning material; that material does not supply this decomposition.

## Audience and scope

The reader builds or operates a service and can follow a request, a database write and a timeout. They need to decide whether memory should hold a disposable result, transient state whose loss has an explicit consequence, or authoritative state that must survive particular failures. They do not need prior knowledge of cache terminology, eviction algorithms or replication protocols.

An expert can specify which answer a cache may return, calculate what happens when it cannot return one, and keep the source safe during that failure. They can use a data-structure server without confusing atomic execution with durable acceptance. They can explain the selected engine's memory, execution, persistence and topology well enough to recover it and defend its limits.

A cache is a role. An in-memory store is an implementation approach. The same product may fill either role, but a missing cached product description and a missing accepted rate-limit update have different consequences. An authoritative in-memory database is within scope when its durability and recovery can be taught honestly. General-purpose distributed coordination, application workflow orchestration and broker design are outside it.

## Running work and state

Use a ticketing service with these deliberately distinct facts:

- `event:42:description` is copied from a durable catalogue. A description has a source version and a declared freshness allowance.
- A rendered event card also depends on locale, tenant and representation version. It cannot reuse a result merely because the event ID matches.
- `viewers:{42}` is a set of currently observed viewers. Its loss is acceptable under an explicit product rule.
- `limits:{tenant7}:2026-10-18T10:30` counts requests in a defined window. Retrying an increment can change the answer.
- `scores:{42}` is a sorted leaderboard with an explicit tie rule. A maintained secondary view is another fact to keep current.
- Purchased tickets and money remain in the source database. A cache hit cannot authorise a sale. A reservation thought experiment is used only to expose the limits of a proposed atomic or lease-based design.

The example makes three questions visible: where the accepted fact lives, what a missing key means, and how the service behaves while that key is absent. It can carry the collection without pretending every workload belongs in one store.

## Ability chains and teachable units

Units have no page assignments here. “Mechanism” calls for inspectable states or a trace; “execution” calls for an actual selected implementation when commissioned. No experiment has been run for this plan.

### Choose whether to cache, and where

The expert starts with saved work and an allowed answer, rather than a product. That requires tracing the current request, identifying repeated work, then deciding where an extra copy helps enough to justify its maintenance.

| Unit | Understanding required | Cheapest sufficient teaching | Change or awkward case | Decision the reader can make |
| --- | --- | --- | --- | --- |
| CA-U01 | Distinguish source of truth, disposable copy and intentionally lossy state; identify who can reconstruct a value. | Three worked request/state diagrams. | The only accepted update exists in a supposedly disposable cache. | State what loss means before choosing eviction or failover. |
| CA-U02 | Relate repeated work, hit fraction, saved source work, added network/serialization cost and tail latency. A high hit fraction alone proves little. | Small numerical workload with a latency distribution. | Cheap hits improve the average while expensive misses dominate the tail. | Add a cache, change the source path, or avoid the extra system. |
| CA-U03 | Place process-local, shared and layered caches; follow duplicate memory, independent cold starts and invalidation domains. | Topology variation on the same request. | An application rollout starts many empty local caches at once. | Pick the smallest useful placement and identify its failure domain. |

### Specify when a cached answer is valid

The expert first defines the identity and age of an answer, then follows source writes and cache fills in both orders. They can explain which guarantee is actually attainable across two stores.

| Unit | Understanding required | Cheapest sufficient teaching | Change or awkward case | Decision the reader can make |
| --- | --- | --- | --- | --- |
| CA-U04 | Build a cache key from every input that changes the answer: tenant, permission context where appropriate, locale, filters and representation version; preserve serialization compatibility. | Key-design worksheet and two incompatible application versions. | A key collision exposes another tenant's result; a rollout reads an old value shape. | Define a safe namespace and migration path. |
| CA-U05 | Separate source-data age, time since cache fill, expiry and allowed staleness; account for negative results and deletions. | Timeline with an item changing before a delayed fill. | A newly filled entry already contains old source data; a cached “missing” hides creation. | Choose a freshness contract and negative-cache policy. |
| CA-U06 | Follow cache-aside read/fill and update/invalidate interleavings, including stale repopulation after invalidation. | Step-controlled two-reader/one-writer trace. | A slow old read fills the cache after the writer deletes the key. | Recognise when deletion plus TTL is insufficient and choose version checks or a weaker promise. |
| CA-U07 | Compare updating the cache, invalidating it, write-through and write-behind by the accepted-write boundary and partial failure. | Failure table tied to the same source write. | Source succeeds but cache update fails; a write-behind buffer disappears. | Choose a write path and identify where acknowledgement must wait. |
| CA-U08 | Repair missed invalidations and restarted consumers; distinguish source-to-cache coherence from shared-cache-to-local-cache coherence. | Versioned change sequence with a missing event and reconnect. | Invalidation arrives out of order or the local client loses its tracking connection. | Design a repair path and say when all local entries must be discarded. |

### Keep the source alive when entries are missing

The expert treats a miss as work that must be admitted somewhere. They distinguish unavoidable cold work from repeated work and protect the source when neither the cache nor the refresh path is healthy.

| Unit | Understanding required | Cheapest sufficient teaching | Change or awkward case | Decision the reader can make |
| --- | --- | --- | --- | --- |
| CA-U09 | Distinguish cold, expired, evicted and negative misses; translate a miss rate into source concurrency and service capacity. | Load worksheet with source time and arrival rate. | A modest hit-rate drop exceeds source capacity. | Set a miss budget and choose meaningful source-side measurements. |
| CA-U10 | Coalesce fills, refresh ahead, jitter expiry and serve stale within a declared allowance; constrain refresher leases and loser behaviour. | Request trace with one slow fill, a dead refresher and bounded waiting. | The winning refresher crashes and its lease expires before its old work completes. | Choose a refresh strategy without promising correctness from a lease alone. |
| CA-U11 | Bound fallback concurrency, retries, queues and timeouts; decide whether stale, partial or rejected answers are acceptable. | Failure simulation with visible source queue. | Every application retries a cache outage against the source. | Degrade safely and limit amplification. |
| CA-U12 | Warm selected keys and stage traffic without making the cache another full database scan; plan simultaneous expiry and fleet restart. | Cold-start and rollout exercise. | A whole shard or application fleet returns empty at once. | Choose warming work, traffic ramp and a source-protection gate. |

### Spend memory on useful entries

The expert can explain why the retained working set saves work. They separate freshness from replacement and admission from eviction, and reason in bytes as well as key counts.

| Unit | Understanding required | Cheapest sufficient teaching | Change or awkward case | Decision the reader can make |
| --- | --- | --- | --- | --- |
| CA-U13 | Budget payloads, keys, metadata, allocator waste, clients, replication/persistence buffers and operating headroom. | Byte-accounting example with a size distribution. | Average value size stays small but a heavy tail consumes memory. | Size a node and define a usable rather than physical memory budget. |
| CA-U14 | Predict recency, frequency and approximate replacement under changing access patterns; distinguish the policy's goal from exact implementation. | Trace replay contrasting looping scan, hot set and a changing hot set. | A scan displaces frequently reused entries. | Choose a candidate eviction policy and a workload test. |
| CA-U15 | Decide whether a missed item should enter at all; weigh reuse, size and avoided source work. | Admission/replacement model with large one-use results. | A single expensive large entry displaces many cheap-but-frequent entries. | Filter or cap entries rather than merely buy more memory. |
| CA-U16 | Separate expiry of validity, expiry-driven reclamation and eviction under pressure; understand a refused write and missing-key semantics. | One state diagram plus pressure cases. | A valid key is evicted early, or a non-evicting store rejects writes. | Choose separate budgets for cached and authoritative data. |

### Model useful state in a data-structure store

The expert chooses operations before a structure and bounds the cost of those operations. They know when application-side joins and secondary views become more work than the store removes.

| Unit | Understanding required | Cheapest sufficient teaching | Change or awkward case | Decision the reader can make |
| --- | --- | --- | --- | --- |
| CA-U17 | Map strings, hashes, sets and sorted sets to counters, membership and rank; distinguish exact and approximate answers where relevant. | Worked viewers, limit and leaderboard representations. | A leaderboard ties; a count must be exact rather than approximate. | Choose a representation from the required operations. |
| CA-U18 | Bound key cardinality, value growth, traversal and result size; account for maintained indexes and denormalised copies. | Operation-cost worksheet and an evolving schema. | An unbounded member list or secondary view becomes the busiest object. | Split or bound state, or move the task to a query-oriented store. |
| CA-U19 | Give state an owner and lifecycle: expiry, deletion, access boundaries and deletion of derived copies. | Tenant-offboarding and expired-session cases. | Expiring the parent leaves an index or local copy behind. | Specify complete deletion and access responsibilities. |

### Make a correct change under concurrency and timeouts

The expert identifies the invariant and its engine boundary, picks a primitive that covers it, and then considers the caller that cannot tell whether its request ran.

| Unit | Understanding required | Cheapest sufficient teaching | Change or awkward case | Decision the reader can make |
| --- | --- | --- | --- | --- |
| CA-U20 | Distinguish atomic single operations, read-modify-write and multi-key invariants. | Two-client counter and reservation interleavings. | Two clients separately read, check and decrement the last unit. | Choose a native operation or move the decision inside an atomic boundary. |
| CA-U21 | Compare conditional changes, optimistic checks, transactions and server-side programs; separate isolation from rollback and durability. | Failed middle operation and conflicting writer trace. | A grouped command fails after an earlier command changed state. | Ask for the guarantee the selected engine actually gives. |
| CA-U22 | Trace a request executed before its reply is lost; choose idempotency records, conditional updates or reconciliation rather than blind retry. | A timed-out increment with and without an operation ID. | A retry doubles a counter; the deduplication record expires too early. | Define retry and deduplication semantics, including their retention boundary. |
| CA-U23 | Understand TTL-based ownership as a lease, not proof that old work stopped; constrain cache refresh locks and distinguish correctness-critical external coordination. | Expired owner continues after a pause. | A successor acquires while the original holder still writes elsewhere. | Use best-effort leases for refresh, or require a stronger owner/resource protocol outside this collection. |

### Explain what survives a failure

The expert traces an acknowledged change through volatile execution, durable storage and another node. They do not infer safety from the words “replicated” or “in memory”.

| Unit | Understanding required | Cheapest sufficient teaching | Change or awkward case | Decision the reader can make |
| --- | --- | --- | --- | --- |
| CA-U24 | Distinguish process survival, disk survival, snapshots/logs and replica copies by an explicit accepted-write timeline. | Failure matrix with labelled acknowledgement points. | A node acknowledges before a durable copy or replica has the change. | Set a tolerable loss boundary and test the claimed recovery objective. |
| CA-U25 | Follow replica lag, stale reads and promotion; distinguish availability from preservation of an accepted write. | Primary/replica trace with a lost reply and failover. | The promoted replica lacks a recent accepted update. | Choose read targets and decide whether this store can own the fact. |
| CA-U26 | Place keys across nodes, explain the atomicity boundary and identify hot keys; distinguish adding capacity from splitting one hot object. | Key placement and multi-key operation examples. | A placement change separates keys an operation needs together. | Choose grouping and topology without treating sharding as unlimited throughput. |

### Recover useful service and correct state

The expert begins with the required state, not whether a process is green. Recovery is different for reproducible cached results and unique accepted changes.

| Unit | Understanding required | Cheapest sufficient teaching | Change or awkward case | Decision the reader can make |
| --- | --- | --- | --- | --- |
| CA-U27 | Restore an authoritative dataset, validate it and reconcile accepted operations after the recovery point; understand that replication also copies bad changes. | Restore timeline with a valid later update and an accidental deletion. | A healthy replica contains the same deletion; a backup omits later valid changes. | Define recoverability, reconciliation evidence and a restore drill. |
| CA-U28 | Rebuild disposable state, validate representation versions and reintroduce traffic without overwhelming the source. | Recovery worksheet with cold/warm and old/new values. | Restored cached results are old although their restarted TTL looks generous. | Discard or restore a cache deliberately and control its return. |

### Diagnose and change the running system

The expert joins application measurements to engine evidence, because a single hit-ratio graph cannot distinguish a useful cache from an expensive bottleneck.

| Unit | Understanding required | Cheapest sufficient teaching | Change or awkward case | Decision the reader can make |
| --- | --- | --- | --- | --- |
| CA-U29 | Separate source work, serialization, network time, client queueing, server execution, memory pressure and lag; use distributions and workload shape. | Incident evidence with one cause changed at a time. | Hit fraction is stable while a hot key or large command raises tail latency. | Pick the next measurement before changing memory or topology. |
| CA-U30 | Change clients, key formats, access controls, topology and engine version with a recovery path; isolate workloads with different loss policies. | Deployment worksheet with two application versions and least-privilege clients. | A rollback cannot read the new representation or a cache client can delete authoritative keys. | Choose compatibility windows, isolation and a reversible rollout. |
| CA-U31 | Compare useful saved source work with total memory, replicas, persistence, traffic and operational cost. | Capacity/cost case with explicit availability and loss requirements. | An extra replica fixes a failure requirement but not a saturated hot primary. | Resize, partition, simplify or remove the cache for a stated reason. |

### Select a real implementation and operating model

CA-U32 requires comparing the same workload across a process-local cache, a disposable shared cache and a data-structure server, including credible Valkey/Redis alternatives. A conditional decision worksheet is sufficient. Change the workload from reusable catalogue reads to unique accepted mutations: the reason for the product choice must change. Licensing, compatible commands, deployment control and a managed service's actual guarantees need current primary verification. This unit does not require an exhaustive vendor catalogue.

### Explain and operate a coherent Redis Open Source implementation

These units are implementation-specific. They require their own evidence and practical executions; general lessons above cannot stand in for them. Redis Open Source is the initial representative candidate, not a claim that every managed Redis-branded or protocol-compatible service behaves identically.

| Unit | Understanding required | Teaching form | Necessary changed case | Subsequent practical decision |
| --- | --- | --- | --- | --- |
| CA-U33 | Trace request parsing, command execution and reply delivery; distinguish network concurrency from a command occupying execution. | Instrumented command trace. | One expensive operation delays unrelated requests. | Bound command and result sizes and interpret server latency. |
| CA-U34 | Follow concrete string/hash/set/sorted-set representation and encoding changes, with their byte and operation costs. | Inspect actual object/memory evidence before and after a threshold. | A compact representation grows or changes encoding. | Choose keys and structures with measured headroom. |
| CA-U35 | Explain Redis expiry, sampled replacement, memory accounting and policy scope. | Memory-pressure and expiry worksheet. | Buffers or background work raise process memory beyond the dataset budget. | Set limits and isolate authoritative keys from evictable data. |
| CA-U36 | Integrate a client with bounded pooling/multiplexing, pipelining, reply size and timeout handling. | Actual client/server request record. | A connection breaks after some pipelined mutations ran. | Set connection and retry behaviour without assuming batch atomicity. |
| CA-U37 | Trace Redis client tracking, invalidations and disconnect cleanup for local caches. | Two clients plus reconnect. | An invalidation is missed when the tracking connection dies. | Decide whether a local cache and its client implementation satisfy the contract. |
| CA-U38 | Implement a bounded cache fill and representation migration against a real source fixture. | Source plus Redis integration worksheet. | Source changes during fill and an older application remains alive. | Build the selected coherence design and validate its failure path. |
| CA-U39 | Use Redis native structures and commands for the selected viewers, limits and leaderboard. | Executable command sets with inspected resulting state. | The working set or rank query grows. | Choose command shapes and limits rather than a feature name. |
| CA-U40 | Follow MULTI/EXEC, WATCH and bounded Lua/functions through conflict and command error. | Concurrent clients and failed command execution. | A middle command errors, or WATCH detects a concurrent change. | Choose a safe update primitive and retry policy. |
| CA-U41 | Implement a bounded operation-ID scheme and inspect expiration and replay of its state. | Timed-out update then retry. | The ID record expires before a delayed retry arrives. | State the scope of duplicate suppression and its memory cost. |
| CA-U42 | Follow RDB snapshot and AOF logging/rewrite, acknowledgement/fsync options and fork/copy-on-write memory costs. | Actual artifact and write-timeline inspection. | A write burst during background persistence changes latency and memory. | Choose a persistence mode for a stated loss and resource budget. |
| CA-U43 | Restore selected RDB/AOF artifacts into an isolated Redis instance and validate application invariants. | External restore worksheet with a protected original dataset. | A chosen recovery point loses valid later operations. | Prove a recovery procedure and identify reconciliation requirements. |
| CA-U44 | Recognise startup/loading, persistence errors and damaged or incomplete artifacts, with version-safe repair boundaries. | Controlled bad-input and failed-persistence exercise. | The service process starts but cannot safely load or continue accepting writes. | Stop, recover or change configuration with evidence. |
| CA-U45 | Explain replication histories/offsets, backlog and full versus partial synchronisation. | Two-node disconnect and catch-up trace. | A disconnect outlasts backlog and forces full synchronisation. | Budget catch-up resources and diagnose lag. |
| CA-U46 | Trace Sentinel failure detection, promotion, client discovery and divergent old-primary behaviour. | Multi-process failover worksheet. | A primary fails after acknowledging a write absent from the candidate. | Choose Sentinel deployment/client behaviour and a realistic data-loss contract. |
| CA-U47 | Distinguish replica acknowledgements and persistence acknowledgements from stronger cross-failure guarantees. | WAIT/WAITAOF cases against the selected release. | An acknowledgement target is reached but another failure still invalidates an assumed guarantee. | Specify what the acknowledgement does and does not establish. |
| CA-U48 | Explain Redis Cluster slots, hash tags and MOVED/ASK redirects from actual requests. | Multi-node routing worksheet. | Resharding changes the owner while requests are in flight. | Select a cluster-aware client and safe key grouping. |
| CA-U49 | Execute bounded multi-key/script work under same-slot constraints and migrate a hot key model. | Successful/failed operation pairs. | Adding shards leaves the hot key saturated. | Redesign the access pattern or keep the simpler topology. |
| CA-U50 | Follow cluster failover, resharding and node replacement with explicit availability and data-loss limits. | External maintenance/failure exercise. | A migration is interrupted or a primary disappears during load. | Plan a rollout with verification and recovery gates. |
| CA-U51 | Use INFO, latency facilities, slow commands and memory evidence alongside application metrics. | Incident worksheet on actual Redis processes. | Low server execution time accompanies high client latency. | Distinguish engine work from connection/network/queueing problems. |
| CA-U52 | Configure and verify Redis ACLs, transport protection and administrative/data-plane separation. | Least-privilege success/failure worksheet. | A data client attempts dangerous administration or another tenant's namespace. | Define deployable access and network boundaries. |
| CA-U53 | Rehearse upgrades, config changes, backup checks and capacity actions on the selected version and topology. | Operational change worksheet with rollback or explicit restore. | A client or persisted representation is incompatible with the rollback target. | Set an evidence-based change procedure and know when rollback is unavailable. |

## Boundaries are units too

| Unit | Status and reason | Local context a direct entrant still needs |
| --- | --- | --- |
| CA-U54 | General consensus, fencing protocols, distributed lock algorithms and cross-resource transactions belong to the parked shared systems programme. | A lease can expire while old work continues. Cache-refresh leases are local scope; critical external resources need their own enforceable protocol. |
| CA-U55 | HTTP/browser/CDN caching belongs to delivery and web-platform teaching. | An application result cache may sit behind another cache. Name both validity contracts; HTTP validators and proxy policy are not taught here. |
| CA-U56 | Database buffer pools and CPU/OS caches are links to the appropriate storage/runtime teaching. | The source may already cache reads; an application cache saves different work and adds another correctness boundary. |
| CA-U57 | Streams, reliable queues, consumer groups and pub/sub application delivery belong to messaging. Redis search, vector indexing and time-series capabilities belong to those respective investigations. | An invalidation transport is not proof of reliable change delivery. Mention the local recovery requirement without teaching a broker. Core sets/sorted sets remain here. |
| CA-U58 | Relational ticket constraints, payments and external inventory correctness remain with their authoritative database/application owners. Durable memory-first engines outside the selected Redis branch remain an implementation-choice boundary requiring fresh assessment. | Fast access does not establish the guarantee a sale needs. Redis is a representative branch, not the definition of all in-memory databases. |

## Evidence that changed the decomposition

Primary sources were checked on 18 October 2026. They support planning choices; they do not certify future article claims or executed experiments.

- [Redis client-side caching](https://redis.io/docs/latest/develop/reference/client-side-caching/) makes local-cache invalidation an implementation investigation distinct from coherence between Redis and an external source. This prevents a false promise that server tracking solves both.
- [Memcached meta protocol](https://docs.memcached.org/protocols/meta/) exposes refresh ownership and stale handling in a credible cache alternative. Herd control should be taught as a general task, then implemented under a product's actual protocol.
- [Caffeine efficiency](https://github.com/ben-manes/caffeine/wiki/Efficiency) and the [TinyLFU paper](https://arxiv.org/abs/1512.00727) distinguish admission from replacement. Memory planning must teach both, without treating Redis replacement policy as the whole field.
- [Redis persistence](https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/), [replication](https://redis.io/docs/latest/operate/oss_and_stack/management/replication/) and [cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/) require separate execution, disk and topology boundaries. Persistence, replica presence and automatic promotion cannot be one “durability” checkbox.
- [Redis transactions](https://redis.io/docs/latest/develop/interact/transactions/) and [programmability](https://redis.io/docs/latest/develop/programmability/eval-intro/) make command error, bounded execution and optimistic conflict necessary parts of the atomic-update ability.
- [Valkey introduction](https://valkey.io/topics/introduction/) and [Memcached FAQ](https://docs.memcached.org/userguide/faq/) establish credible alternative roles. Product choice cannot be inferred solely from a shared key/value API.

There are 58 units: 32 general/selection units, 21 implementation units and five explicit boundaries. Their teaching sizes vary. None implies a separate article. The proposal must earn every split from these tasks.
