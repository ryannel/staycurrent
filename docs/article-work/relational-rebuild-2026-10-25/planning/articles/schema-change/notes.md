# Planning record

Scope: detailed outline for `schema-change`, supplied assignment dated 25 October
2026. Read only the supplied workspace packet, its current skills and fixed
references, the permitted factual parent, and external primary sources. No
article body, implementation, build, server, review, commit or publication.

## Reference exposure

Read all 19 bounded parts separately with the supplied helper; every END marker
was delivered: sequences 1–6, indexes 1–7, storage 1–6. The helper validated the
packet hashes. Studied finished drawings in owned IAB tabs on port 4584 at their
existing system theme and viewport: Sequence diagrams, figure 6 (the same
messages in another order); Indexes, figure 8 (index-only scan and visibility
map); Storage and durability, figure 3 (where the old version of P7 waits).
Sequence and index/storage drawings were viewed with their surrounding prose,
captions, visible states and controls. No theme or viewport changes. All five
owned temporary reading tabs, including an initial duplicate, were closed.

The comparable teaching is a sequence whose ordering determines safety, a
present object whose presence is insufficient evidence, and a changed row with
two representations. Keep one small example and alter one cause at a time.
These are teaching comparisons, not prescribed figure designs. What needs to be
visible: accepted caller/schema/data combinations, the stale-worker ordering,
late arrival versus scan coverage, and the point where a return loses its old
data guarantee. The fresh writer chooses the drawings and final prose.

