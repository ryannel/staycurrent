# First review: eight core relational articles

Reviewed 30 October 2026 against the user's optional-diagram requirement. This
independent editorial/teaching pass read the complete numbered Astro sources of
all eight named articles, including their figure-wrapper boundaries, in-source
labels/captions, SQL call sites, tables and sources. Text inside `<Figure>`,
`<figure>` or other illustration components is considered removable with that
illustration; it is not counted as body explanation. Ordinary SQL examples and
reference tables remain article content. Imported model outputs were not played
in a browser. This review establishes prose problems and coverage, not current
animation operation or a new technical audit. No article or skill was edited.
Locations below refer to the pre-repair source read during this pass.

## Judgement

The user's concern is supported, but unevenly. Data modelling and normalisation
have worked examples whose essential input relations or intermediate steps live
only in the diagrams. Values has several central numerical/time explanations
inside removable components. Query results and much of hierarchies, constraints
and the introduction already explain their mechanisms independently, but their
prose repeatedly asks the reader to watch or change a figure. Repairs should
retain complete arguments, supply genuinely missing premises and remove the
frame-led transitions. They should not expand every animation frame into text.

## relational-introduction.astro — complete read; framing repair

- **Medium, lines 12, 37, 54, 67, 87–90, 98–100 and 116–118:** “Start at order
  103 in the drawing”, “Watch each match”, “choose the failure”, “Compare the
  routes”, and “Switch the drawing” make the teaching sequence depend on
  illustration operation. The paragraphs after those figures do explain the
  customer reference, join multiplicity, purchase/stock outcomes, planner choice,
  crash ambiguity and distributed coordination. Connect the same argument in
  subject prose, with the example order/event sequence stated directly.
- **Medium, lines 54–57:** the failure branch is currently requested from the
  purchase animation, while body text states the successful final state. State
  what a failure after one stock change rolls back, so the worked all-or-nothing
  example is as explicit as the successful one without interacting.
- No article-wide missing argument is established. Preserve the concise
  definitions, stock guard/Read Committed caveat, source authority and distinction
  between commit durability and the application receiving its reply.

## data-modelling.astro — complete read; substantive local rewrites

- **Medium, lines 62–67:** “three actual offers” and “Watch the combination
  S1 / P7 / South” omit the actual triples. Without the figure, the reader cannot
  verify how all three pairs are real while the reconstructed offer is invented.
  State the three original supplier/product/location offers, identify the pair
  supplied by each and show the spurious join result before deriving why the
  complete triple must stay together.
- **Medium, lines 76–99:** the flattened relation is named but its two repeated
  current-name rows and partial correction are only in the figure. “The name
  disagreement” then evaluates an unstated outcome. State the repeated
  determinant/name facts and how changing one row alone creates disagreement.
  The existing insertion/deletion examples and dependency table are useful.
- **Medium, lines 139–148:** the unsafe timestamp decomposition lacks the
  original order/date associations and the exact two projection schemas. State
  them so joining on customer 1 visibly makes four associations instead of the
  two originals; contrast retaining order_id. Keep the separate
  dependency-preservation example and its distinction from losslessness.
- **Low, lines 36, 64, 76, 108, 139, 162, 170 and 257:** control prompts and
  figure-number references still make the model discussion a tour of diagrams.
  Replace them with ordinary subject transitions after restoring missing facts.
- The independent multivalued memberships, current versus agreed price, stored
  total/discount distinction and subtype/recursive/JSON alternatives mostly
  stand alone. Preserve the user's pre-existing discount explanation and its
  separation of a new authoritative fact from a calculated amount due.

## normalisation.astro — complete read; substantive worked-method repair

- **Medium, lines 36–39:** the closure procedure and FD table are complete, but
  the example's actual steps are handed to Figure 1. State how the order/line
  pair first obtains product/quantity/agreed price, order supplies customer, and
  customer supplies current name. Contrast the order-alone closure directly.
