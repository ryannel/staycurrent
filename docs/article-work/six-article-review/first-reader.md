# Independent first reading

Audience: a curious software engineer familiar with relational rows, columns and basic SELECT. Ordered route: modelling, constraints, tables-and-documents, query-results, query-execution, large-results. Artifacts: assembled HTML text extractions in reading/, identified by reading/manifest.json SHA256 values. No author source or history consulted. Opening paragraph/figure/nav chunks were delivered together as a complete opening; subsequent substantive chunks delivered individually and observations saved before advancing. Closed disclosures are optional reading, not default-visible content. This is text reading, not visual or browser interaction validation. No human novice session or database setup was run.

## Modelling

Opening (01–08): I can distinguish schema from records, and explain why table design records assumptions about identity, relationships and time. “Does a price mean the price today, or ... last year?” makes the stakes concrete. The schema/data figure supplies the definition-to-example bridge. Normalisation is introduced as organising independently changeable facts; I cannot yet perform it, which is the promised work of the body. No opening gap. Primary key definition is sufficient here. Reading navigation names Constraints and Rows/JSON, so I expect those decisions in this article before the follow-ons.

09: I can now explain why repeated customer names create three sorts of interference, while repeated customer IDs are useful references. The final distinction avoids the easy but wrong takeaway “remove every repeated value.” I can predict deleting O12 leaves C4 in the separated design. The next question—what identifies each sort of record—is earned.

10: Order versus line is patiently established before keys. I can derive why (order_id,line_no) is needed and why product_id would enforce a different business rule. Continuity recorded: O12 = two P7 at €18; O13 = one P7 at €20 and one P8 at €24; both C4. Candidate-key minimality is explained in ordinary language. No unsupported step.

11: Functional dependency is understandable as an application rule, not a coincidence in sample values. “Determines does not mean never changes” resolves the question at exactly the right moment. I can distinguish P7 current price from O12 line’s agreed price using the prior orders.

12: This section arrived as one large chunk (all three normal forms), a weaker sequential test within the section. Still, each move is motivated before the diagram. I can trace O13 lines to one order, both orders to C4, and both P7 lines to one current product. Keeping €18 on O12 gives historical meaning to the otherwise abstract dependency distinction. The fourth-product problem explains why rows help without overstating 1NF. The relationship summary lets me stop carrying all four tables in memory. Closed disclosure “Third normal form when candidate keys overlap” was only a labelled boundary, with no content supplied; not read. No necessary gap in the visible sequence.

13: Strong passage: the intentionally lossy product/price split supplies a real reason for retaining a complete identity. I can calculate the four matches without knowing JOIN syntax, and understand why two are invented. The last sentence of its caption usefully distinguishes possible from worthwhile separation. I now carry join multiplicity forward into later articles.

14: I can predict name corrections should propagate to current customer displays while the €36 receipt survives catalogue changes. The model explicitly resets catalogue to €18, so its difference from earlier €20 is signalled. Product-name snapshots extend the price lesson naturally. Extracted model state is not evidence of live button behaviour; optional assumptions disclosure content absent.

15: I can decide that splitting one name and one current price by product ID gains no normalisation benefit. Summary maintenance is understandable without transaction mechanics; “same transaction” is a term supplied from prior expertise but not needed to follow the choice because refresh is the contrasting concrete operation. Index details are deferred appropriately to query work. No demand for a detour.

16: Concrete text “10” versus number 10 and postal-code zeroes explain types as meaning rather than storage jargon. I can predict numeric(12,2) retains 18.01, not the original 18.005. Missing values and units are distinguished clearly. A fairly long catalogue of type choices, but all relate to a design decision; no extra definitions needed. Dates use a new 09:00 example rather than claiming O13 was at 09:00, so no continuity conflict.

17: The introduction “assumption made by readers ... obligation for writers” connects constraints to the preceding reconstruction reasoning. SQL syntax gets immediate explanations for NULL, NaN, composite key, foreign key and deletion behaviour. I can adapt the insert because the explicit column list maps each literal. Important granularity limit: this chunk supplied experiment controls, its initial accepted state and the later accepted-case summary together, so no independent prediction-before-answer test was preserved here. Optional model assumptions were only a label. The limits paragraph clearly separates every line has an order from every order has a line.

18: JSON choice follows the same ownership/rules reasoning, not a binary relational/document allegiance. I can explain why capacity wants a number and unit, why object validity is weaker than attribute validity, and why supplier offers want identities and references. The typed-input warning explicitly separates incoming value from retained value. Optional SQL disclosures were not supplied; visible prose still makes the resulting query and its limits comprehensible.

