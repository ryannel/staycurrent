# PostgreSQL branch: first prose-independence review

Reviewed 30 October 2026 against the user's explicit requirement: diagrams and animations reinforce an explanation that remains complete and coherent when those figures, their controls and their captions are removed.

Scope: all **17** `src/articles/relational-rebuild/pg-*.astro` articles (the assignment estimated 18). Read the complete article prose and headings, embedded captions and figure-adjacent text, and remaining lists/reference tables. Read source, not a rendered browser; imported animation components were not operated. This is editorial/teaching assessment of the article's removal test, not a fresh engine-accuracy or visual-behaviour review. SQL listings and ordinary textual reference tables remain legitimate article content; I did not assume that removing diagrams means deleting all technical listings.

Audience: an intelligent newcomer developing the practical understanding promised by each article. Existing skills' image-led clauses are superseded by the user's current instruction. No source articles or skills were edited during this first review.

## Overall judgement

I agree with the concern. All 17 articles contain prose that fails the strict removal test, chiefly because it directs the reader through named figures or controls. The extent varies considerably. Much of the native PostgreSQL branch already explains mechanisms and decisions in independent prose. It does **not** need to be replaced wholesale merely because it mentions a figure. It does need a full contextual reread and coherent section repairs, retaining the existing accurate explanations and observed evidence.

There are also genuine gaps: filter-transition rules live in a logical-replication figure caption; the WAL restart's recovered prices are mainly figure content; spatial filtering introduces A/B through the drawing; and several later paragraphs inherit participant names or setup states from removed scenes. Those cannot be repaired by deleting “Figure N” alone.

Each finding below is substantive under this commission (Medium unless stated otherwise). Scene directions count because, after removal, they tell the reader to find or manipulate absent material. They should become subject reasoning or be removed when the neighbouring explanation already does their job. Captions may still explain the optional illustration locally.

## Per-article coverage and findings

### pg-access.astro — complete prose read; repair

- **Lines 14, 86, 88:** “Figure 1 keeps those paths apart. Follow…” and “Figure 2's name update…” make the membership and RLS discussion refer to absent demonstrations. The prose already explains membership options and existing/proposed row checks well; retain it and introduce any diagnostic example directly by its actual operation.
- **Line 88:** “that same harmless statement” refers to the graphic's update, which the body never actually states. If this probe remains useful, name the target and intended name-only update in prose (including its extra grant) before explaining its different results; otherwise remove this probe aside while preserving the independent hidden-row versus rejected-new-row explanation at line 89.
- **Pass worth retaining:** the protected login mapping, view-authority distinction, definer identity and search-path mechanism are independently explained in lines 101–152. Do not replace them with graphic narration.

### pg-architecture.astro — complete prose read; repair

- **Lines 15, 34, 47, 72, 88, 106:** repeated “Figure…follow/watch/start/add/try” instructions treat the figures as the explanatory itinerary. Replace with the subject's causal sequence, retaining optional figures adjacent to that explanation.
- **Line 40:** “The chosen page was clean” inherits the buffer animation's replacement state. Establish the conditional directly: reusing a clean victim requires no page write; a dirty victim must be written first, which can add work to a read.
- **Lines 77–79:** “W's new tuple” introduces W only through the animation. Name the price writer in the prose before using a symbol, or consistently call it the writer. The snapshot and rollback reasoning itself is sound and well developed.
- **Pass worth retaining:** heap addresses, HOT prerequisites, visibility-map proof and the write-ahead rule receive real prose explanation. Keep the illustrative-address qualification while giving every necessary starting fact in the body.

### pg-backup.astro — complete prose read; repair

- **Lines 13–15:** the imperative sequence “follow…remove one required segment” carries the missing-segment setup; “The later files remain…” then presumes it happened. Explain the recovery-chain failure directly: one missing required segment prevents reaching a later target even if the base is intact and later files survive.
- **Lines 131, 142:** native evidence is described as “Figure 1's distinction” and the new writable history as “in Figure 2”. State the observed distinction and newly writable recovery branch directly.
- **Pass worth retaining:** backup scope, archive integrity, target selection, paused recovery, exact recovered facts and payment reconciliation are already independently developed. Their procedures and stated evidence limits need no invented additions.

