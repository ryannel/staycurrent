# Independent sequential reading

Audience: application engineer comfortable with basic programming, learning relational databases. Review of production-build artifacts at `/private/tmp/relational-depth-initial/`, delivered as default-visible DOM chunks in document order. This is an agent reading, not a novice participant test. Closed disclosures are read separately. Screenshots can establish layout and relationships; extracted text alone cannot establish live behavior. No article sources, briefs, previous reviews or author notes consulted.

## Introduction

- 00: Title establishes introduction and overview; no explanation yet.
- 01 opening: I can explain a table as a consistent shape for one kind of information, and a database as a way to ask across kinds and control changes. Concrete customer/product/order examples establish the vocabulary. I do not yet know how tables connect; that is an expected next question.
- 02: Shared records now have a reason: distinct questions and simultaneous changes. The opening prepares concurrency without naming a mechanism prematurely.
- 03: Rows versus columns, schema, types and key are built from the product table. Changing a product versus adding a weight column makes the distinction concrete. Identity despite name changes is memorable. Physical arrangement is explicitly deferred without losing the logical model.
- 04: Opening question about connections resolved by IDs and the customer/order/order-line/product chain. Historical price exception is necessary and lands well: it prevents treating all copying as a mistake. Caption permits tracing C4 → O12 → P7.
- 05: The query earns SQL through a specific question and maps each clause to the answer. I can derive Blue mug / 2 from supplied records. Full-page screenshot is too tall for native detail in the image tool; figure inspection remains pending crops.
- 06: Index distinction is unusually clear: orders by customer, not customer primary key; same answer, less searching; totals still require table access. Two C4 entries resolve duplicate-key ambiguity. Cost of maintenance follows naturally. No necessary gap.
- 07: Constraint purpose grows directly from the join's dependence on an existing product. Multiple writers justify database enforcement. Ending with a legal but partial purchase creates the next question well.
- 08: Atomicity, durability and external-effect boundaries each attach to a purchase consequence. I can explain rollback's exact effect on order, line and stock. Scope is sensible for an overview; how to coordinate payment is onward curiosity.
- 09: Sequence makes the necessary ordering explicit: lock before check, second buyer has made no decision while waiting. Snapshot reading and reservation are distinguished before an inference can go wrong. Repetition between illustration transcript and prose may be an extraction artifact; visual review pending.
- 10: Replica versus shard is introduced by copy versus ownership, enough to retain for later reading. No premature operational recommendation.
- 11: Suitability and costs follow taught mechanisms. Product differences are stated without pretending the overview equips a product decision.
- 12: Further reading offers distinct questions rather than unexplained topic names.
- 13: Route visibly distinguishes deep dives, narrower articles, practical guides and optional separate-shop checkout. This matters for carrying identifiers forward: checkout explicitly resets them.
- 14 / optional: Source qualifications distinguish common capabilities from engine-specific guarantees. Optional extraction contains repeated navigation, not required teaching.
- Writing judgment: The introduction builds one connected explanation from a shop, with useful questions at each transition. Terms arrive after a need. Retain the shared versus historical price example and locking-before-checking sequence. No consequential prose gap found; image detail remains to inspect.

## Modelling
- 00: Positioned as deep dive before querying.
- 01 opening: The decision is what belongs together; success means change without loss or contradiction. I expect an example where screen layout gives the wrong answer.
- 02: Schema versus records is clear through every order / particular order.
- 03: Example adds repeated-name permission and key uniqueness, strengthening schema/data distinction.
- 04: Questions sharpen the promise: existence, repeated products and historical meaning should determine layout.
- 05: Definition of fact avoids relying on database vocabulary.
- 06: Normalisation defined through independent changes; the upcoming scope is broad but concrete. Dependence is still abstract, expected to be demonstrated next.
- 07: Contents reinforces broad deep-dive role.
- 08: Independence becomes concrete through update/insert/delete anomalies. Explicit distinction between repeated IDs and repeated names prevents the common overgeneralisation. Closing question prepares identity.
- Figure 1 desktop: highlighted repeated names versus repeated references is readable and matches the prose. The arrow connects the preserved relationship.
- 09: Row meaning and composite key are derived from shop permissions. O12 price remains €18 historical, O13 €20 current; continuity is sound. Candidate-key minimality is stated, and every column is demonstrated for order lines. Good warning that surrogate identity alone does not normalise facts.
- 10: One-way dependence is demonstrable with C4's two orders; changing current name does not invalidate dependence. I can map price and quantity to the composite identity. This section earns formal notation from ordinary questions.
- 11: Three normal forms are derived through precise moves and preserved values. I can explain why order facts move on the partial key, why catalogue facts move through product_id, and why agreed price stays. The scalar-slot qualification avoids a misleading formal claim about 1NF. Optional candidate-key qualification is explicitly separate. Several figures reduce the otherwise substantial burden of mentally tracking column movement. At the final relationship figure I can derive the two products in O13 and P7 in two orders. No necessary gap; long section benefits from its subheadings.
- Figures 2–5 desktop: values and highlighted moved columns support the transformations; arrows consistently point toward referenced records. No mismatch seen.
- 12: Lossless decomposition gets a concrete false-pair counterexample; I can derive four matches from shared O13. Uniqueness on the joined side is tied back to identity. This anticipates query multiplication constructively.
- 13: Historical €36 versus wrong €40 is derivable. Interactive resets catalogue to €18 explicitly, avoiding prior-example confusion. Address and product-name extensions generalise the principle without changing the meaning of the earlier join. Need live execution to judge controls; DOM supports stated model only.
- 14: Stopping rule is useful: same determinant yields no normalisation gain. Summary responsibility and authority are concrete. Transactions are already known from introduction, so maintaining both is understandable at this stage.
- 15: Type choices have operational consequences, including the retained rounded value rather than merely calling numeric exact. The date/instant/local-time distinction is concrete. NULL explanation raises necessary multiple meanings without trying to teach query truth rules early. This is long but maintains one question: what must this field represent?
- 16: First DDL explains how to parse names/types/declarations before the block. NULL + CHECK and NaN are explained soon after, so code oddities resolve within a short distance. Proposed (O12,2) explicitly permits repeated product, but subsequent examples must distinguish whether it was actually inserted. Experiment says proposals are not added. Deletion policy versus mechanical cascade and line-has-order versus order-has-line are strong limits. No necessary gap at this point.
- 17: Default-visible prose supplies P7 capacity 350 and predicate >=300 before asserting result, despite SQL being optional. JSON format versus validation is clearly separated. One-to-one details limit is explicit. Supplier offers introduce identity/reference/update reasons for rows. Row-lock/whole-object warning needs later concurrency depth but states the consequence understandably.
- 18: Reset concern from 16 resolved explicitly in visible prose: fresh load before second-line insert, and alternate receipt if inserted. Aliases and arithmetic are explained before query. Prediction: Sea-blue mug / 2 / 18 / 36; original name cannot be recovered from these retained fields. This follows preceding teaching without expertise.
- 19: Handoffs identify concrete unanswered mechanisms.
- Optional disclosures: Prediction confirmed. Optional DDL supplies execution steps without withholding required meaning. Model assumptions add deliberate simplification rather than contradicting visible claims.
- Writing judgment: This is substantial but patient. Each abstraction follows a shop operation and each split preserves visible facts. Retain the full normalisation derivation; shortening it to definitions would lose the causal explanation. No consequential repair identified. Interaction behavior not yet exercised.

