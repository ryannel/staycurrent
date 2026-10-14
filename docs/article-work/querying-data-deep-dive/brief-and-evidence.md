# Querying your data

Commissioned 14 October 2026 as the second main relational deep dive. Existing
`query-results.astro` supplies the result-meaning explanation; expand it in place.

The reader knows tables and keys and wants to ask useful questions of stored data.
By the end they should derive the meaning of each result row, reason about matches,
missing values, grouping and multiplication, and follow one actual execution from
inputs to answer. The main article must teach execution locally. The planned
**How a query runs** child develops further access-path and planner detail;
**Pagination and large results** keeps its existing distinct application task.

## Argument and media

Keep the existing shop, result tables, source-to-result plate, fanout comparison
and prediction exercise. They establish SQL semantics without introducing an
unrelated dataset. Extend the receipt query into an observed PostgreSQL plan:
filter purchase lines, reuse the product input, match, sort. An HTML diagram
keeps the two input branches visible. Explain the observed 1.5 average rows over
two loops rather than silently simplifying away a likely reader question.

The separate interactive model changes catalogue size, receipt size and method.
Its complete scan and temporary lookup are deliberately simplified algorithms;
each control combination produces exact result rows and counted operations.
It expressly excludes early stop, indexes, collisions, memory pressure, sorting
and disk work. Counts have different units and are not added into a speed score.
The prose then reconnects these algorithms to indexed nested loops and the
real plan's early stopping. This prevents a blanket “nested loops bad” lesson.

Read the original Sam Who load-balancing opening and its first changes to the
experiment (https://samwho.dev/load-balancing/), alongside the retained house
query article and docs/writing-style.md. The useful technique is holding the
answer steady while changing the work, with prose explaining what changed.

## Primary evidence

Checked 14 October 2026, PostgreSQL 18 documentation. These sources support
consequential mechanisms, not claims about measured performance on a server.

- https://www.postgresql.org/docs/18/queries-table-expressions.html — join meaning,
  outer joins and the placement of filters; retains the original claim support.
- https://www.postgresql.org/docs/18/functions-aggregate.html — COUNT, SUM and
  absent inputs; retains the original result semantics.
- https://www.postgresql.org/docs/18/queries-order.html — explicit ordering and
  unspecified result order without it.
- https://www.postgresql.org/docs/18/planner-optimizer.html — sequential/index
  paths, nested-loop, hash and merge joins; preserving results under alternatives.
- https://www.postgresql.org/docs/18/using-explain.html — observed and estimated
  rows, operation trees, materialization and repeated-operation averages.
- https://www.postgresql.org/docs/18/sql-explain.html — ANALYZE executes the
  statement; the receipt command intentionally suppresses timing/cost detail.
- https://www.postgresql.org/docs/18/planner-stats.html — ANALYZE, approximate
  distributions and correlation/estimation limits.

`verify.mjs` records actual PostgreSQL results and the plan in `observed.json`.
It also compares all nine interactive data combinations against an SQL equality
join, checks both algorithms agree, and checks operation counts. This is semantic
validation of the teaching model, not timing evidence or concurrency testing.

Independent reader/technical review and assembled-page browser QA are coordinated
by the parent authoring agent. Record their findings and repairs before declaring
the article ready.
