# Collection first reading

Audience: application engineer comfortable with basic programming, learning relational databases. Reading assembled DOM text delivered one numbered chunk at a time; optional disclosures are separate. This is an agent reading, not a human usability session or live interaction audit. No author briefs, source, prior article findings or evidence are used in this assignment. Capture root: `/private/tmp/relational-completion-review/` (15 October 2026).

## Introduction

00: The title marks this as a working draft. No teaching yet; heading introduces the subject.

01: Opening establishes tables as consistent shapes for kinds of information, and queries/changes as the database's two jobs. I can explain the subject without needing the shop's details yet. Productive question: what makes tables connect?

02: Different questions over shared records make the motivation concrete; simultaneous changes raise a justified next question. No missing inference yet.

03: Row versus schema change is particularly clear: another product adds a row; weight adds a column. Primary key defined through identity that survives a name change. I can read P7/€20/5 directly. Type/physical-layout distinction is sufficiently explained for an overview. Connection question remains productively open.

04: Connection question resolved: shared IDs refer to customer/product rows, while order lines carry purchase facts. The €18/€20 distinction prevents a misleading universal rule against repeated values. Illustration labels flatten awkwardly in text, but caption supplies all relationships; visual layout not assessed here.

05: The query is derivable before its result: P7/name from products and quantity 2 from the line. SELECT/ON/WHERE glosses support a programming reader's first SQL. Strong transition from arrangement to retrieving an answer. Caller is a general request, appropriate at overview scope.

06: Sorted C4 entries explain why this helps; table versus index distinction is explicit. Illustration keeps two C4 orders and their totals available together, reducing tracking effort. Productive curiosity about the narrowing algorithm is deferred to Indexes. No requirement to explain tree internals here.

07: Constraints get a reason from the previous join, then expose their own limit: a valid customer does not make a complete purchase. This prepares the next question naturally. SQLite qualification is brief enough not to break the thread.

08: Grouping answers the incomplete-purchase problem, with exact rollback effects. External payment/email boundary is clear without needing its eventual implementation yet. Curiosity: how do two purchases decide stock safely? Next section likely addresses it.

09: Stock race question answered. The figure explicitly puts waiting before the second check, and explains why delaying an already-decided write is insufficient. Reader can predict buyer 2 sees zero. Ordinary-read older versions are clearly separated from reservation. Text extraction includes both visual table and its textual equivalent, creating apparent repetition that I do not attribute to visible-page prose without screenshot inspection.

10: Replicas and shards have distinct jobs, and planned coverage is clearly labelled. Brief enough for overview. I can distinguish extra copies from divided ownership; operational details are onward curiosity.

11: Costs follow taught mechanisms (indexes, locks, reports), supporting judgment rather than a feature list. 'The collection below gives these their own articles' may imply backup/schema/security articles exist; checking the list next for availability clarity.

12: Three next routes state outcomes. Backup/schema/security availability question remains pending full collection list.

13: List explicitly separates working drafts from planned areas. Earlier 'gives these their own articles' is mildly over-complete because operating/evolving remains planned; smallest repair is 'plans separate articles'. No obstacle to following the current route. Separate simpler shop notice for optional checkout prevents accidental identity carryover.

14 / introduction judgement: Clear orientation and orderly development. Concrete passages doing real explanatory work: row/schema distinction, historical purchase price, P7 join, lock-before-check. No consequential blocker. Mild availability wording above. SQL syntax taught so far: SELECT fields FROM, JOIN ON, WHERE; no grouping, ordering, INSERT or application APIs yet.

## Designing your data

00: Title and route only.

01: Opening frames schema design as a decision with consequences, rather than assuming table boundaries. I want to know how to judge a division.

02: Schema versus records reminder works for both route and direct entrant. No new gap.

03: Diagram gives concrete definition/record contrast, including repeated names versus unique keys. Useful repetition of foundation, no strained prose.

04: Three design questions show what a schema commits to. I can connect price-history question to introduction. Other two questions remain useful prompts awaiting derivation.

05: Fact means value with subject/context, preparing functional dependencies without assuming the term.

06: Normalisation now has a purpose and promised method. 'What they depend on' is understandable but still abstract; I expect the next worked arrangement to supply it.

