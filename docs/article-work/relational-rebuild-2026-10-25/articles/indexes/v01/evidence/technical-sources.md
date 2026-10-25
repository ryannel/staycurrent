# Technical source checks

Checked25 October2026, PostgreSQL18 primary documentation except the stated InnoDB comparison. No secondary technical sources used.

| Consequential claim | Primary source |
| --- | --- |
| Index route to rows; automatically maintained; compare planner work | https://www.postgresql.org/docs/18/indexes-intro.html |
| Fixed-size index/table pages; heap locator is page+item identifier | https://www.postgresql.org/docs/18/storage-page-layout.html |
| B-tree leaves/internal pages, linked levels, split propagation, version churn | https://www.postgresql.org/docs/18/btree.html#BTREE-IMPLEMENTATION |
| Leading equalities + first inequality bound traversal; later checks and implementation-dependent skip scans | https://www.postgresql.org/docs/18/indexes-multicolumn.html |
| Forward/backward ordering, mixed directions, null defaults and LIMIT | https://www.postgresql.org/docs/18/indexes-ordering.html |
| Bitmap intersections/unions, physical-order table fetches and lost index order | https://www.postgresql.org/docs/18/indexes-bitmap-scans.html |
| Query-relative coverage, payload, visibility-map qualification, width costs | https://www.postgresql.org/docs/18/indexes-index-only-scans.html |
| Predicate implication at planning time and unknown parameter limitations | https://www.postgresql.org/docs/18/indexes-partial.html |
| Expression storage and maintenance | https://www.postgresql.org/docs/18/indexes-expressional.html |
| Syntax, immutable index expressions/predicates, INCLUDE semantics | https://www.postgresql.org/docs/18/sql-createindex.html |
| HOT requires unchanged index-relevant columns and same-page space | https://www.postgresql.org/docs/18/storage-hot.html |
| Primary/unique support; referencing-side foreign-key index not automatic | https://www.postgresql.org/docs/18/ddl-constraints.html |
| Clustered table data, secondary locator is clustered key, key width | https://dev.mysql.com/doc/refman/8.4/en/innodb-index-types.html |

A guessed separate btree-implementation.html URL returned404; corrected to the implementation anchor within btree.html. No claim depends on the failed page. Query matching UTC date and direct bounds, exact row values/counts and actual access paths are also submitted to the owned native fixture verifier. No native entry counts will be inferred from emitted rows alone. No runtime timing, production concurrency acceptance, write amplification number, InnoDB observation or physical ctid from the drawings is claimed.
