---
version: 1
cut: 2026-09-29
---

# CockroachDB

> CockroachDB is the database to reach for when you need serialisable SQL transactions that survive a node, a zone, or a whole region going away, and you're willing to pay for that with a consensus round trip on every write and a retry loop in every client. It gives you Postgres syntax over a key-value store that shards and rebalances itself. What it can't give you is a write that finishes faster than the network between your replicas.

This piece explains how CockroachDB works underneath so that you can reason about it under load, under failure, and in an interview. It covers ranges and Raft, the storage engine, the clocks and transaction protocol behind serialisable isolation, how keys and indexes decide whether you get hotspots, what multi-region costs, how to run and pay for it, and where it's the wrong choice. YugabyteDB, TiDB, and Aurora DSQL each get a paragraph where they differ. Everything is as of September 2026 and version 26.2.

## What it is

CockroachDB is a distributed SQL database from Cockroach Labs, founded in New York in 2015 by three engineers who had worked on Google's storage systems and wanted a Spanner-like database for ordinary machines without atomic clocks. It's written in Go, ships as a single `cockroach` binary, and speaks the PostgreSQL wire protocol, so most Postgres drivers and ORMs connect unchanged. The FAQ states the target: applications that need "reliable, available, and correct data, and millisecond response times, regardless of scale". It also says CockroachDB "is not yet suitable for heavy analytics / OLAP".

The licence has changed twice. The project began under Apache 2.0, moved to the Business Source License in 2019, and moved again in November 2024. Every release from v24.3.0 (18 November 2024) onward is under the **CockroachDB Software License**, and the free "Core" build was retired with 24.3. There are now four licence types: paid Enterprise; Enterprise Free, with the same features, for organisations with under $10 million in annual revenue including parent and affiliates (government entities excluded); a 30-day Trial; and Evaluation from sales. Free and Trial clusters must send telemetry, and one that stops for 7 days is throttled to 5 concurrent open transactions. A cluster with no key at all is throttled 7 days after initialisation. Single-node clusters started with `cockroach start-single-node` or `cockroach demo` need no key and are never throttled, so local development stays free.

The current major version is v26.2, released 27 April 2026. Cockroach Labs ships four majors a year, alternating Regular releases (longer support) with Innovation releases that can be skipped. Recent GA dates: 25.2 on 12 May 2025, 25.3 on 4 August, 25.4 on 3 November, 26.1 on 18 February 2026, 26.2 on 27 April, and 26.3 is in beta as I write.

