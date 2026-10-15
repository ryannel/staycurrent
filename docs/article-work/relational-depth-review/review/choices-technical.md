# Choices repairs: independent technical and editorial review

Reviewed 15 October 2026 by the foundations reviewer, who did not author these changes. Read the complete revised access-control, adding-another-system and product-comparison articles, both new lessons, their verification scripts and recorded results. Did not read the fresh-reader log. This is a source and evidence review; rendering is pending with the coordinator. No native rerun was needed.

## Decisions

**Access control — accept the bounded repair.** The three orders distinguish permissive OR, restrictive AND and default denial without relying on an administrative session. The new example explicitly resets fixture and role identity rather than silently continuing the packed order from the earlier lesson. The column denial remains independently tested. The packed variation asks for a prediction that distinguishes the rules. Each step's recorded rows and SQLSTATE match its claim. No additional role catalogue is needed.

**Adding another system — accept the bounded repair.** The new sequence teaches the local obligation, separate destination commit and later acknowledgement. The data-modifying CTE consumes the updated row, so the event is not reconstructed from stale application state. Rollback leaves no change or event; the interruption leaves a durable pending obligation after destination success; duplicate and old delivery preserve inactive version 2. The text distinguishes a successful no-op from a missing response, requires immutable complete versioned states, and states that one sequential worker is not a production claim protocol. The one-database lesson is explicitly a state model, not evidence of network delivery or cross-service atomicity. The surrounding article already covers stale positives, missing results, tombstones, rebuild boundaries and recovery load; the new execution path joins those explanations rather than replacing them with a recipe.

**Product comparison — accept the bounded repair.** The two-read schedule has an unambiguous first read, completed intervening commit and second read in the same transaction. The table labels native PostgreSQL and SQLite observations separately from documented MySQL and SQL Server expectations. The SQL Server row is valid for this schedule with RCSI either off or on: both ordinary reads finish before the other connection's committed insert is observed by the second statement. It does not claim that locking Read Committed gives an internally consistent statement snapshot. SQLite's rejected read-to-write transition adds a useful application consequence and requires a new transaction, rather than promising that retrying the write in the old snapshot helps. Existing deployment, type, access and operating comparisons remain bounded and useful.

## Evidence and sources

The two new lessons have thirteen executed steps on PostgreSQL 18.6 and PGlite's PostgreSQL 18.3, plus the packed-policy variation. The evidence records agree with the assertions: policy results 1/3 → 1/2/3 → 1 → empty → 1, denied email 42501, packed variation 3; outbox rollback unchanged, committed event version 2, pending obligation after destination acceptance, safe equal-version no-op and old-version rejection. The scripts use a separate named native database and explicit lesson fixture prefixes.

The comparison's two native PostgreSQL connections observe 1→2 at Read Committed and 1→1 at Repeatable Read, with a fresh transaction seeing 2 in both cases. The isolated SQLite WAL file observes 1→1, error 517 on reader promotion and 2 after rollback. No execution evidence is asserted for MySQL or SQL Server.

Independently checked primary documentation:

- [PostgreSQL 18 row security](https://www.postgresql.org/docs/18/ddl-rowsecurity.html): applicable permissive policies combine with OR, restrictive conditions add requirements, and role/column privileges still matter.
- [MySQL 8.4 InnoDB isolation](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html): ordinary consistent reads at Repeatable Read retain the first consistent-read snapshot; locking reads differ.
- [SQL Server isolation reference](https://learn.microsoft.com/en-us/sql/t-sql/statements/set-transaction-isolation-level-transact-sql?view=sql-server-ver17): ordinary Read Committed locks end within/at the statement, while RCSI supplies a statement snapshot. Neither promises a transaction-wide snapshot here.
- [SQLite isolation](https://www.sqlite.org/isolation.html): WAL readers keep their view and a stale reader cannot become a writer without releasing that snapshot.

**Verdict:** no source repair required by this independent review. The new material reaches the intended explanatory depth through observable decisions and failure paths. Root should complete the planned rendered/media and sandbox navigation checks before publishing.
