# a03 sources: Making concurrent changes correct

Checked on 21 October 2026. Each row gives the claim in the article, its source, and whether it was also observed in the worksheet runs (PostgreSQL 18.6, SQLite 3.54.0). MySQL claims come from the documentation only and are labelled "Documented; not run here" in the article.

## PostgreSQL 18

| Claim in the article | Source | Observed |
| --- | --- | --- |
| At Read Committed each statement sees data committed before it started; an UPDATE or locking read that meets a row changed by a concurrent transaction waits, then re-evaluates its WHERE on the updated version if that transaction commits, or proceeds on the original if it rolls back | https://www.postgresql.org/docs/18/transaction-iso.html#XACT-READ-COMMITTED | Yes: Figure 2 condition option, rollback prediction, visibility table |
| A conditional UPDATE whose committed row fails the condition skips it without waiting for an uncommitted change | Same page (rows not matching in the statement snapshot are not locked) | Yes: verify "Conditional update" check |
| Repeatable Read: one snapshot from the first statement; updating or locking a row changed after the snapshot fails with 40001 "could not serialize access due to concurrent update"; no phantoms in PostgreSQL's implementation | https://www.postgresql.org/docs/18/transaction-iso.html#XACT-REPEATABLE-READ | Yes: Figure 2 repeatable option, visibility table, fractured report |
| Serializable is SSI; failures 40001 at a statement or at commit; every participating transaction must be Serializable; read data is not valid until commit | https://www.postgresql.org/docs/18/transaction-iso.html#XACT-SERIALIZABLE | Yes: Figure 3 Serializable options (failure at commit) |
| Read Uncommitted behaves as Read Committed; anomaly table | https://www.postgresql.org/docs/18/transaction-iso.html (Table 13.1) | Partly (dirty read not separately run) |
| Retry the whole transaction, including decision logic, on 40001/40P01 | https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html | Yes: Figure 3 statement-retry counterexample |
| Row locks held until transaction end; ROLLBACK TO SAVEPOINT releases locks acquired after the savepoint; deadlocks detected, victim not predictable | https://www.postgresql.org/docs/18/explicit-locking.html | Deadlock and ordered move: yes. Savepoint lock release: documented only |
| FOR UPDATE, NOWAIT, SKIP LOCKED; locking clauses cannot be used with aggregates | https://www.postgresql.org/docs/18/sql-select.html#SQL-FOR-UPDATE-SHARE | Counting variation (locked rows miss a new row): yes. NOWAIT/SKIP LOCKED/aggregate restriction: documented only (a18's worksheet observed NOWAIT and SKIP LOCKED) |
| CHECK sees one row; UNIQUE waits for an uncommitted conflicting key then raises 23505 | https://www.postgresql.org/docs/18/ddl-constraints.html (the wait on an uncommitted key rests on the observed run) | Yes: concurrent clicks, insert-first variant |
| Error in a transaction blocks further statements (25P02); COMMIT of a failed transaction reports ROLLBACK | https://www.postgresql.org/docs/18/errcodes-appendix.html (25P02 in_failed_sql_transaction); the COMMIT-reports-ROLLBACK behaviour rests on the observed run | Yes |
| Transactional DDL; nextval never rolled back | https://www.postgresql.org/docs/18/functions-sequence.html (DDL: general transactional behaviour) | Yes: ddlAndSequences |
| synchronous_commit on waits for WAL flush; off risks losing recent commits (up to three times wal_writer_delay) without inconsistency, unlike fsync off; settable per transaction | https://www.postgresql.org/docs/18/wal-async-commit.html, https://www.postgresql.org/docs/18/runtime-config-wal.html#GUC-SYNCHRONOUS-COMMIT | Settings recorded (synchronous_commit=on, fsync=on); crash behaviour not tested |
| Error codes 40001, 40P01, 55P03, 57014, 23505, 23514, 25P02 | https://www.postgresql.org/docs/18/errcodes-appendix.html | 40001, 40P01, 23505, 23514, 25P02 observed; 55P03 and 57014 documented only |
| (r01) Durability of a commit depends on storage honouring flushes; drive write-back caches can break it | https://www.postgresql.org/docs/18/wal-reliability.html | Documented only |
| (r01) A COMMIT can have reached the server and not finished (held here by a synchronous standby that never connects); until it finishes other sessions cannot see its rows; a session waiting on its row or key gets the outcome when it ends; terminating the waiting backend reports "already committed locally" | https://www.postgresql.org/docs/18/warm-standby.html#SYNCHRONOUS-REPLICATION | Yes: verify "In-flight COMMIT" check (lookup finds no R8; take-first repeat waits, then no row; record-first repeat waits, then 23505) |
| (r01) A deadlock between opposite lock orders aborts one transaction with 40P01; ascending order lets both moves commit | https://www.postgresql.org/docs/18/explicit-locking.html#LOCKING-DEADLOCKS | Yes: Figure 4 replay (in this run the transaction that waited first, Tariq's, was aborted) |
| pg_stat_activity wait_event_type = 'Lock' to confirm a wait | https://www.postgresql.org/docs/18/monitoring-stats.html#PG-STAT-ACTIVITY-VIEW | Used by the worksheet |

