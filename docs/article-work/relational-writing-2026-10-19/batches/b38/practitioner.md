# B38 practitioner review — a32

Verdict: **PASS** (full initial practitioner review).

Required repairs: none. Optional advice: none.

## Adoption decision and family boundaries

Read the complete frozen article, context, source ledger, writer handoff, native worksheet/evidence and both model/figure sources. Checked actual a08 and a34 and the common procedure ownership. The article makes a defensible conditional decision: reject the parent's unchanged direct three-host WAL arrangement; accept only a deliberately different single-host disposable prototype; defer production adoption until workload, storage flush, protected recovery and full recovery-clock gates pass. The prototype result is never promoted to acceptance of the parent's host-loss or service requirements.

It provides useful practitioner depth through the mechanisms that change this choice: file/process ownership, one writer, driver transaction control, stale read upgrade, pinned readers, journal/sync contracts, accepted and rejected representations, backup/reopen and failure recovery. It keeps general idempotent request recovery, application boundaries, workload measurement, schema design/evolution and service recovery with their existing owners. SQLite and CockroachDB remain alternative candidate checks, rather than a required sequence or an engine-specialist curriculum.

## Independent complete worksheet reproduction

Inspected the entire worksheet, then executed an unchanged copy using `/opt/homebrew/bin/python3` in a uniquely owned disposable temporary root. It loaded **Python 3.14.5 / SQLite 3.54.0**, source ID dated 9 October 2026, with threadsafety 3. Separately confirmed that `/usr/bin/sqlite3` is 3.51.0; it was not substituted for the application's runtime. Raw independent output is retained in [practitioner-native.json](practitioner-native.json).

Independently asserted every deterministic result in both author and own output, and compared the complete records after excluding execution timestamp and timing fields. These agree exactly. Checked the actual SQL and error/transaction state, not just the author's verifier:

- Both initialised connections and the reopened connection report WAL, synchronous 2, foreign keys 1, busy timeout 80, checkpoint threshold 1,000, page size 4,096 and both full-sync settings zero. Fresh-connection foreign-key enforcement rejects the orphan with 787.
- CHECK, FK, NOT NULL, strict datatype and primary-key failures have codes 275, 787, 1299, 3091 and 1555. The duplicate leaves the earlier decrement active at five; explicit whole-transaction rollback restores six and retains one R1 reservation.
- Numeric text losslessly becomes integer 2000. The int64 maximum round-trips; the next Python integer raises OverflowError. UTC text, NULL, JSON extraction and ASCII-versus-Unicode NOCASE results match the article. Legacy SELECT/INSERT transaction state also matches.
- A second connection and separate child process receive BUSY while the writer is held; a fresh attempt succeeds after release. The separately scheduled child release permits a waiting attempt to succeed. These are scheduled mechanism observations, not a production latency distribution.
- The reader sees six before and after another connection commits five, then receives extended 517 immediately while retaining an active transaction. This requires restarting the decision, not merely increasing the wait.
- Pinned-reader PASSIVE returns (0,8,0). Independently recomputed the 32,992-byte WAL as its 32-byte header plus eight 4,096-byte pages and frame headers. Ending the reader permits TRUNCATE (0,0,0), zero bytes; automatic checkpoint policy is restored.
- Backup/reopen retains exactly the reservation values, stock six, nine committed events, integrity ok and no FK violations. Killing the exact uncommitted child preserves the nine expected committed event identities and omits the unfinished one. The additive schema/default and user_version survive reopen.
- Read-only URI rejects with 8. Page-budget failure returns FULL 13, aborts the tested transaction, leaves zero payload rows and preserves integrity. Rollback-journal COMMIT returns BUSY with the write transaction active; the same COMMIT succeeds after the reader ends.

The private root contained no database or cache directories after the worksheet exited. Independently checked no matching main/child process remained, retained evidence and removed the exact own script/output directory. No global settings, installed software or existing databases changed.

## Primary contracts and evidence limits

Checked primary [WAL documentation](https://www.sqlite.org/wal.html), including the documented reset-race fix screen; [transactions](https://www.sqlite.org/lang_transaction.html), [isolation](https://www.sqlite.org/isolation.html), [busy handling](https://www.sqlite.org/c3ref/busy_timeout.html), [checkpoint API](https://www.sqlite.org/c3ref/wal_checkpoint_v2.html), [PRAGMA durability matrix/scopes](https://www.sqlite.org/pragma.html), [STRICT](https://www.sqlite.org/stricttables.html), [foreign keys](https://www.sqlite.org/foreignkeys.html), [backup](https://www.sqlite.org/backup.html), [file hazards](https://www.sqlite.org/howtocorrupt.html) and the [Python driver contract](https://docs.python.org/3.14/library/sqlite3.html). Observed behaviour and the documented guarantees agree. Python's online reference is a later 3.14 patch; the article correctly labels the actual executed patch separately.

WAL persistence is separated from per-connection foreign-key/sync/busy initialisation. FULL versus NORMAL is a documented contract subject to the actual storage sync implementation. A killed process is explicitly distinct from OS failure, power loss and lost volume; fullfsync zero is not presented as a proven flush path. The local backup clock excludes provisioning/remote transfer and production service recovery. READONLY and max_page_count tests are not passed off as OS permission denial or physical disk exhaustion.

## Working models and snapshot integrity

Walked **all 36 rendered states, six figures and 12 choices** on immutable 4438. Compared every event, lane, chip, result and narration with source and native/documented boundaries. Direct multi-host WAL is rejected; a local backup does not claim host survival. Deferred readers retain their old snapshot until transaction restart. Incomplete PASSIVE progress is distinct from its zero busy flag. FULL/NORMAL assumptions stay conditional. Duplicate statement rejection does not undo earlier transaction work. The wrong-handler commit, power failure and unsafe-file-copy branches are clearly labelled illustrations; none is an executed adoption result. No branch converts local restore into production recovery acceptance.

The supplied verifier passes. All four component hashes match B38; article snapshot equals rendered source. No article/component edits, evidence overwrites, shared builds or Git actions. Browser download was not activated. Own review tab closed and port 4438 released.
