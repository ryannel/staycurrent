# Native run notes, RL90–104

Final command: `node docs/article-work/relational-rewrite-2026-10-19/evidence/rl90-104-native.mjs`.
Final run completed with exit 0 on 19 October 2026, with all 13 per-page observation files written. Its temporary cluster root was `/private/tmp/rl90-104-w343gX`; cleanup removed that root. PostgreSQL 18.6, macOS aarch64, local Unix sockets. Required shared-memory access was granted through the authorised sandbox escalation. No shared server was used.

Corrections found during verification:

- The default sandbox cannot allocate PostgreSQL shared memory. The isolated run succeeded with the required permission.
- A privilege test using a superuser's original session and SET ROLE could accidentally regain broad authority after transaction cleanup. The final test uses a separately authenticated runtime LOGIN and confirms cross-tenant INSERT, ALTER, TRUNCATE and SET ROLE migrator all fail with 42501.
- Setup CREATE TABLE sent in the same Simple Query string as a later rolled-back block was also rolled back. Outbox DDL setup is now a separate call before the rollback experiment.
- pg_ctl can briefly report server readiness after base consistency, before archive recovery rejects an unreachable configured target. The final missing-chain test waits for and verifies `FATAL: recovery ended before configured recovery target was reached`; startup-command status alone is not its acceptance test. This development assertion failure is preserved in rl90-104-development-failure.json. The final proper-archive restore, paused target inspection, promotion and later valid r82 reconciliation all succeed.

All measurements in the prose use the final run's observation files. The hot-row percentiles are deliberately small functional observations (5 transactions per client, 1/4/12 clients), with an artificial 10 ms lock hold. They are not product sizing or throughput claims. Power loss, external providers, hostile network/authentication and cloud region faults were not tested.
