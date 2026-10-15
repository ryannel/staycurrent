# Independent technical and media review: capabilities and distribution

15 October 2026. Reviewer: the core-chapter author, who did not author these six
pages. This is an informed technical/media review, not the separate uncued reading.
I did not read that reader's log before recording these findings. No article or
lesson source was edited and no observed experiment output was overwritten.

## Judgment

The six chapters provide substantive mechanisms and useful changed-condition
reasoning. I found no consequential factual or SQL-contract blocker in the checked
material. There is one small rendered-media repair and one evidence-note correction
below. The acceptance is bounded by the explicit experiments: Citus distributed
execution and failover-slot configuration are source-backed explanations; the
server tests establish actual PostgreSQL, pgvector and PostGIS behaviour for their
fixtures, not deployment performance or production recovery guarantees.

## Actionable findings

1. **Vector figure label intersects the axis.** In
   `src/components/explainers/pg-capability-vector.astro`, the x-axis runs to x275
   at y240 while the `1 = query` text begins x248 with baseline244. The line visibly
   crosses the label in the final 390px light and dark captures. Move the label
   above or below the axis while retaining the separate x=1 marker, then inspect
   the revised figure. This is a local legibility repair; the point coordinates
   and nearest-eligible explanation are correct.
2. **Spatial evidence note overstates the duplicate-room case.**
   `capabilities/evidence.md` says two qualifying North rooms do not duplicate its
   result. The executed download inserts North rooms with12 and6 seats and tests
   seats>=8, so only the12-seat room qualifies. The article and actual query are
   correct. Correct the evidence statement, or explicitly execute a changed fixture
   with two qualifying rooms before recording that observation. No SQL change is
   needed to substantiate the article's ordinary EXISTS semantics.

Both findings were sent to the coordinator before this record was finalised.

## Technical and learning assessment by chapter

### Replication

The read path is causal: receiver progress reaches a marker while replay and price
remain old; resume permits a fresh snapshot to see25. The subsequent26/27 tests
separate durable remote flush from remote_apply, including the observed SyncRep
wait. The caller contract states autocommit, a marker after commit, a new snapshot
and a timeout branch. It also keeps numeric LSN comparison tied to lineage.

I matched the physical evidence's11 recorded states with the prose, including
lost acknowledged35, promoted27, rewind/rejoin27 and later replicated30. The
logical evidence's8 observations substantiate filtered copy, crossing out/back in,
sequence non-advancement, a uniqueness conflict repaired by removing the local
conflict, and a missing-target update skipped before a later insert arrived.

The page explains why copying rows does not transfer write authority. Stopping A
is accurately identified as the experiment's fencing, and rewind is explicitly
not a business-operation merge. Slot retention, feedback and failover readiness
extend the mechanism without pretending those exact settings were all run.

