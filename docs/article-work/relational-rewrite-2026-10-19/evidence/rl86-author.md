# RL86 author evidence

19 October 2026. Authored explanation; independent review remains outstanding.

## Scope and observed execution

Full original temporary-table experiment rerun natively; covering 13→4→5 bufferaccesses;10→0→1 heapfetches;1/4 index inserts generate 3.3/6.7 MBWAL;100 k/1 m/10 m depths 2/3/3 and 276/2745/27422 pages; GIN 1666 matches; BRIN 1440 matches,1520 rechecks,16 lossypages.

Native PostgreSQL: 18.6 (Homebrew), aarch64-apple-darwin25.6.0. Isolated cluster under a unique temporary directory, Unix socket and port 56679; default services were not touched. Ordinary examples used unique author_rl86 schemas; retained index experiments use temporary tables plus dedicated author_rl86 tables. Python driver: 3.14.5, bundled SQLite 3.54.0. No MySQL or SQL Server execution is claimed.

## Reproduce and reset

The batch verifier is `evidence/rl77-89-verify.py`. Run it with the root of an already initialised disposable PostgreSQL 18 cluster listening on 56679. It creates and resets only its named author schemas. Expected constraint and cursor errors are asserted by SQLSTATE; unexpected SQL errors stop it. Its raw libpq result text prints NULL as an empty field.

`rl86-native.txt` records commands, rows and expected errors. The separate `rl86-native-run.sql` includes the retained full script plus depth and WAL variations. `rl86-experiment.sql` is the safe temporary-table download; `rl86-alternatives.sql`/`rl86-alternatives-native.txt` cover GIN/BRIN. Component manifest: `rl86-components.md`. Stop the disposable instance with `pg_ctl -D <lab>/data stop -m fast`; remove only that owned lab directory afterwards. Commands and observations remain in this work folder.

## Evidence limits

Native runs establish these examples on the recorded versions, not universal performance numbers. Invented figures are models of stated inputs. Other-engine contrasts use the annotated primary documentation, not local measurements. Browser checks and final whole-collection review belong to the coordinator.

## Primary source ledger

Sources below are annotated at their reading positions or in the article’s Sources section. PostgreSQL 18 manual pages, Python sqlite3 documentation, SQLite documentation and the listed MySQL 8.4/SQL Server pages were browsed on 19 October 2026 where they carry new claims. RL86 also retains its earlier 17–18 October source record and explicitly labelled PGlite 18.3 measurements.

- https://www.postgresql.org/docs/18/indexes-types.html
- https://www.postgresql.org/docs/18/hash-index.html
- https://www.postgresql.org/docs/18/gist.html
- https://www.postgresql.org/docs/18/spgist.html
- https://www.postgresql.org/docs/18/gin.html
- https://www.postgresql.org/docs/18/brin.html
- https://www.postgresql.org/docs/18/bloom.html
- https://www.postgresql.org/docs/18/btree.html
- https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/access/nbtree/README
- https://www.postgresql.org/docs/18/indexes-multicolumn.html
- https://www.postgresql.org/docs/18/indexes-index-only-scans.html
- https://www.postgresql.org/docs/18/indexes-ordering.html
- https://www.postgresql.org/docs/18/indexes-opclass.html
- https://www.postgresql.org/docs/18/sql-createindex.html
- https://www.postgresql.org/docs/18/indexes-partial.html
- https://www.postgresql.org/docs/18/indexes-expressional.html
- https://www.postgresql.org/docs/18/indexes-unique.html
- https://www.postgresql.org/docs/18/using-explain.html
- https://www.postgresql.org/docs/18/sql-cluster.html
- https://dev.mysql.com/doc/refman/8.4/en/innodb-index-types.html
- https://dev.mysql.com/doc/refman/8.4/en/innodb-multi-versioning.html
- https://dev.mysql.com/doc/refman/8.4/en/innodb-physical-structure.html
- https://dev.mysql.com/doc/refman/8.4/en/index-page-merge-threshold.html
- https://dev.mysql.com/doc/refman/8.4/en/innodb-online-ddl-operations.html
- https://dev.mysql.com/doc/refman/8.4/en/create-table-foreign-keys.html
- https://dev.mysql.com/doc/refman/8.4/en/order-by-optimization.html
- https://dev.mysql.com/doc/refman/8.4/en/index-merge-optimization.html
- https://dev.mysql.com/doc/refman/8.4/en/index-condition-pushdown-optimization.html
- https://dev.mysql.com/doc/refman/8.4/en/mrr-optimization.html
- https://www.sqlite.org/withoutrowid.html
- https://www.sqlite.org/queryplanner.html
- https://www.sqlite.org/eqp.html
- https://www.sqlite.org/optoverview.html
- https://www.sqlite.org/expridx.html
- https://www.sqlite.org/partialindex.html
- https://www.sqlite.org/foreignkeys.html
- https://www.postgresql.org/docs/18/populate.html
- https://dev.mysql.com/doc/refman/8.4/en/sorted-index-builds.html
- https://learn.microsoft.com/en-us/sql/relational-databases/indexes/clustered-and-nonclustered-indexes-described
- https://learn.microsoft.com/en-us/sql/relational-databases/tables/primary-and-foreign-key-constraints
- https://learn.microsoft.com/en-us/sql/relational-databases/tables/unique-constraints-and-check-constraints
- https://learn.microsoft.com/en-us/sql/relational-databases/indexes/create-filtered-indexes
- https://learn.microsoft.com/en-us/sql/relational-databases/indexes/indexes-on-computed-columns
- https://learn.microsoft.com/en-us/sql/t-sql/statements/set-statistics-io-transact-sql
- https://learn.microsoft.com/en-us/sql/relational-databases/indexes/specify-fill-factor-for-an-index
- https://learn.microsoft.com/en-us/sql/relational-databases/indexes/perform-index-operations-online
