# Indexing joins, sorting and pagination: brief and topic tree

Companion to the relational Indexes deep dive. File: `src/pages/learn/databases/relational/indexing-queries.astro`. Plan source: `docs/article-work/indexes/coverage-map-2026-10-17.md` section 6 (B1) and section 8.

## Reader

A backend engineer who has read, or is willing to skim, how a B-tree index finds rows, and who arrives with one query that is slow or about to be written: an order list with a filter and a sort, a keyset pagination index, a slow foreign-key delete, a `LIKE` search, an `OR` condition. They need to say which index the query wants, why, and how to see in a plan that the database used it. They may be on PostgreSQL, MySQL or SQLite.

Understanding sought: an index serves a query when the query's equality conditions, sort order and join columns line up with the order of the index entries. Each query shape is that one idea applied with a different twist, and each has a way of failing quietly.

## What the neighbours own (read, do not repeat)

- `indexes.astro` owns the mechanism: entries, B-tree, range scans, selectivity, composite order, covering, partial, expression, write cost, EXPLAIN reading. Another writer is adding "Indexing for a query" and "When the database ignores an index". This article is the applied catalogue behind both; it links to them by section.
- `large-results.astro` owns pagination semantics (offset skips under change, keyset boundary, cursors, exports). This article owns the index that serves a page and the evidence.
- `query-execution.astro` owns join algorithms. This article owns which join column to index and what the plan shows.
- `postgresql/query-execution.astro` owns generic against custom plans and PostgreSQL top-N. Linked from the partial-index caveat.

## Topic tree (built from the subject and reader first)

**1. A query has parts the index must line up with** (equality, range, order, limit, projection).
- 1.1 Order list: filter + sort + limit (C3). Rule: leading equality columns fixed, sort columns next. What breaks it: skipped middle column, range before sort, mixed directions, NULL order, collation. Needs measurement: none / (customer_id) / composite / middle column.
- 1.2 Grouping and distinct served by order (C10). Streaming aggregate; latest row per group by repeated top-1. Short. One measurement.

**2. Joins (C9, H3)**
- 2.1 Which side needs the index: the many side's join column, because the nested loop probes it; the one side is usually a primary key already. When no index is needed (hash/merge over most rows). Measurement: pages with and without.
- 2.2 Foreign keys: the delete or key update that scans the child; engines (PostgreSQL does not create, InnoDB does, SQLite recommends); a composite that leads with the FK column serves. Measurement.
- 2.3 Type and character-set agreement of join columns (MySQL charset, PostgreSQL cross-type). Folded into section 5.

**3. Pagination (C11)**
- 3.1 The index for a page: filter, order, tie-break. 3.2 What offset costs: pages read against depth; measured. 3.3 Keyset in each engine: row-value comparison (PostgreSQL, SQLite), expanded form (MySQL, and for mixed directions); the `OR` trap that turns the boundary into a filter; NULL sort columns; descending/NULL placement. Measurements.

**4. Conditions an index cannot see through (C6, C5)**
- 4.1 Column bare on one side: functions, arithmetic, casts, cross-type comparison. 4.2 Types, affinities, collations (PostgreSQL numeric/int; MySQL string vs number and charset; SQLite affinity). 4.3 Negation and leading wildcards. 4.4 Prefix `LIKE`: PostgreSQL non-C collation, `text_pattern_ops`, `COLLATE "C"`, case-insensitive; SQLite NOCASE/BINARY; MySQL range rule; trigram as the way to leading wildcard. Measurements.

**5. Combining conditions (C7, OR)**
- 5.1 `OR`: same column becomes `IN`; different columns need an index per branch and a combining step (BitmapOr, MySQL `Using union`, SQLite `MULTI-INDEX OR`); one unindexed or unselective branch ruins it. 5.2 `AND` across two single-column indexes against one composite; combined bitmaps give no order. Measurements.

**6. Shapes that recur (D6, D10, H2)**
- 6.1 Queue: partial index of the queued rows; the parameter caveat. 6.2 Soft delete: partial unique index. 6.3 Tenants: tenant first; skew. Time-series: pointer to BRIN in `postgresql/indexes.astro`. Measurements.

**7. Where the numbers come from, sources.**

## Left out on purpose

- Design procedure and diagnostic checklist: the parent's new sections. Linked, not repeated.
- Join algorithms themselves, offset-versus-keyset semantics, cursors: neighbours.
- Index maintenance, bloat, rebuilds: the planned maintenance companion.
- Covering/INCLUDE, expression and partial mechanics: parent. Used here, not taught.
- Time-series tables and BRIN: `postgresql/indexes.astro`.
- Partitioned-table indexes: `partitioning-and-sharding.astro`.
- InnoDB measurement: no MySQL server was available (no install, Docker daemon stopped). MySQL statements rest on the 8.4 manual, quoted in evidence.md, and are worded as the manual's claims.

## Media decision

No new figure and no new interactive. Each part is a rule plus a measured table; a figure would restate a table. The runnable experiment is a downloadable script (same convention as the parent's `index-experiment.sql`). A guided sandbox lesson is not added: it would need `src/lib/sql-sandbox-tutorials` changes outside this commission; flagged to the coordinator.
