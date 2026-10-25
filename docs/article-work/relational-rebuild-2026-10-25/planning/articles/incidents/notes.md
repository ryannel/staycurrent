# Planning record

Fresh detailed outline for `incidents`, using the accepted tree and current
breakdown, writing-reference procedure and continuity skill. No scope or ownership
change is proposed. The two contextual stubs are the already accepted capacity and
schema-change children, with no child headings commissioned here.

## Reference exposure

Read all 19 bounded exports separately with `scripts/read-writing-reference.py`:
Sequences 1–6, Indexes 1–7 and Storage 1–6. Every END marker was received. No old
article, outline, review, feedback or other worker's notes were read.

Studied the finished reference previews on port 4584 in owned temporary IAB tabs,
at their existing viewport and System theme settings. In Sequences, inspected
“Who is waiting” with the 3 s alternative: caller and nested wait, explicit clock,
unchanged sequence height and narrative immediately beside the control. In
Indexes, inspected “Page visits as the range widens”, including Scattered and By
customer: same rows and changed placement expose the cause behind the counts.
In Storage, followed WAL's memory/disk distinction and “Who writes a dirty page”
through fell-behind and kept-up states. The useful teaching comparison is work
moving onto a request's path. These precedents shape explanatory order and what
needs making visible, without prescribing the writer's prose or visual design.

After the fixed references, read the supplied finished query-execution, locks and
application-sql previews on port 4606. Relevant established understanding:

- Application SQL already explains checkout/return, one transaction's connection
  ownership, slow result consumption, cancellation cleanup and commit uncertainty.
- Locks already teaches lock lifetime, idle holders, chains versus cycles,
  ordinary-read versus locking-read behaviour and complete protocol repair.
- Query execution already teaches plan work, frequency/repetition, temporary
  spills, parameter-dependent repairs and the limitations of isolated timings.

This article connects those facts into an incident diagnosis. It does not repeat
their complete procedures. The parent remains useful without its children.

## Shared example decisions

The coordinator explicitly approved independent illustrative branches using
Mina's customer-1 history read after order 103. The read returns 103 pending and
101 paid in descending time/ID order. It changes no rows; order 103 remains
pending, without payment, with agreed line value 29.00, and stock stays 10/0/4.

- Pool-only branch: this request has not yet borrowed a connection; no server
  statement for it is implied.
- Lock branch: a separate PostgreSQL lock-only session holds ACCESS EXCLUSIVE on
  `orders`. Ordinary history SELECTs conflict with that table lock, can occupy
  borrowed clients, and can leave later callers waiting for the pool. This is not
  an ordinary row update blocking a snapshot read. No migration is asserted to
  have changed a schema or business row. Root will record the extension centrally.
- Execution branch may reuse the agreed paid-order report/generated fixture as
  concurrent optional reporting work. Its published benchmark timings are not
  incident measurements, and the small history result is not the report's result.
- Storage counters and free-space trajectory, if useful, are explicitly synthetic
  teaching models. No actual spill, storage fault, elapsed duration, production
  bottleneck or measured improvement has been established by this assignment.

No new row identifiers, fields, customers or committed changes are needed. Exact
invented durations and pool sizes are left to the writer; they must be labelled
illustrative and kept arithmetically coherent. Avoid one universal cause selector:
the lock branch deliberately shows that several delays can form one causal chain.

## Primary sources checked

Checked 25 October 2026. These support mechanism and judgement, not an observed
incident. Writer should retain only the sources needed by the delivered account.

- [Google SRE, Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/):
  expected versus actual behaviour, impact-led triage, evidence preservation,
  hypotheses and controlled tests. Containment need not wait for full root cause.
- [node-postgres Pool API](https://node-postgres.com/apis/pool): queued borrowers
  wait when clients are checked out; missing release can exhaust the pool. Pool
  occupancy and queued acquisition are different observations.
- [PostgreSQL 18 monitoring statistics](https://www.postgresql.org/docs/18/monitoring-stats.html):
  activity state and wait state are independent; cumulative and current evidence
  differ, statistics can lag or be cached, and client waits differ from I/O waits.
  Compare compatible time windows and know the counter reset/snapshot state.
- [PostgreSQL 18 explicit locking](https://www.postgresql.org/docs/18/explicit-locking.html):
  ACCESS EXCLUSIVE conflicts with an ordinary SELECT's ACCESS SHARE; ordinary row
  locks do not block ordinary reads. Table-lock lifetime explains the approved
  lock-only branch. Detailed lock protocols remain with the locks article.
- [PostgreSQL 18 administrative functions](https://www.postgresql.org/docs/18/functions-admin.html):
  cancelling the current query differs from terminating its session, and successful
  signal sending need not prove completion. Native syntax stays with operations.
- [PostgreSQL 18 client defaults](https://www.postgresql.org/docs/18/runtime-config-client.html):
  statement timeout starts at server receipt; lock timeout bounds individual
  acquisition attempts. Neither covers earlier application pool acquisition.
- [PostgreSQL 18 Using EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html):
  ANALYZE executes the statement. Do not add a diagnostic execution to an already
  distressed system without accounting for its effects and load. Full plan repair
  is the query-execution article's outcome.
- [PostgreSQL 18 disk usage](https://www.postgresql.org/docs/18/diskusage.html):
  full data storage can stop useful work; full WAL storage can cause shutdown.
  Free space and I/O delay therefore require different evidence and responses.
- [PostgreSQL 18 WAL configuration](https://www.postgresql.org/docs/18/wal-configuration.html):
  checkpoints trade write work against crash replay work; restarting can introduce
  recovery rather than remove its cost. Settings and log interpretation remain
  with storage/WAL owners.
- [MySQL 8.4 InnoDB recovery](https://dev.mysql.com/doc/refman/8.4/en/innodb-recovery.html):
  incomplete transactions require rollback, which can continue after new
  connections are accepted and cause lock conflicts. Rollback duration is
  engine-dependent; do not claim that PostgreSQL must undo every row in that way.
- [Google SRE, Handling Overload](https://sre.google/sre-book/handling-overload/):
  traffic criticality can guide temporary shedding and retries can amplify load.
  This article may explain a bounded pause; durable policies and budget arithmetic
  remain with capacity, while safe retry semantics remain with retry-outcomes.

## Boundaries and continuity pass

Plan reread from the stated prerequisites. The request comes before sessions and
counters; pool occupancy precedes its possible database causes; the lock branch
establishes a chain before intervention; expensive execution and storage evidence
are distinguished before action. No native command cookbook, plan-repair lesson,
capacity formula, schema rollout protocol or cluster-health procedure is added.

Intervention is a prediction plus bounded action and verification, not a universal
instruction to terminate the oldest session, add connections, run maintenance or
restart. Native operations own access, exact evidence, target selection and
commands. Cancellation must settle work and connection state; missing commit
replies retain their established uncertainty. Useful recovery includes completed
requests and backlog drainage, not utilisation alone.

No unresolved ownership boundary. The approved table-lock extension is the only
central example addition. No writing, implementation, delegation, review, builds,
servers, commits or publication were performed.
