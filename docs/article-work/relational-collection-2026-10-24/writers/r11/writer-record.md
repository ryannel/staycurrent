# r11 — Query execution and bad plans

Fresh complete article, finished 24 October 2026. Body: `src/articles/relational-collection/r11.astro`; supporting source: `src/components/relational-collection/r11/`; shell proposal: `metadata.json`. This writer made no infrastructure, public, commit or push change.

## Development and references

Applied the supplied write, figures and continuity skills. The identical complete reference bundle was calibrated once for this coherent three-piece assignment in r10: all 19 individually delivered parts with END markers and all 34 rendered drawings with their explanations. Root acknowledged delivery before design. This article then had its own development and reread. No previous article version or feedback was supplied or read. The supplied join and aggregate/window drafts establish grain and ordering; this assignment's new r10 supplies access-path understanding.

The article moves from a receipt's row-flow tree to estimates/measurement, repeated join work, the first wrong estimate, parameter skew, spills, machine boundaries and a testable causal diagnosis. Figure 1 leaves algorithm choice open; Figure 2 changes one matching algorithm while retaining the same two receipt lines. The shared stepper provides controls and readable holds. Scenes and prose are newly authored.

## Native evidence

The exact `downloads/query-work.sql` ran through the owned runner in `evidence/run-native.py` on PostgreSQL 18.6. It creates a private cluster/socket, clears inherited PG settings and verifies its data directory before changing data. It stops and removes its owned instance afterwards. No external connection or package installation occurred.

The generated tenant fixture deliberately contains 99,000 paid shop-10 rows and 1,000 pending shop-20 rows, plus three generated lines per generated order. It is independent of the shop's core history. All generation is deterministic; no random seed is required. `ANALYZE` itself samples, so estimates can vary on a repeat. Observed separate-column estimate 9 and joint-MCV estimate 980 both faced actual 1,000. The text does not claim a route flip or faster query from the improved estimate. The generic-plan comparison is explicitly forced and does not establish that automatic mode chooses it or that it is slow. The raw native join happens to choose a hash join; the illustrative nested loops are not presented as that captured run.

The same 100,000-row sort showed external merge using 9,344 kB disk at 64 kB and quicksort using 13,229 kB memory at 32 MB. No server-wide tuning recommendation is inferred. Parallel gathering is session-disabled for readability; plan mode and sort memory are reset by the worksheet. Temporary tables disappear when the connection closes. Raw plans and actual local run elapsed time are retained, without claiming production performance.

## Rendered checks

Root's integrated build/site check passed with zero reported issues. Final author QA uses immutable 4394. All scan-loop, indexed-loop and hash steps were followed; all returned Blue mug for line 1 and Green tea, 50g for line 2. Counts were six row comparisons, two index searches, or three build rows and two probes. Controls, option resets, text alternative, keyboard Back/Next, Play/Pause and Reset were exercised. Flow and join graphics were inspected at actual 1280×720 and 375×812 in light and dark; full page geometry showed no horizontal overflow. The final excerpt reads an actual scan line before comparing its changed estimate. Screenshot, state and geometry receipts are in evidence.

The actual rendered SQL-download href was checked by bounded HTTP: 200 and exact source bytes. All owned browser tabs closed after resetting controls and restoring System/default 1280×720. Console warnings/errors were absent in the inspected tabs. Palette contrast calculations use the final resolved site tokens.

## Complete author reread and continuity

Reread prose, SQL, captions, controls and native excerpt from the reader's entry knowledge and against the fixed references. The flow keeps result grain as one row per order 103 line; aggregate output count is distinguished from input work. A measured native plan is separated from the conceptual mechanisms. Parent/child timings and buffers are not summed; repeated-row averages and cumulative buffer counts are distinguished. Statistics, estimates, generic-plan uncertainty and spill memory are explained before diagnostic choices depend on them.

Core products and order 103 lines are imported from `core.json`. Their identities, quantities and names are unchanged. No new payment, amount, stock outcome or order total is invented. The fixture's tenant key is a shop ID, not a customer ID; comparisons carry shop and order identity. Full native PostgreSQL/CockroachDB plan operation and incident triage remain linked boundaries. No shared-example extension is required.

## Actual limits

This is author finishing, not independent review. Only local PostgreSQL was executed; distributed work is documented mechanism, with no network, region or multi-node measurement. The documentation fetch for CockroachDB's vectorized page encountered a tool redirect/access error; official EXPLAIN ANALYZE documentation and official engineering material/2020 systems-paper results supplied the conceptual cross-check. No current CockroachDB implementation/performance claim is inferred from older material. No production workload, cache-controlled latency benchmark, assistive-technology session or long autoplay timing test was run. Source and shared dependency hashes are recorded separately.