You can run it self-hosted (each node starts with `cockroach start --join`, then `cockroach init` once; there's a Kubernetes operator) or on CockroachDB Cloud, which has three plans: Basic (multi-tenant, billed by request units and storage), Standard (provisioned vCPUs from 2 to 200), and Advanced (dedicated nodes across three availability zones, multi-region, the compliance features). Every Cloud cluster carries an Enterprise licence.

## Architecture

The official guide describes five layers, each treating the one below as a black box. The **SQL layer** parses a statement, plans it with a cost-based optimiser, and turns it into key-value operations. The **transactional layer** makes a group of those operations atomic. The **distribution layer** presents the cluster as one sorted key-value map and routes each operation to the right machine. The **replication layer** copies each piece of that map to several machines with Raft. The **storage layer** writes bytes to disk through Pebble.

### Process and node model

Every node runs the same process with the same role. Whichever node a client connects to becomes the **gateway** for that connection: it parses, plans, coordinates the transaction, and returns results. Nodes talk over gRPC. Each node has one or more **stores**, each a directory on disk with its own Pebble instance, and all stores on a node share one block cache. Two replicas of the same range never sit on the same node.

Two flags govern memory: `--cache` for the Pebble block cache and `--max-sql-memory` for sorts, joins, and other in-flight query state. Production guidance is 25% of RAM for each.

### Ranges, replicas, leaseholders

Every table and every index is encoded into one sorted key space as `/<table id>/<index id>/<indexed columns> -> <other columns>`. That key space is cut into **ranges**, contiguous slices of keys. A range's default maximum is 512 MiB (`range_max_bytes` = 536,870,912), and below 128 MiB it tries to merge with its right-hand neighbour. A new table starts as one range and splits as it grows, either at the size limit or under load: a range serving more than 2,500 queries a second, or using more than 500 ms of CPU per second, becomes a candidate for a **load-based split** at the key where the load concentrates.

Each range is replicated to 3 nodes by default, and those replicas form a **Raft group**. Raft elects a leader that sequences every write into a log, and a write is committed once a majority of replicas have it. One replica holds the **lease**, and the leaseholder is the only replica that serves consistent reads and proposes writes. Since v25.2 the lease is tied to Raft leadership through **leader leases**, so leaseholder and leader are the same replica except briefly during a transfer. Reads at the leaseholder skip Raft entirely: whatever is on its disk already reached consensus when written. That's why a read costs one network hop and a write costs a consensus round.

The map of ranges lives in the key space itself, in a two-level index (`meta1`, `meta2`) holding a **range descriptor** for every range: its key span and its replicas' addresses. Every node caches the entries it has used, so most lookups never leave the node.

### Storage: Pebble, MVCC, garbage collection

**Pebble** is a log-structured merge tree written in Go, inspired by RocksDB with a smaller feature set and CockroachDB-specific optimisations. A write goes to a write-ahead log and an in-memory memtable at once; the memtable flushes to an immutable sorted-string-table file (an SST) in level L0; compaction merges SSTs down through L1 to L6, each level holding about a tenth of the data of the one below. If compaction falls behind, L0 fills and the tree "inverts", and every read consults many files; the docs call a read amplification under 10 healthy. Most of a node's disk bandwidth goes to compaction, not the WAL. An optional **value separation** mode keeps large values in blob files so compactions copy a pointer, which the docs say cuts write amplification by about half for about 20% more space.

Every value carries a timestamp, which is how CockroachDB does **multi-version concurrency control (MVCC)**. A write creates a new version, readers see the version current at their transaction's timestamp, and old versions are collected once older than the zone's `gc.ttlseconds`, which defaults to 14,400 seconds (4 hours). That window is how far back `SELECT ... AS OF SYSTEM TIME` can read. Backups and changefeeds pin the versions they need with **protected timestamps**, so you can keep the TTL short.

### Clocks

There is no TrueTime. CockroachDB uses **hybrid logical clocks (HLC)**: a timestamp whose physical part tracks wall time and whose logical part orders events on the same tick. Every message between nodes carries the sender's HLC and the receiver advances its own if needed, so causally related events order correctly. A serialisable transaction gets one HLC timestamp that both versions its writes and decides what it can see.

The catch is skew. Each node starts with `--max-offset`, default 500 ms, the largest clock difference the cluster will tolerate. When a node finds its clock out of sync with at least half the others by 80% of that offset, it shuts itself down rather than serve stale data. Within the bound, a read that finds a value timestamped slightly ahead of its own timestamp can't tell whether that write came before or after it started. That window is the **uncertainty interval**, and the transaction pushes its timestamp past the value and re-checks what it already read. If the re-check fails, the client gets a `ReadWithinUncertaintyIntervalError`, one of the 40001 retry errors. Skew beyond the bound doesn't break serialisability, but it can break linearisability between causally dependent transactions, which is why the docs insist on NTP from one time source. For multi-region clusters they recommend 250 ms, because the offset sets the commit-wait on global tables.

### The write path

Here is what happens when a client sends an `INSERT` inside a transaction.

```mermaid
sequenceDiagram
    participant C as Client
    participant G as Gateway node
    participant L as Leaseholder (Raft leader)
    participant F as Followers
    C->>G: BEGIN; INSERT ...
    G->>G: parse, plan, TxnCoordSender starts txn
    G->>L: DistSender routes BatchRequest via meta2 cache
    L->>L: latch keys, check lock table and timestamp cache
    L->>F: Raft: replicate write intent
    F-->>L: majority ack
    L->>L: apply to Pebble (WAL + memtable)
    L-->>G: intent written (pipelined)
    C->>G: COMMIT
    G->>L: txn record -> STAGING, wait for in-flight writes
    L-->>G: all intents replicated
    G-->>C: COMMIT OK
    G->>L: async: record -> COMMITTED, resolve intents
```

1. The gateway parses and plans. A plan that touches few rows runs on the gateway; otherwise the physical planner distributes it (DistSQL) and processors run next to the data.
2. The `TxnCoordSender` on the gateway picks an HLC timestamp, tracks every key the transaction touches, and heartbeats the transaction so others know it's alive. The `DistSender` looks up each key's range in its `meta2` cache and sends the request to the leaseholder; a wrong guess is redirected silently.
3. On the leaseholder, a latch serialises requests on the same keys, the in-memory lock table checks for conflicts, and the **timestamp cache** checks that nobody has read these keys at a later timestamp. If someone has, the write's timestamp is pushed forward.
4. The write becomes a **write intent**: a provisional MVCC value that is also an exclusive lock pointing at the transaction's record. It's proposed to Raft, replicated to a majority, and applied to each replica's Pebble. With **transaction pipelining** the gateway doesn't wait per statement; it collects the acknowledgements at commit.
5. Since 26.2, explicit serialisable transactions also use **buffered writes** by default. Writes stay on the gateway (up to 4 MiB per transaction) until commit, reads of those keys are served from the buffer, only the last write per key is sent, and a transaction whose writes all land in one range takes the one-phase-commit fast path.
6. At `COMMIT`, **parallel commits** takes over. The coordinator writes the transaction record in `STAGING` with the list of in-flight writes, waits for all of them to replicate, and answers the client. The transaction is committed at that moment, because anyone who finds the record can verify the listed writes. Commit therefore costs one consensus round rather than two, and the docs put a transaction's latency at "the sum of all read latencies plus one round of consensus latency".
7. Asynchronously, the coordinator flips the record to `COMMITTED` and rewrites the intents as ordinary values; if it dies first, the next transaction to find an intent does the recovery.

### The read path

A consistent read goes to the leaseholder, reads the version at the transaction's timestamp, and records itself in the timestamp cache so later writers are ordered after it. A read that hits someone else's intent checks that transaction's record and queues if it's still pending; deadlocks are broken by aborting one waiter at random.

A **follower read** is different. Every range has a **closed timestamp**, a promise from the leaseholder that no new write will land at or below it, trailing the present by a 3-second target. A query with `AS OF SYSTEM TIME follower_read_timestamp()` reads from the nearest replica below that timestamp, which the docs put at least 4.2 seconds in the past. A bounded-staleness read (`with_max_staleness('10s')`) picks the freshest timestamp the local replica can serve without blocking, and keeps serving even when the replica is cut off from its leaseholder.

## Data model and indexing

The table is its own primary index. Every table must have a primary key; without one you get a hidden `rowid`, which the docs advise against. Non-key columns are stored as the value, grouped into **column families**. Splitting a frequently updated column into its own family avoids rewriting large, rarely updated ones on every update and lets transactions on different columns avoid conflicting.

Every secondary index is a second sorted set of keys in the same key space, so it splits into ranges and is replicated like a table. A write to a row with three secondary indexes is four key-value writes, likely on four ranges with four leaseholders, inside one distributed transaction. That's the write cost of an index here: consensus and coordination as well as disk. The docs say to drop indexes you don't need (`crdb_internal.index_usage_statistics` shows which) and to size-limit every indexed column, because values over 1 MiB drive write amplification and can crash nodes. There's no documented limit on columns per index.

The index types are:

- Standard secondary indexes, with `UNIQUE` creating one automatically. A `STORING` clause adds non-key columns so a query can be answered without an **index join** back to the primary index; that's a covering index.
- Partial indexes with a `WHERE` predicate, which index only matching rows.
- Expression indexes such as `lower(name)`, usable in unique and partial indexes.
- **Hash-sharded indexes**, which add a hidden computed shard column, 16 buckets by default, so sequential keys spread across ranges. The docs stress this is hash partitioning of an ordered index: a range scan now reads every shard.
- GIN (inverted) indexes over `JSONB`, `ARRAY`, and spatial data, and trigram indexes over strings for `LIKE` and similarity search.
- Vector indexes, compatible with pgvector's `VECTOR` type, which partition vectors with k-means and search a tunable number of partitions for approximate nearest neighbours. They're enabled by default in 26.2.

Two things you can't have. Interleaved tables, which stored child rows inside the parent's key range, were deprecated in v20.2 and removed in v21.2, so a parent-child join always crosses ranges. And there's no `CREATE DOMAIN`, no range types, no XML, no foreign data wrappers, and no XA.

The most important schema decision is the shape of the primary key, because keys decide where writes land. An `INT` key fed by a sequence, or a secondary index on a `TIMESTAMP`, puts every new row at the tail of the index. The tail is one range on one leaseholder, so one node takes every write. The docs call this an **index hotspot** and describe it as a moving one: the tail range splits at 512 MiB, the new tail lands on another node, and the problem moves with it, which is why load-based splitting can't fix it. The fix is a `UUID` key from `gen_random_uuid()`, which scatters inserts, or a hash-sharded index if you need the order. A **row hotspot** is worse: one row updated thousands of times a second (a celebrity's follower count) can't be split at all, so you change the model, for instance by spreading the counter across several rows.

