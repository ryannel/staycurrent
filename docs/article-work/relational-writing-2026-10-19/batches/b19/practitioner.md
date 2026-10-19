# b19 — independent practitioner review

Reviewed 20 October 2026 using `staycurrent-review`, practitioner perspective.
a17/a18 are narrow repairs retaining b17's unaffected full technical/native and
family passes. a19 receives a full initial review against the original
relational-practice goal, complete supplied plan/context and actual a03 parent
a18 sibling. No other perspective's report, teaching-reference articles or old
relational corpus was read.

| ID | Practitioner verdict | Required repairs | Optional advice |
| --- | --- | --- | --- |
| a17 | Pass, narrow recheck | None; a17-P1 resolved | None new |
| a18 | Pass, narrow recheck | None; supplied empty-read labels corrected | None new |
| a19 | Pass | None | None |

## a17 — Changing data with SQL

**Pass; a17-P1 resolved.** The corrected paragraph separates the skipped proposal
from an attempted insertion. It records precisely the three independent outcomes:
conflicting bank-1 with missing order 999 is ignored and leaves order 101;
a new reference to 999 fails 23503; a negative amount on conflicting bank-1 fails
23514. Success on an ignored proposal establishes neither all proposed values'
validity nor agreement with the caller's expectation.

Checked the changed prose in source and actual fixed 4439 page, and its source
ledger against b17's durable `practitioner-a17-conflict-native.json`, including
exact fixture, statements and raw results. No repeated native run is needed.
All four a17 component hashes, including queries and models, remain unchanged
from b17. Retain its 27-case native and 63-state/full-browser pass.

## a18 — Designing changes that coordinate with locks

**Pass, narrow recheck.** Empty-set coverage now says that A runs its locking read
and that no rows were locked. B's corresponding empty read also says no rows
locked. These labels agree with the native observation and stated coverage
failure, rather than implying acquisition. The stable coordination-row branch
still shows acquisition by A and waiting by B.

Inspected and ran `repair-check.mjs`: all 45 states retain every other field.
In actual preview 4439, stepped the two empty-read positions, then selected the
stable-row branch and checked acquisition and waiting. SQL, player/CSS, harness
and numerical/native outcomes retain b17's pass. No repeated native run needed.

Both narrow practitioner gates were reported clear to root before the a19 review
finished, as requested for individual delivery.

## a19 — Reading and testing isolation guarantees

**Pass.** The article converts isolation names into practical questions about
read views, conflicting operations and accepted outcomes. It extends the parent's
working counter and staffing cases without replacing their invariants. The
counted-ownership predicate example is explicitly a different representation,
so its insertion counterexample does not claim to break the correctly maintained
guarded counter.

Read Committed command views, Repeatable Read's first-query boundary and own
changes are distinguished correctly. A stable ordinary result is not a
reservation. The post-wait locking/current-row and update-condition examples
show the actual obligations: PostgreSQL RC returns the current zero or declines
the guarded change; RR can reject the changed-since-snapshot attempt. A fresh
transaction is distinct from refreshing an earlier observation. These agree
with PostgreSQL 18's [isolation contract](https://www.postgresql.org/docs/18/transaction-iso.html)
and [transaction settings](https://www.postgresql.org/docs/18/sql-set-transaction.html).

The staffing cycle correctly gives each transaction a reason to precede the
other: different-row write conflict avoidance does not protect that dependency.
The empty-predicate variant extends the argument to future matching rows without
an anomaly catalogue. Serializable rejection is attached to a selected observed
schedule and victim, with other possible rejection points explicitly allowed.
PostgreSQL dependency-tracking SIRead locks are not presented as blocking locks.

Each transaction must still be correct alone and relevant work must participate.
The deliberately wrong, sequential Serializable decision makes that premise
observable. After a known abort, the complete read/decision/change logic is
reconsidered; a lost reply remains a different outcome problem. These boundaries
match [application consistency](https://www.postgresql.org/docs/18/applevel-consistency.html)
and [serialisation failure handling](https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html).

Independently checked MySQL 8.4's documented
[consistent reads](https://dev.mysql.com/doc/refman/8.4/en/innodb-consistent-read.html),
[locking reads](https://dev.mysql.com/doc/refman/8.4/en/innodb-locking-reads.html)
and [isolation modes](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html).
The mixed old ordinary/current locking view, normal RR default and
Serializable shared-read behaviour with autocommit disabled are accurately
qualified. The article and figure repeatedly identify this as documentation-only;
no MySQL execution or exact staffing schedule is claimed as measured.

The final comparison adds completed-before-started order to serial equivalence.
It expressly makes no PostgreSQL/InnoDB counterexample claim. Google's primary
[external-consistency explanation](https://docs.cloud.google.com/spanner/docs/true-time-external-consistency)
supports the definition comparison. The resulting practical obligation is to
establish the actual reader's contract and route, including replicas or older
snapshots, rather than infer freshness from the writer's setting.

The actual parent retains a useful first choice among guarded change, explicit
coordination and serialisable execution. a18 owns the complete locking protocol,
mode compatibility and deadlocks; a19 owns interpretation of snapshot/conflict
contracts. Applications retain retry limits and unknown outcomes, physical
storage retains old-version costs, and a38 retains replica read paths. The
article reaches the needed relational depth without a further speciality branch.
No scope repair or new child is needed.

### Independent native and model evidence

Read the full harness and the authoritative source ledger/evidence before
execution. Ran `rehearse.py` with unique own database
`rel3_prac_a19_1792455761` and separate reviewer output
`/private/tmp/rel3-prac-a19-1792455761.json`. Native PostgreSQL 18.6 passed all
36 assertions with 133 command/output records. Defaults were read committed and
read-write; fsync, synchronous_commit and full_page_writes were on; only the
three own sessions had the documented timeout overrides. All sessions closed
and the database was removed; no shared configuration changed.

Independently reproduced:

- Ordinary RC reads 1 then 0; RR reads 1 then 1. RR begun before the competing
  commit but first queried afterwards reads 0; its own later update is visible.
- Actual observed Lock waits before holder release. RC locking read returns 0
  and guarded update returns no row; the corresponding RR operations return
  40001. Both guarded cases finish with remaining 0 and one reservation.
- RR staffing allows both different-row departures and zero availability.
  Serializable rejects B's commit in this schedule, retaining one; a complete
  new attempt reads one and declines departure.
- Empty reservation predicates allow two distinct inserts under RR; Serializable
  rejects B's commit and retains one. The wrong self-only decision, executed
  sequentially at Serializable, still commits both departures and leaves zero.

The retained writer transcript was inspected beyond its pass flags. No incidental
result was promoted to a universal victim, abort-point or all-interleavings claim.
No MySQL, distributed-service or ordering experiment was run or needed for the
explicitly documentation/definition comparisons.

The owned verifier passes all 56 model states across thirteen settings. In an own
Chrome tab on fixed 4439, exercised every setting to its final result. Also checked
all post-wait operation results and the selected Serializable commit-abort state.
Session observations, committed facts, rejection, full retry and narration agree
with the native/prose boundaries. Selectors intentionally reset to step one.
The ordering comparison was visually checked and its hypothetical label is
prominent. No model correctness repair is needed.

## Handoff

All three snapshots equal rendered article sources and all twelve manifest
component hashes match after review. No article edits, builds, Git actions,
retained-evidence overwrites or shared-server changes were made. No download UI
was used; root owns the recorded asset-byte check. The own tab is closed and
immutable preview 4439 is released. All three practitioner gates pass; no
further repair recheck is requested.
