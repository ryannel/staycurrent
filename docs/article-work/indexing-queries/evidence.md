# Evidence: Indexing joins, sorting and pagination

Checked 17 October 2026.

## Environment

- PostgreSQL 18.6 (Homebrew, aarch64), own cluster in the session scratchpad, port 58217 on a private socket directory, `shared_buffers=128MB`. Database collation provider ICU, locale en-US, so "non-C collation" is real. Server stopped at the end.
- SQLite 3.51.0 (`/usr/bin/sqlite3`).
- MySQL: not installed, Docker daemon not running. No InnoDB measurement. Every MySQL statement is from the 8.4 manual, fetched and read on this date (sources below). Where the manual was silent the article says so.
- Reproduce: `setup.sql`, `helpers.sql`, `experiment.sql` (concatenated as `download.sql`, which the article offers for download). Output: `observed.txt`. Page counts are shared buffers hit + read for the whole plan. `setup.sql` ends with `VACUUM ANALYZE` because index-only counts (GROUP BY, latest-per-customer, global feed) depend on the visibility map; without it they were 1,725 and 4,007 instead of 52 and 3,008.
- The one expected error in `observed.txt` is the duplicate-key rejection in the soft-delete test.

## Measured (PostgreSQL 18.6), all in `observed.txt`

| Claim in article | Result |
| --- | --- |
| Order list (customer 42, LIMIT 20) no index / `(customer_id)` / `(customer_id, placed_at DESC)` | 1,728 / 62 / 23 pages |
| Middle column `(customer_id, status, placed_at DESC)`, query without status / with status | 63 (sort) / 23 |
| `(customer_id, placed_at DESC, status)` with status filter | 26 |
| Mixed direction ASC, DESC with both-ASC index / matching index | 24 (Incremental Sort) / 23 |
| Global feed `(placed_at DESC, order_id DESC)` and ascending index read backward, index-only | 3 / 3 |
| GROUP BY customer_id count(*) with `(customer_id)` / adding sum(total) | 52 / 1,725 (HashAggregate) |
| Latest order per customer, LATERAL + LIMIT 1, all 1,000 / 5 north customers / 5 north with no index | 3,008 / 23 / 8,632 |
| Join 5 north customers to orders, no FK index / with | 1,732 (Hash Join, Seq Scan) / 317 (Nested Loop, Bitmap) ; customer-id index is 52 pages |
| FK delete of a childless customer: orders pages / index pages, with `(customer_id)`; without; with composite leading customer_id | 0 / 3; 1,725; 0 / 4 (via `pg_stat_get_xact_blocks_fetched` deltas in a rolled-back transaction) |
| Feed first page / OFFSET 19,980 / keyset after the same boundary / OFFSET 59,960 | 4 / 654 / 4 / 1,956; no index 1,725 either way |
| Mixed-direction continuation as `OR`, index `(placed_at DESC, order_id ASC)` | 654, condition under Filter, 19,980 rows removed |
| Same, with `placed_at <= $1 AND (placed_at < $1 OR order_id > $2)` | 4, range under Index Cond |
| NULL in keyset sort column | 20-row test: `(shipped_at, id) < (now(), 10)` counted 15 of 20; `(NULL, 5) < (now(), 10)` is NULL. PG DESC puts NULLs first (observed). |
| `LIKE 'ab1%'` (13 rows of 60,000): none / default index / `text_pattern_ops` / `COLLATE "C"` index / `lower(email)` pattern index with `lower(...) LIKE` / same index with `ILIKE` | 442 / 442 / 16 / 16 / 16 / 442. The C-collated index serves the query as written; plan shows `Index Cond: email >= 'ab1' AND email < 'ab2'`. |
| `LIKE '%ab1%'` (156 rows): default / pg_trgm GIN | 442 / 135; GIN index 471 pages, btree 367 |
| `OR` across columns: customer or pk / customer or `placed_at >=` / customer or `status='pending'` / customer or unindexed `total` | 65 (BitmapOr) / 94 / 427 (12,048 rows) / 1,725 (Seq Scan) |
| `customer_id = 42 OR customer_id = 43`; `IN (42,43,44)` | 65; 66 |
| OR via UNION, UNION ALL with exclusion, plain OR with composite + pk | 66 each |
| BitmapAnd customer 40-59 and total 20-22 / each alone / composite `(customer_id,total)` | 20 / 96 and 53 / 23 |
| customer 42 + one-week range: single customer index (filter) / composite `(customer_id, placed_at)` | 62 / 17 |
| Bare-column table: date range 49; `date_trunc` 1,725; `customer_id + 0`, `::text`, `= 42::numeric` 1,725; `= 42::bigint` 65; `ANY(ARRAY[42,43])` 65; `<> 42` and `NOT IN (1,2,3)` 1,725 | as stated |
| Queue: full `(state, created_at)` claim / partial claim; index sizes | 4 / 3 pages; 234 / 4 pages. `state <> 'done'` with partial index: 1,164 (Seq Scan + Sort). Generic plan (`plan_cache_mode = force_generic_plan`) with `state = $1`: Seq Scan + Sort; custom plan uses the partial index. |
| Soft-delete partial unique on `lower(email) WHERE deleted_at IS NULL` | reinsert after soft delete accepted; `DUP@example.com` rejected while live row exists |
| Tenant skew (events, tenant 1 = half): `(tenant_id, created_at DESC)` newest 20 big / small; whole big / small tenant; `created_at`-only index big / small | 4 / 24; 1,091 Seq Scan / 124; 3 / 210 |

