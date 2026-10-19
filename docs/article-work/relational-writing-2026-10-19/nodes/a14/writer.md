# a14 writer handoff

Status: finished teaching draft for orchestrator-managed independent article
review. No nested reviewers, commits, shared-file edits or publication changes.

## Owned files

- `src/articles/relational-next/a14.astro`
- `src/components/relational-next/a14/JoinFigure.astro`
- `src/components/relational-next/a14/models.mjs`
- `src/components/relational-next/a14/queries.mjs`
- `src/components/relational-next/a14/verify.mjs`
- This report and `sources.md`.

## Teaching choices

Read the writing commission and the three fixed reference articles in full;
inspected the reference figures and their step narratives in the live preview.
The article follows one five-customer fixture through all seven assigned
sections. It establishes the report contract and three hand-derived rows before
the first query. A short separate self-join illustrates independent aliases;
the other examples stay with the customer/order/line/payment data.

Three native Astro/JavaScript figures do specific explanatory work:

1. Emit customer/order pairs in a visible matrix. Changing the predicate from
   matching IDs to no relationship changes the answer from 4 to 20 rows.
2. Step through ON matching, null extension and WHERE filtering. Moving the same
   period test removes the no-activity and out-of-period customers for different
   reasons.
3. Highlight source order and payment rows as each pair contributes to running
   sums. The wrong 100/60 totals contrast with staged 50/30 subtotals and one
   final customer row.

Each supports Play/Pause, Back, Next and Reset; mode changes reset the model.
Narration is live text, source identities remain visible, selected controls have
aria-pressed, and static complete results render without JavaScript. Colour
uses shared theme tokens and labels/keys carry the meanings. The only motion
is a brief arrival highlight; reduced-motion preferences remove it. These are
logical models, explicitly labelled, not disguised database runs.

Null completeness is intentional: an unvalued line makes its order, then the
customer's complete order value, unknown. No activity becomes zero. The final
join tests a non-null subtotal key to distinguish them. Conditional aggregate
completeness is developed separately, without turning the main report into a
larger accounting exercise. No subtotal-row feature catalogue was added.

## Scope and links

- Entrance assumes parent's first join and grouped query and links precisely to
  a02 `/review/relational-next/sql/#checkable-stages`, reserved by orchestrator.
- a13 owns expression, null and arithmetic detail.
- a15 owns EXISTS/membership details and wider composition.
- a16 owns calculations retaining detail rows.
- a05 owns physical join execution and cost diagnosis.
- No extra branch or curriculum change proposed.

## Section anchor map

H2:

- `#row-contract` — State what one result row represents
- `#matches` — Follow the matches a join produces
- `#unmatched` — Preserve unmatched rows deliberately
- `#grouping` — Group at the level the question asks for
- `#counts` — Make counts, missing values and conditional totals agree
- `#independent-totals` — Combine independent totals without multiplying them
- `#proof` — Prove the report against awkward data
- `#sources` — Sources and further reading

H3:

- `#incomplete-key` — Use the whole relationship
- `#self-join` — Give each role its own alias
- `#empty-input` — No rows, or a row with no details?
- `#conditional-totals` — Put the condition inside the aggregate

## Verification

- `node src/components/relational-next/a14/verify.mjs`: all assertions pass in
  PGlite 0.5.8 / PostgreSQL 18.3.
- The same script with `--native`: all assertions pass in native PostgreSQL
  18.6, in a separately created and dropped a14 database. No SQL result or
  performance claim is inferred from another article's run.
- `pnpm build`: passes all 13 site-check rules after removing heading tags from
  inside a figure. Existing PGlite bundling warnings remain unrelated to the
  pilot.
- Live browser at
  `http://127.0.0.1:4337/review/relational-next/joins-and-aggregation/`: checked
  all three figures, both modes, final counters and reset/step controls.
  Inspected fanout source highlights and separate-total layout in both dark and
  light themes. Play changes to Pause; step state advances under playback.
- Initial desktop checks were followed by post-review Chrome checks at 390 × 844.
  See the repair record below for the scroll and keyboard endpoint evidence.

No correctness or scope blocker remains. Please review teaching effectiveness
and the assembled reading context independently; build success does not assess
either.

## P00 repairs, 19 October 2026

Applied all required findings from the independent practitioner and teaching
reviews, plus the practitioner's small accuracy/check suggestions:

- **a14-P1:** the employee fixture is now declared once as an employees CTE and
  referenced as both e and m. The existing self-join result assertion passes in
  both PostgreSQL runtimes.
- **a14-P2:** grouping prose now says an added column can split a group when its
  values vary within it; it explicitly contrasts the dependent name with status.
- **Narrow matrix:** each render restores the prior horizontal scroll position,
  then brings the active pair into view using its actual bounds. Reset starts at
  the left. At 390 × 844, stepping to Sol/order 105 gives scrollLeft 123 with
  current-cell bounds 263.625–363.094 inside scroller bounds 26.594–363.406.
  The active fourth-column pair is fully visible. A subsequent full Play run at
  the same viewport ended at 5 / 5, Play restored, current pair 5 + 105 visible,
  and scrollLeft 123; playback also reveals the final column.
- **Keyboard endpoints:** before disabling a focused final Next, focus moves to
  Back; before disabling a focused initial Back, it moves to Next. Actual Enter
  activation at both endpoints was checked in all six modes. All six final
  endpoints reported focus on back; all six initial endpoints reported next.
- **Reduced motion:** the media override now disables both transition and
  animation, including ja-arrive. This is source-verified; the available browser
  capability has viewport control but no reduced-motion emulation, so no
  emulated observation is claimed.
- **Negative check accuracy:** the wrong report is now compared against expected
  values using the same ID/value projection, removing the column-shape mismatch.
  Article wording correctly says that ON/WHERE pair comparison exposed dropped
  customers rather than claiming a mutated five-column final-report comparison.

Both verifier modes were rerun after these repairs and all assertions passed:
PGlite 0.5.8 / PostgreSQL 18.3 and native PostgreSQL 18.6. The main report answers
remain unchanged. No shared files or skills were changed.