## Constraints
- 00: Further depth on the design lesson.
- 01 opening: I know scope (all mutations) and purpose (meaning beyond representation), ready for enforcement mechanics.
- 02: Race is understandable from the introduction; validation versus reservation gives the article a new purpose.
- 03: Multiple-writer rationale retained; no missing prerequisite.
- 04: Diagram distinguishes one applicable rule from whole-write success; useful qualification.
- 05: Specific promises and engine boundary are clear.
- 06: Baseline matches previous article, optional SKU rule is precise, and failed-statement execution context is visible rather than buried. Savepoint is named but not needed because independent statements are recommended.
- 07: TRUE/unknown versus rejection policy is explicit and input conversion precedes checks. Probe creates a standalone table before writes, so no hidden setup for its outputs. Clear explanation, though much overlaps modelling; the runnable probe and enforcement focus give repetition a purpose.
- 08: Column/value mapping and initial SKU state support every outcome. Expected accepted/rejected cases are not just error catalogues; they test business meaning. Later deletion should account for accepted P9/O12 line 2, but these do not yet undermine claims.
- 09: Sequence makes who waits and what ends waiting explicit. The SQL comment distinguishes application branch from unconditional commands. A/B different product IDs avoid confusing SKU conflict with primary-key conflict. No need to import isolation knowledge.
- 10: Composite FK example correctly incorporates earlier inserted line 2, while figure explicitly shows only first line. Deletion direction and preserved product are clear. NO ACTION/RESTRICT timing is a contained onward question, not an unexplained dependency for current design.
- 11: Wider process boundary is specific enough to avoid magical guarantees from checks or transactions. Teaching proceeds naturally to variable attributes.
- 12: Clear onward route.
- Optional/source: Full baseline supports visible claims. Recorded versus illustrative execution is distinguished. No optional-only semantic premise found.
- Writing judgment: Clear, deliberate progression from row rules to uniqueness across requests, deletion, and operation limits. Some repeated fundamentals from modelling help a direct entrant and do not obstruct sequential reading. Retain the distinction between checking availability and reserving it.

## Tables and documents
- 00: Narrower continuation of design.
- 01 opening: Common shape versus kind-specific attributes sets a concrete design tension; I expect to compare representations.
- 02: JSON does not erase the table schema; comparison focuses on location of structure.
- 03: Engine and comparison boundary explicit.
- 04: JSON key versus database key avoids vocabulary collision. Nested path and row boundary get concrete examples. Three arrangements preserve the same capacity; clear statement that separation alone is not normalisation.
- 05: Choice is motivated by common meaning and use, not a taboo against NULL. Kind-dependent requirements are identified without promising a full taxonomy design.
- 06: Upper integer bound and incoming conversion are now explicit. First runnable CREATE assumes products; route knowledge gives it, but direct setup awaits later section. The generic-triples alternative is enough to reveal its tradeoff without detouring.
- 07: Reset after alternative representation is explicit and visible. Parsed jsonb meaning and limitations are practical. Need to query varying types is earned by examples.
- 08: WITH sample syntax explained before use. Output makes loss of distinctions through text extraction directly inspectable. Separate diagnostic NULL allowance is visible, so it does not contradict NOT NULL schema. No gap.
- 09: Intermediate number check explicitly does not make integer cast total; final design closes that admitted-value gap with numeric/type/range policy. I can predict 350.0 accepted, string 350 and 350.5 rejected. Visible prose states conversion outcome and one authoritative home; optional transaction code can be inspected separately. At 'ordinary capacity index', no such index has yet been created, so read this as potential access route rather than a demonstrated performance claim. Minor wording clarification could say 'an index on capacity'.
- 10: Capacity-index wording resolved by subsequent definition. GIN versus numeric order is explained without relying on later index article. Lost object update traces exact values and is explicitly a separate setup; the current-column expression fixes the right problem without claiming row lock alone repairs stale data. Offer row boundaries map to update targets and explicitly stop short of independence guarantees.
- 11: 'No DDL' does not mean 'no migration' is demonstrated by renamed finish. This is a valuable continuation of one-authority principle.
- 12: Completed design can query every admitted capacity and has explicit future-write policy. Summary restates decision criteria through the shop rather than slogans.
- 13: Clear handoff.
- Optional conversion: Caller, one-connection context, error branch and transaction boundary are all stated before code. CASE explains why unsafe conversion is guarded. The known-P7 premise is explicit; broader migration is not claimed.
- Writing judgment: This article follows a decision through representation, validation, query, update and migration. It answers its own temporary design failures rather than stopping with warnings. Retain the complete capacity input policy and stale-whole-object sequence. Minor earlier index phrase resolves in next section and is not consequential.

## Query results
- 00: Query deep dive follows schema work.
- 01 opening: Need to reconstruct and calculate answers follows cleanly from normalised schema. I expect exact input-to-output reasoning.
- 02: Query role explicit.
- 03: Result grain introduced in ordinary language, a useful organising idea.
- 04: Prior knowledge and planned bridge to work are named appropriately.
- 05: Contents tracks a coherent argument.
- 06: Full O13 input and arithmetic support first result. Clause purposes, quoting, statement boundary and ordering are explained. Parameterised value boundary is concise and useful. Intro's reused O12/O13 baseline is explicit, so previous experimental mutations do not carry silently.
- 07: Existence plus unique target explains row count, and hiding identifying output does not alter grain. Strong foundation for inflated totals later.
- 08: Added records and separate filter copies are visible. Ben's absence versus O14 empty header is clear. Cara supplies the non-obvious case where filtering a real early match does not generate a NULL replacement. All cutoff results can be derived from given times, with optional setup only for execution.
- 09: O14 links outer join to COUNT(*) versus COUNT(non-null identity) and empty sum. WHERE/HAVING counterexample is concrete; derive O13 €44 versus changed €24. No necessary gap.
- 10: Multiplication is fully derivable (2×2, €88), and the false DISTINCT fix gets equal-price counterexample. Grouping-before-joining transforms both sides to order identity; the all-orders limitation is visible. Prediction before answer: 3×3=9 pairs; (20+24+20)×3=192; separate total 64/count 3; SUM DISTINCT 44 remains wrong. WITH has already appeared in JSON samples, and explanation follows this more involved use.
- 11: EXISTS explains constant SELECT 1 and correlation, then retains one row by outer identity. NOT EXISTS diagnostic limits follow established unfinished-order distinction.
- 12: Checking method uses preceding evidence and naturally bridges correctness to execution.
- 13: Plan is introduced after fully tracing desired result. Emitted versus inspected rows and fractional rows×loops are both derived from three product visits. Materialize purpose is clear. Reading tree dependencies rather than top-to-bottom is explicitly taught. This is dense but well supported; preserve it.
- 14: Model declares departure from observed early-stopping nested loop before showing comparison. Counts remain distinct units, avoiding speedup claims. Index alternative and merge strategy are enough for the comparison; later query-execution can deepen them.
- 15: Cardinality links correctness and cost effectively. Estimates, actuals and planner units are distinguished. Grouping/sort input work versus small output is explained. Ending returns to preserving the €44 answer, making the broad second half feel connected.
- 16: Navigation gives meaningful next questions.
- Optional: Predicted nine pairs/€192 and repaired €64/3 confirmed. Setup supplies execution details; all necessary record meanings were visible before use.
- Writing judgment: Strong sustained argument organised around what a result row means. The bridge to execution preserves the same example and provides actual plan interpretation instead of merely listing operators. No consequential repair found in text.

