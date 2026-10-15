# Storage and durability: evidence

Checked 15 October 2026. Documentation URLs are pinned to PostgreSQL 18. Source
references use REL_18_STABLE. Product rows and page 12 are invented teaching data.
No database crash, power loss or storage-loss test was performed.

## Claims and sources

| Claim used | Primary source | Scope and interpretation |
| --- | --- | --- |
| Ordinary heap pages usually occupy 8 kB; headers, row locations and row versions consume space | https://www.postgresql.org/docs/18/storage-page-layout.html | Page size can differ at compile time. Three drawn rows are illustrative, not a capacity estimate. |
| Table and index physical storage are separate | https://www.postgresql.org/docs/18/storage-file-layout.html | Ordinary heap and index files, not every possible table access method. |
| Large field values can be compressed or stored out of line | https://www.postgresql.org/docs/18/storage-toast.html | Avoid suggesting every logical row's complete values occupy one page. |
| Shared buffers coexist with OS caching | https://www.postgresql.org/docs/18/runtime-config-resource.html#GUC-SHARED-BUFFERS | Buffer miss is not proof of drive I/O. The particular page-12 read is an illustration. |
| Updates use row versions; ordinary reads use snapshots | https://www.postgresql.org/docs/18/mvcc-intro.html and https://www.postgresql.org/docs/18/transaction-iso.html | No claim that an ordinary Read Committed transaction keeps one snapshot across its statements. |
| A same-page update with eligible columns can avoid new normal index entries | https://www.postgresql.org/docs/18/storage-hot.html | Bounded HOT mention; not an assertion that this particular update will use HOT. |
| WAL precedes data-file writeback and permits deferred data writes at commit | https://www.postgresql.org/docs/18/wal-intro.html | Local ordinary logged-table commit; no claim all changed data must still be unwritten at reply time. |
| Buffered changes can precede WAL flush; page log position enforces write ordering and assists redo | https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/access/transam/README | “Write-Ahead Log Coding”; in-memory operation order differs from durable write ordering. |
| Recovery restores physical changes without treating their mere existence as visibility | https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/access/heap/heapam_xlog.c and https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/access/heap/heapam_visibility.c | `heap_xlog_update` replays the record's row-version operations; visibility routines check transaction status. The three histories are inferences from redo, visibility and synchronous commit. They are not observed failures. |
| Transactions have all-or-nothing effects for readers; committed changes survive ordinary crashes | https://www.postgresql.org/docs/18/tutorial-transactions.html | No assertion that uncommitted bytes are physically erased during recovery. Ordinary transactions, no prepared transactions. |
| Reliable OS/device flush behaviour is required; volatile device caches can break it | https://www.postgresql.org/docs/18/wal-reliability.html | Persistent storage must survive. A server's acknowledgement does not certify its hardware. |
| Full-page WAL images protect recovery from partially written pages | https://www.postgresql.org/docs/18/runtime-config-wal.html#GUC-FULL-PAGE-WRITES | First modification after a checkpoint with full_page_writes enabled. Not protection against loss of the device. |
| Checkpoints advance a recovery starting point while writes continue; frequent checkpoints create I/O/FPI tradeoffs | https://www.postgresql.org/docs/18/wal-configuration.html | A completed checkpoint's recorded redo position is precise; avoid calling checkpoint completion an instantaneous frozen database. |
| Vacuum and pruning reclaim obsolete versions; long snapshots can retain needed versions | https://www.postgresql.org/docs/18/routine-vacuuming.html and https://www.postgresql.org/docs/18/storage-hot.html | Reusable space is distinct from file shrinkage. VACUUM FULL requires rewrite capacity and exclusive locking. |
| Free-space map directs future space searches | https://www.postgresql.org/docs/18/storage-fsm.html | Supporting mechanism, not a promise that every insert avoids extending the table. |
| Async commit permits recent acknowledged loss without the corruption exposure of fsync off | https://www.postgresql.org/docs/18/wal-async-commit.html | Stated fsync/full_page_writes assumptions retained. No specific loss-window timing claimed. |
| Unlogged tables reset after crash/unclean shutdown | https://www.postgresql.org/docs/18/sql-createtable.html#SQL-CREATETABLE-UNLOGGED | Applies to unlogged table contents despite COMMIT spelling. |
| PITR needs base backup and continuous archived WAL; local current WAL is insufficient backup | https://www.postgresql.org/docs/18/continuous-archiving.html | Accidental deletion is itself durable; restoration can stop before it if the required backup/log range exists. |

## Verification boundaries

`examples.mjs` uses the installed PGlite engine to verify SQL shape, price results,
creation of a different visible row version after UPDATE, and a ROLLBACK result.
It deliberately does not claim durability, crash recovery, physical page placement,
multi-session visibility, vacuum file shrinkage or performance verification.

The example script's output records its engine version. PG18 sources support the
article's native-server implementation claims regardless of the embedded engine's
version. Figures represent permitted histories, so there are no simulated timing
measurements or model-output claims to validate.

Executed successfully on 15 October 2026 with Node 26.8.2: PostgreSQL 18.3,
PGlite 0.5.8. Before: 20.00, CTID `(0,2)`; after commit: 22.00, CTID `(0,4)`;
after the deliberate 24.00 update and rollback: 22.00. The article never assigns
these observed physical locations to its illustrative page-12 drawing.

Independent review and desktop/phone light/dark rendering are the coordinator's
remaining checks. Follow those review records before calling the draft ready.

## Reusable reading

Page Layout suits a reader ready for internal byte structures. WAL Introduction
and Reliability suit someone reasoning about commit guarantees. Routine Vacuuming
is the next practical source for version maintenance. Continuous Archiving is
the next source for an operator designing recoverable backups; it requires a
running-server understanding beyond this article's mechanism explanation.

## Coordinated review

The [batch review and verification record](../access-and-persistence/review.md)
records the independent readings, repairs, browser checks and final draft status.
The author-handoff notes above describe the earlier state before those checks.
