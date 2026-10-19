# b17 — independent practitioner review

Reviewed 20 October 2026 using `staycurrent-review`, practitioner perspective.
Full initial reviews of both articles against the original relational-practice
goal, complete supplied context/plans, actual a02/a03 parents and available family
articles. Read complete prose, models, renderers, native verification sources,
retained evidence and source ledgers. No other perspective's report,
teaching-reference articles or old relational corpus was read.

| ID | Practitioner verdict | Required repairs | Optional advice |
| --- | --- | --- | --- |
| a17 | Repair, narrow prose qualification | a17-P1 | None |
| a18 | Pass | None | None |

## a17 — Changing data with SQL

### Required: a17-P1 — Qualify foreign-key checking of skipped conflict rows

Location: paragraph beginning “DO NOTHING handles the named key conflict”, in
“Decide what should happen when an insert meets existing data”. The statement
that it does not excuse an invalid foreign key is too broad. When the named
conflict causes a proposed row to be skipped, its foreign-key insertion check
need not run. The existing row remains valid, but success does not establish that
the proposed reference would have been valid if inserted.

Independently checked on PostgreSQL 18.6 with the article's exact receipts setup:

```sql
INSERT INTO receipts (tenant_id, order_id, external_ref, amount)
VALUES (1, 999, 'bank-1', 1)
ON CONFLICT (tenant_id, external_ref) DO NOTHING
RETURNING *;
```

This succeeds with zero rows; the existing bank-1 receipt remains linked to 101.
The same nonexistent order with a new external reference fails 23503. A negative
amount on conflicting bank-1 still fails the CHECK with 23514. These distinctions
are retained in the reviewer's `practitioner-a17-conflict-native.json`.

Keep the useful point that ON CONFLICT is not a general constraint-error handler,
and that CHECK/NOT NULL validation can reject a proposed row. Qualify the FK
statement: an attempted insertion must satisfy its reference, while a skipped
conflicting proposal is not evidence that all its proposed values were validated.
Removing the broad FK phrase and stating this skipped-row limitation is also a
sufficient narrow repair. The following existing-row-matching warning remains
useful. No displayed query or figure needs changing. Add this boundary to the
source record or retained targeted check. A narrow prose/evidence recheck can
retain the full native/model pass below.

### Otherwise passes

The two-tenant extension makes complete identity and preconditions observable.
Candidate inspection is distinguished from concurrency protection. Defaults,
explicit NULL, empty sources and returned receipt identity are accurate. Returned
rows are treated as key/value sets, with a separate ordered complete-state check.

Source-driven UPDATE exposes the real duplicate-match error: one source winner
is used, not both deliveries. Its observed seven is not promised as deterministic;
summing is justified only because the rows are genuine independent arrivals.
The no-target P9 case makes UPDATE versus insert-or-update useful. This matches
PostgreSQL's [UPDATE contract](https://www.postgresql.org/docs/18/sql-update.html).

