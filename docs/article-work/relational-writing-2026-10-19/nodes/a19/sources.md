# Isolation source and execution record

Checked 20 October 2026. Primary sources:

- https://www.postgresql.org/docs/18/transaction-iso.html — Read Committed statement snapshots and concurrent update recheck; Repeatable Read's first-query snapshot and changed-row abort; Serializable dependency detection, nonblocking SIRead locks, possible abort points/victims. The article's concrete numeric results come from its own native run, rather than being inferred from a level name.
- https://www.postgresql.org/docs/18/sql-set-transaction.html — explicit isolation/read-write settings, when transaction properties may change.
- https://www.postgresql.org/docs/18/applevel-consistency.html — serialisable transactions and invariant arguments; relevant writers must participate; individual transactions must be correct alone.
- https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html — retry complete transaction logic, not only the failed command; SQLSTATE 40001.
- https://www.postgresql.org/docs/18/explicit-locking.html — locking reads, waits and failure boundaries; detailed protocol is left to a18.
- https://www.postgresql.org/docs/18/monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW — wait_event_type Lock used as the actual interleaving checkpoint.
- https://dev.mysql.com/doc/refman/8.4/en/innodb-consistent-read.html — ordinary consistent reads at RC/RR, own writes, snapshot-start behaviour. Article describes the documented contract only, with no MySQL execution claim.
- https://dev.mysql.com/doc/refman/8.4/en/innodb-locking-reads.html — current data and locking read behaviour; informs the mixed ordinary/locking-read comparison.
- https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html — mixed read-view warning, normal InnoDB RR default, Serializable plain SELECT conversion when autocommit is disabled. The combined MySQL-specific prose is deliberately compact and qualified.
- https://docs.cloud.google.com/spanner/docs/true-time-external-consistency — primary implementer explanation of serial equivalence versus the extra external ordering requirement. Used only to explain the definition, not recommend or test Spanner. Figure 5 is hypothetical and expressly makes no PostgreSQL/InnoDB counterexample claim.

## Native run

`src/components/relational-next/a19/rehearse.py` is the complete standard-library Python / psql worksheet. It creates an unused database, opens A, B and an observer, executes bounded commands in order, polls pg_stat_activity to establish actual waits, checks explicit expected outcomes, and removes its database. No server reconfiguration/restart and no external services.

Executed twice after writing, the second time to retain the read-write default explicitly. Final retained `native-results.json` records PostgreSQL 18.6 Homebrew / server major 18, read committed / read-write defaults, fsync, synchronous_commit and full_page_writes on, overridden session timeouts 12s statement / 5s lock / 45s idle transaction. 36 assertions and 133 complete command/output records. Both runs closed all three sessions and removed their own `rel3_a19_run1` database. Shared 57319 server left unchanged.

| Expected check | Observed final run |
| --- | --- |
| RC second ordinary read sees competing commit | 1 then 0 |
| RR second ordinary read retains first data-query snapshot | 1 then 1 |
| RR BEGIN before commit, first data query after | 0 |
| Own later change remains visible | 1 |
| RC locking read waits then consults changed row | Lock wait; returns 0 |
| RR locking read waits then rejects changed-since-snapshot row | Lock wait; 40001 |
| RC guarded update waits then rejects depleted capacity | Lock wait; no returned rows; final remaining 0 / one reservation |
| RR guarded update waits then aborts | Lock wait; 40001; final remaining 0 / one reservation |
| Two correct RR staffing transactions can write-skew | Both commit; available 0 |
| Serializable rejects incompatible staffing combination | A commits; B COMMIT 40001; available 1; complete retry reads 1 and declines |
| Empty reservation predicate, distinct inserted identities | RR commits 2; Serializable A commits / B COMMIT 40001, count 1 |
| Incorrect decision query still fails under serial equivalence | Sequential Serializable own-person-only decisions both commit; available 0 |

One observed victim/error point is not asserted universal. No MySQL, replica, failover, power-loss or external-effect run. The reservation-predicate schedule deliberately uses counted ownership without the parent's remaining counter; it is a different explicitly labelled representation, not evidence that a correct counter update fails.

## Models and draft checks

`model.mjs` has five scenes and thirteen comparison settings, totalling 56 reachable frames. `check-model.mjs` checks every frame's structure, key observable endpoints and presence/pass status of matching independent native cases. It does not label the model as native execution. `model-results.json` is the result.

Astro compiler transform passed both article and component without diagnostics (`compile.json`). Full route rendering, full build and independent practitioner/teaching review remain the orchestrator's next steps; no rendered-control pass is claimed here.
