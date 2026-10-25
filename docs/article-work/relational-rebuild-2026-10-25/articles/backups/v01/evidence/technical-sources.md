# Primary-source checks · 25 October 2026

Checked through web tool; actual accessed pages below. Reader sources included at bottom for wrapper disclosure.

- https://www.postgresql.org/docs/18/continuous-archiving.html — base+continuous required WAL; dump cannot accept WAL; entire-cluster physical scope; configuration not recovered by WAL; inspect recovered state; retain original evidence. Diagram is a model, not observed backup/restore.
- https://www.postgresql.org/docs/18/backup-dump.html — logical reconstruction, single-database vs cluster-wide roles, compatibility, consistent dump.
- https://www.postgresql.org/docs/18/backup-file.html — arbitrary live file copying insufficient; supported simultaneous consistent snapshots and consistency WAL.
- https://www.postgresql.org/docs/18/app-pgcombinebackup.html — incremental dependencies, reconstructed full and missing ancestor; chain validation distinct from integrity.
- https://www.postgresql.org/docs/18/runtime-config-wal.html#RUNTIME-CONFIG-WAL-RECOVERY-TARGET — include/exclude boundary, supported targets, transaction assignment vs completion order, source timeline and pause/check semantics. Native target syntax delegated.
- https://www.postgresql.org/docs/18/app-pgverifybackup.html — integrity/required consistency WAL checks do not replace test restore and expected-data verification.
- https://docs.cockroachlabs.com/docs/stable/take-full-and-incremental-backups — complete incremental ancestry and scope. No exact version-specific command prescribed here.
- https://docs.cockroachlabs.com/docs/stable/take-backups-with-revision-history-and-restore-from-a-point-in-time — arbitrary point within captured revisions requires revision coverage; backup point alone does not supply it.
- https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_planning_for_recovery_objective_defined_recovery.html — RPO/RTO as business objectives, dependencies, achieved recovery separate from goals.
- https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/plan-for-disaster-recovery-dr.html — workload recovery and testing.
- https://docs.stripe.com/api/idempotent_requests — API v1 exact payload, retained first outcome, keys may be pruned after at least24h; pruned reuse starts new request. This is an actual comparison, not the hypothetical provider contract.

Two guessed PostgreSQL URLs returned404 (backup-incremental.html, recovery-target-settings.html); no claims sourced to them. Replaced with pg_combinebackup and runtime-config-wal recovery-target section.

Own database observations: `node evidence/verify-sql.mjs`; unchanged downloadable fixture executed in installed @electric-sql/pglite0.5.8, actual PostgreSQL18.3 WASM. Exact version/source hash/results retained in sql-results.json. No native backup/restore, archive gap, provider, real client connection, authority handover or performance test claimed. No external/default database targeted.
