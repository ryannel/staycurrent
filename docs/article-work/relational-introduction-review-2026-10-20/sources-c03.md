# Source and evidence record · a00 Relational databases · c03

Writer: worker session, 20 October 2026. This record replaces nothing. The earlier polish folder's `sources.md` stays as a historical record.

## Where the evidence lives

The executable record is `src/components/relational-next/a00/verify.mjs`. It builds the fixture from `queries.mjs`, and every statement below is in that file.

It last ran in full and passed on 20 October 2026 against a disposable local cluster:

| Item | Value |
| --- | --- |
| Server | `PostgreSQL 18.6 (Homebrew) on aarch64-apple-darwin25.6.0, compiled by Apple clang version 21.0.0 (clang-2100.3.34.2), 64-bit` |
| Cluster | Fresh, made with `initdb --locale=C` in the session scratchpad, default settings |
| Connection | TCP 127.0.0.1:57461, Unix sockets off, role `staycurrent` |
| Database | `rel3_a00_run13`, created by the script |
| Command | `REL3_A00_PORT=57461 REL3_A00_DB=rel3_a00_run13 node src/components/relational-next/a00/verify.mjs` |
| Afterwards | The cluster was stopped |

Earlier passing runs of the smaller script were on `rel3_a00_run10` and `rel3_a00_run12`. The manual probes on `rel3_a00_run11` are superseded by the scripted checks below.

## What verify.mjs covers

| Article claim | What the script runs and asserts |
| --- | --- |
| Shop tables figure | The fixture's customers, orders, order_items and products rows equal the models drawn by `ShopTables.astro`. |
| First query and Figure 1 | `selectOrders` returns order 101 only. The `summary` query returns 101 · Mina · 36, and its LEFT JOIN form adds 102 · Arun · NULL. The joined rows equal the model for both joins. `COUNT(*)` against `COUNT(i.product_id)` for order 102 gives 1 and 0. `= NULL` matches 0 rows and `IS NULL` matches 2. |
| Figure 2 | Separate commits that stop before the reservation leave order 103 and its item with stock 1. `BEGIN … ROLLBACK` leaves neither. The order 103 listing (`checkout`, which stops at `RETURNING available;`) followed by `COMMIT;` returns 0 and leaves the order, item and stock 0. |
| Figure 3 | Two `psql` sessions run at the same time. In read-then-write, both read 1 and both commit, so orders 103 and 104 are accepted and stock is 0. In the conditional `UPDATE`, Mina's statement returns 0 and Arun's waits, then returns no row and rolls back, so only 103 is accepted. |
| Figure 4 (new at c03) | `ALTER TABLE orders ADD COLUMN purchase_attempt text UNIQUE;`, then each attempt runs `BEGIN; INSERT INTO orders (order_id, customer_id, status, purchase_attempt) VALUES (…, 1, 'pending_payment', 'R103'); INSERT INTO order_items …; UPDATE products … RETURNING available;`. Cases (a) to (c) follow this table. |
| Figure 6 (new at c03) | The early path and the staged path are listed after this table. Orders 114 and 115 are inserted as `(id, customer, 'pending_payment')`. |

### Figure 4 retry cases

- **(a) Retry after the first attempt committed.** Order 103 commits with R103. A retry under order 150 with R103 fails with `duplicate key value violates unique constraint "orders_purchase_attempt_key"` and `Key (purchase_attempt)=(R103) already exists`. Only order 103 holds R103, and stock stays 0.
- **(b) Retry while the first attempt is still open.** The first attempt holds R103 and the mug row. The same retry for order 103 waited about 1.0 s, until the first session was ended with `pg_terminate_backend`. It then committed and returned 0. One order holds R103.
- **(c) Retry while the first attempt is open and then commits.** The retry under order 150 waited about 0.7 s, then failed with the same duplicate-key error.

### Figure 6 paths

**Early path**

1. `ALTER TABLE orders ADD COLUMN delivery_instruction text NOT NULL;` fails with `column "delivery_instruction" of relation "orders" contains null values`.
2. The old version's insert of 114 is accepted.
3. The column is added as optional and every row is filled: 101 'Leave at reception', 114 'Ring twice', and the rest 'From courier records'.
4. `ALTER COLUMN delivery_instruction SET NOT NULL` is applied.
5. The old version's insert of 115 fails with `null value in column "delivery_instruction" of relation "orders" violates not-null constraint`.

**Staged path**

1. The column is added as optional.
2. The old version's insert of 114 is accepted with NULL.
3. The new version inserts 115 with 'Side gate'.
4. Rows are filled and no NULL remains.
5. `SET NOT NULL` succeeds.

## Limits

- Case (b) ends the first session with `pg_terminate_backend`, which closes it at once. A silent network failure, which the server notices later, was not tested. The article says only that the server rolls the transaction back once it notices the session has ended.
- Lock waits were observed only as elapsed time over a short artificial sleep. They are not timings for any real workload.
- The lock-queue sentence for schema changes, `lock_timeout`, `idle_in_transaction_session_timeout`, `VACUUM` and `ANALYZE` behaviour, asynchronous commit, failover and point-in-time recovery are cited from the PostgreSQL 18 documentation listed in the article's sources. None of them is executed here. MySQL InnoDB's default isolation level comes from the MySQL 8.4 manual only.
- The figures are illustrative models. They do not contact a server, and the script checks that their stated outcomes match the server.

## Documentation sources

Most sources were checked on 19 October 2026. The three marked as added were checked on 20 October 2026.

- PostgreSQL 18 documentation:
  - ALTER TABLE
  - Database page layout
  - Constraints
  - Numeric types
  - Table expressions
  - Aggregate functions
  - Comparison functions
  - Sorting rows
  - Transactions
  - Transaction isolation
  - Asynchronous commit
  - libpq parameterised execution
  - Connection status functions
  - Message flow
  - Client connection defaults (added)
  - Introduction to indexes
  - Using EXPLAIN
  - Routine vacuuming (added; it covers both reclaiming space and updating planner statistics, and says autovacuum automates both `VACUUM` and `ANALYZE`)
  - Continuous archiving and point-in-time recovery
  - Log-shipping standby servers
- MySQL 8.4, InnoDB transaction isolation levels (added).
- SQLite, Serverless.
