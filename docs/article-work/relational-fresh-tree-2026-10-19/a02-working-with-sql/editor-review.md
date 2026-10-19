# Independent adversarial-editor review

Mode: breakdown. Perspective: learning value, reader time, navigation, consolidation and teaching flow. Reviewed only the commission, assignment context and proposed breakdown, plus all three fixed reference articles (`sequences.astro`, `indexes.astro`, `storage.astro`) in full, including their figure definitions, prompts, captions and explanations. No existing relational article, previous plan, coverage map or other review/repair record informed this review. This is a planning review; it does not establish rendered interaction quality or executable correctness.

Verdict: repair before acceptance. The result-contract spine, shared fixture and two task-based descendants are sound. The proposed parent nevertheless carries several advanced lessons before their prerequisites and has insufficiently explicit boundaries against repeated teaching in its descendants. Keep the two descendants; do not create a syntax-by-syntax collection.

Severity: **major** means a planned teaching sequence or boundary needs repair; **minor** means a concrete reduction in reading effort with no material coverage loss.

## Findings requiring repair

### E1 — Major: NULL-producing safety examples precede the explanation needed to judge them

**Location:** `Build a result from expressions and rows`, lines 43–49; `Filter when some facts are missing`, lines 53–62; `Summarise at the intended grain`, lines 86–93.

The first expression lesson asks a newcomer to judge CASE, COALESCE, NULLIF and a resulting NULL policy before the next section teaches missing values and WHERE's treatment of UNKNOWN. It then adds expression types, precision, integer division, time zones and an evaluation-order trap in that same first step. Repeating the safety lesson at aggregate level, including planning-time constant evaluation, makes a compact introduction unusually exception-heavy.

**Repair:** keep the first expression section to a concrete projection, an alias, one typed calculation and the duplicate/unordered-result contract. Put NULL replacement and protected division after the missing-value explanation, showing the actual output and explicitly choosing whether an undefined ratio is missing or excluded. In aggregation retain the useful rule to protect aggregate inputs, with one counterexample. Move the detailed CASE/constant-folding limitation to the query-composition child's expression-safety discussion or a short optional note there; name that ownership in the child brief. Do not make the novice traverse it to obtain their first correct result.

**Useful understanding lost:** none across the proposed corpus; the parent loses early knowledge of uncommon evaluation exceptions, which is not needed for its first task. Preserve the simple warning that textual AND/OR order is no safety guarantee.

**Recheck:** the parent must establish NULL meaning before using NULL as the solution; the aggregate guard must remain correct in scope; the relocated caveat must have an explicit owner.

### E2 — Major: the fan-out lesson asks for aggregate judgement before aggregation exists

**Location:** `Join without losing the meaning of a row` → `A plausible total can still be wrong`, lines 73–79; `Summarise at the intended grain`, lines 80–93; `Compose a query around intermediate results`, lines 94–102.

The join subsection asks the reader to distinguish existence tests from separately aggregated inputs and to reject an incorrect total. GROUP BY, SUM and pre-aggregation are only introduced afterwards. The next composition section then proposes three formulations of a small task rather than explicitly completing this unresolved calculation. This risks teaching the repair twice while leaving the first encounter dependent on unexplained syntax.

**Repair:** in joins, expose fan-out as visible row pairs and predicted counts only. Move the named plausible-total subsection under aggregation, after SUM and GROUP BY. Carry that exact wrong total into the composition section and repair it once with named, separately aggregated inputs. Let the parent use one CTE formulation; the child can develop derived-table alternatives, correlation and scalar cardinality. Introduce EXISTS once as a membership question where it is needed, with cross-references rather than a second complete tutorial.

**Useful understanding lost:** none. The parent loses three side-by-side syntactic formulations of one task, while retaining intermediate grain and a complete correct repair. The child retains the alternatives.

**Recheck:** a linear novice can reach the wrong-total demonstration and its repair without using an unexplained aggregate or derived result; the same fan-out task links the stages.

### E3 — Major: the composition descendant needs a task spine and a budget for specialist branches

**Location:** `Composing SQL queries` child stub, lines 104–123; parent ordering section, lines 124–133.

The child currently commits to correlation, LATERAL, all set operators and ALL variants, a substantial window-function syllabus, recursive termination/cycles and nullable multicolumn cursor predicates before naming its realistic report. Those are several distinct problems, not automatically stages of one report. The current order makes the worked report the culmination of a feature list. Recursion also needs a relationship absent from the specified customers/orders/lines/payments fixture. Without a hierarchy task or a bounded extension, the shared-fixture promise cannot motivate it.

**Repair:** lead the child brief with a concrete report and the next decisions its intermediate results require; use that task to introduce derived results, subqueries and a running/ranked result. Make set difference and overlap small explicit tasks with duplicate counterexamples. Retain a bounded recursive task as an optional extension with a tiny named hierarchy added to the fixture, rather than inventing a separate required domain. Keep the parent’s one simple keyset example; in the child develop the difficult cursor case as a separate task entrance that can be read directly. Do not replay basic ORDER BY, IN/NOT IN or all elementary pagination material. LATERAL and less-used frame/function variations should earn their space through the named task rather than being mandatory mini-tutorials.

