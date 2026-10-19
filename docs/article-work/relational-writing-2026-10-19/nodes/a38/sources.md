# a38 sources and evidence

Checked 20 October 2026. Article engine contract: PostgreSQL 18; executable
runtime: native Homebrew PostgreSQL 18.6, aarch64 macOS. Hosted comparisons are
Amazon RDS **Multi-AZ DB instance** (not DB cluster) and CockroachDB **v25.4**.

## Primary contracts

| Source | Claims used |
| --- | --- |
| [PostgreSQL 18 standby servers](https://www.postgresql.org/docs/18/warm-standby.html) | Physical cluster/WAL relationship, compatibility, standby replay, stream interruption and reinitialisation |
| [WAL settings](https://www.postgresql.org/docs/18/runtime-config-wal.html#GUC-SYNCHRONOUS-COMMIT) | Local flush; remote_write OS write, on remote flush, remote_apply replay; no synchronous members means no remote wait |
| [Replication settings](https://www.postgresql.org/docs/18/runtime-config-replication.html) | FIRST/ANY participation, slots, retention cap at checkpoints, connection and standby parameters |
| [Statistics](https://www.postgresql.org/docs/18/monitoring-stats.html) | pg_stat_replication positions and SyncRep wait observation; lag is not a catch-up forecast |
| [Administration functions](https://www.postgresql.org/docs/18/functions-admin.html) | Receive/replay positions, pause/resume, recovery role and LSN functions |
| [Hot standby](https://www.postgresql.org/docs/18/hot-standby.html) | Snapshot/recovery conflicts, cancellation, standby feedback and retained writer versions |
| [Failover](https://www.postgresql.org/docs/18/warm-standby-failover.html) | External failure/exclusion responsibility and promotion; PostgreSQL does not supply the whole cluster manager |
| [pg_rewind](https://www.postgresql.org/docs/18/app-pgrewind.html) | Divergent-history rewinding, shutdown/WAL/checksum or wal_log_hints prerequisites; target changes discarded |
| [Logical replication restrictions](https://www.postgresql.org/docs/18/logical-replication-restrictions.html) | DDL, sequence and large-object omissions; subscriber is not interchangeable with physical standby |
| [Table partitioning](https://www.postgresql.org/docs/18/ddl-partitioning.html) | Local range layout, bounds, pruning and lifecycle limits |
| [CREATE TABLE](https://www.postgresql.org/docs/18/sql-createtable.html) | Composite keys, partition bounds, default partitions and unlogged behaviour |
| [ALTER TABLE](https://www.postgresql.org/docs/18/sql-altertable.html) | Attach/detach validity, compatible schema, data/default coverage and lock-owning procedure |
| [CREATE INDEX](https://www.postgresql.org/docs/18/sql-createindex.html) | Partition parent/child indexes and uniqueness arrangements |
| [RDS Multi-AZ DB instance](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html) | Synchronous standby in separate AZ; standby cannot serve read traffic; distinguish cluster/read replicas |
| [RDS reboot](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_RebootInstance.html) | Supported failover action, DNS update and re-establishing existing connections |
| [CockroachDB v25.4 replication layer](https://www.cockroachlabs.com/docs/v25.4/architecture/replication-layer) | Replicated ranges as integrated placement rather than application PostgreSQL shards |
| [v25.4 transaction layer](https://www.cockroachlabs.com/docs/v25.4/architecture/transaction-layer) | Integrated transactions, default Serializable, optional Read Committed |
| [v25.4 multi-region overview](https://www.cockroachlabs.com/docs/v25.4/multiregion-overview) | Survival goal versus locality; deployment configuration matters |

## Native evidence

`src/components/relational-next/a38/rehearse.py` creates four fresh temporary
clusters in two independent pairs. It uses unused loopback ports and temporary
socket directories. It never connects to the shared port 57319 or any existing
database. Config changes, replay pauses, disconnects, shutdown, promotion,
replacement and table fixtures are confined to its own clusters. All are stopped
and removed in cleanup; commands and logs remain in evidence.

`native-evidence.json` is the first successful run. `native-evidence-2.json` is
the authoritative final run, adding a post-rejoin new-write replay assertion and
native checked December attachment plus nonempty detached October table. The
final article's numbers use run 2:

- PostgreSQL 18.6; fsync/full_page_writes/synchronous_commit initially on.
- Replay paused: writer/remote flush 0/3007200, standby replay 0/3000000;
  writer 101,103; standby 101.
- remote_apply waited at SyncRep; replay resume released it and made 104 visible.
- Standby connection intentionally pointed to an unused port; local 105
  acknowledged, synchronous 106 waited at SyncRep. Slot position distance 168
  bytes, status reserved; no storage exhaustion or slot invalidation performed.
- Reconnection caught up through the final replay boundary 0/3007430.
- Old writer stopped and status checked before promotion. New endpoint accepted
  107, old endpoint connection rejected. Stop through new write: 0.303 seconds.
- Old writer was never started on its old history. Replacement via fresh base
  plus standby configuration; inherited slot setting cleared. It replayed new
  109 and rejected a direct insert as read-only.
- Separate asynchronous-loss pair: standby stopped, writer acknowledged 201,
  writer stopped immediately, standby started/promoted without 201. This FAILS
  the stated zero-loss requirement. Startup through promotion: 0.252 seconds.
- Partition missing September and December inserts rejected; global UNIQUE(id)
  rejected; duplicate ID on separate dates accepted; correction physically moved
  October to November; November plan scanned only events_nov; checked December
  attachment accepted 1 December; detached October retained one row while parent
  retained November and December work.

The times omit failure detection, remote placement, production data/traffic,
application pools/proxies, real permissions, power loss and provider control
paths. Position distance is not disk allocation. No logical replication,
pg_rewind, geographic survival, distributed transaction or coordinated cloud
restore was executed.

## Teaching and boundaries

All three fixed references were read, including all figure descriptions,
transcripts and controls in their previews on port 4337. The actual a07 parent
and a39 restore sibling supply operating/restore boundaries. Actual a03, a04,
a05, a06 and a10 were consulted for transaction, integration, performance,
live-change and constraint ownership. Requirements for writer loss and location
loss are retained from a07; 30-second report freshness is illustrative here.

The four figures are models. They are never labelled native output. Local
partitioning has an explicit reject-for-now decision: the tiny fixture proves
mechanics but no service-scale saving. Ownership costs are used to assess the
relational workload without developing consensus or a resharding syllabus.