### pg-distribution.astro — complete prose read; repair

- **Lines 13, 24, 31, 42, 87, 117, 139:** recurring drawing prompts and “exception to the local drawing” make figures the organising frame. Reframe around local partitions, replicas, independent ownership, routing, remote execution and handover.
- **Lines 87–102:** S is introduced as a graphic server, while “sorting stays in C” occurs in its caption. The body then describes a local sort without establishing the C/S roles independently. Name the querying PostgreSQL instance and the remote owner when introducing the foreign-table example; keep those names consistent in the native observations.
- **Lines 116–129:** the distributed report's ordinary prose explains why each customer total is locally complete and why fan-out waits for required owners. Preserve that reasoning; the diagram's small result does not need to become another recital of every row.
- **Pass worth retaining:** global order-ID uniqueness, the insufficient composite-key counterexample, guarded group closure and the return boundary are substantially self-contained.

### pg-extensions.astro — complete prose read; repair

- **Lines 17, 54–56:** the spatial example says “Watch point B survive the square and fail the circle”; then A/B are used as known points. Give the actual geometric example in prose: define the radius and representative coordinates or distances, explain the bounding box admits a false positive, and explain why the exact distance predicate rejects it.
- **Lines 114–128:** “Figure 3 follows…” and “Follow those two routes in Figure 4. Switch…” assign dependency and missing-software reasoning to a display. The surrounding prose already explains membership, application dependency and server files; replace the tours with direct explanation of how a dump reconstructs objects only when compatible software is provisioned.
- **Pass worth retaining:** range boundaries, exclusion enforcement, extension lifecycle and the rows-survive/rule-is-lost removal case have useful complete prose. Reuse the existing documented/native qualifications when carrying any figure-only fact into the body.

### pg-indexes.astro — complete prose read; repair

- **Lines 21, 61, 85, 96, 101:** method cards and switches (“Run the increasing order first, then switch…”) interrupt the account with figure-use directions. Explain each predicate/representation trade in the article itself.
- **Lines 85–87:** “the same four mathematical points”, “both searches” and “upper covering region” presume the geometry visible in Figure 3. Either define a compact independent example or use a general explanation of covering summaries versus space partitions; do not describe absent spatial positions.
- **Lines 101–103:** “all eight pages” has a setup supplied by the figure. State why mixing distant timestamps broadens min/max summaries and prevents exclusion. Retain a page count only if the hypothetical layout is defined in prose and the number does explanatory work.
- **Pass worth retaining:** operator classes, hash collisions, GIN membership versus equality, bitmap precision and native work observations are explained independently and should survive the repair.

### pg-json.astro — complete prose read; repair

- **Lines 16–21:** “the two alternatives” / “Both alternatives…” relies on the boundary figure to name both designs before comparing them. Introduce specialised typed detail rows and a referenced JSONB document row in the body first, then explain their shared product identity and differing contracts.
- **Lines 56, 87, 94, 138:** comparison directions and “Figure 2's rejected inputs” refer to absent controls. Retain the actual number/string/null/missing distinctions and validation reasoning; name diagnostic variations directly when required for later statements.
- **Lines 185–187:** the stale-replacement example starts with “Figure 5 adds a care instruction”. Explain the sequence in prose: a client reads the old document, another write adds care instructions, and the client replacement can erase that intervening member whereas editing the current server value preserves unrelated members. Keep the separate same-member race caveat.
- **Pass worth retaining:** most JSON semantics, validation, operators, expression indexes and row-lock consequences already stand alone.

### pg-logical-replication.astro — complete prose read; repair

