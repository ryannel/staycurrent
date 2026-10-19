# b17 independent teaching, style and interaction review

## Verdicts

- **a17 — Changing data with SQL: PASS.** No required finding. Two optional comparison/presentation improvements below.
- **a18 — Designing changes that coordinate with locks: REVISE, narrowly.** Required T18-1 corrects empty-lock labels. The remaining prose, family boundary, mechanism teaching, controls, phone/themes and playback pass. Two optional improvements below.

Reviewed each complete article independently under `.agents/skills/staycurrent-review/SKILL.md`, against the original relational-practice commission and b17 manifest. Candidate routes were the immutable 4439 `/review/relational-next/changing-data/` and `/review/relational-next/locking/`. No practitioner reports were read or used.

Retained the complete source and rendered-figure reading of the three fixed references: Sequence diagrams, Indexes, and Storage and durability. Read both assigned articles in full, both context files, model/player sources, a17's complete query module and both source/writer records. Actual-family reading includes a02 and a13–a16 from the preceding reviews, with a02's change section re-read; a03 was read in full for a18. The a19 sibling plan defines the comparative-isolation boundary; it is not an available family article in a18's context. Neither leaf has child plans.

## a17 teaching and boundaries

The article makes a useful extension of the parent's complete first change. It explicitly changes globally unique order IDs into tenant-local composite identities and supplies a separate fresh-session fixture, so the extra key requirement is introduced rather than silently assumed. It consistently asks what one source row means and what state should remain. Definitions and SQL are concrete and direct, following the references' prediction → changed condition → visible consequence approach.

The seven figures carry distinct causal explanations:

1. **Target:** the same four orders expose one intended key, a second tenant reached by an incomplete key, a legitimate batch with a different question, and a NULL equality selecting none. Complete before/after identities make the error visible.
2. **Insert:** proposed columns, resolved values, validation and stored/returned result distinguish omission, DEFAULT and explicit NULL. Generated receipt identity retrieval and unordered RETURNING are usefully taught by the surrounding executable SQL and prose; they do not require another animation.
3. **Guard:** request, identity match, stock precondition and returned result distinguish successful subtraction, insufficient quantity and absent SKU. Unit squares make 5→2 versus unchanged 5 observable. Zero matches is correctly kept separate from a diagnosis of why.
4. **Source:** two genuine delivery contributions create two matches, not two updates. The observed 5→7 is labelled as this run's unspecified winner. Aggregation justifiably supplies one five-unit contribution and yields 10, while P9's absence from UPDATE and unrelated stock remain visible. The prose explicitly refuses to prescribe SUM for duplicated copies or arbitrary DISTINCT as a business rule.
5. **Delete:** the cascade, rejection and absent-order branches distinguish direct deletion from dependent effects and show rollback preserving both lines after rejection. NULL assignment, status change and physical deletion are compared without prescribing a universal lifecycle policy.
6. **Conflict:** rejection, preservation, addition and replacement produce different statement outcomes even when the stored value is still 5. The complete SQL explains existing versus EXCLUDED values. Conditional suppression, repeated source-key errors and the bounded MERGE example give useful local answers without a syntax catalogue. The MERGE action order is explained by an actual retirement instruction, not merely listed.
7. **Transaction:** a successful but discarded insert differs from a failed update; rollback restores rows without reclaiming the identity allocation. Counts, RETURNING and complete postconditions remain separate throughout.

The final delivery exercise composes a justified source aggregate with insert-or-add and checks both returned key/value sets and unrelated state. Its inspection instructions clearly place observations before BEGIN, inside the transaction and after rollback. Fresh-setup identity observations are labelled as separate exercises. a13 retains predicate/value depth; a14 retains join/source multiplicity; a02 supplies staging. Constraint design, concurrency, request recovery, live corrections and performance have appropriate owners. No extra article, figure or substantial cut is required to meet the original expertise goal.

### a17 interaction, phone and playback

