# Key-value and wide-column: practitioner abilities

Independent derivation, 18 October 2026. Planning only. Read the commission, planning and style skills, and the depth-and-experiments reference. No existing outline, inventory, coverage map or earlier plan was consulted. This file records the abilities before assigning pages.

## Audience and the work

The reader builds a service and is responsible for its data after launch. They can write ordinary application code and recognise a request, a retry, a process and a disk. They need not know a particular database or distributed-systems vocabulary. They must be able to choose a store, explain what an acknowledged operation promises, design its keys and mutations, and recover when the simple case breaks. Knowing every vendor's commands is a different goal.

The subject has several different jobs. A cache can discard data if it can refill it safely. An authoritative item store must retain accepted changes. A wide-column store can make a bounded slice of one ordered partition cheap while making an unplanned query expensive. None of those jobs establishes transaction, durability or replication guarantees by itself.

The abilities below use three independent running workloads where they help: a product catalogue cache (`product:431`), an order service (`tenant=t7`, `order=o904`, `request=r18`), and device readings (`tenant=t7`, `device=d42`, event timestamp plus a tie-breaker). Carrying one artificial workload through all three would hide their different reasons for existing.

Each row is a teachable unit, not a proposed article. “Trace” means an inspectable model of states and messages; it does not claim real product execution. A practical exercise needs a pinned implementation and recorded settings. No experiments have been run for this derivation.

## Choose the data contract and keys

Expert task: turn service requirements into a defensible storage choice. This requires identifying authoritative state, allowed operations, skew and invariants, then following the consequences through failure and change.

| ID | Understanding to teach | Changed or awkward case that makes it necessary | Shortest useful teaching form |
| --- | --- | --- | --- |
| KV01 | Distinguish a disposable copy, authoritative state and derived read model; record acceptable staleness and loss separately. | A catalogue cache can refill; a consumed discount code cannot simply disappear after failover. | Worked requirement cases. |
| KV02 | A key identifies an aggregate or value; a structured value does not establish joins, atomic multi-key writes or query support. | A document-shaped value becomes too large or must be updated independently. | Small data-and-operation model. |
| KV03 | Derive an access-pattern and workload ledger: point reads, ordered slices, secondary lookups, fan-out, payload size, skew, growth and correctness. | The busiest tenant grows while total request volume stays fixed. | Completed design worksheet and changed requirement. |
| KV04 | Encode stable, unambiguous keys, tenant boundaries and sort order; lexical order, delimiters, tie-breakers and version prefixes have consequences. | Numeric-looking text sorts unexpectedly; two events share a timestamp; a delimiter occurs inside a user identifier. | Executable encoding cases. |
| KV05 | Separate hot keys, hot ranges and large aggregates; distinguish spreading work from increasing the cost of reading it back. | Adding random suffixes fixes writes but makes the latest-ten query a merge across buckets. | Placement and fan-out model. |
| KV06 | Bound a retrieval and resume it correctly; ordering, cursor validity and snapshot visibility are separate promises. | An empty filtered page still has a continuation; concurrent inserts change later pages. | Worked cursor trace. |
| KV07 | Follow a mutation through concurrent readers and an unknown timeout; compare unconditional replacement, conditional mutation and a durable request identity. | The server applied an increment but its response vanished. | Two-client and retry traces. |
| KV08 | Locate the invariant's atomic boundary; decide when an aggregate, compare-and-set or transaction is sufficient and when the design needs another store. | Reserving stock and creating an order touches separately partitioned state. | Invariant proofs and counterexamples. |
| KV09 | Account for duplicated read models and indexes: who updates each copy, when it becomes visible, and how completeness is checked. | The new lookup exists for new writes but misses old records. | State transition and reconciliation cases. |
| KV10 | Separate expiry, logical deletion, space reclamation, historical retention and access revocation. | An expired credential remains physically stored or readable through a derived copy. | Lifecycle trace and requirement decisions. |
| KV11 | Set service objectives and assess tail latency, skew, client concurrency, payload size and the whole cost of redundant writes and replicas. | Mean latency looks good while a hot tenant times out; average utilisation hides a full partition. | Workload accounting and diagnostic cases. |
| KV12 | Change key or value schemas while writers continue: version readers, backfill, capture races, reconcile, cut over and retire old state. | A backfill overwrites a newer value or switches reads before every historical item is represented. | Migration state machine and acceptance checks. |

