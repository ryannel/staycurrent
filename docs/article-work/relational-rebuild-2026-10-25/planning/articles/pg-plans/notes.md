# Planning notes · Reading and repairing PostgreSQL plans

Fresh detailed outline for the accepted `pg-plans` node. No new child articles or
ownership changes are proposed. No article prose, implementation, execution
experiment, review, build, server, commit or publication was undertaken.

## Inputs and reference exposure

Read all six supplied context files and the assignment. Used the supplied
breakdown skill, its writing-reference procedure and continuity guidance. Read
`sequences` parts 1–6, `indexes` parts 1–7 and `storage` parts 1–6 separately through
`scripts/read-writing-reference.py`, with every END marker delivered.

Studied finished reference drawings in owned temporary IAB tabs at port 4584:
Sequence diagrams' Figure 2 (nested waiting, one duration changed); Indexes'
Figure 6 (the same matching rows, page visits and the widening range); Storage
and durability's Figure 2 (a repeated visit becomes a hit). Controls and changing
states were inspected without viewport or theme changes. All owned tabs closed.

The useful teaching pattern is a concrete mechanism followed through one change,
with the visible consequence explained immediately. For this outline that means
one plan's arithmetic before a catalogue of remedies. The writer chooses prose
and visual design. Make the difference between per-loop and accumulated work,
the scope of inclusive measurements, and parameter-dependent choices visible.

Read the two accepted prerequisites at port 4606: Query execution and performance
and Inside PostgreSQL. They supply factual continuity, not writing models.
The former already owns scans, join algorithms, general estimate diagnosis,
SQL equivalence and workload testing. The latter establishes backend processes,
shared-buffer misses, heap visibility and index-only eligibility. Do not repeat
those mechanisms at their original length.

## Example decisions

Use the accepted paid-order line-value report as the principal plan-reading
case. It sums agreed `order_items.quantity * unit_price`, for paid orders in
half-open UTC bounds, by customer. The three core orders yield Tariq 40.00 and
Mina 39.50 for October; pending 103 and Edda contribute no result row. This is
not payment revenue. Preserve post-103 stock 10/0/4, pending 103, no payment for
103 and its 29.00 agreed line value.

Reuse the exact generated reporting fixture in the supplied record: customers
1001–2000, generated orders 100001–220000, 120,003 orders and 360,005 lines in
total, the given seed/formulae and no generated payments. Customer 1001 is the
common value and 1002 the existing rare comparison. Generated history models a
workload, not stock movements. No shared business extension is needed.

The accepted general article's per-order lateral aggregate is a useful native
counter case: it already establishes why tiny inner results can mean much work.
Retain `HAVING COUNT(*) > 0` if comparing that form with its inner-join report;
otherwise line-free eligible orders can change the result. Native observations
in that accepted article belong to its stated Linux PostgreSQL 18.6 experiment;
they are not fresh measurements made by this planner.

Use the existing customer-history variation for access-path and early-stop
evidence: return `order_id`, `placed_at`, `status`; one customer and UTC lower
bound; descending `(placed_at, order_id)`; limit 10. Full and paid-only history
are distinct variants. No stored order total or extra date column is supplied.
Do not call the generated pending population a small slice.

For prepared plans, parameterise an existing report or history variant and
observe contrasting values in one identified session. Choose the variant and
index state that actually expose a meaningful trade-off. A fully fitted history
index with a ten-row limit might serve both customers well: skew alone does not
promise a bad generic plan. Retain execution order and distinguish forced
comparisons from the automatically chosen behaviour.

Statistics changes, candidate indexes, low-memory spill demonstrations and
planner switches are isolated experimental states over this fixture. Record
them explicitly; do not turn them into shared business facts. Any illustrative
miniature counters must be labelled as a model. No new timing, plan change,
spill, statistics improvement or generic-plan regression is established here.

## Primary-source checks

Checked PostgreSQL 18 documentation on 25 October 2026. Keep the eventual native
measurements bound to their actual server version.

- [Using EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html): costs and
  emitted rows, loops, partial consumption, sort/hash details and native
  measurement caveats. A LIMIT can leave a child incompletely consumed; filter
  rejection at a join concerns candidate pairs. Index Searches is a total across
  executions. Avoid multiplying every displayed field by loops.
