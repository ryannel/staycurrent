# a05 — source and verification record

Checked 19 October 2026. This record belongs to the staged parent article, **Understanding and improving database performance**. It is draft evidence, not publication authority.

## Primary sources and claim scope

- PostgreSQL 18 [Using EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html): operator dependencies, scans, nested-loop/hash/merge joins, grouping and sorting, rows emitted, inclusive costs/timing, per-loop averages and LIMIT consumption. The article's shortened plan is from our own capture, not the manual's examples.
- [EXPLAIN](https://www.postgresql.org/docs/18/sql-explain.html): ANALYZE executes effects; buffer accesses include descendants; TIMING OFF preserves statement execution time but removes per-node times; instrumentation overhead; buffer read is not necessarily device I/O. Effects beyond transactional rollback (sequences/external functions) remain a reason to use disposable data.
- [Planner statistics](https://www.postgresql.org/docs/18/planner-stats.html) and [ANALYZE](https://www.postgresql.org/docs/18/sql-analyze.html): approximate distributions, sampled summaries and refresh after drift. We intentionally preserved old customer statistics in a disposable fixture rather than claiming a production autovacuum failure.
- [Page layout](https://www.postgresql.org/docs/18/storage-page-layout.html): usual 8 KiB pages, heap organisation, row locators and inline/out-of-line data. Figure 2 invents six rows per page; its counts are arithmetic, not a PostgreSQL page-capacity claim.
- [Routine vacuuming](https://www.postgresql.org/docs/18/routine-vacuuming.html): row-version retention, eligible cleanup, reusable versus returned space and ordinary vacuum.
- [Resource consumption](https://www.postgresql.org/docs/18/runtime-config-resource.html): shared buffers, per-operation work_mem, hash multiplier and concurrent/parallel multiplication. No global server settings changed.
- [Multicolumn indexes](https://www.postgresql.org/docs/18/indexes-multicolumn.html) and [index-only scans](https://www.postgresql.org/docs/18/indexes-index-only-scans.html): B-tree key constraints, PostgreSQL 18 skip scan, coverage and visibility-map requirements. Index design here is a candidate explanation, not another captured intervention.
- [Cumulative statistics](https://www.postgresql.org/docs/18/monitoring-stats.html): activity samples, waits, cumulative counters and observation boundaries.
- [PREPARE](https://www.postgresql.org/docs/18/sql-prepare.html): generic/custom plan information and application preparation differences. The parent does not claim to have run prepared variants.
- [pgbench](https://www.postgresql.org/docs/18/pgbench.html): weighted scripts, random seed, clients, completed transactions, per-transaction logging and latency units. pgbench 18.6 was used in simple query mode.

## References and scope

Read the full fixed Sequence diagrams, Indexes and Storage and durability reference articles, their figure descriptions and representative rendered figures on the fixed preview at localhost:4337. Applied their concrete running example, cause/changed-result comparisons, labelled models versus measurements, reader-controlled cases and explicit limitations. All five new figures have case buttons, Back/Next, keyboard-native controls and an all-cases text alternative. Parent covers the complete statistics diagnosis-to-comparison loop; child links are optional after its closing method. No tree change proposed.

## Native runtime and limits

Own database: `rel3_a05_run1`, on the orchestrator-owned disposable PostgreSQL cluster at 127.0.0.1:57319. PostgreSQL 18.6 (Homebrew), aarch64-apple-darwin25.6.0, Apple clang 21.0.0, 64-bit. Binary directory `/opt/homebrew/Cellar/postgresql@18/18.6_1/bin`. Shared runtime configuration from `runtime.md`: 12 connections, 32 MB shared buffers, 4 MB work_mem, 32 MB maintenance_work_mem, no parallel workers, 30 s statement and 5 s lock timeout, UTC. Only per-table `autovacuum_enabled=false` on this article's disposable customer table; reset after verification. No server restart, reconfiguration, checkpoint, cache clearing or global change.

Captured plans use ANALYZE, BUFFERS, TIMING OFF, FORMAT JSON. Fully warmed reads; no shared reads in retained before/after plans. Counts are accesses, not distinct pages. The short run is not production benchmarking. Before rounds all precede the refresh and after rounds; repeated revisions cause update churn. Same data cardinality/query meaning, but no claim that every physical condition is identical. No CPU, device I/O, WAL, durable-flush validation, full maintenance cycle, driver/HTTP handler, pool or open-loop load test was performed. pgbench timings include its client exchange and SQL execution; connection setup is excluded from reported throughput. Shared host activity may affect incidental timings.

## Reproduction

Create a fresh own disposable database (use a new suffix; do not overwrite another worker's fixture), then execute this setup:

```sql
CREATE TABLE customers (customer_id int PRIMARY KEY, region text NOT NULL) WITH (autovacuum_enabled=false);
CREATE TABLE orders (order_id int PRIMARY KEY, customer_id int NOT NULL REFERENCES customers, placed_at date NOT NULL, total numeric(10,2) NOT NULL, revisions int NOT NULL DEFAULT 0);
CREATE INDEX orders_customer ON orders(customer_id);
INSERT INTO customers SELECT i, CASE WHEN i<=10 THEN 'north' ELSE 'south' END FROM generate_series(1,10000) i;
INSERT INTO orders SELECT i, (i-1)%10000+1, date '2026-01-01'+((i-1)/10000), 10+(i%100),0 FROM generate_series(1,100000) i;
VACUUM ANALYZE customers;
VACUUM ANALYZE orders;
UPDATE customers SET region='north' WHERE customer_id BETWEEN 11 AND 8000;
SELECT version();
SELECT region,count(*) FROM customers GROUP BY region;
EXPLAIN (ANALYZE,BUFFERS,TIMING OFF) SELECT c.customer_id, sum(o.total) AS spent FROM customers c JOIN orders o USING(customer_id) WHERE c.region='north' AND o.placed_at >= date '2026-01-01' GROUP BY c.customer_id ORDER BY spent DESC,c.customer_id LIMIT 10;
```

The setup's first text plan is an initial observation (39.357 ms, 96,098 shared hits). The retained comparison plan was captured afterwards with JSON: 43.946 ms and 96,104 shared hits. The article consistently uses the latter. Extra cached system/plan-related buffer work can vary across captures; it does not mean the physical data footprint grew by six pages.

Scripts used for the mixed comparison:

### lookup.sql

```sql
\set customer random(1,10000)
SELECT order_id,total FROM orders WHERE customer_id=:customer ORDER BY placed_at DESC,order_id DESC LIMIT 10;
```

### update.sql

```sql
\set order random(1,100000)
UPDATE orders SET revisions=revisions+1 WHERE order_id=:order;
```

### report.sql

```sql
SELECT c.customer_id, sum(o.total) AS spent FROM customers c JOIN orders o USING(customer_id) WHERE c.region='north' AND o.placed_at >= date '2026-01-01' GROUP BY c.customer_id ORDER BY spent DESC,c.customer_id LIMIT 10;
```

Each side: capture the report plan and result, then three runs of:

```sh
pgbench "$A05_URL" -n -c 3 -j 1 -t 200 --random-seed=205 --log   --log-prefix=/private/tmp/rel3-a05/before-1   -f lookup.sql@6 -f update.sql@3 -f report.sql@1
```

Here the script filenames are in the current directory; actual run used their full `/private/tmp/rel3-a05/` paths. For the after side, execute `ANALYZE customers;`, capture the plan/result again, and run identical commands with separate log prefixes. Finally `ALTER TABLE customers RESET (autovacuum_enabled);`. The mixed lookup is the history query without its redundant date condition and without returning placed_at; the standalone listing in the article introduces the general history shape. No composite index was added. Each run had 600 successful transactions, zero failures: 364 lookups, 176 updates, 60 reports. Each update increments a revision counter, preserving report amounts.

The retained report results before and after were byte-identical:

```text
99|1090.00
199|1090.00
299|1090.00
399|1090.00
499|1090.00
599|1090.00
699|1090.00
799|1090.00
899|1090.00
999|1090.00
```

## Per-run observations

p95 uses nearest rank: sort each script's latency observations in milliseconds and select rank `ceil(0.95 * n)` (one-based). This correction matters for small samples; do not interpolate or pool the rounds and call that the same range. The article shows p95 ranges across rounds, with rounding to three decimals for short requests and two for reports.

| Side | Round | Lookup median / p95 ms | Update median / p95 ms | Report median / p95 ms | Total TPS |
|---|---:|---:|---:|---:|---:|
| before | 1 | 0.100 / 0.169 | 0.130 / 0.296 | 44.388 / 55.926 | 552.587 |
| before | 2 | 0.092 / 0.148 | 0.121 / 0.258 | 43.719 / 55.117 | 586.519 |
| before | 3 | 0.101 / 0.160 | 0.131 / 0.305 | 47.365 / 56.611 | 531.640 |
| after | 1 | 0.100 / 0.146 | 0.128 / 0.266 | 15.040 / 15.836 | 1623.447 |
| after | 2 | 0.095 / 0.156 | 0.125 / 0.237 | 15.122 / 16.298 | 1408.484 |
| after | 3 | 0.094 / 0.134 | 0.120 / 0.221 | 14.875 / 15.731 | 1524.262 |

The pre/post report estimates and physical work support a limited acceptance of the stale-statistics explanation. Similar short-request p95 and zero failures are observations, not a proof of no possible regression. TPS is a short closed-loop completion rate, not sustainable arrival capacity.

## Correctness fixture

```sql
BEGIN;
CREATE TEMP TABLE customers (customer_id int PRIMARY KEY,region text NOT NULL);
CREATE TEMP TABLE orders (order_id int PRIMARY KEY,customer_id int NOT NULL REFERENCES customers,placed_at date NOT NULL,total numeric(10,2) NOT NULL);
INSERT INTO customers VALUES (1,'north'),(2,'north'),(3,'north'),(4,'south'),(5,'north');
INSERT INTO orders VALUES (1,2,'2026-01-01',10),(2,2,'2026-01-02',10),(3,3,'2026-01-01',20),(4,4,'2026-01-01',100),(5,5,'2025-12-31',200);
SELECT c.customer_id,sum(o.total) AS spent FROM customers c JOIN orders o USING(customer_id) WHERE c.region='north' AND o.placed_at>=date '2026-01-01' GROUP BY c.customer_id ORDER BY spent DESC,c.customer_id LIMIT 10;
DO $$BEGIN
 BEGIN
  INSERT INTO orders VALUES (6,2,'2026-01-01',NULL);
  RAISE EXCEPTION 'NULL should have been rejected';
 EXCEPTION WHEN not_null_violation THEN RAISE NOTICE 'NULL correctly rejected'; END;
END $$;
ROLLBACK;
```

Observed output (the NOTICE on stderr also confirmed NULL rejection):

```text
BEGIN
CREATE TABLE
CREATE TABLE
INSERT 0 5
INSERT 0 5
 customer_id | spent
-------------+-------
           2 | 20.00
           3 | 20.00
(2 rows)

DO
ROLLBACK
```

## Retained raw plans

Exact JSON plan capture before:

```json
[
  {
    "Plan": {
      "Node Type": "Limit",
      "Parallel Aware": false,
      "Async Capable": false,
      "Startup Cost": 994.84,
      "Total Cost": 994.86,
      "Plan Rows": 10,
      "Plan Width": 36,
      "Actual Rows": 10.0,
      "Actual Loops": 1,
      "Disabled": false,
      "Shared Hit Blocks": 96104,
      "Shared Read Blocks": 0,
      "Shared Dirtied Blocks": 0,
      "Shared Written Blocks": 0,
      "Local Hit Blocks": 0,
      "Local Read Blocks": 0,
      "Local Dirtied Blocks": 0,
      "Local Written Blocks": 0,
      "Temp Read Blocks": 187,
      "Temp Written Blocks": 188,
      "Plans": [
        {
          "Node Type": "Sort",
          "Parent Relationship": "Outer",
          "Parallel Aware": false,
          "Async Capable": false,
          "Startup Cost": 994.84,
          "Total Cost": 994.88,
          "Plan Rows": 18,
          "Plan Width": 36,
          "Actual Rows": 10.0,
          "Actual Loops": 1,
          "Disabled": false,
          "Sort Key": [
            "(sum(o.total)) DESC",
            "c.customer_id"
          ],
          "Sort Method": "top-N heapsort",
          "Sort Space Used": 25,
          "Sort Space Type": "Memory",
          "Shared Hit Blocks": 96104,
          "Shared Read Blocks": 0,
          "Shared Dirtied Blocks": 0,
          "Shared Written Blocks": 0,
          "Local Hit Blocks": 0,
          "Local Read Blocks": 0,
          "Local Dirtied Blocks": 0,
          "Local Written Blocks": 0,
          "Temp Read Blocks": 187,
          "Temp Written Blocks": 188,
          "Plans": [
            {
              "Node Type": "Aggregate",
              "Strategy": "Sorted",
              "Partial Mode": "Simple",
              "Parent Relationship": "Outer",
              "Parallel Aware": false,
              "Async Capable": false,
              "Startup Cost": 993.48,
              "Total Cost": 994.46,
              "Plan Rows": 18,
              "Plan Width": 36,
              "Actual Rows": 8000.0,
              "Actual Loops": 1,
              "Disabled": false,
              "Group Key": [
                "c.customer_id"
              ],
              "Shared Hit Blocks": 96098,
              "Shared Read Blocks": 0,
              "Shared Dirtied Blocks": 0,
              "Shared Written Blocks": 0,
              "Local Hit Blocks": 0,
              "Local Read Blocks": 0,
              "Local Dirtied Blocks": 0,
              "Local Written Blocks": 0,
              "Temp Read Blocks": 187,
              "Temp Written Blocks": 188,
              "Plans": [
                {
                  "Node Type": "Sort",
                  "Parent Relationship": "Outer",
                  "Parallel Aware": false,
                  "Async Capable": false,
                  "Startup Cost": 993.48,
                  "Total Cost": 993.73,
                  "Plan Rows": 101,
                  "Plan Width": 9,
                  "Actual Rows": 80000.0,
                  "Actual Loops": 1,
                  "Disabled": false,
                  "Sort Key": [
                    "c.customer_id"
                  ],
                  "Sort Method": "external merge",
                  "Sort Space Used": 1496,
                  "Sort Space Type": "Disk",
                  "Shared Hit Blocks": 96098,
                  "Shared Read Blocks": 0,
                  "Shared Dirtied Blocks": 0,
                  "Shared Written Blocks": 0,
                  "Local Hit Blocks": 0,
                  "Local Read Blocks": 0,
                  "Local Dirtied Blocks": 0,
                  "Local Written Blocks": 0,
                  "Temp Read Blocks": 187,
                  "Temp Written Blocks": 188,
                  "Plans": [
                    {
                      "Node Type": "Nested Loop",
                      "Parent Relationship": "Outer",
                      "Parallel Aware": false,
                      "Async Capable": false,
                      "Join Type": "Inner",
                      "Startup Cost": 4.15,
                      "Total Cost": 990.12,
                      "Plan Rows": 101,
                      "Plan Width": 9,
                      "Actual Rows": 80000.0,
                      "Actual Loops": 1,
                      "Disabled": false,
                      "Inner Unique": false,
                      "Shared Hit Blocks": 96098,
                      "Shared Read Blocks": 0,
                      "Shared Dirtied Blocks": 0,
                      "Shared Written Blocks": 0,
                      "Local Hit Blocks": 0,
                      "Local Read Blocks": 0,
                      "Local Dirtied Blocks": 0,
                      "Local Written Blocks": 0,
                      "Temp Read Blocks": 0,
                      "Temp Written Blocks": 0,
                      "Plans": [
                        {
                          "Node Type": "Seq Scan",
                          "Parent Relationship": "Outer",
                          "Parallel Aware": false,
                          "Async Capable": false,
                          "Relation Name": "customers",
                          "Alias": "c",
                          "Startup Cost": 0.0,
                          "Total Cost": 320.73,
                          "Plan Rows": 18,
                          "Plan Width": 4,
                          "Actual Rows": 8000.0,
                          "Actual Loops": 1,
                          "Disabled": false,
                          "Filter": "(region = 'north'::text)",
                          "Rows Removed by Filter": 2000,
                          "Shared Hit Blocks": 98,
                          "Shared Read Blocks": 0,
                          "Shared Dirtied Blocks": 0,
                          "Shared Written Blocks": 0,
                          "Local Hit Blocks": 0,
                          "Local Read Blocks": 0,
                          "Local Dirtied Blocks": 0,
                          "Local Written Blocks": 0,
                          "Temp Read Blocks": 0,
                          "Temp Written Blocks": 0
                        },
                        {
                          "Node Type": "Bitmap Heap Scan",
                          "Parent Relationship": "Inner",
                          "Parallel Aware": false,
                          "Async Capable": false,
                          "Relation Name": "orders",
                          "Alias": "o",
                          "Startup Cost": 4.15,
                          "Total Cost": 37.09,
                          "Plan Rows": 10,
                          "Plan Width": 9,
                          "Actual Rows": 10.0,
                          "Actual Loops": 8000,
                          "Disabled": false,
                          "Recheck Cond": "(c.customer_id = customer_id)",
                          "Rows Removed by Index Recheck": 0,
                          "Filter": "(placed_at >= '2026-01-01'::date)",
                          "Rows Removed by Filter": 0,
                          "Exact Heap Blocks": 80000,
                          "Lossy Heap Blocks": 0,
                          "Shared Hit Blocks": 96000,
                          "Shared Read Blocks": 0,
                          "Shared Dirtied Blocks": 0,
                          "Shared Written Blocks": 0,
                          "Local Hit Blocks": 0,
                          "Local Read Blocks": 0,
                          "Local Dirtied Blocks": 0,
                          "Local Written Blocks": 0,
                          "Temp Read Blocks": 0,
                          "Temp Written Blocks": 0,
                          "Plans": [
                            {
                              "Node Type": "Bitmap Index Scan",
                              "Parent Relationship": "Outer",
                              "Parallel Aware": false,
                              "Async Capable": false,
                              "Index Name": "orders_customer",
                              "Startup Cost": 0.0,
                              "Total Cost": 4.15,
                              "Plan Rows": 10,
                              "Plan Width": 0,
                              "Actual Rows": 10.0,
                              "Actual Loops": 8000,
                              "Disabled": false,
                              "Index Cond": "(customer_id = c.customer_id)",
                              "Index Searches": 8000,
                              "Shared Hit Blocks": 16000,
                              "Shared Read Blocks": 0,
                              "Shared Dirtied Blocks": 0,
                              "Shared Written Blocks": 0,
                              "Local Hit Blocks": 0,
                              "Local Read Blocks": 0,
                              "Local Dirtied Blocks": 0,
                              "Local Written Blocks": 0,
                              "Temp Read Blocks": 0,
                              "Temp Written Blocks": 0
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    "Planning": {
      "Shared Hit Blocks": 166,
      "Shared Read Blocks": 0,
      "Shared Dirtied Blocks": 0,
      "Shared Written Blocks": 0,
      "Local Hit Blocks": 0,
      "Local Read Blocks": 0,
      "Local Dirtied Blocks": 0,
      "Local Written Blocks": 0,
      "Temp Read Blocks": 0,
      "Temp Written Blocks": 0
    },
    "Planning Time": 0.505,
    "Triggers": [],
    "Execution Time": 43.946
  }
]
```

Exact JSON plan capture after:

```json
[
  {
    "Plan": {
      "Node Type": "Limit",
      "Parallel Aware": false,
      "Async Capable": false,
      "Startup Cost": 3161.5,
      "Total Cost": 3161.52,
      "Plan Rows": 10,
      "Plan Width": 36,
      "Actual Rows": 10.0,
      "Actual Loops": 1,
      "Disabled": false,
      "Shared Hit Blocks": 745,
      "Shared Read Blocks": 0,
      "Shared Dirtied Blocks": 0,
      "Shared Written Blocks": 0,
      "Local Hit Blocks": 0,
      "Local Read Blocks": 0,
      "Local Dirtied Blocks": 0,
      "Local Written Blocks": 0,
      "Temp Read Blocks": 0,
      "Temp Written Blocks": 0,
      "Plans": [
        {
          "Node Type": "Sort",
          "Parent Relationship": "Outer",
          "Parallel Aware": false,
          "Async Capable": false,
          "Startup Cost": 3161.5,
          "Total Cost": 3181.5,
          "Plan Rows": 8000,
          "Plan Width": 36,
          "Actual Rows": 10.0,
          "Actual Loops": 1,
          "Disabled": false,
          "Sort Key": [
            "(sum(o.total)) DESC",
            "c.customer_id"
          ],
          "Sort Method": "top-N heapsort",
          "Sort Space Used": 25,
          "Sort Space Type": "Memory",
          "Shared Hit Blocks": 745,
          "Shared Read Blocks": 0,
          "Shared Dirtied Blocks": 0,
          "Shared Written Blocks": 0,
          "Local Hit Blocks": 0,
          "Local Read Blocks": 0,
          "Local Dirtied Blocks": 0,
          "Local Written Blocks": 0,
          "Temp Read Blocks": 0,
          "Temp Written Blocks": 0,
          "Plans": [
            {
              "Node Type": "Aggregate",
              "Strategy": "Hashed",
              "Partial Mode": "Simple",
              "Parent Relationship": "Outer",
              "Parallel Aware": false,
              "Async Capable": false,
              "Startup Cost": 2888.62,
              "Total Cost": 2988.62,
              "Plan Rows": 8000,
              "Plan Width": 36,
              "Actual Rows": 8000.0,
              "Actual Loops": 1,
              "Disabled": false,
              "Group Key": [
                "c.customer_id"
              ],
              "Planned Partitions": 0,
              "HashAgg Batches": 1,
              "Peak Memory Usage": 3345,
              "Disk Usage": 0,
              "Shared Hit Blocks": 739,
              "Shared Read Blocks": 0,
              "Shared Dirtied Blocks": 0,
              "Shared Written Blocks": 0,
              "Local Hit Blocks": 0,
              "Local Read Blocks": 0,
              "Local Dirtied Blocks": 0,
              "Local Written Blocks": 0,
              "Temp Read Blocks": 0,
              "Temp Written Blocks": 0,
              "Plans": [
                {
                  "Node Type": "Hash Join",
                  "Parent Relationship": "Outer",
                  "Parallel Aware": false,
                  "Async Capable": false,
                  "Join Type": "Inner",
                  "Startup Cost": 323.0,
                  "Total Cost": 2486.11,
                  "Plan Rows": 80502,
                  "Plan Width": 9,
                  "Actual Rows": 80000.0,
                  "Actual Loops": 1,
                  "Disabled": false,
                  "Inner Unique": true,
                  "Hash Cond": "(o.customer_id = c.customer_id)",
                  "Shared Hit Blocks": 739,
                  "Shared Read Blocks": 0,
                  "Shared Dirtied Blocks": 0,
                  "Shared Written Blocks": 0,
                  "Local Hit Blocks": 0,
                  "Local Read Blocks": 0,
                  "Local Dirtied Blocks": 0,
                  "Local Written Blocks": 0,
                  "Temp Read Blocks": 0,
                  "Temp Written Blocks": 0,
                  "Plans": [
                    {
                      "Node Type": "Seq Scan",
                      "Parent Relationship": "Outer",
                      "Parallel Aware": false,
                      "Async Capable": false,
                      "Relation Name": "orders",
                      "Alias": "o",
                      "Startup Cost": 0.0,
                      "Total Cost": 1898.85,
                      "Plan Rows": 100628,
                      "Plan Width": 9,
                      "Actual Rows": 100000.0,
                      "Actual Loops": 1,
                      "Disabled": false,
                      "Filter": "(placed_at >= '2026-01-01'::date)",
                      "Rows Removed by Filter": 0,
                      "Shared Hit Blocks": 641,
                      "Shared Read Blocks": 0,
                      "Shared Dirtied Blocks": 0,
                      "Shared Written Blocks": 0,
                      "Local Hit Blocks": 0,
                      "Local Read Blocks": 0,
                      "Local Dirtied Blocks": 0,
                      "Local Written Blocks": 0,
                      "Temp Read Blocks": 0,
                      "Temp Written Blocks": 0
                    },
                    {
                      "Node Type": "Hash",
                      "Parent Relationship": "Inner",
                      "Parallel Aware": false,
                      "Async Capable": false,
                      "Startup Cost": 223.0,
                      "Total Cost": 223.0,
                      "Plan Rows": 8000,
                      "Plan Width": 4,
                      "Actual Rows": 8000.0,
                      "Actual Loops": 1,
                      "Disabled": false,
                      "Hash Buckets": 8192,
                      "Original Hash Buckets": 8192,
                      "Hash Batches": 1,
                      "Original Hash Batches": 1,
                      "Peak Memory Usage": 346,
                      "Shared Hit Blocks": 98,
                      "Shared Read Blocks": 0,
                      "Shared Dirtied Blocks": 0,
                      "Shared Written Blocks": 0,
                      "Local Hit Blocks": 0,
                      "Local Read Blocks": 0,
                      "Local Dirtied Blocks": 0,
                      "Local Written Blocks": 0,
                      "Temp Read Blocks": 0,
                      "Temp Written Blocks": 0,
                      "Plans": [
                        {
                          "Node Type": "Seq Scan",
                          "Parent Relationship": "Outer",
                          "Parallel Aware": false,
                          "Async Capable": false,
                          "Relation Name": "customers",
                          "Alias": "c",
                          "Startup Cost": 0.0,
                          "Total Cost": 223.0,
                          "Plan Rows": 8000,
                          "Plan Width": 4,
                          "Actual Rows": 8000.0,
                          "Actual Loops": 1,
                          "Disabled": false,
                          "Filter": "(region = 'north'::text)",
                          "Rows Removed by Filter": 2000,
                          "Shared Hit Blocks": 98,
                          "Shared Read Blocks": 0,
                          "Shared Dirtied Blocks": 0,
                          "Shared Written Blocks": 0,
                          "Local Hit Blocks": 0,
                          "Local Read Blocks": 0,
                          "Local Dirtied Blocks": 0,
                          "Local Written Blocks": 0,
                          "Temp Read Blocks": 0,
                          "Temp Written Blocks": 0
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    "Planning": {
      "Shared Hit Blocks": 167,
      "Shared Read Blocks": 0,
      "Shared Dirtied Blocks": 0,
      "Shared Written Blocks": 0,
      "Local Hit Blocks": 0,
      "Local Read Blocks": 0,
      "Local Dirtied Blocks": 0,
      "Local Written Blocks": 0,
      "Temp Read Blocks": 0,
      "Temp Written Blocks": 0
    },
    "Planning Time": 0.36,
    "Triggers": [],
    "Execution Time": 17.161
  }
]
```

## Raw latency samples

Each line is `script-number: microseconds`, grouped per run. Values are pgbench log column 3; script indices are 0 lookup, 1 change, 2 report. Retained only latency and script identity, as all runs reported zero failed transactions.

<details><summary>before round 1: 600 samples</summary>

```text
0:832 0:184 2:51499 2:50465 2:51487 0:213 1:467 1:296 0:177 0:129 0:124 0:114 0:119 1:154 1:135 0:116 0:143 2:43780 1:455 0:191 1:155 1:150 0:118 0:121 0:118 1:414 0:117 0:115 0:108 2:47674 0:142 1:210 2:48936 2:39401 0:171 0:120 0:135 0:110 0:115 2:54196 2:54198 0:182 0:180 0:101 1:252 1:233 1:147 1:119 1:116 0:96 0:93 0:122 0:122 0:127 1:183 1:186 0:126 0:80 0:76 0:76 0:70 1:109 0:97 0:83 0:80 0:77 1:96 1:98 0:69 0:64 0:73 0:119 0:91 0:98 0:91 0:101 0:77 0:81 0:82 0:89 0:90 0:93 2:39441 0:205 2:42555 0:176 0:122 2:40771 1:208 0:140 1:139 1:128 0:102 0:95 0:89 0:95 0:90 0:96 1:128 0:154 0:101 0:162 0:154 1:102 1:95 0:75 0:77 1:94 0:84 1:95 2:41026 0:142 1:185 0:99 2:40974 0:161 0:106 0:102 0:102 0:102 0:98 0:103 0:107 0:100 0:100 0:99 0:100 0:102 0:106 1:170 1:305 2:40951 0:159 1:182 1:142 0:140 1:137 1:186 0:116 1:158 1:134 1:148 0:101 0:112 0:107 1:117 0:118 0:91 0:91 0:90 0:90 0:91 1:91 1:111 1:116 0:87 0:81 0:86 0:86 0:86 0:91 1:116 1:117 1:111 1:110 1:115 1:112 0:117 0:105 0:98 1:121 2:40163 1:184 2:43186 0:143 2:44006 2:41191 2:48096 2:50169 0:140 0:106 0:101 0:105 0:105 2:40842 1:1741 1:154 0:104 0:79 0:78 0:76 1:117 0:154 0:94 1:140 0:92 0:93 1:127 1:117 0:119 0:99 0:105 1:114 0:102 0:104 2:51447 2:52103 2:45093 0:179 0:176 0:160 0:124 0:122 1:165 0:87 0:117 1:156 1:130 0:92 1:140 1:149 1:182 1:146 0:116 0:121 1:129 0:101 0:94 0:104 1:117 0:109 0:103 1:134 1:135 0:108 1:124 0:103 0:107 0:106 0:118 1:174 0:105 1:139 0:107 0:109 0:93 0:73 0:76 0:64 0:78 0:123 2:55926 2:55200 0:113 0:154 0:112 1:144 2:53152 0:84 0:93 0:105 1:109 0:95 1:109 0:87 0:75 0:82 1:136 1:136 0:98 0:87 0:91 1:113 1:123 0:117 0:99 0:108 0:88 0:103 1:143 1:136 1:95 0:87 0:71 1:97 2:47364 2:53239 0:162 0:122 0:139 2:52137 0:116 1:194 0:100 1:134 0:106 0:98 0:76 0:79 0:76 1:108 0:92 1:113 0:87 0:76 1:118 0:75 0:82 0:81 0:80 1:109 0:73 0:84 0:82 2:41957 0:152 2:39909 2:41928 0:130 0:101 0:77 0:73 0:71 1:122 0:102 1:116 0:75 0:78 1:102 1:98 1:106 0:76 0:82 0:72 0:75 0:72 2:39808 1:533 0:141 1:152 0:110 1:137 0:104 0:109 0:107 1:136 1:102 0:82 1:99 0:79 0:95 0:83 1:91 0:77 0:75 0:74 0:73 0:77 0:74 0:71 0:74 1:100 0:77 0:70 0:74 2:37285 0:92 0:72 0:73 0:75 2:37312 2:42795 0:131 0:86 0:84 1:145 0:88 0:89 0:85 0:85 1:113 0:80 0:90 0:86 0:87 2:43745 0:109 1:258 2:43386 1:124 0:101 1:124 0:89 0:81 1:107 2:44708 0:239 2:46937 0:117 0:134 0:115 1:164 0:104 2:45944 0:93 0:92 0:132 0:96 0:99 0:96 0:95 1:141 1:131 1:148 0:82 0:98 1:113 0:78 1:104 0:102 1:90 0:91 0:95 0:112 0:100 0:79 0:96 2:60876 2:60736 0:182 0:129 2:61822 0:113 0:111 0:110 0:146 1:170 1:171 1:183 0:96 0:98 0:93 1:115 1:119 0:90 0:92 1:128 1:137 1:180 0:87 0:101 0:99 0:98 1:124 0:113 1:124 0:104 0:114 0:105 0:110 1:163 0:84 0:114 1:119 0:120 0:103 0:130 0:146 0:104 1:156 1:135 0:112 0:110 1:114 1:129 2:49547 0:203 2:49436 2:46243 2:46247 0:169 1:246 0:140 1:158 1:160 0:131 0:140 0:119 0:111 1:151 0:95 0:95 1:140 1:179 0:111 0:114 1:129 1:139 1:120 1:1200 1:1145 0:91 0:80 0:76 1:108 0:70 0:99 0:88 1:112 0:94 1:99 1:100 1:109 0:88 1:103 0:81 0:84 1:103 1:100 0:82 0:79 0:86 0:78 0:69 0:65 0:69 1:90 1:86 1:89 2:38145 2:39951 1:202 0:144 1:144 1:124 2:44068 2:43948 0:172 0:170 0:113 1:164 0:101 0:124 0:78 1:136 1:169 0:116 1:127 0:118 0:78 1:121 0:115 1:140 0:104 1:128 0:101 0:110 2:41164 2:42088 0:117 1:212 0:93 0:101 0:95 1:107 0:82 0:94 0:106 0:106 0:90 2:45535 0:169 0:109 0:105 1:195 0:118 1:163 1:144 0:115 2:48374 0:108 1:120 0:98 1:111 1:112 0:94 1:115 1:102 0:92 1:110 0:98 1:105 2:36635 0:202 1:174 1:163 2:40075 1:261 0:142 0:126
```
</details>

<details><summary>before round 2: 600 samples</summary>

```text
0:680 0:142 2:46267 1:516 0:208 2:54739 2:55800 1:375 0:204 0:115 0:118 0:130 0:116 1:241 1:150 0:129 0:96 2:40381 1:258 0:137 1:140 1:130 0:109 0:98 0:94 1:121 0:101 0:107 0:97 2:49428 2:48588 0:173 1:172 2:40882 0:170 0:97 0:95 0:130 0:100 2:45590 2:45515 0:147 0:141 0:101 1:1470 1:1400 1:133 1:112 0:129 1:138 0:72 0:101 0:87 0:97 1:104 1:101 0:75 0:83 0:76 0:73 0:73 1:105 0:80 0:79 0:81 0:74 1:106 1:101 0:83 0:78 0:74 0:73 0:77 0:77 0:74 0:103 0:71 0:70 0:90 0:79 0:90 0:86 2:38120 0:104 2:39054 2:41248 0:161 0:130 1:163 0:115 1:140 1:180 0:90 0:96 0:107 0:89 0:93 0:96 1:124 0:93 0:90 0:87 0:92 1:109 1:106 0:100 0:85 1:117 0:98 1:114 2:37771 0:127 1:138 0:104 2:41176 2:43036 0:97 0:116 0:69 0:69 0:62 0:62 0:64 0:64 0:64 0:80 0:91 0:75 0:67 0:66 1:109 1:137 0:71 1:97 0:74 1:98 1:92 1:97 0:73 1:95 1:96 1:96 0:75 0:67 0:68 1:91 0:85 0:71 0:71 0:66 0:67 0:75 1:85 1:92 1:143 0:87 0:101 0:76 0:84 0:91 0:85 1:122 1:123 1:129 1:117 1:118 1:123 0:106 0:107 0:92 1:109 2:37418 1:153 2:43324 0:188 2:44418 2:41986 2:41948 2:43636 0:130 0:99 0:94 0:93 0:120 2:43934 1:166 1:122 0:106 0:94 0:99 0:85 1:123 0:92 0:102 1:119 0:104 0:91 1:112 1:115 0:91 0:92 0:102 1:102 0:89 0:92 2:42918 0:164 0:123 0:104 0:102 1:175 0:122 0:137 1:136 0:105 1:153 1:162 2:41215 0:117 1:118 1:112 1:112 0:96 0:92 1:111 0:92 0:92 1:108 0:92 2:40543 0:102 0:90 1:122 1:1442 0:118 1:121 0:104 0:104 0:99 0:118 1:115 0:94 1:112 0:93 0:90 0:90 0:89 0:88 0:89 0:89 0:88 2:41114 0:133 0:81 1:137 0:175 0:119 0:109 0:92 2:39557 0:77 1:140 0:84 1:115 0:78 0:78 1:122 1:119 0:74 0:79 2:40461 0:117 1:122 1:117 0:95 0:92 0:94 0:93 0:91 1:114 1:115 1:112 0:91 0:92 1:115 2:44312 2:50208 2:50254 0:168 0:141 0:107 1:132 0:107 0:94 1:128 0:89 0:90 0:84 0:80 0:76 1:98 0:74 1:106 0:92 0:109 1:108 0:84 0:77 0:95 0:74 1:95 0:77 0:78 0:78 2:44652 0:158 2:45012 2:43112 0:98 0:101 0:76 0:82 1:125 0:77 0:84 1:102 0:81 0:83 1:99 1:101 1:113 0:75 0:77 0:75 0:72 0:71 2:46661 2:47811 0:132 1:288 2:48862 0:82 1:135 1:128 0:101 0:102 0:82 1:109 0:87 1:151 0:86 1:107 0:90 0:88 1:101 0:81 0:92 0:74 0:78 0:89 0:89 0:83 0:93 0:90 1:104 0:86 0:84 0:84 0:85 0:81 0:82 2:50620 2:50390 0:134 2:50524 0:163 0:97 0:94 1:139 0:78 0:78 0:81 0:82 1:102 0:82 0:70 0:70 0:90 1:119 1:109 0:98 1:111 0:96 0:84 1:109 2:55219 0:171 2:55356 0:131 0:122 0:152 2:54946 0:126 0:127 1:168 0:107 0:105 0:99 0:113 0:110 1:153 0:124 1:154 0:93 1:160 0:106 1:135 0:105 1:113 0:74 1:89 0:87 0:102 0:100 0:98 0:96 0:84 2:40866 0:163 0:121 0:93 0:112 0:90 0:110 1:171 1:135 1:124 0:106 0:107 1:140 0:101 1:120 0:105 0:110 1:129 1:139 1:153 0:118 0:98 0:163 0:90 1:169 0:88 1:134 0:89 0:85 0:90 0:80 1:161 0:96 0:92 1:155 0:121 0:76 0:75 0:63 1:95 0:69 1:80 0:78 0:105 2:54702 2:55117 1:132 1:136 0:113 2:39200 2:51506 2:51276 0:146 0:109 1:1606 1:1356 1:108 0:99 0:103 0:103 0:103 1:143 0:104 0:107 1:138 1:130 0:94 0:92 1:136 1:136 1:157 1:169 0:102 1:143 0:92 1:119 0:84 0:82 0:83 0:83 1:107 0:88 1:103 1:100 1:89 0:81 1:92 0:92 0:90 1:97 1:105 0:79 0:82 0:78 0:77 0:79 0:78 0:81 1:105 1:101 1:98 2:39152 1:133 0:83 1:88 2:40499 2:40246 1:187 2:44854 2:43227 0:138 0:152 0:113 1:165 0:109 0:98 0:108 1:124 0:98 1:153 1:119 0:121 0:118 1:143 0:105 1:135 0:92 1:112 0:96 0:78 2:41812 1:190 2:42890 0:148 0:148 0:107 1:141 0:82 0:102 0:113 0:91 0:112 0:103 2:43856 2:43801 0:121 0:97 0:90 0:90 1:125 1:108 1:105 0:80 0:79 1:101 0:86 1:99 1:89 0:81 1:87 1:92 0:74 2:36309 1:221 0:127 1:201 0:104 1:127 1:134 2:36779 1:227 0:132 0:120
```
</details>

<details><summary>before round 3: 600 samples</summary>

```text
0:679 0:104 2:50200 1:418 0:201 2:56611 1:337 0:176 0:134 2:56517 0:122 0:111 0:108 1:150 1:181 0:193 0:135 2:40310 1:337 0:116 1:153 1:129 0:106 0:82 0:140 1:159 0:123 0:115 0:108 2:45900 2:46971 0:182 1:373 2:39232 0:194 0:116 0:88 0:77 0:89 2:47642 2:47335 0:163 0:159 0:107 1:241 1:172 1:133 1:1805 1:1739 0:117 0:122 0:84 0:108 0:97 1:138 1:142 0:105 0:95 0:99 0:123 0:98 1:135 0:99 0:98 0:98 0:107 1:130 1:119 0:93 0:91 0:97 0:93 0:94 0:90 0:101 0:116 0:85 0:124 0:93 0:79 0:101 0:72 2:38601 0:141 2:42813 0:151 0:126 2:40572 1:174 0:132 1:145 1:145 0:95 0:96 0:103 0:95 0:95 0:87 1:132 0:99 0:96 0:86 0:95 1:122 1:118 0:143 0:79 1:97 0:77 1:94 2:38631 0:123 1:153 0:124 2:44111 2:46043 0:192 0:171 0:117 0:123 0:115 0:127 0:103 0:115 0:80 0:107 0:100 0:110 0:111 0:110 1:152 1:176 1:173 0:120 1:160 0:120 1:169 1:168 0:127 1:131 1:145 1:142 0:116 0:104 0:105 1:129 0:110 0:116 0:74 0:119 0:104 0:104 1:136 1:179 0:90 1:133 0:102 0:101 0:107 0:103 0:99 1:136 1:126 1:125 1:123 1:136 1:134 0:97 0:92 0:94 1:111 2:40626 1:152 2:47315 0:200 2:46142 2:43749 2:60280 2:60675 0:157 0:119 0:124 2:60600 0:125 0:95 1:167 1:139 0:108 0:103 0:109 0:106 1:237 0:141 0:91 1:120 0:92 0:88 1:121 1:104 0:85 0:154 0:110 1:130 0:114 0:114 2:53191 2:50839 2:54234 0:229 0:200 0:125 0:122 0:97 0:95 1:218 1:153 0:150 1:142 1:144 0:142 1:168 1:159 1:131 0:138 0:116 1:127 0:106 0:116 1:110 0:112 0:99 0:124 1:139 1:139 0:108 1:122 0:96 0:96 0:95 0:95 1:122 0:105 1:122 0:100 0:96 0:96 0:103 0:113 0:94 0:122 0:104 2:48207 0:121 0:223 2:50987 2:51808 1:182 0:134 0:162 0:140 0:150 1:139 0:93 1:117 0:86 0:88 0:89 1:118 1:118 0:94 0:94 0:86 1:122 1:117 0:100 0:87 0:89 0:84 0:84 1:104 1:1313 1:106 0:85 0:71 1:92 2:48888 2:46388 0:132 2:49182 0:92 0:92 0:85 1:125 0:128 1:112 0:95 0:92 0:90 0:99 0:91 1:115 0:92 1:111 0:98 0:101 1:98 0:87 0:88 0:80 0:85 1:99 0:94 0:110 0:83 2:49826 2:47770 2:50421 0:151 0:88 0:122 0:81 0:80 0:90 1:160 0:121 1:147 0:98 0:160 1:150 1:135 1:139 0:121 0:121 0:88 0:86 0:86 2:48087 1:203 0:132 1:136 0:128 1:157 0:139 0:114 0:108 1:125 1:143 0:114 1:128 0:110 0:108 0:128 1:127 0:107 0:108 0:110 0:113 0:90 0:89 0:82 0:106 1:158 0:82 0:69 0:73 2:51788 0:125 0:94 0:107 2:50757 0:90 2:40119 0:197 0:119 0:141 1:205 0:136 0:87 0:83 0:103 1:213 0:139 0:119 0:105 0:114 2:51025 2:51053 0:150 1:217 1:166 0:96 1:115 0:99 0:85 1:107 2:38702 0:140 0:91 0:100 0:93 1:151 0:88 0:90 0:85 0:108 0:94 0:100 1:136 0:85 0:89 1:101 2:53503 2:52991 0:135 1:189 0:160 1:158 0:117 1:125 0:95 1:116 0:103 0:100 0:69 0:109 0:98 0:102 2:39518 2:52214 2:52073 0:163 0:164 0:157 0:133 0:133 0:118 1:161 1:123 1:159 0:124 0:104 1:140 0:114 1:140 0:110 0:128 1:128 1:161 1:214 0:124 0:121 0:94 0:107 1:136 0:108 0:81 1:154 0:113 0:112 0:116 1:118 0:108 0:100 1:147 0:114 0:113 0:114 0:119 1:120 0:102 1:137 0:113 0:107 1:119 1:135 2:47395 2:47111 0:184 2:50512 2:50351 0:143 1:206 0:82 1:127 1:142 0:106 0:90 0:94 1:125 0:90 0:91 0:90 1:116 1:123 0:91 0:96 1:125 1:115 1:116 1:114 1:116 0:91 0:105 1:103 0:89 0:90 0:84 0:83 1:97 0:96 1:108 1:109 1:95 0:73 1:98 0:101 0:80 1:98 1:305 0:78 0:135 0:77 0:131 0:107 0:82 0:99 1:130 1:88 1:95 2:41825 1:188 0:81 1:77 2:41478 1:90 2:40943 2:39594 0:160 0:78 0:74 1:141 0:73 0:60 0:56 1:96 1:83 0:70 0:61 1:98 0:98 1:107 0:64 1:84 0:57 1:100 0:77 0:79 2:45058 2:45828 0:88 1:194 0:74 0:78 1:92 0:80 0:68 0:72 0:66 0:74 0:67 2:46502 2:46621 0:86 0:114 0:65 1:109 0:68 1:93 1:108 0:59 0:54 1:75 0:55 2:38956 1:206 1:104 0:81 1:105 1:87 0:76 1:84 0:58 1:92 0:69 1:83 1:71 2:37242 1:320 0:108 0:80
```
</details>

<details><summary>after round 1: 600 samples</summary>

```text
0:728 0:136 2:16815 2:16808 2:16172 0:226 1:439 1:328 0:199 0:116 0:120 0:122 0:109 1:158 1:132 0:108 0:118 2:14750 2:15487 1:322 0:136 1:204 0:137 1:333 0:86 0:116 1:106 2:14825 0:108 0:105 0:153 0:107 1:133 2:15175 2:15378 0:173 0:165 2:15445 0:108 0:105 0:170 0:88 0:95 0:130 1:151 1:139 1:266 1:167 1:174 0:107 0:101 0:106 0:106 0:106 1:133 1:136 0:110 0:98 0:93 0:105 0:95 1:122 0:99 0:89 0:105 0:92 1:121 1:120 0:105 0:95 0:96 0:88 0:82 0:81 0:81 0:82 0:83 0:80 0:80 0:80 0:91 0:90 2:15755 0:178 2:14997 0:131 0:107 1:209 0:102 1:152 1:179 2:14673 0:144 0:138 0:125 0:92 0:83 0:88 1:182 0:120 0:114 0:106 0:110 1:157 1:138 0:108 0:111 1:133 0:109 1:112 2:15465 0:158 1:289 2:14959 0:88 0:86 0:98 0:95 0:101 0:98 0:94 0:95 0:91 0:94 0:94 0:92 0:101 0:90 0:93 1:136 1:157 1:138 0:132 1:116 0:99 1:125 1:116 0:93 1:107 1:103 1:113 0:105 0:94 0:101 2:14724 0:126 0:98 1:309 0:94 0:83 0:63 0:86 1:125 1:120 1:122 0:106 0:98 0:98 0:82 0:83 0:92 1:112 1:104 1:105 1:104 1:112 1:112 0:93 0:91 0:91 1:101 2:15343 1:241 2:14852 0:121 2:15276 2:15314 2:14544 2:14485 0:185 0:117 0:103 0:112 0:107 2:15836 1:238 1:149 0:127 0:132 0:99 0:85 1:123 0:106 0:101 1:109 0:94 0:82 1:113 1:126 0:121 2:15148 0:102 0:126 1:146 0:115 0:116 0:112 0:100 0:102 0:107 1:121 0:99 0:102 1:126 0:115 1:142 1:125 2:14971 0:109 1:130 1:116 1:118 0:85 0:83 1:91 0:75 0:74 1:94 0:70 2:15665 0:131 0:99 1:151 1:120 0:100 2:14962 1:138 0:119 0:104 0:105 0:108 1:139 0:112 1:121 0:108 0:104 0:97 0:82 0:82 0:81 0:98 0:116 0:76 0:92 1:111 0:73 2:14866 0:73 0:90 0:78 0:72 1:102 0:100 1:131 0:96 0:95 1:121 1:121 0:89 0:90 2:15437 0:194 1:226 1:131 0:107 0:103 2:15125 2:15192 0:100 0:139 0:115 1:143 1:151 1:137 0:109 0:99 1:120 0:101 0:117 0:104 1:136 0:106 2:14402 0:157 1:189 0:109 2:15001 0:104 0:110 0:110 0:113 1:145 0:107 1:117 0:86 2:14749 0:150 0:105 1:124 0:112 0:128 0:128 1:124 0:123 0:118 0:92 0:89 0:98 0:97 0:94 0:92 1:122 0:86 0:94 2:15001 1:234 2:15207 0:91 0:84 1:121 1:122 1:105 0:88 0:72 0:125 0:95 0:95 2:15042 1:128 0:127 1:108 0:108 1:98 0:99 0:94 0:93 1:133 1:160 0:113 1:86 0:87 0:85 0:91 1:91 0:87 0:87 0:95 0:95 0:87 0:88 0:94 0:93 1:100 0:102 0:108 0:107 0:92 0:89 0:93 0:107 2:15482 2:14762 0:131 0:137 0:123 1:178 0:90 0:120 0:86 0:92 2:15346 0:111 1:141 0:70 0:101 0:83 0:114 1:150 1:285 2:14520 0:200 1:196 0:108 0:102 1:128 2:15038 0:113 0:96 0:93 0:90 2:14829 0:102 1:131 0:89 0:90 0:105 0:70 0:177 1:105 0:103 0:96 1:191 1:106 0:76 0:69 1:94 0:67 1:84 0:65 1:83 0:66 0:65 0:64 0:132 2:15752 0:164 0:95 2:14403 0:116 0:112 0:124 0:100 0:92 0:91 1:152 1:117 1:120 0:95 0:91 2:14620 1:104 1:102 0:111 0:85 0:85 1:121 1:148 1:118 0:93 0:104 0:103 0:92 1:135 0:93 1:122 0:97 0:104 0:128 0:101 1:137 0:116 0:81 0:80 1:91 0:73 0:84 0:87 1:106 0:92 1:116 0:74 0:78 1:84 1:93 2:15243 0:164 2:14556 2:14965 1:217 0:113 0:101 1:148 1:167 0:99 0:72 0:81 1:176 0:98 0:82 0:79 1:89 1:86 0:66 0:66 1:94 1:83 1:96 1:128 1:104 0:93 0:92 1:112 0:101 0:94 0:98 0:91 1:113 0:91 1:111 2:14911 1:226 1:130 0:127 1:138 0:105 0:145 1:188 1:119 0:79 0:74 0:75 0:87 0:75 0:79 0:79 1:95 1:96 1:87 2:14771 1:133 0:105 1:117 2:15406 1:165 2:14972 2:14591 0:123 0:100 1:181 0:98 0:122 0:106 0:117 1:127 1:120 0:96 1:115 0:94 0:94 2:15613 1:281 0:143 1:161 0:106 1:139 0:108 0:106 2:15573 1:204 0:103 0:83 0:101 1:127 0:106 0:100 0:94 0:96 0:94 2:15286 0:166 2:14621 0:142 0:103 0:112 2:15281 1:263 0:124 1:160 1:146 0:109 2:15070 0:146 1:195 0:112 1:154 1:156 0:125 1:142 1:136 0:108 1:148 0:106 1:129 0:92 1:263 1:114 2:14629 1:213 0:116 0:101
```
</details>

<details><summary>after round 2: 600 samples</summary>

```text
0:592 0:144 2:17045 2:16298 2:17044 0:221 1:412 1:304 0:186 0:121 0:118 0:114 0:108 1:167 1:159 0:115 0:118 2:15905 2:15548 0:135 1:490 2:14987 1:187 1:164 0:156 0:112 0:104 0:189 1:161 0:99 0:124 0:101 1:116 2:15199 2:15591 2:15541 0:296 0:128 0:96 0:129 0:127 0:90 0:87 0:86 1:259 1:218 1:173 1:160 0:113 1:148 0:120 0:120 0:120 0:189 1:148 1:165 0:119 0:126 0:100 0:99 0:100 1:130 0:105 0:110 0:104 0:102 1:139 1:134 0:111 0:107 0:111 0:103 0:110 0:105 0:102 0:104 0:102 0:98 0:100 0:100 0:103 0:104 2:15178 0:162 2:15260 0:122 0:94 1:169 0:91 1:120 1:114 2:14733 0:135 0:93 0:90 0:92 0:95 0:90 1:131 0:90 0:79 0:79 0:77 1:101 1:116 0:74 0:77 1:100 0:82 1:99 2:15851 0:178 1:162 0:95 2:15256 0:107 0:86 0:82 0:83 0:84 0:84 0:84 0:84 0:81 0:78 0:79 0:80 0:79 0:84 1:164 1:112 1:113 0:91 1:116 0:94 1:120 1:125 0:107 1:111 1:111 1:103 0:81 0:82 0:85 1:110 0:90 0:80 2:15215 0:69 0:93 0:95 0:91 1:121 1:138 1:130 0:79 0:58 0:85 0:85 0:86 0:83 1:107 1:108 1:107 1:104 1:93 1:98 0:82 0:81 0:80 1:112 2:15041 1:220 2:14892 0:95 2:14767 2:14883 2:14858 2:14723 0:92 0:82 0:74 0:79 0:80 2:14894 1:216 1:123 0:102 0:104 0:90 0:95 1:120 0:96 0:103 1:162 0:72 0:71 1:104 1:91 0:71 0:80 0:69 1:106 0:111 0:93 2:15003 0:143 0:93 0:89 0:91 1:144 0:82 0:99 1:123 0:89 2:14809 1:114 1:113 0:95 1:112 1:122 1:172 0:93 0:92 1:116 0:93 0:90 1:112 0:92 2:14745 0:187 0:116 1:208 1:144 0:116 1:122 0:229 0:110 0:94 0:92 1:117 0:91 1:111 0:93 0:91 0:96 0:92 0:94 0:91 0:92 0:98 2:15173 0:125 0:111 1:126 0:68 0:78 0:77 0:76 1:93 2:14713 0:71 0:66 1:115 0:78 0:79 1:149 1:168 0:96 0:78 2:14859 0:201 1:206 1:118 0:132 0:117 0:89 0:83 0:84 1:102 1:96 1:237 0:71 0:102 1:139 2:15256 2:15292 0:167 0:97 0:104 1:166 0:105 2:15051 0:174 1:191 0:87 0:109 0:86 0:82 0:82 1:126 0:98 2:15116 1:145 0:91 0:125 1:200 0:114 0:109 0:112 0:114 1:126 0:116 0:105 0:116 0:82 2:15308 0:152 0:109 0:105 0:108 1:139 0:113 0:101 2:15383 2:15227 0:167 1:248 0:115 1:137 1:142 1:131 0:94 0:94 0:87 0:102 0:101 2:15165 1:119 0:110 1:139 0:97 0:112 1:152 0:104 0:110 1:141 1:119 0:101 1:87 0:76 0:89 0:99 1:100 0:83 0:91 0:89 0:79 0:80 0:91 0:97 0:112 0:93 1:143 0:94 0:95 0:92 0:99 0:102 0:93 2:15331 2:15129 0:156 2:14960 0:101 0:107 1:161 0:96 0:106 0:106 0:103 1:142 0:95 0:105 0:90 0:84 0:86 1:127 1:130 2:15145 0:140 1:171 0:91 0:94 1:119 2:14544 0:113 0:126 0:111 0:90 1:132 0:88 0:77 0:81 0:85 0:77 2:15147 0:68 1:112 0:70 0:83 1:112 1:106 0:97 0:88 1:114 0:92 1:118 0:93 1:106 0:92 0:90 0:94 0:100 2:14726 0:146 0:106 2:14800 0:120 0:101 0:102 0:104 0:106 0:99 1:247 1:180 1:136 0:107 0:86 1:132 0:86 1:114 2:15327 0:79 0:98 1:101 1:118 1:114 0:99 0:85 0:108 0:99 0:115 1:169 1:143 0:103 0:95 0:106 0:107 1:152 0:117 0:108 1:135 0:100 0:115 0:117 0:119 1:150 0:108 1:124 0:119 0:105 1:125 1:121 2:14718 0:134 2:15466 2:15190 1:232 0:125 0:125 1:231 1:173 0:102 0:100 0:116 1:137 0:102 0:104 0:100 1:162 1:129 0:100 0:99 1:122 1:122 1:122 1:123 1:125 2:15701 0:168 0:74 1:143 0:69 0:79 0:77 0:67 1:101 0:83 1:100 2:16884 1:227 1:130 0:126 1:131 0:110 0:97 1:114 1:124 0:108 0:92 0:77 0:78 0:67 0:71 0:73 1:110 1:95 2:15223 1:193 2:14877 1:183 0:119 1:114 2:14739 1:264 2:14779 0:128 0:89 1:201 0:158 0:117 0:87 0:72 1:121 1:118 0:72 1:122 0:86 0:91 2:14587 1:217 0:96 1:121 0:90 1:127 0:87 0:120 2:14325 1:138 0:90 0:73 0:73 1:393 0:139 0:81 0:75 0:84 0:76 2:14321 0:177 2:14195 0:109 0:70 0:75 1:146 0:74 1:97 1:96 0:69 2:14087 0:105 1:123 0:74 1:101 1:105 0:103 1:113 1:104 0:92 1:113 0:81 1:105 0:83 1:123 1:94 2:14565 1:163 0:94 0:74
```
</details>

<details><summary>after round 3: 600 samples</summary>

```text
0:685 0:134 2:16589 2:16581 2:15784 0:191 1:409 1:257 0:157 0:110 0:89 0:91 0:99 1:134 1:95 0:86 0:85 2:15130 2:14766 0:125 1:368 1:158 1:111 0:105 0:115 0:97 1:144 0:95 0:87 2:14757 0:81 0:116 1:110 2:14745 2:14901 2:14829 0:203 0:195 0:144 0:124 0:122 0:106 0:103 0:102 1:186 1:152 1:134 1:153 1:131 0:109 0:94 0:106 0:76 0:114 1:155 0:100 1:195 0:90 0:100 0:99 0:103 1:134 0:100 0:96 0:98 0:97 1:122 1:127 0:96 0:100 0:98 0:96 0:101 0:101 0:97 0:95 0:97 0:95 0:96 0:98 0:97 0:97 2:15178 0:125 2:14836 0:144 0:106 1:186 0:106 1:140 1:130 2:14730 0:105 0:92 0:92 0:92 0:91 0:92 1:127 0:94 0:92 0:91 0:84 1:121 1:114 0:94 0:92 1:111 0:92 1:103 2:15026 0:181 1:193 0:114 2:14802 0:142 0:96 0:79 0:77 0:70 0:80 0:79 0:74 0:77 0:78 0:76 0:77 0:75 0:72 1:221 1:128 1:113 0:96 1:112 0:108 1:127 1:141 0:81 1:93 1:97 1:82 0:68 0:75 0:65 1:121 0:97 0:84 0:86 0:87 0:91 0:90 1:111 1:105 1:104 2:15225 0:99 0:97 0:99 0:92 0:92 0:83 1:122 1:140 1:112 1:121 1:120 1:122 0:94 0:100 0:93 1:104 2:14751 1:232 2:14949 0:109 2:14657 2:14420 2:15278 2:15096 0:134 0:124 0:114 0:93 0:103 2:15141 1:232 1:129 0:120 0:101 0:99 0:100 1:134 0:102 0:103 1:115 0:109 0:97 1:120 1:121 0:100 0:98 0:106 1:143 0:117 0:116 2:15731 0:99 0:79 0:133 0:109 1:131 2:14949 0:91 0:104 1:105 0:87 1:153 1:120 0:92 1:129 1:115 1:119 0:97 0:95 1:103 0:96 0:80 1:82 0:76 2:14691 0:141 0:97 1:168 1:134 0:97 1:267 0:98 0:91 0:101 0:85 1:113 0:94 1:112 0:91 0:92 0:98 0:103 0:96 0:92 0:98 0:92 2:15321 0:131 0:92 1:131 0:77 0:65 0:64 0:65 2:14926 1:94 0:79 1:83 0:74 0:76 0:93 1:146 1:114 0:67 0:90 2:15147 0:126 1:158 1:104 0:99 0:85 0:81 0:84 0:83 1:101 1:103 1:106 0:84 0:80 1:96 2:14808 2:14848 0:118 0:84 0:139 1:115 0:79 2:14725 0:161 1:184 0:98 0:128 0:105 0:109 0:92 1:122 0:91 1:113 0:102 0:92 1:105 0:91 0:97 0:94 0:91 1:116 0:95 0:93 0:93 2:14846 0:116 2:14942 0:102 0:95 0:99 0:99 1:116 0:90 0:91 2:14427 2:15067 1:198 0:116 0:116 1:142 1:164 1:94 0:72 0:96 0:96 0:98 0:99 1:116 0:111 1:113 0:85 1:122 2:14523 0:98 0:97 0:92 1:128 1:128 0:92 1:110 0:111 0:94 0:94 1:92 0:95 0:89 0:88 0:90 0:91 0:88 0:88 0:86 1:115 0:107 0:79 0:93 0:90 0:85 0:87 0:89 2:14913 2:14521 0:117 2:15135 0:80 0:79 1:128 0:79 0:82 0:80 0:82 1:106 0:74 0:71 0:82 0:62 0:74 1:101 1:96 2:15013 0:146 1:187 0:109 0:94 1:142 2:14768 0:110 0:82 0:82 0:86 1:139 2:15071 0:90 0:80 0:97 0:83 0:83 0:102 1:130 0:88 0:91 1:109 1:100 0:84 0:86 1:93 0:81 1:102 0:79 1:99 0:88 0:74 0:90 0:85 2:15374 0:141 0:156 2:14805 0:113 0:95 0:104 0:88 0:92 0:90 1:163 1:113 1:104 0:91 2:14768 0:80 1:109 0:76 1:102 0:109 0:97 1:174 1:116 0:77 1:110 0:115 0:116 0:109 1:109 0:107 1:103 0:90 0:90 0:93 0:94 1:90 0:91 0:86 1:84 0:96 0:95 0:97 0:97 0:78 1:121 1:111 0:107 0:102 1:113 1:117 2:15192 0:150 2:14920 2:14845 1:161 0:115 0:96 1:141 1:119 0:95 0:93 0:92 1:112 0:93 0:91 0:84 1:122 1:107 0:93 0:92 1:111 1:103 1:110 1:106 1:111 0:92 0:92 1:107 0:92 0:92 0:92 0:91 1:112 0:96 1:114 2:14721 1:168 1:114 0:114 1:117 0:93 0:93 1:112 1:112 0:93 0:95 0:91 0:92 0:82 0:82 0:91 1:117 1:107 1:113 2:15015 1:169 0:113 1:129 2:14719 1:134 2:14638 2:14944 0:92 0:76 1:316 0:71 0:67 2:14826 0:117 0:74 1:183 1:162 0:82 1:111 0:84 0:74 2:14553 1:212 0:98 1:119 0:91 1:111 0:81 0:101 2:14912 1:302 0:185 0:133 0:102 1:164 0:101 0:90 0:83 0:76 0:134 2:15429 0:117 2:14204 0:121 0:94 0:103 1:210 0:109 1:121 1:124 0:82 2:14269 0:126 1:182 0:109 1:145 1:134 0:110 1:167 1:138 0:109 1:159 0:143 1:172 0:116 1:139 1:148 2:14052 1:140 0:88 0:83
```
</details>

## B04 figure repair record

Only presentation/player behaviour changed after initial reviews. Figure 5 now retains all Before/After ranges together in one semantic table, labelled as ranges across three runs per phase, with milliseconds and completions/second distinct. Player holds include the complete selected panel's rendered text and the persistent evidence table at 180 words/minute plus six seconds for comparison. Focus is moved to Play before disabling an active endpoint button. These changes introduce no new performance observations; all SQL, raw plans and latency samples above remain the evidence. The trailing space after the retained correctness-output column header was removed without changing any value. See writer.md for narrow local checks and remaining root-owned browser recheck.