## Use an in-memory key-value server safely

Expert task: use an in-memory server for data structures or caching without mistaking fast execution for correctness or durability. This needs command costs and atomicity first, then memory, persistence, replication and recovery.

Representative implementation to investigate: Redis Open Source. Valkey is a credible alternative whose commands, versions and operational differences need separate verification; protocol similarity is insufficient evidence of equivalence.

| ID | Understanding to teach | Changed or awkward case | Shortest useful teaching form |
| --- | --- | --- | --- |
| KV13 | Choose strings, hashes, sets, sorted sets or lists by operations and growth; bound big keys, collection scans and representation overhead. | A useful leaderboard becomes a huge key with costly range/deletion work. | Native command worksheet with inspected sizes. |
| KV14 | Explain how command execution, expensive operations and long scripts affect unrelated requests; separate server work from network round trips. | Pipelining reduces round trips but a long operation still stalls other clients. | Two-client latency trace plus native exercise. |
| KV15 | Distinguish command atomicity, `MULTI`/`EXEC`, `WATCH`, scripts/functions, queue-time errors and execution-time errors; do not assume rollback. | One queued operation fails while other commands execute; a watched key expires. | Native concurrency and error cases. |
| KV16 | Predict key expiry and TTL changes under overwrites and mutations; distinguish expiration from eviction and verify release-specific command behaviour. | Replacing a value accidentally removes its intended expiry. | Command and clock trace. |
| KV17 | Choose eviction policy and memory headroom from the data's role; include allocator, replication/AOF buffers and persistence work. | `maxmemory` is below host RAM yet a background operation exhausts the host. | Memory budget and pressure exercise. |
| KV18 | Design cache-aside reads, invalidation, negative caching, request coalescing and bounded stale serving around source-of-truth races. | A slow old read refills the cache after a newer write invalidates it; mass expiry overloads the source. | Interleaving model, then client exercise. |
| KV19 | Build bounded counters or rate limits with atomic updates, expiration and an explicit retry/failure policy. | An increment succeeds but setting its expiry does not; an ambiguous retry counts twice. | Native script/command exercise. |
| KV20 | Explain lease ownership, safe release and stale holders; recognise when a downstream resource requires fencing the store cannot establish on its own. | A paused owner resumes after expiry and changes the external resource after a new owner. | Failure timeline; limited reference beyond this boundary. |
| KV21 | Follow RDB snapshots and AOF append/fsync/rewrite through restart; derive loss windows and resource needs from settings. | A crash occurs after the reply but before durable recording; a rewrite competes with live writes. | Persistence trace and disposable restart lab. |
| KV22 | Follow replica offsets, backlog, partial/full resynchronisation and acknowledgement waits; separate replication receipt from durable survival. | Promotion loses an acknowledged write; a slow replica needs a full transfer. | Replica trace and local multi-process exercise. |
| KV23 | Configure and reason about Sentinel discovery and promotion, including client reconnection and competing views during a failure. | A client continues writing to the old primary after another has been promoted. | Failover model and external local lab. |
| KV24 | Explain Cluster hash slots, hash tags and multi-key restrictions; choose colocation without creating a hot slot. | A cross-key script fails after moving from one server to Cluster. | Slot placement worksheet and native commands. |
| KV25 | Handle Cluster redirects and topology changes; distinguish resharding, node loss, replica promotion and quorum availability. | Keys move while requests run; a minority accepts a write that later disappears. | Client/topology trace and disposable Cluster lab. |
| KV26 | Diagnose latency, memory, eviction, slow clients and persistence pressure using server and client observations. | Network queues mimic slow command execution; a blocked client grows output buffers. | Several diagnostic evidence packets. |
| KV27 | Restore a verified backup into an isolated server, validate expiry and application state, and reconcile accepted work beyond the recovery point. | A snapshot predates a valid order; blindly replaying retries double-applies counters. | Recovery procedure and acceptance exercise. |
| KV28 | Operate the chosen server with ACLs, network isolation, TLS where applicable, protected credentials and a reversible upgrade plan. | A cache flush permission reaches an application credential; an upgrade changes encoding or client behaviour. | Bounded setup/review checklist with release docs. |

