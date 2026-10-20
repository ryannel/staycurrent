# a25 source and evidence ledger

Checked 20 October 2026. Scope: index choice for a relational workload, PostgreSQL 18.6 as the observed engine. All five interactive figures use an invented twelve-order model; their entry, distinct-page and row-visit counts are not native execution counters. InnoDB locator and GIN contrasts are documentation-only.

## Primary sources

- https://www.postgresql.org/docs/18/indexes-multicolumn.html — ordered keys, leading equalities and range, later constraints, PostgreSQL 18 skip scan. Avoids a categorical leftmost-prefix rule.
- https://www.postgresql.org/docs/18/indexes-ordering.html — forwards/backwards scan, mixed directions, null placement and bounded first-page opportunity.
- https://www.postgresql.org/docs/18/indexes-bitmap-scans.html — index combination, additional work and loss of order.
- https://www.postgresql.org/docs/18/indexes-index-only-scans.html — separately stored heap/index, coverage, payload, visibility map and heap fetches; density and update costs.
- https://www.postgresql.org/docs/18/indexes-partial.html — subset predicates and implication; generic parameter clauses cannot prove value-specific predicate. The article qualifies this with native custom/generic comparison instead of declaring all prepared statements ineligible.
- https://www.postgresql.org/docs/18/indexes-expressional.html — stored expression values, write-time evaluation.
- https://www.postgresql.org/docs/18/sql-createindex.html — immutable functions/operators, INCLUDE search/uniqueness distinction and operational build caveats (procedures delegated).
- https://www.postgresql.org/docs/18/indexes-opclass.html and https://www.postgresql.org/docs/18/indexes-collations.html — supported comparisons/cross-type families, collation-specific indexing.
- https://www.postgresql.org/docs/18/sql-prepare.html — prepared custom/generic information.
- https://www.postgresql.org/docs/18/sql-explain.html — rows/loops, buffers, timing disabled, WAL and execution effects.
- https://www.postgresql.org/docs/18/storage-hot.html — same-page opportunity and index-column restrictions; article says ordinary indexes to avoid incorrect generalisation about summarising indexes.
- https://www.postgresql.org/docs/18/ddl-constraints.html — primary/unique index creation, no automatic referencing-side foreign-key index, dependencies.
- https://www.postgresql.org/docs/18/datatype-json.html#JSON-INDEXING — GIN jsonb_ops and jsonb_path_ops operators; no B-tree date-order claim, no measured GIN performance claim.
- https://dev.mysql.com/doc/refman/8.4/en/innodb-index-types.html — secondary locators carry clustered key (documentation contrast only).

## Native evidence

`evidence/verify.mjs` creates its own uniquely named `rel3_a25_run*` database, closes its session and drops that database. It writes full JSON plans, exact returned rows, definition-time allocations, runtime and overrides to `evidence/raw-results.json`. All captures succeeded and identical history results were asserted across alternatives. The third run supersedes earlier runs, retaining related-row lookup evidence and asserting exact custom/generic prepared results.

Retained run: `rel3_a25_run1792453976129` on PostgreSQL 18.6 (Homebrew), aarch64 Darwin. Shared buffers 32 MB, work_mem 4 MB, timezone UTC. Session reports max_parallel_workers_per_gather=2 but shared server has no available parallel workers; captured plans are non-parallel. No restart, cache flush, server configuration change, global counter reset or other article's fixture was used. Single-session sequential captures, bounded by server's 30-second statement and five-second lock limits.

Fixture orders: 30,000 rows, tenant `(g % 100)+1`, time 1 January plus `g` minutes, five per cent pending, integer total and 100-character note. Every tenant has 300 rows; tenant 42 has 170 history rows since 10 January. A related table has 90,000 lines, three per order, with primary key `(order_id, line_no)`.

Captured buffers are accesses, not distinct pages. There is no counter of all tested B-tree entries. No latency speed-up, device-I/O or sustainable-throughput claim is made.

| Case | Observed evidence |
| --- | --- |
| History candidates | No candidate: 613 hits / 0 reads; tenant only: 300 / 2; date first: 13 / 5; tenant/date: 10 / 2; tenant/status/date: 172 / 4. All return identical ten rows. Full scan rejects 29,830 rows; tenant-only route tests 300 heap rows and rejects 130. |
| Pending variant | History key finds 170 candidates and rejects 162 by status; status-prefix key finds eight directly. Both choose bitmap routes plus sorts. |
| Related join | Ten outer history rows; inner bitmap heap `actual rows=3 loops=10`, 30 joined rows. Existing line primary-key prefix supplies access. Incremental Sort completes line order. |
| Coverage | Ten heap fetches and 10 hits / 2 reads before vacuum; zero fetches and 3 / 0 after; one fetch and 4 / 0 after changing order 29940's note, another tenant's order sharing a relevant heap page. The last SELECT also reports 56 WAL bytes from read-side cleanup: not claimed as a zero-write execution. Both key-only and covering definitions allocate 1,228,800 bytes; article does not falsely report observed size growth. |
| Partial | 81,920 bytes versus 1,228,800 for full history key. Forced custom: ten hits; forced generic: 613 hits; identical eight-row results. Literal eligibility does not imply sort avoidance. |
| Expression | Direct timestamptz-to-date index fails with code 42P17 (immutable requirement). UTC expression bitmap route: 33 accesses; session-dependent cast sequential scan: 613 hits. Both count 1,440 in UTC; article does not claim time-zone-independent equivalence. Expression index is not separately analysed after creation: estimate 150 versus actual 1,440 remains in retained plan, without a general selectivity claim. |
| Write pair | Two 10,000-row tables, each with primary key and tenant/identifier secondary key, table fillfactor 70. Updating 1,000 totals generates 191,024 WAL bytes with key only and 333,584 with total included. Page-image conditions affect WAL; no universal multiplier or measured HOT percentage claimed. |

Overrides: `orders.autovacuum_enabled=false` only on this disposable fixture to isolate coverage visibility; reset before cleanup. Write-pair fillfactor 70 and disabled automatic vacuum are fixture-only settings; tables are destroyed with the database. Session `plan_cache_mode=force_custom_plan`, then `force_generic_plan`, explicitly exposes parameter information and is reset before other captures. No constraint or index semantic changes are deployed.
