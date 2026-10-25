# Aggregation outline notes

## Inputs and reference exposure

Read only the supplied assignment, commission, article ownership, neighbours and
shared shop record, plus the current breakdown, write and continuity skills.
No old article, feedback, other worker's notes or main-repository body was read.

Read all 19 bounded reference parts separately using the supplied reader:
Sequences 1–6, Indexes 1–7 and Storage 1–6. Every END marker was delivered.
The supplied complete-text hashes were:

- Sequences: `722e27d04275d6ee28dfa024951827a78b5c591dc8b5f98584af197b5884809c`.
- Indexes: `d60bf12b37f922f0ced9ec54a51b1ef6b94841a40da5f20be6dafdbf75bec8c1`.
- Storage: `2bebcdf28bacf1f5ecc2220e8d20a7c34682e052fff3ecde56ca1a56aba08c07`.

Studied finished drawings at the supplied preview in one owned temporary IAB tab:
Indexes figure 7 (composite order comparison), Sequences figure 6 (the same
messages in another order), and Storage figure 3 (the old and new P7 versions).
Inspected screenshots with their prose and labels and used the figures' own
controls. No viewport or theme changes and no user-tab operations. Closed the
temporary tab afterwards.

The comparable teaching move is to keep the same recognisable items visible
while changing one rule and showing the consequence. Here the central things
to make visible are contributor membership, collapsed versus retained row
identity, and a frame's moving boundary. The outline leaves final visual form,
paragraph development and controls to the fresh writer.

## Shared example and continuity

No scenario extension is needed. All arithmetic below is hand-derived from the
supplied starting rows, not observed database execution.

- The five order lines contain seven ordered units worth 108.50. They are ordered
  quantities and values, including pending order 103; do not label them revenue,
  cash received or fulfilled sales.
- Product summaries are P3: two lines, three units, value 13.50; P7: two lines,
  three units, value 60.00; P9: one line, one unit, value 35.00. Use the agreed
  order-line unit prices, not the products' current prices.
- Joining lines to their one order supplies status and placed_at without adding
  a second many-side table. Paid-only units are P3: one, P7: two, P9: one. This
  gives WHERE/FILTER a consequential difference without a fresh data variant.
- Product ranking has a natural tie: units 3, 3, 1. RANK produces 1, 1, 3;
  DENSE_RANK produces 1, 1, 2. A separately ordered ROW_NUMBER can choose a stable
  row sequence; adding product_id to the ranking order would remove the tie.
- With lines ordered by placed_at, order_id, line_no, cumulative ordered value is
  4.50, 39.50, 79.50, 99.50, 108.50. With only placed_at in the default ordered
  frame, peers finish together: 39.50, 39.50, 79.50, 108.50, 108.50. The line
  tie-breaker is a chosen reporting order, not evidence that lines were placed
  at separate instants.
- Reuse the supplied package-weight scenario only for the compact all-NULL
  measurement contrast: P7 has one product row but no measured weight. An empty
  selection has no rows. This prevents COALESCE from silently turning an unknown
  measurement into an asserted zero. Do not spread weights through other cases.
- Edda already has no orders. Count the non-null order key after a left join to
  show zero orders, rather than counting its preserved customer row. No payments
  or still-due report is required.
- LAG changes explicitly to one row per order, partitioned by customer. Mina's
  history is 101 then 103. This demonstrates a neighbouring-row calculation
  without inventing payment timestamps or another event stream.

Continuity pass: the route begins with the parent's row-grain understanding,
establishes grouping and contributor choice, preserves row identity with windows,
then introduces peers before frames. Outer filtering uses those completed
calculations. New terms have a local reason to appear; no child must be read to
complete the article's promised outcome.

## Consequential claims checked

Checked against these external primary sources on 25 October 2026. PostgreSQL 18
is the concrete syntax reference; the writer should label engine-specific
availability if introducing alternatives. These checks concern documented
semantics, not observed plans or execution.

- [PostgreSQL 18, Table expressions, §7.2.3 and §7.2.5](https://www.postgresql.org/docs/18/queries-table-expressions.html): grouping changes result grain; WHERE precedes grouping; HAVING removes groups; ungrouped aggregates form one group; windows receive the rows remaining after grouping and HAVING. Keep grouping-column rules qualified for recognised functional dependencies rather than claiming every selected column must always be listed.
- [PostgreSQL 18, Aggregate functions](https://www.postgresql.org/docs/18/functions-aggregate.html): COUNT(*) counts rows and COUNT(expression) counts non-null inputs; SUM and AVG ignore null inputs; an empty SUM is NULL while COUNT is zero. Order-sensitive collection aggregates require a deliberate input order if used. A final ORDER BY does not order inputs to an aggregate.
- [PostgreSQL 18, Value expressions, §4.2.7–8](https://www.postgresql.org/docs/18/sql-expressions.html): FILTER selects contributors to one aggregate; DISTINCT applies to its argument values. ROWS, RANGE and GROUPS use different frame units; the default ordered frame reaches the current peer group's end. Use explicit frame bounds where they express the intended result.
- [PostgreSQL 18, Window function tutorial](https://www.postgresql.org/docs/18/tutorial-window.html): windows preserve individual row identity; window ordering and display ordering differ; tied ROW_NUMBER assignment lacks a specified order; filtering after window calculations can use a subquery. A WHERE inside that calculation changes the population.
- [PostgreSQL 18, Window functions](https://www.postgresql.org/docs/18/functions-window.html): rank gaps and dense ranks differ; peer groups use the window's ordering columns; LAST_VALUE uses the frame. LAG/LEAD address neighbouring partition rows; absent neighbours have a default NULL, and PostgreSQL uses RESPECT NULLS. Do not teach all window functions as frame-sensitive.

## Ownership and remaining decisions

No new child or ownership change is proposed. General grouping, empty/count
distinctions, FILTER, ranking, peers and frames remain fully owned here. Do not
rebuild Query results' lines/payments fan-out and separate per-order summaries;
recall its established lesson briefly when warning that windows retain their
actual input grain. Physical sorts, aggregate algorithms, spills and index
support belong to Query execution. Stable cursor keys and changing-list
continuation belong to Pagination.

GROUPING SETS/ROLLUP, percentile catalogues, advanced exclusions and full engine
comparison procedures are not required by this accepted brief. ROWS/RANGE/GROUPS
receive enough treatment to choose the unit without expanding into those
specialisms. The writer can reshape section order while preserving the outcomes.
The nullable-weight side case is supplied shared context, not a schema change.
Root remains the sole preview/build/integration owner. No separate planning
review was arranged, as assigned.
