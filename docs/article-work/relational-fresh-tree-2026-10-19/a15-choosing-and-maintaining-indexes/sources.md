# Planning evidence

Checked 19 October 2026. These primary sources constrain the intended explanations;
the breakdown is a plan, not a claim that any experiment has been executed.

- [PostgreSQL 18 multicolumn indexes](https://www.postgresql.org/docs/18/indexes-multicolumn.html): distinguish interval bounds, later index conditions and conditional skip scans.
- [PostgreSQL 18 partial indexes](https://www.postgresql.org/docs/18/indexes-partial.html): predicate implication and the danger of proliferating partial indexes. The writer must distinguish generic plans from parameter-specific planning rather than copy a blanket statement about prepared queries.
- [PostgreSQL 18 covering and index-only scans](https://www.postgresql.org/docs/18/indexes-index-only-scans.html): payload versus search keys, visibility-driven heap visits, and query-relative coverage.
- [PostgreSQL 18 combining indexes](https://www.postgresql.org/docs/18/indexes-bitmap-scans.html): combination and loss of ordered traversal.
- [PostgreSQL 18 CREATE INDEX](https://www.postgresql.org/docs/18/sql-createindex.html): concurrent-build waits, extra work, invalid indexes after failure and uniqueness interactions.
- [PostgreSQL 18 index chapter](https://www.postgresql.org/docs/18/indexes.html): primary reference for method/operator eligibility, expressions, collation and ordering; exact examples need checking when written.
- [MySQL 8.4 InnoDB clustered and secondary indexes](https://dev.mysql.com/doc/refman/8.4/en/innodb-index-types.html): secondary entry locators and clustered-key width consequences.
- [MySQL 8.4 online DDL operations](https://dev.mysql.com/doc/refman/8.4/en/innodb-online-ddl-operations.html): distinguish secondary-index additions from clustered-key rebuilding and inspect per-operation concurrency support.

No prior article tree or existing relational article was used as a starting structure.
