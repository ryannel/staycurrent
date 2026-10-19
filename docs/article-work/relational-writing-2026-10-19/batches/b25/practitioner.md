# Practitioner review — b25

## a24 — How stored rows become physical work

**Verdict: PASS.** No required repairs or optional changes requested.

Read the complete article, supplied context and sibling plans, actual a05 parent, complete native worksheet and raw plans, inline models and renderer, source ledger and writer handoff. The article preserves the parent's complete diagnosis/comparison method and adds the physical evidence needed when width, locality, retained versions or pruning explain the work. It stops before a25's index traversal/coverage, a26's full plan investigation and a28's concurrency sizing. The pruning experiment hands continuing key/boundary/write-coverage decisions to a38 and DDL/lifecycle procedures to their owners. This is useful relational practice rather than an engine or partitioning catalogue.

The important categories stay separate: returned rows versus page accesses and distinct pages; shared-buffer reads versus device reads; a warm hit versus no processing; stored width versus output projection; retained versions versus eligible cleanup; reusable bytes versus allocated file size; and local table pruning versus distribution. The InnoDB comparison is explicitly documentation-based. Ordinary reuse precedes rewrite, and the rewrite's immediate space, I/O, index and locking costs are included in the decision.

### Independent native verification

Ran the inspected worksheet with pinned pg 8.23.1 against PostgreSQL 18.6 in fresh reviewer database `rel3_prac_a24_1792463001`. The temporary copy changes only its accepted database prefix; both JSON file output and console output go to reviewer paths, preserving the retained evidence. Full own results: `/private/tmp/rel3-prac-a24-native.json`.

The worksheet principally captures evidence, so I added independent assertions over its result values and plan/state invariants rather than treating successful exit alone as a semantic pass. All passed:

- The 9,000-row narrow and wide fixtures produced identical ordered results. Warm scan hits were 103 and 2,250; selecting only id still used 2,250. Both routes remained scans plus sorts. The storage settings correctly isolate inline width.
- The external-value fixture used 7 hits for identifiers and 4,008 for full-note hashing, with zero execution shared reads. Main heap allocation was 57,344 bytes versus total 8,749,056 bytes. The full aggregate, rather than a metadata-only length operation, consumed the note contents.
- The held repeatable-read snapshot retained 2,000 rows/sum 20,000 after the writer produced the current 1,500/sum 16,500. Heap allocation grew from 77 to 134 pages. Under the held snapshot, pgstattuple reported 2,500 dead tuples and 118,512 free bytes. Ending it and vacuuming reduced the dead count to zero and increased free bytes to 718,576; heap allocation stayed fixed. Inserting 500 rows restored 2,000 live tuples without growing the heap. The native update also reproduced the stated WAL bytes and dirtied-block count, neither of which is mislabelled as device writes.
- The one-day unpartitioned and partitioned answers were both count 100/sum 1,000. The plain scan used 103 hits; the pruned February scan used 32 and rejected the other 2,700 February rows. The generic prepared path removed two subplans and executed February only, again at 32 hits. The unbounded path executed all three children and used 104 hits versus 103 plain. All these execution read counters were zero.

The table-local autovacuum/storage/fillfactor changes, reader isolation, nontruncating vacuum and late session-only plan-cache override are stated. No cache eviction, global statistics reset, server reconfiguration or production benchmark was performed. Both own connections closed and database drop completed successfully. No retained evidence was overwritten.

### Sources and working models

Checked consequential claims against PostgreSQL [page layout](https://www.postgresql.org/docs/18/storage-page-layout.html), [system columns](https://www.postgresql.org/docs/18/ddl-system-columns.html), [TOAST](https://www.postgresql.org/docs/18/storage-toast.html), [HOT](https://www.postgresql.org/docs/18/storage-hot.html), [pgstattuple](https://www.postgresql.org/docs/18/pgstattuple.html), [VACUUM](https://www.postgresql.org/docs/18/sql-vacuum.html), [CLUSTER](https://www.postgresql.org/docs/18/sql-cluster.html), [pruning](https://www.postgresql.org/docs/18/ddl-partitioning.html#DDL-PARTITION-PRUNING) and [EXPLAIN](https://www.postgresql.org/docs/18/sql-explain.html), plus MySQL 8.4 [clustered/secondary indexes](https://dev.mysql.com/doc/refman/8.4/en/innodb-index-types.html) and [multi-versioning](https://dev.mysql.com/doc/refman/8.4/en/innodb-multi-versioning.html). The unstable ctid, summarising-index HOT exception, preserved unchanged external values, ordinary-vacuum/truncation distinction and rewrite-lock/space qualifications are accurate. The unusual pgstattuple “dead” versus vacuum-eligible distinction is supported both by its documented classification and the independent retained-reader run.

Extracted the actual inline pure model builder for independent checks: fifteen variants including warm/cold locality, 72 complete states. Verified the same four sought identities, page-access/distinct-page/cache-load arithmetic, unchanged wide-layout projection, retained/released snapshot boundary and captured pruning endpoints. Then exercised every one of those 72 states in the immutable 4438 browser preview. Displayed counters, highlighted pages, notes and observer states agreed with the source and native evidence. Comparison changes restart at the first state as declared. Visually inspected the reusable-space endpoint in context.

The large buffer counts are properly labelled accesses rather than distinct storage blocks. The small page drawings are invented; the TOAST endpoint and pruning summaries identify their native origin. No cold-device I/O, production latency, sustainable capacity, filesystem-fragmentation diagnosis or MySQL execution is implied. These limits match the evidence and preserve sound practical decisions.

Snapshot/rendered article bytes and the b25 component hash match the manifest. Review tab closed; preview released.
