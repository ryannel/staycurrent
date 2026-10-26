# Planning notes

Fresh outline under staycurrent-breakdown; no old target body, outline, review or worker notes read. No article, fixture, server, build, review, commit or publication produced. No new child or ownership change proposed: this article's complete native upgrade outcome fits one page.

## Reference exposure

Read all bounded text parts separately with `scripts/read-writing-reference.py`: sequences 1–6, indexes 1–7, storage 1–6; all 19 END markers arrived. Studied finished drawings in one owned Chrome tab in session “📖 Upgrade planning”: sequences `#replies-and-activation-bars`, indexes `#composite`, storage `#wal`. Browser inventory exposed Chrome, no IAB; no user tab, viewport or theme changes. The tab was closed after reading.

The references establish one concrete state before changing one condition, distinguish a model from execution, and let the drawing carry a boundary the prose interprets. The upgrade needs the node-build inventory, active cluster version and eligible return path visible together; finalisation start and completion must remain separate. Prose, drawings and controls are the writer's decisions.

Read the available replacement previews for Inside CockroachDB, Rebalancing and cluster change, and Operating and securing a CockroachDB cluster. They already establish gateway versus range roles, per-range voter margins, draining versus decommissioning, secure task identities and meaningful health evidence. The native CockroachDB backup preview returns Not found; retain its supplied ownership brief and do not borrow an older body. Other neighbour boundaries come from the authorised input JSON.

## Primary sources checked 26 October 2026

- [Self-hosted upgrade manual, v26.2](https://docs.cockroachlabs.com/docs/v26.2/upgrade-cockroach-version): supported paths, rolling replacement, health preparation, automatic/manual finalisation, rollback and blockers. Teach the supported adjacent 26.1→26.2 case, without a general skip rule. An old reported version does not establish rollback safety once finalisation starts. Timing is not a completion gate.
- [Cluster settings, v26.2](https://docs.cockroachlabs.com/docs/v26.2/cluster-settings): `cluster.auto_upgrade.enabled` defaults true; false holds automatic advancement. `cluster.preserve_downgrade_option` blocks automatic **and manual** advancement until reset. Current upgrade guidance recommends the former; do not combine the two methods accidentally.
- [v26.2 release notes](https://docs.cockroachlabs.com/docs/releases/v26.2): distinguish binary changes from “Features that require upgrade finalization”, plus incompatible/default/deprecation and intervening patch changes. A useful bounded acceptance example is changed underlying-view privilege/RLS behaviour after finalisation; the operations prerequisite already teaches the resulting v26.2 owner-security contract. An isolated permissions test may make this visible without reteaching RLS. v26.2.8 is dated 16 October 2026; the Mac download is experimental, so a laptop rehearsal is no production qualification.
- [Node shutdown, v26.2](https://docs.cockroachlabs.com/docs/v26.2/node-shutdown): temporary drain and orderly stop preserve stores; decommissioning is a different operation. Follow deployment-specific shutdown rules and completion evidence; do not turn a prescribed grace interval or a successful SELECT 1 into proof of recovered range protection.
- [RESTORE, v26.2](https://docs.cockroachlabs.com/docs/v26.2/restore) and [restoring across versions](https://docs.cockroachlabs.com/docs/v26.2/restoring-backups-across-versions): newer-version backups cannot be restored into older versions; backup compatibility considers cluster version. A newer backup is not an automatic return route. This page only establishes that limitation and points to the recovery owner.

## Example and native evidence

Use an independent copy of the supplied post-purchase shop. At baseline P7 price is 20.00, stock P3/P7/P9 is 10/0/4, order 103 is pending, its agreed lines total 29.00 and it has no payment. In the held all-new-binary branch, reuse the already authorised independent catalogue-price change to 22.00. Returning binaries retains that committed 22.00; stock, order and agreed prices stay unchanged. Finalisation can follow a separate re-upgrade branch on that same retained state. No new business fact is needed.

Root has verified official v26.1.8 and v26.2.8 binaries and can supply a guarded three-process fixture. Planner has made no native observations. Writer should retain source/build identity, store/node IDs, explicit finalisation policy, per-node builds, active version, migration-job evidence, health and bounded shop checks at source, mixed, all-new-held, returned-source and finalised checkpoints. Capture actual results and errors; do not prewrite output. A local three-process rehearsal can establish native compatibility/state transitions, not independent host/zone failures, production capacity, full client acceptance or recovery completeness.

The current upgrade manual requires an appropriate valid licence for a major upgrade and telemetry for Free/Trial finalisation. Use existing authorised configuration; if that prevents finalisation, state the native limit and preserve the documented model. Do not silently configure external reporting, acquire a licence or claim an unobserved finalised result.

## Continuity and ownership check

The outline starts from the accepted range/health prerequisites, introduces the two version concepts before using them, and carries finalisation's return boundary into failure handling. Binary rollback is distinct from undoing writes. Internal upgrade migration jobs are distinct from the application schema jobs owned by crdb-schema-change. crdb-migration owns transfer from another database system; crdb-backup owns compatible restore, authority closure and later-work reconciliation. General capacity and survival analysis remain with cluster-change and native health/removal with crdb-operations. No unresolved shared business-fact change or new page is required.
