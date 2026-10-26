# Primary sources and claim limits

Checked26 October2026. Exact official versioned pages accessed via web tool:
- https://docs.cockroachlabs.com/docs/v26.2/upgrade-cockroach-version — adjacent supported major path; one-node rolling binary replacement; default automatic finalisation; recommended cluster.auto_upgrade.enabled=false; legacy preserve_downgrade_option also holds; manual SET version; rollback closes when finalisation begins; migration jobs and active version; licensing prerequisites. Important current distinction: docs recommend auto_upgrade rather than presenting preserve as sole control.
- https://docs.cockroachlabs.com/docs/v26.2/cluster-settings — cluster scope versus node start flags.
- https://docs.cockroachlabs.com/docs/v26.2/show-cluster-setting — exact observation syntax and privileges.
- https://docs.cockroachlabs.com/docs/releases/v26.2 — finalisation-dependent owner underlying-view privilege checks and owner RLS policies; explicit examples in acceptance, not inferred universal hold compatibility.
- https://docs.cockroachlabs.com/docs/v26.2/node-shutdown — temporary drain/store retention versus permanent decommission; client/routing consequences.
- https://docs.cockroachlabs.com/docs/v26.2/cockroach-node — node status build/range/availability evidence.
- https://docs.cockroachlabs.com/docs/v26.2/restore — newer backups cannot be restored on older releases; recovery separate from executable return.

Upgrade-options-overview and restore-backups-across-versions guessed URLs failed; no claim derived from them. Direct official GitHub source fetch failed; not counted as verification.

Native evidence: input/source-engine-runtime.json verifies official26.1.8; input/engine-runtime.json verifies26.2.8; input/native-runtime.json identifies exact three-process owned fixture. evidence/verify-upgrade.py is guarded, bounded, root-inspected and root-executed. No claim of independent failure domains, regional latency, production capacity, deployed application-driver acceptance, TLS authentication or licence acquisition. Attempt3 actual results are evidence/native-rehearsal-03/native-run.json. All10 baseline/outbound/return/re-outbound checkpoints passed. Exact builds were observed per gateway and in status; held cluster26.1/preserve26.1/auto-upgrade false were verified; shop projection checks passed through each node. Catalogue22.00 committed before first restart, unlike figure's separate illustrative timing, and survived all binary changes.

Manual finalisation did begin. Client request hit45s bounded timeout (rc124), not a server failure verdict. Following SHOW returned26.1-upgrading-to-26.2-step-016; MIGRATION rows showed succeeded steps and running018. No native completion, stall, final26.2 value, finalisation-dependent view acceptance or older-binary return after request is claimed. This exact native intermediate string takes precedence over simplifying the active-version display to26.1; prose and figure were updated accordingly. The completed finalisation stage remains documented model. No licence/account/telemetry adjustments made.

Attempt1 immutable snapshot60b5d34f… stopped on CSV f handling before rollout. Attempt2 snapshotac854a0b… passed baseline then stopped on missing external kill before any restart. Both remain separately recorded with root cleanup receipts. Attempt3 executed child source dd753c000f1c80317443b77dc7779800ea46958b915545514f655278a9027602 uses known bash builtin, timeout receipts and exact fresh identity. No fabricated timings.