07: Contents promise a coherent design journey. Opening understanding: schema declares beliefs/rules; normalisation separates independently changing facts. Good orientation before detail.

08: Dependence abstraction resolved through customer name correction, registration and deletion. Repeated IDs remain valid references; explicitly saying this avoids a common overgeneralisation. The figure is useful because both versions and the changed-row counts are held together. No gap.

09: Earlier same-product-twice question resolved by composite line key, with rejected alternative and consequence. O12/O13 figures explicitly establish continuity from introduction. Candidate-key minimality is explained in plain words. Strong passage: assigned row_id does not repair repeated customer facts.

10: Dependency given as asymmetric application rule, not statistical correlation. 'Determines does not mean never changes' is a useful clarification at exactly the right point. Can now predict customer name needs customer ID, and line price needs line identity.

11: Long single chunk contains all three normal forms. At 1NF, I wondered whether arbitrary fixed product slots also violate the form; the immediately following paragraph explicitly says scalar slots can satisfy it while remaining poor design. At 2NF, moving customer/time to order follows the dependency, with before/after facts visible. At 3NF, current product price versus agreed price is preserved consistently. Underlined-key meaning is given before diagrams. 'Non-key fields' is new vocabulary but supplied by key examples. Optional overlapping-key formalism stays closed. Final relationship figure introduces many-to-many by tracing O13/P7; no expertise needed to infer it. No consequential gap; strong support for applying the method.

12: Lossless decomposition explained by an actual failure with four product/price matches. This advances beyond tidy tables and supports judgment. Figure removes the need to mentally cross two pairs. 'Does not make splitting these fields useful' prevents another overgeneralisation. No gap.

13: Experiment clearly resets catalogue from current €20 to initial €18; no unexplained state shift. Prediction before interaction: correcting normalised name changes one row but both displays; catalogue €20 leaves O12 total €36. Default DOM supports setup, but interaction untested. Address and purchased-name examples help transfer the rule. Slight repeat of price reasoning is justified by new historical-design scope.

14: Good boundary against arbitrary fragmentation. A summary's authority and refresh choice are concrete; no implication that normalisation demands maximal joins. 'Number of tables is not a measure' follows reasoning rather than serving as a slogan. No blocker.

15: Types section gives comparative choices with consequences: lexical '10'/'2', postal zeroes, 18.005 rounding, status versus boolean, instant versus local appointment. NULL introduced as missing with ambiguous business meaning. Each choice is usable beyond shop. Long section has several subheadings but reasoning remains connected. No missing prerequisite; timestamp precision is proportionate.

16: First CREATE TABLE/INSERT arrival is introduced by who prerequisites are and how columns/declarations map. NULL check rule and NaN are explained before interpretation, so technical complexity stays purposeful. Prediction before reading model result: line (O12,2) P7 accepted; removing NOT NULL admits missing quantity because CHECK unknown isn't false; extra product uniqueness rejects permitted second line. Visible result agrees. ON DELETE forms appear early in SQL but are resolved later within section; no dependent task forces interpretation earlier. Constraints-versus-complete-operation limit is carried forward cleanly.

17: Main path explains JSON object's limited validation, then capacity/detail row before showing its result; closed setup does not hide necessary data. New term JSON null is contrasted with SQL absence enough for current decision, though fuller treatment can wait for child. Supplier-array case connects identity, writer and reference; a lock cannot recover an omitted stale object field is a particularly useful warning. More detailed input conversion intentionally delegated and promised as complete in child.

18: Receipt resets explicitly before earlier insert; aliases/arithmetic/output alias/ordering introduced before code. Adaptation prediction before optional answer: Sea-blue mug, 2, 18.00, 36.00; cannot recover original printed name because only current product name was stored. Evidence lies in query p.name versus l.quantity/l.unit_price. Good practical closure. Actual local setup not attempted by this reading.

19: Child links promise genuinely further investigation (competition, validation/migration), avoiding a redundant next step.

20 / modelling judgement: Substantive and coherent; gives enough reasoning to design a small schema and justify identity, dependencies, historical fields, types and enforcement. Writing is patient with purposeful examples; no material prose strain found. Carries forward aliases, multiplication, ORDER BY, CREATE TABLE/INSERT and three-valued CHECK behaviour. Read default main path only; optional proof/setup/answer material still separate.