19: The fresh-load reset explicitly protects continuity after the earlier accepted second-line insert. Aliases and calculated fields are explained before code. Prediction before disclosure: Sea-blue mug, quantity 2, unit price 18.00, total 36.00; original printed name cannot be recovered because query retrieves current products.name and no historical name was stored. This follows from 14 and is reinforced by the immediately preceding worked query. Optional answer not supplied, therefore unopened. Setup instructions are linked but not followed; no observed execution problem.

20–21: Supplement links accurately describe further depth. Main article succeeds as a long but connected route from facts to rules; no consequential comprehension repair identified on visible path. Sources establish PostgreSQL/version and invented example, not independently verified here.

## Constraints

Opening (01–06): I understand why checking availability does not reserve a value, and why a shared schema rule serves multiple writers. This follows modelling naturally. Direct entry also receives definitions of constraint, order line and foreign key; it is not merely told to remember them. The opening generates precise questions about concurrency, NULL and deletion.

07: The “ordinary operation it must still allow” test is valuable, and previous key choices make the example effortless. Direct entrants also get the reason for composite scope rather than unexplained jargon.

08: Facts are restated precisely, including optional SKU. The distinction between product ID and SKU is enough to follow the upcoming NULL uniqueness rule. Runnable definitions and records are optional and absent in extraction; the prose still describes starting state. Failed-write transaction guidance is extra for someone running code, not required for comprehension.

09: The explanation correctly prevents “NULL is positive” as the inference from accepted NULL. I can predict the interactive NULL check becomes unknown and only NOT NULL rejects it; learned in modelling and repeated here. The input-to-retained-value distinction also survives. No comprehension gap. Inline accepted/rejected probe comments are teaching examples, not hidden prediction answers.

10: Can map all line attempts to rules and distinguish pair uniqueness from uniqueness of each field. Small sequencing effort: P7’s MUG-BLUE and P8’s missing SKU appear in the explanation after their probe inserts; they were not in visible initial records (optional data disclosure omitted). Thus I cannot predict those two inserts from visible setup before the result, but the next paragraph supplies the exact facts and makes the demonstration clear. This is not a blocked exercise; at most moving those two facts ahead of code would reduce effort. Case comparison is an appropriate onward design question, not an unexplained prerequisite.

11: The shipment pair example explicitly resets O12 before using its missing line 2, preserving continuity. Deletion diagram text explains direction and survivors well: deleting a referencing line does not delete its product. NO ACTION/deferral is a dense final aside; understanding timing remains a curiosity because the declared design is immediate and the next section promises transactions. No necessary repair yet.

12: Transaction gets a timely definition, and the two-column sequence makes competing checks versus competing writes easy to distinguish. I can predict B proceeds after A rolls back and fails after A commits. The application branch is a comment, not misleading executable SQL. The opening’s main question is answered completely at this level.

13: Wider-operation boundary is concrete and convincing: constraints permit a valid empty order, transaction scope must be chosen, and stock read freshness is a separate problem. This points to a next investigation without making its details necessary to the current article. No consequential visible-path repair found. The small SKU setup-before-code improvement is optional.

14–15: Further-reading note honestly distinguishes checked single-connection results and illustrative concurrency timeline.

## Tables and JSON

Opening (01–04): I understand JSON as structure inside a column, alongside the outer schema. The mug/book/lamp difference gives a reason to consider it. I expect decisions based on operations and rules, not a competition between database categories. Earlier modelling supplies the stronger ownership idea; direct entrants get an adequate initial distinction but not yet enough to choose, which the body promises.

05: Good distinction between object keys and database keys; it heads off ambiguity from prior articles. Row outlines explain the same capacity in three places without calling either nesting or splitting intrinsically more normalised. I can trace packaging height inside P7 and explain why no packaging row exists. Strong support for understanding boundaries; visual clarity still untested.

06: Conditional product-kind rules make the pressure from sparse columns precise. “A few optional attributes do not make a table defective” prevents overcorrection. P8 diameter is newly introduced and consistently separate from P7 capacity. No gap.

07: I can explain each declaration with prior learning, and direct entrants receive its outcome. Promise to finish input-fraction policy is explicit, so I retain that question. Generic triples is a useful brief counterexample; it does not force a detour into EAV terminology. No missing step for the chosen details table.

08: Explicit reset distinguishes alternative schema from runnable JSON path. I know the initial object keys and values before later extraction. Parser/object/application meaning is separated cleanly, and the next question—querying inconsistent values—arises naturally.

