# Index order and join work: lesson evidence

Executed 15 October 2026. These two bounded lessons bring the existing articles' central experiments into the browser. They reuse the original generated record meanings and IDs, with independent table names. They do not add index-only visibility, prepared-plan or spill exercises already covered elsewhere.

## Module and integration

`src/lib/sql-lessons/relational-depth-performance.ts` exports `relationalDepthPerformanceTutorials`:

- `index-order`: six steps; article `/learn/databases/relational/indexes/`.
- `join-work`: five steps; article `/learn/databases/relational/query-execution/`.

Root owns shared imports and article links. Good insertion points are the existing practice invitation under indexes `#check` and query-execution `#reading-a-plan`. Keep the introductory selectivity/aggregate lesson available, but point the deeper article to its matching experiment. The setup counts and IDs intentionally match the articles; table prefixes distinguish them from the sandbox's small receipt fixture.

## Executed observations

`verify-lessons.mjs` executes every lesson statement without rewriting it on PostgreSQL 18.6 and PGlite's PostgreSQL 18.3. It asserts full unchanged result rows across the two index replacements, fixed expected IDs, report totals, the claimed observed plan mechanisms, and restoration of the local join settings. It also executes the suggested no-status variation. `observed.json` retains the actual result sets and complete textual plans. No elapsed-time performance ranking is inferred.

For index order:

- Customer 42 has 60 orders, 15 on or after February 1. The initial history IDs are 59041 down to 50041 in increments of 1,000.
- The customer-only path finds 60 candidates, removes 45, and sorts 15 before returning ten.
- The customer/time/ID path returns the identical full rows with ten scan outputs and no sort.
- Adding the paid filter makes that path inspect 12 candidates: two are removed before ten are returned.
- Putting status before time preserves the full paid result rows, while eliminating those pending candidates from the scan.
- The pending variation returns three IDs, 55041, 50041 and 45041. Both observed planners choose a bitmap scan and tiny sort for this request even though an ordered path exists. The lesson explicitly preserves this useful distinction between an index's capability and the selected plan.
- Removing status with the final index returns the original ten IDs but needs a sort to combine status groups into time order.

For join work:

- The setup is 10,000 orders and 30,000 lines; customer 42 owns 42, 1042, …, 9042.
- The narrow nested loop probes three lines ten times, then groups 30 joined rows into quantities 30/20/10 for products 3/2/1.
- The broad hash join builds from 10,000 orders and probes with 30,000 lines; it returns 30,000/20,000/10,000 units.
- Discouraging hash and nested-loop joins within one transaction produces a merge over ordered primary-key scans. The broad totals are identical. ROLLBACK restores both settings.
- The intermediate request has 1,000 qualifying orders, 3,000 joined lines and totals 3,000/2,000/1,000. The observed hash join still scans all 30,000 line rows. Output size is not all input work.

The assertions deliberately check the recorded mechanisms on these tested versions as well as semantics; they are not promises that future PostgreSQL releases must select the same plan. The lesson says plans can vary and asks readers to interpret theirs.

## Repeating the verification

From the repository root, with dependencies installed and the isolated native lab available:

```sh
node --experimental-strip-types docs/article-work/relational-depth-review/performance/verify-lessons.mjs
```

The verifier uses the review lab's `pg` module at `/private/tmp/staycurrent-pg-lab/node_modules/pg/lib/index.js`, socket `/private/tmp/staycurrent-relational-depth/socket`, port 55439, user `ryannel`. PGHOST/PGPORT/PGUSER can select an equivalent disposable local lab. It creates only its own `sc_depth_performance` database when absent and replaces only the lessons' prefixed tables there. It leaves those practice tables for inspection and closes both connections. Never point this review helper at a production server. Browser users need neither this helper nor a server installation; each lesson contains its complete setup and restarts from it.

The native verifier and browser engine passed all eleven steps and the extra variation. A second full run verified setup repeatability. Scoped diff whitespace check passed. Root owns the site build and rendered sandbox verification.

## Primary references checked

- [PostgreSQL 18 multicolumn indexes](https://www.postgresql.org/docs/18/indexes-multicolumn.html): leading equalities and the next range bound the scan; the lesson fixes customer and optionally status before its date range.
- [Indexes and ordering](https://www.postgresql.org/docs/18/indexes-ordering.html): an ordered B-tree path can supply the required LIMIT directly, while a planner may still choose a sort.
- [Using EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html): actual per-loop rows, scan/filter/join work and plan variation. The forced alternative is labelled as an experiment, with transaction-local settings and error cleanup.
