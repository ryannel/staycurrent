# Root breakdown review: adversarial editor

Reviewed 19 October 2026 against `../commission.md`, using `staycurrent-review` breakdown mode. Scope: this root's headings and eight child stubs only. No existing relational corpus, coverage map or previous plan was used to judge the proposed structure. Descendant article boundaries have not yet been proposed and are not being reviewed here.

Read all three fixed reference article sources in full, including their figure scenarios, reader prompts, descriptions, captions and explanations: `src/reference-articles/sequences.astro`, `indexes.astro` and `storage.astro`. This is a planning review, not a rendered-figure verification or a technical correctness audit of those preserved references.

## Verdict

Revise before expansion. The seven substantive branches from data design through distribution earn their place: each supports a different practitioner task and cannot be folded into this introductory article without making it unusably long. The eighth, system evaluation, substantially recopies those branches' promised decisions. Fold its evaluation method into the root unless its worker can identify a distinct worked decision that needs an independently readable article. Do not create descendants merely because a stub contains several named concepts.

The greater immediate risk is the root's reading cost. Its eight sections promise schema theory, query semantics, a concurrency history, a plan/storage tour, application protocols, operational objectives, distribution and system evaluation before readers reach the task paths. That can become an introductory survey whose teaching is then repeated by every child. Specify a short, complete order-reservation walkthrough and expose the task entrances near the start. Its stopping condition should be that a newcomer can say what a relational database promises, recognise which responsibility remains with the application or operator, and choose the next question to study.

## Required repairs

### 1. Put the task entrances before the miniature course

**Location:** lines 7–12 and 197–205, especially “End with task-based reading paths”.

A reader arriving with a slow query or a recovery problem should not traverse seven other introductions to find the relevant entrance. Put the five proposed task paths immediately after a brief definition and the example's setup; repeat at the end only if useful. The rest of the root can remain a continuous first-reading route. Give paths concrete outcomes rather than requiring a reader to finish every category first.

**Cost saved:** scrolling and orientation work on every later visit. **Useful understanding lost:** none; readers who need the whole walkthrough still have it.

### 2. Remove the redundant integrity subheading

**Location:** lines 16–46, “Put facts into relations…” / “Decide what the database must keep true”.

Fold the sole child heading into the first section and attach `Designing relational data` directly there. Both briefs introduce constraints, invariants and the boundary with transaction protocols; the second heading adds hierarchy without a new question. Keep one row-level constraint in the root. Let the later transaction section introduce the shared-stock rule and the race rather than explaining that contrast twice. Reduce the mathematical-model distinction here to the concrete fact needed for the example; SQL owns the implications of duplicates, NULL and ordering.

**Cost saved:** one heading, repeated invariant setup and premature terminology. **Useful understanding lost:** no practitioner capability; a fuller formal-versus-SQL treatment moves to the design/SQL branches, where examples can justify it.

### 3. Constrain the root's mechanism tour

**Location:** lines 94–102, “Understand the work behind a statement”.

“Trace … planning, access paths, row versions, memory and storage”, a scan/index comparison, a commit/log distinction and a diagnosis loop are several lessons. Specify one compact diagram following the already shown statement: chosen access path → rows/pages in memory → recoverable commit. Retain the scan/index trade-off as one visible contrast, not a miniature index lesson. Give only the diagnosis entrance (“measure what consumed time before changing the schema”), not a separate loop to learn here. Row-version storage, plan vocabulary and recovery sequences belong in the child.

**Cost saved:** a second set of concepts and figures in an introduction. **Useful understanding lost from the root:** enough detail to diagnose a plan or explain crash replay. That expertise is explicitly the child's task; the root still establishes why declarative SQL is not a fixed amount of work and why commit differs from writing a page.

### 4. Consolidate system evaluation into the root

**Location:** lines 197–224, “Choosing a relational system”.

