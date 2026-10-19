# Practitioner review: Reasoning about transactions

Mode: breakdown. Perspective: practitioner coverage, depth, correctness and protocol judgement.

Reviewed `breakdown.yaml` against `context.yaml`, the fresh commission and the source-check record in `repairs.md`. No existing relational articles, coverage maps or old trees were used. No database executions were performed; proposed histories are still plans.

## Verdict

**Revise, then recheck: two small P2 planning repairs.** The coverage and article boundary are sound. No new article or substantial expansion is needed. The weak point is that the most consequential multi-row example and its acceptance test are less concrete than the single-row reservation example.

## Findings

### P2 — Commit to a concrete multi-row invariant and counterexample

Location: `Choose isolation by the outcomes it must exclude` → `Stable reads can still produce an impossible decision`; carry through `Protect a rule that spans several rows` and its child brief.

“A rule over several stock rows” and “an acceptable total” leave the rule, threshold and isolated decision unspecified. A per-row nonnegative-stock rule does not itself produce write skew when transactions change different rows. The parent promises to teach proof by comparison with both serial orders, so the breakdown should settle which additional aggregate rule the example proves.

Repair: state a minimal fixture in the brief. For example, two depots each have one unit and the business requires at least one unreserved unit across them. Each transaction reads a total of two, decides that reserving one from its own depot is permitted, and changes a different row. Either alone leaves one; both committed from the same snapshot leave zero. In either serial order the second decision must reject. Use that same invariant for the parent's serialisable repair and, where practical, the child comparison. Equivalent concrete fixtures are fine.

Acceptance: the revised breakdown names the invariant, initial values, the two decisions and the forbidden final state, and explicitly compares both serial orders. This remains a planning requirement, not a claim that this schedule has been observed on every named engine.

### P2 — Test the parent's multi-row repair explicitly

Location: `Test the protocol against a hostile schedule`.

The worksheet explicitly targets “the original reservation”; its forced conflict and retry cases could all be implemented as single-row contention. That would leave the parent's complete serialisable multi-row repair untested, even though avoiding disjoint-write skew is the reason the reader needs stronger protection.

Repair: require one controlled two-session run of the chosen multi-row counterexample at a named snapshot isolation contract, then the corresponding serialisable run. Record the failed transaction, whole-transaction restart with fresh reads, second business decision and final invariant. Do not prescribe which transaction must be the victim when the engine allows alternatives. Preserve the existing requirement that all writers participate and state that assumption in the worksheet.

Acceptance: the plan expressly requires a failing multi-row history, its repaired history and a restart that reevaluates the business condition. This can be a short second worksheet sharing the earlier fixture.

## Coverage and boundary assessment

The plan correctly begins with an invariant and an unsafe history, teaches a usable conditional-update protocol before general mechanisms, and separates stale overwrites from changes to protected current values. It includes uniqueness arbitration, missing-row and range hazards, snapshot timing, write skew, serialisability, deadlocks, statement versus transaction failure scope, bounded retries, long transactions and contention. The complete parent repair prevents the child from becoming mandatory merely to achieve safe basic practice.

The child earns its scope through changing row sets, guard-row protocols, counter or constraint remodels, insertion/deletion, lock ordering and universal participation. Its comparison must reuse the parent's isolation model rather than reintroduce the same anomaly catalogue. Application connection lifetimes, ambiguous commit outcomes and external effects are handed to the appropriate neighbour without weakening the database protocol obligations here.

## Primary-source verification

- [PostgreSQL 18 transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html) confirms that snapshot-based Repeatable Read can permit a result with no matching serial order, whereas Serializable may reject a transaction and requires retry of the complete transaction. This supports the two requested repairs; it does not establish a particular victim or observed execution for a future worksheet.
- [MySQL 8.4 InnoDB error handling](https://dev.mysql.com/doc/refman/8.4/en/innodb-error-handling.html) confirms whole-transaction rollback for deadlocks, default statement rollback for lock timeouts, and the configurable timeout exception. The planned engine-specific error-scope teaching is necessary and correctly avoids a portable retry rule based only on a generic error category.
- [MySQL 8.4 InnoDB isolation levels](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html) distinguishes consistent-read snapshots from locking/current reads and makes range protection depend on isolation and search conditions. The plan's explicit assumptions and warning against interchangeable labels are appropriate.
- [SQLite isolation](https://www.sqlite.org/isolation.html) confirms journal-mode differences, one-writer coordination and failed promotion of an old WAL snapshot. The planned comparison must preserve these conditions rather than imply that snapshot visibility always permits the PostgreSQL-style disjoint-write schedule.

Ready for a direct recheck after the two repairs.

## Direct recheck

Re-read the repaired `breakdown.yaml`. Both findings are resolved.

- The write-skew section now fixes the two-depot initial state, aggregate reserve rule, separate decisions, forbidden final state and both serial alternatives. The parent repair and child reuse that invariant.
- The final section now expressly requires the failed PostgreSQL snapshot history, serialisable repaired run, permitted choice of abort victim, fresh reads and a new decision after restart, with universal writer participation explicit.

**Final practitioner verdict: pass. No unresolved findings.** This approves the breakdown's practitioner coverage and protocol obligations; native execution evidence remains an explicit requirement for writing.