- **Medium, lines 76–82:** the lossy split depends on Figure 2 for the original
  order/date rows and component schemas. Restore these before applying the
  intersection test. A shared customer identifier is not enough to say which
  timestamp belonged to which order.
- **Medium, lines 89–94:** the FD chase is specified in general terms, but
  “Here the first row becomes the whole target tuple” depends on Figure 3's
  initial tableau and merges. Supply a short concrete symbolic trace or a
  standalone reference table, and explain why the first row becomes all-a. The
  prose should demonstrate its promised method rather than only describe the
  algorithm and assert its result.
- **Medium, lines 127–132:** after naming adviser/style and customer/adviser
  components, “watch what the separate relations allow” skips the specific
  independent insertion that creates the conflicting customer/style assignment.
  State that counterexample explicitly while preserving the difference between
  projecting a legal original and later independent component updates.
- **Medium, lines 141–150:** “Two extra written rules” are not written in the
  body; they appear only in Figure 5. State the initial FD list and the redundant
  or extraneous rules removed, then show the resulting schemas and key coverage.
  The generic synthesis procedure is valuable but does not replace its missing
  worked demonstration.
- **Low, lines 168 and 184–185:** “Watch the two selected corners” and “Switch
  policies” are visual-operation prompts. The surrounding prose already gives
  MVD swapping and the three actual offer triples, so make these examples flow
  independently. Preserve the important actual-offer versus pairwise-eligibility
  distinction and the limits of FD-only losslessness tests.

## hierarchies.astro — complete read; mostly independent, framing repair

- **Medium, lines 28, 47–53, 63–66, 81, 101, 115–119, 133 and 143:** recurring
  “Switch”, “Choose”, “watch” and “Figure N …” phrases frame the explanation as
  operations on pictures. Most underlying premises and consequences are already
  in prose or retained SQL. Teach the tree/move/DAG choices, recursive rounds,
  materialised-path rewrite and closure maintenance directly, then let the
  diagrams reinforce the same facts.
- **Medium, lines 64–66:** state the unprotected concurrent result explicitly:
  Teaware under Gifts and Gifts under Teaware can both commit after individually
  valid starting-state checks, creating a cycle. Then explain why locking only
  different moving rows is insufficient and what the shared topology lock changes.
- **Low, lines 81–93:** the five-node/seven-path contrast is inside the static
  DAG figure. It is useful if retained, but the body already states that Mugs
  and Blue mugs each appear twice. Make the distinct-node versus path-occurrence
  consequence direct without relying on the diagram's counts.
- Retain the substantial independent maintenance reasoning: authoritative
  parent/edges, protected moves, Read Committed snapshot order, alternate DAG
  support, closure pair removal/addition and nested-set consistency checks. A
  complete new article structure is not justified by this review alone.

## history.astro — complete read; focused narrative and case repair

- **Medium, lines 37–42 and 51–66:** A1/A2/A3/A4 are introduced through the
  drawing and later used as handles for effective and recorded intervals. Name
  each assertion and its two periods in body prose or a standalone history
  table. Keep the already-good explanation of the earlier and corrected price
  on the same effective instant, including why both boundary sides change.
- **Medium, lines 76–94:** Figure 4 alone lays out the three correction branches:
  a changed catalogue account, evidence of incorrectly recorded purchase terms,
  and a later amendment/cancellation/refund. The body introduces their distinction
  but jumps past the explicit case analysis. Develop those cases briefly in
  prose, preserving that a refund records a later monetary action and cannot be
  expressed merely by altering an old price.
- **Low, lines 16, 37, 53, 61 and 115:** remove instructions to compare, select
  or watch diagrams and references such as “the four assertions in the drawing”.
  The deletion inventory, durable external work, verification and restored-copy
  obligations otherwise stand alone.
- Preserve the supplied engineering-policy boundary; no retention duration or
  legal conclusion should be invented to fill an explanatory gap.

## constraints.astro — complete read; mostly independent, local repair

