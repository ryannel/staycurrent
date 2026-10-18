# Evidence: Maintaining indexes

Checked 17 October 2026. Local PostgreSQL 18.6 (Homebrew, aarch64 macOS), SQLite 3.54.0 (Homebrew; dbstat enabled). MySQL was not installed or run: every MySQL claim comes from the 8.4 Reference Manual pages listed. Server for PostgreSQL ran on port 54718 with `autovacuum = off`, a socket in `/tmp/pgs`, and was stopped afterwards. Scripts were run from the session scratchpad; the SQL is reproduced in the article where it matters.

## Experiment 1: PostgreSQL bloat (1,000,000-row tables, defaults)

Table `(id bigint pk, customer_id int, placed_at timestamptz, total numeric(10,2), note text)` with indexes on id (pkey), customer_id, placed_at (increasing), total (random). Table 96 MB. Two copies: `o_rand` (delete `WHERE random() < 0.9`, 99,823 rows left) and `o_old` (delete `id <= 900000`, 100,000 left). Then `VACUUM`.

| index (size after load, after delete+VACUUM) | o_rand | o_old |
| --- | --- | --- |
| pkey / placed_at | 21 MB, 21 MB | 21 MB, 21 MB |
| customer_id | 7.8 MB, 7.8 MB | 9.4 MB, 9.4 MB |
| total | 21 MB, 21 MB | 30 MB, 30 MB |

`pgstatindex` after vacuum (leaf pages / deleted pages / avg_leaf_density): o_rand pkey 2733 / 0 / 9.21; o_rand customer 969 / 0 / 19.19; o_rand total 2733 / 0 / 9.3; o_old pkey and placed_at 274 / 2467 / 89.78; o_old customer 1174 / 0 / 19.51; o_old total 3832 / 0 / 6.65. Table file stayed 96 MB in both (vacuum made space reusable, it did not shrink the file).

Finding: random deletes leave every leaf page about 10 per cent full and no page is empty, so nothing is reclaimed. Deleting the oldest 90 per cent of an increasing key empties 2,467 leaf pages; they are marked deleted but the file keeps its size.

Reuse: after the first VACUUM `pg_freespace('o_old_pkey')` listed no free pages (count 0). Inserting 900,000 new rows (ids > 1,000,000) grew `o_old_pkey` from 21 MB to 41 MB. A second `VACUUM o_old` then showed 2,467 pages with free space; a further 500,000 inserts did not grow the index (41 MB). So pages emptied by one vacuum became reusable only after a later vacuum pass. (Mechanism consistent with the documented rule that deleted B-tree pages are recycled only when no transaction could still need them; the manual defers to `src/backend/access/nbtree/README`, which I did not read. The article states only what was measured.)

Rebuild: `REINDEX INDEX CONCURRENTLY` on each o_rand index: pkey 21 MB to 2200 kB, customer_id 7.8 MB to 1656 kB, placed_at 21 MB to 2200 kB, total 21 MB to 2216 kB. pgstatindex after: density 89.95 (pkey), 89.77 (customer). Each took 30 to 46 ms on 99,823 rows. Total relation size before the rebuilds: 169 MB (table plus indexes).

WAL: rebuilding an 11 MB index wrote about 10 MB WAL, plain or concurrent (`pg_wal_lsn_diff`). The CREATE INDEX WAL figure (136 MB) was contaminated by hint-bit and full-page writes after a bulk insert and is not used.

## Experiment 2: PostgreSQL locks (o_rand, 5-second sleep inside a transaction)