Row-level TTL expires rows by a timestamp column with a background job. **Changefeeds** turn the row-level change stream into messages for Kafka, Amazon MSK, Confluent Cloud, Google Pub/Sub, Azure Event Hubs, Pulsar, webhooks, or cloud storage, with at-least-once delivery and per-key ordering; a `resolved` timestamp message tells a consumer nothing older is still coming.

## Transactions and consistency

Every statement is a transaction, and every transaction runs at **SERIALIZABLE** by default: the outcome equals some one-at-a-time ordering, so write skew, lost updates, phantoms, and non-repeatable reads can't happen. A transaction can span any rows, tables, and ranges in the cluster.

What serialisable costs you is retries. When two transactions conflict, CockroachDB first tries to push one's timestamp forward and re-validate everything it already read, a **read refresh**. If a value it read has changed, the refresh fails and the transaction is aborted with SQLSTATE `40001` and a message starting `restart transaction`. The codes include `RETRY_WRITE_TOO_OLD` (a later transaction already wrote the row), `RETRY_SERIALIZABLE` (your timestamp was pushed and your reads no longer hold), and `ReadWithinUncertaintyIntervalError`. The server retries on its own only while it still holds the whole transaction: a single statement or a batch sent together, with under 16 KiB of results not yet streamed. Once a client has seen a result, only the client can retry. So every application on the default isolation needs a retry loop around each transaction, and the docs ship adapters for pgx, GORM, SQLAlchemy, and Active Record.

