# B35 practitioner review — a30

Verdict: **PASS** (full initial practitioner review).

Required findings: none. Optional advice: none.

## Coverage, depth and boundaries

Read the complete frozen article, context, source ledger, writer handoff, pure model, figure component, native worksheet and retained results. Compared with the actual a06 parent and a29 sibling, plus the supplied a31 scope. The article supplies the complete useful data-job procedure promised by its commission: input meaning and unresolved dispositions; a finite durable work scope; late-commit coverage; conditional writes; atomic dispositions/progress; interruption and unknown-outcome recovery; side effects; workload stop decisions; import/correction/deletion adaptations; and identity/version/semantic reconciliation.

This is appropriate depth for expert relational practice. It explains why a filled field, processed counter, maximum identifier, empty queue or matching version is insufficient, and gives an operator the corresponding decision. It keeps compatibility and read-switch/retirement ownership with a06, physical deployment with a29, database authority transfer with a31, and external handoff and operational diagnosis with their existing owners. It does not expand into a general scheduler or address-validation syllabus.

The prerequisites matter and remain explicit: all old writers and their transactions drain before trusted enumeration; every relevant writer advances the address version; the parser consumes that captured version; future bridge writes preserve matching parts or explicit unresolved state. The deliberately late *pending* row is clearly a broken-prerequisite counterexample. An unresolved required address blocks the parts-only read switch even when its work item is accounted for.

## Independent native verification

Inspected the exact SQL, assertions and TCP proxy before executing the complete unchanged worksheet copy with PostgreSQL 18.6 and pg 8.23.1. Own database: `rel3_a30_1792456067325`; Read Committed, synchronous commit on. Raw independent output is retained in [practitioner-a30-native.jsonl](practitioner-a30-native.jsonl). All 37 ordered records were audited against the retained author run: every deterministic value agrees, excluding the expected runtime/database identity differences. This review did not rely on the final PASS flag.

Specifically verified:

- ID 2 becomes visible before previously allocated ID 1; all six identities are then durably enumerated after the counterexample transactions finish.
- The stale guarded update actually waits on the application's row lock and returns zero rows after its newer revision commits.
- Terminating the uncommitted worker leaves target/progress unchanged. The subsequent real 23505 error rolls back earlier provisional row work and leaves all six dispositions pending.
- The proxy sees the backend COMMIT completion and drops it before the driver receives it. Despite connection termination, a fresh observer finds target `current`, disposition `accepted` and batch count 3 committed together.
- Final dispositions are accepted 2, deleted 1, invalid 1, review 1 and superseded 1. A new bridge-maintained insert needs no pending catch-up item. Pending-only replay updates no target rows and invokes no installed row-level audit effect. The batch counter is only a summary; the disposition ledger defines accounted-for work.
- Structural checks miss the injected wrong town while value comparison finds ID 2. Equal counts conceal missing ID 2 and unexpected ID 999; both set differences expose them. Staged duplicate ID 1 is found, the orphan relationship fails with 23503, and a later hold/revision prevents the guarded deletion.

The worksheet SHA-256 is `123d683645c8109f07240cf84f2670085f6cdba238197c6a035c1da3f9459e15`. It used its fresh database and local temporary proxy only. Finally independently queried the server: zero matching databases and zero matching sessions remain. The process exited; its proxy closed. No shared configuration, restart or statistics reset occurred.

## Primary guarantees and rendered models

Checked PostgreSQL 18 [isolation](https://www.postgresql.org/docs/18/transaction-iso.html), [UPDATE](https://www.postgresql.org/docs/18/sql-update.html), [sequences](https://www.postgresql.org/docs/18/functions-sequence.html), [triggers](https://www.postgresql.org/docs/18/trigger-definition.html), [generated columns](https://www.postgresql.org/docs/18/ddl-generated-columns.html), [COPY](https://www.postgresql.org/docs/18/sql-copy.html), [EXPLAIN](https://www.postgresql.org/docs/18/sql-explain.html) and [timeouts](https://www.postgresql.org/docs/18/runtime-config-client.html). The article correctly bounds the single-row Read Committed guard, Repeatable Read validation boundary, returned target-row effects versus statement triggers, and executed-work cost. Its source ledger correctly distinguishes the composed job protocol from an engine guarantee.

Walked all six working figures, both choices and all 52 configured states on immutable 4438. Compared every visible lane, title and consequence with the model and native/prose boundaries. The neutral coverage endpoint says “Current source identities: 101, 102” in both branches; the omitted-identity branch still reports false completion. Provisional/committed/rolled-back states, unsafe stale writes, blocked semantic reconciliation and invented workload decisions remain distinct. Dynamic rows render correctly. Figures are labelled illustrations; neither their workload numbers nor the small grammar are presented as production evidence.

Article snapshot matches the rendered source; both component hashes match B35. No assigned source, article, evidence, build or Git changes made. Browser downloads were not activated.
