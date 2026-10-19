# Reasoning about transactions: review and repair record

## Scope and draft

Planned only the article assigned in `context.yaml`, from the fresh commission.
The initial plan contains seven top-level headings and one child stub for complete
multi-row invariant protocols. The child contains only topic, title and brief.
No existing relational article, coverage map or previous tree was used.

The parent is intended to stand alone through one complete serialisable multi-row
repair; the child is justified by comparing and proving explicit protocols over
changing row sets. Review should challenge that boundary and fold it into the
parent if its extra navigation does not earn its cost.

## Primary-source checks made during planning

These sources establish which consequential differences the writer must verify
and demonstrate. Native database examples have not been executed during this
planning task; proposed examples and histories remain teaching plans.

- [PostgreSQL 18 transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html): statement versus transaction snapshots, predicate rechecks, serialization anomalies, dependency tracking and whole-transaction restarts.
- [PostgreSQL 18 explicit locking](https://www.postgresql.org/docs/18/explicit-locking.html): blocking, lock conflicts and deadlocks.
- [MySQL 8.4 InnoDB isolation](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html): consistent versus locking reads and range protection under different levels.
- [MySQL 8.4 InnoDB error handling](https://dev.mysql.com/doc/refman/8.4/en/innodb-error-handling.html): engine-specific statement and transaction rollback scope.
- [SQLite isolation](https://www.sqlite.org/isolation.html): journal modes, one writer, snapshot promotion failure and write transaction start modes.

The YAML names comparison obligations rather than asserting a portable mapping
from isolation labels to implementation behaviour. The future writer must record
versions, settings and actual outcomes for native examples.

## Structural validation

The initial YAML parsed successfully with Python's YAML parser. It uses the
singular `heading` list and `nested_article` stub form.

## Independent review and repairs

The orchestrator initially queued this worker behind a02, then granted two slots
on resumption. The practitioner and adversarial editor reviewed independently in
parallel. Each directly rechecked the repairs to their own findings. Reviews are
saved beside this record.

### Practitioner repairs

- Specified the multi-row rule: two depots have one available unit each, the total
  unreserved stock must remain at least one, and concurrent decisions to reserve
  from different depots can violate it. The parent compares both serial orders.
- Reused that fixture in the complete serialisable repair and child extension.
- Added an explicit snapshot write-skew test and a serialisable repaired run,
  accepting either abort victim and repeating reads and the business decision on
  whole-transaction restart. Universal writer participation is an assumption.
- Direct recheck passed with no unresolved practitioner findings.

### Adversarial editor repairs

- Kept the complete fixed-set serialisable repair in the parent. The child now
  states that baseline as a prerequisite, adds guard/counter alternatives and
  changing-set proofs, and avoids replaying the successful baseline.
- Named PostgreSQL 18 as the running engine and SQL dialect. Other engines appear
  in a compact decision table and only the histories that change protection or
  restart choices; full alternative transcripts belong in supporting evidence.
- Changed the final section to convert the already taught histories into tests.
  It demonstrates barriers/assertions once and links extra deadlock/retry cases
  rather than commissioning a second explanatory tutorial.
- Direct editorial recheck passed: all three findings resolved, no unresolved items.

### Final checks

The repaired YAML parses successfully. Root and heading keys match the requested
schema. The one child remains a topic/title/brief-only stub. No articles, public
routes, canonical tree or publication metadata were edited. This is a reviewed
planning artefact, not a record of database execution or publication approval.
