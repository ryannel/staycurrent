# b05 — independent practitioner review

Reviewed 19 October 2026 using `staycurrent-review`, practitioner perspective.
a05 receives the requested narrow repair recheck; a06 receives an initial full
review against the original relational-practice goal, supplied family plans and
available parent/sibling drafts. No teaching review, teaching-reference articles
or old relational corpus was read. No article, component, retained evidence,
commit or publication state was changed.

| ID | Practitioner verdict | Required repairs | Optional advice |
| --- | --- | --- | --- |
| a05 | Pass | None; retain b04 technical pass | None new |
| a06 | Pass | None | a06-O1: mode-specific unsafe cutover action labels |

## a05 — Understanding and improving database performance

**Pass, narrow repair recheck.** The article is byte-identical to b04. The
component retains the previously accepted model values, native plan counts and
measurement ranges. The new persistent table shows both before and after ranges
throughout case switching; latency rows are labelled milliseconds and completion
rate per second. Its report, lookup and change p95 ranges agree with b04's
independent recalculation of all 3,600 samples. Completion rates agree with the
retained per-run table, with the same stated rounding.

In my own Chrome tab on fixed preview 4437, selected both measurement cases and
confirmed the table remained visible and unchanged while the selected phase
changed. The focus and pacing edits do not change the technical comparisons or
their evidence boundary. Retain b04's native SQL, plan, useful-depth and family
assessment without rerunning it. Presentation and playback quality remain with
the independent teaching recheck.

## a06 — Changing a live database

**Pass.** The parent gives a complete useful answer: define the address invariant,
expand schema, replace and drain old writers, use a bridge protocol, convert
against current source versions, resolve ambiguity, tighten accepted writes,
switch readers while keeping a valid rollback release, then retire compatibility
only after the evidence window. A schema-history record is correctly distinguished
from completion of that whole change.

### Correctness, depth and practical judgement

The address conversion preserves business meaning as well as row coverage. It
does not infer missing address facts or confuse a legitimate empty line with
unfinished work. Source versions and explicit dispositions make stale work and
ambiguous input visible. The bridge sequence acknowledges that old writers may
not maintain the new protocol, keeps text authoritative while they drain, and
does not trust the backfill until their transactions have finished. Requiring
confirmed current parts on every accepted new change before the read switch
preserves the reconciled condition after checking it.

Atomic dual writing is usefully separated from deriving matching values from the
same source. A zero-row guarded conversion is a conflict to account for, rather
than a completed row. Complete work coverage includes later-visible work, not
merely the largest allocated identifier; durable progress and uncertain batch
outcomes receive the correct high-level treatment. Detailed enumeration and
restart implementation remain with a30.

Physical change costs are tied to exact engine/version forms, not statement
length or an online label. Nullable text additions, exclusive locking, ordinary
type rewrites, constraint scans and concurrent-index limitations are accurately
qualified. The article includes dependencies outside the catalogue, runner
transaction restrictions, rehearsal, separate limits and a concrete action after
a stop signal. It does not prescribe unmeasured production thresholds.

The move sequence correctly requires a consistent starting copy joined to later
changes, destination readiness, resolved in-flight work, enforced source fencing,
an applied final committed boundary and final checks before destination writes.
A caught-up instant or changed route is insufficient. The generated-identifier
warning correctly distinguishes table contents from unreplicated sequence state.
The route back changes once the destination accepts orders; reversing connections
alone would not preserve them.

Recovery distinguishes code rollback, schema reversal and data correction, keeps
later legitimate edits in view and does not claim that a recreated column or a
backup supplies reversibility. Retirement includes delayed consumers and relevant
job schedules. The retention discussion includes derived copies, backup expiry
and the rules applied on restoration, rather than claiming immediate physical
erasure from a successful DELETE. These are useful relational operating decisions
within this commission, without expanding into a separate programme.

### Independent evidence

Read the full snapshot, own plan, a29/a30/a31 scopes and section plans, available
family context, source ledger, writer handoff, player, all model definitions and
verifier. Ran the owned verifier without any output-file writes: its 29
scene/mode frames, bounds, address-race outcomes and cutover divergence assertions
passed.

