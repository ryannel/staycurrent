# Query-results example and continuity

Starting example: supplied `docs/coverage/relational-rebuild-2026-10-25-example.md`, SHA256 `a3f885231f25d5d8a8d0528c145a025a67456946656187e8a380161223698c11`.

No shared extension is required. Retained people, order IDs, line numbers, quantities, unit prices, payment IDs, methods and status values exactly. Money has no assigned currency. Download product stock is the after-103 state: P3 10, P7 0, P9 4. Stock does not contribute to these calculations.

`model.mjs` owns figure facts. `queries.mjs` owns article SQL. The downloadable setup is generated from model facts, then appends the same query constants. A line is called an order line in prose and `order_items` in SQL.

Starting balances: 101 lines 39.50, payments 39.50, due 0; 102 lines 40, payments 40, due 0; 103 lines 29, payments absent/zero under the explicit report policy, due 29. Order 101 has four line/payment combinations and raw joined sums of 79 on both sides.

Separate shared scenarios, restored with savepoints in the download:
- Equal line values: split 102's quantity-two mug line into two numbered quantity-one 20.00 lines. Correct total 40, SUM(DISTINCT line value) 20. Never treated as the baseline.
- Partial payment: add 504, 103, 10.00, card, leaving pending status. Report due 19; no-payments query no longer returns 103. Never mixed into earlier diagrams.

Continuity reread: starts from tables/keys/simple SELECT and WHERE; aliases, match conditions, null-preserving join, truth filtering, correlated existence, multiplication, grouping and WITH introduced at use. No modelling prerequisite or promised completed neighbour. Wrapper owns child links and navigation. Broader grouping/HAVING/FILTER/count/empty inputs/windows, pagination and physical join plans remain with neighbours.