## Query execution
- 00: Supporting execution depth.
- 01 opening: Desired result versus operational route recalls previous article accurately; not yet a new claim.
- 02: Tradeoff is concrete and consistent with earlier comparison.
- 03: Inspection purpose and prerequisites explicit.
- 04: Separate numeric-ID dataset is explicit. 10 orders×3 lines and repeated quantities permit deriving 30/20/10. Indexes are declared as setup facts; no source inspection needed.
- 05: Bitmap/heap are defined where first seen, and repeated inner scan remains within one statement. Three-per-ten arithmetic is grounded in generated records. Distinguishes streaming join from blocking aggregate output.
- 06: Two sorts have distinct reasons and input sizes. Blocking computation versus lock waiting explicit. LIMIT caveat derives from aggregate need, not an unexplained admonition.
- 07: Changed filter changes both inputs and totals explicitly. Hash join versus hash aggregate have different keys and table sizes, preventing conflation. Hash collision check mentioned briefly. Work comparison does not pretend to measure elapsed time.
- 08: Merge cursor progression is concrete; duplicates caveat ties to known all-pairs semantics. Temporary planner changes include caller/session and reset, making exercise safe to follow conceptually. Order-ID order does not solve product grouping is well explained.
- 09: Cost and width explained, including cumulative cost. Correlated north/customer example supports exact 1-versus-10 estimate and explains why ANALYZE alone is insufficient. Statistics repair has before/after estimate yet no invented speedup. Good practical completeness.
- 10: Memory growth follows different keys; work_mem per operation versus total explained. Spill experiment changes query deliberately and reports evidence, with PGlite measurement limitation. Recommendation begins with unnecessary work before resource setting.
- 11: Rerun reset includes statistics state, important for reproducibility. Summary supplies a concrete investigation process.
- 12: Related reading fits questions raised.
- Writing judgment: A focused, connected investigation built around one generated report. Every plan label has a job in producing known totals; cost and memory discussions stay anchored. No consequential prose repair identified.

## Large results
- 00: Pagination follows query execution.
- 01 opening: User-visible purpose is prompt useful history, not arbitrary page mechanics.
- 02: Export adds memory motivation and will need a completion contract distinct from browsing.
- 03: Count-past versus continue-from sets mechanism comparison plainly.
- 04: Browsing versus fixed export contract distinguished before technique recommendation.
- 05: New chronology explicitly resets reused IDs, and complete tuple settles ties. Timestamp precision versus uniqueness distinction useful. O16/O15 first-page result derives from all five visible orders.
- 06: Insert and delete cases explicitly restart, so no conflated chronology. Exact rows skipped/returned demonstrate repeats and misses. Default statement view was taught in introduction and is restated here.
- 07: Tuple predicate exactly follows descending order and tie-breaker, including deleted boundary record. Next-boundary choice uses last returned row. Mixed directions/NULL bounded clearly. Mutable sort field is in controls before prose, inviting next question rather than unexplained recommendation.
- 08: Caller/server roles, precision, access and look-ahead token boundary are concrete. The extra-row off-by-one hazard is fully explained. Honest limit on arbitrary jumps.
- 09: Composite index route follows filter then order, understandable from introduction. Page grain recalls earlier query teaching; selecting identities before joining solves complete-order page promise. Optional SQL is not needed to understand the mechanism.
- 10: Mutable boundary question resolved with exact O14 movement. Key range versus snapshot distinction prepares export correctly; cutoff late-commit example is clear enough without transaction-ID mechanics.
- 11: Export reset, ordering reversal, transaction/snapshot/cursor roles and same connection are visible. Fetch groups derive exactly. Diagram compares fresh queries with stable cursor and acknowledges alternate same-snapshot page queries. Resource cost tied to controlled duration; retained IDs versus values closes another subtle gap.
- 12: Checkpoint/effect gap is concrete enough for onward link; no claim that pagination implements a job system. Distinct contracts unify the article.
- 13: Next transaction article answers operation-boundary questions raised.
- Optional: Run-all warning and reset ensure correct experiment interpretation. Page-of-orders SQL preserves empty headers and shows three lines for two orders.
- Writing judgment: Thorough without losing the practical purpose. Stable boundary, visibility and job effects remain distinct. Exact tied IDs make every important claim checkable. No consequential text repair identified.

## Transaction boundaries
- 00: Main transaction deep dive.
- 01 opening: One application action spans records; consistency purpose established in concrete examples.
- 02: Failure during compensation motivates transaction beyond a convenience wrapper.
- 03: Atomicity answers exact earlier failure; straightforward.
- 04: Atomicity versus concurrent decision correctness is clear before mechanisms.
- 05: Scope and baseline visible; enough prior route knowledge.
- 06: Contents sets a substantial but coherent progression.
- 07: Model boundary declared before examples.
- 08: Connection/session definitions arrive before operational use; own writes versus other sessions and old snapshots precise. ACID consistency does not pretend engine discovers business rules. No necessary gap.
- 09: O14 reset and inventory baseline expressly separate from earlier empty O14. Three partial failures justify chosen group, not arbitrary BEGIN scope. Diagram alternatives understandable from transcript.
- 10: Caller context is unusually explicit: browser request→server handler→driver→same borrowed connection. SQL success with zero rows versus thrown rejection is explained before branch. Parameter mapping and result rows allow deriving stock=1 and O14 line. Error/connection omissions are marked as partial excerpts and promised next, so not treated as production-complete code yet.
- 11: Tutorial role distinguishes learner manually stepping from automated handler.
- 12: Deliberate zero input, thrown SQLSTATE, skipped COMMIT and same-connection rollback all form traceable control flow. Rollback restores baseline without compensation. Complete lifecycle optional, but obligation visible. Confirmed rejection versus commit uncertainty introduced exactly where generic catch could mislead.
- 13: Concurrent means overlapping handlers, not simultaneous CPU instructions. Both use one mug and different order IDs, with exact unsafe application-derived zero. Lock does not repair stale decision; all constraints can pass. Fully supported failure demonstration.
- 14: Guard recheck after wait and rollback alternative are both described. No returned row is result rather than exception, already taught. Subtraction on stored value versus old application number reinforces mechanism. Version condition extension identifies writer obligation.
- 15: Longer decision motivates lock, then one-mug comparison deliberately simplifies. Awaited locked read prevents application branch before answer; connection boundary explicit. Missing-row lock limitation supports later multirow rules. Experiment's A rollback variation tests whether waiting is being mistaken for failure.
- 16: Snapshot as visibility metadata, not full copy, avoids an unnecessary mental model. Two-await reporting context gives isolation a caller purpose. Locking reads versus ordinary read view explicitly separated, including repeatable-read rejection. No gap.
- 17 prediction: First reserve 2 from 3 returns availability 1; second needs 2 and returns no row; roll back whole attempt, leaving 3 stock and no new O14/lines. Featured-products rule then demonstrates write skew with different write rows. Both serial alternatives are worked out, so Serializable's promise is earned. Common lock record protocol is bounded to all writers. This is substantial but comprehensible.
- 18: Deadlock cycle versus ordered acquisition is traceable with two products. Retry scope includes all prior reservations and decisions; intent stays fixed. Pseudocode declared, unresolved recovery named and next. Release-before-delay and bounded budget make operational branch complete at conceptual level.
- 19: Missing acknowledgment is epistemic uncertainty with two histories; key retained before side effects. Claim success/empty branches include cleanup, result validation and no repeated reservation. Subsequent statement after conflict wait explains fresh visibility. Five-stock experiment reset visible. Absence and retry deadline do not fabricate failure. Clear practical explanation; full SQL delegated explicitly.
- 20: External payment workflow is explicitly proposed beyond runnable schema. Pending state means something to warehouse; cancellation exactly-once stock release and provider identity requirements visible. Article does not oversell a status column as full payment implementation.
- 21: Outbox earns its existence through commit-before-call crash, and repeated delivery bound retained. Enough for onward investigation, not a misleading complete worker recipe.
- 22: Review process follows failure points, meaningful results and decision facts. Closing distinctions supported throughout.
- 23: Supporting links correspond to unexpanded mechanisms.
- Optional: Two-line prediction confirmed. Full function separates confirmed commit rejection from unknown completion, performs cleanup in finally, and marks adapter/recovery unimplemented. psql exercises name learner-as-handler, connection and response-versus-command roles. These details deepen execution rather than supply missing meaning.
- Writing judgment: Long, but the progression maintains one concrete application handler while changing the failure or overlap. Especially retain successful zero-row versus exception versus unknown-commit distinctions. I found no consequential explanatory gap. The payment/outbox part is appropriately bounded as a proposed workflow.

