# Operations evidence and verification

Checked 15 October 2026 against PostgreSQL 18 documentation. Sandbox execution uses
PGlite 0.5.8, reporting PostgreSQL 18.3. Primary sources were opened during this run.

## Claims and sources

- [Modifying tables](https://www.postgresql.org/docs/18/ddl-alter.html) and
  [ALTER TABLE](https://www.postgresql.org/docs/18/sql-altertable.html): nullable
  additions, subcommand-dependent locks and rewrites, NOT VALID checks, validation
  locking, and a validated check avoiding the SET NOT NULL scan. The migration
  trigger and batch sequence are our own reproducible design, not a claim that
  PostgreSQL automatically coordinates application versions.
- [Connection defaults](https://www.postgresql.org/docs/18/runtime-config-client.html):
  lock_timeout and statement_timeout. The article's two-/ten-second values are
  illustrative operating bounds, not recommended universal settings.
- [SQL dumps](https://www.postgresql.org/docs/18/backup-dump.html) and
  [pg_restore](https://www.postgresql.org/docs/18/app-pgrestore.html): consistent
  logical snapshots, restore options, database versus cluster-wide objects,
  errors and ownership/ACL decisions. The drill deliberately omits source ACLs
  and ownership and says these must be separately recovered and verified for a
  real application.
- [Continuous archiving](https://www.postgresql.org/docs/18/continuous-archiving.html):
  physical base backup plus complete WAL sequence, PITR, logical-dump incompatibility
  with WAL replay, archive continuity, and configuration outside archived WAL.
- [pg_verifybackup](https://www.postgresql.org/docs/18/app-pgverifybackup.html): physical
  backup verification and the continued need for an actual restore test.
- [Roles](https://www.postgresql.org/docs/18/user-manag.html),
  [membership](https://www.postgresql.org/docs/18/role-membership.html),
  [privileges](https://www.postgresql.org/docs/18/ddl-priv.html) and
  [authentication](https://www.postgresql.org/docs/18/client-authentication.html):
  object ownership, runtime roles, grants by operation/column, membership paths,
  schemas and the distinct authentication boundary.
- [Row policies](https://www.postgresql.org/docs/18/ddl-rowsecurity.html): USING and
  WITH CHECK, policies do not grant privileges, default denial, combination,
  owner/superuser/BYPASSRLS boundaries and integrity-check information exposure.
  The fixed-tenant policy is exercised as a nonowner role rather than the owner.
- [Default privileges](https://www.postgresql.org/docs/18/sql-alterdefaultprivileges.html):
  future objects of the creating role, no retroactive change, and global/schema
  composition. The shipping role does not receive a broad default table SELECT.
- [CREATE VIEW](https://www.postgresql.org/docs/18/sql-createview.html): view security
  and ownership options justify keeping the article's view mention bounded.
- [Foreign keys](https://www.postgresql.org/docs/18/ddl-constraints.html): restricting
  parent deletion and explicit cascading choices.
- [Partition maintenance](https://www.postgresql.org/docs/18/ddl-partitioning.html):
  partition retirement, lock differences and detachment leaving a table behind.
- [Routine vacuuming](https://www.postgresql.org/docs/18/routine-vacuuming.html),
  already checked in the performance batch: DELETE visibility, later reclamation
  and the distinction from immediate physical erasure.

RPO/RTO examples, compatibility release order, reconciliation, deletion ledgers,
outbox delivery and restore suppression are explicit engineering reasoning over
the described invented scenarios. They do not assert a provider SLA, legal
retention period or guaranteed recovery duration.

## Executed checks

`node docs/article-work/operations-completion/verify.mjs` runs all 23 steps using
`execProtocolRawStream`, matching the sandbox's PostgreSQL simple-query protocol.
It records rows, command tags, errors and ReadyForQuery status in `observed.json`.
All steps finish idle; deliberate 42501 and 23503 errors do not leave transactions
open. Every lesson resets successfully after completion and variations.

- Migration copies two rows, preserves an old-writer edit, validates missing = 0,
  accepts a new-only insert after relaxing the old field, and retires the old
  representation while preserving four exact values. A one-row batch and an old
  insert are verified too.
- Recovery model finds missing req-b, repairs the simplified record to total 33,
  then detects amount 9 instead of 8 even though the count remains two.
- Permissions return only tenant 1's permitted columns, reject email and DELETE,
  permit order 1's update and return zero updated rows for order 2. Changing the
  policy to tenant 2 changes visibility while email remains denied.
- Deletion rejects the incomplete parent removal, removes the dependent and parent
  with the decision ledger, demonstrates revival by the older copy, and reapplies
  suppression repeatedly without affecting Lin.

`sh -n docs/article-work/operations-completion/restore-drill.sh` passes. The server
procedure is deliberately unexecuted: `psql`, `pg_dump` and `initdb` are not
installed in this authoring environment. The article states that limitation beside
the procedure. The downloadable script refuses existing database names, uses
private archive permissions, stops on errors, asserts snapshot contents, reports
missing acknowledged work and measures only its target/restore/SQL-check interval.
It does not delete source databases or claim a full measured RTO.

## Review boundaries

Author read the assembled source continuously after writing and checked the version
sequence and SQL against the runnable lessons. The schema article explicitly
separates the single submitted browser block from separate production transactions
needed to release earlier DDL locks. Independent comprehension/technical review and
desktop/phone theme inspection remain the coordinator's next stages. No publication
markers or shared registries were modified by the author.
