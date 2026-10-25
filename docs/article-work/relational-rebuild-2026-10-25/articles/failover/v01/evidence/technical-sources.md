# Technical sources

Checked external primary sources on2026-10-25:
- PostgreSQL18 Failover: https://www.postgresql.org/docs/18/warm-standby-failover.html — old-primary exclusion, standalone promotion scope, renewed protection and rehearsal.
- PostgreSQL18 Log-shipping standby servers: https://www.postgresql.org/docs/18/warm-standby.html — WAL prerequisites, replay before promotion, async/sync separation.
- Pacemaker3 Fencing: https://clusterlabs.org/projects/pacemaker/doc/3.0/Pacemaker_Explained/html/fencing.html — independent enforcement, split brain, complete resource exclusion.
- Patroni Watchdog: https://patroni.readthedocs.io/en/latest/watchdog.html — stopping may fail under process crash, pause/overload and slow shutdown; watchdog conditions matter. No default-time guarantee borrowed.
- Patroni Replication modes: https://patroni.readthedocs.io/en/latest/replication_modes.html — actual eligible history versus availability; stale sampling and promotion-policy coordination. No claim every setting called synchronous ensures zero loss.
- Burrows, Chubby, sections2.1/2.4: https://storage.googleapis.com/gweb-research2023-media/pubtools/4444.pdf — recipient rejects stale generations/sequencers. Hypothetical7/8 model qualifies enforcement after higher generation established; tokens do not fence unrelated resources.
- PostgreSQL18 pg_rewind: https://www.postgresql.org/docs/18/app-pgrewind.html — divergent timeline repair, replaced data and standby configuration. Native syntax/prerequisites left to implementation article.

SQL arithmetic and displayed query verified by evidence/verify-example.mjs on PGlite0.5.8/PostgreSQL18.3/WASM. evidence/sql-results.json preserves actual version/output and limits. Instance closed in finally. Conceptual diagrams are not reported as observed replication, fencing or failover. No native runtime was needed for the commissioned conceptual model; no native connection attempted.
