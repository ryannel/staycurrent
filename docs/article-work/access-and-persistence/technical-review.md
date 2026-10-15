# Technical review: access and persistence drafts

Reviewed 15 October 2026. Independent informed review of `indexes.astro`,
`query-execution.astro` and `storage.astro`, their seven figure components, SQL
fixtures and author evidence. No other reviewer reports were read. No article
or experiment files were edited by this reviewer.

The technical argument and observed SQL results support the commissioned reader
outcomes. The assembled baseline needs one figure repair before I would call the
whole batch ready as a draft. The remaining issue is visible at desktop width;
the page-level overflow checks do not detect it. Publication is outside this review.

## Findings

### Repair: preserve the page-transfer step on desktop

In `browser/storage-1280-light-figure-1.png` and its dark equivalent, the arrow
and most of “Read page 12” disappear between the two page boxes. Only “Read” is
visible beside the right box. The phone image displays the whole downward arrow
and label correctly. The central operation in this figure is the transfer of a
page from its table file into shared buffers; obscuring it removes the pictured
connection between the two copies.

Location: `src/components/explainers/storage/PageRead.astro`, the `.read-route`
grid and `.transfer` element. Smallest repair: keep the transfer element within
the grid's middle track and ensure the arrow and label fit without the sheet
covering them. Re-render the desktop figure in both themes and retain the phone
layout. No change to the physical-storage explanation is needed.

### Resolved in source: state how to execute the complete index experiment

The initial article allowed a query editor and linked the complete experiment
without explaining its statement boundaries. Sending the whole download as one
request fails at `VACUUM`, which cannot run in a transaction block. I reproduced
SQLSTATE 25001 with the installed PGlite runtime. The author evidence already
knew this limitation, but it was initially absent from the reader's instructions.