Independently ran the ledger's complete native SQL fixture in a fresh own
PostgreSQL 18.6 database. It produced three pending rows, rejected the stale
version-7 update, retained order 101 at version 8 with `12 Birch Road`, recorded
two current/one review dispositions, then reached zero unresolved rows after
customer confirmation. The blind-write control exposed source version 8 with
parts based on version 7 and was rolled back. These observations agree with the
ledger; version equality alone is explicitly not claimed as proof of address
meaning.

Added two independent checks in that disposable database:

- An ordinary nullable text addition retained the table's heap file identifier
  while holding an observed granted `AccessExclusiveLock`, confirming that no
  rewrite does not mean no exclusive lock.
- With two Read Committed sessions, the worker's guarded UPDATE started while
  Mina's version-8 edit was uncommitted. An observer confirmed a Lock wait. After
  the edit committed, the worker changed zero rows; the newer text, parts and
  conversion version remained intact. A blind control changed one row and
  created the expected stale representation, then rolled back.

All review sessions closed and only my fresh review database was removed. No
shared-server setting changed. This additional concurrent check supports the
single-row guard; it does not constitute a production migration, cutover,
replication or restore rehearsal. The article correctly limits the author's
native claim to its sequential fixture and labels the schedules as models.

Independently inspected PostgreSQL 18 primary sources for
[ALTER TABLE locking and rewrites](https://www.postgresql.org/docs/18/sql-altertable.html),
[concurrent index builds](https://www.postgresql.org/docs/18/sql-createindex.html),
[Read Committed rechecking](https://www.postgresql.org/docs/18/transaction-iso.html#XACT-READ-COMMITTED),
[logical replication omissions](https://www.postgresql.org/docs/18/logical-replication-restrictions.html)
and [base backup/WAL recovery](https://www.postgresql.org/docs/18/continuous-archiving.html).
The vacuum/space distinction also agrees with the
[versioned vacuum documentation](https://www.postgresql.org/docs/18/routine-vacuuming.html)
checked during the preceding performance review.

On fixed built preview 4437, manually advanced every step of all three models,
including both race and cutover modes: 29 frames in total. The ambiguous order
blocks the read gate; confirmation updates both representations; retirement
preserves the structured address. The guarded race preserves the newer edit;
the blind route displays stale parts. The fenced move applies order 102 before
enabling destination writes and leaves order 103 only there; routing alone ends
with conflicting accepted order-103 states. These visible rows and gates agree
with the source model and stated protocol boundaries.

### Optional a06-O1 — Match unsafe cutover headings to the action actually taken

Location: `model.mjs`, `move()` action array at steps 2 and 3.

In routing-only mode, the action heading still says “Stop and fence writers” and
then “Verify the final boundary”. The explanatory note, source label and UNSAFE
gate correctly establish that neither was achieved. Consider mode-specific
headings such as “Pause front-end admission only” and “Observe catch-up at this
instant”, so the strongest action label also describes the failed protocol.
This is optional clarity: the current comparison does not hide the unsafe state
or incorrectly authorise proceeding.

### Family boundaries

a00's change orientation now leads to a substantive complete parent sequence.
a06 reuses a03's transaction/concurrency argument, a04's uncertain-request and
integration responsibilities, and a05's measured-workload method without
rebuilding them. a29 owns executable DDL, runner boundaries, staged validation,
index failure handling and physical representation changes. a30 owns the actual
worklist/catch-up, progress and replay job. a31 owns the full measured cutover
runbook and capture mechanism. Operations retains backup, replication and ongoing
service procedures. The parent supplies the decisions, gates and recovery
consequences needed before those deeper procedures; no new branch or
consolidation is needed.

## Review scope and handoff

Both snapshots match their rendered article sources; all four component/model/
verifier hashes match the b05 manifest. Native verification did not overwrite
retained evidence. The shared build was not rerun, and browser inspection used
the fixed 4437 build. Teaching/presentation review remains independent. Both
articles pass this practitioner gate; no required repair recheck is requested.