Optional modelling read after main path: variation answer matches prediction. Setup gives explicit fresh-column/table prerequisites and explains ALTER and aliases. Formal overlapping-key detail appropriately optional; no main-path dependency discovered.

## Constraints


00: Supporting article role explicit.

01: Reestablishes constraint vs type, useful direct-entry orientation but familiar from parent. Waiting for added question.

02: New problem arrives promptly: two valid checks do not reserve catalogue identity. Need to know database outcome for competing writers, beyond static rule already taught.

03: Multiple caller contexts explain shared enforcement without confusing SQL ownership.

04: Shared-writer figure clear; 'passes this rule' avoids overclaiming whole-write success. Added value modest on route but useful direct entrant.

05: Opening can now explain why shared constraints matter despite application checks; enough context, definite further scope. Questions are productive.

06: Same data explicitly carried forward; optional SKU rule established before demonstrations. Practice context says separate standalone statements and warns transaction errors need rollback. 'Savepoint' is unintroduced but optional alternative, not needed to execute main route. No gap.

07: Parent overlap in CHECK/NULL/NaN is substantial but supports direct entry and adds actual probe/represented-value timing. Model prediction is derivable: missing passes CHECK alone but fails NOT NULL. The prose says false/unknown before SQL; no surprise explanation after the task. No functional blocker. Editorially this repeats an already long parent section, though concurrency promise still motivates continuing.

08: All insert outcomes can be predicted from prior rules. New SKU missing-value policy is explicit before inserts; default multiple NULL behaviour no contradiction with CHECK unknown. Case-sensitivity issue raises useful design work but isn't implemented; article promise is explain constraints, so onward decision rather than blocker.

09: Opening question resolved by committed-or-rolled-back first writer, second wait/error/proceed. Figure introduces distinct P11/P12 to avoid duplicate primary-key confusion. Minor code-context concern: one block contains SELECT then INSERT with only comment for application branch; surrounding prose explicitly says application inserts if no rows, and no operational completion is promised here, so this is understandable rather than material missing caller. Could separate blocks to make branch unmistakable.

10: Composite shipment example reuses earlier inserted line 2 explicitly and proves pair matching; useful new depth. Deletion figure resets each attempt and identifies omitted extra line, preventing false continuity. SET NULL/NOT NULL conflict directly derivable. Deferrable timing becomes a curiosity at end, not necessary for current immediate rules.

11: Wider process limit accurately built from existing rules. Repetition of parent remains but adds clear stock CHECK versus correspondence distinction. Bridge to varying attributes is concrete. No blocker.

12: Onward route fits question just opened.

13 / constraints judgement: Accurate-feeling, understandable extension of parent through unique NULL policy, competing inserts, composite references and deletion. Repeated introductory/NULL material slows a continuous reader slightly but does not strain into decorative writing. No required repair; possible separate-block clarification for SELECT/application INSERT branch. Captions keep direction and reset explicit.

Optional constraints: setup states fresh database and separate attempts, consistent with main text. It includes only O12 whereas downloadable schema also includes O13, but main already explains that difference; examples don't rely on hidden O13.

## Tables and JSON

00: Supporting role explicit.

01: Varying details problem grounded in common typed shape, consistent with parent.

02: Clear that JSON moves some structure inside a value and doesn't remove schema. Can explain tradeoff's location before example.

03: Opening sufficient: can state alternative representations and that operations determine choice. Await concrete comparison rather than generic flexibility claim.

04: Distinguishes JSON key from database key and nested value from row before these could confuse. Three arrangement figure compares same fact; captions explain types and row boundaries without claiming physical size. Product/supplier duplication connects to normalisation instead of presenting JSON as exception. No gap.

05: Nullable columns assessed by meaning and kind-specific rules, not condemned by count of blanks. Clear reasoning for when product-kind checks may suffice. No unsupported recommendation.

06: Exact integer admitted range is stated, and conversion/rounding question explicitly opened for later. SQL CREATE assumes products/P7 exist; inherited route supplies these, but direct reader's setup instructions still pending. Generic triples caution provides useful alternative without detour.

07: Practice prerequisite/reset question resolved before runnable JSON path. Alternative details snippet is explicitly separate. Can trace object versus inner capacity validation. UPDATE/SET syntax is familiar to programmer but only implicit from examples; each statement's effect is plainly inferable.