During this review, `indexes.astro` gained instructions to use `psql -f
experiment.sql`, or execute statements individually with autocommit enabled,
plus the explicit VACUUM restriction. This is the appropriate small repair.
The source is resolved; the initially supplied browser artifact predates it.
See the PostgreSQL 18 [VACUUM reference](https://www.postgresql.org/docs/18/sql-vacuum.html)
and [multiple-statement protocol rules](https://www.postgresql.org/docs/18/protocol-flow.html#PROTOCOL-FLOW-MULTI-STATEMENT).

### Optional clarification: the broad-plan arrow represents retained state

`PlanFlow.astro` says every arrow carries rows into the next operation. The
broad route's “10,000 IDs available” arrow actually represents the hash table
available while a separate scan supplies 30,000 lines. Its stage labels and
surrounding prose make the correct interpretation recoverable, so this is not
a technical blocker. “The arrows follow the stages of work” would avoid teaching
that the line scan consumes the orders as its row input. No more detailed join
diagram is necessary for the page's stated outcome.

## Independent execution

I used a fresh in-memory PGlite instance, extracted SQL constants from the current
article sources, and loaded the provided fixtures. This did not rewrite the
authors' observation records. The engine reported PostgreSQL 18.3, PGlite 0.5.8.

The index experiment reproduced:

- 15 matching rows and 59,985 rejected rows in the baseline table scan.
- 60 customer-index candidates, with 45 rows rejected by the date filter.
- The composite index's ten returned rows and removal of the sort.
- Two rejected pending candidates before ten paid orders were emitted.
- Ten heap fetches before vacuum and zero after it for the covering index.
- An index-only scan over 54,000 rows for the broad sum.
- The ten printed order IDs, followed by 60,900 remaining rows after the writes.

The execution experiment reproduced the natural narrow plan, with two sorts,
30 joined rows and an inner scan emitting three rows over ten loops. The broad
plan used two sequential scans and a hash join emitting 30,000 rows. The forced
merge plan used both primary-key indexes. Dependency statistics changed the
correlated-filter estimate from one to ten while the actual count stayed ten.
The restricted-memory listing used external merge with 544kB of temporary sort
space. These observations agree with the displayed counts and plan shapes.

I inspected the storage SQL verifier and its limited claims. I did not crash a
server, test storage failure, or establish hardware durability. The storage
figures correctly present documented histories rather than experimental output.

## Technical assessment

**Indexes:** The article gives enough mechanism to derive a candidate from the
customer equality, date range, required order and early limit. It separates index
navigation from heap access and remaining filters, and explains why INCLUDE
does not guarantee zero heap visits. Maintenance, width, write workload and
constraint purposes make the cost discussion practical. Its PostgreSQL 18 skip
scan qualification avoids an obsolete absolute leading-column rule. Reviewed
against [multicolumn indexes](https://www.postgresql.org/docs/18/indexes-multicolumn.html)
and [index-only scans](https://www.postgresql.org/docs/18/indexes-index-only-scans.html).

**How a query runs:** The worked result, plan multiplicities, two distinct sort
purposes, forced merge alternative and missing dependency statistics all agree.
The example keeps startup/total cost, output rows, loops and elapsed time distinct.
The broader report has three output groups despite 30,000 inputs; the memory
example deliberately switches to a detailed listing. Reviewed against
[Using EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html) and
[planner statistics](https://www.postgresql.org/docs/18/planner-stats.html).
No material technical repair is required.

**Storage and durability:** The prose correctly distinguishes buffered bytes,
durable WAL, transaction status, visibility and acknowledgment. The recovery
example permits unfinished physical changes without exposing them as committed
results. The checkpoint explanation uses the redo position rather than treating
completion as an instantaneous snapshot. Synchronous local commit, asynchronous
loss, unlogged tables, fsync corruption risk and lost-storage recovery are bounded
appropriately. Reviewed against [WAL](https://www.postgresql.org/docs/18/wal-intro.html),
[asynchronous commit](https://www.postgresql.org/docs/18/wal-async-commit.html),
[WAL configuration](https://www.postgresql.org/docs/18/wal-configuration.html) and
[WAL settings](https://www.postgresql.org/docs/18/runtime-config-wal.html).

## Rendered scope and limits

I visually inspected all seven figures: desktop light versions of the index
route, plan comparison, page read and crash histories; phone dark versions of
the composite order, merge walk and commit sequence. I additionally checked the
desktop dark and phone light page-read figure, plus the phone light index route.
The other semantic mappings are consistent: eight index entries reference the
same eight heap rows; customer groups retain their own descending dates; merge
joining preserves all three lines per order; cases B and C share a recovered
price while differing in the application's knowledge.

This was not a new browser capture or exhaustive accessibility audit. The
coordinator supplied the rendered artifacts and page-level layout results.
Execution checks do not establish production latency, write amplification,
concurrent server behavior or crash durability. The articles make those limits
explicit. The coordinator should recheck the repaired figure before recording
the batch as ready as a draft.

Coordinator handoff received after the baseline review: the page-transfer
collision came from an inherited fixed width on `.transfer`; the element has
been renamed. The coordinator also reports clarifying the phone index route's
selected leaf and revising the plan-flow caption. The baseline findings above
are preserved. I have not yet inspected the replacement screenshots, so this
record does not claim rendered verification of those repairs.

## Bounded rendered recheck and final verdict

Rechecked the replacement artifacts under `final-browser/` on 15 October 2026.
The earlier findings and initial inspection limits above remain the record of
the baseline; this recheck closes the outstanding figure repair.

I inspected `storage-1280-light-figure-1.png` and its dark counterpart, plus
both 390px phone versions. The desktop arrow and complete “Read page 12” label
are now visible between the two sheets. The phone layout retains the downward
arrow and complete label between the stacked sheets. The physical transfer is
clear in all four checked images.

I inspected the revised plan comparison at desktop light and phone dark sizes.
Its caption now distinguishes rows from a prepared lookup passed to the next
stage, resolving the optional semantic concern. The counts and operation labels
remain readable. The phone light index-route figure now explicitly says that
the root selects B and skips A and C, and labels B as selected; it no longer
invites following the root arrow into the first, unvisited leaf.

**Final technical verdict: ready as a draft.** No material technical or media
issue remains from this review. SQL was unchanged and was not rerun for these
rendering repairs. This verdict covers the factual claims, practical outcomes,
independently executed examples and bounded visual checks described above. It
does not replace the other editorial readings or authorize publication.
