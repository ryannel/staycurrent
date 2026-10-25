# Authoring checks · first version

## Scope and reread

Writer completed first source and normal authoring/continuity reread, without delegation or independent review. Current staycurrent-write/figures/continuity applied. Root owns builds, native fixture, integration, independent review, freezing and publication decisions. No infrastructure edits, server launches, package operations, commits or publication by this writer.

Covered native keys/ranges, SQL gateway, secondary-to-primary representation, range leases/Raft, local Pebble, MVCC, cross-range purchase, split/movement/lease transfer, native placement evidence and version boundary. Child links use supplied canonical destinations. Deeper migration, job handling, read/isolation choices, transaction protocol, regional policy, recovery, performance diagnosis and operating/upgrade procedures remain with their owners. No fixed SQL→range/message count promised.

All seven drawings reread with body, captions, controls and text alternatives. Multi-node scenes are explicitly models; observed SQL is separately scoped to a disposable single-node v26.2.8 fixture. Native attempt01 failed at index job timeout; no later statement inferred successful.

## Browser/control check

Owned IAB article tab at http://127.0.0.1:4680/review/article/. Finished reference tabs at4584 retained their theme; private article origin alone changed Light/Dark.

- Desktop actual1280×720: light screenshot inspections of gateway, primary/secondary lookup, split final option; dark screenshot inspection of Raft stages. 840px wide figure panels fit viewport.
- Phone override actual375×720 verified with innerWidth375 and document scrollWidth375. Light and dark scene inspections; no diagram descendant horizontal overflow. Phone screenshots inspected Raft durable/applied cells, versions, purchase, storage and split; labels reflow to rows, split ranges stack.
- Every stepped figure (route4, keys2, Raft6, storage4, split4 states) exercised through all manual steps at desktop, Play→Pause, Replay→Pause, Back and Reset. End Next had aria-disabled=true; Reset returned1/N. Keyboard Enter on Next advanced each model. Figure-as-text opened and closed for every model.
- Split comparison exercised both options; final All demand onP7 shows quiet left, all demand on right/P7, new copies2/3/4 and lease4. Switching demand preserves the same boundary/placement schedule. No speed-up asserted.
- Browser console error/warning check returned none. No duplicate IDs. Sources disclosure is closed initially.
- Computed figure text contrast sampled across labels, notes, controls, bold cell labels, cell values and log cells: minimum light6.0469:1, dark6.1478:1. State borders use the same readable secondary text colour or theme teal; meaning also supplied in words and dashed/solid distinction.
- Shared stepper source verifies reduced-motion preference disables hold-bar animation; local figure CSS disables transitions/animations. Browser reports prefers-reduced-motion=false; this browser API supplied no media-preference override, so reduced-motion was checked in implementation rather than an emulated preference.

Builds requested from root at first complete source and again after final changes as needed. Native and final build outcomes are recorded below once supplied. Exact author source/input/reference hashes retained in source-hashes.txt at completion.


## Native observation and final checks

Coordinator first-complete compilation passed. Final stable compilation requested after the bounded native insertion and Figure2 assumption wording.

Successful run: CockroachDB CCLv26.2.8, linux arm64, built2026-10-14; pinned image sha256:1ad58b6a69928691e0c9289b847dcb35ac25108c6ead23fcabf47e37b9195e9a. Unique database sc_crdb_architecture, principal sc_crdb_architecture_writer, clusterUUIDdf7114cb-cc4f-465b-ac28-2dedee3490be, node1. Container71b9052e69b33712bce76d3a574e2351bafe062f941759c23ed4ff417005bf7d had networknone, no published ports/host mounts; bounded resources and explicit internal loopback client. Same-session database/user/version/clusterUUID guard preceded DDL; fixture-only allow_unsafe_internals permitted identity functions. Coordinator removed fixture successfully. Exact args and raw evidence are native-fixture.json/native-execution.json/native-results.txt/native-stderr.txt.

Successful verifier SHA25660db9c9f01acf2d980a2e92da209bc7c808aaaf047cac954f5ff8e8e8a367978 matched before/after; exit0. Its elapsed0.62s is diagnostic bookkeeping, not an article performance measurement.

Observed: only orders_pkey, with customer_id stored, not a customer search index. P7 lookup20.00; Mina orders101paid/103pending. Products initially covered by range82; manual split atP7 gives82+83, each replicas{1}, voting{1}, nonvoting{}, lease1. Price update22.00 leaves stocks10/0/4,total29.00,pending103,paymentcount0. Article table labels selected products in each range, not exact global range bounds. No physical KV/MVCC version inspection, automatic split, distributed survival, failover timing or regional latency established. Figure2 is explicitly a conceptual added secondary index and its CREATE INDEX is not presented as an observed successful example.

Attempts01/02 failed at explicit secondary-index build under30s/90s limits. Separate directories preserve exact SQL, fixture, execution, results and stderr; attempt02 also retains server/job diagnostics. No cause or future completion is inferred. The successful script omitted that optional index job rather than extending the timeout again. These failures do not establish CockroachDB index creation is generally unsupported or slow.

Targeted final browser check: inserted native table read at1280/System-dark and375/light+dark; it fits343px content width with no horizontal overflow, table region accepts keyboard focus, no pending-observation placeholder remains. Unchanged figure checks retained. System theme selected; viewport1280×720 restored then override reset; all owned reference/prerequisite/article tabs closed and no playback left running.

Coordinator final stable compilation passed unchanged after native observation integration. First complete source and final stable source both compiled successfully. Source is ready for coordinator freeze and independent review; no author source changes remain.
