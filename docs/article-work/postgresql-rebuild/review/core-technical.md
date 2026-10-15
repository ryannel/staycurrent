# Core PostgreSQL technical and media review

Reviewed 2026-10-15 by an independent reviewer who did not author these five pages. This review was completed without consulting the collection's fresh-reader log.

## Judgment

The five pages are technically sound within their stated PostgreSQL 18 scope. I found no blocking factual error, incorrect SQL result, unsupported central mechanism, or misleading diagram relationship. The server observations support the explanations, and the browser lessons distinguish their scope from real concurrent connections, storage durability and restart testing. There is one small reproducibility improvement below; it does not undermine the explanation or the recorded result.

This is an informed technical and media judgment, not the separate uncued first-reading judgment or an authorization to publish.

## Finding

**P3 — Put physical inspection at an explicit point in the two-connection schedule.** In `row-versions.astro`, “Keep an older reader open” presents all six steps, including ending A and repeating vacuum, before introducing the `pageinspect` query and explaining what it returns before the report ends. Someone executing the page in order will already have removed the old payload when they reach the query. The explanation correctly describes both states, but the practical sequence should say to inspect after step 5 and again after step 6, or introduce that inspection before the schedule. No new experiment is needed: `heap_with_reader` and `heap_without_reader` already record the two states.

## Checked scope and evidence

Read the complete current sources for architecture, query-execution, indexes, row-versions and recovery; the complete lesson definitions in `postgresql-core.ts`, `postgresql-versions.ts` and `postgresql.ts`; and the diagram components used by those pages. Read the supporting lab scripts and evidence summary under `core/`, `versions-research.md`, the recorded server observations, and the snapshot lesson observations. Inspected the recorded browser result/error/status contracts for all 19 new core steps. I did not rewrite any observation file, alter author fixtures, repeat the isolated crash experiment, or run the integrated build. Root owns builds and integrated execution checks.

The local server observations identify PostgreSQL 18.6. Browser results establish the embedded runtime's behavior; they do not establish independent backend concurrency, OS cache durability or a physical restart. Exact IDs, locations, costs and plan shapes are fixture observations rather than portable guarantees. The prose generally makes those limits explicit.

### Architecture

The read path correctly separates B-tree search, a heap item identifier, the tuple and visibility. The recorded product 7 update moves its visible location from `(0,7)` to `(0,126)` while retaining product identity. The warm index scan reports three shared hits and zero reads; the article does not translate that into a universal count of disk operations.

The older report retains stock three after the writer commits stock one, while a fresh Read Committed statement sees one. The guarded competing stock update waits for the first writer, then returns zero after that writer commits. The rollback variation instead allows the waiting update to succeed. That is the documented Read Committed wait-and-recheck rule, scoped here to the guarded row operation. See [PostgreSQL 18 transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html).

The WAL explanation correctly separates a successful commit from writing the changed heap page. It does not suggest that an index itself supplies MVCC visibility or that every update must add a new entry to every index.

### Query execution

