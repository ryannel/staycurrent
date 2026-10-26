# Combined independent first review — batch 45

**Version:** crdb-backup v01, “CockroachDB backup and recovery”, reviewed 26 October 2026 at `http://127.0.0.1:4606/review/relational-rebuild/cockroachdb/backup-and-restore/`.

**Result:** No critical or medium finding. No optional change is needed for delivery. One combined first review by one fresh reader; no article edits, delegation, additional round, commits or publication.

## Scope and reading order

Saved `initial-notes.md` before consulting the plan, shared example, execution evidence or author notes. The browser's automatic opening accessibility snapshot exposed the body, but the deliberate first pass followed the figures, captions and controls before reading the body. Authoring-checks, earlier manuscripts/reviews, coordinator acceptance state and author quality verdicts were withheld throughout.

Calibrated against bounded reference passages: Indexes' opening, sequential scan and index-entry explanations; Sequence diagrams' lifelines/messages and activation explanation; Storage and durability's crash recovery and recovery-time explanation. Inspected finished reference drawings in the browser: B-tree search, Mina's booking, and crash recovery. Subsequent plan/ownership/source checks completed that reading without another full reading.

## Teaching, writing and ownership

The article fulfils the plan's intended understanding. Its figures teach the central distinctions in order: a database cut can omit good and bad later facts together; retained backup material and captured revisions determine supported targets; re-recording an accepted payment differs from charging again. Figure 1 keeps the provider's acceptance visible while the catalogue price and local payment change. Figure 2 visibly blocks C when B is missing and changes supported points when revision history is removed. Figure 3's repeat retains one payment, 19.00 due and stock 10/0/4.

The explanations connect figures to practical decisions. “A restore point selects a state … It does not select which transactions were good” establishes the first plainly. The LATEST passage explains why a newer full path might miss the required state and why an incident record should pin the selected path. “Keep the retained purchase” explains why repair must preserve stock consumption and the agreed 29.00 rather than repeat order creation. These concrete developments compare well with the references' use of the same page/row or booking across changes, followed by an explicit consequence.

Headings name recognisable subjects and tasks (“Full backups and incremental chains”, “Choosing the restore scope”, “Check both sides of the cut”). Terms are introduced where needed, SQL placeholders and the external-connection prerequisite are stated, and the reconciliation insertion is explicitly a branch after checks rather than a complete recovery script. The opening is dense but its facts are immediately used. Necessary qualifications sit with the decisions they affect; no passage creates a substantive interruption or reads as production bookkeeping.

Checked the plan, article/prerequisite record, incoming ownership and neighbouring briefs after blind notes. Native coverage and restore scope remain here. General recovery objectives/method come from the linked prerequisite; live cluster health/access and the full application handover remain with their named owners. The handover passage supplies the conditions recovery needs without attempting the neighbouring article. The original shared-example snapshot and today's canonical `docs/coverage/relational-rebuild-2026-10-25-example.md` recovery variation agree on order 103, 29.00 agreement, 2.20 mistake, later payment 504, stable operation identity and unchanged stock. Scenario and illustrative/native distinctions remain continuous through the ending.

## Technical accuracy and provenance

