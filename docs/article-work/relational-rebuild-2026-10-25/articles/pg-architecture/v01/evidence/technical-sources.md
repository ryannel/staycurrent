# Technical sources and execution evidence

Checked on 25 October 2026 against external PostgreSQL 18 primary documentation/source. Reader-facing source links are in the article's final Sources and further reading; source disclosure is closed by the supplied wrapper. Source branch links identify REL_18_STABLE, not a claimed immutable upstream revision.

| Concern | Primary source |
| --- | --- |
| Connection/backend relationship | https://www.postgresql.org/docs/18/tutorial-arch.html |
| Query pipeline and semantic analysis | https://www.postgresql.org/docs/18/query-path.html ; https://www.postgresql.org/docs/18/parser-stage.html |
| Implicit transaction boundaries and parallel participants | https://www.postgresql.org/docs/18/sql-begin.html ; https://www.postgresql.org/docs/18/how-parallel-query-works.html |
| Header, line-pointer sizes and TID indirection | https://www.postgresql.org/docs/18/storage-page-layout.html |
| Physical CTID, xmin/xmax and tuple-lock flag qualifications | https://www.postgresql.org/docs/18/ddl-system-columns.html ; https://github.com/postgres/postgres/blob/REL_18_STABLE/src/include/access/htup_details.h |
| TOAST-supported values, compression and out-of-line chunks | https://www.postgresql.org/docs/18/storage-toast.html |
| Established snapshots, commit outcomes and visibility | https://www.postgresql.org/docs/18/transaction-iso.html ; https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/access/heap/heapam_visibility.c |
| Pins/content locks and clock replacement | https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/storage/buffer/README ; https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/storage/buffer/freelist.c |
| OS cache, shared buffers and background writer | https://www.postgresql.org/docs/18/runtime-config-resource.html |
| Index-only eligibility and conservative page proof | https://www.postgresql.org/docs/18/indexes-index-only-scans.html ; https://www.postgresql.org/docs/18/storage-vm.html |
| HOT conditions, referenced columns, summarising exception and redirects | https://www.postgresql.org/docs/18/storage-hot.html ; https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/access/heap/README.HOT |
| Fillfactor | https://www.postgresql.org/docs/18/sql-createtable.html#SQL-CREATETABLE-STORAGE-PARAMETERS |
| Logged pruning generates WAL | https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/access/heap/pruneheap.c (RelationNeedsWAL guard and log_heap_prune_and_freeze) |
| WAL order, checkpoints, asynchronous acknowledgement and automatic maintenance | https://www.postgresql.org/docs/18/wal-intro.html ; https://www.postgresql.org/docs/18/wal-configuration.html ; https://www.postgresql.org/docs/18/wal-async-commit.html ; https://www.postgresql.org/docs/18/routine-vacuuming.html |

## Execution

`sql-verify.mjs` ran once in an owned in-memory PGlite 0.5.8 instance; actual version PostgreSQL 18.3/WASM. It checked both displayed SQL queries, a price change and stock invariance, and closed the instance. `sql-results.json` contains exact output. No server process, filesystem or simultaneous-session claim rests on this run.

Root inspected and executed `native-verify.mjs` once against the explicitly owned native PostgreSQL 18.6 Debian/aarch64 fixture. All three connections checked database, user, cluster_name, data_directory and version before DDL; timeouts and search_path were explicit. Root retained the image digest/runtime provenance in `native-fixture.json`; executable/result hashes and execution limits are in `native-execution.json`.

`native-results.json` establishes:

- Ordinary reader returned 20.00 while W's new 22.00 was uncommitted; the established Repeatable Read report still returned 20.00 after commit, while a later snapshot returned 22.00.
- HOT old tuple (0,3) had HEAP_HOT_UPDATED and link (0,4); new (0,4) had HEAP_ONLY_TUPLE. Actual primary-key leaf heap TIDs stayed (0,1), (0,3), (0,2), rather than inferring index preservation from row counts.
- After the retained snapshot ended, VACUUM made LP3 a redirect (lp_flags=2, lp_off=4), retained the index target and compacted the live tuple bytes.
- The price-index counterexample added actual (0,4) targets to both primary-key and price B-trees, without HEAP_ONLY_TUPLE.
- Four roughly 1900-byte PLAIN fixture tuples prevented enough same-page space; P7's new tuple was (1,1), lacked HEAP_ONLY_TUPLE and gained that actual index target.
- An aborted later 24.00 attempt left the ordinary price 22.00.

The native schema was dropped, all three clients closed, and root stopped/removed the disposable container and deleted its credential file. No inherited/default database was targeted. No process timing, native query plan, index-only counter, cache-replacement trace, power failure or crash guarantee was measured. The article describes those mechanisms from primary sources and keeps its drawn schedules explicitly illustrative.
