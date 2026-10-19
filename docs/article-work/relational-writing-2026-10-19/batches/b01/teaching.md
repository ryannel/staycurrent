# B01 independent writing and teaching review

**Verdict: repair a00, a01 and a02.** Their prose and scope are generally strong.
The required changes below concern readable playback, usable comparisons and two
core explanations still left largely to code and mental reconstruction. They do
not prescribe a figure count or a new curriculum.

Read every frozen article in full, its displayed SQL and figure implementation,
and the supplied own/parent/sibling/child scope context. Used the three fixed
examples previously read in full. Operated all five real figures in an independent
Chrome tab on preview 4337: both join choices, all four a00 transaction choices,
both ownership choices through the changes, and all eight pagination choices.
Used playback and stepping, keyboard activation, desktop and 390 × 844 layouts,
and both themes. Restored System theme and the normal viewport. Reduced-motion
emulation is unavailable here; these figures presently use timed state changes
without travelling/fading CSS animations, so the pilot's keyframe defect does not
apply.

## a00 — Relational databases: repair

The shop supplies a coherent orientation. Its first result explains aliases,
matching, grouping, repeated identities and an absent match with the same rows.
Figure 2 makes the request's unfinished view and a new reader's view different,
then exposes partial commits versus rollback. These are real mechanisms, not
token controls. All four failure/success choices showed the stated outcomes.

The later sections retain the shop and teach useful first decisions before
linking to deeper procedures. Prose suffices for this orientation's brief
scan/index comparison, compatibility sequence and replica/backup distinction;
forcing separate interactive treatments here would compete with the contextual
parents. A two-buyer schedule would help but is optional: the short lost-update
paragraph and conditional-change explanation already establish the question the
transaction article must deepen. The reading route honours the supplied tree.

**Required**

1. `a00/RowsFigure.astro:49` and `a00/OrderFigure.astro:48`: replace the fixed
   1.8-second hold with narration-aware pacing. Figure 1 changes from a paragraph
   explaining repeated matches to another explaining grouping before the first
   can be read alongside its table. Figure 2 likewise advances while readers
   compare two views. Preserve manual Next/Back. Recheck Play in both join modes
   and transaction/failure choices; the reference players budget reading time.
2. `RowsFigure.astro:36–37`, `OrderFigure.astro:34–35`: preserve focus when an
   endpoint disables Next/Back. Enter on final Next moved focus to BODY in both
   figures, including all four transaction choices. Apply the pilot's repaired
   behaviour and recheck both ends.

**Optional:** compact the stacked mobile request/reader comparison or keep its
transport in reach; no page-level overflow occurred. The internal h3 labels also
have the separately reported site-check repair in `build.md`.

## a01 — Designing relational data: repair

Requirements precede identifiers and types; cancellation/reactivation, mutable
names, agreement prices and deletion have clear meanings. The owned/copied-name
comparison is effective on desktop: changing storage at the same step shows one
authoritative update against a forgotten copy. The later fee change demonstrates
why an agreed price should differ from today's offer. Its cards are purposeful
state changes even though Play is a sequence of instantaneous updates. Keys,
constraints, normalisation and history stay within their supplied family bounds.

**Required**

1. `a01.astro:63–109`, especially identity/scope and the full schema: make the
   customer–booking–session relationships and composite-key checks visible before
   the DDL wall. The prose currently asks the newcomer to retain row identity,
   the second booking uniqueness rule and both tenant-scoped references across
   several paragraphs, then reconstruct them from about forty SQL lines. A small
   row/reference model can show a valid B11, changing only its booking number
   failing to permit a duplicate customer/session pair, and a cross-tenant target
   failing the complete reference. Highlight the particular key/reference and
   resulting acceptance or rejection. Extend/reuse the existing cards if useful;
   no need for a separate model of every type or constraint. This is a central
   design mechanism, not deeper constraint-specialist material.