## Use a managed durable item store

Expert task: design and operate an authoritative item service. The managed service removes server administration but leaves key design, retries, consistency, throughput, recovery and permissions with the application team.

Representative implementation to investigate: Amazon DynamoDB. Teach its observable contract and exposed mechanisms. Do not present a conjectured internal log, quorum or compaction implementation as an API guarantee.

| ID | Understanding to teach | Changed or awkward case | Shortest useful teaching form |
| --- | --- | --- | --- |
| KV29 | Use partition/sort keys and item operations; expressions, encoding and item size delimit what can be stored and fetched. | A growing item exceeds the limit; a range query does not match a complete partition key. | Native API worksheet. |
| KV30 | Build a single-table or multi-table model from entity access patterns, adjacency and operational boundaries. | One new query needs a lookup across tenants; colocating everything causes lifecycle and capacity coupling. | Two competing designs and a changed query. |
| KV31 | Execute `Query`, filters, cursors, `Scan` and batch operations correctly, including unprocessed work and partial results. | Filtering returns no items yet a continuation remains; a successful batch response still has work to retry. | API response trace plus executable SDK exercise. |
| KV32 | Design GSI/LSI keys, sparse membership and projections; understand asynchronous visibility, capacity and index-specific constraints. | A uniqueness check uses a stale GSI; adding an index throttles writes or omits historical items. | Read/write amplification model and cloud exercise. |
| KV33 | Use conditional mutations and version checks to protect one item; implement durable retry identity for operations that must not apply twice. | Two buyers contend for the last unit; an `ADD` response times out. | Two-client API exercise. |
| KV34 | Use transactions at their actual scope and isolation; understand cancellation, contention, retry tokens and their finite lifetime. | An ordinary multi-item read observes a different view from a transactional read; a retry arrives after its token window. | Invariant and API failure cases. |
| KV35 | Choose read consistency for tables and indexes; distinguish a strongly consistent operation from a multi-request snapshot. | A strong base-table read sees a change that a GSI query does not; pages straddle writes. | Visibility trace. |
| KV36 | Calculate capacity and cost from item sizes, rounding, consistency, indexes, transactions and billing mode. | Small logical changes still write large items and multiple index entries; on-demand mode still has limits. | Parameter worksheet with dated service inputs. |
| KV37 | Diagnose key-range versus table/index throttling, adaptive capacity and hot-key limits; choose write sharding with its read cost. | More table capacity does not fix the single hot item. | Throttling evidence and sharded-query model. |
| KV38 | Consume Streams with per-item ordering, finite retention, duplicates/retries and checkpoints; rebuild a projection after an outage. | A consumer falls behind retention or applies a record twice; transaction changes arrive as separate stream records. | Consumer state trace and cloud exercise. |
| KV39 | Enforce expiry at read/write boundaries while background TTL deletion catches up; account for downstream copies and global-table mode. | An expired session still exists; TTL is unavailable in the selected replication mode. | Request and deletion timeline. |
| KV40 | Restore backups/PITR to a new table, restore surrounding configuration, reconcile later valid writes, and switch readers/writers safely. | Restoring before an accidental delete also removes valid later orders. | Recovery/cutover exercise with explicit reconciliation. |
| KV41 | Use MREC global tables with conflict resolution, Regional transaction scope, request routing and failback. | Concurrent Regional updates collide; another Region temporarily sees part of a transaction. | Regional execution and conflict cases. |
| KV42 | Use MRSC global tables with synchronous cross-Region coordination and exposed constraints; distinguish replica/witness and availability outcomes. | An application needs both global strong reads and transactions/TTL; one Region cannot reach another quorum member. | Contract comparison and failure model. |
| KV43 | Apply IAM and tenant isolation to every access path, including indexes, streams, backups and export; understand encryption's separate role. | A safe primary-key policy is bypassed by a different allowed operation or maintenance role. | Authorisation cases with native policy validation. |
| KV44 | Introduce a new lookup or key shape with index/backfill progress, dual readers/writers and an auditable cutover. | Writes continue during backfill; a count match hides missing entities and duplicates. | SDK migration exercise and reconciliation artefacts. |
| KV45 | Bound SDK concurrency and deadlines, handle retryable/unprocessed work, and distinguish throttling from ambiguous mutation outcomes. | Automatic retries extend a request past its caller's deadline or repeat a non-idempotent update. | Client trace and fault-controlled SDK test. |
| KV46 | Launch and run a service with meaningful alarms, tested capacity assumptions, cost controls and restore acceptance criteria. | A traffic shape changes without increasing the daily total; a nominally successful restore cannot serve production traffic. | Operational review and evidence-based incident cases. |