09: WITH/VALUES scaffolding is explained before the unfamiliar query, so the stated audience can trace the five rows. The result table makes the lost distinctions visible: string versus number collapse to text; missing versus JSON null collapse to SQL NULL. I can predict the probe variants from that table. This is a substantial concept, taught without relying on the reader already knowing JSON operators.

10: The temporary mismatch is deliberately exposed: allowing numeric fractions does not make the integer-reading query safe. “Finish the capacity rule” answers the promise from 07 and supplies an explicit input table plus a usable final query. I can adapt the policy and know rejected conversions leave source JSON intact. No unfinished practical choice in visible prose; optional implementation still needs separate inspection. One small timing point: WHERE keeping true and discarding unknown is stated here before the query-results article, enough to interpret P8.

11: The old-copy example is particularly effective: I can follow gloss → matte → overwritten gloss and see why sequential locking alone cannot repair the submitted object. Explicit independent initial state avoids conflict with the migrated P7 above. jsonb_set argument explanation makes the remedy adaptable. Index paragraph introduces GIN/B-tree briefly but explains what entries/order provide; details belong to query execution. Separate-row figure text makes the concurrency boundary concrete without promising total independence.

12: Renaming a JSON key connects schema flexibility to reader/writer compatibility concretely. No new mechanism needed; the previously completed capacity conversion anchors the migration concept.

13: Final design preserves one authoritative capacity and deliberately retains only descriptive fields in JSON. I can defend each boundary using reads, updates and rules. No consequential comprehension gap in visible article. Main strength is completing the fraction/query problem rather than ending at a warning.

14–15: Navigation leads back to main query path; sources scope performance claims carefully.

## Query results

Opening (01–06): I understand why a query reconstructs a view different from stored facts and why result-row meaning matters. Earlier modelling already taught join reconstruction; direct entry gets motivation and explicit table/column/key prerequisites. Promise includes both correctness and physical work, so I expect a longer main article before execution supplement. No opening gap.

07: Row meaning becomes three explicit answers from identical purchases. I can derive O13 20 and 24 and know the computed field is not stored. SELECT clauses, quotes, order and terminator are explained at an appropriate level. Parameter aside adds a useful application constraint but does not distract from the example.

08: Uniqueness plus existence is used to derive exact join cardinality, carrying constraints forward effectively. “Removing the line number ... hides that distinction; it does not remove the result rows” is memorable and precise. I can track P7’s legitimate repetition.

09: O14 and C5 additions are explicit. Cara’s isolated-copy setup is also explicit in main prose, so missing optional setup does not hide identities. Worked ON/WHERE difference is unusually good: Cara has a real earlier match, so filtering her out cannot synthesize a new null row. Ben versus O14 teaches absence of relationship versus an incomplete existing entity. I can predict all four ON rows and two WHERE rows from the supplied inputs.

10: COUNT(*) versus COUNT(non-null key) is established with an actual null-extended row, not a rule to memorise. COALESCE is carefully a report convention, not proof of a complete purchase. HAVING/WHERE numeric counterexample supplies a concrete reason. No gap.

11: Line–shipment pairs reproduce the lossless-join lesson in an intentional reporting mistake, but are fully explained for a direct entrant too. The two intermediate summaries make the repair visible. Prediction before optional answer: 3×3 = 9 pairs; true line total 20+24+20 = 64, joined sum 192; separate summaries O13 amount 64 and shipment_count 3; SUM(DISTINCT amount) gives 44 and loses the separate €20 purchase. Prior example plus explicit added rows supplies everything needed. Optional answer not yet read.

12: SELECT 1 and outer reference are explained immediately; can distinguish selecting orders by a yes/no condition from selecting matching pairs. O14 result follows the explicit addition. No gap.

13: Practical debugging method comes from the exact earlier failure, so it feels earned. Transition to execution preserves result semantics as the invariant, a clear next step.

14: The concrete receipt avoids changing the subject when introducing plans. I can trace Seq Scan: 3 inspected, 1 removed, 2 emitted; product materialization: 1 then 2 rows emitted, 1.5 average×2 loops=3, one rejected pair. Materialize and dependency tree receive enough explanation to interpret the odd fractional count. Distinguishing movable inner-join filter from earlier outer-join filter recalls the reason semantics matter. Strong section.

