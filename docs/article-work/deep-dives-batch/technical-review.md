# Independent technical review

Reviewed 14 October 2026 against the three main-article outcomes in
`docs/relational-collection-plan.md`. Read the three complete articles, their
imported teaching figures and interactive model implementations, the existing
brief/evidence records, and the runnable verification scripts. Used the
staycurrent-review, staycurrent-research and staycurrent-style skills.

**Verdict: technically ready as drafts.** No unresolved material technical repair
remains in this review. This does not replace the independent reading and rendered
browser review, and does not grant publication permission. No article edits were
made by this reviewer.

## Material finding and repair checked

The designing article invited the reader to insert O12 line 2, then later printed
only line 1 in its receipt result. Running cumulatively returns a second row:
quantity 1, unit price 18.00, amount 18.00. The coordinator repaired the explanation
while this review was running. The final receipt section now explicitly starts
from a fresh load before that insert and describes the extra row for a cumulative
run. Rechecked that wording against both executed results. Resolved.

## What the articles support

**Designing your data** develops a defensible schema from record meaning and
functional dependencies. The normal-form progression preserves line identity,
distinguishes historical prices from current prices, and explains why arbitrary
one-to-one fragmentation adds no normalisation benefit. Its constraints section
teaches actual guarantees and limits: missing quantity versus CHECK, a composite
identity versus product uniqueness, required references, deletion actions, and
cross-row requirements. Its JSON example establishes only object shape, then
makes the typed-capacity alternative concrete without claiming the foreign key
proves that every mug has details. The supplier-offer example connects independent
identity and updates to the representation choice. Neither child is needed to
reach these main outcomes.

**Querying your data** teaches result identity before execution. All displayed
join/filter/aggregate results checked agree with the practice data, including
Cara's matching-but-filtered order, Ben's missing match, and the empty O14 group.
The shipment example exposes multiplication and repairs it by grouping each
collection at the requested level. EXISTS preserves the outer order identity.
The main article then follows a real observed plan through both input branches,
materialization, matching and sorting. Its 1.50-row average is backed by execution.
The simplified full-scan/lookup model is explicitly distinguished from that plan
and from an index-driven nested loop. It supports the promised connection between
answer and work without claiming that its counters measure database performance.

**Transactions and concurrency** establishes the local invariant, tests success,
CHECK failure and zero-row branches, and then identifies how overlapping decisions
break it. Guarded updates and locking reads use the PostgreSQL Read Committed
recheck/returned-version behaviour correctly. The snapshot section distinguishes
ordinary SELECT visibility from locking/updating behaviour. The featured-products
example explains why Repeatable Read does not protect a multi-row decision and
why Serializable can reject an attempt. Whole-operation retries, bounded retry
budgets, missing commit replies, stable operation identity, and the subsequent
Read Committed lookup after an ON CONFLICT wait are all treated coherently. The
payment workflow keeps external effects outside the local transaction, preserves
uncertainty, and explains why durable work and duplicate handling remain necessary.

## Executed evidence

Reran all three author verification programs successfully with PostgreSQL 18.3
in PGlite 0.5.8:

- `designing-data-deep-dive/verify.mjs`: receipt, proposed line, JSON and capacity
  SQL; five object cases and all 192 combinations of proposed rows and rules.
- `querying-data-deep-dive/verify.mjs`: eight result assertions, actual receipt
  plan and downloadable execution script; both model algorithms against SQL for
  all nine data settings. The run refreshes that directory's `observed.json`.
- `transactions-concurrency-deep-dive/verify.mjs`: successful purchase, failed
  transaction and rollback, zero-row branch, sequential guarded reservations,
  one Serializable decision, duplicate operation recovery, and all 24 recovery
  model states.

Added `technical-checks.mjs` beside this record to independently check remaining
query results and important edge cases. It passes decimal rounding, C-collation
ordering, NaN rejection, the cumulative receipt, the ordinary product/customer
joins, HAVING, four-pair fanout, and the prediction's nine pairs totalling €192
versus correct summaries of €64 and three shipments. It uses the same temporary
PGlite dependency as the author scripts.

The concurrent schedule was inspected across its three methods and two endings.
Committed counters and unfinished request panels agree: A's rollback lets B buy;
A's commit permits a second purchase only in the intentionally unsafe branch.
The recovery model distinguishes hidden database state from identical missing-reply
evidence and claims before reserving again. Its five-mug reset is stated in the
experiment, so its different stock count is not a continuation error.

These are single-session SQL executions and finite teaching-model checks.
Multi-session waits, snapshot schedules, deadlock detection and SSI rejection were
verified against PostgreSQL documentation, not observed in a live concurrent
server. Browser interaction and layout are being checked by the coordinator.

## Primary sources checked

Checked the linked primary sources on 14 October 2026, including these consequential
mechanisms:

- [PostgreSQL 18 constraints](https://www.postgresql.org/docs/18/ddl-constraints.html):
  CHECK unknown acceptance, primary/unique keys, nullable references and deletion.
- [Numeric types](https://www.postgresql.org/docs/18/datatype-numeric.html) and
  [date/time types](https://www.postgresql.org/docs/18/datatype-datetime.html):
  decimal rounding, special numeric values and timestamp zone representation.
- [JSON types](https://www.postgresql.org/docs/18/datatype-json.html): object storage
  within relational rows and update locking at the containing row.
- [Berkeley database design](https://cs186berkeley.net/notes/note13/) and
  [RPI normalisation](https://www.cs.rpi.edu/~sibel/csci4380/fall2026/lecture_notes/lecture5.html):
  dependencies, candidate keys, decomposition and normal forms. Both links resolve.
- [Table expressions](https://www.postgresql.org/docs/18/queries-table-expressions.html)
  and [aggregates](https://www.postgresql.org/docs/18/functions-aggregate.html):
  matching, outer-join filtering, grouping and empty-input meanings.
- [Using EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html) and
  [planner/optimizer](https://www.postgresql.org/docs/18/planner-optimizer.html):
  operation trees, repeated-operation averages and alternative join strategies.
- [Transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html):
  ordinary statement snapshots, waited-for row rechecks, Repeatable Read and
  Serializable, including ON CONFLICT DO NOTHING visibility.
- [Explicit locking](https://www.postgresql.org/docs/18/explicit-locking.html) and
  [serialization failure handling](https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html):
  lock conflicts, deadlocks and retrying complete decisions.
- [Unique-index checks](https://www.postgresql.org/docs/18/index-unique-checks.html):
  waiting for a conflicting transaction before deciding whether a claim succeeds.

## Optional refinements

The rule experiment's accepted-missing-quantity explanation mentions that a positive
CHECK permits unknown even when the reader has also switched that rule off. The
statement is true as a general explanation, and acceptance remains correct in all
192 cases; conditional wording would describe that particular control state more
exactly. This is not a material teaching or correctness failure.

The execution model deliberately assumes unique, present product matches. Its Map
representation is correct for every offered setting. If future controls introduce
duplicate or absent product identities, the lookup implementation will need to
preserve multiplicity and missing-match semantics instead of reusing this model
unchanged. No such controls or guarantees are offered now.