## Design bounded wide-column queries

Expert task: turn ordered, often append-heavy workloads into partitions that remain bounded and readable as data ages. This requires understanding both the physical access route and the application work required by each extra query.

| ID | Understanding to teach | Changed or awkward case | Shortest useful teaching form |
| --- | --- | --- | --- |
| KV47 | Distinguish a partition plus ordered rows/cells from an analytical column store; read the actual key and atomicity contract. | “Column” is mistaken for efficient arbitrary aggregation; CQL syntax is mistaken for relational execution. | Concrete layouts and queries. |
| KV48 | Translate queries into partition equality and clustering/row-key ranges, including ties, direction, bounds and continuation. | Fetch latest readings with equal timestamps and late arrival; an extra predicate cannot use the key order. | Query-path model and bounded query cases. |
| KV49 | Size and time-bucket partitions from growth, skew, retention and fan-out; handle late data and bucket boundaries. | A formerly small device becomes a high-rate producer; late events land in an old bucket. | Parameterised partition and merge model. |
| KV50 | Maintain query-specific duplicate tables with an explicit source, retry identity, repair and rebuild process. | Updating one table succeeds while another fails; a new query needs historical data. | Mutation and reconciliation traces. |
| KV51 | Understand sparse columns, column families and cell versions only under a named product's semantics. | Bigtable's versioned cells and family retention are wrongly projected onto Cassandra CQL rows. | Small cross-product representation comparison. |
| KV52 | Choose between bounded key access, supported indexes and maintained read models; cost depends on selectivity and distribution. | A convenient index works for a selective predicate but fans out widely for a common value. | Query design alternatives with measured evidence later. |
| KV53 | Defend Cassandra versus Bigtable versus a managed item store or relational/analytical alternative using workload and operating responsibility. | The team needs arbitrary joins, strict cross-partition invariants or no cluster administration. | Conditional comparison cases. |
| KV54 | Budget ingestion, retention, repair/compaction and reads together; overload handling and admission control belong to the service design. | Sustained writes use the disk or background-work budget needed to keep reads and repair healthy. | Workload budget and overload traces. |

## Operate a Cassandra service

Expert task: explain a Cassandra read and write, choose its correctness settings, and keep its replicas and storage healthy through failures and growth. Cassandra is the representative wide-column product; this is a bounded operational branch, not a promise to teach every compatible service.

