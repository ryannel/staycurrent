# a15 — writer handoff

Draft: `article.astro`. Components: `src/components/relational-next/a15/`.
Return for orchestrator-managed independent batch reviews and central browser
proof; no nested reviews, final article promotion, build, staging or commits by
this worker.

## Scope and teaching

Extends the actual a02 completed order follow-up report and existence test. Keeps
receipts attached to orders, preserving the parent answer 101 → 15/true,
102 → 20/false, 106 → NULL/false. Does not import a14's different customer-receipt
fixture or reteach CTE notation. Includes all assigned stable anchors.

Five interactive logical figures make the central mechanisms inspectable:

1. Scalar cardinality: one receipt, none, multiple, and one nullable scalar row.
2. Correlation: distinct outer orders, lost outer predicate, raw-join row change.
3. Membership: four predicates before WHERE; repeated/null/empty blocked input;
   separately chosen null-safe EXISTS policy.
4. Set operations: unequal copy counts, null duplicate class, all six operators.
5. Optional recursion: anchor/rounds/final path order, cycle guard, visible depth
   truncation, missing root and leaf. Explicitly separate from engine traces.

The normal view reuses the complete checked parent composition; stable column
meaning, current receipts, fixed January 2026 placement period and caller order
are explicit. View deployment/security, cost/materialisation, expression semantics,
join repairs and window latest-row mechanics remain with their owners. No tree
changes proposed.

The three fixed reference articles supplied the connected prose, predict/change/
observe teaching rhythm, explicit models-versus-observations distinction and
figure/player conventions. Models carry row/result changes, rather than controls
that merely reveal prose.

## Verification completed

- Native PostgreSQL 18.6: passed the complete verifier. Assertions cover scalar
  zero/one/multiple/null, correlation and wrong alternatives, membership with
  nullable outer/inner keys and an empty inner input, null-safe equality, unequal
  repeated set rows and all six operators, customer-set business example, view
  rows/types and transaction-local change/rollback, normal/bounded/cyclic/missing/
  leaf hierarchy, and changing-depth UNION negative case.
- Retained statement/stdout/stderr/status evidence: `verification.sql` and
  `native-results.json`. Deliberate scalar failure safely caught in PL/pgSQL and
  its expected SQLSTATE 21000 retained. No unbounded recursive query executed.
- Model shape checks cover every selectable option and every frame, in addition
  to native expected-output comparisons. Five central models are distinct from
  observed execution.
- Both Astro files transformed by the installed `@astrojs/compiler` with zero
  diagnostics. No shared build was run. JavaScript syntax checks passed.
- Stable internal anchors checked against context; no heading elements inside
  figures. Imports resolve at the designated final article path.
- Figure timing counts all rendered panels, headers, cells, code and narration,
  plus inspection time. Playback is user initiated; Back/Next remain focusable
  at endpoints; scrubber, pause, reset and selectable input changes are available.
  Reduced motion removes table fades. Panels use divs with explicit phone grid
  spacing, avoiding inherited article-section margins. All non-background colours
  use theme variables. Static fallback renders the final default answer.
- No own browser proof: orchestrator requested release for central browser review.
  Check 390px phone truth-table/path readability, controls at both endpoints,
  narrowest option labels, playback pacing and both themes before promotion.

## Delivery state

Ready for the root to copy the staged fragment once and run full build/site checks,
central browser proof and independent review. Worker has not modified shared files
or the Git index. Own disposable database cleanup is recorded below.

Cleanup complete: dropped only `rel3_a15_run1` after retaining the final passing
run. Shared server and other article databases were unchanged. Final checks found
zero Astro diagnostics, all assigned anchors present, all final-path imports
resolved, all selectable frame shapes valid, and no trailing whitespace across
all own files. Final self-audit labelled figure snippets as fragments and kept a
null candidate cell distinct from an unknown Boolean cell.

Root integration fixed the view-deployment link from the nonexistent evolution route to the registry’s live-changes route before independent review. Prose, queries and figures are otherwise unchanged.