## MySQL 8.4 InnoDB (documented; not run)

| Claim | Source |
| --- | --- |
| Default Repeatable Read; consistent read snapshot established by the first consistent read | https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html, https://dev.mysql.com/doc/refman/8.4/en/innodb-consistent-read.html |
| The snapshot applies to SELECT, not necessarily DML; UPDATE/DELETE see and lock the latest committed rows, so a stale absolute overwrite succeeds | https://dev.mysql.com/doc/refman/8.4/en/innodb-consistent-read.html |
| Locking reads and next-key/gap locks | https://dev.mysql.com/doc/refman/8.4/en/innodb-locking-reads.html, https://dev.mysql.com/doc/refman/8.4/en/innodb-next-key-locking.html |
| Serializable converts plain SELECT to SELECT … FOR SHARE when autocommit is disabled | https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html |
| Deadlock rolls back whole transaction; lock wait timeout rolls back the statement unless innodb_rollback_on_timeout; duplicate key rolls back the statement | https://dev.mysql.com/doc/refman/8.4/en/innodb-error-handling.html |
| DDL causes implicit commit | https://dev.mysql.com/doc/refman/8.4/en/implicit-commit.html |

The InnoDB Serializable card's "two read-then-write transactions can deadlock" is an inference from shared-lock compatibility on that page, not a documented example; a reviewer may want it run.

## SQLite

| Claim | Source | Observed |
| --- | --- | --- |
| Serializable between separate connections; WAL readers keep a snapshot; one writer | https://www.sqlite.org/isolation.html, https://www.sqlite.org/wal.html | Yes |
| Deferred transaction's write after another commit fails SQLITE_BUSY_SNAPSHOT | https://www.sqlite.org/rescode.html#busy_snapshot | Yes |
| BEGIN IMMEDIATE takes the write lock at the start; second writer waits on busy timeout | https://www.sqlite.org/lang_transaction.html | Yes (waited 0.36 s in the first run, 0.39 s in r01; the article no longer quotes the time) |

## Papers

- H. Berenson, P. Bernstein, J. Gray, J. Melton, E. O'Neil, P. O'Neil, "A Critique of ANSI SQL Isolation Levels", SIGMOD 1995, https://arxiv.org/abs/cs/0701157: ambiguity of the standard's phenomena, lost update, write skew, snapshot isolation.
- D. R. K. Ports, K. Grittner, "Serializable Snapshot Isolation in PostgreSQL", PVLDB 5(12), 2012, https://arxiv.org/abs/1208.4179: SSI design, SIRead locks, dangerous structures, false positives.

## On-site links

/review/relational-next/ (a00 anchor a-transaction-protects-a-change-within-a-stated-contract), constraints/ (a10), changing-data/ (a17), locking/ (a18, four anchors after r01), isolation/ (a19), physical-storage/ (a24), concurrent-load/ (a28), request-recovery/ (a22, three anchors), replicas-and-partitions/ (a38), backup-and-restore/ (a39), background-work/ (a23), connections/ (a20). Every anchor was confirmed in the relational-next source files and in the rendered page's link list.