- **Medium, lines 16–18 and 30–40:** the text asks readers to compare “the same
  three quantities” or “attempted rows below” before stating them in body prose.
  Give the ordinary quantity/NULL outcomes and duplicate-versus-new-line example
  directly, retaining the difference between line identity and a unique
  order/product pair. The underlying rules are already explained.
- **Low, lines 87, 120 and 157–158:** “Compare”, “Read the two proposed
  intervals” and “Compare the two paths” are instructions to visual material.
  The composite reference, half-open period/exclusion and deferred-reference
  code already support a self-contained subject explanation.
- **Medium, lines 180–186:** state the concurrent trigger/check outcome directly
  after the schedule: both 20.00 inserts can commit against a read of zero,
  producing 40.00 against the 29.00 ceiling. The first paragraph supplies the
  arithmetic, but the causal bridge between the hidden uncommitted rows and
  the invalid committed result should not be left to the animation.
- Constraint definitions, schema fragments, source-side boundaries and required
  protocol alternatives are substantial and should remain; avoid treating a
  diagram-removal repair as permission to simplify the technical caveats away.

## values.astro — complete read; several missing explanations in wrappers

- **Medium, lines 39–55:** Figure 2 explains that integer division has already
  discarded the fraction before the later numeric cast. The retained SQL gives
  6 versus 6.666…, but the body does not clearly explain that causal difference
  at the worked point. State it in prose before or around the SQL rather than
  merely asking readers to move the conversion in a diagram.
- **Medium, lines 63–74:** the entire 6.67+6.67+6.67=20.01 versus
  6.67+6.67+6.66=20.00 comparison, and who gets the smaller share, is inside the
  removable Figure 3. Supply that worked arithmetic and allocation choice in
  ordinary prose. The later general rounding-policy paragraph is useful but
  does not establish this example's result.
- **Medium, lines 80–99:** the declaration that PostgreSQL retains the instant,
  not the input zone name or original offset, is in Figure 4's caption. The body
  should state that storage consequence explicitly; the equal-instant SQL can
  remain direct textual evidence.
- **Medium, lines 105–122:** Figure 5 states the 25 elapsed hours versus 24.
  The SQL prints the two timestamps, but the body delegates the explanation of
  why a calendar day differs from 24 hours to the figure. State the two endpoint
  instants and the repeated hour's consequence directly.
- **Low, lines 15, 63, 202 and 218:** references to “the first drawing”, “the next
  drawing”, or “Choose … in the figure” should become subject explanations.
- Types/business meaning, text comparison, identifiers, structured values and
  most NULL reasoning stand alone. In particular, the WeightFilter's result and
  unknown/NOT/OR logic are already present in body prose; no expansion into a
  state-by-state animation transcript is needed.

## query-results.astro — complete read; removal test passes after framing cleanup

- The article independently states input multiplicities, inner/left join result
  grain, missing-match NULLs, ON versus WHERE behaviour, EXISTS, exact doubled
  totals, equal-valued facts, separate summaries, COALESCE and the final balance.
  Removing the four animations loses no essential premise or mechanism.
- **Low, lines 28, 43, 76 and 96:** “Attach … then switch”, “Change the condition
  in Figure 2”, “Figure 3's rows” and “as Figure 4 shows” are avoidable framing.
  Name the already-explained rows or condition instead. The explanatory example
  and SQL can retain their present sequence.
- Preserve the distinction between logical result reasoning and physical
  execution, and the stated omission of taxes/refunds/cancellation policy.

## Repair limits

The parent coordinator owns these eight article repairs. No independent browser
or new native execution was performed here. Missing exact premises should be
recovered from the existing figure/model and shared example, not invented while
retaining old proof outputs. Existing source/evidence checks may remain valid
where the revised prose does not alter their claims. Formal chase/synthesis,
concurrency and time-semantics changes require checking the affected argument
against the cited primary material, proportionate to what actually changes.