| ID | Understanding to teach | Changed or awkward case | Shortest useful teaching form |
| --- | --- | --- | --- |
| KV55 | Define CQL partition/clustering keys and static values; bound collections; understand null/unset, counters and schema restrictions where they change writes. | An update emits tombstones; an unbounded collection becomes an expensive aggregate. | Native CQL worksheet. |
| KV56 | Map tokens to replicas using topology and replication configuration; distinguish coordinator from data owner and replication factor from node count. | A rack fails or replication factor changes; adding a node does not simply divide all data equally. | Placement and failure model. |
| KV57 | Follow a replica mutation through commit log, memtable, flush, SSTables and restart; relate acknowledgements to commit-log settings. | The process or machine fails at a different point in the write path. | Storage mechanism trace and restart lab. |
| KV58 | Follow a read across memory and immutable files, filters/indexes and replica reconciliation; expose amplification and tombstone work. | A tiny result requires merging many versions and deleted rows. | Read-path figure and inspected native evidence. |
| KV59 | Explain timestamp-based reconciliation, ties, clocks, deletes and collection updates; latest timestamp is not business event order. | A skewed clock makes a later intended update lose. | Timestamp conflict cases. |
| KV60 | Select consistency level with replication factor and datacentre scope; reason about overlap without claiming serialisability or transaction isolation. | Concurrent writes occur; `LOCAL_QUORUM` in different datacentres does not form one shared local quorum. | Replica histories and failure traces. |
| KV61 | Use LWT/Paxos and serial consistency for the invariant it can protect; resolve contention and unknown outcomes without mixing unsafe writes. | A conditional insert times out after agreement; an unconditional mutation bypasses the protocol. | Two-client native exercise and protocol model. |
| KV62 | Distinguish single-partition mutation semantics, logged/unlogged batches, counter batches and conditional batches. | A batch spans partitions and is mistaken for a relational transaction or a throughput optimisation. | Scope and partial-visibility cases. |
| KV63 | Separate hinted handoff, read repair and anti-entropy repair; identify what each can miss. | A node is unavailable beyond its hint window and the cold range is never read. | Replica catch-up timeline. |
| KV64 | Choose and observe compaction by workload: version-appropriate UCS and alternatives, read/write/space amplification, TTL alignment and backlog. | A strategy change or low free disk makes compaction compete with serving traffic. | File/merge model and native statistics. |
| KV65 | Follow deletes and expiry into tombstones, reads and safe purge conditions; explain grace, overlapping SSTables and resurrection risk. | A replica returns with old data after a tombstone was purged; lowering grace appears to fix latency. | Deletion/returning-replica trace. |
| KV66 | Plan repair coverage over ranges and datacentres, distinguish incremental/full repair, budget it and verify completion before safety margins expire. | One repair command succeeds but other ranges remain unrepaired; the schedule overruns grace. | Repair plan, native procedure and completion evidence. |
| KV67 | Use topology-aware drivers, prepared statements, paging and bounded concurrency; reason about retry, speculation and idempotence. | Speculative retries amplify overload or duplicate a non-idempotent operation. | Client routing model and fault-controlled exercise. |
| KV68 | Diagnose partition skew, disk/heap pressure, queues, dropped work, tombstone scans and compaction/repair debt from correlated evidence. | Adding nodes fails to improve a single oversized partition; latency is caused by background debt. | Incident evidence packets. |
| KV69 | Bootstrap, replace, remove and decommission nodes safely; understand streaming, changed replica ownership, repair and cleanup. | A dead node is replaced while capacity is tight; replication factor is changed without distributing historical data. | Topology state machine and disposable cluster lab. |
| KV70 | Design multi-datacentre placement and local client routing; define promotion, degraded operations and return-to-service criteria. | A datacentre is isolated and later returns with stale replicas. | Regional failure and cutback model. |
| KV71 | Construct backups from snapshots, incremental files and an explicitly supported commit-log/archive/replay process; define a recoverable timeline. | A “backup” depends on files that are not retained or captures inconsistent application state across tables. | Backup inventory and isolated restore procedure. |
| KV72 | Restore safely to the intended topology and schema, reconcile versions/deletes and validate application invariants beyond process startup. | Restored old data overwrites a newer value by timestamp; a valid later event must be recovered. | Restore/reconciliation exercise. |
| KV73 | Investigate version-specific SAI and other index choices, supported predicates and distribution-dependent work. | A selective lookup becomes a broad search as one value grows common. | Native query evidence and competing table design. |
| KV74 | Evolve schema and perform rolling upgrades with pinned compatibility, mixed-version constraints and rollback limits. | A value shape or driver protocol changes while old clients still write. | Change procedure with documented checkpoints. |
| KV75 | Configure authentication, authorisation, encryption and operational access across every node and maintenance tool. | A new node or repair/backup path bypasses the intended boundary. | Setup and permission exercise. |
| KV76 | Assemble a minimal real cluster and validate its application contract under restart, failure, load and recovery, with cleanup. | A one-node demonstration appears to prove quorum or repair behaviour it cannot exercise. | Multi-process/container lab outside the static site. |

