# a13 source and execution record

Checked 20 October 2026 (Europe/Stockholm; native output timestamps are 19 October UTC).

## Family and teaching inputs

Read the complete three fixed reference articles, including their figure explanations; inspected the rendered figure content on the reference dev server at port 4337. Read actual SQL parent a02 and the scope/fixture of actual join sibling a14. Read actual a09's numeric/text/time/missing-value boundaries and a10's enforcement/default boundaries. Preserve the parent's order-settlement fixture: a14's payments belong to customers and cannot silently replace it.

Adaptation: the plan's booking/charge report becomes a snapshot of a02's five open January order candidates, extending it with a proposed packing fee and preferred display label. Existing order totals, paid values, identities and placement timestamps match the parent. The snapshot eliminates a second join/aggregate walkthrough. Fees are proposed numeric allocations, with a per-order final cent-rounding contract; they are not a new storage recommendation. Separate 201–205 event IDs are explicit spring/autumn boundary fixtures.

## Primary sources and consequential claims

All are PostgreSQL **18** documentation, checked directly through the web tool. Native observations below independently establish worked outcomes.

- https://www.postgresql.org/docs/18/functions-comparison.html — ordinary comparisons with null, null-safe equality/distinctness and Boolean tests.
- https://www.postgresql.org/docs/18/functions-logical.html — complete three-valued AND/OR/NOT tables; no left-to-right evaluation guarantee.
- https://www.postgresql.org/docs/18/functions-conditional.html — searched/simple CASE, COALESCE, NULLIF, common types, usual lazy evaluation and its caveats.
- https://www.postgresql.org/docs/18/typeconv-union-case.html — common CASE/COALESCE result types.
- https://www.postgresql.org/docs/18/sql-expressions.html#SYNTAX-EXPRESS-EVAL — planner constant folding, unsafe Boolean guard ordering and aggregate-before-outer-CASE limitation.
- https://www.postgresql.org/docs/18/functions-math.html — integer division towards zero, numeric round/trunc; host-dependent floating arithmetic boundaries.
- https://www.postgresql.org/docs/18/datatype-numeric.html — exact/approximate arithmetic, range, numeric ties away from zero.
- https://www.postgresql.org/docs/18/typeconv-oper.html — undetermined literal inferred from operator context versus an already typed text value.
- https://www.postgresql.org/docs/18/collation.html — C byte comparison/order, nondeterministic ICU collation and explicit case/accent policy; provider/version dependence.
- https://www.postgresql.org/docs/18/datatype-character.html — text trailing spaces versus char padding.
- https://www.postgresql.org/docs/18/functions-matching.html — LIKE whole-string matching, percent/underscore semantics, explicit escape character, ILIKE caveats. Article keeps pattern examples in C and does not need ILIKE or a portability promise.
- https://www.postgresql.org/docs/18/datatype-datetime.html — DateStyle ambiguity, unambiguous typed dates, timestamp ignoring offset, timestamptz/zone distinctions.
- https://www.postgresql.org/docs/18/functions-datetime.html — both AT TIME ZONE directions, local-day versus elapsed-hour arithmetic, month clamping, date_add named zone and transaction/statement/wall reference clocks.
- https://www.postgresql.org/docs/18/datetime-invalid-input.html — before-forward-jump and after-backward-jump offset selection for nonexistent/ambiguous local readings.
- https://www.postgresql.org/docs/18/functions-info.html#FUNCTIONS-INFO-VALIDITY — pg_input_is_valid syntax checking and input-function support caveat.

No other engine was measured or required: the consequential behaviours and repairs are explicitly PostgreSQL. No exhaustive dialect comparisons or specialist calendar branch are introduced.

## Native run

Own fresh database: `rel3_a13_run1` on supplied shared disposable loopback server, port 57319. Binary: `/opt/homebrew/Cellar/postgresql@18/18.6_1/bin/psql`. PostgreSQL 18.6 Homebrew, server_version_num 180006, aarch64 macOS. No shared server settings were changed. Database locale provider libc (`c`), datcollate C, datctype C, UTF8. Baseline session UTC, ISO/DMY, standard_conforming_strings on. Examples explicitly switch DateStyle to MDY or TimeZone to Europe/London, then restore.

Optional database-local collation `report_search`: ICU (`i`), locale `und-u-ks-level1`, nondeterministic (`false`), observed collversion **153.136**. It exists only in this exercise database. Date/zone rule evidence retains exact resolved UTC bounds rather than claiming a portable tzdata version; PostgreSQL's bundled/installed time-zone rule package version was not inferred.

`verify.sql` is the complete recorded SQL with queries and expected-error probes; `native-results.txt` is the unabridged output. `assert.sql` reruns the snapshot and compares final rows/multiplicities in both directions using handwritten expected values, asserts ordered IDs and numeric boundaries, and runs all text model identity selections. `assert-results.txt` records successful native assertions. Run verify.sql before assert.sql in the same fresh database because assert.sql's optional text selection uses the collation created by verify.sql. Each uses a fresh session and recreates temporary tables.

Six deliberate errors in verify.sql are **expected**: integer product overflow twice (plain and late cast), invalid numeric input, missing text=integer operator, unused constant 1/0 CASE arm, incompatible numeric/text CASE branch. The run proceeds in psql autocommit to retain each. No unexpected errors remain. The successful assertion run uses ON_ERROR_STOP.

Predicted final amounts by ID: 100=0.00, 101=16.01, 102=20.00, 103=-2.00, 106=NULL; selected ordered rows `(101,Mina,charged,16.01)`, `(102,Mina,waived,20.00)`, `(106,Edda_100%,undecided,NULL)`. Native output agrees, with numeric type. Null-predicate, default, integer/decimal division, zero denominator, ±1.005 rounding, rounding-placement, approximate equality and pre-multiplication widening results agree with the article.

Spring London day: [2026-03-29 00:00Z, 2026-03-29 23:00Z), event IDs 202 and 203. Fixed 24-hour route incorrectly also includes 204 and 205. Autumn day: [2026-10-24 23:00Z, 2026-10-26 00:00Z), event IDs 202,203,205; fixed 24-hour route misses 203,205. Exact upper endpoints are excluded. London nonexistent spring 01:30 resolves to 01:30Z/display 02:30; autumn repeated 01:30 resolves to later 01:30Z; explicit +01 occurrence is 00:30Z. Calendar noon+1 day is 23/25 elapsed hours at transitions; +24 hours displays 13:00/11:00. Jan31+1month is Feb28. Transaction time stays fixed across two statements while statement time advances. These are observed values, not execution or performance measurements.

Cleanup: psql sessions closed after each script; own database dropped at handoff, removing its collation. Shared verification server left running and unchanged.

## Models and compile

Six figures, 17 parameter choices, 51 frames. `model.test.mjs` checks hand-written truth tables, selection identities, invented-default distinction, arithmetic outputs, spring/autumn inclusions, local/elapsed outcomes, HTML escaping and every frame's rendering/reading-time computation. These models replay calculations, not arbitrary SQL or a physical evaluator. `model-results.txt` records the pass. Hold time counts the labels, columns, all visible panel cells and narration at 200 words/minute plus 2.2 seconds for inspection; no automatic playback.

Astro compiler 2.13.1 transforms the staged article and ValueFigure with no diagnostics; esbuild parses the component's browser TypeScript. `compile-results.txt` records this. `format-results.txt` records whitespace, preserved anchors and import checks. Full build and central browser proof are orchestrator-owned and were not run by the writer.