## Isolation
- 00: Visibility and overlap depth.
- 01 opening: Reporting during changes motivates a visibility rule.
- 02: Snapshot need differs from writer atomicity and concrete two-query report gives stakes.
- 03: Levels framed by visibility and rejection rather than an unexplained ranking.
- 04: Cross-row guarded-looking update promises new lesson beyond main article; engine scope explicit.
- 05: Version retention and metadata distinction reinforced; read kind bounded before claims.
- 06: First statement snapshot timing, ordinary reads, two-connection schedule and reset all explicit. Read-only prevents self-mutating report; one joined SELECT already consistent avoids unnecessary transactions. No gap.
- 07: Own-write example rolls back and labels separate baseline. Update-after-snapshot rejection identifies unchanged selection key, avoiding ambiguity about row no longer matching. Readers learn why higher isolation changes error handling rather than simply improving freshness.
- 08: New contribution is cross-row predicate in same UPDATE: eliminating app gap still does not create shared conflict. Schedule establishes both snapshots before either commit, enough to derive both disables. EXISTS already taught, flag shorthand explained.
- 09: Retry may validly decline original requested disable; full decision must rerun. Shared control row sequence includes subsequent statement freshness and Repeatable Read caveat. This closes a common unsupported shortcut: lock alone does not refresh established snapshot.
- 10: Summary separates view contract and write rule; good handoff.
- 11: Useful route.
- Writing judgment: Focused supporting article; repeated price example gives quick orientation, then same-statement cross-row check and shared-lock freshness add real depth. No necessary explanation missing. Source statement correctly bounds unexecuted concurrent histories.

## Conflicts and retries
- 00: Conflict and recovery depth.
- 01 opening: Focus is application evidence from database exchange, not generic error handling.
- 02: Waiting, rejected and unknown look similar externally; expect distinct evidence/actions.
- 03: Duplicate purchase stakes clear.
- 04: Scope grounded in preceding transaction contract.
- 05: Deadline/cancel request versus confirmed server cancellation distinction advances the main article. Cleanup rule tied to explicit transaction. No unsupported inference from slowness to failure.
- 06: Deadlock diagram and inspection SQL bound what is demonstrated. Lock order resolves this cycle without promising universal elimination. Fresh setup deferred but no output depends on omitted values.
- 07: Whole-decision retry keeps intent while accepting changed availability. Pseudocode separates confirmed rejections from any unconfirmed post-COMMIT error. Stable token retained across restarts is an explicit caller obligation. Practical bounded retry/reporting guidance supports implementation.
- 08: Alternative histories clear; new connection restores ability to ask, not knowledge of past commit. Repetition from main reinforces essential distinction without new confusion.
- 09: Complete claim/fresh/replay paths state who sends next command and when. Order-ID collision explicitly separate. Provisional order may not be committed alone. Read complete lines and compare intent, then end read-only replay attempt, clear. Error pseudocode's require is covered by outer cleanup path; not executable driver code. Retaining agreed intent rather than repricing it is valuable.
- 10: Recovery while original active distinguishes absence from rollback and waits before new reservation. Retention and restored-authoritative-state premises visible. Prediction: continue K14 recovery, never infer failure or new K15 from empty lookup; known deadlock permits whole new attempt of same intent after cleanup. All supported.
- 11: Evidence/action table is useful after derivation; not a substitute for explanation.
- 12: Useful onward link.
- Optional: Prediction confirmed; setup adds optional key solely for historical records, consistent with fresh attempts supplying it.
- Writing judgment: This article earns its length through complete claim branches and an active-original recovery case. It maintains distinction between evidence and action. No consequential text gap found.

## Checkout
- 00 opening/title: Optional worked tour promises one purchase across mechanisms; route already calls it a simpler separate shop.
- 01: Explicit new people, IDs, direct-product order and product-row stock prevent inherited schema assumptions.
- 02: Success/failure and competing buyer contracts established together.
- 03: Atomicity and concurrency separated before showing tools.
- 04: Figure is explicitly post-purchase and later-price-change, so stock zero is not initial condition. Physical layout terms are briefly new but linked and not required to follow checkout. Constraints retain prior caveats.
- 05: Reset to stock one visible. B-tree route is brief but concrete (separator→right leaf→table), with cache qualification. In optional tour, more detailed structure will come next main article; enough to trace lookup.
- 06: SQL branch is comment-level rather than handler but links main lesson and prior route has taught interpreting it. Model earlier read remains in guarded method solely to contrast checked current update; understandable. Separate P7 tutorial identity noted.
- 07: Headline 'yesterday' is figurative duration, example uses immediate prior stock. Main concepts recap clearly; bin variation separates same-row guard from total rule. Vacuum/HOT references are onward curiosities, no need for their implementation here.
- 08: Crash recovery versus full storage loss and reply loss are concise and distinct. WAL explanation is first detailed one on route and gives ordering before follow-up storage article.
- 09: Workload-specific conclusion and multi-product expansion return optional simple shop to collection model. Payments qualified as local recorded facts. No new mechanism needed.
- Writing judgment: As an optional tour this is appropriately shorter, using a separate simple shop explicitly. It connects mechanisms without requiring every linked detail. No necessary text gap. This route already supplies deeper prerequisites, so this does not establish a direct first-entry novice reading.

