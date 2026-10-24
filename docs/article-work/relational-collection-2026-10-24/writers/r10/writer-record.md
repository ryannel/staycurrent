# r10 — Indexes and access paths

Fresh complete article, finished 24 October 2026. Body: `src/articles/relational-collection/r10.astro`; supporting source and runnable SQL: `src/components/relational-collection/r10/`; shell proposal: `metadata.json`. No shared infrastructure, public output, commit or push was changed by this writer.

## Reference exposure and development

Used the supplied current write, figures and continuity skills. The common three-article assignment calibrated once, in this workspace: six sequences parts, seven indexes parts and six storage parts, each a separate delivery with its END marker. All 34 rendered reference drawings were inspected with their explanations on the supplied 4350 pages. Root acknowledged that delivery before design. See `evidence/reference-calibration.json`. No old version, feedback, unrelated draft, history or original-repository file beyond the operational assignment was read.

The article develops another ordering of the same rows, the jump-and-walk of a B-tree, key order derived from a query, selectivity and access routes, a measured saving, covering, alternative entry predicates and write cost. The reference method informed concrete rows, changing one cause at a time and reading the result after a figure. It is an independent structure for this brief. The shared stepper supplies timing/controls; all scenes and explanations are new.

## Evidence and checks

`evidence/run-native.py` creates a private PostgreSQL cluster under an owned `/private/tmp/sc-r10-native-*` directory, clears inherited PG settings, listens only on its private Unix socket, verifies `SHOW data_directory` against the directory it created, then runs the exact download. It stops the instance and removes the directory in its finalisation path. The initial attempt used the login name rather than the process owner and failed to connect; it cleaned up. The corrected runner uses the actual process owner. The final run passed with PostgreSQL 18.6. No existing server, credential or machine-wide setting was used.

The deterministic fixture is separate from shop history: 60,000 rows, 1,000 anonymous customer IDs, one row per minute from 1 January 2026 UTC and an 80-character payload. Exact generation and all settings are in the download. Each route asserts the same ten result rows. Measured buffer accesses were 984, 62, 13 and 4; the final covering scan had zero heap fetches. Timings in raw output are observations on this local run, not benchmarks. The text reports work counts only.

Root built the integrated source and reported zero site-check issues. Final author QA used immutable 4394: all four entry steps, all steps of all three key options, the correct answer 105 then 103 in every option, Back/Next by keyboard, Play/Pause, Reset and the text disclosure. The entry sort now changes DOM order too; generated key rows receive styles explicitly. Full article checked at actual 1280×720 and 375×812 in both themes, without page overflow. The actual static download href was read from the page; bounded HTTP returned 200 and exact final SQL bytes. See state, geometry, download, palette and screenshot receipts in `evidence/`.

System theme and default 1280×720 were restored, controls reset and owned tabs closed. Native instances and temporary data were removed. No dependency environment was installed.

## Author reread and continuity

Reread the complete prose, listings, captions and controls against the fixed references and intended starting knowledge. The explanation introduces pages, heap, entry, B-tree, range, key order, selectivity and covering before using them to make decisions. The small drawing is explicitly not a measured page layout. The native fixture is introduced before its measurements and never supplies an authoritative order total.

Core orders 101–103 and customer identities come from `core.json`. The later 105/106 headers preserve the authorised instant, customer and pending status, with no invented lines, payments or stock effects. Both are outside the core still-due report. No core fact or shared extension is required. Result ordering retains the ID tie-breaker. The final figure dates use British display forms. Links leave full-plan interpretation, native methods and live construction to their owning articles.

## Limits

Author checks are not independent review. Only PostgreSQL was executed. InnoDB's locator comparison is documented, not measured. B-tree/entry drawings are bounded illustrations, not a planner simulator. Buffer accesses are not physical I/O counts or production latency. No concurrent index deployment, production workload or maintenance benchmark was attempted. Browser controls were exercised; no assistive-technology session or long autoplay timing benchmark was run. Source/dependency hashes are in `evidence/source-manifest.json`.
