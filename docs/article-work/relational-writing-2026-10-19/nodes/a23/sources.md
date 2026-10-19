# a23 source and execution record

Checked 20 October 2026. Article: **Connecting transactions to background work and events**.

## Primary sources

- PostgreSQL 18, [SELECT locking clause](https://www.postgresql.org/docs/18/sql-select.html#SQL-FOR-UPDATE-SHARE), especially queue-like SKIP LOCKED use, inconsistent visibility and table-lock caveat; [explicit locking](https://www.postgresql.org/docs/18/explicit-locking.html) for row lock lifetime. Selected claim behaviour was also executed natively.
- PostgreSQL 18, [Logical decoding concepts](https://www.postgresql.org/docs/18/logicaldecoding-explanation.html), sections 47.2.2 and 47.2.5: slot persistence, duplicate changes following crash, retained source resources, exported snapshot joining initial state to stream. Capture behaviour is documentation-based, not executed.
- PostgreSQL 18, [Logical decoding output plugins](https://www.postgresql.org/docs/18/logicaldecoding-output-plugin.html), section 47.6.4: ordinary committed-transaction callbacks, aborted transactions, flush, and optional streaming callbacks for in-progress transaction fragments. Article deliberately does not imply every streamed capture fragment is already committed.
- PostgreSQL 18, [Logical replication restrictions](https://www.postgresql.org/docs/18/logical-replication-restrictions.html): built-in replication does not replicate DDL. This is a PostgreSQL built-in replication limitation, not a claim about all capture products.
- AWS Prescriptive Guidance, [Transactional outbox pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html): dual-write gap, atomic intent and duplicate consumption obligation. No AWS service or broker was executed.

The named event/job meanings, three-attempt cap, thirty-second lease, conditional completion requirement and reconciliation rules are an illustrative application design. They are not database defaults or a provider promise. Receiver identity scope, durable deduplication, concurrent arbitration, matching input, result meaning and expiry are requirements to verify against the selected receiver. The article reuses a22's atomic relational idempotency protocol rather than deriving it again.

## Native evidence

- Runner and downloadable worksheet: `src/components/relational-next/a23/rehearse.mjs`.
- Retained output: `evidence/native-results.json`.
- Runtime: Node v24.16.0, pg 8.23.1, PostgreSQL 18.6 (Homebrew), loopback port 57319. Driver imported from the root-supplied disposable dependency directory. Standard worksheet use installs `pg@8.23.1` with lifecycle scripts disabled and supplies `PG_ADMIN_URL`; an optional module override avoids altering repository dependencies.
- Own database: `rel3_a23_run1`, created and dropped successfully. Two main worker connections, one admin and at most one child worker connection; well below the 12-connection ceiling. Final native observation: zero sessions for that database before drop.
- Session configuration: 30-second statement timeout, 5-second lock timeout, 2-second connect timeout and application name `rel3_a23`. HTTP fetches bounded to 2 seconds; child workers bounded to 5 seconds. No shared server restart, setting change, role change, extension or replication slot.
- Receiver: local HTTP server bound to IPv4 loopback on an ephemeral port. It counts **synthetic acceptances**, retains one request/result in memory for the run and deliberately destroys one response socket after acceptance. It neither ships parcels nor implements durable provider storage.
- Worker fault: actual child-process exits after a bare order insert/implicit commit, after a committed claim and after successful receiver response before local completion. Controlled graceful process exit models the missing subsequent work; no PostgreSQL server process was killed.
- Lease expiry: advanced explicitly by changing only the fixture's lease timestamp; no thirty-second wall-clock expiry or scheduler was measured.

Observed assertions:

| Case | Evidence |
| --- | --- |
| Roll back or commit order plus intent | Rollback: zero orders and work rows; commit: one of each. |
| Process exits after order commit alone | One order, no work record and no synthetic acceptance. |
| Receiver accepts inside transaction; transaction rolls back | No order or work; one external synthetic acceptance remains. |
| Concurrent claims | B gets no row while A holds its claim row lock; B still gets no row while the committed lease is valid. |
| Slow old worker after takeover | Attempt increments 1→2; A can still reach receiver; its completion returns zero rows; B completes with one returned row. Two receiver requests, one acceptance under deduplication. |
| Worker exits after claim | Claimed work remains; expiry admits attempt 2; receiver still has no acceptance. |
| Worker exits after receiver acceptance | Database still claimed; attempt 2 returns the same R1. Two requests, one acceptance. |
| Receiver reply socket destroyed | First request rejects at worker; matching repeat recovers result with no second acceptance; changed input returns 409. |
| No receiver duplicate contract | Same operation identity sent twice produces two acceptances. |
| Delayed payload | Work retains original delivery choice after order row changes. |
| Automatic cap | Three abandoned claims; fourth claim returns no row; bounded sweep moves record to unresolved. |

Not executed: production application handler, full order/items/stock transaction, hostile tenant path, broker hand-off, capture connector, replication snapshot/stream restart, source-log expiry, durable receiver restart, retention scheduler, projection rebuild, a real fulfilment provider or every HTTP timeout interleaving. The figures are explanatory schedules; none claim to be measured execution traces. Historical facts cannot be reconstructed from deleted history; that is an information boundary rather than a measured capture result.

## Owned checks

`evidence/owned-checks.json` records clean Astro compiler diagnostics for the staged fragment and component, all seven required anchors, and valid registry destinations/anchors for contextual links. The scene model and extracted client script passed TypeScript checking; worksheet passed Node syntax check. Whitespace check passed for owned paths. No full build or shared output was changed. Root owns rendered review, independent reviews and publication.
