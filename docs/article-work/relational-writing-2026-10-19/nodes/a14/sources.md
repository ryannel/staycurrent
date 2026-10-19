# Joining and summarising data: source and execution record

Checked 19 October 2026. The fixture and monetary values are invented teaching
data. They do not represent a measured workload or accounting policy.

## Primary sources

- PostgreSQL 18 [Joins Between Tables](https://www.postgresql.org/docs/18/tutorial-join.html): row pairing, aliases, self-joins and left preservation. The manual explicitly distinguishes conceptual pairing from physical join execution.
- PostgreSQL 18 [Table Expressions](https://www.postgresql.org/docs/18/queries-table-expressions.html): cross/inner/outer joins, null extension, restrictions in ON versus WHERE, grouping and HAVING.
- PostgreSQL 18 [Aggregate Functions](https://www.postgresql.org/docs/18/functions-aggregate.html): COUNT(*), COUNT(expression), SUM/AVG/MIN/MAX null handling and empty inputs.
- PostgreSQL 18 [Value Expressions: aggregate expressions](https://www.postgresql.org/docs/18/sql-expressions.html#SYNTAX-AGGREGATES): DISTINCT removes equal aggregate input values; FILTER applies to one aggregate.
- PostgreSQL 18 [Aggregate Functions tutorial](https://www.postgresql.org/docs/18/tutorial-agg.html): source WHERE versus group HAVING, conditional per-aggregate selection.
- PostgreSQL 18 [SELECT](https://www.postgresql.org/docs/18/sql-select.html#SQL-GROUPBY): ungrouped values, primary-key functional dependency allowances, final ordering.
- SQLite [Bare columns in an aggregate query](https://www.sqlite.org/lang_select.html#bare_columns_in_an_aggregate_query): documented SQLite allowance and arbitrary-row interpretation. Documentation checked; no SQLite execution is claimed.

## Reproducible SQL evidence

Owned source: `src/components/relational-next/a14/queries.mjs` holds the complete
temporary fixture, query stages, report and independently hand-derived expected
rows. Article SQL imports those strings. The incomplete basic conditional SUM
and the single-expression guard are teaching extracts from the complete
conditional-total query.

Run from repository root:

```sh
node src/components/relational-next/a14/verify.mjs
node src/components/relational-next/a14/verify.mjs --native
```

The first completed with all assertions passing under PGlite 0.5.8:
PostgreSQL 18.3, wasm32-unknown-emscripten, 32-bit. The second completed with
the same assertions passing on PostgreSQL 18.6 (Homebrew),
aarch64-apple-darwin25.6.0, Apple clang 21.0.0, 64-bit, in this run's isolated
loopback cluster described in `../../runtime.md`. Native mode creates and drops
only a uniquely named `rel3_a14_run<timestamp>` database. For native mode the
same tables are session-persistent within that disposable database so the
verification subprocesses can inspect them; the article's reader fixture uses
temporary tables in one session. No production database was used.

Expected rows were calculated by hand before query execution. Both engines
returned, ordered by customer_id:

| ID | Name | Orders | Complete order value | Payments |
| --- | --- | --- | --- | --- |
| 1 | Mina | 2 | 50 | 30 |
| 2 | Tariq | 0 | 0 | 0 |
| 3 | Mina | 1 | 40 | 10 |
| 4 | Edda | 0 | 0 | 0 |
| 5 | Sol | 1 | NULL | 5 |

The verifier checks:

- Four customer/order inner-join pairs; twenty pairs if the relationship condition becomes true.
- The incomplete tenant composite predicate returns four pairs rather than two.
- The presence query returns customer IDs 1, 3, 5 without multiplying customer 1.
- ON-period left join returns six rows representing all five customers; WHERE-period variant returns four rows representing IDs 1, 3, 5.
- All four count columns for all five customers, including repeated amount 20, null amount and null-extended rows.
- Group by customer identity returns only customer 1 above the two-order threshold; grouping by display name incorrectly gives Mina three orders.
- Conditional totals: (1, 30, 20), (3, 40, 0), (5, NULL, 0).
- Empty global aggregate returns (0, NULL); empty grouped aggregate returns no rows.
- Employee-manager self-join preserves the employee without a manager.
- Neither intermediate subtotal has duplicate customer IDs; final report has one row per promised ID.
- Independently aggregated orders: four orders, three valued orders, known subtotal 90. Independently aggregated payments: 45. The complete order total is unknown because one order lacks a complete value.
- Wrong detail-to-detail join returns customer 1's totals (100, 60). Comparison of the shared customer_id/order_value/payment_value projection rejects it against the same projection of the expected report, so the negative check is about values rather than a differing column shape. Comparing ON-period and WHERE-period customer/order pairs exposes the two dropped customers.
- SUM(DISTINCT amount) returns 15 for customer 1's two separate payments of 15, demonstrating that it is not a general repair.
- Removing Sol's only line leaves the complete order value NULL.
- Changing January's half-open period to February retains all five customers with count and values zero.
- Interactive model final counters agree with these engine outcomes: 4/20 matching pairs, 5 customers in 6 rows / 3 customers in 4 rows, 100/60 wrong sums / 50/30 repaired sums.

## Models and limits

`models.mjs` implements illustrative logical stages in JavaScript. The three
figures show row pairing, ON/WHERE preservation and independent-detail
multiplication. Step order is for teaching, not an observed query plan. The
figures do not execute SQL. No latency, join algorithm, memory consumption or
execution-cost measurement is claimed. The PostgreSQL equality/date/numeric and
aggregate behaviour in their finished states is checked against actual engine
results.

The article keeps expression detail with a13, existence/membership semantics
with a15, retained-detail calculations with a16, and execution costs with a05.