You reduce retries by keeping transactions short, batching statements so the server can retry them, taking `SELECT ... FOR UPDATE` locks before reading rows you'll update, moving read-only work to stale reads, and choosing keys that don't collide. Under serialisable those locks live in memory on the leaseholder and don't survive a lease transfer unless you enable `enable_durable_locking_for_serializable`.

**READ COMMITTED** is the alternative, and in 26.2 the cluster setting `sql.txn.read_committed_isolation.enabled` is on by default. Each statement takes a fresh snapshot, so one transaction can see different states in different statements. Conflicts are retried per statement inside the server, and the docs say these transactions "do not return serialization errors that require client-side handling", barring rare cases tied to the result buffer. Locks under read committed are replicated through Raft, so they survive lease transfers. What you give up is the anomaly set: lost updates and write skew are both possible, and the docs walk through the on-call doctors example where two transactions each see another doctor on duty and both book leave. You prevent that with locking reads and pay in lock waits instead.

Limits are soft. Lock tracking and refresh spans are each budgeted at 4 MiB per transaction (`kv.transaction.max_intents_bytes`); past the first the tracked spans get coarser, past the second a serialisable transaction can't refresh and must retry. You can set `transaction_rows_written_err` to fail transactions over N rows. There's no wall-clock limit, but a long transaction gets pushed past the closed timestamp and fails at commit if anything it read has changed. Bulk work belongs in batches, `IMPORT INTO`, or row-level TTL.

Global tables use **non-blocking transactions**: writes get a timestamp slightly in the future, the leaseholder closes timestamps ahead of real time, and the writer waits ("commit-wait") until the cluster clock passes its commit timestamp. Every replica can then serve a consistent, current read locally. The wait is roughly the max clock offset, hence the 250 ms recommendation.

## Replication and failover

Replication is synchronous by construction. A write is acknowledged only after a majority of the range's Raft group has appended it, so with 3 replicas the loss of one node loses nothing acknowledged. A range tolerates `(replication factor - 1) / 2` failures: one for 3, two for 5. The factor is set per cluster, database, or table through zone configurations.

When a leaseholder dies, store liveness notices the missing heartbeats, the surviving replicas hold a Raft election (the timeout is 4 ticks of 500 ms, times a random factor between 1 and 2), and the new leader takes the lease. The docs say the whole process completes "within a few seconds", triggered lazily by the next request for the range. Cockroach Labs' testing of leader leases reports partitions between a leaseholder and its followers healing in under 20 seconds and liveness outages under 1 second. Before 25.2, a partitioned leaseholder that kept heartbeating the single node-liveness range could hold its lease indefinitely; leader leases removed that. If a range does become unavailable, a per-replica circuit breaker trips after 60 seconds and requests get a `ReplicaUnavailableError` instead of hanging.

There's no replica lag in the Postgres sense, because there are no asynchronous read replicas: consistent reads go to the leaseholder and always include your own committed writes. Follower reads are explicitly stale. **Non-voting replicas** follow the log and serve follower reads but don't vote, so you can add read locality without adding write latency.

Rebalancing is automatic. A joining node receives ranges, a lost node's replicas are re-created elsewhere from snapshots, replicas move continuously to even out count and CPU, and leases follow the workload roughly every 10 minutes based on where requests come from. Disk usage isn't a rebalancing input, and locality diversity overrides evenness.