The 50,000-row fixture contains 45,000 rows for tenant zero and 50 for each of 100 other tenants. The recorded custom plans select an index scan for the small tenant and a sequential scan for the large tenant; the generic plan estimates 495 rows and reuses its parameterized index scan. Forced modes demonstrate alternative planning policies, rather than claiming that automatic mode must choose that generic plan. The automatic first-five-custom-plan explanation agrees with [PREPARE](https://www.postgresql.org/docs/18/sql-prepare.html).

For `priority = (id * 37) % 101`, the first five rows in priority/id order are 101, 202, 303, 404 and 505. A top-N sort must inspect the 50,000 unordered input rows despite retaining only five; the ordering index can stop after producing five eligible rows. The filter variation correctly demonstrates why rejected entries can require substantially more scan work. The recorded index-only scan's nonzero heap-fetch counter is acknowledged.

The 64 kB and 32 MB sort experiments change temporary spill behavior while preserving the answer. The illustrative ten requests × two operations × 64 MiB calculation is 1.25 GiB. It is qualified rather than presented as a server memory budget; hash multipliers, concurrent operations and parallel execution need additional accounting. See [resource consumption](https://www.postgresql.org/docs/18/runtime-config-resource.html). PostgreSQL 18 AIO is described as a capability affecting supported I/O paths, not as a performance result measured by these cached fixtures; that matches [the release notes](https://www.postgresql.org/docs/18/release-18.html).

### Indexes

Derived the event fixture's endpoint and newest-five IDs, and the tag result cardinalities: audit every 100 rows produces 200 matches, urgent every 250 produces 80, their intersection is 40 and their union is 240. These match the recorded plans. The broad common-key variation legitimately changes the useful access path.

The page distinguishes array GIN candidate combination, operator-specific rechecking and lossy bitmap pages. A `Recheck Cond` label is not treated as proof that this particular execution discarded false positives. JSON containment is tied to an eligible GIN operator class; arbitrary extracted-text equality is not claimed to use that same index. These distinctions agree with [GIN](https://www.postgresql.org/docs/18/gin.html).

The ordered and permuted BRIN fixtures hold the same timestamps. Their one-minute query returns 60 rows in either placement. The ordered run visits four lossy heap blocks and rejects 100 extra rows; the scattered run scans the relation and rejects 19,940. The page correctly attributes the difference to physical range summaries, not changed logical contents. The first four pages contain narrow ordered ranges versus widely spread timestamps. See [BRIN](https://www.postgresql.org/docs/18/brin.html).

The PostgreSQL 18 skip-scan example has three leading-key values and records four index searches. It explains repeated searches without interpreting the counter as four distinct key values or promising that later-column conditions always make a composite index efficient. This agrees with [multicolumn indexes](https://www.postgresql.org/docs/18/indexes-multicolumn.html).

### Row versions

The observed snapshot `784:786:784` is consistent with creator 783 committed, writer 784 still active at capture, and 785 already committed. After writer 784 commits, that saved snapshot still excludes its changes. The lesson's `pg_visible_in_snapshot` model is explicitly a snapshot-membership calculation, not a complete implementation of tuple visibility or an arbitrary transaction-status check. See [snapshot functions](https://www.postgresql.org/docs/18/functions-info.html#FUNCTIONS-PG-SNAPSHOT).

The heap evidence shows two normal tuples while the report remains open, then a redirect in slot one and the surviving heap-only tuple in slot two after cleanup. The index continues to reference `(0,1)`. Adding an included stock column removes HOT eligibility for changes to stock. The page correctly includes the same-page space condition and the exception for summarising indexes; see [HOT](https://www.postgresql.org/docs/18/storage-hot.html).

The nonzero `xmax` lock-only example, all-visible versus all-frozen distinction, retained creator number after freezing, and estimated nature of dead-tuple counters are all sound. In the freeze observation, `xmin` remains 784 while its flags mark it frozen and the visibility map becomes all-frozen. See [visibility map](https://www.postgresql.org/docs/18/storage-vm.html) and [vacuum and freezing](https://www.postgresql.org/docs/18/routine-vacuuming.html).

The two-doctor schedules substantiate the distinction between Repeatable Read's stable view and Serializable's dependency checking: zero remaining doctors under Repeatable Read, one serialization failure and one remaining doctor under Serializable. Retrying the entire transaction, including the decision, is the correct advice.

### Recovery

The isolated-server evidence records an acknowledged committed update with the heap file hash unchanged, a second uncommitted update whose WAL is flushed by another transaction, and restart results that retain only the committed business change. The page states the process-crash boundary; this experiment does not test power loss, a faulty storage device or an OS crash.

The article distinguishes inserted, written and flushed WAL positions and does not infer a committed transaction from the page LSN. The reported full-page-image and WAL-byte counts are local measurements. It treats full-page-image restoration separately from ordinary record redo.

The ordinary redo rule in the diagram agrees with `XLogReadBufferForRedoExtended`: a page already at or beyond the record position needs no ordinary redo; a later record needs it. The source has a separate image-restoration branch, which the caption acknowledges. See [PostgreSQL 18 redo source](https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/access/transam/xlogutils.c).

Commit durability, checkpoint purpose, the distinction between asynchronous commit and disabling fsync, and PITR's recovery of a historical database state are correctly bounded. The article does not promise preservation of later good transactions when recovering to before an earlier mistake. See [WAL](https://www.postgresql.org/docs/18/wal-intro.html) and [asynchronous commit](https://www.postgresql.org/docs/18/wal-async-commit.html).

## Media and lesson judgment

Independently captured every article figure at 390 px/light and 1280 px/dark, then inspected representative rendered images for all eight diagrams. Captures and dimensions are under `/private/tmp/pg-core-technical-media/`. All figure containers fit their article width. The architecture read-path drawing intentionally uses an accessible labelled, keyboard-focusable horizontal region at narrow widths; the other diagrams reflow their sequence. Labels and relational meaning remained readable in the inspected phone and desktop renderings.

The read-path arrows connect key to item slot to tuple; the two-version panels show two readers selecting from the same physical heap; the durability panels distinguish memory, persistent WAL and restored data; the executor diagram contrasts input consumption with output demand; GIN's set operations match its document lists; HOT preserves the original index target through a redirect; and the redo diagram explicitly uses schematic positions in one WAL history. I found no relationship that implies an incorrect mechanism.

The lessons' setup and changed-condition steps are internally consistent with their fixtures. The core recorded runs have no SQL errors and finish each step outside a transaction. The snapshot lesson's constructed IDs, creation/replacement interpretation and changed upper boundary produce the stated results. The existing visibility and WAL lessons identify what the embedded environment can reveal and what requires a separate server experiment. This review inspected their contracts and supporting records; it does not replace root's integrated all-lesson execution pass.