2. `FactOwnership.astro:102–111`: keep the facts being compared and transport
   usable together on mobile. At 390 × 844 after Next, controls began near y335,
   B12 near y980 and narration near y1126; the figure was about 1,095px tall.
   Neither conflicting booking name was visible beside the activated controls.
   Compact the comparison and/or retain controls while the changing cards and
   explanation are in view. Recheck copied/owned name correction, fee and
   cancellation without requiring repeated scrolling back to advance.
3. `FactOwnership.astro:82`: budget reading/comparison time rather than cycling
   four card states every 1.8 seconds. The ownership and fee explanations require
   following different cards, not merely reading one changing word.

**Optional:** the value and history sections need no additional interaction quota.
Their small examples and explicit questions establish their local decisions;
specialised representation/history mechanisms belong to their children. Existing
endpoint controls retained keyboard focus; themes were legible and the page did
not overflow at 390px.

## a02 — Working with SQL: repair

The complete disposable fixture, expected rows and progressively stated result
contracts are useful. Missing facts have deliberate meanings, the parent teaches
basic WITH before its children need it, recursion remains optional, and the link
to a14 explicitly warns that its payment relationship differs. Figure 1 correctly
adds order 106's null-extended row. Pagination's eight selections produced the
stated repeat/skip outcomes. The problem is how much inference surrounds those
isolated working controls.

**Required**

1. `a02.astro:129–140` (`checkable-stages`): walk the complete report through a
   visible model of its named intermediate results. The small first WITH is
   gradual, but the next step is a long multi-CTE query with two subtotal inputs,
   outer joins, a correlated presence test, arithmetic and final filtering. A
   newcomer must reconstruct the report's main mechanism from code and inline
   lists. Show order 101's independent 30/15 totals becoming due 15, 102's absent
   payment becoming zero, and 106's absent line total remaining unknown; then
   show settled rows removed by the final filter. Keep source/order identities
   visible and associate each stage with its SQL. A step/change-of-input control
   should expose which intermediate rows and final answer change. This strengthens
   the parent's complete ordinary case without duplicating a14's deeper traps.
2. `SqlFigure.astro:20,42`, paging scene: draw the saved cursor boundary and the
   positions Offset skips, rather than requiring readers to infer both from an
   unmarked strip of IDs and narration. Mark the first page, preserve/reveal 101's
   boundary as 107 arrives or 100 disappears, and identify 102 moving across it.
   Retain recognisable row identities through the change and highlight how the
   second selection follows from the chosen rule. Currently the entire strip is
   replaced and only final answer chips are outlined; the reader must remember
   the old order and reconstruct the operation. This is precisely where a visual
   should save effort. Keep it legible when the strip wraps on a phone.
3. `SqlFigure.astro:46–47`: transfer focus before disabling the active endpoint
   button. Final Next moved keyboard focus to BODY in both scenes. Recheck first
   Back and final Next for both join choices and paging modes.

**Optional:** a fixed 3.5-second hold is less severe than a00/a01 but should adopt
the same narration-aware pacing when repairing the shared component. The short
Boolean/type examples and three-row window result can remain prose/SQL: their
outputs are small and explicit, with specialist mechanisms left to the children.
No page overflow occurred at 390px; current controls and selected rows were
legible in both themes.

## Scaling recommendation

A small writer/reviewer skill nudge is warranted before further broad scaling:
ask which central stretches still make the newcomer mentally execute or
reconstruct a mechanism, and make those transformations visible where doing so
reduces effort. Check the complete teaching path, not only the presence and
correctness of existing controls. Require readable playback and a phone-sized
comparison with controls in reach. This batch repeats both a fixed rapid timer
and the pilot's endpoint-focus defect, while a01's composite relationships and
a02's central report remain largely code/prose despite being the work their
readers came to understand. These are specific grounds for the nudge, not a rule
that every section needs a figure or that all state changes require decorative
motion. Preserve the good prose and repair the concrete explanations above.