Multi-region is two settings. The **survival goal** is per database. `ZONE`, the default, keeps the database available through the loss of one availability zone. `REGION` keeps it available through the loss of a whole region, needs at least three database regions, raises replication to 5 in a 2+2+1 placement, and, in the docs' words, "write latency will be increased by at least as much as the round-trip time to the nearest region", because "at least one additional region must be consulted for each write". Reads in the leaseholder's region are unaffected. The **table locality** is per table. `REGIONAL BY TABLE`, the default, homes the whole table's leaseholders and voting replicas in one region. `REGIONAL BY ROW` homes each row where its `crdb_region` says, defaulting to the inserting region, with optional auto-rehoming on update. `GLOBAL` serves consistent reads from every region and pays with slower writes. For regional-by-row tables the optimiser does **locality-optimised search**: a lookup guaranteed to return at most 100,000 keys searches the local partition first and goes remote only if it finds nothing. Super regions pin all replicas of some rows to a named set of regions for data-domiciling rules.

Beyond what one cluster can survive, **physical cluster replication** streams a whole cluster asynchronously to a standby, with lag "generally in the tens-of-seconds range", and can fail over to a past timestamp to undo a mistake.

## Scaling

You scale by adding nodes, and the unit that moves is the range. Reads scale because leaseholders are spread across nodes and because follower reads and non-voting replicas serve stale reads wherever the client is. Writes scale because different ranges have different Raft groups on different machines, so write capacity is roughly the sum of the leaseholders' capacity, provided writes are spread across ranges.

That proviso is the whole game. The shard key is the primary key, in order, and you can't pick another. A spread key (UUID, or a hash-sharded index) uses every range; a sequential key uses one hot range regardless of cluster size. The docs put it directly: an index hotspot means "CockroachDB could be limited to the performance of a single node, which goes against the purpose of a distributed database". Load-based splitting helps a range that's hot because it's popular and does nothing for a moving tail or a single hot row. Resharding is automatic in both directions and you never run it by hand, though you can split manually before a bulk load.

Node sizing from the production settings page: at least 8 vCPUs per node and never fewer than 4, with 64 the most Cockroach Labs tests extensively; 4 GiB of RAM per vCPU; 320 GiB of storage per vCPU as a starting point and no more than 10 TiB per node; 500 IOPS and 30 MB/s per vCPU. Prefer fewer, larger nodes for stability (they absorb hotspots better) and more, smaller nodes for faster recovery. In a narrow test they stored 4.32 TiB of logical data per node on six 16-vCPU AWS nodes. Cloud limits are 200 vCPUs on Standard, about 60 vCPUs' worth on Basic, and 9 regions per Advanced cluster through the console.

The healthy-cluster guidance is that connections actively executing statements shouldn't exceed 4 times the cluster's vCPU count; there's no default cap, so you size the pool in the client. A Standard vCPU corresponds to about 500 request units a second.

The floor on write latency across regions is the network. A write must reach a majority of its replicas, so if they span regions the commit waits for at least one cross-region round trip; under 2+2+1 another region is always in the majority. The only escape is to keep a row's replicas in one region and accept that region's loss.

## Consistency versus availability

CockroachDB is a CP system and the docs say so. Under a partition, the side that still holds a majority of a range's replicas keeps serving it; the minority side stops. A range that has lost its majority everywhere is unavailable until enough replicas return, and requests get errors rather than stale or conflicting data. The multi-active availability page states it: clusters that lose a majority of replicas "stop responding because they've lost the ability to reach a consensus on the state of your data". With 3 replicas across 3 zones you survive any one zone; with 5 across 3 regions you survive any one region, not two.

In normal operation you pay in two places: every write waits for a majority, and serialisable isolation turns contention into retries. The knobs are the replication factor and survival goal, table locality, the isolation level, follower reads, the closed timestamp target, and `--max-offset`. Bounded-staleness reads are the one path that keeps serving on the minority side of a partition.

## Operations

Backups are `BACKUP` to S3, GCS, Azure, or NFS, as collections of full backups plus incrementals, and the docs recommend nightly fulls. Adding `revision_history` captures every MVCC version, which enables **point-in-time restore**: `RESTORE ... AS OF SYSTEM TIME` to any moment the backup covers. Scheduled backups place protected timestamps so GC can't remove what they need. For tighter recovery objectives, physical cluster replication is the answer.