Read the complete rendered factual parent, [Diagnosing a database
incident](http://127.0.0.1:4606/review/relational-rebuild/slow-queries/), in an owned
tab. It establishes pressure diagnosis and bounded containment. Its live-change
section explicitly leaves compatibility, pause and return here; do not repeat
its pool, lock-chain or resource-diagnosis teaching. Parent examples remain
independent illustrative branches, not measurements of this migration.

## Approved example and protocol

The coordinator approved this independent scenario centrally during planning:

- Add nullable integer `products.price_hundredths`. Convert exact decimal
  `price * 100`, preserving the existing currency meaning without assigning a
  currency or introducing exchange rates. P3/P7/P9 start at 4.50/20.00/35.00 and
  become 450/2000/3500. Preserve the original non-negative range while return to
  `numeric(8,2)` is promised; the conversion is not a recommendation to replace
  decimal money universally.
- Reuse the separate P7 change 20.00→22.00 / 2000→2200 for the stale-worker race.
  A worker holding the earlier value must not write 2000 over 2200. A
  transformation can be idempotent for an unchanged input and still be unsafe
  against a concurrent writer.
- A separate late arrival is P11, Tea strainer, price 8.00 / 800 and stock 0.
  It is independent of import B17. Under an explicitly declared illustrative
  lexical ordering P11 sorts before P3, so its arrival after a cursor passes P3
  defeats a cursor-only completeness claim. Do not imply this text order is
  universal across collations.
- Core order 103 remains pending with agreed order-line total 29.00 and no
  payment. Post-103 stock remains P3 10, P7 0, P9 4. No order-line price changes.

Intended complete protocol, to keep the outline's gates coherent:

1. Expand while callers still read old `price`. New field initially permits
   missing values; old callers must tolerate the added schema. Do not promise
   that an additive DDL operation is operationally free.
2. Roll out bridge callers: old reads, both representations written atomically
   for relevant inserts/price changes. All writers of the migrated value must
   participate. Wait for old-only executables, queued jobs that run old code,
   and old in-flight transactions to finish or be fenced out.
3. Only after that barrier, backfill existing rows in bounded transactions.
   Prefer an atomic database-side computation from the target row's current
   source value, or a source-value comparison with conflict retry. A stale
   constant prepared outside that protection is the failure example. Native
   statement/isolation behaviour must be verified if executable SQL is added.
4. Resume from committed coverage. Batch work and its checkpoint may be one
   transaction; otherwise a lagging checkpoint can safely repeat work but a
   checkpoint ahead of the data can omit it. Handle skipped/conflicted rows
   explicitly. A terminal cursor alone does not settle semantic state.
5. Reconcile missing values and per-row mismatches across the required live
   population. With all future writes preserving the mapping and the backfill
   unable to introduce stale values, a consistent validation observation of no
   violations remains meaningful after its snapshot. Without those conditions,
   even repeated zero counts do not prove a stable invariant. Samples or equal
   aggregate sums are useful diagnostics, not the completeness proof.
6. Switch to new reads with required constraints/indexes ready; preserve both
   forms atomically during the chosen return window. The safe immediate return
   target is the bridge version, not the original old-only writer. A release
   reversal does not reverse committed data work.
7. End the promised return window deliberately; drain old readers and every
   remaining old-column dependency. Prepare schema compatibility for new-only
   inserts before rolling out new-only writes: the existing old `price NOT NULL`
   would otherwise reject them. Relaxing that legacy requirement is one possible
   separate transition after old callers are retired. Old data can become stale
   as soon as dual maintenance stops, before the column is dropped. Drain all
   code references to the old column before dropping it. Any later return must
   rebuild/reconcile what the earlier version needs, with range/meaning checked.

No observed SQL runs, timings or native object states are claimed. A conversion
with information loss would need a different return policy; keep that as a short
qualification rather than adding a second main scenario.

## Ownership and child boundaries

No new `nested_article` is proposed. All distinct deeper outcomes already have
accepted owners outside this article's structural branch:

- `writes` owns staged imports, affected-row meaning and replayable batch
  mechanics outside the live compatibility protocol. This article owns what
  makes its batches converge despite continuing writers.
- `pg-schema-change` owns PostgreSQL DDL locks, rewrites, bounded native waits,
  concurrent index build/validity, constraint validation and cleanup procedures.
- `crdb-schema-change` owns schema jobs, progress, pause/cancellation behaviour,
  failure and cleanup. Its successful native job does not by itself settle an
  application's representation conversion.
- `indexes` owns access-path choice; this article owns acceptance before relying
  on a replacement and compatibility before retiring the old one. `partitioning`
  owns table layout and lifecycle; this article establishes that a snapshot copy
  must reconcile ongoing mutations before a live routing switch. Do not silently
  promote that brief recognition into a general CDC/table-migration runbook.
- `incidents` diagnoses pressure and contains it. Here a pause must leave a
  compatible state and account for work already running. Native intervention
  commands stay with operations owners; capacity policy stays with `capacity`.

Use contextual links to these existing destinations where the need arises;
reparenting implementation articles as nested children would change the accepted
tree. There are no unresolved ownership changes or requested new pages.

## Primary sources checked

Checked 25 October 2026. These support the planning judgements, not measurements
of the invented shop:

- Danilo Sato, [Parallel
  Change](https://martinfowler.com/bliki/ParallelChange.html): expand, migrate and
  contract as separately releasable stages, with all consumers moved before the
  earlier interface is removed. Supports the compatibility sequence.
- GitLab, [Batched background
  migrations](https://docs.gitlab.com/development/database/batched_background_migrations/):
  idempotent batches, ongoing old/new data synchronisation, completion checks and
  final-state checking before cleanup. Supports bounded replay and acceptance;
  its framework and release-stop procedures are not universal requirements.
- PostgreSQL 18, [Transaction
  Isolation](https://www.postgresql.org/docs/18/transaction-iso.html): Read
  Committed's update handling and re-evaluation against a concurrently changed
  target row. Supports a clearly qualified database-side current-row approach;
  it does not establish every engine's semantics or prove a client-side stale
  value safe. No source-version field is invented here.
- PostgreSQL 18, [ALTER
  TABLE](https://www.postgresql.org/docs/18/sql-altertable.html): locks and possible
  rewrites, later validation of pre-existing rows while future writes are
  enforced, and legacy nullability changes. Supports separating logical
  compatibility, semantic acceptance and physical cost. Detailed syntax remains
  with the PostgreSQL owner.
- PostgreSQL 18, [CREATE
  INDEX](https://www.postgresql.org/docs/18/sql-createindex.html#SQL-CREATEINDEX-CONCURRENTLY):
  concurrent build stages, extra work and invalid objects after failed builds.
  Supports the brief distinction between an object existing and being ready.
- CockroachDB, [Online Schema
  Changes](https://docs.cockroachlabs.com/docs/stable/online-schema-changes):
  background jobs, continuing work after statement cancellation, resource costs,
  temporary storage and failure cleanup. Use the detailed caveats rather than
  repeating the page's introductory suggestion that online work has no latency
  consequences. Native lifecycle work belongs to its implementation article.

Continuity pass completed on this outline and these notes: prerequisite concepts
are introduced by the supplied route; approved scenario branches remain separate;
old-writer drainage precedes convergence proof; read return remains distinct from
old-only write return; old nullability is accounted for before new-only inserts;
native mechanisms and observations remain qualified. The writer and commissioned
article reviewers still check the delivered teaching and rendered work.
