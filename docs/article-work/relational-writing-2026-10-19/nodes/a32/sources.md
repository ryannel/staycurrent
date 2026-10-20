# a32 source and evidence record

Checked 20 October 2026. Primary sources only. The article is an optional SQLite
candidate check under a08, parallel to a34; it does not create specialist branches.
The actual a08 rejects its three-host direct-file arrangement. This article keeps
that rejection and explicitly varies the deployment for a disposable prototype.

## Documentation and claim map

- [SQLite WAL](https://www.sqlite.org/wal.html): standard same-host contract,
  one writer, persistent WAL mode, sidecars, checkpoint policy and the WAL-reset
  fix qualification (3.51.3 and later; named older backports). Loaded 3.54.0
  passes that version screen. System CLI 3.51.0 is not the test engine.
- [Transactions](https://www.sqlite.org/lang_transaction.html) and
  [isolation](https://www.sqlite.org/isolation.html): immediate/deferred write
  acquisition, old read snapshots, SQLITE_BUSY_SNAPSHOT, implicit statements,
  explicit transaction and error state. Ending a stale transaction and repeating
  its reads is different from simply waiting longer.
- [Busy timeout](https://www.sqlite.org/c3ref/busy_timeout.html): one handler per
  connection, waiting is bounded policy rather than a promised future operation.
- [Checkpoint API](https://www.sqlite.org/c3ref/wal_checkpoint_v2.html): PASSIVE
  does not invoke the busy handler; returned counts describe incomplete work;
  TRUNCATE completes restart and truncation when no readers prevent it.
- [PRAGMA](https://www.sqlite.org/pragma.html), especially foreign_keys,
  synchronous, journal_mode, fullfsync, checkpoint_fullfsync, wal_autocheckpoint
  and max_page_count. WAL+FULL versus NORMAL acknowledged survival; DELETE+EXTRA
  directory sync; per-connection initialisation. [Atomic
  commit](https://www.sqlite.org/atomiccommit.html) supplies storage assumptions.
- [STRICT](https://www.sqlite.org/stricttables.html): restricted type names,
  lossless coercion, datatype rejection; strict primary-key non-null behaviour.
- [Foreign keys](https://www.sqlite.org/foreignkeys.html): enable and verify per
  connection outside transactions. [Types and
  collations](https://www.sqlite.org/datatype3.html): integer/real/text contracts,
  absence of native fixed-scale decimal semantics, ASCII-only built-in NOCASE.
- [Backup API](https://www.sqlite.org/backup.html): completed consistent copy to
  another database. [Corruption hazards](https://www.sqlite.org/howtocorrupt.html):
  unsafe file handling, separating main database and WAL, locking assumptions.
- [Result codes](https://www.sqlite.org/rescode.html): busy, stale snapshot,
  constraint, read-only and full errors, including extended numeric values.
- [Python 3.14 sqlite3](https://docs.python.org/3.14/library/sqlite3.html): Python
  driver threading defaults, runtime SQLite identity, autocommit modes, bindings,
  backup method, errors and transaction-state observation. Online documentation
  served 3.14.8 at research time; execution was pinned to installed 3.14.5. No
  later minor-version behaviour is inferred to be observed in that run.

## Actual run

Portable worksheet: `src/components/relational-next/a32/acceptance.py`. Final
article imports the worksheet with `?url&no-inline`. Run from repository root:

```sh
/opt/homebrew/bin/python3 src/components/relational-next/a32/acceptance.py > docs/article-work/relational-writing-2026-10-19/nodes/a32/evidence.json
node src/components/relational-next/a32/verify.mjs
```

Raw final stdout is `evidence.json`; it records UTC execution time, actual
executable, source ID, every compile option, platform, settings, errors and small
timings. Python 3.14.5 loaded SQLite 3.54.0, source ID dated 9 October 2026.
macOS 26.6.2 arm64; private directory mode 0700 under the system temporary root.
No global install, existing database, network service or production path used.

Observed cases:

- WAL+FULL, foreign keys on, 80 ms busy setting, auto-checkpoint 1,000,
  page size 4,096; effective values verified on a fresh second connection.
  fullfsync and checkpoint_fullfsync both zero.
- CHECK 275, FK 787 on both initial and new connection, NOT NULL 1299,
  strict datatype 3091 and primary-key 1555 rejection. Driver called 3091
  `unknown`; article uses the numeric code rather than inventing driver mapping.
  Valid row round-tripped; numeric text 2000 became integer; int64 maximum
  returned exactly; next integer raised Python OverflowError. NULL/time text,
  ASCII/Unicode NOCASE and JSON extraction inspected through binding/results.
- Duplicate statement left earlier decrement at five in an active transaction;
  explicit rollback restored six. One R1 reservation remained. The wrong-handler
  figure branch is illustrative, not an executed adoption observation.
- Two independent connections, then separate child process, met busy while
  another held the writer. New attempt after release succeeded. A second child
  released while parent waited, allowing a bounded wait to succeed. Wall times
  are raw, not p99 or throughput evidence.
- Reader retained six across another writer's commit to five, then failed its
  attempted upgrade with code 517. Harness restored its invariant fixture.
- Reader-pinned WAL: eight commits yielded `(0,8,0)` PASSIVE and 32,992 bytes;
  ending reader allowed TRUNCATE `(0,0,0)` and zero bytes. Auto-checkpoint was
  disabled only for this bounded case, then restored.
- Rollback-journal comparison: reader delayed writer COMMIT; busy retained active
  transaction; same COMMIT succeeded once reader ended.
- Backup API destination reopened separately; ordered reservations and inventory
  matched, structural/FK checks passed, nine committed event rows present.
- Own child killed after readiness with uncommitted event; reopen omitted that
  event and retained nine committed ones. Added status/default and user_version
  committed, reopened and verified. Read-only URI returned READONLY 8. Separate
  page-count budget returned FULL 13 and retained zero payload rows with integrity
  `ok`.

## Limits and cleanup

All six figures are explanatory schedules, with observed fixture facts labelled.
The three-host rejection and settings semantics are documented, not an attempted
network-filesystem deployment. No physical disk full, I/O fault, power loss, host
loss, container restart, remote restore, production skew/load, full application
replay path, old/new image coexistence or device-sync guarantee was tested.

The backup clock covers tiny local copying, reopen and checks only. Both copies
shared one host. It establishes no production recovery point/time. FULL's sync
contract on this macOS storage remains unverified, especially with fullfsync off.

Every test DB was created inside the worksheet's private TemporaryDirectory and
removed after connections closed. Every spawned child was terminated normally or
killed by exact process handle and reaped. No own background process, fixture,
bytecode cache or separate dependency installation remains. Only worksheet and
raw evidence are retained.