08: First WITH/VALUES introduced explicitly; no need to supply CTE expertise. Prediction number and string both text '350', JSON type separates; missing versus JSON null has_key false/true. Actual table lets verify. SQL NULL labels explicit. Clear practical reason for distinctions, no puzzle whose inputs are hidden.

09: At first integer cast, I worried about permitted bad input; immediate next paragraphs expose string/fraction failure, then finish policy rather than leaving unsafe recommendation. Previously opened rounding concern resolved by exact whole/in-range JSON number policy. Future caller policy distinct from stored check. 'Its ordinary capacity index' appears without an index created yet; can read as possible index, but wording may imply one exists. Minor precision to recheck later, not needed to derive result. Correct final query follows migration's explicit state.

10: Earlier index wording resolved by optional CREATE INDEX choices here. GIN versus ordered capacity is explained enough for conceptual decision; exact mechanism can await index chapter. Stale object example explicitly independent start, caller A/B saved copies and serialized commits: can derive finish lost despite row lock. jsonb_set path/quotes unpacked. Separate-offer diagram says only this row conflict removed, preserving limits. This is meaningful additional depth beyond parent, strongest section.

11: JSON migration tied to reader/writer versions and authority; no handwaving that flexibility removes schema changes. Concrete finish rename shows operational consequence. Good concise section.

12: Final design includes finished capacity representation/input policy and authority; gives practical choice rather than feature comparison. No material prose strain. Repeated 'can earn' mildly figurative but brief, not an extended motif.

13: Next route queries fits stored structure now established.

14 / JSON judgement: Main route successfully completes representation choice, read/change implications and conversion policy. Strong passage: sequential stale whole-object writes explain a lost change without falsely blaming lock overlap. Main path carries required semantics; exact migration can reasonably be optional.

Optional JSON: conversion explains one connection, BEGIN, error branch to ROLLBACK, successful continuation, CASE gating and NOT NULL rejection. Predict valid 350 migrates/removes original; string/fraction refuses and rollback preserves original. Existing P7 prerequisite explicit. No hidden requirement discovered.

## Querying your data

00: Main deep dive, route advances from design to transactions later.

01: Reads naturally follow design's stored boundaries; totals introduce calculation need. Clear subject motivation.

02: Query definition reinforces different questions without duplication. No gap.

03: Result row meaning positioned as central correctness choice. Can explain query versus stored table before code. Productive next question: how joins alter count/meaning.

04: Clear prerequisites and promised progression. Appropriate for route and basic SQL newcomer.

05: Headings move from semantic correctness to execution, no strained slogans.

06: Result meaning figure makes three outputs distinct before SQL. Code then gloss then result gives newcomer interpretation; quotation, semicolon and no implicit order are explicit. Parameter explanation distinguishes value/command with caller, enough at scope. All required O13 amounts available. No gap.

07: Exactly-one result explained by both existence and uniqueness constraints previously taught. Grain defined, not just asserted. Removing identifying output doesn't deduplicate is useful next inference supported by join mechanics.

08: New O14/Ben explicitly introduced before left join result; no reliance on optional setup. Null-extended row vs existing empty order distinguished. ON versus WHERE Cara example explains why post-filtering cannot invent replacement; can derive all four and two outputs. Separate copied tables protect main-state continuity. This is excellent missing reasoning often supplied by experts, but supplied here.

09: Can predict O14 COUNT(*)1 / COUNT(line)0 from prior null row; SUM null then COALESCE decision explained. HAVING difference derives from concrete excluded €20 line. No gap; fine progression in SQL complexity.

10: Join multiplication directly visible as four pairs and €88; distinct counterexample avoids deceptive repair. WITH explanation follows code (already taught in JSON child on this route); direct-entry SQL promise might benefit from moving it before code, but no ongoing-route gap. Variation prediction before answer: 3×3=9 pairs, line total64 repeated thrice=192, separate summaries64/3, SUM DISTINCT44 incorrectly collapses two €20 lines. Clear enough to derive from facts.

11: EXISTS/SELECT1/correlation explained. Can predict another mug line doesn't duplicate O13 because outer rows stay orders. O14 state inference bounded. No gap.