## Indexes
- 00: Main index deep dive.
- 01 opening: Index contents and purpose clear; route knows costs already, expect structure-based choices.
- 02: Grouped index entries versus scattered table rows explicit; range of same customer intuitive.
- 03: Arrangement explains supported queries and cost, ready for composite order.
- 04: Contents follows mechanism to test.
- 05: Tree route and leaf-to-two-heap-page fetch are traceable. 'Row D' distinguished from SQL key, preventing diagram over-literalism. Candidate entry versus MVCC-visible row linked to prior isolation lesson. No gap.
- 06: Explicit fresh temporary-session setup and generated regular data make 60→15→10 chain derivable. Formula yields customer42 at n ending 041, so provided order IDs fit. Composite order, date boundary, tie-breaker and stop condition taught together; backward scan reverses all keys caveat useful.
- 07: Paid-filter 12 candidates from generated CASE is checkable (59…48 groups, 55 and50 pending). Additional equality key helps paid and breaks global date order, a clear cost. Skip-scan/partial index are brief onward cases with conditions, not categorical rules.
- 08: INCLUDE payload not sort key, visibility map not coverage alone determines heap avoidance. Explicit standalone VACUUM context. 900/1000 ×60000 =54000; row width explains why even broad selection can favor covering index. No fixed selectivity threshold invented.
- 09: Maintenance includes included fields, versions and cache space. Constraint-supporting index reason retained. Live-build concern appropriately separated from temporary demonstration and linked for operational planning.
- 10: Expected structural benefits paired with observed counters; ANALYZE dual meaning explained. Need collect each step addressed via complete script. Insert/update/delete checks do not claim maintenance cost measurement; server workload follow-up explicitly needed. Some readers may reach EXPLAIN after replacing indexes, but script/restart supplies clear way back, so no execution blocker.
- 11: Links fit route.
- Writing judgment: Connected investigation with one query and deliberately changed access paths. It explains why candidate counts, sort elimination and visibility-driven heap avoidance differ. Strong concrete teaching; no consequential text repair.

## Storage
- 00: Storage title.
- 01 opening: Physical arrangement motivated by read/write work, building on logical/physical distinction.
- 02: Durable recovery information before acknowledgement, not every final table page, is clear opening mechanism.
- 03: Guarantee conditioned on logged tables/settings/surviving correctly functioning storage; no overclaim.
- 04: Page→buffer copying includes unrelated rows and clarifies row count versus I/O. OS cache prevents buffer miss equaling drive read. TOAST caveat avoids all-columns absolute. Example page12 arbitrary explicitly; no unexplained locator derivation needed.
- 05: Update path caller checks result, version visibility carries prior learning. Dirty page can contain unfinished changes; physical persistence versus logical commit distinction expressly made before WAL. Sandbox limit honest.
- 06: WAL replays changes not SQL; page log position prevents repeated increment. WAL-before-page versus commit-record-before-success clarified, including possible early page write. Group flush and deferred random pages explain benefit. Precise physical durability caveat.
- 07: Physical replay of uncommitted row versions versus visible committed state explained. Three scenarios fix WAL/table/reply variables, making outcomes derivable. Torn page motivates full image; checkpoint term not yet explained but next section likely follows.
- 08: Checkpoint question resolved immediately, links recovery start and full-page-image frequency without equating checkpoint to commit durability.
- 09: Stable logical row count still accumulating physical versions follows prior diagram. Vacuum reuse versus file shrink, and checkpoint versus vacuum distinctions clear. Transaction-age maintenance is named but not required to current explanation.
- 10: Configurations have distinct failure consequences; unlogged explicitly loses committed data. Backup+archive beyond active WAL is clear, and accidental committed deletion explains why crash recovery is insufficient. No gap.
- 11: Natural handoff to recovery operations.
- Writing judgment: The same price update connects page reads, versions, WAL, crash outcomes, checkpoint and vacuum. Each mechanism resolves a question raised by the previous one. Clear distinction between observed teaching and unrun crash histories. No consequential prose repair.

## Slow queries
- 00: Performance deep dive.
- 01 opening: Caller wait versus engine work broadens performance; concrete alternatives prepare diagnosis.
- 02: Predictable intervention is the article's useful promise, not generic tuning checklist.
- 03: Invented timing versus real single-engine counts clearly separated.
- 04: Diagnosis route visible.
- 05: Non-overlapping 80+12+70+18=180 supports saved-time reasoning. Batching removes trips, not asserted fixed speedup. Pool size across instances and double-counted spans explained. Concrete diagnosis retained.
- 06: Operator caller, privileges, separate monitoring connection and sampling transaction scope are specified. Fields map to a concrete blocker; query_age not CPU explained. Recommendation to shorten lock period preserves payment guarantees instead of just commit early. Practical completion sound.
- 07: Exact 10→5000→10 workload changes support cardinality lesson. Reader can infer estimate change without promised speedup. Setup lives in linked sandbox; passage describes states, not standalone runnable setup. Prior query/index lessons support technical terms.
- 08: Explains why unchanged SQL can slow with state. Old snapshot removal enables cleanup but not instant compaction, clear operational consequence. Builds directly on storage.
- 09: Test hypotheses remain tied to examples. Arrival-rate self-throttling issue explained in plain terms. Percentile definition and timeout treatment concrete. Rollout and reversal proportionate to service-level change.
- 10: Handoffs fit diagnosed layers.
- Writing judgment: Performance guidance is explained through measured boundaries and concrete hypotheses rather than a list of tuning tips. Prior mechanics make the operational advice intelligible. No consequential prose gap identified.

## Request cost
- 00: Request-level performance depth.
- 01 opening: Response assembly and trips form cost, grounded in real endpoint objects.
- 02: ORM defined by behavior and hidden timing; inspect SQL follows logically.
- 03: Exact row derivation promised.
- 04: Route stays on one response.
- 05: New 101/102/103 dataset and authoritative selected parent page explicitly stated. €25/€8/empty inputs support later aggregate. N+1 exact and delay arithmetic qualified. Permissions not accidental afterthought.
- 06: Array membership introduced; grouping preserves empty parent and parent order. Batch bounds include child cardinality, not just parent count. Concurrent promises versus actual connection workers is a useful practical distinction.
- 07: Payment multiplicity applies earlier grain teaching to transfer and ORM cost. All amounts derivable, Sam preserved. Aggregate-all example restricted to three and warns selected IDs for larger system. Exercise gives six/€27 in same paragraph, so it functions as explained variation rather than an uncued prediction test; optional improvement to hide answer if prediction is intended.
- 08: Batch split may change snapshots, not silently treated as pure optimization. Same-client transaction versus pool convenience method concrete; release boundary follows required work. Prior transaction lessons support all terms.
- 09: Tests follow semantic risks from examples, paired with cost metrics. No necessary gap.
- Writing judgment: The request story is precise and accessible; small exact records earn both batching and aggregation recommendations. Only optional refinement: present third-payment answer separately if it should be a genuine prediction exercise. No required repair.

