# a12 — writer handoff

Status: ready for orchestrator-managed independent review and browser review.
No final source route, shared files, Git index, commits or full build were changed.

## Draft

- `article.astro`: staged Astro fragment. Imports target its final location at
  `src/articles/relational-next/a12.astro`. All 13 planned heading anchors retained;
  sources adds `sources`.
- Owned components: `src/components/relational-next/a12/HistoryFigure.astro`,
  `model.mjs`, `rates.sql`, `assertions.sql`, `verify.sql`, `verify-model.mjs`.
- Evidence: `sources.md`, `native-results.txt`, `model-results.txt`,
  `compile-results.txt`, `format-results.txt`.

Read the three fixed reference articles, including their figure content and
player components. Applied their concrete case progression: make the cause
visible, name the result and explain the design consequence beside the figure.
Read a01's actual current-facts/agreement boundary and the supplied actual
a09/a10/a11 introductions and relevant representation/enforcement/dependency
contracts. The original target remains expert relational practice.

## Scope and teaching

The parent already teaches why B11's agreed €20 differs from today's offer. This
article extends that with the agreement's address and capture boundary, then owns
committed change meaning/order, applicability periods, entity/version references,
late corrections and leaving the active set. Types, constraint mechanisms,
concurrency protocols, live conversion and removal/restore procedures link to
their owning articles. No children or tree changes proposed.

Five interactive figures cover the principal mechanisms throughout the article:

1. Change C7's profile; compare a captured agreement address with a live join.
2. Reject an attempted cancellation; record a successful cancellation then
   reactivation; compare requests, resulting-state records and current status.
3. Hold the date at 10 November; compare adjacent, overlapping and gapped periods.
4. Keep effective date 11 November; choose the account known before or after the
   12 November correction.
5. Follow a retained booking and membership code through inactivity, a minimal
   identity, archived profile payload and rejected referenced-row deletion.

The fifth figure explicitly assumes lifecycle-specific schemas for tombstone and
archive alternatives. Archive retains C7's stable referenced identity and moves
profile payload. It does not pretend moving a referenced parent under a01's
RESTRICT foreign key would work.

Manual steps are the default. Controls are native buttons and a labelled range;
Back/Next remain focusable at endpoints with `aria-disabled`, and switching a
choice preserves the comparison step. Playback has no autoplay, stops offscreen
or when the document hides, and uses discrete changes with no motion animation.
It counts all visible board labels, card values, result, narration, selected
choice and caption at 180 words/minute plus 2.5 seconds to inspect relationships.
The final frame receives its own full hold. A complete text transcript is
available without scripts. Phone cards stack with compact typography; no section
elements or figure headings inherit article section spacing.

## Verification

- Native PostgreSQL 18.6: passed in a fresh article-owned database. Settings and
  all results retained in `native-results.txt`; important limits and exact failure
  states recorded in `sources.md`.
- Deterministic model: all 56 choice/step states and causal assertions passed.
- Astro transforms for fragment and figure: zero diagnostics. Browser TypeScript
  transformation passed. Results retained in `compile-results.txt`.
- Anchor, import, HTML structure and whitespace preflight: `format-results.txt`.
- No shared `pnpm build`, preview replacement or browser-review slot taken.

Central review should inspect phone/dark layouts, focus at endpoints, each
same-step alternative and the play/pause/end hold, then run the shared build
after promotion. This handoff does not claim browser-render verification.

Cleanup: article databases `rel3_a12_run1` and `rel3_a12_run2` removed after the
successful output was retained. The shared cluster and its configuration remain
untouched.

## Root selected-account repair, 20 October 2026

At Figure 4’s final query step the effective-time card now displays the selected recorded account: the earlier assertion keeps €20 from 1 November onwards; the replacement shows the 10 November boundary and €22. The recorded card names the chosen cutoff and assertion. Results, SQL, native observations, prose and player are unchanged. Added expected-state assertions for both displayed accounts so the old answer cannot be paired with only the replacement periods.