- `BEGIN; REINDEX INDEX o_rand_cust; SELECT pg_sleep(6)`: `pg_locks` showed `AccessExclusiveLock` on the index and `ShareLock` on the table. In another session with `lock_timeout = 1s`: INSERT timed out; `SELECT ... WHERE customer_id = 5` timed out; `EXPLAIN SELECT * FROM o_rand WHERE id = 5` also timed out (the planner opens every index of the table; the manual says plain REINDEX blocks nearly all queries except some cached prepared plans). A prepared statement could be created (no planning at that point is not tested beyond that).
- `REINDEX INDEX CONCURRENTLY o_rand_cust` while another session held an open transaction that had run `txid_current()`: an INSERT in a third session succeeded; the reindex sat `active` with `wait_event_type = Lock`, `wait_event = virtualxid` until the old transaction ended, then finished.
- A concurrent reindex cancelled by `statement_timeout = 2s` while waiting left `o_rand_cust_ccnew`, `indisvalid = f`, `indisready = t`; the original stayed valid. `DROP INDEX CONCURRENTLY o_rand_cust_ccnew` removed it.
- `CREATE UNIQUE INDEX CONCURRENTLY` on non-unique `customer_id` failed: `could not create unique index ... Key (customer_id)=(11215) is duplicated`; left `o_rand_cust_u` with `indisvalid = f`, `indisready = f`. Dropped with `DROP INDEX CONCURRENTLY`.
- `REINDEX CONCURRENTLY cannot run inside a transaction block` (error text) confirmed.
- Settings: `maintenance_work_mem` 65536 (kB), `max_parallel_maintenance_workers` 2, `autovacuum_analyze_threshold` 50, `autovacuum_analyze_scale_factor` 0.1, `autovacuum_vacuum_threshold` 50, `autovacuum_vacuum_scale_factor` 0.2, `default_statistics_target` 100.
- `pg_stat_user_indexes` columns include `last_idx_scan` (PG 18).
- amcheck extension installs; `bt_index_check('o_rand_pkey')` and `bt_index_check('o_rand_cust', true)` return without error on the sound indexes (output empty rows). `pgstattuple` ships with the Homebrew build (`pgstatindex`, version 1.5).

## Experiment 3: PostgreSQL statistics after a bulk load

`jobs2(id pk, state text, payload text)` with an index on state; 500,000 rows, 500 `queued`, 499,500 `done`, loaded in one INSERT with autovacuum off. Before `ANALYZE`: `reltuples = -1`, `relpages = 0`. `EXPLAIN (ANALYZE) WHERE state = 'done'`: Bitmap Heap Scan estimate 2,301 rows, actual 499,500, 5,682 heap blocks. After `ANALYZE`: Seq Scan estimate 499,617, actual 499,500. For `state = 'queued'` before: estimate 2,301, actual 500, bitmap scan; after: estimate 550, Index Scan. (Times, 24.6 ms and 20.0 ms for the `done` query, are not a benchmark and are not quoted.) After the load, `n_mod_since_analyze` and `last_analyze` are used only by autovacuum; with autovacuum off the stats stayed unset.

Duplicate-index queries tested on `o_rand` with a deliberate duplicate `o_rand_cust_dup` and a longer `o_rand_cust_placed (customer_id, placed_at)`: the exact-definition query (group `pg_index` by `indrelid, indkey, indclass, indcollation, indoption, indexprs, indpred`) returned `{o_rand_cust, o_rand_cust_dup}`; the prefix query returned both shorter indexes against the longer one. The prefix query ignores `indoption` (DESC) and `INCLUDE` columns, which the article states.

## Experiment 4: SQLite 3.54.0 (4096-byte pages, 1,000,000 rows, four b-trees: table, customer_id, placed_at, total)

| step | page_count | freelist_count | pages (percent of page used): table / cust / placed / total |
| --- | --- | --- | --- |
| loaded | 27,705 | 0 | 16,432 (99.0) / 3,052 (90.8) / 3,632 (87.5) / 4,588 (90.6) |
| deleted ~90% (100,372 left) | 27,705 | 23,741 | 2,028 (80.6) / 609 (45.8) / 420 (76.0) / 906 (46.2) |
| `REINDEX o_cust` | 27,705 | 24,069 | o_cust 281 (98.9), others unchanged |
| `VACUUM` | 2,674 | 0 | 1,651 (98.9) / 281 (98.9) / 321 (99.3) / 420 (99.3) |

File after VACUUM 10.95 MB (10,952,704 bytes). `PRAGMA integrity_check` returned `ok`. SQLite frees emptied pages to the freelist on delete, so the file kept its size but most pages were reusable; the random-key indexes were left about 46 per cent full. Page usage computed as `avg(100.0*(pgsize-unused)/pgsize)` from `dbstat` grouped by name.
Write blocking: in a transaction holding `REINDEX o_cust` open for 4 seconds, a read succeeded and an INSERT from a second connection failed with `database is locked` (busy timeout 0), in both `journal_mode=delete` and `wal`.

## Manuals read (all on 17 October 2026)