Not reproducible and therefore not cited: the claim pages for a queued-job claim right after 500 jobs left the queue before vacuum varied between 4 and 14.

## Measured (SQLite 3.51.0, `EXPLAIN QUERY PLAN`)

- `WHERE customer_id=42 ORDER BY placed_at DESC LIMIT 20`: with `(customer_id)` the plan adds `USE TEMP B-TREE FOR ORDER BY`; with `(customer_id, placed_at DESC, order_id DESC)` no sort step.
- Row value `(placed_at, order_id) < (?, ?)` with an index on `(placed_at DESC, order_id DESC)`: `SEARCH ... USING INDEX (placed_at<?)`. Only the first column bounds the search.
- `customer_id=42 OR order_id=777`: `MULTI-INDEX OR`. `customer_id=42 OR status='x'` with no status index: `SCAN`.
- `customer_id=42 AND placed_at>? AND total>?`: a single index (`customer_id=? AND placed_at>?`). Two range conditions on different single-column indexes: one index used.
- `LIKE 'ab1%'`: `SCAN` with a plain index; `SEARCH ... (email>? AND email<?)` with an index `COLLATE NOCASE`; `GLOB 'ab1*'` uses the plain (BINARY) index; with `PRAGMA case_sensitive_like=ON` the plain index is used for LIKE.
- TEXT column `= 42`: index searched (affinity); `code + 0 = 42`: `SCAN`.
- FK delete on parent with 600,000 child rows (3,503 pages): about 12 ms without a child index, under 1 ms with one (`.timer`, one run, laptop). Not repeated; described as rough.

## MySQL 8.4 manual (read, not run)

- Foreign keys: referencing table needs an index with FK columns first, "created on the referencing table automatically if it does not exist", may be silently dropped if another index can enforce it (create-table-foreign-keys.html).
- Index merge `Extra` values `Using intersect(...)`, `Using union(...)`, `Using sort_union(...)`, `type` `index_merge`; the page suggests distributing terms of deep AND/OR nesting (index-merge-optimization.html).
- ORDER BY: index homogeneity, mixed directions need a matching mixed index or its exact reverse, InnoDB primary key is part of every secondary index (order-by-optimization.html).
- Row constructors: the `(c2,c3) > (1,1)` example after `c1=1` used only the `c1` part (key_len 4); the expanded OR form used all three parts (row-constructor-optimization.html). The manual does not say whether a bare `(a,b) > (x,y)` is range-optimised; the article tells the reader to check `EXPLAIN` key length.
- LIKE: a range condition when the argument is a constant not starting with a wildcard (range-optimization.html).
- String column vs number precludes the index; nonbinary string columns with different character sets preclude it (mysql-indexes.html).
- NULL ordering (NULL lowest in MySQL and SQLite) and the absence of `NULLS FIRST/LAST` in MySQL, `NULLS FIRST/LAST` in SQLite since 3.30: from memory of the manuals, not fetched. Low risk; verify before final review.
- MySQL has no partial indexes and a generated-column workaround for soft-delete uniqueness: from memory; verify.

## PostgreSQL 18 manual (fetched)

queries-limit (skipped rows "still have to be computed inside the server"), indexes-opclass (`text_pattern_ops`; usable with LIKE when not C locale; `_pattern_ops` indexes serve equality but not `<`), ddl-constraints (FK referencing column not indexed automatically; delete scans referencing table).

## SQLite docs (fetched)

optoverview (LIKE conditions: TEXT affinity or pattern not starting with digit/minus; GLOB needs BINARY; LIKE needs NOCASE index unless `case_sensitive_like` ON then BINARY; OR to IN rewrite; multi-index OR is the exception to one index per table), foreignkeys (child key index "almost always beneficial"; scan of child table otherwise).

## Open items

- No InnoDB run: index merge wording, LIKE range, FK auto-index, mixed-direction ORDER BY and row-constructor behaviour are the manual's word.
- No guided sandbox lesson (would need edits to the sandbox tutorial registry); a downloadable script instead.

## Repair pass (after trio reviews)

- Added measurements (experiment section 6b): `SELECT DISTINCT customer_id` 1,725 pages without an index, 52 with `(customer_id)`; `DISTINCT ON (customer_id)` latest order with the composite index 299 pages for all 1,000 customers (against 3,008 for the lateral form).
- Offset 59,960 reading 1,956 pages (more than the 1,725-page table): index pages plus about 1,700 table pages. Explained in the article.
- Bigint literal 65 pages against 62: Bitmap Index Scan read 5 index pages (cold) against 2; same route. Cause of the extra pages not investigated.
- MySQL facts fetched 17 Oct: column-indexes (prefix 767 / 3072 bytes by row format, characters not bytes, longer search terms exclude non-matches then check the table), innodb-limits (limits scale with page size: 1536 at 8 kB, 768 at 4 kB), group-by-optimization (`Using index for group-by`, loose index scan conditions incl. whole-column values only).
- From memory, unverified: MySQL supports LATERAL derived tables and lacks DISTINCT ON; PostgreSQL's btree entry limit is about a third of a page (about 2.7 kB); `Using filesort` as MySQL's sort marker.
- SQLite: only 3.51.0 was run; the page states that.