Primary checks included PostgreSQL18 [hot standby](https://www.postgresql.org/docs/18/hot-standby.html),
[row-filter transformations](https://www.postgresql.org/docs/18/logical-replication-row-filter.html),
[logical conflicts](https://www.postgresql.org/docs/18/logical-replication-conflicts.html),
[pg_rewind](https://www.postgresql.org/docs/18/app-pgrewind.html), and
[failover readiness](https://www.postgresql.org/docs/18/logical-replication-failover.html).
No correction required to the checked operational claims.

### Sharding

The chapter preserves three different layers: native local children, FDW's remote
transactions and Citus ownership/planning. Its tenant fixture derives the wrong
four-row join before giving the complete identity and one-worker route. The
partial-sum variation changes the work to two owners without changing arithmetic.

The important two-phase distinction is correct: durable completion of the chosen
outcome does not make worker snapshots simultaneous. I checked the tagged Citus
14.2 architecture and adaptive-executor source; it describes both the anomaly and
the activation when modifying work expands to another connection. The schematic
prepare/decision/commit diagram follows that evidence. The article explicitly
states that Citus was not run, which is essential to interpreting the examples.

I also checked the surprising FDW claim directly: a local Read Committed
transaction uses remote Repeatable Read, and remote prepare for two-phase commit
is unsupported. The column/partition/distribution-key restrictions are connected
to the authority needed to enforce a constraint, rather than merely listed.

Sources: [Citus14.2 technical architecture](https://raw.githubusercontent.com/citusdata/citus/v14.2.0/src/backend/distributed/README.md),
[tagged executor](https://raw.githubusercontent.com/citusdata/citus/v14.2.0/src/backend/distributed/executor/adaptive_executor.c),
and [PostgreSQL18 FDW transaction management](https://www.postgresql.org/docs/18/postgres-fdw.html#FDW-TRANSACTION-MANAGEMENT).
Movement and restore remain implementation explanations, with no claimed live
migration measurement.

### JSON

The small record table contains everything needed to derive1/4 containment and
product2's independent-versus-same-offer mismatch. The same-offer filter preserves
seller/price association. JSON_TABLE then gives a concrete four-row intermediate
and one-row filtered result, including the difference between conversion errors
and missing values. That is genuine query reasoning, not a function inventory.

I inspected the imported SQL constants and preserved server/browser results.
The guarded numeric expression excludes the string without throwing, and the
write constraint permits absence while rejecting present string/JSONnull. The
attributes column is NOT NULL and object-checked in setup, closing the otherwise
important SQL-NULL escape. The repair restores the known number before enforcing
the invariant. Whole-object versus extracted-tags index matching is accurately
scoped to the actual expression.

The [PostgreSQL18 JSON reference](https://www.postgresql.org/docs/18/functions-json.html)
confirms extraction, path error suppression and JSON_TABLE policies. No required
repair found.

### Full-text search

The positions figure preserves the stop-word gap, and the three query outputs are
derivable from positions1/3. The stored title/body vector, field-boundary caveat,
tenant/publication filter and ranking have distinct jobs. The application still
binds search input and supplies established tenant identity. Its update changes the
stored vector in the same row change; the page does not claim a separate search
worker or automatic spelling correction.

I checked the SQL constants and corpus evidence against the visible table and
normalisation/ranking explanation. The larger50-match GIN example is kept separate
from the readable corpus. PostgreSQL's [text-search controls](https://www.postgresql.org/docs/18/textsearch-controls.html)
and [index information](https://www.postgresql.org/docs/18/textsearch-indexes.html)
support the weight and recheck distinctions. No required repair found.

### Vector search

The four-point arithmetic is correct and derives why filtering after a global
limited candidate list can underfill an eligible answer. The browser is clearly
labelled an arithmetic model. The actual extension experiment fixes data, query
and eligible baseline before creating HNSW. I inspected the downloaded script and
preserved plans/results:40/off gives0,200/off is an exact sequential path with10/10,
and40/strict returns10 with9 exact hits. The article does not misattribute the
middle result to improved graph recall.

The explanation distinguishes graph exploration, metric/operator-class matching,
returned-distance order, exact-set recall and semantic relevance. The revision
conditional UPDATE includes the caller's zero-row branch and the stale interval.
Tagged [pgvector0.8.7 documentation](https://raw.githubusercontent.com/pgvector/pgvector/v0.8.7/README.md)
confirms filter-after-scan behaviour, iterative limits and strict ordering. No
semantic model was measured; the chapter says so. Only the axis-label repair above
is required within this review's scope.

### Types and extensions

The finite nonempty range constraint handles empty, unbounded and explicit
infinite endpoints. Half-open adjacent example intervals correctly share no point.
The exclusion constraint combines room equality with overlap, and the handler's
23P01 branch is explicit. The recorded two-connection lock wait and rejection
substantiate the concurrency claim independently of the one-connection lesson.

The temporal example derives coverage across two rows and shows why one day of
missing coverage fails. [PostgreSQL18 CREATE TABLE](https://www.postgresql.org/docs/18/sql-createtable.html)
confirms combined PERIOD coverage and WITHOUT OVERLAPS requirements. Spatial
coordinates, metre distances, eligibility and candidate counts match the preserved
PostGIS output:189 candidate rows minus66 distance failures equals123. The
[PostGIS geography contract](https://postgis.net/docs/manual-3.6/ST_DWithin.html)
uses metres with spheroidal distance by default. ST_SetSRID is properly described
as declaration rather than transformation. Installation, enablement and database
extension updates remain distinct. Correct the evidence note above; the article's
checked claims stand.

## Rendered media inspected

I inspected source for every diagram and cropped the coordinator's final390px
light captures at native width: JSON expression/posting diagram, text positions,
vector plane, and booking ranges. Also inspected final390px dark text/vector
figures. The first three readable fixtures and captions keep exact results apart
from schematic representations. The range diagram's endpoints and overlapping
interval are legible on phone.

For distribution I inspected the author-produced figure crops for phone physical
flow and phone dark two-phase commit, desktop dark placement and desktop light
failover. Their visual order, captions and state labels agree with current source.
The coordinator's final replication/sharding report has8 combinations, all status200,
no reported page errors, failed images or horizontal document overflow. I did not
run the capture script or claim an exhaustive independent24-view inspection.

## Scope limits and handoff

Read all six page sources, imported SQL/module definitions relevant to their
examples, diagrams, research and author evidence; inspected preserved native and
browser outputs and the two downloadable server scripts. Reopened consequential
primary references/versioned source as listed. Did not rerun full native suites,
change a live cluster, benchmark a deployment, test Citus itself, or verify a
managed-service extension allowlist. Final integrated browser operation, full
light/dark desktop/phone inspection, repairs and build remain coordinator-owned.

The explanation is sufficiently deep for this commission within those boundaries:
readers can derive an outcome, predict a changed condition and identify which
process, representation or owner makes the difference. Further operational or
semantic-quality experiments would be separate investigations, not prerequisites
silently supplied by this acceptance.

## Repair verification and final disposition

Inspected the revised vector figure captures at 390px and 1280px in both light
and dark themes under `/private/tmp/postgresql-rebuild-figures/`. The `1 = query`
label now sits below the horizontal axis with clear separation from the `x = 1`
label. Point 3's label also clears the diagonal guide. The repair preserves the
point coordinates, distances and teaching meaning; all four inspected variants
are legible. This closes the vector media finding.

Verified the capabilities evidence correction: North has rooms with 12 and 6
seats, and only the 12-seat room satisfies the eight-seat requirement. The note
now describes that observed fixture accurately and retains the general meaning
of EXISTS without claiming an unobserved two-qualifying-room variation. This
closes the evidence finding.

Final judgment: accepted within the checked scope above, with no outstanding
technical or media findings from this review. The coordinator owns the final
integrated build and complete browser-state matrix.