Upgrades are rolling and online: drain and restart one node at a time on the new binary. A major-version upgrade then needs **finalisation**, automatic by default, which runs migration jobs and after which you can't roll back; disable auto-finalisation if you want a test window first. Regular releases can't be skipped, Innovation releases can. Cloud Basic and Standard are upgraded for you; Advanced is customer-initiated.

The housekeeping is mostly automatic: compaction, MVCC garbage collection on the `gc.ttlseconds` schedule, range splits and merges, replica and lease rebalancing, and **admission control**, which queues CPU and disk-write work per node by priority so background jobs don't starve foreground SQL. Decommissioning a node moves all its replicas elsewhere and is described as heavyweight.

What to watch, from the monitoring guide and the DB Console: unavailable ranges (alert immediately) and under-replicated ranges (alert if they persist); `liveness_livenodes`; CPU, which shouldn't persistently exceed 80%; the IO Overload score, where above 1.0 means L0 is filling faster than compaction drains it; read amplification, single digits normal; the Top Ranges page for hot ranges by QPS, CPU, and keys written; the Insights page for contention, which since 26.2 records the actual conflicting key; clock offset; circuit-breaker events on the Replication dashboard; changefeed lag; and `seconds_until_enterprise_license_expiry`, since an expired licence eventually throttles the cluster.

Capacity maths starts from vCPUs: take the expected peak, add the 40% buffer the Cloud planning page recommends, then derive RAM at 4 GiB per vCPU, storage at 320 GiB per vCPU or your data times three replicas plus growth, and IOPS at 500 per vCPU. Then load-test.

The Cloud cost model has three shapes. Basic bills usage only: $0.20 per million request units and $0.50 per GiB-month, with $15 a month free (50 million RUs and 10 GiB). Standard bills provisioned vCPUs by the hour, with storage, data transfer, backups, and changefeeds on usage, and prices a multi-region cluster at its most expensive region's rate. Advanced bills per node per hour including storage and IOPS, plus the same usage items. The per-vCPU rates live on the pricing page rather than in the docs, and search results in late September 2026 suggest the plans are being reshaped again, so check the page before quoting a rate.

## Performance envelope

The documented numbers:

- Single-row reads in 2 ms or less and writes in 4 ms or less, from the FAQ, for a single-region cluster.
- Transaction latency approaching the sum of read latencies plus one consensus round.
- Follower reads at least 4.2 seconds stale; the closed timestamp trails by 3 seconds.
- Global-table writes wait about one max clock offset: 500 ms default, 250 ms recommended.
- Region-survival writes add at least the round trip to the nearest other region.
- Ranges up to 512 MiB, load-split above 2,500 QPS or 500 ms CPU per second.
- Lease transfer after a node death within a few seconds; partitions healing under 20 seconds; a 60-second circuit breaker on unavailable ranges.
- Nodes from 4 to 64 vCPUs and up to 10 TiB each.
- Server-side automatic retries only under 16 KiB of results; 4 MiB budgets for lock tracking, refresh spans, and buffered writes.
- Locality-optimised search for lookups of 100,000 keys or fewer.
- Cloud: 200 vCPUs on Standard, about 60 on Basic, 9 regions on Advanced.
- No documented cap on connections per node or rows per table; keep active connections under 4 per vCPU and indexed values under 1 MiB.

Cockroach Labs doesn't publish a headline throughput figure in the current docs, so treat any tpmC or QPS number from a blog as a benchmark on their hardware, not a limit.

## When to use it, and when not to

Use CockroachDB when the workload is transactional, the data must not be lost or read inconsistently, and you need to survive a zone or a region without a failover runbook. Payment ledgers, order and inventory systems, identity stores, and control planes for other infrastructure are the common cases: many small transactions, keys that spread naturally, and a real cost to a lost or double-applied write. It's also a fit when one Postgres has run out of a single machine's write capacity and you'd rather not build application sharding.

Don't use it for analytics; the FAQ says so, and there's no columnar engine, so ship the rows out through changefeeds instead. Don't use it for queue-like tables or outboxes, where you insert at one end and delete at the other; the docs describe the queueing hotspot and the tombstone scan it causes. Don't use it if the application can't carry a retry loop and can't accept read committed's anomalies. Don't use it for a small single-region app that a managed Postgres would serve: you'd pay a consensus round on every write, and a licence once you pass $10 million in revenue, for resilience you don't need. And don't expect Postgres extensions: pgvector's type is there, PostGIS and pg_cron are not.