**Useful understanding lost:** no required mechanism is removed. Readers following the reporting path cease to pay for recursive traversal and complex nullable cursors before those tasks matter. Cutting an unused LATERAL or window variation from a worked path loses only that particular spelling/example; retain recognition and an explicitly scoped depth note where needed.

**Recheck:** child brief names an achievable report and its stopping condition, makes the hierarchy extension explicit, and avoids requiring every specialist task as a prerequisite to useful query composition. No expansion into additional children is requested by this finding.

### E4 — Major: trigger result semantics have two owners and threaten to turn the parent into the DML deep dive

**Location:** `Changing data with SQL` child, lines 148–166; `Follow SQL stored behind a name` → `Routines and triggers can add reads and writes`, lines 186–196.

The child promises to explain trigger effects on returned results. The parent separately promises row/statement granularity, BEFORE/AFTER timing, changed values, added writes, errors, zero-row effects and which changes appear in returned values. That is nearly the complete same advanced statement-effects lesson. A reader choosing the DML descendant will repeat it; a reader needing the parent’s basic result-checking ability must already consume it.

**Repair:** keep the parent’s one triggered change and the diagnostic lesson that a named object can introduce effects beyond the visible statement. Identify function versus procedure, show how to inspect the definition and say that returned rows may not describe every side effect. Make `Changing data with SQL` the single owner of the detailed timing/granularity/RETURNING and zero-row cases. Keep the view/materialised-view contrast in the parent; include a short writable-view/check-option case there only to state the observable contract. Do not create another stored-code article.

**Useful understanding lost:** none across the corpus. The parent reader loses a complete trigger classification before needing it, while keeping the ability to detect hidden effects and select the deeper article.

**Recheck:** the parent has a bounded diagnostic example; all detailed trigger result cases remain explicitly in the DML child's brief; neither brief implies RETURNING certifies the entire transaction.

## Smaller reduction

### E5 — Minor: move the portability inventory after the reader has something to port

**Location:** `Start with a result you can check` → `One runnable dialect, a family of contracts`, lines 29–38.

The executable dialect, quoting conventions and parameter boundary belong at the start. A ledger covering collation, time arithmetic, grouping and pagination asks the reader to classify unfamiliar subjects before the first useful query.

**Repair:** retain a short extension-marking convention at the start, introduce each consequential difference beside its task, and collect the ledger as an end reference or expandable reference panel. Do not add a page.

**Useful understanding lost:** none; cross-dialect warnings remain at the point where they can change a decision.

**Recheck:** optional focused check with E1/E3; no need for a new independent review solely for this relocation.

## Article and heading consolidation challenge

Every proposed article/section was challenged below. “Keep” is an explicit judgement that its distinct learning value exceeds the cost; it is not an additional coverage demand.