PostgreSQL 18: REINDEX (https://www.postgresql.org/docs/18/sql-reindex.html: locks, steps, `_ccnew`/`_ccold`, restrictions, exclusion constraints, one concurrent build per table); Routine Reindexing (routine-reindex.html: empty B-tree pages reclaimed, partly filled pages not; freshly built index slightly faster); B-Tree Implementation (btree.html: deduplication, bottom-up deletion, `deduplicate_items`); pgstattuple (pgstatindex columns; role `pg_stat_scan_tables`); amcheck (`bt_index_check` AccessShareLock, `bt_index_parent_check` ShareLock, not on hot standby, collation changes, cannot prove absence); DROP INDEX (CONCURRENTLY restrictions); Routine Vacuuming (analyze threshold, partitioned parents not auto-analyzed); Monitoring Statistics (`pg_stat_all_indexes`, `last_idx_scan`, stats reset after unclean shutdown); Resource Consumption (`maintenance_work_mem` 64MB; `max_parallel_maintenance_workers` 2 applies to B-tree CREATE INDEX).
MySQL 8.4: OPTIMIZE TABLE (mapped to ALTER TABLE ... FORCE for InnoDB; online; brief exclusive lock in prepare and commit; FULLTEXT falls back to table copy; "InnoDB only fills pages 93% full"); InnoDB Online DDL Operations (add secondary index: in place, no table rebuild, concurrent DML; drop index; rebuild table: in place, rebuilds, concurrent DML; `OPTIMIZE TABLE` forbids ALGORITHM/LOCK clauses); Invisible Indexes (syntax `ALTER TABLE t ALTER INDEX i INVISIBLE`, still maintained, primary key cannot be invisible, `use_invisible_indexes`, `IS_VISIBLE`); InnoDB Persistent Optimizer Statistics (`innodb_stats_persistent` ON, `innodb_stats_auto_recalc` ON at 10 per cent change, sample pages 20, `mysql.innodb_index_stats` stat names `size`, `n_leaf_pages`, `n_diff_pfxNN`, auto recalc not replicated, ANALYZE TABLE replicated); ANALYZE TABLE (read lock for InnoDB); sys `schema_redundant_indexes` (columns incl. `sql_drop_index`); Configuring the Merge Threshold for Index Pages (`MERGE_THRESHOLD` default 50, merges on delete and shortening update); Defragmenting (null ALTER, `ALTER TABLE ... FORCE`; fill factors 50-100 per cent make it hard to quantify); CHECK TABLE (InnoDB: only `QUICK` has effect; checks index structure and counts of entries; a corrupt page can stop the server). Unverified from the manual and written as general knowledge or left out: defaults of `innodb_sort_buffer_size`, `innodb_ddl_buffer_size`, `innodb_ddl_threads`, `innodb_online_alter_log_max_size` (names confirmed in the system-variable table only); replica behaviour for DDL (each replica re-executes the statement; general knowledge).
SQLite: VACUUM (up to twice the file size in free space; rebuilds file; fails with open transaction; `VACUUM INTO`; `auto_vacuum`); REINDEX (forms; reasons are collation or expression-function changes; `REINDEX EXPRESSIONS` is new in 3.53.0); PRAGMA (`optimize` recommendations and mask, `analysis_limit`, `integrity_check`, `quick_check`, `freelist_count`, `page_count`); dbstat (needs `SQLITE_ENABLE_DBSTAT_VTAB`; `aggregate` column; sqlite3_analyzer uses it).

## Verified names

PostgreSQL: `pg_relation_size`, `pg_stat_user_indexes` (`idx_scan`, `last_idx_scan`), `pgstatindex` (columns as above), `pg_index.indisvalid` / `indisready`, `REINDEX [CONCURRENTLY]`, `DROP INDEX CONCURRENTLY`, `bt_index_check`, `pg_freespace`, `autovacuum_analyze_threshold`, `autovacuum_analyze_scale_factor`. MySQL: `mysql.innodb_index_stats`, `sys.schema_redundant_indexes`, `ALTER TABLE ... ALTER INDEX ... INVISIBLE`, `OPTIMIZE TABLE`, `ALTER TABLE ... FORCE`. SQLite: `dbstat`, `PRAGMA optimize`, `PRAGMA integrity_check`, `REINDEX`, `VACUUM`, `PRAGMA freelist_count`. `sys.schema_unused_indexes` is named in the parent already; its page was not read here.

## Open

No MySQL server was run, so InnoDB sizes, `Data_free`, online DDL timings and replica lag are from the manual only. Nothing was measured on a replica. The experiment is a single-user laptop with small tables; times are not quoted. Revisit if a later PostgreSQL release changes B-tree page recycling or adds a built-in index-bloat view.