## Reporting
- 00: Reporting workload depth.
- 01 opening: Operational versus broad reporting questions concrete, same data motivates contention.
- 02: Shared resources explain read-only report interference; no assumption of lock conflict needed.
- 03: Meaning/work/freshness three decision premises laid out.
- 04: Structure follows decisions.
- 05: Reporting day already resolved, one sale contribution and excluded accounting meanings bounded. Exact totals derivable. Missing day no group and corrections policy clear.
- 06: Prior plan/memory/index teaching supports why 365 output may be expensive. Reuse opportunity comes from ten repeated identical reports, not mere table size.
- 07: Ordinary view versus stored view, live correction €55 versus stored €50 and unchanged count all derived. Refresh performs full definition not automatic delta, well shown. Three-row limitations explicit.
- 08: Snapshot versus publication timestamp is concrete 12:00–12:04. Incremental correction delta, day move and deletion demonstrate extra obligations. Full refresh is retained as viable choice; no gratuitous complexity recommendation.
- 09: €50→€55 correction travels through copy pipeline, explaining lag concretely. Alternatives fit workload/freshness and copying obligations; enough for decision rather than full migration implementation.
- Writing judgment: Small correction example carries the report through storage, refresh and replication, preventing vague freshness advice. Distinct mechanisms explained at useful depth. No consequential repair found.

## Scaling
- 00: Scaling deep dive.
- 01 opening: Capacity/resource/hot-row limits distinguished with concrete symptoms; expect diagnosing before topology.
- 02: Options tied to what next request can do, not labels.
- 03: New tenants unequal scale sets useful skew premise, but tenant word not explicitly defined. Application engineer likely knows multi-customer service? Could simply define tenant as one hosted shop to remove small inference; immediately 'Tenant7 small shop' effectively does it.
- 04: Structure progresses from demand to failure capacity.
- 05: Twice checkouts with fixed latency/failure plus competing work is testable target. Hot-record versus independent CPU distinguishes reasons to scale. Inventory reallocation is appropriately optional onward design question.
- 06: One-server scaling retains transaction boundary; local partitions narrow ranges/maintenance but do not add writers. Prior lessons support specific work reduction recommendations.
- 07: Cache hit/miss restart behavior and cached-stock non-reservation are concrete. Replica address-after-write counterexample earns routing requirement. Feedback cleanup pressure briefly introduced and assigned deeper destination; sufficient for topology choice.
- 08: Ownership, local checkout, global uniqueness/report costs and giant tenant limit derive from tenant example. Router does not supply distributed transaction capability. No unsupported recommendation.
- 09: Cluster ambiguity grounded in where next write goes. Shared storage is new arrangement but explanation is sufficient and avoids false physical single-disk inference. Capacity examples qualitative, not exact overhead estimate.
- 10: Failover may be correct but capacity insufficient; surviving dependencies and spare resources concretely named. Previous retry identity links supported. Good decision close.
- Writing judgment: Broad survey remains causal because every arrangement answers where tenant checkout goes and what resource remains shared. It provides selection premises rather than a universal scale recipe. No consequential gap found.

## Replicas and failover
- 00: Replication depth.
- 01 opening: Received/durable/readable split promises useful precision beyond 'has copy'.
- 02: Separate stages grounded in earlier WAL mental model; consequences explicit.
- 03: Explicit new price baseline €20→€25 and named engine; one change links all questions.
- 04: Sequence matches opening promise.
- 05: Three states and read outputs derive from saved versus applied. Existing snapshot caveat ties prior isolation. LSN and history caveat sufficient for abstract positions. Logical replication replacement limit clear.
- 06: Ack mode matrix explains what remains unfinished, including on with no configured standby. Failure domain/confirming copy condition and temporary weakening consequence are concrete. No unsupported assumption about loss bound.
- 07: Fresh read routing includes apply marker, new snapshot and timeout branch; fixed sleep rejected by explained failure cases. Actual token mechanics intentionally engine-specific onward work. Minor actor change 'customer changes price' is odd for shop administration but does not impair mechanism.
- 08: Timeout ambiguity leads to split writer concrete double mug sale. Fencing mechanisms and old connections make authority tangible. Five-stage failover includes restore protection; saved-not-applied candidate can recover €25, lagging C not guaranteed. Strong practical reasoning.
- 09: Failure domain and RPO/RTO defined through same shop guarantees. Remote ack availability cost derives from connectivity. No mystery terminology left required.
- 10: Monitoring query maps directly to introduced stages; byte lag not time estimate explained. Retention storage pressure and accurate replication of bad deletion close lifecycle.
- Writing judgment: One price mutation keeps durability, readable progress and failover tied to observable outcomes. Fencing explanation is especially successful. Only optional copy edit: use staff/editor rather than customer as price-changing actor. No necessary repair.

## Partitioning and sharding
- 00: Dividing data depth.
- 01 opening: Boundaries determine query, movement and enforcement; clear connected scope.
- 02: Partition child routing versus shard server ownership explicit, same tenant story.
- 03: Promised local demonstration then conceptual ownership move is appropriate.
- 04: Route covers operation not just design vocabulary.
- 05: Exclusive date bounds and exact three rows support pruning/unpruned tenant answer. Parent/schema versus lesson setup duplication warned. Append defined as combining branches. No measurement overstated.
- 06: Composite key changed uniqueness illustrated by same order ID two dates. Generated ID likelihood versus enforcement is precise. December missing-range failure, default destination and detached≠deleted distinguish operational outcomes. No gap.
- 07: Logical bucket vs machine owner explains movement capability; tenant authorization and co-location explicit. Hashing tradeoff follows operations and skew, not even bytes. Good practical conceptual depth.
- 08: Global totals/top20 and unique code explain cross-owner work and limits. Snapshot inconsistency uses transfer, known transaction principle. Distributed protocol deliberately onward scope; no pretend turnkey sharding.
- 09: Equal two-row counts with three defects is excellent concrete verification trap. Snapshot/change-stream no-gap obligation and idempotent replay make mechanism needed explicit. Custom protocol not claimed implemented by sandbox.
- 10: Stop admissions plus drain old writers establishes final comparison state; EXCEPT in both directions derives zero requirement. Generation recognition versus enforcement race explained, including old connections. Post-cutover B35/A30 proves old-copy rollback unsafe. Full invariant-level protocol complete, production implementation explicitly not provided.
- Writing judgment: Strong bridge from local partition predicates to distributed authority. Equal-count stale copy and post-cutover reversal examples carry the operational argument. No consequential text gap; substantial depth fits the live-move promise.

## Schema changes
- 00: Operational migration article.
- 01 opening: Agreement with coexisting callers is concrete, separate deployment events establish migration problem.
- 02: Four jobs include incoming writers, avoids backfill-only framing.
- 03: Same meaning rename scopes conversion out appropriately; expect old/new writer protocol.
- 04: Stage sequence fits promise.
- 05: Stage matrix sets authority and order. B fully deployed before C new-only writes avoids readers depending on old missing values. I expect trigger to handle mixed old/new writes without overriding C's field; retain this question for code.
- 06: Trigger fires INSERT or UPDATE OF old, leaves new-only inserts intact, overwrites conflicting dual values deliberately. Initial code's authority compatible with stage matrix. Alternative ALTER clearly replacement, rollback after timeout named. PL/pgSQL NEW/TG_OP meanings described in prose by behavior but syntax not line-by-line; basic programmer can follow IF from explanation.
- 07: Batch identities and NULL condition support resume; trigger prevents stale copied value after old write. Current-row expression explained, concurrent behavior bounded to engine rules and actual-server test. Efficient remaining-work access and post-commit progress covered.
- 08: Null-aware comparison IS DISTINCT FROM appears without definition; I supplied its NULL-safe inequality semantics from expertise. Surrounding sentence says equality check but does not explain why ordinary <> is insufficient. Small useful explanation would let a reader adapt the verification. NOT VALID future-enforced versus historical validation and separate commits are otherwise well explained.
- 09: C-only new field with old NULL proves rollback boundary; B reads new/writes old so coexists as stated. Reconcile old before A restores is required and stated. Retirement has concrete dependencies. No major gap.
- Writing judgment: Concrete three-release migration earns authority, trigger and rollback rules. One small necessary syntax explanation for adaptable verification: define IS DISTINCT FROM and its NULL behavior. No structural prose repair needed.

