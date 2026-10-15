# PostgreSQL replication and distribution research

Research date: 15 October 2026. Scope: PostgreSQL 18 and Citus 14.2. PostgreSQL's official documentation identifies 18 as current and 19 as a release candidate. Citus 14 supports PostgreSQL 16–18; its version is independent of the PostgreSQL server. This record distinguishes documented mechanisms, proposed experiments and editorial deductions. Server observations will be recorded separately under `scaling/`.

## What the PostgreSQL branch adds

The family articles establish copies, ownership and distribution boundaries. These articles should let a reader trace an implementation: a WAL sender, receiver and replay process; an LSN that has been flushed but not replayed; the slot that prevents recycling; a planner routing tenant work to colocated shards; and the worker transactions that have to finish after a coordinator failure. A list of feature names would not supply this understanding.

## Physical replication and reads

A physical standby starts from a base copy and replays the primary's WAL. Streaming replication has distinct send, receive, flush and replay progress. PostgreSQL is asynchronous by default. Synchronous acknowledgement depends on both `synchronous_standby_names` and `synchronous_commit`; cascade connections are not automatically covered by a direct standby's promise. Waiting for synchronous acknowledgement also retains transaction locks. [PostgreSQL 18 warm standby](https://www.postgresql.org/docs/18/warm-standby.html).

Hot standby snapshots see a committed change after its commit record is replayed. Standbys cannot accept ordinary writes, create reporting-only indexes or create/write temporary tables. WAL replay may conflict with queries, including cleanup needed by the primary. `max_standby_streaming_delay` is a delay budget for replaying received WAL, not a guaranteed execution allowance for each query. Feedback can prevent cleanup of needed tuples on the primary, shifting retention there; it does not remove all conflict types. [Hot standby](https://www.postgresql.org/docs/18/hot-standby.html).

**Worked scenario:** A has product 7 priced at 20. Pause replay on B while leaving its receiver running. Commit price 25 on A. Observe the received/flushed position advance on B, the replay position remain behind and a new query still return 20. Resume replay, wait for a marker captured after A's commit, and issue a new query returning 25. Change the acknowledgement setting to `remote_apply` with B selected as synchronous: pausing replay should now hold the commit acknowledgement. These require real server processes; a one-connection SQL table model cannot demonstrate them.

A router can use a position captured after the writer commit as a conservative lower bound, wait until the selected standby has replayed it, then take a new snapshot. It must retain the replication lineage and target identity; comparing bare numeric LSNs across divergent histories is insufficient. This is an application protocol to construct and test, not a built-in global router. `write_lag`, `flush_lag` and `replay_lag` measure recent acknowledgement delays, not an estimated time to catch up; idle caught-up connections eventually report NULL. [Monitoring statistics](https://www.postgresql.org/docs/18/monitoring-stats.html).

A physical slot retains WAL required by its consumer. `max_slot_wal_keep_size` is checked at checkpoints; the default permits unbounded retention. Bounding retained WAL can make a sufficiently lagging slot unusable, requiring recovery from another source or a new copy. `idle_replication_slot_timeout` acts at checkpoints and excludes synchronized standby slots. These are choices about preserving a consumer versus preserving disk headroom. [Replication settings](https://www.postgresql.org/docs/18/runtime-config-replication.html).

## Logical replication and a failover topology

Native publication/subscription replication selects table changes within a database. For UPDATE and DELETE, the publisher needs a replica identity: ordinarily its primary key. Missing identity can reject publisher DML, rather than merely causing a slow subscriber. `REPLICA IDENTITY FULL` is a fallback; PostgreSQL 18 can use eligible B-tree/hash subscriber indexes for lookup. Do not repeat older extension documentation's blanket assertion that FULL always requires a table scan. [Publications](https://www.postgresql.org/docs/18/logical-replication-publication.html).

Row filters evaluate old and new rows. A change crossing into a selected tenant becomes an INSERT at the subscriber; a change crossing out becomes a DELETE. For UPDATE/DELETE the filter columns must be covered by replica identity. Filters do not limit TRUNCATE. Multiple publications can widen the copied rows. [Row filters](https://www.postgresql.org/docs/18/logical-replication-row-filter.html).

**Worked scenario:** Publish tenant 7 from an orders table with key `(tenant_id, order_id)`. Move an order to tenant 8 and observe its removal from the subscriber. Then show why this stream is not a tenant ownership protocol: the publisher still accepts the source mutation, and the receiving table has its own write policy and apply lag.

Logical replication does not replicate DDL, sequence progress or large objects. Values generated by a sequence can arrive while its subscriber-side counter stays behind. Add compatible subscriber columns before publishing writes that need them. A logical copy can use different indexes, but is not automatically a ready physical replacement. [Restrictions](https://www.postgresql.org/docs/18/logical-replication-restrictions.html).

Local subscriber writes are not a conflict-resolution design. Unique violations can stop apply; missing UPDATE/DELETE targets are skipped. An incoming update can overwrite a row changed locally. Skipping a failed transaction skips its other changes too and can create inconsistency. [Conflicts](https://www.postgresql.org/docs/18/logical-replication-conflicts.html).

Failover-capable logical slots require explicit coordination. `failover=true`, standby `sync_replication_slots`, an upstream physical slot, `hot_standby_feedback` and usable connection configuration are distinct prerequisites. `synchronized_standby_slots` can hold logical sending until the physical standby has received the needed WAL; it therefore introduces a backpressure dependency. Slots also retain WAL/catalog state, and decoding may repeat changes after a crash. [Logical decoding concepts](https://www.postgresql.org/docs/18/logicaldecoding-explanation.html).

In A → physical B and A → logical C, C must not outrun the history available on the promoted B. Slot synchronization is asynchronous. Before promotion, check every required slot, including relevant table-sync slots: it must be synchronized, persistent and valid. Disable/repoint subscribers as part of cutover. A `failover` flag alone does not elect, fence or route a new primary. [Logical replication failover](https://www.postgresql.org/docs/18/logical-replication-failover.html).

## Recovery, promotion and authority

Core PostgreSQL exposes promotion but does not implement the external failure detector and failover controller. A primary that is merely unreachable may still serve clients. It must lose write authority before another becomes writable. Changing DNS is not fencing an existing connection. [Warm standby failover](https://www.postgresql.org/docs/18/warm-standby-failover.html).

Patroni is a separate controller. Its DCS leader lease and watchdog can enforce stopping a former leader even when the controller stalls. Required watchdog mode refuses leadership without a functioning watchdog. The hardware/software reset path and DCS availability are part of the deployment's guarantee. [Patroni watchdog](https://patroni.readthedocs.io/en/latest/watchdog.html). Its asynchronous loss bound also includes WAL written since sampled progress, not only a configured byte threshold. [Patroni replication modes](https://patroni.readthedocs.io/en/latest/replication_modes.html).

`pg_rewind` can bring a diverged old primary back to the surviving history. It requires suitable target checksums or `wal_log_hints`, `full_page_writes`, and access to needed WAL. It does not merge independently accepted writes. Configure the target as a standby before starting it; otherwise it can diverge again. Rewind failure may require a new base backup. [pg_rewind](https://www.postgresql.org/docs/18/app-pgrewind.html).

PITR needs a base backup and an uninterrupted required WAL history. Archive completion depends on completed WAL segments, so low traffic can delay archive freshness. Configuration files are outside WAL recovery. **Scenario:** restore before a bad delete and show that a later legitimate order is absent too; recovering database time does not reconcile external payments or newer valid work. [Continuous archiving](https://www.postgresql.org/docs/18/continuous-archiving.html). The recovery author owns this broader mechanism; replication should link to it rather than reteach it.

## Native partitions and FDW

Native declarative partitioning routes rows to child relations; it does not assign them to separate database servers. Bounds permit pruning at planning or execution. A unique/primary constraint must include every partition key column, because child indexes cannot independently prove a global key that omits the routing value. Too many partitions increase planning and per-session metadata costs. [Declarative partitioning](https://www.postgresql.org/docs/18/ddl-partitioning.html).

**Experiment beyond the existing family lesson:** force a generic prepared plan for a date parameter and inspect execution-time `Subplans Removed`; change the parameter and retain the same prepared statement. Compare the filtered child with a tenant-only predicate visiting both children. Use the composite key to show that accepting repeated order ID in different months changes the invariant.

`postgres_fdw` can push suitable filters and joins to a foreign server, inspectable with EXPLAIN VERBOSE. Its remote transaction uses REPEATABLE READ for a local READ COMMITTED transaction. It cannot prepare remote transactions for two-phase commit. Connecting foreign partitions therefore does not construct a transparent atomic distributed database. [postgres_fdw](https://www.postgresql.org/docs/18/postgres-fdw.html).

**Optional two-server experiment:** In a local READ COMMITTED transaction, read a local and foreign row. Commit changes to both from other sessions. The next local read can change while the existing FDW remote transaction retains its earlier remote snapshot. Make the distinct snapshot ownership visible rather than promising one cluster-wide timestamp.

## Citus distribution and its limits

Citus 14 supports PostgreSQL 18; Citus 14.2 is the latest examined release. The older stable docs identify 13.0.1, while Microsoft Learn now offers `view=citus-14`. Record the actual extension version in any runnable lesson. [Citus 14](https://www.citusdata.com/updates/v14-0/), [Citus 14.2](https://www.citusdata.com/updates/v14-2/).

Hash distribution assigns key ranges to worker shard tables. Colocating related tables on the same tenant key makes a tenant join local to one worker. Include that key in unique constraints and colocated foreign keys. Reference tables are copied to workers and support distributed-to-reference foreign keys; the reverse direction has different restrictions. Schema-based sharding is an alternative arrangement with its own cross-schema constraints. [Citus 14 DDL](https://learn.microsoft.com/en-us/postgresql/citus/reference-ddl?view=citus-14).

**Worked tenant design:** customers `(tenant_id, customer_id)`, orders `(tenant_id, order_id, customer_id)` and a foreign key carrying both tenant/customer columns. Tenant 7's order must not resolve to tenant 8's customer with the same customer_id. Demonstrate the key failure locally with PostgreSQL; separately trace Citus's distribution routing. Never label local SQL as a verified Citus plan.

Co-location helps a tenant-filtered join because the worker has both sides. An all-tenant aggregate fans out and combines partial answers. A join lacking the distribution equality may need data movement or hit a query restriction. Citus's SQL support depends on whether work is local or spans nodes; recursive CTEs and SELECT FOR UPDATE illustrate operations limited to single-shard execution. [Citus 14 workarounds](https://learn.microsoft.com/en-us/postgresql/citus/reference-workarounds?view=citus-14).

A worker does not gain existing data just because it joins. Rebalancing moves shards and their co-location partners. Logical copying catches up concurrent changes before a brief cutover write lock. Tenant isolation first splits its rows into a dedicated shard; moving that shard is a separate step. One hot tenant remains one distribution value, so adding workers does not divide its writes. [Citus cluster management](https://learn.microsoft.com/en-us/postgresql/citus/cluster-management?view=citus-14).

The tagged 14.2 engineering README describes multi-node writes using prepared worker transactions, a coordinator commit record and recovery of outstanding participants. Atomic outcome does not imply distributed snapshot isolation: worker commits become visible at different moments. A concurrent multi-node query can observe only part of the committed operation. [Citus 14.2 architecture source](https://raw.githubusercontent.com/citusdata/citus/v14.2.0/src/backend/distributed/README.md).

**Documentation discrepancy:** [Citus 14 DML](https://learn.microsoft.com/en-us/postgresql/citus/reference-dml?view=citus-14) retains a claim about default one-phase multi-shard UPDATE/DELETE, at odds with the newer architecture description. Do not publish a guessed default. Explicitly configure the intended two-phase protocol in a future real extension lab and inspect the installed release. No Citus instance has been executed for this research. A two-phase timeline can teach the documented mechanism without claiming measured worker behaviour.

Citus 14 fixed cluster restore-point coordination for writes started on metadata workers: blocking only coordinator writes did not cover those commit decisions. Coordinated backup and recovery must include metadata and distributed transaction state, not just a pile of independent worker backups. This is a useful extension-specific consequence to mention with the release reference, rather than inventing a whole recovery procedure here.

## Compatible systems and managed services

Yugabyte's YSQL layer derives from PostgreSQL, while its distributed DocDB storage changes the underlying execution/storage architecture. Its current YSQL documentation names PostgreSQL 15 compatibility, not PostgreSQL 18 internals. Driver compatibility, syntax, extensions, transaction semantics and operational procedures are separate questions. [YSQL](https://docs.yugabyte.com/stable/api/ysql/), [Yugabyte architecture](https://docs.yugabyte.com/stable/architecture/). This comparison should establish a boundary, not become an unverified product feature matrix.

RDS also demonstrates why a service name is insufficient: a Multi-AZ DB instance has a synchronous standby that cannot serve reads, while a Multi-AZ DB cluster has a writer and two readable instances with a different replication arrangement. Do not infer engine/version/region support from those topology pages. [RDS instance topology](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html), [RDS cluster topology](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/multi-az-db-clusters-concepts.html).

## Implementation and review gates

Use distinct media for distinct questions: process/LSN strip for replication; branching history for promotion; tenant-to-worker placement with aligned table pairs for co-location; and a two-worker commit timeline for atomic outcome versus simultaneous visibility. Every modeled value must be labeled as such. Retain exact server version, commands, result and cleanup in the experiment record. Browser lessons can exercise native pruning and local constraints. Replication, fencing and Citus need actual processes or clearly labeled diagrams; PGlite cannot establish their guarantees.

## Resolution of the Citus protocol wording

The v14.2.0 source resolves the scenario used by the article. `Activate2PCIfModifyingTransactionExpandsToNewNode` in [adaptive_executor.c lines 3097–3143](https://github.com/citusdata/citus/blob/v14.2.0/src/backend/distributed/executor/adaptive_executor.c#L3097-L3143) activates 2PC when an existing modifying transaction writes through a different worker connection. A read-only expansion is not the same trigger. [CoordinatedRemoteTransactionsPrepare](https://github.com/citusdata/citus/blob/v14.2.0/src/backend/distributed/transaction/remote_transaction.c#L979-L1041) skips read-only connections. The old `multi_shard_commit_protocol` name is absent from the tagged shared-library GUC registration source examined; do not recommend setting an older documented GUC based on stale DML prose. The published explanation now identifies the actual versioned activation path and contains no unresolved editorial note.