## Recognise where the representative branches end

Expert task: detect when a familiar label hides a different mechanism, or when the application has crossed into another subject. These units prevent the collection claiming expertise it has not taught.

| ID | Understanding to teach | Changed or awkward case | Shortest useful teaching form |
| --- | --- | --- | --- |
| KV77 | Bigtable's sorted row keys, cells/versions, row-level operations and filters form a distinct access contract. | A Cassandra partition/clustering design is copied literally into Bigtable, or row atomicity is assumed to span many rows. | Named comparison and primary references; full product execution needs its own branch. |
| KV78 | Bigtable garbage collection is asynchronous; read filters and family policies have their own retention semantics. | Expired versions remain in reads until the request filters them or collection removes them. | One concrete comparison case and product documentation. |
| KV79 | Bigtable placement, application profiles, replication/consistency, autoscaling and restore have a managed-service operating model. | A Cassandra quorum setting is assumed to govern Bigtable reads, or adding a cluster is mistaken for a backup. | Selection-level comparison; operational expertise deferred to a separately derived branch. |
| KV80 | Recognise embedded key-value engines, transactional key-value systems, coordination stores, queues and analytical/time-series products as credible but different scopes. | Requirements demand embedded transactions, fencing, durable queue consumption, cross-key serialisability or arbitrary historical analysis. | Conditional exits and named references; no product tutorial here. |

## Evidence used to challenge the derivation

These are planning sources, checked on 18 October 2026. They support scope decisions and identify consequential mechanisms. They are not a finished article evidence ledger. An article must recheck current versions, limits, settings and commands and cite claims at the point they matter. No benchmark or failure experiment is claimed.

- [DynamoDB read consistency](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html) distinguishes table/index access and global modes. This prevents one generic consistency lesson from implying identical guarantees everywhere.
- [Global-table behaviour](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/V2globaltables_HowItWorks.html) and [global-table design](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-global-table-design.html) make MREC and MRSC separate design investigations. MRSC transaction and TTL restrictions are particularly consequential; Regional availability details need fresh verification when commissioned.
- [DynamoDB transactions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transactions.html), [pagination](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.Pagination.html) and [partition keys](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-design.html) challenge assumptions about multi-item safety, empty pages and unlimited managed scaling.
- [Redis persistence](https://redis.io/docs/latest/management/persistence/), [replication](https://redis.io/docs/latest/manual/replication/) and [Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/) require separate survival, replication and topology reasoning.
- [Redis transactions](https://redis.io/docs/latest/develop/using-commands/transactions/), [eviction](https://redis.io/docs/latest/develop/reference/eviction/) and [distributed locks](https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/) challenge rollback, memory-budget and lease assumptions. A Redis-specific lock recipe is not proof of safety for arbitrary external resources.
- [Cassandra architecture](https://cassandra.apache.org/doc/latest/cassandra/architecture/dynamo.html), [CQL](https://cassandra.apache.org/doc/latest/cassandra/developing/cql/cql_singlefile.html), [compaction](https://cassandra.apache.org/doc/stable/cassandra/managing/operating/compaction/overview.html) and [repair](https://cassandra.apache.org/doc/latest/cassandra/managing/operating/repair.html) require local storage, conflict resolution, purge and anti-entropy to receive distinct attention. Version aliases in these URLs are not implementation pins.
- [Bigtable schema design](https://docs.cloud.google.com/bigtable/docs/schema-design), [overview](https://docs.cloud.google.com/bigtable/docs/overview) and [garbage collection](https://docs.cloud.google.com/bigtable/docs/garbage-collection) show why wide-column is not one universal cell/version, replication or expiry contract.

## Unresolved choices before commissioning

Redis Open Source versus Valkey needs a product choice and version pin; use one coherent lab rather than asserting interchangeability. Cassandra's stable release and compaction choices also need a pin. DynamoDB service modes and constraints must be rechecked close to writing. Bigtable deserves a distinct implementation branch if it is commissioned; a comparison cannot qualify a reader to operate it. Shared distributed-systems teaching remains parked. Database-local explanations must still give a direct entrant enough context to reason about the database in front of them.