Direct deletion output is separated from cascaded line removal; a rejecting
reference leaves no partially kept statement. Status change, NULL assignment and
deletion retain different lifecycle meanings. Addition, replacement, preservation
and rejection remain four distinct conflict policies. Repeated upsert/MERGE source
keys and ordered WHEN actions are covered, with PostgreSQL 18 syntax named.
The concurrent guarantee difference is correctly documented rather than claimed
from these single-session tests. Checked [INSERT](https://www.postgresql.org/docs/18/sql-insert.html),
[MERGE](https://www.postgresql.org/docs/18/sql-merge.html) and
[isolation](https://www.postgresql.org/docs/18/transaction-iso.html) primary sources.

Affected-row counts do not establish value change or all side effects.
Transaction failure, rollback, unreturned effects and generated-number gaps are
qualified. [RETURNING](https://www.postgresql.org/docs/18/dml-returning.html) and
[sequence](https://www.postgresql.org/docs/18/functions-sequence.html) documentation
support the stated boundaries. COMMIT acknowledgement and uncertain replies
remain application/transaction questions.

The actual a02 parent supplies a useful first change. a17 develops ordinary SQL
mutation decisions without duplicating a13 value semantics, a14 pairing,
a16 deliberate selection, transaction protocols or live-change operations.
No scope repair or new child is needed.

### Independent native and model evidence

Inspected `verify.py` before running a temporary copy against a fresh unique own
database, with its sole evidence destination explicitly set to the reviewer
temporary directory. All 27 cases passed, reproducing expected identities,
values, controlled SQLSTATE failures, transaction failure/rollback, identity gap,
MERGE actions and the complete delivery postcondition. The database was dropped.
Three additional targeted conflict/reference/check cases establish a17-P1; that
separate own database was also dropped. Durable exact setup, statements, expected
stdout, actual stdout/stderr and statuses are retained beside this report in
`practitioner-a17-conflict-native.json`.

Reviewer scripts and JSON outputs:
`/var/folders/dh/062x03k90yxbfxg__1yd_h000000gn/T/rel3-prac-b17-pba9bl4h/`.
No retained writer evidence was overwritten. The original native transcript was
read independently of its pass flags, including the unordered P9/P7 output and
subsequent ordered state.

The owned model check passes all 63 states. In an own Chrome tab on immutable
4439, exercised all 21 choices across seven figures through their final result.
Target identities, defaults, source totals, stock meters, cascade/rejection,
conflict results and rollback/sequence states agree with the prose and native
results. Selectors intentionally reset to step one. The panels were visually
checked. No further model correctness repair is required.

## a18 — Designing changes that coordinate with locks

**Pass.** The article constructs the counter-free alternative introduced by its
actual parent, with stable resource identity and explicit capacity/ownership
invariants. Empty reservation locks and absent resources are different uncovered
cases. The all-writers inventory includes imports, corrections, cancellation,
capacity changes, deletion and both sides of a move. Limited monotonic exemptions
are explained without silently adopting them into this common protocol.

The separate post-acquisition Read Committed command is consequential and correct.
The combined command's stale count is shown as an actual observed shape, not
assumed repaired by lock acquisition. Resource creation, retention, disappearance
and identity reuse have explicit boundaries. A first missing lookup must stop;
the FK alone cannot replace the count protocol. Primary
[Read Committed documentation](https://www.postgresql.org/docs/18/transaction-iso.html#XACT-READ-COMMITTED)
supports the statement visibility distinction, and independent native execution
reproduces the exact combined-query result.

FOR UPDATE compatibility is checked against actual update/delete/reference
paths. A foreign-key wait protects existence rather than capacity. The weaker
mode's interaction is correctly distinguished from cooperative protocol coverage.
Locks last through the decision and mutation; autocommit and savepoint rollback
can remove protection. These match PostgreSQL's
[explicit-locking contract](https://www.postgresql.org/docs/18/explicit-locking.html).

Moves take distinct classes in one canonical order with explicit acquisitions,
then recheck ownership and current source. Stale source discovery cannot add a
lower lock out of order. Declining a full destination leaves the original booking;
uniqueness errors require whole-attempt rollback. Ordering removes the shown
cycle, not all possible implicit-lock deadlocks, and victim identity is not
promised. This is useful protocol depth within the relational goal.

Timeout, NOWAIT and SKIP LOCKED retain different meanings. An error or skipped
candidate is not absence or fullness; row options leave table-lock requirements,
and a per-acquisition timeout is not a request deadline or fairness guarantee.
Checked PostgreSQL's [locking SELECT clauses](https://www.postgresql.org/docs/18/sql-select.html#SQL-FOR-UPDATE-SHARE)
and [lock_timeout](https://www.postgresql.org/docs/18/runtime-config-client.html#GUC-LOCK-TIMEOUT).
The article stops before queue leases and client retry machinery.

The final argument correctly needs each individual change to preserve the rule,
every conflicting writer to coordinate, fresh relevant reads, protection through
outcome and complete rollback. Passing selected schedules supports this argument
without proving that no bypass exists. a19 retains the wider engine/isolation
comparison, applications retain outcome/retry/lifetime procedures, and concurrent
load retains measurement. No scope repair or new child is needed.

### Independent native and model evidence

Inspected the complete harness, then ran it with a unique own database and
reviewer stdout path. All 31 assertions passed with 121 recorded commands.
Observed waits used an independent observer rather than an assumed sleep.
Evidence: `/private/tmp/rel3-prac-a18-1792453851.json`.

The run reproduced unprotected overselling, protected handoff and fresh count,
combined 21|0 then a new-command count of one, guarded insert acceptance/decline,
move refusal then acceptance, exact-once cancellation and both-class invariant,
capacity reduction rejection, empty-set and absent-resource limits, real mode
compatibility, NOWAIT/timeout/failed-state behaviour, visible-but-skipped class,
one deadlock victim and explicit canonical acquisitions. All three own sessions
closed and the own database was dropped. No server settings changed.

The owned model verifier passes 45 states across thirteen choices. In the actual
4439 preview exercised all choices to their outcome, plus intermediate combined
count and wait/NOWAIT/skip states. Session roles, committed counts, possible
outcomes and narration agree with the native/prose boundaries. The final panel
was visually checked. These are correctly labelled illustrative schedules.

## Handoff

b17 snapshots equal rendered sources and all eight assigned component hashes
match. b18's snapshot and four hashes also match after its narrow recheck.
No article/component edits, builds, Git actions, retained-evidence overwrites,
download UI interactions or shared-server changes were made. The own browser tab
is closed and immutable preview 4439 is released. a18 passes; a17 needs only the
specified a17-P1 qualification and targeted source/evidence note.
