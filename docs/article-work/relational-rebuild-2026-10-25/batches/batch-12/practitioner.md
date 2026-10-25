# Practitioner review — Replicas, lag and read routing

Reviewed 25 October 2026. Fixed first version `articles/replicas/v01`, matched to `batches/batch-12/review-source.json`; article SHA-256 `ee1d7fc4df81b2ca5a0bf9a41db55d59c109bce3d48e91e510b4ad52299a3bad`.

## Findings

No substantive technical or practitioner-depth finding. The article fulfils the supplied plan and incoming ownership: copied-history progress, acknowledgement promises, read-your-writes, monotonic reads, bounded waiting/fallback, freshness limits, lag/capacity and retention. Write-authority transfer, cross-shard snapshots and native standby operations remain with their designated neighbours. It gives the parent-level decisions before those hand-offs.

## Coverage and evidence

Read the complete frozen article and its three figure/model sources, supplied plan, commission, incoming ownership, neighbour briefs and original shared example. Calibrated the bounded log/durability explanation against the fixed Storage and durability reference's dirty-page/WAL passages and finished Figure 5. In an owned IAB tab on the fixed article preview, advanced Figure 1 to step 4/6: received and durable progress reach C, replay remains before U, and the new-snapshot price remains 20.00. The displayed explanation agrees with the authored state and prose.

Checked consequential claims directly against primary sources:

- [PostgreSQL hot standby](https://www.postgresql.org/docs/18/hot-standby.html): commit replay/new-snapshot visibility and resource/recovery conflicts.
- [WAL settings](https://www.postgresql.org/docs/18/runtime-config-wal.html#GUC-SYNCHRONOUS-COMMIT) and [standby operation](https://www.postgresql.org/docs/18/warm-standby.html): local durability, selected synchronous acknowledgements and physical copied history.
- [Replication statistics](https://www.postgresql.org/docs/18/monitoring-stats.html#MONITORING-PG-STAT-REPLICATION-VIEW), [administration functions](https://www.postgresql.org/docs/18/functions-admin.html) and [replication protocol](https://www.postgresql.org/docs/18/protocol-replication.html): distinct progress meanings, sender-observed lag, idle/null behaviour and history identity. In particular, the article's volatile receipt stage is conceptual; it does not mislabel `pg_last_wal_receive_lsn()`, which includes syncing to disk.
- [Replication settings](https://www.postgresql.org/docs/18/runtime-config-replication.html), [timelines](https://www.postgresql.org/docs/18/continuous-archiving.html#BACKUP-TIMELINES) and [failover](https://www.postgresql.org/docs/18/warm-standby-failover.html): retention limits/archive recovery, branch identity and former-writer exclusion.
- [Terry et al., original session-guarantees paper](https://www.cs.cornell.edu/courses/cs734/2000FA/cached%20papers/SessionGuaranteesPDIS_1.html), §§3.1–3.2 and 4: the two session promises, target eligibility and inability to meet a requested guarantee.

Independently recalculated the frozen article/component, original example, verifier and result hashes against `v01/files.json`; all matched. Original example SHA-256 is `bec5d83032938ec0f9b3cc0da2cea970e9f60ae335db63c4dfb9d7b3c19db430`. Inspected both verifiers and their recorded results. The displayed SQL hash agrees with `sql-result.json`; its PGlite 0.5.8 / PostgreSQL 18.3 WASM result supports P7 20.00→22.00, unchanged stock and pending order 103 with 29.00 lines, no payment and 20.00 agreed mug price.

The authored model covers durable-but-unreadable C, qualified successful reads, unavailable-without-stale-answer, and A→B regression with/without retained history. The 600 MiB / (20−10 MiB/s) = 60 s and stopped-write 30 s arithmetic is correct under its explicit constant-rate assumptions. U/C, H:C and rates remain explanatory symbols/contracts/assumptions throughout, not native APIs, log addresses or measurements.

## Limits

Reused matching SQL/model execution records; did not rerun them or claim native replication, flush survival, network, timing or promotion evidence. The provided native PostgreSQL runtime probe establishes only an available disposable environment and supplies no replication observation for this article. No concrete technical concern required a new fixture. Rendered inspection was bounded to the key Figure 1 state and reference comparison; this is not a comprehensive controls, viewport or theme review. No themes changed. No authoring-checks, earlier manuscripts or earlier reviews were used. No source edits, delegation, commits or publication.
