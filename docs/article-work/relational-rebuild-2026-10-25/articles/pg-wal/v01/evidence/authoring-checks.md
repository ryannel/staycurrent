# Author checks

First complete source prepared fresh from the supplied assignment. No delegation, older manuscript/feedback exposure, main-repository edits, server/dependency commands, lifecycle actions, commits or publication by this writer. The coordinator owns compilation, native lifecycle and independent review.

## Author reread and continuity

Reread complete prose, figure states, captions and text alternatives from the prerequisite knowledge in finished Storage and durability / Inside PostgreSQL. The two conceptual players establish the additional native distinctions before their settings and observations are used. Figure 3 separates external client acknowledgement from attempted work and observed fresh SQL reads; figure 4 explains the actual log sequence. No new shop fact is introduced centrally. The unfinished P9 variation is local and disappears from visible committed state; order 103/stock/line-price facts remain constant. The separate mistaken 2.20 branch appears only in recovery choice. Backup/standby repair procedures stay with the neighbours. Canonical neighbour links match the supplied reading index.

Local author repairs: make progress-cell ticks redundant with colour/border differences; align the history labels with the cells; replace an unsupported background variable with --color-surface; call R the new redo point, not a checkpoint record; make the later dirty-page label say WAL already covers it. These were authoring changes before first independent review.

## Ordinary SQL

`verify-sql.mjs` extracts all seven displayed SQL blocks from the article and executes them in one owned PGlite0.5.8 memory-only instance (actual PostgreSQL18.3/WASM), closes it in finally, and retains exact SQL/results in sql-results.json. The illustrative LSN difference is 64; the committed P7 change returns22.00; the uncommitted P9 attempt sees36.00 in its own transaction then rolls back to35.00; SET LOCAL off rolls back to session on. Native view/column syntax also executes. This is not a filesystem, flush, multi-client or crash observation. No production/default database target used.

## Native process-stop drill

The coordinator inspected the SQL-only native-drill.py before execution. Every work session performs guarded database/user/version/data-directory/cluster/systemID/settings checks on the same psql session before its DDL/updates. Exact container/label/image/network/ports/resource/retained-data guards also run. The verifier contains no lifecycle commands.

Coordinator execution artifacts: native-{setup,hold,flush,verify}.txt and stderr; native-baseline.log/native-after-stop.log/native-recovery.log; native-execution.json/native-fixture.json; coordinator-drill.py; fixture-guards.json. Setup→held unfinished work→synchronous flush marker→immediate stop→same-container restart→SQL verification passed. Actual runtime18.6, systemID7700746543233568817, full containerID in guards. No native lifecycle actions were executed by the writer. Exact verifier/guard hashes agreed before/after. Coordinator reports container and volumes removed and disposable authentication deleted after verification.

Observed: P7 acknowledged22.00 survives; P9 attempted36.00 without COMMIT reads35.00 after restart; order103 pending29.00/no payments, stock10/0/4; technical flush marker survives. The hold session exits with interrupted-connection failure, expected because it was deliberately open. Dockerexec pg_ctl immediate-stop returned137 when the stopped container terminated its exec; stopped state plus recovery logs establish that the requested stop occurred. Neither is misreported as a normal successful SQL return.

Log: pre-test checkpoint record0/1C55938 with redo0/1C558E0; redo starts0/1C558E0; end-of-log read at0/1C5BEE0; redo done at last-record-start0/1C5BEB8; replay reports elapsed0.00s; end-of-recovery checkpoint writes8 shared buffers and reports total0.009s; then readiness. These are a tiny process-stop/restart on surviving cached storage, not power/storage loss, a test of an honest drive flush, a throughput/capacity measurement or a recovery-time guarantee.

## Render and control checks

Owned IAB private4684 tabs, independent from other writers. Verified actual innerWidth1280/height720 and375/height720 after applying overrides to an owned fresh tab. The first override call before creating the mobile tab did not resize that tab; verified width was1280, then reapplied while bound and confirmed375 before claiming mobile checks. At375 document scrollWidth375, each of four figures width343/scrollWidth341. Desktop document1280. New drawings/captions/log wrap without clipping. SQL/table scrolling is contained in existing labelled regions.

Inspected all four figures in light and dark at desktop/mobile, with the progress on/off states and completed checkpoint state visible. Exercised every player transport, both commit options, Figure as text disclosures; Enter/Space activate buttons, end buttons keep focus with aria-disabled, Play/Pause changes state, Replay returns to step1 and automatic playback advances to step2. Both players retain shared timing/reduced-motion code. Reduced-motion emulation and a screen-reader session were not available; source guard/text alternatives inspected, no claim of assistive-technology testing.

Computed theme colours from rendered DOM after the token repair. Text/background contrast: dark muted6.15:1, normal10.89:1, shaded progress cell8.91:1; light muted6.05:1, normal13.73:1, shaded cell12.36:1. Teal against figure background8.16:1 dark/4.36:1 light. Ticks/solid versus dashed cells and text carry state beyond colour. Focus rings use teal. Theme restored toSystem, viewport1280×720/reset, playback stopped and owned tabs closed at cleanup.

Compilation requested at first-complete source and again after final authoring/native integration. Coordinator confirmed final stable compilation PASSED with source unchanged. Article SHA256 is `02be0bdcdbfa1c75d144f86a3edb0b1964fd3cda2417cd5101e7a3ca5e33cc7a`; exact article/component/input/verifier hashes are in source-hashes.json. Final SQL verification results carry that same article hash. No independent review has yet taken place; return for the commissioned first review.