12: Debugging advice is derived from worked failure, then correctness provides basis for cost comparison. Good transition, no canned recap.

13: EXPLAIN introduced by possible algorithm then observed tree. Initially fractional rows=1.50 raises question; paragraph following diagram derives one then two product rows and average. Indentation, emitted versus scanned rows, Materialize and unique early stop all explained. No hidden SQL expertise needed to follow this example. ANALYZE statistics gathering appears without explanation of what statistics contain; next section likely supplies it (productive question). Slight duplicated execution warning but justified before adapting EXPLAIN to writes.

14: Model explicitly contrasts simplified full scan with earlier early-stop observed plan, so no contradiction. Prediction 200×6=1200 comparisons vs200 entries/6 probes; with1 line build remains200. Units stated unequal; no speed claim. Reuses input identities but declares separate experiment scope. Maintained index vs temporary hash distinction well explained.

15: Statistics question resolved by size/distribution estimates and ANALYZE. 'First divergence' rationale concrete via2 vs20000 repeated lookup. Ends by correctness anchor and onward pagination; no missing practical conclusion for this scope.

16: Supporting execution route clearly promises more than overview. Carry forward query semantics, row identity, aggregates, LEFT JOIN, EXISTS, cardinality, plan tree, scans/nested/hash/merge and estimated versus observed distinction.

17 / querying judgement: Strong cumulative explanation with concrete counterexamples. The observed plan goes beyond labels to actual repeated-row arithmetic. No consequential gap. Some body repeats what figure shows, but text extraction may overstate visual repetition; substantive mechanism stays clear.

Optional querying: prediction matches nine/192 vs64/3 and DISTINCT44. Setup gives fresh DB, extension order, no double run, temporary-table same-session context. No hidden prerequisite for main results.

## How a query runs

00: Further-depth role visible.

01: Clear execution-plan subject; repeats foundation without consuming much space.

02: Alternative work is concretely expressed; prepares plan comparisons and why small answer isn't cheap. No gap.

03: Opening provides practical investigation goal and explicit prerequisite. Can explain enough before experiment.

04: Separate numeric-ID dataset explicitly distinguished. Enough input to derive30 lines and product totals10/20/30 before result; DESC and tie-break glossed. Practical one connection/new empty DB supplied. Index availability stated, not guessed.

05: Bitmap terms explained by locations/page order before nested work. 3×10=30 traced by specific orders, repeated executions clearly within one statement. 'Can start returning matches' scoped to join before aggregate, preventing streaming inference. No blocker; supports plan adaptation.

06: Two sorts distinguished by purpose/row counts. Pull executor explanation connects to blocking without confusing locks. LIMIT1 inability derived from global sum, a useful practical counterexample. Strong passage.

07: Hash join vs aggregate use different keys explicitly; can derive10k build/30k probe/3 aggregate entries. Comparison figure would reduce memory load tracking same tree shape with different cardinalities. No unsupported speed conclusion; estimates/counts not timings. Good new depth.

08: Merge mechanics can be traced through1→2 and three lines each. Transaction-local planner changes and ROLLBACK restoration explicit, even before transaction deep dive. Order-ID output not product ordering explains remaining aggregate/sort. No gap.

09: Cost start/end and width explained, inclusive costs warning useful. Customer/region facts provided before estimation example, allowing1 predicted vs10 actual reasoning. Repair changes statistics only; limits explicit. Can distinguish stale stats from missing correlation without external expertise. No blocker.

10: Memory scales by distinct aggregation keys vs input orders, not one undifferentiated row count. Per-operation allowance and concurrent total explicit. Spill example changes query purpose and discloses PGlite measurement limits. Sensible action before configuration change. No gap.

11: Final method derives from examples; repeat experiment resets dependency stats explicitly. Sandbox uses separate1000 record dataset, stated without implying current10k one. No missing practical step in conceptual route.

12: Links follow useful remaining concerns.

13 / execution judgement: Substantial further depth, especially two sorts, different hash-table keys, inclusive costs, dependency statistics and per-operation memory. Clear concrete prose; no consequential comprehension gap or significant strained passage. Numeric dataset reset and connection-local changes are handled carefully. No optional artifacts required for understanding; actual execution not part of this reading.

## Pagination and large results
