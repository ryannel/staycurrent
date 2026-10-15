# PostgreSQL evidence

Checked 15 October 2026, against PostgreSQL 18 documentation. Every successful source
below was opened during this authoring run. The SQL runtime is PGlite 0.5.8,
reporting PostgreSQL 18.3. All SQL results concern that embedded runtime.

## Architecture and versions

- [Architectural fundamentals](https://www.postgresql.org/docs/18/tutorial-arch.html):
  a conventional server backend process per connection; the browser is explicitly
  distinguished from this deployment arrangement.
- [Query path](https://www.postgresql.org/docs/18/query-path.html): parsing,
  rewriting, planning and execution; plans are not direct physical SQL instructions.
- [Resources](https://www.postgresql.org/docs/18/runtime-config-resource.html):
  shared buffers, per-operation work, background writing and operating-system cache.
- [Page layout](https://www.postgresql.org/docs/18/storage-page-layout.html): typical
  8 KiB pages, item identifiers, tuple headers and ctid structure.
- [System columns](https://www.postgresql.org/docs/18/ddl-system-columns.html): xmin,
  xmax and changing physical tuple locations; no application identity claim for ctid.
- [TOAST](https://www.postgresql.org/docs/18/storage-toast.html): compression and
  out-of-line values qualify what it means to fetch one row.
- [Transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html):
  ordinary Read Committed and Repeatable Read snapshots, and competing update
  rechecks. Previously checked in the operations/performance run; the two-session
  procedure is sourced, not presented as executed.
- [Visibility map](https://www.postgresql.org/docs/18/storage-vm.html) and
  [index-only scans](https://www.postgresql.org/docs/18/indexes-index-only-scans.html):
  conservative all-visible bits and heap fetch avoidance. Direct plan observations
  independently demonstrate the example's before/update/vacuum behaviour.
- [HOT](https://www.postgresql.org/docs/18/storage-hot.html): same-page room and no
  changes to columns in non-summarising indexes; summarising BRIN has different
  treatment. Included available stock prevents HOT for the covering-index update.
- [Routine vacuuming](https://www.postgresql.org/docs/18/routine-vacuuming.html) and
  [transaction IDs](https://www.postgresql.org/docs/18/transaction-id.html): cleanup,
  freezing, statistics, and retained-version requirements. No claim that ordinary
  vacuum necessarily shrinks the file or that xmin alone determines visibility.

## Access methods

- [Index types](https://www.postgresql.org/docs/18/indexes-types.html) and
  [ordering](https://www.postgresql.org/docs/18/indexes-ordering.html): ordered
  B-tree access versus specialised operations. The article bounds its worked
  comparison to B-tree, GIN and BRIN rather than a product-feature inventory.
- [GIN](https://www.postgresql.org/docs/18/gin.html): extracted keys and posting
  references, bitmap candidate access, pending-list maintenance and operator classes.
  PostgreSQL 18 has consolidated content here; old gin-intro/gin-implementation
  paths returned 404 and are not cited.
- [JSON indexing](https://www.postgresql.org/docs/18/datatype-json.html#JSON-INDEXING):
  jsonb_path_ops hashes path/value information, its supported containment/path
  operators, comparison with jsonb_ops, and expression-index alternatives.
- [BRIN](https://www.postgresql.org/docs/18/brin.html): page-range summaries,
  correlation, lossy rechecks, summarisation and pages_per_range. The four-range
  minute table in the article is explicitly a schematic, not observed physical
  boundaries. Old brin-intro returned 404; the article uses the consolidated source.
- [Concurrent builds](https://www.postgresql.org/docs/18/sql-createindex.html#SQL-CREATEINDEX-CONCURRENTLY):
  operational requirements, locks and invalid-index failure handling. This was
  already checked in the performance run and is only an onward operational boundary.

## WAL and recovery

- [WAL introduction](https://www.postgresql.org/docs/18/wal-intro.html),
  [internals](https://www.postgresql.org/docs/18/wal-internals.html) and
  [configuration](https://www.postgresql.org/docs/18/wal-configuration.html):
  write-ahead ordering, LSNs, checkpoint/redo positions, full-page images and
  checkpoint cost. The state table is a possible illustrative sequence, not a trace.
- [WAL settings](https://www.postgresql.org/docs/18/runtime-config-wal.html),
  [asynchronous commit](https://www.postgresql.org/docs/18/wal-async-commit.html),
  [reliability](https://www.postgresql.org/docs/18/wal-reliability.html): durable
  local commit conditions, asynchronous acknowledgement, fsync versus consistency,
  truthful storage flushes and remote wait levels.
- [Administrative functions](https://www.postgresql.org/docs/18/functions-admin.html#FUNCTIONS-ADMIN-BACKUP):
  WAL insertion and other position functions. A shared stream's advancement is not
  attributed solely to one application update.
- [Replication settings](https://www.postgresql.org/docs/18/runtime-config-replication.html)
  and [continuous archiving](https://www.postgresql.org/docs/18/continuous-archiving.html):
  retention dependencies, required surviving copies and complete WAL chains.
- [Activity statistics](https://www.postgresql.org/docs/18/monitoring-stats.html):
  operational observations are estimates/counters, not an exact census of removable
  row versions or a complete application trace.

## Execution

Run `node docs/article-work/postgresql-completion/verify.mjs` from the repository.
It uses execProtocolRawStream and captures results in `observed.json`.

- All 22 steps succeed, including the deliberately open WAL transaction (status T)
  followed by rollback (status I). Every other step ends idle. Setups rerun safely.
- Indexed product lookup returns product 7, its committed available value becomes
  1 at a different ctid, the repeated two-unit request returns no row, and the
  one-unit variation returns 0.
- The B-tree plan returns IDs 20000–19996 without Sort. GIN finds twenty priority
  documents; the extracted-text equality uses a Seq Scan. BRIN identifies the
  one-minute page ranges, with sixty matching events; the second minute gives
  IDs 600–659 and the full-day variation matches all 20,000.
- After initial vacuum, the covering plan has Heap Fetches: 0. Updating product 1
  changes visible ctid/xmin and causes heap fetches. Subsequent standalone vacuum
  restores zero heap fetches while values remain 1,3,3,3,3. Updating product 2 and
  repeating maintenance yields 1,2,3,3,3.
- EXPLAIN ANALYZE WAL reports one WAL record and 71 bytes for the observed update.
  Rollback restores available 3 while the stream position has advanced. A later
  committed update leaves 1. The editable uncommitted value 2 also rolls back to 3.
- The embedded runtime reports synchronous_commit=on, fsync=off. The recovery
  article reports this precisely and refuses to infer a physical durability test.

The server-only two-session snapshot/VACUUM procedure is unexecuted in this
environment. No PostgreSQL server client or multi-session harness is installed.
The explanation follows documented visibility guarantees and deliberately does not
claim exact reclaimed tuple counts or file shrinkage. Real server crash recovery,
disk loss and standby acknowledgement were not tested.

## Author's continuous pass

Read all four sources as connected prose after drafting. The main journey preserves
the subject before the scenario; each child adds a specific investigation. SQL
setups and result facts appear before interpretations, physical identifiers are
kept separate from application identity, and implementation claims are versioned.
The coordinator requested an explicit DROP INDEX in the BRIN switch snippet; it is
included so the article sequence can be run directly. The visibility lesson also
separates its UPDATE batch from the following EXPLAIN run, so the plan observes a
committed update as the prose says. The revised 22-step suite passes. Independent
review and final rendered verification are the next stage.
