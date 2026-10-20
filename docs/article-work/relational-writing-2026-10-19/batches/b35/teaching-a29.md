# b35 initial teaching review

## a29 — Changing schemas without breaking applications

**Verdict: REPAIR — one local playback-budget correction.** The prose, mechanism
teaching and family progression are ready to scale; no skill revision or
structural rewrite is needed. Full initial review of the frozen 4438 article,
complete context and player implementation, using the actual a06 parent,
a30 sibling and a31 scope, and the retained full reading of all three fixed
references and their figures. No practitioner report or native execution used.

### Required finding

**P2 — `SchemaFigure.astro`, `schedule()`: count the rendered reading load.**
The scheduler splits `root.textContent` on whitespace. Adjacent HTML and SVG
text nodes join words: for example the diagram contains
`readerlock heldB` and `readerwaitingwaiter`. The actual first queue state has
93 rendered `innerText` words but only 72 scheduled tokens; the representation
state has 98 versus 76, constraint 85 versus 64, and index 100 versus 79.
The 320 ms/token + 1.8 s formula therefore gives the first queue state 24.84 s
for its whole 93-word scene, losing roughly a fifth of the visible reading load.
It also uses 187.5 rather than 180 words/minute before that undercount.

Actual phone playback confirmed the shortened interval: the rename state had
103 rendered words but 81 scheduled tokens (27.72 s). It had already advanced
from Step 4 to Step 5 by 33.4 s; the complete 103-word scene at 180 words/minute
plus the existing 1.8 s pause needs about 36.1 s. Manual Pause remained available
on the final-state hold.

Use rendered text with real node boundaries, including SVG labels, captions,
lane values and narration, with the existing readable whole-figure approach.
Retain the no-maximum behaviour, manual controls and endpoint focus. Parent
notified before any preview change. A narrow timing recheck is sufficient;
unaffected model/native/prose work need not be repeated.

### Prose, progression and mechanism teaching

One amount-column change makes the physical questions consequential: exact
widening, a non-negative rule, interruptions and a consumer whose stored
dependency survives a rename. The opening states what must change before
catalogue/scan/rewrite terminology is introduced. The early operation table is
a useful comparison of exact forms, not a second catalogue curriculum. Its
qualifications belong beside the relevant cost or lock. The worked procedures
then supply concrete commands, postconditions and recovery paths.

The article follows the reference method particularly well when asking readers
to predict C's wait, a new negative write after NOT VALID installation, the
surviving object after runner failure, and the view's pointer after renaming.
The five diagrams change the mechanism itself: blocking edges disappear after
cancellation; historical proof remains separate from enforcement; transaction
boundaries change which first effect survives; incomplete indexes are removed
before successful ownership; the reader pointer moves only after deliberate
replacement. The accompanying lanes and explanations expose each consequential
intermediate state. Controls are useful because the comparison changes those
facts at the same step.

The complete staged type-change procedure earns its length: direct conversion
evidence first, then a replacement only when the measured pause cannot fit;
writer/backfill gates precede validation, indexes, dependency switch and
retirement. a06 still owns application compatibility and authority. a30 owns the
durable data job; a31 owns database moves. Conditional foreign-key/generated-value
checks and deployment restrictions are compact and appropriately scoped.
The measured rewrite, WAL attribution limitation and unperformed production
acceptance are explicit. Native observations are not presented as model timing
or a production interruption promise.

The dense closing acceptance and cleanup passages consolidate demonstrated
states into an operator's record. The table, SQL and prose suffice there;
another model would mostly repeat the figures. No additional local mechanism
or figure quota is needed.

### Actual interaction and responsive checks

- Operated all 10 branches and all 48 states, reading SVG values, state lanes,
  accessible diagram description and narration together. Repaired queue final
  states distinguish continued waiting from cancelled/rolled-back B. Constraint
  repair/leave and validate-again alternatives agree across diagram and text.
- All 20 keyboard endpoint arrivals retained focus on Previous/Next. Reset,
  Play/Pause and final-state replay worked in all five players. Selectors retain
  the causal step; same-Step-3 switching was checked in every player. No scrub,
  End or transcript-disclosure control was offered.
- Checked all 10 final comparisons after dynamic drawing at 390 × 844 in both
  Light and Dark, plus desktop diagrams and lanes. Phone samples were 760–817 px
  tall including the caption, with no page/lane/select horizontal overflow and
  no SVG text outside the view box. Readable labelled lanes preserve the facts
  when the diagram becomes a small overview. Scope selectors and endpoint
  controls remain usable.
- The implementation has no continuous motion or entrance transitions requiring
  a reduced-motion override; staged diagrams and manual navigation supply the
  teaching. OS reduced-motion emulation and screen-reader testing were not run.

### Optional finding

Phone SVG labels scale to approximately 7.7 px. The larger state lanes make the
current comparisons usable, but an expandable overview or a responsive diagram
layout would let readers inspect pointer and boundary labels with less effort.
This is polish; it does not replace the required reading-budget correction.

No downloads or download events were used. Root owns served worksheet bytes and
independent native/runner checks.

Review complete. System theme and normal viewport restored, owned tab closed,
and fixed preview 4438 released after both assigned reviews.