## Backup and restore
- 00: Backup operations.
- 01 opening: Recoverable service exceeds file presence; concrete steps establish operational promise.
- 02: Infrastructure/data/account failures distinguish usable copy and access authority. Prior replica lesson supports contrast.
- 03: Expect restored records versus acknowledged intent comparison, not just backup types.
- 04: Recovery lifecycle structure.
- 05: Acknowledged req-b absent is concrete discrepancy. RPO discussion correctly says missing one-minute-old request alone does not identify actual recovery point; seven-minute earlier would fail two-minute goal. RTO includes access/validation/reconnection; external effects survive rewind, important next obligation.
- 06: Logical dump not WAL base; physical chain and chosen point consequences clear. Dependencies and authority make recovery usable rather than syntactically restored.
- 07: Drill caller, credentials, tools, disposable target and chronological dump gap explicit. No-owner/no-acl permissions limitation visible. Unexecuted server drill honestly distinguished from SQL model; cannot establish recovery time or integrity through reading. This is a material validation limit, not necessarily explanatory defect.
- 08: Receipt LEFT JOIN yields req-b/8/NULL from visible data; related records/external state/permissions/deletion replay included before traffic. Two syntax shortcuts not previously taught: USING(request_key) matches same-named columns, and IS DISTINCT FROM compares NULL safely. I infer both from expertise; briefly glossing them would improve reader adaptation. The missing-key OR makes this specific example understandable even without NULL-safe comparison semantics.
- 09: Retention includes WAL and keys; evidence-driven completion condition consistent with unrun drill limitation.
- Writing judgment: Clear recovery scope with an exact acknowledged-missing-order case. Short glosses for USING and IS DISTINCT FROM would help the learner follow verification SQL. Server drill remains explicitly unexecuted, so this reading confirms explanation, not actual restoration.

## Access control
- 00: Access operations.
- 01 opening: Connection identity and narrowed consequences clear; owner powers motivate separation.
- 02: Authentication/object privilege/row policy/application authorization distinguished before example.
- 03: Worker permissions contract specific and testable. 'mark packed' might imply only status transition; check whether later grant also permits arbitrary state changes.
- 04: Route tests actual identity, good.
- 05: NOLOGIN permission role versus real login and admin sandbox identity clear. Membership path caveat materially important; controlled SET ROLE testing appropriately bounded.
- 06: Namespace/schema distinction from earlier structural schema usage is now defined. Required read privileges for WHERE/RETURNING good. Column grant can be defeated by broad grant through membership/PUBLIC, explicit. Still outstanding: UPDATE(status) permits any valid state, not only packing.
- 07: USING/WITH CHECK explained by old row versus new values and no command grant. Fixed tenant context justified, bypass/owner caveats connected to test identity. No unsupported RLS security claim.
- 08: Exact effective-role outputs, email error versus hidden-row zero result, and delete error establish separate boundaries. Failed statements autocommit and pool reset context explicit. Positive workflow tested along with denials. Status grant leaves workflow-state validation separate; article promises column authority, not a state machine, so this is optional onward curiosity rather than a defect.
- 09: New example for default grants marked separate reporting policy. Creator/global/schema default composition explains pitfalls rather than assuming inheritance. Audit application user versus shared DB role meaningful. End state matches tested outcomes.
- Writing judgment: A precise worker contract turns access vocabulary into observable allowed/denied outcomes. Same-connection test and deployment identity limits remain visible. No consequential prose gap; business-state transition restriction is a separate topic if needed.

## Data lifecycle
- 00: Retention operations.
- 01 opening: Copy lifecycle concrete; deletion scope problem established.
- 02: Immediate removal, inaccessible retained copy, restore prevention distinct promises.
- 03: Chosen complete live removal and policy/legal scope clear without unnecessary prescription.
- 04: Route follows copies and restore.
- 05: Exact identities/notes/snapshot and minimal ledger establish deletion/replay roles. Stable ID ledger retention is not mistaken for erased data; inventory extends beyond FKs and soft deletion properly scoped.
- 06: FK error taught from exact note; manual child delete transaction produces 1/1/2 counts. Ledger/live atomicity clear. Large-job intermediate state obligations and physical erasure limits add practical completeness. First failed delete execution transaction context not explicit here; lesson may autocommit (prior patterns), optional one sentence could avoid failed-transaction confusion if readers wrap it. Not claiming execution tested.
- 07: Durable destination progress and stale update recreating deleted profile give outbox/tombstone need concrete cause. Completion state reflects pending destinations; good.
- 08: Independent deletion ledger requirement is essential and stated. Repeated suppression's idempotence derives from absent-row deletion. Identity reuse risk and expiry tied to oldest reintroducing input are clear. DELETE ... USING is new syntax; I supplied that it joins target rows to the ledger for deletion. Brief gloss would support adapting this safety-critical replay; JOIN USING also still unglossed on initial route.
- 09: Event versus ingestion retention origin and monthly boundary explain partition limitations. Detach does not delete reiterated where needed. Completion assertions map to processes taught, without choosing legal periods.
- Writing judgment: The lifecycle follows one identity through live records, active copies and restore suppression, giving retention concrete outcomes. Minor necessary adaptation aid: explain DELETE USING and its target versus matching ledger; optionally state first deliberate FK rejection runs in autocommit. No structural gap.

## Product comparison
- 00: Product decision deep dive.
- 01 opening: Product choice changes operating and concurrency contract; grounded in prior lessons.
- 02: Three workloads distinguish constraints; expect candidates explained by consequences.
- 03: Versions/time anchored; current factual verification belongs other reviewer, this is comprehension.
- 04: Criteria tied to operation rather than feature checklist.
- 05: Embedded can serve website through local app, avoiding simplistic users=server rule. SQLite one-writer consequences and cross-machine file issue concrete. Existing platform starting-point heuristic justified by known operating knowledge, not universal ranking.
- 06: Isolation differences tied to two-read screen, SQL Server setting explained. PostgreSQL 18.005→18.01→36.02 example is complete and explicitly not evidence about other products. 'SQLite type affinity' and 'MySQL SQL mode' are labels without enough behavior to understand why candidate tests may differ; I supplied affinity's conversion/flexible storage meaning from expertise. A compact example or definition would make this comparison more useful without expanding into four full tutorials. This does not block the PostgreSQL trace.
- 07: Heap versus clustered primary then secondary lookup is precise and operationally meaningful. SQL Server key versus clustering distinction good. JSON paragraph remains broad but appropriately says test required operations; no unsupported superiority claim.
- 08: Engine/edition/service boundaries clear and actual operator privileges included. Prior failover/restore/migration reading supplies concrete drill content. No universal cost ranking attempted.
- 09: Final choices are bounded starting points, with same business outcomes rather than copied physical designs. Adequate decision frame; practical full comparative prototype beyond article scope.
- Writing judgment: Comparative choices are concrete where deployment, isolation and storage differ. Data-conversion paragraph briefly retreats into product labels (affinity/SQL mode); explaining one consequence of each would support its claim. No ranked product verdict is needed for this scope.