15: The model explicitly differs from the observed early-stop plan, uses its own records, and counts heterogeneous work units separately. From prose I predict 200×6=1200 scan comparisons versus 200 entries+6 probes; reducing to one line keeps 200 build entries. Browser behaviour untested. Index-based nested loops are introduced as a third route, preventing the model’s simplicity becoming an anti-nested-loop lesson. Merge join brief description is enough to recognise the route, not enough to implement it; implementation is not promised.

16: Cardinality now connects semantic multiplicity to work. Concrete 2 estimated versus 20,000 observed explains why a plan can be bad without making operator names a verdict. Statistics and spill are described at sufficient depth for this overview. No consequential gap. The faster wrong €88 answer is an effective return to the reader’s actual task.

17–18: Further-depth articles are clearly separate from next main deep dive; read execution first by assigned review order. Source notes distinguish plan observation from browser experiment.

## Query execution

Opening (01–04): I can explain why one result has several possible work paths and how estimated versus actual rows help investigate. Prior article supplies enough knowledge of scans, indexes and joins that this feels like a focused continuation. Direct entry is explicitly told it builds on joins/grouping in the main article; the examples in the opening still explain the central tradeoff. No gap.

05: New numeric-ID dataset is clearly announced as separate, avoiding reuse confusion. Can independently derive 10 orders×3 lines=30 joined lines and product totals 10,20,30 before reading printed result. Both usable indexes are named before strategy discussion. No hidden setup prerequisite for meaning.

06: Bitmap label is unpacked into locations then table fetches, including lost index order. The repeated inner scan is traced through actual order IDs. I can interpret rows×loops and why early join output does not imply early aggregate output. The plan extraction may lose visual indentation, but prose names branches explicitly; browser reviewer must assess that separately.

07: Two sorts get different purposes and input sizes. The “ten ones” explanation is patient without padding. Blocking is distinguished from lock waiting. LIMIT 1 reasoning supplies the global-total dependency; can predict all 30 input rows remain necessary.

08: Separate join and aggregate hash tables are distinguished by keys and jobs, avoiding a common ambiguity. Same three result rows hide 30 versus 30,000 joined rows. Directly contrasting the plans strengthens the opening thesis. No need for hash internals to understand this choice.

09: Merge join is now traceable over actual IDs; repeated keys versus unique order side recalls earlier multiplicity. Temporary settings and rollback are explained as observing an alternative. “Order ID does not help group by product” connects useful ordering to the particular next operation. Text extraction runs IDs together in the figure, so cannot judge rendering from that.

10: Correlated customer/region example explains both wrong estimate and why ANALYZE alone cannot fix it. Can calculate 10×10%=1 mistaken prediction, then actual 10. Dependency statistics repair is scoped and rechecked without claiming plan must change. Cost/width definition is compact and enough to read excerpt. No gap.

11: Different growth drivers for join/aggregate memory are explained using known counts. Spilling experiment has a new query justified by what it needs to demonstrate; limitation about PGlite disk is clear. Can interpret external merge as storage use, not an automatic speed diagnosis.

12: Closing method follows the taught operations and retains result checking. Repeating setup reset prevents already-created statistics from ruining the experiment. No consequential comprehension repair found. Main strength: one controlled dataset grounds every plan and number.

13–14: Source note labels deliberately discouraged join methods and execution environment; no benchmark inference invited.

## Pagination and large results

Opening (01–05): I understand the memory/latency reason for batches and the two continuation choices: count past versus remember boundary. Fixed export versus live browsing gives the change question purpose before technical vocabulary. No prerequisite beyond familiar result rows for this opening.

06: Reused O14 time would have contradicted query article, but the reset is explicitly in main prose before records. I can derive O16/O15 first page and explain why O14 waits despite equal time. Total order is distinguished from frozen set. IDs need no generation-order assumption.

07: Offset duplication/skipping is derivable from explicit sequences and alternative resets. I can follow inserted O17 shifting old boundary, or deleted O16 hiding unread O14. Read Committed is defined at the exact point it explains why two reads differ, not used as unexplained jargon.

08: Pair comparison is explained lexicographically with a tied real row. I can adapt direction and know why a strict predicate matters. Deleting the boundary record is handled by saving values, a useful practical completion. At the newly offered interactive case “Move unread O14 to 13:00”, before next section, prediction: keyset misses O14 because it moves before saved boundary; offset current order becomes O14,O16,O15,O13,O12 so returns repeated O15 and O13. UI state not tested.

09: Token semantics are concrete, including query identity, precision and access checks. Extra-row lookahead explains which row must become next cursor, enabling implementation without a common off-by-one. Offset remains a legitimate bounded choice. No gap.

