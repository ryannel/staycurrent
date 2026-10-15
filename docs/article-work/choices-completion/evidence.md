# Product and additional-system evidence

Checked 15 October 2026. Product comparison targets PostgreSQL 18, MySQL 8.4
InnoDB, SQL Server 2025 and the documented SQLite embedded model. These are
identified versions, not a universal latest-version claim. Primary documents were
opened during authoring; examples and decision scenarios are original reasoning.

- SQLite [deployment](https://www.sqlite.org/whentouse.html),
  [isolation](https://www.sqlite.org/isolation.html),
  [STRICT tables](https://www.sqlite.org/stricttables.html), and
  [foreign keys](https://www.sqlite.org/foreignkeys.html): embedded/server boundary,
  serialised writers, WAL reader behaviour, type enforcement and connection settings.
- PostgreSQL 18 [isolation](https://www.postgresql.org/docs/18/transaction-iso.html),
  [numeric](https://www.postgresql.org/docs/18/datatype-numeric.html),
  [constraints](https://www.postgresql.org/docs/18/ddl-constraints.html), and
  [JSON](https://www.postgresql.org/docs/18/datatype-json.html): snapshots, typmod
  rounding, NaN comparison and engine-specific JSON operations.
- MySQL 8.4 [isolation](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html),
  [index organisation](https://dev.mysql.com/doc/refman/8.4/en/innodb-index-types.html),
  [SQL modes](https://dev.mysql.com/doc/refman/8.4/en/sql-mode.html), and
  [JSON](https://dev.mysql.com/doc/refman/8.4/en/json.html): consistent-read defaults,
  clustered primary key and secondary locators, input conversion settings.
- SQL Server [2025 editions](https://learn.microsoft.com/en-us/sql/sql-server/editions-and-components-of-sql-server-2025?view=sql-server-ver17),
  [isolation](https://learn.microsoft.com/en-us/sql/t-sql/statements/set-transaction-isolation-level-transact-sql?view=sql-server-ver17),
  [index design](https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-index-design-guide?view=sql-server-ver17),
  and [JSON](https://learn.microsoft.com/en-us/sql/relational-databases/json/json-data-sql-server?view=sql-server-ver17):
  RCSI setting, clustered versus heap organisation, edition boundaries. Article does
  not assert universal availability of a particular JSON feature or current pricing.
- PostgreSQL [text-search introduction](https://www.postgresql.org/docs/18/textsearch.html),
  [table arrangement](https://www.postgresql.org/docs/18/textsearch-tables.html),
  [query controls](https://www.postgresql.org/docs/18/textsearch-controls.html),
  [indexes](https://www.postgresql.org/docs/18/textsearch-indexes.html): stored
  generated tsvector, explicit language configuration, stemming, AND query terms,
  GIN. Tiny exercise demonstrates matching, not production relevance or capacity.
- Chris Richardson's original [transactional outbox pattern](https://microservices.io/patterns/data/transactional-outbox)
  documents local atomic recording and relay duplicates. Versioned complete-state
  replacement, withdrawal retention and stale-read example are explicit deductions
  over the article's invented data, exercised in SQL. No exactly-once claim.
- PostgreSQL [logical decoding concepts](https://www.postgresql.org/docs/18/logicaldecoding-explanation.html)
  documents exported snapshots tied to the subsequent change stream. Rebuild text
  requires a supported snapshot/stream boundary and does not claim a timestamp
  alone creates it. Observability and cutover are engineering requirements.

## Executed evidence

`node docs/article-work/choices-completion/verify.mjs` runs literal lesson blocks
through the raw simple-query protocol. It asserts exact numeric conversion and
retained rows after a rejected update, search matches and changed generated terms,
and stale-copy/version replay results. Each lesson includes an executed variation
and reset. No other SQL engine or distributed service runs in these exercises.

Independent review and rendered inspections are recorded separately before release.
