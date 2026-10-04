# Query articles: evidence and production notes

4 October 2026. Scope and commission live in `brief.md`. This record covers only
`query-results.astro`, `large-results.astro`, their components under
`src/components/explainers/querying/`, and the `query-*` practice artifacts here.
Drafts are not authorised publications. Root coordinates independent review,
rendered checks and the repository build.

## Argument and prerequisites

**Queries and joins** begins with a query and a result as its own rows and columns,
then introduces SELECT/FROM/WHERE, expressions, aliases, ordering, join matches,
outer-join absence, row grouping and existence tests. It follows the previous
articles' exact C4/P7/O12/O13 facts. The audience only needs the relational
introduction's table/row/key concepts; no unseen SQL course is assumed. Explicit
column lists interpret extension inserts. An application parameter bridge prevents
copying literal interpolation into caller-facing SQL.

One article remains justified: every step asks what one result row means. The
shipment fanout gives a substantive failure and a completed repair, not only a
warning about joins. Boundaries: query plan mechanics, window functions and a
catalogue of SQL syntax remain outside this practical question.

**Pagination and large results** starts from an answer's ordering and continuation,
then changes visible records. It distinguishes three contracts: live browsing,
fixed export, and work with a checkpoint. Local explanations establish ordinary
Read Committed views and a snapshot before linking to the isolation article. The
cursor example is intentionally a bounded export held on one connection; no
long-lived transaction is recommended for a person browsing a website.

Each page has its own fresh practice database. O14 is reused as an intentionally
empty header in querying examples and must not be carried into checkout setup.
The downloads explicitly state that article extensions are separate.

## Source record

All sources checked online 4 October 2026; versions are PostgreSQL 18. The
PostgreSQL documentation supplies semantics. Shop-specific choices, adversarial
fixtures, diagram compositions and design conclusions are our worked examples.

| Source | Claims / next reading | Reader prerequisite |
| --- | --- | --- |
| https://www.postgresql.org/docs/18/tutorial-select.html | SELECT output, expressions, aliases, filtering and ordering | Tables and columns |
| https://www.postgresql.org/docs/18/tutorial-join.html | Matching records and retaining an unmatched left record | A simple SELECT |
| https://www.postgresql.org/docs/18/queries-table-expressions.html | Join multiplicity, ON versus WHERE, GROUP BY and HAVING | Basic SQL; deeper reference |
| https://www.postgresql.org/docs/18/tutorial-agg.html | Group-level calculations and filtering | A simple SELECT |
| https://www.postgresql.org/docs/18/functions-aggregate.html | COUNT(*) versus COUNT(expression); SUM and absent input | NULL and grouping |
| https://www.postgresql.org/docs/18/queries-select-lists.html | DISTINCT removes equal output rows; naming output | Query results |
| https://www.postgresql.org/docs/18/functions-subquery.html | EXISTS / NOT EXISTS; correlated outer value; SELECT 1 convention | SELECT and filters |
| https://www.postgresql.org/docs/18/functions-comparison.html | Unknown comparisons and explicit IS NULL | Missing-value representation |
| https://www.postgresql.org/docs/18/libpq-exec.html | Values passed separately with $1 parameters; driver API differs | Database client code |
| https://www.postgresql.org/docs/18/queries-order.html | Ordering ties, direction and no implicit order | Query results |
| https://www.postgresql.org/docs/18/queries-limit.html | LIMIT/OFFSET semantics and cost of skipped rows | Ordering |
| https://www.postgresql.org/docs/18/functions-comparisons.html#ROW-WISE-COMPARISON | Lexicographic row comparison and NULL boundary | Ordering pairs |
| https://www.postgresql.org/docs/18/indexes-ordering.html | Index supplies ordered access in suitable cases; no benchmark claim | Index concept from introduction |
| https://www.postgresql.org/docs/18/transaction-iso.html | Ordinary Read Committed statement views; Repeatable Read snapshot | Transactions introduced locally |
| https://www.postgresql.org/docs/18/sql-declare.html | Cursor transaction/connection lifecycle, non-scroll choice | Cursor introduced locally |
| https://www.postgresql.org/docs/18/sql-fetch.html | FETCH groups and forward progress | DECLARE cursor |
| https://www.postgresql.org/docs/18/routine-vacuuming.html | Old versions must remain while active transactions can need them | Snapshot concept |

Original voice reference read: Sam Who, *Load Balancing*, opening through the
round-robin limitation. The useful teaching choice is to change one visible
condition and follow its consequence while retaining the same records. No prose
or diagram copied. Existing house introduction, predecessor articles and drawing
components read before authoring. Authoring/style/research skills applied, including
local prerequisite and complete-practical-example guidance.

## Reproducible observations

Run from repository root:

```sh
node docs/article-work/querying-transactions/query-verify.mjs
```

The verifier extracts template-string SQL directly from both article source files,
checks outputs against independently written expected records, then regenerates
the downloadable `query-results.sql` and `query-pagination.sql`. Existing test
runtime: `/private/tmp/staycurrent-design-sql/node_modules/@electric-sql/pglite/dist/index.js`.
A `PGLITE_MODULE` override supports another installed copy without changing the repo.

Verified 26 outcomes with PostgreSQL 18.3 / PGlite 0.5.8. Exact statements and outputs
are retained in `query-results-observed.json`. Cases cover the basic receipt,
product join, outer join, both placements of the date filter, empty-order counts,
HAVING, four line/shipment combinations, corrected independent totals, EXISTS and
NOT EXISTS, driver parameter binding, EXISTS after a second mug line, complete
pagination pairs under four changes plus boundary-row deletion, final one-row page,
index DDL, and the three database-cursor fetches.

These are single-connection checks. Mutation experiments deliberately simulate
successive visible states using a transaction and rollback between cases. They do
not demonstrate multi-session snapshot retention or concurrency. Cursor visibility
under concurrent change is documented behaviour; ExportViews labels that boundary.
No performance result is claimed.

## Media intentions and limits

- `QueryShape.astro`: three source lines include identity, product, quantity and
  agreed price. Three answers distinguish individual lines, qualifying order
  identities and grouped amounts. The figure does not imply a physical plan.
- `JoinFanout.astro`: two lines and two order-level shipments visibly make four
  pairings. Every amount appears twice, producing 88 rather than 44. Shipment rows
  contain no line-level membership, a limit stated in the caption.
- `PaginationLab.astro`: a native select changes one event after the same first
  page. Visible rows and both continuations are computed from that one dataset.
  Insert, delete and moved-key cases explain the boundary's success and limits.
  Controls have the house blue region; records use flat paper/ruled treatments.
  Fixed fallback and a noscript explanation preserve the main consequences.
- `ExportViews.astro`: same oldest-first source order, same O14 correction. A new
  query sees reordered records; a cursor in the open snapshot reads O14 at its
  earlier time. An enclosing boundary denotes the single transaction. This is a
  documented visibility illustration, not an observed multi-session run.
- `Sql.astro` and `ResultTable.astro` render accessible horizontally scrollable
  regions, with caption/label and keyboard focus. They use existing shared styles.

All diagrams reuse SketchSheet, SketchArrow, and paper theme tokens; phone layouts
reflow into vertical sequences. Browser inspection, keyboard/select exercise,
light/dark rendering and production build are pending root's assembled review.