10: Index order follows filter then boundary, already prepared by execution lesson. Result-row meaning from query results reappears meaningfully: limit applies to lines when the join produces lines. Two-stage order paging is explained, with optional worked code deferred. No gap in why the step is needed.

11: Confirms my O14 movement prediction. Backdated inserts and updates explain the limit of keyset without undermining its actual benefit. “Range of keys ... values; snapshot ... versions” is concise but follows enough concrete cases to be understandable. New curiosity: how fixed view is held for export, expected next.

12: Explicit reset and oldest-first switch protect continuity. Commands are explained before/after code and connection lifetime is clear. I can derive fetches O12/O13, O14/O15, O16, then explain old versus corrected O14 in each view. API token/database cursor distinction is substantive, not terminology alone. Resource cost and stored-export alternative complete the choice without needing transaction internals now.

13: Effects/checkpoint boundary opens a legitimate next topic without pretending pagination solves it. The final three distinct promises are a useful outcome of the article. No consequential visible comprehension repair found.

14–15: Source note matches the distinction between observed single-connection cursor results and illustrative changing-data model.

## Subsequent optional reading

All initial default-visible observations above were completed before opening disclosure contents. The coordinator then preserved the original revision at initial-reading/ and initial-optional/. Use initial-reading/manifest.json as the identity of the reading above; the live reading/ folder now contains revisions. Verified the original pagination paragraph against the actual tool-delivered text: the first reading used original wording. Later diff inspection was after all first impressions, not part of their evidence.

Modelling optional 01–03: Formal 3NF aside is correctly scoped beyond the example. Model assumptions explicitly distinguish current names from historical invoice names, no transaction from propagated updates, and rule model from live database. These are useful boundaries but no visible-path misunderstanding required them to be opened.

Modelling optional 04–06: SQL setup states its initial schema and prior existence assumptions, and optional query explains aliases/join/filter before showing it. Exercise answer matches my recorded Sea-blue/2/18/36 prediction and historical-name reasoning. No added repair.

Constraints optional 01–03: Definitions and records make the SKU demonstration predictable before its code for readers opening them: P7 has MUG-BLUE and P8 has NULL. This resolves the optional-path aspect of the small visible-path sequencing observation; it does not change the original visible-path experience. Manual records contain only O12 while download is described as also containing O13; later composite-reference discussion explicitly returns to the earlier two-order example, so the visible explanation still supplies its state. No executed shipment query depends on unprovided manual O13 here. Rule-model scope is explicit.

Tables/JSON optional 01: Model boundary is clear and consistent with the visible diagnostic probe. No hidden assumption needed to interpret the main table.

Tables/JSON optional 02: The nested CASE is more complex SQL than preceding examples, but the prose explains evaluation boundary, range, whole-number test, rejected NULL and INSERT SELECT before code. I can trace 350.5 to inner ELSE NULL and rejection, and "350" to outer ELSE NULL without a cast. Rollback instruction and same-connection requirement make failed conversion handling concrete. This implements the visible policy; no missing practical completion observed.

Query results optional 01–03: Setup distinguishes extension from full schema and warns against double insertion. Temporary copy scope is explained. Exercise answer matches recorded 9 pairs/192/64/3/44 prediction. All default-visible state additions agree with optional code.

Pagination optional 01–03: Reset, statement boundaries and independent interactive alternatives are explicit. Oldest-first order paging produces three lines for two headers, as expected. One small clarification emerges only on this optional pass: original visible prose says “first select ... then retrieve” followed by “When both reads must share one view,” which can suggest two database requests are required. The optional WITH example correctly does both stages in one statement and explains shared view. The smallest visible repair is to mention that both stages can share one statement, reserving isolation discussion for separate requests. Recheck prediction: two headers O12/O13 produce three lines, all from the statement’s view. The coordinator’s subsequently seen revised paragraph makes exactly this clarification; that is a local informed assessment, not a fresh-reader result.

## Handoff

No consequential explanation failure on this six-article route. I could trace the records, derive the worked results, predict the two closed-answer exercises, and explain the final design/work choices from the supplied material. This is an agent reading of extracted text, not proof of novice comprehension or validation of diagrams, interactions, linked setup files or SQL execution.

Two small improvements are grounded in the reading:

- Constraints, “Unique values and keys”: on the default-visible path, move P7’s MUG-BLUE and P8’s missing SKU ahead of the two product insert probes if independent prediction of those probes is desired. The very next paragraph already explains outcomes, and optional records already supply the facts. Consequence is small extra effort, not a missing concept or required repair.
- Pagination, “The work behind a page”: clarify that header selection and line joining can occur within one statement. Original visible prose can imply two reads; optional SQL resolves it. Coordinator’s revised paragraph already appears to fix this locally.

Preserve these successful explanatory moves:

- Modelling: retained references versus repeated current facts; €18 historical price versus €20 current price; the four invented product/price pairs after dropping line identity.
- Constraints: both checks can be accurate without reserving the SKU; the writer sequence and commit/rollback outcomes; every line has an order versus every order has lines.
- Tables/JSON: same capacity across three row/value arrangements; extraction deliberately losing distinctions; finished capacity input policy; stale whole-object replacement despite sequential writes.
- Query results: row meaning before syntax; Cara’s earlier order distinguishing ON from WHERE; separate summaries repairing fanout; visible identities exposing the wrong total.
- Query execution: one generated dataset supporting the 30/30,000 comparison; two sorts with different jobs; distinct join/aggregate hash keys; 10×10%=1 estimate corrected with dependency statistics.
- Pagination: tied O14 requiring full pair continuation; explicit reused-record resets; saved boundary versus snapshot; API token versus database cursor; extra lookahead row does not become next cursor.

The overall voice is patient and concrete. Terminology usually arrives after a specific need, and definitions have enough operational support to be usable. Repetition across the main articles and their supplements often serves direct entrants; I did not find it obstructing the complete route. A lighter editorial pass might shorten repeated conclusions, but the first reading supplies no basis for making that a comprehension requirement.

No additional illustration or interaction is required by this text-only observation. Existing tables and narrated figures carry the memory burden at the difficult points. Browser review remains necessary for actual diagram legibility, plan indentation, control states and live model behaviour. Optional disclosures were read only afterwards and are separately recorded above; closed answers did not contaminate the receipt/fanout predictions.

## Separate fresh excerpt: partitioning

Artifact: partitioning-test.md, delivered as a single short excerpt after the six-article reading and optional pass. Its brief was visible in the file, so this is not blind to the stated audience/outcome; assessment below rests on the prose itself, with no supplied verdict. Opening and first section arrived together, so there was no tool-enforced pause before the section.

Before “Choosing what belongs together,” the prose teaches an operational model: one logical table has separately stored groups; the rule places each whole order in a month; a March condition lets the engine exclude February without examining its rows; a month can also become a retention unit. A customer-only question supplies no month to exclude and still needs a way to locate rows. I can now explain both the potential benefit and the reason it depends on the question. The March 14 order is especially useful because it establishes that the entire row moves together, rather than splitting its fields.

The opening is natural and economical. “The boundary of the storage matches the boundary of the work” follows concrete pruning and deletion examples, so the abstraction has earned its place. The first section names the partition key, then changes the workload to customer history and shows the cost to month-based maintenance. That advances the explanation instead of restarting it. No necessary repair identified. A later section could examine a customer lookup across month partitions and how its index work differs from pruning; that is useful curiosity, not a gap in this excerpt. Citations were read as displayed attribution, not independently verified.

## Informed reread: revised Constraints

Read revised constraints-01 through -14 from reading/ after original first reading and optional material. This is an informed repair check, not a replacement for the original record.

The revised opening now defines a constraint with the positive/present quantity before the competing-SKU example. It still teaches why type alone is insufficient, how enforcement applies across writers, and what the article will investigate. Moving straight to “The shop’s rules” loses no necessary understanding from the removed “Choosing the rules” prelude. Presence versus positive value is then developed in “Required values and checks”; composite scope and legitimate repeated products are developed in “Unique values and keys.” Those explanations still precede the inserts that rely on them. The prelude’s general advice to try allowed as well as refused records remains enacted by the accepted second P7 line alongside refused cases. It need not be repeated to make that lesson available.

The first-section transition works: the opening raises competing codes, optional values and deletion, then the shop setup establishes exact records and rules for investigating them. Concurrency now follows uniqueness directly, keeping the SKU question together. The first named transaction definition also arrives before the deletion section’s deferral aside, which reduces a small previous conceptual burden.

The added P7=MUG-BLUE/P8=no SKU sentence now provides both starting facts before the product probes, resolving the minor visible-path observation. The new hypothetical empty O14 and existing O12 line 2 demonstrate composite reference matching without resetting to a prior example; the hypothetical is explicit, so it does not silently mutate the running data. No missing learning or new necessary repair found in this revision.
