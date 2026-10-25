# Technical sources and claim checks

Checked 25 October 2026 against primary PostgreSQL 18 documentation. The reader-facing Sources section lists these destinations.

- https://www.postgresql.org/docs/18/ddl-partitioning.html §§5.12.1–2: physical pieces of one logical table, parent/routing, half-open ranges, key-update movement, local indexes, partitioned uniqueness restriction. §§5.12.4/6: bounds-based pruning independently of indexes, planning/execution pruning, partition-count/design trade-offs.
- https://www.postgresql.org/docs/18/sql-createtable.html: exact declarative syntax, range/list/hash/default rules, missing-range insert behaviour.
- https://www.postgresql.org/docs/18/sql-altertable.html DETACH PARTITION: standalone table persists, incoming-reference locks, ordinary/concurrent detach restrictions and two internal transactions. The article does not claim a measured wait or a native lock experiment.
- https://www.postgresql.org/docs/18/ddl-constraints.html §§5.5.3–5: uniqueness of a pair differs from uniqueness of one component; referenced columns must have a supported unique key, foreign-key update/deletion behaviour.
- https://www.postgresql.org/docs/18/runtime-config-query.html: enable_partition_pruning, separate partitionwise join requirement for compatible partitioned inputs. No claim that pruning orders partitions an unrelated line table.
- https://www.postgresql.org/docs/18/functions-datetime.html: EXTRACT calendar fields, time-zone interpretation of timestamptz and AT TIME ZONE. The exact fixed-UTC year/month transformation is also exercised in the retained plan; it scans all twelve partitions in this observed run.

The following are deductions from the exact example, not externally observed business facts: customer 1001's fixed key goes to one hash bucket; a partial-month cutoff is insufficient for whole-month retirement; global identity differs from composite uniqueness; removing parent membership does not establish disposal of related/external/recovery data.

Execution: evidence/verify.mjs constructs the exact reader download from the byte-preserved input/generated-shop-fixture.sql plus evidence/experiment-tail.sql and an owned transaction/schema prefix, executes that file's identical bytes in one new PGlite instance, retains results and closes in finally. Public partition-evidence.json and evidence/verification-summary.json record runtime, source hashes, checks and plans. No default/existing database, concurrent clients, filesystem server data directory or native service is targeted. No native, production, throughput or latency claim is made.