**YugabyteDB** takes the other road to Postgres compatibility. Its query layer reuses the actual PostgreSQL code, so extensions and behaviour match Postgres far more closely, while its storage engine, DocDB, is a customised RocksDB with a Raft group per tablet, hash or range sharded, split automatically. It's Apache 2.0. Its isolation default moved the opposite way to CockroachDB's: read committed is the default for new clusters from v2025.2 and, in the v2026.1 series (29 June 2026), in release builds generally, on the argument that Postgres applications don't carry retry loops.

**TiDB** is MySQL-compatible rather than Postgres-compatible. A stateless SQL layer sits over TiKV, a Raft-replicated key-value store on RocksDB with 256 MiB Regions as the replication unit, and a Placement Driver that schedules Regions and hands out transaction timestamps. Its distinguishing piece is **TiFlash**, a columnar replica fed by Raft learners, which is a real answer to the analytics question CockroachDB declines. It runs snapshot isolation advertised as repeatable read, with pessimistic locking by default. Apache 2.0 throughout; 8.5 is the current LTS line, released December 2024 and patched to 8.5.8 in August 2026.

**Aurora DSQL** is AWS's serverless version, generally available since May 2025. It's Postgres-compatible at the wire level, uses optimistic concurrency with conflicts detected at commit (also as 40001), and bills by units of work. Its limits are sharper than CockroachDB's: a transaction may modify at most 3,000 rows and 10 MiB and must finish within 5 minutes, none of it configurable; there are no extensions, triggers, or PL/pgSQL; foreign keys only arrived in August 2026. It removes operations entirely and adds a hard ceiling on what one transaction can do.

## Interview deep dive

**Q. Walk me through what happens between `COMMIT` and the client's acknowledgement.**
The coordinator has been laying down write intents on each range's leaseholder without waiting for them to replicate. On `COMMIT` it writes the transaction record in `STAGING` with the list of in-flight writes, then waits for every leaseholder to confirm its intents reached a Raft majority, and acknowledges the client. That's parallel commits: one consensus round instead of two. Afterwards it moves the record to `COMMITTED` and rewrites the intents as plain values asynchronously. If it crashes first, the next transaction to encounter an intent finishes the job by checking the staged list.

**Q. Your service is getting SQLSTATE 40001 under load. What's happening and what do you do?**
At serialisable isolation CockroachDB couldn't order two conflicting transactions, so one was aborted and must be re-run. First make sure every transaction runs inside a retry loop with backoff, because the server only retries on its own while it still holds the whole batch and under 16 KiB of results. Then reduce the conflicts: shorten transactions, batch statements, take `SELECT ... FOR UPDATE` before reading rows you'll update, move read-only queries to follower reads, and check the Insights page for the conflicting key. If the workload is contention-heavy and can tolerate lost updates and write skew, switch those transactions to read committed.

**Q. Writes were fine on 3 nodes but adding 6 more didn't help. Why?**
Almost certainly a hot range from a sequential key: an `INT` primary key from a sequence, or a secondary index on `created_at`. Every insert lands at the tail of one range, one leaseholder takes all the writes, and adding nodes just moves the tail around. Confirm on the Top Ranges page and by the CPU spike hopping from node to node. Fix by changing the key to `UUID` with `gen_random_uuid()` or, if you need ordering, a hash-sharded index. A single hot row can't be split at all and needs a model change, such as spreading a counter across rows and summing on read.

**Q. A node dies mid-transaction. What's lost, and how long until its ranges serve again?**
Nothing acknowledged is lost, because every acknowledged write reached a majority of its range. Transactions coordinated by the dead gateway fail from the client's point of view, and their intents get cleaned up when another transaction finds them and sees nobody is heartbeating the record. For ranges it led, store liveness notices the missing heartbeats, the survivors elect a new Raft leader, and the lease moves with leadership within a few seconds. The under-replicated ranges are then re-replicated from snapshots.

**Q. Design the multi-region layout for a payments platform serving the US and the EU that must stay up if a region is lost.**
Three database regions at minimum, say us-east, us-west, and eu-west, with the database set to `SURVIVE REGION FAILURE`, which makes each range 5 replicas placed 2+2+1. Customer and account tables `REGIONAL BY ROW` keyed by the customer's region so the common case stays local, with foreign keys that include `crdb_region`. Reference data like currencies and fee schedules `GLOBAL` so every region reads it locally. Accept that every write now includes a round trip to the nearest other region, and lower `--max-offset` to 250 ms so global-table writes stay fast. If EU data must never leave the EU, add a super region over EU regions, and know you've traded away survival for that data if the EU is the region that fails.

