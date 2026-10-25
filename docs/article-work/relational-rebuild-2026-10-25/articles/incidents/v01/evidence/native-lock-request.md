# Owned native lock verification request

Purpose: support the PostgreSQL mechanism illustrated in Figure 2, not its invented pool counts or any incident latency. The drawing remains a conceptual schedule.

Root may create one disposable PostgreSQL 18.6 container with no network listener or published ports, explicit task identity, bounded resources and owned data only, following input/native-verification.md. No existing/default database target. Use explicit clients and confirm version, database, data_directory and fixture identity before creating anything. Clean up sessions and container on success and failure. Retain launcher, verifier, results, exact runtime/image provenance and cleanup result in evidence/native-lock/.

The only required business data are the three customers and orders in evidence/verify-sql.mjs. The native fixture may use the same schema/data. No products, stock or payments need to change. Create everything in a unique fixture schema and set search_path explicitly for every participating connection.

1. H: `BEGIN; LOCK TABLE orders IN ACCESS EXCLUSIVE MODE;` Leave transaction open after the lock statement finishes.
2. Reader R on another connection: execute the exact history SQL extracted from src/articles/current/article.astro. Bound its statement timeout (e.g. 5 seconds) and lock timeout (e.g. 3 seconds); send it asynchronously.
3. Observer: correlate explicit H and R identities. Confirm H is idle in transaction and R is active with a lock wait. Confirm `pg_blocking_pids(R_pid)` contains H_pid and the expected orders relation lock modes appear.
4. H: `ROLLBACK`. Confirm R finishes before its timeout and returns 103/pending then 101/paid with exact times. Confirm rows unchanged.
5. Contrast on a fresh transaction H: `BEGIN; SELECT order_id FROM orders WHERE order_id=103 FOR UPDATE;` Leave it open. R executes the same ordinary history SELECT with short bounds. Confirm it returns immediately enough to complete under the bound, not a benchmark; confirm the row lock is still held while it does so. H rolls back. All core rows unchanged.

Do not report the three pool clients or two queued application callers as observed. This verification proves the table-lock mechanism, transaction lifetime and ordinary-read contrast only. The article currently makes no native measurement claim; a small truthful scope/version sentence may be added after successful results if useful.