## Adding another system
- 00: New-system decision.
- 01 opening: Capability/resource need plus copied-facts responsibility; specific search/report examples.
- 02: Tasks before product names, clear criteria path.
- 03: Search progression promises source ownership/freshness/completeness; one-connection model scope explicit.
- 04: Sequence reaches operation beyond initial feature demo.
- 05: Search quality acceptance cases concrete, withdrawal freshness stakes separated. Current performance problem must be measured; prior guides provide mechanics.
- 06: Generated terms and AND semantics let reader derive sole Blue mugs result; typo limitation defined. Rename Blue ceramic cup changes matching atomically with source, concrete advantage. Ranking quality/capacity unclaimed from three rows, sound.
- 07: Stale positive versus unseen new item and non-atomic recheck caveats are concrete. Version2 withdrawal followed by old update sets next delivery rule. Model boundary explicit.
- 08: Complete-state monotonic version rule has atomic SQL and EXCLUDED explained. Incremental event counterexample bounds skipping older state. Tombstone deletion version prevents resurrection; horizon criterion follows lifecycle. Outbox obligation vs destination transaction explicit.
- 09: Rebuild snapshot/stream gap and overlap reconciled through already-taught versions. 'Queue depth alone' and known recent test signal explain observability. Rollback needs still-valid old copy, following shard lesson. No gap.
- 10: Conditional choice follows capability and operating evidence; no arbitrary second-service recommendation. No necessary explanation missing.
- Writing judgment: Search result semantics lead naturally to copying obligations. Full-state versus delta replay and retained withdrawal version are strong explanations. No consequential initial text gap found; revised version will be assessed independently of intended repairs.

## Practice
- 00: Practice setup destination reached after articles; prior articles repeatedly linked it before exercises.
- 01 opening: Explaining independent of execution and per-article fresh databases directly address route resets.
- 02: Browser versus local multi-connection capabilities clear.
- 03: Caller terminal/Docker/container/client explained, readiness response exact and errors actionable. Not executed here; syntax reading only.
- 04: Host downloads versus container file visibility explicitly bridged. Filename variation and optional later copies prevent common setup confusion.
- 05: Prompt change and psql meta-command vs SQL distinction explained; exact baseline receipt/count and failed transaction branch clear. Covers earlier lifecycle autocommit concern if user follows shared guide, so that concern is optional reminder only.
- 06: Per-article fresh DB table, temp-table session lifetime, rerun SELECT not INSERT and script statement boundaries solve setup continuity. Two sessions same DB explicitly instructed. No gap.
- 07: Later independent lesson scope and model/server distinction clear. Does not falsely reuse shop base everywhere.
- 08: Cleanup data loss scoped to disposable container and downloadable scripts retained; concrete completion.
- Optional: Full script final state versus stepwise article beginning explicitly distinguished. JSON material final stoneware reset avoids apparent contradiction with earlier ceramic query. Existing installation fallback appropriately assumes its own authentication.
- Writing judgment: Setup guide explains each context transition and result checkpoint patiently. No execution failure observed because this is reading, not running Docker. No necessary prose repair.

## Initial-route disposition

All 26 substantive destinations were read in the assigned order, preserving each chunk's observations before opening the next. Each default-visible article has a distinct writing judgment above. Optional material was inspected separately where present. The route builds enough prerequisites for its later operational decisions: identity and grain, then concurrency and visibility, access structures and physical recovery, then request/workload diagnosis and ownership of copies.

The initial artifacts show no major break in the connected argument. Required repairs are small teaching glosses, in reading order:

1. Schema changes: explain `IS DISTINCT FROM` as NULL-aware inequality, so the reader knows why the verification detects missing/new differences that `<>` would not reliably find. Recheck with old text versus new NULL and two NULLs.
2. Backup and restore: explain `JOIN ... USING (request_key)` as equality on the same-named columns and reinforce NULL-safe difference in the reconciliation predicate. Recheck absent req-b and wrong nonmissing amount.
3. Data lifecycle: explain `DELETE ... USING` as deleting the target table's matching rows while using the ledger as a match source. Recheck that suppression removes Ada's profile/notes without deleting the ledger.
4. Product comparison: explain one concrete consequence of SQLite affinity and MySQL SQL mode; the names alone do not teach the conversion difference. Preserve the distinction between observed PostgreSQL example and other documented behavior.

Reduced-effort/optional refinements: move the request-cost third-payment answer behind its prediction if an uncued exercise is intended; call the replica price editor a staff member rather than customer. The default practice guide already covers failed statements outside/inside transactions, so repeating that in lifecycle is optional.

Successful explanations to preserve: historical versus current prices; decomposition without invented matches; grain before join totals; emitted rows and loops; caller/driver/same-connection transaction branching; zero result versus known failure versus unknown commit; same-row versus cross-row guards; WAL/data/ack stages; applied versus durable replication; equal counts hiding wrong migrated records; source authority and versioned derived-state replay.

Limits: native desktop normal-form figures 1–5 in modelling were inspected and readable. Full-page introduction screenshot was viewed but too reduced to establish figure detail. Most other figures were read through their default-visible captions/transcripts, not yet verified visually; native supplementary image review follows separately. Live interactive behavior was not exercised. Browser/server setup and restore procedures were read, not executed. This is an informed agent review, not a novice usability test or factual/source audit.

## Supplementary native figure inspection after the complete reading

Inspected every supplied initial figure at 1280 light (introduction 0–4; modelling 0–8; constraints 0–2; tables-and-documents 0–3; query-results 0–3; query-execution 0–1; large-results 0; transaction-boundaries 0–3; isolation 0–1; conflicts-and-retries 0–3; checkout 0–1; indexes 0–1; storage 0–2; scaling 0–1). This inspection follows the sequential text reading except modelling 1–5, which were inspected during it. It must not be represented as first exposure to the explanations.

The native drawings preserve exact identities and results. Useful visual relationships include the crossed false pairs in lossless splitting; the separate line/shipment inputs leading to four matched pairs; waiting before a decision versus waiting after it; identical missing replies following different durable outcomes; and the root/leaf/table-page path. Arrows and borders agree with the prose. No consequential additional comprehension defect found. The plan comparison preserves emitted-row counts and distinguishes the two aggregation methods.

Also inspected 390 dark crops for modelling 3, constraints 1, query-results 1, query-execution 0, transaction-boundaries 2, isolation 1, and indexes 0. Text remains legible and wrapping preserves sequence; stacked plan/relationship layouts remain understandable. The modelling crop explicitly signals horizontal scrolling. These samples do not establish all mobile/theme rendering, keyboard behavior, or live interaction. The review has not exercised interactive controls.
