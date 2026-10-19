# a24 source and observation ledger

Checked 20 October 2026 (Europe/Stockholm). Native capture timestamp is 19 October 2026 23:37 UTC, corresponding to 20 October locally. Intended audience is a relational practitioner; no separate engine-internals curriculum is introduced.

## Primary documentation

| Source | Claims checked / use |
| --- | --- |
| [PostgreSQL 18 page layout](https://www.postgresql.org/docs/18/storage-page-layout.html) and [system columns](https://www.postgresql.org/docs/18/ddl-system-columns.html) | Fixed pages, heap item identifiers, version locations, ctid changes. No durable identity claim. |
| [TOAST](https://www.postgresql.org/docs/18/storage-toast.html) | Compression versus external values, chunk storage and pointer, unused values need not be fetched, metadata/partial-value operations, preservation of unchanged external values. Fixture forces EXTERNAL to isolate fetch work. |
| [HOT](https://www.postgresql.org/docs/18/storage-hot.html) | New heap versions, same-page space and index-column conditions, explicit summarising-index exception. |
| [Routine vacuuming](https://www.postgresql.org/docs/18/routine-vacuuming.html) and [VACUUM](https://www.postgresql.org/docs/18/sql-vacuum.html) | Retention, eligible cleanup, reusable space, end truncation versus rewrite, FULL locking and temporary space. |
| [CLUSTER](https://www.postgresql.org/docs/18/sql-cluster.html) | One-time heap ordering; not maintained by later changes; ACCESS EXCLUSIVE and table/index replacement plus sort-space costs. |
| [EXPLAIN](https://www.postgresql.org/docs/18/sql-explain.html) | ANALYZE executes; hit/read counts, inclusive node buffers, WAL records/bytes and dirtied buffers do not measure device writes. |
| [Object sizes](https://www.postgresql.org/docs/18/functions-admin.html#FUNCTIONS-ADMIN-DBSIZE) | relation versus total sizes and associated TOAST/index storage. |
| [pgstattuple](https://www.postgresql.org/docs/18/pgstattuple.html) | Full scan, read lock, concurrent snapshot limitation, HeapTupleSatisfiesDirty classification, approximate alternative and visibility map skipping. Native retained-snapshot result independently demonstrates classification versus vacuum eligibility. |
| [Partitioning and pruning](https://www.postgresql.org/docs/18/ddl-partitioning.html#DDL-PARTITION-PRUNING) | Bound elimination at planning/execution, initialisation Subplans Removed, actual loops, overhead with many children. Only the captured generic-prepared case is asserted here. |
| [WAL introduction](https://www.postgresql.org/docs/18/wal-intro.html) | Changed pages and logging are separate write obligations; article hands recovery/operation procedure to other owners. |
| [InnoDB clustered/secondary indexes, MySQL 8.4](https://dev.mysql.com/doc/refman/8.4/en/innodb-index-types.html) | Clustered row storage and primary-key secondary locator. No MySQL counts. |
| [InnoDB multi-versioning, MySQL 8.4](https://dev.mysql.com/doc/refman/8.4/en/innodb-multi-versioning.html) | Undo reconstruction, snapshot-retained history, delete marking and purge. No generalisation of PostgreSQL heap placement to InnoDB. |

All sources browsed through official documentation. No secondary technical source supplies a consequential claim.

## Native evidence

`evidence/verify.mjs` is the reader-downloadable Node worksheet. Driver: pg 8.23.1. Native PostgreSQL 18.6 Homebrew on aarch64 Apple Darwin. See `evidence/raw-results.json` for unshortened JSON plans, relation and tuple statistics, results, environment and session/fixture overrides.

Own disposable database `rel3_a24_run2`; two article-owned connections plus administrative creator/cleanup connection. Server at loopback port 57319; shared buffers 32 MB, work memory 4 MB, block size 8192, statement timeout 30 s, lock timeout 5 s. Reported max_parallel_workers_per_gather = 2 does not mean workers were used; these captures are serial. fsync, synchronous_commit and full_page_writes on. Server not restarted, reconfigured or stopped. No shared statistic resets, checkpoints or evictions.

- Width: 9,000 rows, customer g % 100, dates January–March 2026; 40 versus 1,800-character inline notes. PLAIN storage prevents compression/external placement. Identical ordered results (90 rows) verified. Warm scan hits: 103 versus 2,250; reads: 0. Identifier-only projection left these counts unchanged. Index sizes: 221,184 bytes each.
- External value: 1,000 records, each with an 8,192-byte generated note. EXTERNAL permits out-of-line without compression. Main heap: 57,344 bytes; total: 8,749,056 bytes. sum(id): 7 hits; sum(length(md5(note))): 4,008 hits. Reads: 0. These aggregates deliberately exercise different columns and are not result-equivalence claims.
- Versions: 2,000-row fixture with fillfactor 80, snapshot established in a separate REPEATABLE READ connection, total 10 → 11 then every fourth row deleted. Old reader retains 2,000 rows / total 20,000; new reader sees 1,500 / 16,500. Heap: 77 → 134 pages. Update: 647,809 WAL bytes and 62 dirtied blocks in this capture. Under held snapshot, VACUUM (TRUNCATE FALSE) left pgstattuple dead count 2,500 and free space 118,512 bytes. Releasing snapshot then the same vacuum yielded dead count 0 / free space 718,576 bytes; heap unchanged at 1,097,728 bytes. Inserting 500 rows uses freed heap space; heap unchanged, primary-key index 106,496 → 114,688 bytes. Table-local autovacuum disabled solely to make transitions deterministic.
- Pruning: the same narrow 9,000 orders copied into three monthly child tables. Identical one-day result: count 100 / sum 1,000. Plain table: 103 hits; February only: 32 hits. Generic prepared plan with session plan_cache_mode = force_generic_plan: Append Subplans Removed = 2, February 32 hits. All-month count/sum: 104 hits in partitions versus 103 plain. All shared reads: 0. No partition latency or production capacity assertion.

Initial `rel3_a24_run1` attempt failed because VACUUM was included in a multi-statement message; finally closed connections and dropped that newly created database. The retained successful worksheet separates VACUUM. It additionally guards cleanup with a created flag so a rejected existing-name CREATE cannot drop a pre-existing database. That safety-only edit does not alter the SQL of retained observations.

## Models

Five figures use the same component. Width models 12 orders with 4 or 2 per page, explicitly not byte-scale. Locality preserves orders 1, 6, 15 and 24 between layouts; indexes and cache eviction omitted. TOAST cards explain the separate fetch with captured counters only at endpoint. Version cards model one row and a snapshot; native 2,000-row observations remain distinct. Partition cards replay captured plan summaries, not browser database execution. All timing is explanatory reading time, not simulated engine time.
