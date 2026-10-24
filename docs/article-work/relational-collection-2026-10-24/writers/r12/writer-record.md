# r12 — Table partitioning and data lifecycle

Fresh complete article, finished 24 October 2026. Body: `src/articles/relational-collection/r12.astro`; components and both download files: `src/components/relational-collection/r12/`; metadata proposal: `metadata.json`. No shared infrastructure, public route, commit or push was changed by this writer.

## Calibration and design

Used the supplied current write, figures and continuity skills. The common complete reference calibration was performed once for the three-piece assignment in r10: all 19 bounded parts separately, with END markers, and all 34 rendered drawings with their explanations. Root acknowledged delivery before design. This article then had its own development, complete reread and continuity pass. The supplied typed-values and history drafts establish instants, local boundaries, retention scope and time axes; this assignment's new r10 supplies indexes. No old source or feedback was read.

The article starts with one parent over monthly pieces, derives exclusion from bounds, separates pruning from row access, follows key/reference consequences, then removes a month and handles late/future writes. Figure 1 compares four query shapes; Figure 2 distinguishes detach from a later drop. The shared stepper supplies controls/holds, with new scenes and text. `downloads/events.csv` is the one authoritative four-row fixture imported by the scene and read by the native SQL.

## Execution evidence

`evidence/run-native.py` created a private PostgreSQL 18.6 cluster/socket under its owned temporary directory, cleared inherited PG settings, verified its actual data directory and ran the exact SQL from the download directory so the CSV path is real. It stopped the instance and removed its directory. No existing database, production credential, global setting or dependency environment was used.

The run verified four boundary placements; a direct October range using only October; the endpoint and wrapped-date counterexamples scanning all three; generic parameter pruning with two subplans removed; rejected uniqueness omitting the partition key; permitted E2 labels at different timestamps and rejected duplicate composite keys; reference-blocked detach; an unchecked dangling note; parent 3/detached 1 after detach; rejected late September insertion; and restored parent 4 after reattach. Expected errors were caught with their native SQLSTATE classes. The worksheet rolls back temporary objects. See raw output, native environment, exact verifier and source hashes.

The constrained-note expiration is an explicit isolated policy drill. It is not the core shop's policy or proof that all retention work is complete. The lifecycle illustration's final DROP is conceptual; the worksheet verifies detach/reattach and not external archive/erasure.

## Rendered and download checks

Root built the complete integrated source with zero reported site issues. All four pruning options and all five steps were checked: E2/E3 from 1 partition, E3/E4 from 2, E1/E2/E4 from 3, and E2/E3 from 3 for the wrapped expression. All lifecycle states preserve attached/detached counts and distinguish retained storage. Back/Next keyboard actions, Play/Pause, Reset, option resets and text alternative were exercised.

The final immutable 4396 includes the phone line-break fix. Actual1280×720 and 375×812 were inspected in both themes, with no page overflow. Date and time remain separate on phone; excluded events retain legible secondary ink and explicit skip labels. Unchanged control logic was also fully exercised on 4394 before this CSS-only correction. Final 4396 light/dark screenshots and geometry receipts are saved. The actual static hrefs for SQL and CSV returned HTTP 200 and exact authored bytes under bounded checks. Console errors/warnings were absent.

Controls were reset, System/default 1280×720 restored and all owned tabs closed before records. No browser download event/path wait was used.

## Author reread and continuity

Reread the full article, listings, captions, options and states against the references and intended entry knowledge. Time bounds are explicit UTC instants with half-open intervals. The reader sees physical piece selection before uniqueness/reference changes and the retirement protocol. Native checks and conceptual policy stages are clearly distinguished. A partition in a window calculation is not introduced as a physical table partition; this piece consistently uses physical partition terminology.

The request-event relation is separate from orders, bookings and payments; E1–E4 are explanation-owned event labels. No original order identity or line key is silently altered. The order-ID discussion explicitly shows why adding placement time changes uniqueness and references. September's one-row fixture and October's two rows stay consistent through pruning, detach and reattach. Late arrival is distinguished from recording time; the policy interval is illustrative, with no invented business retention rule. No shared-example extension is required.

## Limits

Author finishing does not replace independent review. Four rows prove the routing/pruning mechanisms but no performance benefit. Only local PostgreSQL was executed; no online lock-load test, concurrent detach interruption, archive service, backup erasure, production retention duration, regional topology or capacity result was observed. Locking/concurrent-operation claims are documented, not measured. No assistive-technology session or long autoplay timing benchmark was run. All final source/dependency hashes are in `evidence/source-manifest.json`.