Read every rendered state: **63 states, 21 choices, seven scenes**. For every choice, exercised slider Home/End/intermediate movement, keyboard Back/Next at both endpoints with retained focus, Play/Pause, playback interrupted by the slider and Reset. Reset restores the default choice and step 1. For every scene also checked replay from the final state, manual Next stopping playback, and a selector change stopping playback and restarting at step 1. No control malfunction observed.

Inspected all seven figures at **390×844 in dark and light themes**, including cross-tenant change, rejected NULL, insufficient stock, raw source winner, protected deletion, same-value replacement and failed transaction. Tables and unit counts remain readable. Stacked panels require vertical scrolling; this is usable, with the optional compactness improvement below. The sticky narration/transport can cover lower rows at one scroll position, but ordinary scrolling exposes the complete panels. SQL fragments scroll horizontally when needed, without page overflow. The page and every 356 px figure remained within the 390 px viewport. Desktop comparisons at normal 1488 px were readable side by side, in both themes.

Timing source counts title, SQL, note, all panel headings/columns/cells and a stock-label allowance at 180 words/minute, plus 3.5 seconds and row-inspection time. The dense full-key starting state has **87 words and eight rows: 34.9 seconds**. Actual playback remained at step 1 with Pause active after **31.757 seconds**, and had advanced to step 2 by **43.618 seconds**. The unchanged shared scheduler gives the final state its own hold. Fixed instructions are available before starting playback. No need to time every sequence separately.

### a17 required findings

None.

### a17 optional findings

- **T17-O1 — Preserve a comparison stage when changing a statement.** `MutationFigure.astro`, choice-change handler. All choices have three stages. Retaining the inspected stage would make the source-match and final-outcome comparisons quicker; the current restart is coherent and usable. This would also align the Figure 4 instruction to advance to source matches and then change the source more directly with its result.
- **T17-O2 — Apply the compact panel/table styling to hydrated content.** `MutationFigure.astro`, dynamically created panels and scoped styles. Rendered panels use the global table/paragraph presentation rather than the intended compact panel rules; on phone the source figure is about 1156 px tall. Values remain legible and reachable, so this is optional. Making the intended scoped rules reach generated elements could reduce scrolling and keep more of each comparison visible together. Preserve readable type rather than simply shrinking the whole figure.

## a18 teaching and boundaries

a18 develops the actual a03 parent's counter-free alternative, retaining class 21/22, Mina/Tariq and capacity one. It makes the changed representation explicit: capacity remains on the stable resource row while ownership is counted. The useful local answer is a complete Read Committed acquire → fresh decision → change → outcome protocol, not a link promising later explanation.

The five causal figures support that argument:

1. **Coverage:** an initially empty reservation set supplies no reservation row lock; the stable class branch instead serialises decisions. Committed count and pending insertion remain distinct. T18-1 concerns two contradictory acquired-lock labels, not the final outcomes.
2. **Visibility:** acquiring the lock and refreshing the decision's view are separate events. The combined command's observed 21|0 contrasts with the separate fresh command counting one. The article correctly bounds this recipe to PostgreSQL Read Committed and this tested command shape.
3. **Modes:** actual capacity change, deletion and foreign-key insertion wait while an ordinary count reads committed versions. The surrounding weaker-mode contrast earns its place: FK waiting protects the reference and does not enforce capacity. There is no lock catalogue.
4. **Order:** opposite acquisitions form a concrete A→B→A cycle; shared ascending acquisitions leave B holding nothing while A finishes. Explicit one-ID commands, source recheck and a changed booking location are explained. The article neither treats sorted output as a lock-order guarantee nor promises elimination of every deadlock.
5. **Waiting:** timeout, NOWAIT and SKIP LOCKED lead to different failure/empty-result contracts. No-space, no-candidate, fairness and whole-request deadlines are correctly excluded as conclusions those results cannot establish.

Mechanisms left to prose/code are complete: the all-writers inventory covers imports, cancellation, moves, capacity changes, deletion and repairs; justified possible exemptions are explicit. Coordination-row creation, absent/deleted lookup, identity lifecycle, lifetime through commit/rollback and savepoint release are explained. The move locks both expected classes before rechecking the reservation and refuses to acquire a newly discovered lower ID while retaining a higher one. The final worksheet gives commands, pause points, expected errors/results and invariant inspection, followed by an all-writers argument rather than treating selected runs as proof of coverage. These portions do not need additional figures.

