# Source checks for the breakdown

Checked 19 October 2026 against the PostgreSQL 18 manual. These are planning
checks, not claims of executed examples. Article writing must run the supplied
fixtures against PostgreSQL 18 and record observed output separately.

- [INSERT](https://www.postgresql.org/docs/18/sql-insert.html): sources, defaults,
  supported conflict arbiters, EXCLUDED, update predicates and repeated proposed keys.
- [UPDATE](https://www.postgresql.org/docs/18/sql-update.html): old-value assignments,
  counts, RETURNING and ambiguous multi-match joins.
- [DELETE](https://www.postgresql.org/docs/18/sql-delete.html): USING, target counts
  and returned rows.
- [MERGE](https://www.postgresql.org/docs/18/sql-merge.html): classification, ordered
  WHEN choices, repeated modifications, RETURNING and merge_action().
- [Returning data](https://www.postgresql.org/docs/18/dml-returning.html): PostgreSQL
  18 OLD/NEW output and trigger-adjusted target values.
- [Trigger behaviour](https://www.postgresql.org/docs/18/trigger-definition.html):
  row/statement timing, zero-row statements, skipping and additional operations.
- [SET CONSTRAINTS](https://www.postgresql.org/docs/18/sql-set-constraints.html):
  immediate/deferred checks and properties that cannot be deferred.
- [WITH](https://www.postgresql.org/docs/18/queries-with.html): modifying CTE
  completion, shared snapshot, RETURNING data flow and repeated-write limitations.
- [TRUNCATE](https://www.postgresql.org/docs/18/sql-truncate.html): relation scope,
  foreign keys, identity behaviour, triggers, rollback and snapshot caveat.
