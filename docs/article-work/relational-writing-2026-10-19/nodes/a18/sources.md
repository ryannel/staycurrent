# Locking evidence

Checked 20 October 2026. Primary PostgreSQL 18 documentation:

- https://www.postgresql.org/docs/18/explicit-locking.html — row compatibility,
  transaction/savepoint lifetime and deadlock victim selection. The article uses
  FOR UPDATE, explains only the weaker mode needed for the observed FK contrast,
  and avoids a lock catalogue.
- https://www.postgresql.org/docs/18/transaction-iso.html — Read Committed command
  snapshots and concurrent locking reads. Separate-command recipe is intentionally
  scoped to this isolation level; a combined lock/count is observed stale.
- https://www.postgresql.org/docs/18/sql-select.html — locking clause, NOWAIT and
  SKIP LOCKED; row options do not remove the command's table-lock requirements.
- https://www.postgresql.org/docs/18/ddl-constraints.html — identities, references
  and inability to enforce arbitrary cross-row counts through a CHECK.
- https://www.postgresql.org/docs/18/runtime-config-client.html — lock_timeout per
  lock acquisition; no whole-request completion guarantee.
- https://www.postgresql.org/docs/18/monitoring-stats.html — pg_stat_activity lock
  wait observation.
- https://www.postgresql.org/docs/18/errcodes-appendix.html — 23503, 40P01, 55P03,
  25P02.

## Observed execution

Native Homebrew PostgreSQL 18.6, 180006, shared commissioned loopback runtime
127.0.0.1:57319, role staycurrent. Own databases rel3_a18_run1, run2 and run3 were
created afresh and removed. Final complete evidence is `native-results.json` from
run3. It contains all commands and unaligned outputs, including actual observed
wait_event_type=Lock before the competing holder is released.

The downloadable `src/components/relational-next/a18/rehearse.py` uses Python's
standard library and three psql sessions (two participants and one observer).
It sets only its sessions: 12s statement timeout, 5s lock timeout, 45s idle
transaction timeout. One test overrides lock_timeout locally to 150ms. Server
deadlock timeout remains 1s. No shared configuration was changed.

31 assertions passed: two empty counts; unprotected overselling; ordinary count
while a protected insert is pending; observed class-lock wait; resumed identity;
fresh count; final invariant; combined command stale count then fresh next count;
the displayed guarded INSERT accepting/declining; displayed move refusing a full
target then accepting after cancellation; cancellation exactly once; both-class
invariant; capacity reduction rejection; empty-set row locks permitting insertion;
absent resource FK rejection; FOR UPDATE conflicts with capacity update, deletion
and actual foreign-key insert; FOR NO KEY UPDATE permits that FK insert; NOWAIT
and lock-timeout errors; failed transaction state; SKIP LOCKED empty despite an
existing candidate; reversed-order deadlock and failed victim transaction; explicit
canonical acquisitions completing.

No power failure, crash, load measurement, different engine or different isolation
level was tested. Models are labelled illustrative, not native execution.

## Figure models

Five scenes, 13 choice branches, 45 states. `check-model.mjs` checks complete fields
and distinct invariant, visibility, compatibility, wait-cycle and waiting-policy
outcomes. Native results ground the displayed outcomes; model playback is not a
database implementation.
