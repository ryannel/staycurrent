# a03 source and execution record

Checked 19 October 2026. Article: **Making concurrent changes correct**.

## Primary sources

All engine references use the PostgreSQL 18 manual, matching the observed major version. The article avoids inferring another engine's behaviour from the isolation names.

| Claim or decision | Primary source checked | Scope in article |
| --- | --- | --- |
| Explicit/implicit transactions, atomic visibility, rollback and savepoints | [Transactions](https://www.postgresql.org/docs/18/tutorial-transactions.html) | Introduces the complete reservation boundary; distinguishes it from concurrent decision protection. |
| Primary/unique keys, required values, foreign keys and row checks; CHECK cannot enforce a changing cross-row aggregate | [Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html) | Keeps schema design in a01; identifies the remaining protocol obligation. |
| Guarded UPDATE result feeds INSERT; RETURNING communicates changed rows | [Data-modifying WITH](https://www.postgresql.org/docs/18/queries-with.html#QUERIES-WITH-MODIFYING), [RETURNING](https://www.postgresql.org/docs/18/dml-returning.html) | Exact displayed successful and zero-row statement executed natively. |
| Statement snapshots, Repeatable Read visibility, concurrent update waiting and condition recheck | [Transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html) | Paired with native counter/visibility runs. PostgreSQL-specific behaviour is named. |
| Versions permit an ordinary reader and writer to make progress while write arbitration still matters | [MVCC introduction](https://www.postgresql.org/docs/18/mvcc-intro.html) | Reader/version and writer/lock questions are separated using Figure 1. |
| Row-lock compatibility/lifetime, deadlock detection and victim abort | [Explicit locking](https://www.postgresql.org/docs/18/explicit-locking.html) | Introduces stable coordination and consistent acquisition order; detailed protocol belongs to a18. |
| Serializable dependency detection, nonblocking predicate locks, possible abort at commit | [Transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html#XACT-SERIALIZABLE) | Native staffing observations support the selected illustrative schedule; no fixed victim or failure point is promised. |
| Repeat the full transaction and decision logic after serialisation failure | [Serialisation failure handling](https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html) | B's repeated staffing read changes its decision. Client retry policy remains with a04. |
| A bad connection can report unknown transaction status; command completion is separate from client receiving the reply | [Connection status](https://www.postgresql.org/docs/18/libpq-status.html), [Protocol flow](https://www.postgresql.org/docs/18/protocol-flow.html) | One-use native loopback proxy withholds a completed COMMIT reply; article distinguishes knowledge from state. |
| Log flush before durable acknowledgement, asynchronous commit, fsync and replica acknowledgement settings | [WAL introduction](https://www.postgresql.org/docs/18/wal-intro.html), [Asynchronous commit](https://www.postgresql.org/docs/18/wal-async-commit.html), [WAL settings](https://www.postgresql.org/docs/18/runtime-config-wal.html) | Documented contracts only. No crash, power, failover or storage claim is presented as locally observed. |
| Local transaction records intent but cannot atomically include an independent provider call; outbox delivery can repeat | Chris Richardson's original [Transactional outbox pattern](https://microservices.io/patterns/data/transactional-outbox.html) | High-level boundary only. Detailed delivery/reconciliation is owned by a04. |

## Native execution

- Engine: PostgreSQL 18.6 (Homebrew), server 180006, aarch64-apple-darwin25.6.0, Apple clang 21.0.0, 64-bit.
- Original suite database: `rel3_a03_run1`; narrow a03-P1 uniqueness repair database: `rel3_a03_p1_run1`. Both use role `staycurrent`, loopback `127.0.0.1:57319` on the orchestrator-owned disposable cluster. No other article's database, role or server configuration was changed.
- `fsync`, `synchronous_commit`, `full_page_writes`: `on`; default isolation: `read committed`; lock timeout 5s; statement timeout 30s. Each concurrent case sets its transaction isolation explicitly. No session override was needed.
- [Setup/reset SQL](/Users/ryannel/Workspace/staycurrent/src/components/relational-next/a03/setup.sql).
- [Executable session coordinator](/Users/ryannel/Workspace/staycurrent/src/components/relational-next/a03/verify.py).
- [Composite observed transcript](/Users/ryannel/Workspace/staycurrent/src/components/relational-next/a03/observed.txt): unchanged cases retain the original suite observations; its uniqueness section is replaced with the repaired native rerun, with provenance stated at the top. It is not represented as a new full-suite invocation.
- [Raw narrow a03-P1 uniqueness rerun](/Users/ryannel/Workspace/staycurrent/src/components/relational-next/a03/uniqueness-repair-observed.txt).

Run only in a fresh disposable database, using the runtime's pinned client:

```sh
/opt/homebrew/Cellar/postgresql@18/18.6_1/bin/createdb -h 127.0.0.1 -p 57319 -U staycurrent rel3_a03_run1
python3 src/components/relational-next/a03/verify.py postgresql://staycurrent@127.0.0.1:57319/rel3_a03_run1
```

For only the repaired uniqueness scenario, create a separate fresh exercise database and pass `--only-uniqueness`; the retained rerun used `rel3_a03_p1_run1`. This path runs the same `uniqueness_case` function called by the full suite, then closes its sessions without running unrelated cases.

```sh
python3 src/components/relational-next/a03/verify.py postgresql://staycurrent@127.0.0.1:57319/rel3_a03_p1_run1 --only-uniqueness
```

The coordinator sends incremental commands to independent psql processes and waits for explicit completion markers. For blocked operations it queries `pg_stat_activity` for the target session's `wait_event_type = Lock` before releasing the holder. Short polling intervals only observe that checkpoint; no interleaving is inferred from a guessed sleep.

| Case | Observed result and assertion |
| --- | --- |
| Atomicity and ordinary visibility | Observer read remaining=1 while A's decrement was uncommitted; after reservation commit, remaining=0 and reserved=1. |
| Failed insert rollback | Duplicate request raised 23505 after a decrement of class 22; ROLLBACK restored that class's remaining=1. |
| Exact displayed data-changing WITH | First request returned R1 and INSERT 0 1; next returned no request and INSERT 0 0; invariant true. |
| Stale overwrite | Both Read Committed transactions read one; both wrote constant zero and inserted different owners. Both committed; final 0 remaining and 2 reservations for capacity 1. Deliberate counterexample. |
| Conditional contention | B's guarded UPDATE was observed waiting on A. A committed its reservation. B returned UPDATE 0 and inserted nothing. Invariant true. |
| Stable coordination row | B's FOR UPDATE was observed waiting on A's class row. After A inserted and committed, B acquired it. B's separate following count read one reservation. Supports the exact Read Committed visibility claim, not a complete all-writers protocol. |
| Initially absent request identity — repaired a03-P1 | Both begin Read Committed and read count 0 for `same`. A conditionally decrements class 21; B conditionally decrements class 22; each returns remaining=0 and UPDATE 1. A inserts the shared identity for owner 7. B's insert for owner 8 is observed waiting; after A commits B raises 23505 and rolls back its whole transaction. Exactly one request identity remains. The exact full invariant query returns `21|1|0|1|t` and `22|1|1|0|t`: A consumed one place and owns one reservation; B's decrement was undone and its class remains empty. |
| Staffing Repeatable Read | Both read count 2; wrote different people; both committed; final available count 0. Deliberate counterexample. |
| Staffing Serializable | Both read 2 and both UPDATEs succeeded; A committed; B's COMMIT raised 40001. Final count 1. B's new attempt read 1 and rolled back without letting the last person leave. |
| Repeated ordinary reads | B committed remaining=0 between A's reads. A's second read returned 0 at Read Committed, 1 at Repeatable Read. |
| Deadlock | Opposite row order produced 40P01 for B in the retained run. Subsequent statement in failed attempt raised 25P02. Both attempts rolled back; sum(remaining)=2. Coordinator accepts either victim. |
| Completed commit, reply withheld | A one-use plaintext loopback proxy forwarded COMMIT, recognised server CommandComplete(COMMIT), then closed both sockets without forwarding that result. psql reported connection loss and no successful COMMIT. A new observer found `lost-reply`; exact final invariant query returned `21|1|0|1|t` and `22|1|1|0|t`. |

The script asserts the observed results and closes all its sessions in `finally`. The original suite completed successfully. After a03-P1, only the changed uniqueness scenario was rerun; its final output is `Uniqueness full-protocol assertions passed. Only this repaired case was rerun.` The composite transcript explicitly distinguishes the two invocations. The frozen b02 review retains the initial evidence and finding; the current retained uniqueness observation follows the complete counter/ownership protocol. A first collector iteration assumed the first finished deadlock command must be the victim; corrected it to collect both completions and inspect SQLSTATE, then reran. This was an evidence-collector correction, not an engine failure.

No inference about physical flush honesty, power loss, recovery duration, asynchronous loss windows, replication, MySQL, or a hosted provider is drawn from these runs. Selected schedules expose counterexamples or agree with the manual; they do not prove a protocol covers every writer or execution.

## Figure boundaries

1. **ReservationRace:** an authored seven-step model for each of stale overwrite and guarded decrement. It exposes committed counter/reservations plus each transaction's pending action. Paused inspection and mode changes preserve the selected step for comparison. Playback uses 165 words/minute plus 1.5s, minimum 4.5s per narration, and can be paused or stepped. It does not run PostgreSQL.
2. **StaffingFigure:** authored steps display the read dependencies and committed availability separately. Switching PostgreSQL Repeatable Read/Serializable changes the last two steps to the selected observed cases, including reconsideration after abort. Another real run may choose a different victim or error point.
3. **CommitBoundary:** authored failure-point comparison separates database state, durable log state, application knowledge and independent provider state. Only the deliberately withheld completed reply was exercised; outbox/provider panels and durable-crash contract are illustrative.

## Teaching reference and family use

Read all three fixed reference article sources in full, including their figure scenario/caption descriptions; inspected representative rendered sequence, index and WAL figures at the supplied previews. Adopted the repeated concrete example, cause/change/result sequence, inspection prompts around figures, and explicit distinction between model and observation. No original prose or figures were copied.

Family inputs used: full own plan; a00 parent; a01/a02/a04 neighbouring scopes; full a18/a19 child plans; available a00/a01/a02 fragments. a03 supplies the complete first counter case and high-level alternatives; it does not reproduce a18's lock catalogue/protocol worksheet, a19's cross-engine isolation experiment, a04's client/retry/idempotency machinery, or operational recovery procedures.
