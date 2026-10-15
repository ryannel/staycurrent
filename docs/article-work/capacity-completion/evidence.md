# Capacity evidence

Primary documentation checked 15 October 2026. PostgreSQL links are pinned to
version 18. The Citus stable documentation identifies itself as 13.0.1; its
mechanisms are concrete examples, not universal properties of sharded databases.

| Source | What it supports | Scope |
| --- | --- | --- |
| [PostgreSQL standby servers](https://www.postgresql.org/docs/18/warm-standby.html) | Physical streaming, initial base copy and log continuity, asynchronous operation, configured synchronous participants, retaining needed WAL | PostgreSQL physical replication; not an executed server test |
| [PostgreSQL synchronous commit](https://www.postgresql.org/docs/18/runtime-config-wal.html#GUC-SYNCHRONOUS-COMMIT) | Distinct remote-write, durable-flush and remote-apply acknowledgements; remote settings need configured synchronous standbys | Default local durability assumptions are named; storage must honour writes |
| [PostgreSQL hot standby](https://www.postgresql.org/docs/18/hot-standby.html) | Read-only standby queries, replayed commit visibility in new snapshots, recovery conflicts and feedback tradeoffs | Does not imply a retained old snapshot becomes fresh |
| [PostgreSQL failover](https://www.postgresql.org/docs/18/warm-standby-failover.html) | Promotion, surrounding failure-detection machinery, preventing the former writer from returning as another writer | No claim that PostgreSQL alone supplies an automatic election system |
| [PostgreSQL replication arrangements](https://www.postgresql.org/docs/18/different-replication-solutions.html) | Distinguishing shared storage, read copies and write-coordination arrangements | The article’s capacity comparison is original reasoning from their resource and ownership boundaries |
| [PostgreSQL table partitioning](https://www.postgresql.org/docs/18/ddl-partitioning.html) | Range routing, pruning, physical child tables, partition-key inclusion in unique constraints, missing partitions and maintenance locks | Real range partitions in the executable lesson; no speed claim from its three records |
| [PostgreSQL logical-replication restrictions](https://www.postgresql.org/docs/18/logical-replication-restrictions.html) | Schema and sequence responsibilities outside the row-copying contract | Used to prevent an arbitrary logical subscriber being described as a ready replacement writer |
| [Citus distribution-column choices](https://docs.citusdata.com/en/stable/sharding/data_modeling.html) | Tenant-local distribution and co-location, distribution choice from workload | Names an implementation example; cross-owner transactions and constraints depend on the actual engine |
| [Citus cluster management](https://docs.citusdata.com/en/stable/admin_guide/cluster_management.html) | Moving co-located shards with logical replication and a final short write-lock interval | Supports the movement mechanism, not a zero-latency or universal zero-downtime promise |

The articles’ workload, tenant, price and move histories are invented teaching
examples. Statements about which resources or copies survive a stipulated failure
are deductions from those histories and the specified acknowledgement policy.
They are not measured incident histories. No server, node or region was failed.

`verify.mjs` executes the literal lesson steps through PGlite’s raw simple-query
protocol, preserving the same statement batching as the sandbox. It checks the
first returned plan, rather than issuing a later helper query to obtain a more
convenient plan. `observed.json` retains exact rows, command tags, deliberate errors
and transaction state after each step. The deliberate missing-partition rejection
is expected SQLSTATE 23514; a repeated complete primary key is checked as 23505.

The ownership failure variation deliberately skips replay. Equal row counts still
leave four differing complete rows in a bidirectional comparison, and the
conditional ownership update must affect zero rows. After bounded replay, the
comparison must be empty. Repeating those exact three recorded changes is tested;
the lesson explicitly does not present this as a general out-of-order log
consumer. After cutover, a stale A/generation-1 request must affect zero rows and
the valid B/generation-2 request must update only B.

Execution status and independent review belong in the accompanying review record.