The child repeats the distribution branch's architecture comparison; SQL's dialect semantics; transactions' guarantees; execution's access methods, benchmarking and costs; and operations' managed-service and recovery responsibilities. Its distinctive content is a method for combining that evidence, plus ecosystem, commercial and exit constraints. Those fit a bounded root section: one worked choice between deployment shapes, a short requirement-to-evidence matrix, and a test checklist that points to the existing owners of each mechanism. Explain neighbouring-family fit here as the root's definition of scope. Move details of concurrency, recovery, upgrades and workload tests to their owning branches rather than retelling them in an evaluation page.

Keep this root section available as an early task entrance as well as in the linear walkthrough. Its job is to shortlist and identify disqualifying evidence, with deeper reading when a constraint actually matters. Do not imply that newcomers must master all branches before making a first, reversible local choice.

**Cost saved:** one repeated article and another cross-cutting traversal of the corpus. **Useful understanding lost:** an extended, independently readable procurement/evaluation narrative. Preserve its practical synthesis in the matrix; that narrative alone does not yet justify a child. If retained, rewrite the stub around a concrete evaluation exercise and explicitly exclude mechanism re-explanation. The present broad checklist is insufficient evidence for a separate article.

## Challenge of every remaining section and child

| Proposed root section and child | Keep, cut or consolidate | Reading-cost boundary and understanding at stake |
| --- | --- | --- |
| Facts / `Designing relational data` (16–46) | Keep child; merge root's two headings as above. | A schema designer needs dependencies, identity, history and enforceability together. Merging this whole child with SQL would make every query learner traverse design theory; folding it into the root would lose the practical judgement needed to distinguish a valid schema from one that merely stores the example. Avoid separate descendants for each normal form, type or relationship by default. |
| SQL / `Working with SQL` (47–69) | Keep child; reduce root to one joined answer and one multiplicity error. | The root currently asks for joins, grouping, absent matches and ordering at once. Defer the latter variations to the child. No practical SQL capability is lost because the root never promises query proficiency. Within the stub, functions, CTEs and set operations are tools for answering questions, not automatic article titles; portable semantics plus one executable dialect is the right consolidation. |
| Concurrency / `Reasoning about transactions` (70–93) | Keep, with one failed and one repaired reservation in the root. | This is the example's decisive teaching turn and deserves more space than taxonomy. Do not catalogue anomalies or engine labels in the root. Keep database-abort retry boundaries here and unknown client outcomes in application engineering, as proposed; repeat only enough boundary context for independent entry. Merging with application engineering would force a connection/pool reader through a concurrency course or leave isolation too shallow. |
| Execution / `Understanding and improving database work` (94–120) | Keep child; cut the root tour as above. | Storage, query execution and measurement need a causal link. The broad stub earns that link, but does not authorise a page per subsystem. Diagnosis should use the relevant mechanism in the same worked case whenever it fits. Measurement and benchmarking belong here; operations should consume their evidence rather than teach a second diagnosis method. Local partitioning stays here and should be labelled distinctly from distribution. |
| Application / `Building applications with a relational database` (121–144) | Keep child; centre the root on a lost commit reply. | Parameter safety, transaction safety, request safety, external effects and evolution are too many abstract categories for a single introductory section. One lost reply shows why database success and request success differ; mention external work and compatible change as follow-on tasks. The child retains both. Pools/timeouts/backpressure should be taught as one request-load problem, and migrations/backfills/deployment as one change protocol, rather than independent small articles by term. |
| Service / `Operating and recovering a relational service` (145–170) | Keep child; use the mistaken deletion as the root's sole incident. | Keep the distinction between crash recovery, failover and restoration: it changes what the reader must prepare. Keep a short responsibility/loss/time statement; defer security-control and health-evidence lists. Folding this child into execution would lose procedural recovery and ownership; merging it with distribution would make single-server operators pay for sharding. Installation should mean responsibility and verification, not parallel install tutorials. |
| Placement / `Relational data across servers` (171–196) | Keep child; stop the root at one stale order read and a reason to distribute writes. | The root should distinguish replicas from splitting ownership, not explain quorum, routing, sharding and coordination. Those mechanisms belong in the child. Removing this branch would leave expert choice, failover and geography unexplained; folding it into operations would mix mechanism reasoning with procedures. Multi-server migration belongs here; schema/data evolution belongs in application engineering. |
| Evaluation / `Choosing a relational system` (197–224) | Fold into root as above, or justify a distinctly worked evaluation. | Preserve cross-cutting synthesis, commercial/exit constraints and the distinction between documented, measured and assumed evidence. Lose repeated tutorials and the product-comparison traversal. There is no case here for automatic vendor branches. |