- **Lines 87–97: clear teaching gap.** The full filter-transition rules occur only inside Figure 3's caption: entering the published set becomes an insert, leaving becomes a delete, matching before and after becomes an update, matching neither emits nothing. The body must explain these rules, using the independent 20.00/22.00 price-filter example if helpful. “The publisher's operation name need not be the arriving operation name” is insufficient without explaining why and how.
- **Lines 12, 60, 134, 160:** playback, initial-copy and progress/restart descriptions point into figures. Make the price/apply sequence, snapshot-plus-stream boundary, retained-WAL obligation and progress/apply crash windows direct prose.
- **Pass worth retaining:** replica identity, initial readiness, selected-data contract, DDL/sequence limits, slot resources and repair/retirement are already substantial standalone teaching.

### pg-operations.astro — complete prose read; repair

- **Lines 18, 101, 156, 189:** “Begin at the left”, figure-specific accumulated-time and deadline examples, and “Figure 2's native counterpart” narrate the presentation rather than the evidence path. Keep the causal explanations and describe native observations in their own right.
- **Lines 58–81:** H is defined in prose, but the blocked reader becomes W without an independent introduction. Name the waiting history backend before using W or avoid the symbol.
- **Lines 127–135:** the ordinary/reserved/superuser connection thresholds and the 95-slot example live in the figure. The next paragraph refers to “the first reservation” without saying which setting it means. Explain which roles may use each remaining-slot margin and identify `reserved_connections` and `superuser_reserved_connections` directly before any illustrative budget.
- **Pass worth retaining:** activity-state interpretation, dependency tracing, cancellation versus ending a transaction, recovery costs and useful service completion are well explained outside graphics.

### pg-plans.astro — complete prose read; repair

- **Lines 40, 62, 86, 128, 165, 179:** replace comparisons organised as figure instructions with direct measurement questions and results. “Select the rare customer” assumes a control, whereas the prose should explain custom/generic choices for both skew classes.
- **Lines 156–159:** the demonstrated sort result is mainly inside Figure 5; the body says “The figure establishes that the spill disappeared”. State the same observed comparison directly (64 kB external merge versus 32 MB in-memory quicksort, with its fixture limits). The article must not rely on retaining the figure to report what the measurement established.
- **Line 133:** “The three shared reads” appears without its counted route once the figure is removed. Introduce the observed reads in the body if needed, or remove this count and retain the important cache-order qualification in general terms.
- **Pass worth retaining:** rows/loops, inclusive buffers/timing, cardinality estimates, alternative SQL results and prepared-plan history have strong independent explanations. Keep the exact native observations and avoid inventing further performance claims.

### pg-replication.astro — complete prose read; repair

- **Lines 33, 57 and table row 80:** scene control and “Figure 1's flush step” tie progress meanings and the commit-setting comparison to an absent display. Explain volatile receipt, written WAL, durable WAL and replay in direct terms; the table's answer can simply say a fresh read can remain old until replay.
- **Line 8 and later C references:** the prose calls U/C symbols “in the drawings”, then depends on C for commit promises. Either define a named update and commit record as article notation, or use “the price change's commit record” consistently. Do not leave necessary notation defined as drawing-only vocabulary.
- **Pass worth retaining:** the initial A/B example already establishes durable-but-unreplayed versus missing history. Read routing, paused replay, fencing, promotion and fresh-copy return are independently explained; they should need framing repair more than extensive new teaching.

### pg-schema-change.astro — complete prose read; repair

- **Lines 12–14:** the queue example directs the reader to watch a later read. State the sequence and causal queue rule in the prose itself: a retained reader lock blocks the stronger DDL request, which in turn queues later ordinary readers.
- **Lines 98, 137, 177, 212–213:** validation, lifecycle properties, maintenance differences and native checks are framed as figure tours. Existing prose defines readiness/validity and maintenance differences; retain it and remove the scene premise.
- **Lines 163–172:** `_ccnew` and `_ccold` become known failure states through Figure 4. Introduce their documented meanings and which copy remains authoritative in prose before explaining which leftover to remove. Preserve the warning that a suffix alone is not a safe drop target.
- **Pass worth retaining:** backfill races, exact representation agreement, installed-but-unvalidated enforcement and failed concurrent builds are already explained in real terms. Keep the subtle range/NaN and old-writer safeguards.

### pg-text.astro — complete prose read; repair

