# Practitioner review — Live schema changes and backfills

Reviewed v01 on 25 October 2026, independently against `batch-14/review-source.json`, the supplied plan, incoming and neighbouring ownership, commission and v01 shared-example snapshot. No article edits, additional reviewers, builds or fixture changes. No earlier review or `authoring-checks.md` read.

## Findings

No practitioner findings requiring repair.

The article supplies its promised compatibility protocol rather than relying on deployment completion: bridge writes are atomic, all old-only writers and admitted work drain, safe backfill writes preserve the source relation, reconciliation covers late rows and exceptions, and a snapshot showing agreement is combined with a continuing write invariant. The zero-row conditional-write explanation correctly requires examination rather than treating it as success. Reader return remains distinct from restoring old-only writers; contraction accounts for the old `NOT NULL` insert dependency and ends the return window when old data stops being maintained. Range, finite-value and unit assumptions are explicit. Native lock, index and schema-job procedures remain with their owners. The prerequisite depth is sufficient for the assigned application-engineer audience.

## Evidence checked

- Article, metadata and figure hashes match the frozen manifest: `08b838e…ea952`, `70d69c4…d26b`, `ee45035…bc265`. The retained verifier hash is `3b9734f…14a559`; `sql-results.json` hashes to its v01 receipt `1b5dbaf…6e9`. The original shared-example input hashes to `44656a9…3d31`.
- Inspected all four literal displayed SQL statements, the verifier's assertions and its ten recorded results. The PGlite 0.5.8/PostgreSQL 18.3 record supports exact conversion/range, stale and guarded committed orderings, current-row repair and empty replay, late bridge/old-only insertion, rolled-back coverage, NaN failure and preparation for new-only inserts. Results and source hash match the frozen article. Retained this matching evidence; no reproduction was necessary.
- Independently opened primary sources: PostgreSQL 18 [Transaction Isolation](https://www.postgresql.org/docs/18/transaction-iso.html), [UPDATE](https://www.postgresql.org/docs/18/sql-update.html), [Numeric Types](https://www.postgresql.org/docs/18/datatype-numeric.html), [Comparison Functions](https://www.postgresql.org/docs/18/functions-comparison.html), [ALTER TABLE](https://www.postgresql.org/docs/18/sql-altertable.html) and [CREATE INDEX](https://www.postgresql.org/docs/18/sql-createindex.html); CockroachDB [Online Schema Changes](https://docs.cockroachlabs.com/docs/stable/online-schema-changes); and Sato's [Parallel Change](https://martinfowler.com/bliki/ParallelChange.html). These support the consequential engine claims. The convergence proof is the article's explicit invariant argument, not a generic claim that dual writes converge.
- Read the rendered preview at port 4606 in its existing system/dark appearance. Advanced Figure 1 through contraction, tested all three Figure 2 terminal choices and both Figure 3 choices. Stored values, missing/disagreement counts, cursor coverage and return descriptions agree with the prose and SQL evidence. Calibrated against bounded reference passages in all three fixed readings and the rendered Storage “Row versions and undo logs” passage/Figure 3. No theme preference changed.

## Limits

This review reuses recorded sequential SQL evidence; it did not run native concurrent sessions or observe lock waits, DDL load, timings, capacity, CockroachDB execution or application rollout. The article labels those boundaries correctly. The native environment probe establishes availability only and supplies no additional execution claim here. Rendered checking was a bounded technical/model check at the current desktop viewport, not a complete visual or accessibility audit.