a19 retains comparative isolation contracts, and application/background-work articles retain retries, connections, leases and recovery. Contention is introduced as a cost of this protocol and handed off before workload tuning. The article follows the references' concrete mechanism and changed-condition style and fits the original relational-practice goal.

### a18 interaction, phone and playback

Read every rendered state: **45 states, 13 choices, five scenes**. For every choice, exercised slider endpoints/intermediate movement, keyboard activation of Back/Next at both boundaries with retained focus, Play/Pause, slider interruption and Reset to the scene's default choice/first step. Each scene also passed final-state replay, manual Next interrupting playback and selector changes stopping/restarting playback. aria-disabled endpoint buttons remain reachable by keyboard and clamp correctly.

Inspected all five comparisons at **390×844 in both themes**, and desktop at normal 1488 px. Session labels, waits, counts, cycle arrows, result and narration remain legible. The phone's stacked session paragraphs require scrolling; all three sessions/shared state can be read together after positioning the scene. Sticky controls do not permanently hide content. No page overflow or clipped value observed: page width 390 px, figures 356 px. The optional compact panel styling below would reduce reading/navigation cost.

The scheduler counts title, all three cards' names/states/details, result and narration at 180 words/minute plus three seconds. Actual waiting-policy playback began at step 2 (**52 words / 20.333 seconds**), was on its final step with Pause active after **23.168 seconds**, and stopped on that same final step by **56.239 seconds**. The final state is the densest 64-word scene with its own **24.333-second** allowance. Source inspection and this actual run establish that final narration is held before playback ends. Fixed model/controls labels are available before starting; no need to time all other complete sequences.

### a18 required finding

**T18-1 — Do not label an empty locking read “Lock acquired”.**

Location: `src/components/relational-next/a18/model.mjs:9` and `:10`, Figure 1, Reservation rows branch, steps 2 and 3.

Step 2 says “A takes its lock” and Session A says “Lock acquired”, although its detail says “No matching reservation rows” and its result correctly says “The empty result supplied no row lock”. Step 3 labels B “Lock acquired” for the same empty read. The figure's central lesson is precisely that the locking clause acquired no reservation-row protection. The prominent state labels contradict that lesson and can make readers think a lock was acquired but ineffective.

Use a branch-specific stage such as “A issues its locking read” and state such as “No rows locked” for the empty branch; similarly label B's empty read. Preserve “Lock acquired” and waiting in the stable-class branch where they describe actual protection. Retain the correct committed/pending counts and final 2-of-1 versus 1-of-1 outcomes. Recheck these two stages and the stable alternative at the same stages. No SQL/native-evidence change is required for this narration repair.

### a18 optional findings

- **T18-O1 — Preserve a comparison stage on selector change.** `LockFigure.astro`, choice-change handler. Branches within each scene have equal lengths. Retaining the current stage would let readers switch directly between an empty/stable lock, old/fresh count or wait/skip consequence. Current reset-to-start behaviour is usable and not a blocker.
- **T18-O2 — Apply the intended compact card styling to generated panels.** `LockFigure.astro`, generated `.panel`/`.name`/`.state`/`.detail` elements and scoped CSS. Hydrated cards currently render as 18 px global paragraphs with generous spacing, rather than the compact two-column phone cards defined in the component. Typical phone scenes are about 897–954 px tall. They remain readable and reachable; ensuring those intended rules reach generated nodes would make A/B/shared-state comparison easier with less scrolling. This is optional, not an overflow/accessibility failure.

## Cleanup and evidence limits

Both owned Chrome tabs were closed after restoring System theme and the normal viewport. No downloads were clicked or download events awaited. Asset endpoint/byte checks remain root's responsibility; this review makes no browser-download-UI claim. No native SQL, builds, article/component mutations, Git operations or nested review team were performed. The only saved mutations are the requested teaching reports.

After T18-1, a narrow changed-label/phone recheck is sufficient; retain the other passes above. No further figure quota, article split or specialist-depth expansion is requested.