- **Lines 17–19:** “Figure 1 follows The blue mugs” then “English preparation kept positions 2 and 3” relies on the scene to show the complete transformation. Give the prepared lexemes/positions and why the stop-word gap remains directly in the prose (the adjacent SQL may then reinforce it).
- **Lines 68, 101, 119:** field combination, GIN membership/phrase testing and final eligible ranking are introduced as tours or control changes. Keep the already-present reasoning about position shifts, rechecks and filtering before limit; remove procedural watching instructions.
- **Lines 155–160:** configuration-change reasoning says “as the figure shows”. Explain the stale stored-vector/new-query mismatch directly, preserving the distinction between regenerating vectors and merely rebuilding their index.
- **Pass worth retaining:** phrase gaps, field boundaries, score meaning, eligibility-before-limit and configuration lifecycle are mostly complete. The ordinary snippet score table is independently identified, so its “last row” reference is not itself a diagram dependency.

### pg-upgrades.astro — complete prose read; repair

- **Lines 14, 49, 68:** method choice, file-sharing modes and source closure are introduced as graphic/control comparisons. Replace the tour with the actual order and ownership differences. “Follow Excluded…switch to Address changed only” is especially presentation-dependent.
- **Line 72:** the finite boundary is named “B in the drawing”. Name it as an article's required final source position if the symbol is useful, or use the descriptive term throughout.
- **Line 105:** “The end of Figure 3 crosses…” can simply state the first authoritative target-only price commit and its consequence for returning to 20.00. Both prices and the accepted-work loss are already in the prose.
- **Pass worth retaining:** pg_upgrade copy/link consequences, stream completeness, sequence state, source exclusion, application acceptance and the return limit are already independently well developed.

### pg-vacuum.astro — complete prose read; repair

- **Lines 15, 18, 24, 77, 81, 88, 117:** repeated references to what a figure shows/chooses or a report “in Figure 1” need subject-based statements. The retained-snapshot and cleanup distinction is already independently developed and backed by a native observation.
- **Lines 77–81:** six occupied pages and their internal gaps are supplied by Figure 2. Explain the hypothetical sparse layout explicitly (live tuples on each page prevent tail truncation) before claiming the scan still visits six pages, or remove the arbitrary number while keeping the mechanism.
- **Pass worth retaining:** visibility/free-space maps, XID versus MultiXact age, maintenance margins, trigger eligibility versus capacity and exact cleanup acceptance are strong independent prose. Do not turn them into new figure descriptions.

### pg-vector.astro — complete prose read; repair

- **Lines 12, 45, 66, 89, 112:** distance, exact filtering and ANN exploration examples are introduced with controls or named scenes. Replace with the underlying question and a complete concrete example where needed.
- **Lines 66–68:** C/D/E's branch relation is provided visually before distance comparisons. State that the route through farther D leads to closer E, establishing the graph trade directly; avoid depending on spatial placement or a click revealing E.
- **Lines 89–91:** A/B are defined by location in Figure 4. Establish that the nearest list centre can own a farther candidate while a nearby point belongs to another list, with the same checked illustrative distances if retained.
- **Pass worth retaining:** vector meanings, metrics, exact-filter correctness, iterative-scan limits, recall versus relevance and the observed filtered comparisons are independently explained. No rewrite should imply that wider exploration guarantees exact neighbours or that these invented embeddings have semantic relevance.

## Evidence and repair limits

Most repairs should reuse the existing primary sources and native observations because they change explanatory ownership rather than engine behaviour. Any example facts moved out of captions must retain their illustrative/observed status. For the logical filter transitions, spatial candidate tests, WAL outcomes and failed-index suffix meanings, confirm the moved wording against the source already cited for that exact mechanism. No new execution is needed merely to make already-supported facts readable without a figure.

No first-pass article is marked “passes unchanged”: all have at least one substantive absent-figure instruction or dependency under the user's explicit removal criterion. This does not mean every section needs new text. A number of figure introductions can be deleted once the following prose is made referentially complete; other sections need the missing mechanism or example restored into their normal explanatory flow.