## Teaching judgement from the references

The root's continuous reservation example follows the references' strongest practice. `Sequence diagrams` adds one change to Mina's booking and asks the reader to observe a specific effect; its scope section explicitly removes participants that do not change the answer. `Indexes` repeatedly counts work for a particular customer query before turning those counts into design rules. `Storage and durability` follows one price change across pages, memory, log and failure, explicitly distinguishing hypothetical figures, documented behaviour and observed measurements. These are reasons to preserve the root's concrete story and to cut each section's inventory, not reasons to inherit their topic outline or page count.

Before writing, give each root section a specific observable contrast and a stopping boundary. The child stub can promise practitioner depth; the root needs a useful outcome of its own, not eight advertisements for future reading. Do not commission interactions merely to illustrate the category map. An initial schema/result, a two-customer reservation history and a compact commit/failure picture are plausible candidates only where they reduce explanatory effort. Their number is not a requirement.

## Recheck criteria

The revision is ready to expand when it exposes task entrances early; removes the redundant integrity heading; bounds the root's SQL, execution, application and distribution previews; resolves whether evaluation is a root-owned synthesis or an independently justified article; and preserves clear ownership for tests, retries, recovery and migrations. Seven retained child stubs plus the root is the smallest coherent structure supported by this review. This is a recommendation about this level only, not a final corpus page budget.

## Recheck: revised root, 19 October 2026

**Result: pass for expansion at this level.** Re-read the revised `breakdown.yaml`. All four requested repairs are present:

- `Find your next question` now puts direct, outcome-oriented task entrances before the walkthrough and explicitly permits independent branch entry.
- The integrity subheading is gone. The first substantive section uses one quantity constraint, defers SQL semantics and dependency analysis, and leaves shared-stock concurrency to the transaction section.
- The root previews have observable contrasts and stopping boundaries: wrong join multiplicity; unsafe and repaired reservation histories; access-path/workload and commit/page distinctions; a lost commit reply; mistaken deletion; and a stale replica read. The execution section explicitly defers plan vocabulary, row-version storage, replay and the full diagnosis method. Application and distribution likewise point onward without teaching their protocol inventories.
- The evaluation child is removed. A root-owned worked shortlist, requirement-to-evidence matrix and validation checklist preserve the distinctive synthesis, specialist/ecosystem needs, costs and exit constraints. Mechanism tests point to their owning branches. A reporting/mixed-workload contrast appropriately prevents the reservation story from becoming an implicit definition of all relational work.

No useful understanding has been removed from the proposed corpus beyond the previously acknowledged deferral of depth from the root to its owning branches. Data modelling, SQL, transactions, execution/diagnosis, application engineering, service operations and distribution still have explicit owners. Evaluation still leads to a defensible shortlist and disqualifying evidence; removing its separate page has not removed its decision method. The fuller independently readable evaluation narrative is the intentional reading-cost saving identified above.

The revised root is still ambitious, but its stopping condition and repeated explicit boundaries now provide a usable writing constraint. The new SQL, analytical-execution, resident-code and ingestion coverage remains in child stubs, with operational versus application versus statement concerns separated. Those additions do not require new root lessons or automatic descendants. Their eventual article boundaries must be judged in their own breakdown reviews.

This pass approves the root breakdown for recursive planning only. It does not establish the eventual corpus size, teaching quality of unwritten articles, or rendered-figure behaviour.