| Location | Concrete disposition | Understanding lost if cut or folded |
| --- | --- | --- |
| **Working with SQL** | Keep as the common foundation. Reduce advanced exceptions and repeated formulations as E1–E4 request. | Removing it leaves no coherent novice route from a question to a checked query/change. |
| Start with a result you can check | Keep the shared fixture, first expected result and reset. Hide setup detail after making the first task visible; avoid a schema-design lesson. | Cutting the contract/fixture removes the independent standard against which answers can be wrong. |
| One runnable dialect, a family of contracts | Fold most of the ledger into task-local notes and end reference; keep only immediate conventions early (E5). | No conceptual loss; less early inventory. |
| Build a result from expressions and rows | Keep the simple query model; move safety examples after NULL and detailed exceptions to depth (E1). | No corpus loss; fewer advanced examples in the first step. |
| Filter when some facts are missing | Keep distinct: UNKNOWN changes membership, joins and changes. One compact predicted-row exercise should do most of the work; do not duplicate NOT IN in the child. | Cutting it leaves plausible filters with silently omitted rows unexplained. |
| Join without losing the meaning of a row | Keep pairs/cardinality and ON versus WHERE; explain right join by swapping as planned. Give full/self/cross joins recognition examples, not separate recipes unless a task needs them. | A catalogue reduction loses drill in each spelling, not the pair/match model. |
| A plausible total can still be wrong | Move under aggregation and complete the repair in composition (E2). | No loss; removes a prerequisite inversion. |
| Summarise at the intended grain | Keep distinct; attach the fan-out repair, reduce early CASE exception detail (E1/E2). | Cutting it loses denominator, empty-input and grain judgement essential to reports. |
| Compose a query around intermediate results | Keep one end-to-end pre-aggregation example; move alternative formulations into the child (E2). | No corpus loss; parent loses redundant syntax rehearsal. |
| **Composing SQL queries** | Keep as a descendant. Folding all its scope into the parent would sharply increase compulsory reading; make tasks and optional specialist routes explicit (E3). | Folding and then cutting to parent size would lose window frames/peers, scalar cardinality, set multiplicity, recursion and difficult cursor reasoning. Those deserve depth rather than compulsory first exposure. |
| Ask for a deterministic order and page | Keep as a compact distinct result-contract lesson, with one offset/keyset comparison. Put detailed cursor predicates in the child, with no retaught introduction. | Cutting it leaves arbitrary tie choices and unstable multi-request assumptions unchallenged. |
| Change exactly the intended rows | Keep one short insert/update/delete sequence with identities and a rejected change. Use it as the known starting point of the child. | Cutting it makes the parent’s promised query-and-change stopping condition impossible. |
| **Changing data with SQL** | Keep as a descendant: conflict targets, duplicate source mappings and returned effects earn the boundary. Begin beyond the parent's known basics, and own detailed trigger cases (E4). | Folding it into a compact parent would lose consequential distinctions among matched, changed, returned and subsequently rejected work. |
| Follow SQL stored behind a name | Keep as a diagnostic bridge; do not create a child. Cut its detailed trigger taxonomy from the parent (E4). | Removing the bridge entirely hides why inspecting a visible statement may not explain its effects. |
| Views expose a query, materialised views retain a result | Keep under the bridge, with a live-versus-retained result comparison and one bounded write restriction. | Cutting it loses freshness and caller contract judgement; a separate article would add navigation for little gain at this stage. |
| Routines and triggers can add reads and writes | Keep the name/inspection and one extra-effect example; fold detailed effects into the existing DML descendant (E4). | No corpus loss; parent loses classification detail. |
| Know what import and export actually do | Keep in parent as explicitly planned, centred on one round-trip with NULL/empty data and a rejected/omitted row. State environmental transport limits beside the command; avoid a separate format tutorial for each transport. | Cutting it loses the ability to tell a faithful data transfer from one with changed values or missing rows. A separate bulk page is unnecessary because workflows belong to application engineering. |
| Prove the answer with cases that could break it | Keep as a compact final transfer exercise; reuse previously seen counterexamples. Introduce prediction before every important figure/result, not only here. | Removing the capstone loses independent application of the contract; repeating every earlier example here would lose reader time without adding understanding. |

## Teaching standard applied from the fixed examples

The references progress by changing one consequential fact in a continuing example. Sequence diagrams makes the reader watch one message/wait/order change; Indexes makes the mechanism and counter change together, distinguishing its invented small table from measured results; Storage follows one price update through page, memory, log and crash boundaries. Their figures are questions with observable answers, followed by an explanation of what changed and why.

The proposed shared order fixture and explicit observed-versus-hand-worked distinction support that standard. The breakdown needs the same precision in its learning transitions: for the fan-out figure, predict matched pairs; for aggregation, predict totals before revealing them; for ordering, change a tie or insert one row between pages; for DML, predict returned identities then inspect a side effect. A control should change one named condition and expose its consequence. Do not animate SQL text as though the language's logical explanation were a trace of physical execution. These are writing-stage acceptance conditions, not a request to implement figures during planning.

## Focused recheck requested

Send the repaired `breakdown.yaml` for E1–E4 and any E5 adjustment. Recheck only sequencing, parent/child ownership and specialist task scope; keep this review independent of other reviewers' records. No public content, canonical tree, or article source was edited.

## Focused recheck — 19 October 2026

Read the repaired `breakdown.yaml` only for E1–E5. Did not read the practitioner review or repair record.

- **E1 — resolved.** The first expression section is now a small typed calculation. Missing-value meaning precedes CASE, NULLIF and the explicit undefined-ratio policy. Aggregation retains the input-protection rule, and the composition child explicitly owns the short evaluation-exceptions note. The learning dependency and caveat ownership are clear.
- **E2 — resolved.** Joins establish row pairs and counts. The moved plausible-total subsection introduces the wrong SUM after aggregates exist; the next section completes that exact repair once using separately aggregated CTEs. Membership is reused rather than retaught, and alternative formulations have moved to the child.
- **E3 — resolved.** The child begins with a named customer-period report and states its grain, outputs and stopping condition. Set operations have small explicit tasks, difficult cursor predicates have a direct entrance, and recursion is optional with an explicit `categories(id, parent_id)` fixture extension. LATERAL and less-used window variants are task-dependent depth. The child now has a coherent main path without losing specialist mechanisms.
- **E4 — resolved.** The parent now uses one extra-effect/definition-inspection example and explicitly hands detailed timing, granularity, zero-row and returned-value cases to `Changing data with SQL`. That child owns the details, starts beyond the parent's elementary change sequence, and continues to distinguish returned results from transaction outcome.
- **E5 — resolved.** Initial dialect conventions remain short, consequential differences appear at their tasks, and the ledger is collected at the end.

**Final editorial verdict: accept this breakdown for planning.** No outstanding finding from this perspective and no further planning recheck required. The two-descendant structure is justified; adding stored-code, import/export or syntax-specific pages would increase navigation without a demonstrated benefit. Executable results, task length and rendered figure/control quality remain writing-stage checks, as stated in the original review.
