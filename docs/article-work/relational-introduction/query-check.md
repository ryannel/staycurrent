# Query check

Historical check of the superseded worked-order draft. Its component and dataset
now live under `superseded/`; the current introduction has no SQL code example.

Executed the exact SQL and input rows from `src/lib/explainers/relational-intro.json` using Python sqlite3 3.53.1. The returned rows match the displayed result: two Blue mugs at 18 per item and one Bowl at 24 per item. This is a query-result check, not a PostgreSQL execution or performance test.