**Q. How does CockroachDB get serialisable isolation without atomic clocks?**
Hybrid logical clocks give every transaction a timestamp and MVCC stores every version with one. Three mechanisms enforce ordering: write intents lock written keys; the timestamp cache on each leaseholder records the latest read of every key so a lower-timestamped write is pushed forward; and read refreshing re-checks a pushed transaction's reads before it commits. Skew is bounded by `--max-offset`, and a read inside the uncertainty window pushes past it rather than guessing. Serialisability holds regardless of skew; what skew beyond the bound can break is linearisability between causally related transactions, and a node that drifts too far shuts itself down.

**Q. What anomaly do you invite by switching to read committed, and how do you guard the cases that matter?**
Write skew and lost updates. Two transactions each read that the other doctor is on call, each books leave on that basis, and both commit, leaving nobody on call; serialisable would abort one. Under read committed each statement sees a fresh snapshot and the server retries conflicting statements, so the client never sees 40001, but nothing checks that what you read is still true at commit. Guard the invariants that matter with `SELECT ... FOR UPDATE` or `FOR SHARE` on the rows the decision depends on, which serialises those transactions through locks at the cost of waiting.

**Q. Estimate the cluster for 2 TiB of data and 30,000 queries a second, 20% writes.**
Storage first: 2 TiB times 3 replicas is 6 TiB, plus MVCC versions and headroom, call it 9 TiB, spread over at least the 3 nodes replication needs and well under the 10 TiB per-node ceiling. Compute: with millisecond-scale queries and at most 4 active connections per vCPU, 30,000 QPS at a few milliseconds each is on the order of 100 concurrent executions, so tens of vCPUs, doubled for the 40% buffer and hot-range headroom. A first cut is 6 nodes of 16 vCPUs, 64 GiB RAM, and 1.5 to 2 TiB of SSD each across three zones, then a load test with a UUID-keyed schema while watching CPU, IO Overload, and the Top Ranges page.

**Q. Why is a secondary index more expensive here than in Postgres, and when is `STORING` worth it?**
In Postgres an index write is another page in the same WAL on the same machine. Here the index is its own key range with its own Raft group, likely on a different leaseholder, so an insert into a table with three indexes is a distributed transaction across four ranges. `STORING` is worth it when a hot query filters on the index key but returns other columns: without it CockroachDB does an index join back to the primary index, a second round of range lookups; with it the index covers the query. The cost is a wider index to write and store.

**Q. What happens during a partition that splits a 5-node cluster 3 and 2?**
Ranges whose majority is on the 3-node side keep serving; ranges whose majority was on the 2-node side lose it, and with 3 replicas per range spread across 5 nodes almost every range has a majority somewhere, so leases move to the big side. Clients on the minority side see requests fail after the 60-second circuit breaker rather than hang, except bounded-staleness follower reads, which keep serving from local replicas. Leader leases mean partitioned leaseholders lose their leases quickly instead of holding them, so the majority side recovers in seconds.

**Q. When would you not choose CockroachDB?**
When the workload is analytical, because there's no columnar engine and the vendor says so; when the access pattern is a queue, because the tail hotspot and tombstone scans fight the design; when the application can't carry a retry loop and can't accept read committed's anomalies; when it needs Postgres extensions like PostGIS; when one region and a managed Postgres would do, because you'd pay consensus latency for resilience you don't use; and when the company is past $10 million in revenue and hasn't budgeted for an Enterprise licence.

## What changed recently

- **18 November 2024, v24.3.** The CockroachDB Software License replaced the Business Source License and the free Core build: Enterprise Free for organisations under $10 million in revenue, telemetry required, throttling after 7 days without it.
- **1 December 2024.** New CockroachDB Cloud pricing with usage-based data transfer, backup, and changefeed charges took effect for all customers except those on earlier contracts.
- **18 February 2025, v25.1.**
- **12 May 2025, v25.2.** Leader leases became the default, removing the partitioned-leaseholder outage that epoch-based leases allowed.
- **27 May 2025.** Aurora DSQL went generally available.
- **4 August 2025, v25.3. 3 November 2025, v25.4. 18 February 2026, v26.1.**
- **27 April 2026, v26.2.** SQL triggers (`BEFORE` and `AFTER`, on `INSERT`, `UPDATE`, `DELETE`) generally available. Buffered writes generally available and on by default for explicit serialisable transactions. Contention events now record the actual conflicting key rather than the transaction's anchor key.
- **29 June 2026.** YugabyteDB v2026.1 made read committed the default in release builds.
- **August 2026.** Aurora DSQL added foreign key constraints; TiDB 8.5.8 shipped on 27 August; CockroachDB 26.2.6 on 21 August.
- **September 2026.** CockroachDB 26.3 entered beta.