- [EXPLAIN](https://www.postgresql.org/docs/18/sql-explain.html): ANALYZE really
  executes; BUFFERS reports inclusive shared/local/temp usage and is implicit
  with ANALYZE in PostgreSQL 18. TIMING OFF still records statement duration.
  SETTINGS is not a full settings dump. SERIALIZE can measure conversion, not
  network transfer; MEMORY describes planning memory, not the query's total
  execution allocation.
- [PostgreSQL 18 explain.c](https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/commands/explain.c):
  `ExplainNode` divides rows and node times by loops; `show_instrumentation_count`
  divides filtered counts and prints them at whole-row precision.
  `show_buffer_usage` receives accumulated buffer usage directly. This supports
  distinguishing rounded averages from totals and avoids false exact arithmetic.
- [Planner statistics](https://www.postgresql.org/docs/18/planner-stats.html):
  sampled statistics, `pg_stats`, targeted statistics detail and related
  predicates. Dependencies apply to suitable constant equality/IN clauses, not
  the report's date-range predicates. Do not promise that dependencies on date
  and status fix October.
- [CREATE STATISTICS](https://www.postgresql.org/docs/18/sql-createstatistics.html)
  and [multivariate examples](https://www.postgresql.org/docs/18/multivariate-statistics-examples.html):
  distinguish dependencies, MCV and ndistinct; expression statistics can be
  relevant, but need matching predicates and collection. Extended statistics do
  not currently estimate join selectivity. Statistics are evidence, not enforced
  business dependencies.
- [Multicolumn indexes](https://www.postgresql.org/docs/18/indexes-multicolumn.html),
  [bitmap combinations](https://www.postgresql.org/docs/18/indexes-bitmap-scans.html)
  and [index-only scans](https://www.postgresql.org/docs/18/indexes-index-only-scans.html):
  an Index Cond need not bound a narrow scan; bitmap access loses index order;
  covering alone does not remove heap visits. Here interpret the evidence;
  detailed access-method/operator choices remain with `pg-indexes`.
- [Resource consumption](https://www.postgresql.org/docs/18/runtime-config-resource.html):
  work_mem is an operation allowance, hash allowances use hash_mem_multiplier,
  and concurrent operations and parallel workers multiply resource use. A
  lower-memory demonstration is a local experiment, not a server-wide tuning
  recommendation.
- [Parallel plans](https://www.postgresql.org/docs/18/parallel-plans.html) and
  [how parallel query works](https://www.postgresql.org/docs/18/how-parallel-query-works.html):
  use VERBOSE for worker evidence, distinguish Gather/Gather Merge and actual
  worker availability. An ordinary hash join within parallel work can duplicate
  its build; Parallel Hash shares it. Do not add worker durations into latency.
- [PREPARE](https://www.postgresql.org/docs/18/sql-prepare.html) and
  [pg_prepared_statements](https://www.postgresql.org/docs/18/view-pg-prepared-statements.html):
  custom versus generic planning, the automatic estimated-cost comparison after
  five custom executions, session scope, EXPLAIN EXECUTE and choice counts. A
  sixth execution is not guaranteed to switch. DDL/statistics changes can cause
  replanning. Avoid generalising this mechanism to every driver/pool setup.
- [Query-planning settings](https://www.postgresql.org/docs/18/runtime-config-query.html):
  planner switches are crude comparisons; Memoize can avoid repeated parameter
  lookups. Session experiments do not establish a permanent setting for a mixed
  workload.

## Boundaries and remaining evidence

No accepted ownership changes are needed. Keep all planned outcomes in this
article: none currently warrants a separate deeper child. `query-execution`
retains the transferable method; `pg-indexes` retains native method/operator
semantics; `pg-operations` retains pool, admission and lock-wait diagnosis.
Live index rollout belongs to `pg-schema-change`, retained visibility repair to
`pg-vacuum`, and general workload budgets to `capacity`.

The writer must obtain or receive exact owned native evidence for the selected
statistics and prepared-plan tests. An unchanged plan can be an informative
result when the limitation is explained. Do not manufacture a successful
extended-statistics repair by silently changing shared distributions or claim
that forced generic/custom comparisons prove an automatic switch. Any required
shared extension should return to the coordinator first. The coordinator alone
owns preview, build and integration.

Continuity pass on this plan: prerequisites establish the needed vocabulary;
native units precede repair choices; the same report/history variants carry
through; no result grain, customer identity, order status, payment or stock
meaning changes. The only unresolved points concern future experiment outcomes,
not collection ownership or business facts.
