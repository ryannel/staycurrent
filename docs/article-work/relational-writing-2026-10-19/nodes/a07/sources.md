# a07 source and model record

Checked 19 October 2026. Article: **Running a relational service**. Staged at `article.astro`; imports intentionally resolve from the final article destination. This is an operational decision article, with child articles owning executable security, maintenance, topology and restoration procedures.

## Primary sources checked

| Source | Claim checked / use |
| --- | --- |
| [PostgreSQL 18 host authentication](https://www.postgresql.org/docs/18/auth-pg-hba-conf.html) | Connection authentication rules are distinct from subsequent object privileges. |
| [PostgreSQL 18 privileges](https://www.postgresql.org/docs/18/ddl-priv.html) | Object ownership and grants determine authority; the application should not be assumed restricted merely because it authenticates. |
| [PostgreSQL 18 SSL](https://www.postgresql.org/docs/18/ssl-tcp.html) | Encrypted transport and verifying the server identity are configuration concerns distinct from SQL privileges. |
| [PostgreSQL 18 cumulative statistics](https://www.postgresql.org/docs/18/monitoring-stats.html) | Activity, states and waits; maintenance, replication and archiving views. Article avoids treating a cumulative counter as instantaneous work. |
| [PostgreSQL 18 routine vacuuming](https://www.postgresql.org/docs/18/routine-vacuuming.html) | Vacuum reclaims reusable space, statistics upkeep and autovacuum; long-lived transactions impede cleanup; VACUUM FULL is a rewriting, exclusive-lock operation. |
| [PostgreSQL 18 standby servers](https://www.postgresql.org/docs/18/warm-standby.html) | Async replication can leave acknowledged commits off a standby. Section 26.2.8 distinguishes remote_write, default synchronous flush and remote_apply; required unavailable standbys can prevent completion. Figure explicitly models a configured synchronous participant, not the synchronous_commit=on default in isolation. |
| [PostgreSQL 18 continuous archiving](https://www.postgresql.org/docs/18/continuous-archiving.html) | Base copy and continuous archived WAL are required for PITR; ordinary logical dumps are not WAL replay bases. Failed archiving retains local segments and can exhaust storage. Configuration file changes are not restored by WAL replay. Recovery should be checked before users reconnect. |
| [RDS introduction to backups](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html) | Automated retention is configured; service labels do not establish all administrative-loss coverage. Article leaves exact product restrictions to children. |
| [RDS instance point-in-time restore](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html) | PITR creates another instance without changing its source; restored configuration and usable application readiness require attention. |
| [RDS instance reboot/failover](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_RebootInstance.html) | Multi-AZ DB instance failover updates DNS; existing connections must be re-established. Article explicitly scopes this example to DB instances. |

Two attempted direct web opens (`disk-full.html` and RDS `USER_WorkingWithEncryption.html`) returned an internal fetch error and are not used as evidence. No technical conclusion depends on them.

## Illustrative assumptions and checks

- Shop orders, RTO/RPO values, detection delay, storage growth and intervention times are invented requirements and arithmetic examples, not benchmark or drill findings.
- Capacity: initial free space 96 GB, reserve 32 GB, ordinary data/index growth 4 GB/h, failed-archive retention adds 8 GB/h. Initial time to reserve is 64/4 = 16 h or 64/12 = 5.333… h. The latter is already less than the 8 h intervention lead. At 6 h of the second scenario, 24 GB remains, below reserve.
- Copy sequence: order 103 begins absent; local flush can release local-only acknowledgement; selected standby flush can release synchronous acknowledgement; replay makes it visible to a new standby query. A later committed deletion propagates too. Assumes a suitable retained base copy and complete history cover the pre-deletion target. These are logical stages, not an assertion of measured delays or every possible interleaving.
- Incidents: overload starts at 09:12 and controlled service resumes 09:19 (7 min); deletion response begins 09:12 and affected workflow resumes 09:54 (42 min). The deletion was committed at 09:10 and valid order 106 arrived at 09:11. Separate restoration and deliberate repair preserve the ability to account for both histories. Repair details are scenario assumptions, not an executed data-repair procedure.
- No native SQL, filesystem recovery command, failover or reconfiguration instruction is presented. No server was changed, restarted or stopped, and no restore was claimed.

## Executed validation

`node src/components/relational-next/a07/verify.mjs` passed: capacity accounting and time-to-reserve, local/synchronous acknowledgement boundaries, flush versus replay, propagated deletion, and playback reading delay for both incident panels.

Both Astro files transformed with `@astrojs/compiler` 2.13.1 without diagnostics, importing the installed package by its pnpm path. The first attempt to import the compiler directly by package name failed because it is not a top-level dependency; the installed dependency path succeeded. No build or dist change was made.

All three reference article sources were read in full, including figure prompts, captions and result explanations. Their live reference pages were inspected, including rendered sequence waiting, index comparison and WAL figures. Root owns browser checks of the staged article after promotion, mobile/theme checks, shared build and independent reviews.
