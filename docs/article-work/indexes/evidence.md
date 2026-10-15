# Evidence for Indexes

Checked 15 October 2026. All external technical sources are the PostgreSQL 18
manual. The page is a working draft with noindex. Publication is not authorised.

## Primary sources and consequential claims

| Source | Used for | Boundary |
| --- | --- | --- |
| https://www.postgresql.org/docs/18/btree.html#BTREE-STRUCTURE | Root/internal/leaf pages, row references, page splits | Simplified figure is an invented eight-row tree, not a physical page dump |
| https://www.postgresql.org/docs/18/btree.html#BTREE-IMPLEMENTATION | Splits, version churn and cleanup | Does not claim every update rewrites every index or that every delete removes its entry immediately |
| https://www.postgresql.org/docs/18/indexes-intro.html | An additional access path and its maintenance costs | No claim that indexing changes logical query semantics |
| https://www.postgresql.org/docs/18/indexes-multicolumn.html | Leading equality/range access, later key checks, PostgreSQL 18 skip scan | Avoids the false absolute rule that an index is unusable without its first key |
| https://www.postgresql.org/docs/18/indexes-ordering.html | Ordered scan, backward direction, mixed directions, early LIMIT | SQL retains explicit ORDER BY, including order ID for ties |
| https://www.postgresql.org/docs/18/indexes-index-only-scans.html | Separate heap, covering INCLUDE, visibility map and heap fetches | Index Only Scan node does not promise zero heap accesses |
| https://www.postgresql.org/docs/18/indexes-bitmap-scans.html | Bitmap location collection and loss of index order; multiple-index combination | Does not imply every single-key lookup becomes a bitmap scan |
| https://www.postgresql.org/docs/18/indexes-partial.html | Subset indexes and planner predicate implication | No recommendation to build a partial paid index for this general screen; flags prepared-plan implication |
| https://www.postgresql.org/docs/18/routine-vacuuming.html | Upkeep, removed versions and visibility map | No production maintenance tuning prescription |
| https://www.postgresql.org/docs/18/sql-createindex.html#SQL-CREATEINDEX-CONCURRENTLY | Ordinary live index build blocks writes, concurrent build has tradeoffs | Article DDL operates only on a temporary practice table |
| https://www.postgresql.org/docs/18/using-explain.html | Actual rows, loops, EXPLAIN ANALYZE execution, TIMING OFF, BUFFERS | Counters and timings are distinct; no fabricated plan costs |

These are reusable reference candidates for readers familiar with SQL. The B-tree
chapter is internals detail; the chapter 11 pages give more approachable design
rules. The plan manual is suitable after the article's local plan explanation.

## Executed evidence

Run from repository root:

```sh
node docs/article-work/indexes/build-experiment.mjs
node docs/article-work/indexes/verify.mjs
```

Installed package: `@electric-sql/pglite` 0.5.8. Engine reports PostgreSQL 18.3
on wasm32. In-memory PGlite, temporary table, UTC timezone, ordinary planner
settings, no planner methods disabled. `observed.json` stores complete JSON plans,
result rows, relation sizes and engine identification. Engine timings in the raw
plans are incidental observations, not publishable comparisons or benchmarks.

The verifier asserts the same ten order IDs through five states: primary key only,
customer index, composite index, covering before vacuum and covering after vacuum.
It checks baseline 59,985 rejected / 15 passing rows; customer bitmap's 60 candidate
rows and 45 rejected dates; removal of sort and ten output rows for the composite;
two pending candidates rejected for the paid-only variation; heap fetches 10 before
vacuum and 0 afterwards; and an index-only scan emitting 54,000 rows for the broad
sum. These are actual plan observations, not diagrams presented as benchmarks.

The covering-index table had 14,131,200 bytes, its additional covering index
2,998,272 bytes in this runtime. The primary-key index is separate and excluded.
The page rounds these values to 13.5 and 2.9 MiB and gives the setting.

The verifier executes the displayed write workload: 1,000 inserts, 200 amount
updates and 100 deletes. It asserts 60,900 remaining rows, the 200 corrected
amounts, and the newest history order 60041. It also runs the downloadable script
in a fresh PGlite session, separating VACUUM from implicit multi-statement
transactions. The download includes matching SQL assertions. Use `psql -f` or
individual statements with autocommit; VACUUM cannot run inside a transaction.

Temporary tables and PGlite do not establish physical storage latency, logging
cost, network latency, concurrent production write performance, or autovacuum
behaviour. The article explicitly tells the reader to test durable ordinary tables
and their actual prepared application queries for a deployment decision. The
benchmark outcome is intentionally not invented. The regular distribution also
does not demonstrate skew; representative large and small customers are part of
the proposed real workload validation.

## Media checks to complete

Author inspected the source values and mappings. Root/leaf example has eight index
entries and exactly the same eight table references. D/E/F occur on two table
pages. Composite excerpt dates follow the generator for customers 41, 42 and 43;
only customer 42 is highlighted. Both use theme-aware tokens and existing sketch
surfaces. The phone layout stacks child pages and retains readable labels instead
of shrinking the three-column illustration.

Parent batch owns independent first reading, technical/media review and rendered
light/dark desktop/phone inspection. Carry findings into a review record before
promoting the draft's editorial status.

## Coordinated review

The [batch review and verification record](../access-and-persistence/review.md)
records the independent readings, repairs, browser checks and final draft status.
The author-handoff notes above describe the earlier state before those checks.