Checked official CockroachDB v26.2 [BACKUP](https://docs.cockroachlabs.com/docs/v26.2/backup), [SHOW BACKUP](https://docs.cockroachlabs.com/docs/v26.2/show-backup), [full/incremental backups](https://docs.cockroachlabs.com/docs/v26.2/take-full-and-incremental-backups), [revision history](https://docs.cockroachlabs.com/docs/v26.2/take-backups-with-revision-history-and-restore-from-a-point-in-time), [RESTORE](https://docs.cockroachlabs.com/docs/v26.2/restore), [validation](https://docs.cockroachlabs.com/docs/v26.2/backup-validation), [monitoring](https://docs.cockroachlabs.com/docs/v26.2/backup-and-restore-monitoring) and [SHOW JOBS](https://docs.cockroachlabs.com/docs/v26.2/show-jobs).

The documented chain, history-window, selected-state, dependency, grant, destination/version, key and job-completion claims support the article's actions. The validation table correctly separates checking files, restoring schema, reading/checksumming discarded rows and populating a candidate. Its last column preserves remaining business/application checks. No unsupported recovery-rate or distributed-survival inference appears.

The revision-history default discrepancy raised in blind notes is supported. The current BACKUP option table says default true. First-run retained SQL shows unqualified and explicit-false full/increment chains succeeding, then interior-target rejection requiring revision_history. That run exits 1 at the unqualified schema/checksum restore; it establishes neither a recovered candidate nor reconciliation. The article does not attribute later outcomes to it. The explicit-true supplement succeeds at the interior schema/checksum restore, candidate restore, latest counterexample, payment/mapping transaction and repeat lookup. Readback supplies 20.00/pending/29.00/no payment at the cut, 2.20/payment 504 at latest, then one 10.00 payment with the original mapping and unchanged stock after repair. The blind duplicate gets 23505. Payload equality is verifier-side, as the article states; no observed provider request is claimed.

Inspected exact provenance:

- Current article, metadata and figure SHA-256 values match `review-source.json`: `af56f39c…`, `d42989e9…`, `4cfe27be…` respectively. Preserved v01 source matches too.
- All 36 applicable input, source and native-evidence artifact hashes checked against v01 `files.json` match. Original `input/shared-example.md` is `3622e871de36d5bfbda3b16fe2c2fc2dc2eef2d49d8749e3d320d0825f8893fb`.
- First verifier and executed copy both hash to `ae5da6cef6c6e0e08ed5ac031b17203e3bd73cc4cc80183b20a2a09bfc5892d5`; supplement copies both hash to `a13486ead04fb8222e7e962805b71d3ed3c1299571abc1bc304c9341b6744906`. Root receipts identify these hashes, unchanged sources, exit 1/0 respectively and cleanup exit 0.
- Fixture receipts identify separate UUIDs `67b7fc89-681e-48e9-ac7f-bc8d6dfeee5d` and `8c349890-5715-4138-bbd3-55d168d40441`, official v26.2.8 image digest `1ad58b6a69928691e0c9289b847dcb35ac25108c6ead23fcabf47e37b9195e9a`, network none and no published ports. The supplemental root executor checks exact image/container/network/mount state; the verifier checks cluster, database, principal, version and an empty fixture before writes.

No concrete concern justified a fresh runtime. Reused native evidence is confined to the stated small SQL projection, local backup storage and fixture administrator. Its first projection uses `order_lines`; the successful supplement uses `order_items`, as does reader SQL. Neither represents full-shop integrity, production application access, cloud/KMS access, outage timing, distributed survival or real provider integration. The article states these limits and the remaining rehearsal obligations.

## Current rendered behaviour

Used three fresh owned Chrome tabs because inventory had no IAB surface. Actual article dimensions were verified at 1280×720, 390×844 and 375×812; phone document width equalled viewport width. Inspected current figures, captions, SQL and representative table layout in light and dark. Cards stack in event order on phones, arrows turn down, labels/values remain readable, and payment state, provider evidence, explanation and controls stay together. Scope-table columns remain usable at 375 pixels; SQL is contained in its own region.

Exercised all restore-cut and provider-evidence options, both retained-material and captured-history choices, meaningful chain combinations, all five accepted repair steps, both stopping outcomes, backward stepping, reset, playback and pause. Keyboard activation retained focus at final Next and allowed return through Back; reset exposes first-step Back as unavailable. Opened the figure text alternative and checked it against the drawing. Playback visibly progressed and paused with readable holds; this was operational observation, not an exact timing benchmark.

Computed normal figure-text contrast from rendered foreground and nearest opaque background colours: lowest sampled ratios 6.15:1 dark and 6.05:1 light, above 4.5:1. Retained/omitted and available/missing/blocked states use explicit labels as well as appearance. No substantive rendered/control defect found.

## Limits and cleanup

This does not replace root's build/site checks or independently re-execute native SQL. Browser checks cover representative current states rather than another exhaustive mechanical matrix; no screen-reader session or exact playback-duration measurement was performed. No source changes occurred during review.

Stopped/reset players and restored dropdown defaults. Main/reference origins are back to System. Verified 1280×720 restoration before clearing temporary viewport overrides, closed all three owned tabs and released the theme lease to root.
