# PostgreSQL core chapters: evidence and author review

15 October 2026. Scope: architecture, query execution, indexes and recovery. This
record supports the rebuilt chapters; earlier relational-completion approvals do
not stand in for their new independent review.

## What the chapters must teach

Architecture follows one request across process, index/heap address, buffered page,
snapshot-selected version, coordinated replacement, durable WAL and cleanup. Its
older-report and waiting-writer outcomes must be derivable in the main article.
Query execution adds parameter-sensitive planning, executor demand and resource
multiplication rather than repeating the family join-method chapter. Indexes derives
candidate precision from each representation. Recovery distinguishes page redo
from transaction visibility using an actual crash experiment.

## Executed evidence

All server runs use PostgreSQL 18.6. The shared authoring server was neither stopped
nor reconfigured. Ordinary labs use dedicated database `pg_core_lab` through the
local Unix socket. Scripts use the locally installed Node pg driver. They record
plans, results and semantic assertions, not benchmark claims.

- `architecture-lab.mjs` / `architecture-observed.json`: product7 starts at3,
  primary-key Index Scan returns one row, old Repeatable Read snapshot continues
  seeing3 after writer commits1, new read sees1, tuple location changes. Competing
  guarded updater waits on transactionid, then returns zero after the winner
  commits. Final stock1.
- `architecture-variations.mjs` / `architecture-variations.json`: Read Committed's
  second statement sees1; with the first writer rolling back, the waiting guarded
  updater successfully returns1 from the original3. Polling confirms it really
  waited before rollback.
- `query-lab.mjs` / `query-observed.json`: custom small tenant Index Scan50; large
  tenant Sequential Scan45000; generic Index Scan estimates495 for both. Unordered
  top-five consumes50000 scan rows; ordered path produces5. A 64KiB full sort spills.
- `index-lab.mjs` / `indexes-observed.json`: GIN intersection40 and union240; ordered
  event BRIN bitmap path vs identical scattered table Sequential Scan. Logical
  answer60 for either minute query. Actual first-range bounds recorded as timestamp
  text to avoid client timezone conversion. PG18 later-column search with three
  leading tier values produces one row and reports four Index Searches.
- `recovery-lab.mjs` / `recovery-observed.json`: creates its OWN unique temporary
  cluster, uses Unix socket only, immediately stops and restarts it, then cleanly
  stops and removes it. Stock table file SHA256 remains unchanged from initial
  checkpoint through committed row1 update and pending row2 update. A separate
  committed marker flush covers the pending update's WAL position. After immediate
  shutdown recovery returns row1=1 and row2=3. Logs establish redo occurred. Captures
  insertion/write/flush positions, buffer page LSN, and one FPI/216 measured WAL
  bytes. This is process-crash recovery, not a power-loss or torn-page simulation.
- `verify-browser.mjs` / `browser-observed.json`: executes all literal SQL steps via
  PGlite raw simple-query protocol, preserving batch transaction semantics. Three
  lessons, nineteen steps, all ReadyForQuery I, zero errors. Assertions verify
  counts, custom/generic routes, scan input, no extra sort with ordering index,
  modulo filter rejection, spill/memory variations, GIN combinations and BRIN
  placement difference. No helper query precedes a claimed literal plan.

The browser’s filtered ordered scan rejected2619 entries before returning five.
Its full sort used external merge at64KiB and quicksort at32MiB. These observed
mechanisms support the lesson; precise time and buffer values are not production
performance predictions.

## Primary sources and claim boundaries

- PostgreSQL18 tutorial architecture, query-path, executor: backend/session,
  parse/analyse/rewrite/plan phases and demand-driven node execution.
- `storage-page-layout`, `ddl-system-columns`, `transaction-iso`, `storage-hot`:
  page/item indirection, system-column meaning, snapshots/update rechecks and HOT
  eligibility. S/W visibility figure is a labelled simple case, not a full xmin/xmax
  implementation or numeric-ID algorithm.
- `sql-prepare`: custom/generic planning, five initial custom executions in auto,
  cost comparison and invalidation. Forced modes are diagnostic controls.
- `runtime-config-resource`, `parallel-plans`, `using-explain`, `release-18`:
  operation-level allowances, hash multiplier, worker/shared-state distinctions,
  plan measurement caveats and supported asynchronous I/O paths. `release-18.html`
  verified to resolve. Browser examples make no parallel capacity claims.
- `btree`, `indexes-ordering`, `indexes-multicolumn`, `indexes-opclass`, `gin`,
  `brin`: representation and operator contracts. GIN array overlap/containment
  derive exact candidate-set arithmetic; lossy bitmap precision is a separate
  cause of rechecks. Native PG18 skip scan is explicitly server-observed.
- `wal-intro`, `wal-internals`, `functions-admin`, `wal-configuration`,
  `wal-async-commit`, `wal-reliability`, `runtime-config-wal`, `continuous-archiving`:
  WAL progress, required ordering, checkpoints/FPI, asynchronous acknowledgements,
  reliable flush assumptions and base backup/WAL/timeline requirements.
- PostgreSQL `REL_18_STABLE/src/backend/access/transam/xlogutils.c`:
  XLogReadBufferForRedoExtended and its caller contract compare pageLSN with record
  end and separately restore applicable full-page images. Diagram explicitly
  bounds the comparison to ordinary page redo and one WAL history.

Sources are linked at the relevant article passages. Figures use semantic HTML or
SVG with explanatory captions, theme variables and phone layouts/scroll regions.

## Author review and checkpoint repairs

The coordinator accepted the main depth checkpoint and requested two reader-flow
repairs. These are now applied after that captured draft:

1. Architecture now shows the exact reservation UPDATE before the R/W/N schedule;
   the later competing-writer section reuses it in its application decision context.
2. Its final section offers three substantive paths: internals, distribution and
   richer queries, distinguishing native features from extension/distributed work.
3. Query execution now gives the priority formula in visible prose before the
   top-five query, so the five expected IDs can be derived without opening setup.
4. Indexes' obsolete GIN subpage links now target the merged PostgreSQL18 GIN page.
5. Demand diagram now uses existing site theme variables and labels downward row
   flow; its earlier opposite request arrow was misleading for the top-down drawing.

Self-reading check: each major mechanism has an input, a causal derivation, an
observable result and a changed-condition consequence. Remaining editorial and
visual acceptance belongs to the coordinator's uncued reader and assembled-page
checks. No build or commit performed by this author; coordinator owns both to avoid
races in shared dist output during independent reading.

Independent first-reader repair: the query opening now explicitly maps tenant0 to
45000 and tenants1–100 to50 before the custom-plan prediction. The GIN figure's
key/reference columns now have an explicit gap and a wider key column, so urgent
does not run into its posting list. Awaiting coordinator render inspection.

Final author handoff: source explicitly discloses the native query lab's serial
plan setting and how to reset it. Durability figure now places committed outcome
outside the heap-page box, avoiding an implication that commit rewrites a tuple
header with that outcome. Coordinator owns final build, screenshots, media review,
independent technical judgment and publication. No further author tools are running.
