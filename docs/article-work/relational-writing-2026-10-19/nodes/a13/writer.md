# a13 writer handoff

Ready for orchestrator-managed browser proof and batched review. No shared files, final article source, Git index, commits or build output changed by this worker.

## Deliverables

- Staged `article.astro`: complete nine-section draft, retaining every supplied anchor.
- `src/components/relational-next/a13/ValueFigure.astro`: six instances of a responsive, native Astro interactive comparison.
- `queries.mjs`: complete isolated snapshot and worked SQL.
- `model.mjs` and `model.test.mjs`: six logical comparison models and regression checks.
- `sources.md`, native SQL/output, assertion SQL/output, compile/model/format results beside the draft.

The parent's orders/lines/payments fixture continues here as its five checked candidate rows, with proposed packing fee and display-label inputs added. The report returns 101,102,106 at 16.01,20.00,NULL; 100 zero and 103 negative remain regression exclusions. Scope follows parent/a09/a10/a14/a15: no repeated joins, aggregates, membership walkthroughs, storage choice, enforcement, driver conversion or plan diagnosis. No tree changes proposed.

## Figures to prove centrally

1. Fee policy: at final step compare positive [101], negated [100,102,103], positive-or-undecided [101,106], distinct-from-zero [101,103,106]. Predicate value remains separate from retention.
2. Defaults: 106 preserves NULL versus invented zero; 102 gives 20 through both routes, exposing why an ordinary row misses the bug.
3. Arithmetic: late/early casting, per-line/per-order rounding, late/early widening. Inputs, intermediate operations and results stay visible together.
4. Text: exact José gives A; configured case/accent search gives A,B; raw 100% pattern gives C,D; escaped literal gives C.
5. Local day: spring returns events202,203, fixed24h wrongly includes204,205; autumn returns202,203,205, fixed24h misses203,205. Exact endpoints tested.
6. Calendar: spring next-noon23h versus timeout24h/13:00; autumn next-noon25h versus timeout24h/11:00.

Controls: native select, Play/Pause, Back, Next, Reset, labelled three-position range. Back/Next use aria-disabled plus guarded clamping, remaining focusable at endpoints. Changing parameter preserves the current step for direct comparison and pauses playback. No autoplay. Final result is server-rendered for no-JS reading; client starts at inputs. Hidden/offscreen playback pauses. All visible panel labels/cells/results and narration count towards playback dwell, plus inspection time. Stages use list items, never figure headings. Mobile comparisons stack within div panels, avoiding inherited article-section margins; tables have labelled, focusable overflow regions. Please inspect at phone width and in both themes and test keyboard endpoints, select changes, slider, Play/Pause and reset. No screenshots claimed by this worker.

## Verification

Native PostgreSQL18.6 in own fresh rel3_a13_run1: worked outputs recorded, all six intentional errors understood, successful fail-fast assertions compare report values/multiplicities/order and boundaries. C/UTF8, UTC, DMY baseline; ICU report_search153.136, explicit MDY and London session changes documented. Primary PostgreSQL18 documentation checked directly. Own database dropped; shared cluster unchanged.

Model checks pass across51 frames and all17 choices, including complete three-valued truth tables and hand-written SQL-matching selections. Both Astro files compile with zero diagnostics; browser TypeScript parses. Whitespace/anchor/import checks pass. Root owns full build, promotion, browser proof and reviews.

Known limits: explanations use a deliberately small snapshot; figures do not execute SQL or measure plans. Optional ICU SQL needs ICU support. Zone rules are those of the recorded server; the source record preserves resolved bounds without inventing a tzdata version. No unperformed concurrency, cross-engine or performance claim.

Root delivery preflight removed trailing psql alignment spaces and extra blank lines at EOF from native/assert transcripts before review. Observed values and assertions are unchanged.
