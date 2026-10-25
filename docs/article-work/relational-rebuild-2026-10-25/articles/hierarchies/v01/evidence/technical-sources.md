# Technical source checks · 25 October 2026

Primary sources read with web tools:
- https://www.postgresql.org/docs/18/queries-with.html : iterative working-table semantics, final ORDER BY versus physical evaluation, path arrays, CYCLE, whole-row UNION duplicate rule.
- https://www.postgresql.org/docs/18/ddl-constraints.html : self-referencing FK, check boundary/NULL, RESTRICT.
- https://www.postgresql.org/docs/18/sql-lock.html and explicit-locking.html : acquire before topology reads, SHARE ROW EXCLUSIVE conflicts with itself and ordinary writers, ordinary SELECT permitted, transaction duration, same lock order.
- https://www.postgresql.org/docs/18/transaction-iso.html : fresh Read Committed statements after lock wait; earlier Repeatable Read snapshot caveat.
- https://www.postgresql.org/docs/18/ltree.html : segment label paths, <@/@> include equality, nlevel/subpath/concatenation, GiST support.
- https://www.postgresql.org/docs/18/sql-truncate.html : ACCESS EXCLUSIVE and MVCC caveat; rebuild intentionally DELETE/INSERT.

Original worked derivations (not observed performance): closure pair counts and crossing-pair product; path rewrite; nested entry/exit numbering; chain n(n+1)/2; DAG path-versus-ID multiplicity. Checked by owned PostgreSQL SQL and shared deterministic figure model. No cross-engine claim or universal ranking.

Execution: PGlite0.5.8/PostgreSQL18.3 WASM, owned in-memory instance, full download and checks, closed in finally. Native PostgreSQL18.6 Linux/aarch64, ltree1.3, real pg8.23.1 connections, root-owned disposable container; target/identity checked before DDL. Native harness confirms unprotected cycle, actual pg_blocking_pids relation, protected rejection P0001, derived consistency and cleanup. Both evidence files record exact input hashes. No native timings/performance, no production observation, no default/user DB.
