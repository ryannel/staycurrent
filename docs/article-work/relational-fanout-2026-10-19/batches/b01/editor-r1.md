# Breakdown batch b01 — adversarial editor, round 1

Reviewed the original commission, the three assigned plans and their supplied contexts. No other review report was read. This is a scope, reading-cost and consolidation review, not a judgement of unwritten prose or figures.

| ID | Verdict |
| --- | --- |
| a01 | **Pass** |
| a02 | **Pass** |
| a03 | **Pass** |

There is no blocking gap or unjustified child destination in this batch. The following cuts and ownership boundaries should guide recursive planning. They do not ask for additional articles. Each branch still serves the original goal of relational practice; none requires specialist mastery of its own topic.

## a01 — Designing relational data

**Pass.** The plan teaches how to arrive at a defensible schema, rather than presenting a catalogue of schema patterns. Row meaning, identity, enforcement, ownership of facts and lifecycle requirements contribute directly to designing correct applications. The final schema review is a worthwhile synthesis rather than another subject branch.

### Consolidation and reading cost

- **Cut the pattern tour from “Represent optional and changing relationships”.** Keep the distinction between an optional relationship and an independently existing entity, using the booking example. The shared-table/separate-subtype-table comparison, generic type-plus-identifier reference and recursive category hierarchy collectively introduce three new modelling situations before the reader has finished ordinary identity and relationship design. Fold a single subtype or generic-reference counterexample into the constraints child if it demonstrates a rule the chosen schema cannot enforce. Omit the hierarchy here unless a requirement in the running design calls for it. **Loss:** exposure to some modelling alternatives, with no loss of the main design method or of a required practitioner capability. This is a recommended local trim, not grounds to reject the branch.
- **Do not teach missing values and time three times.** This parent should establish that the representation must preserve the distinctions the application needs. Its value-representation child owns choosing storage representations and their validation/comparison consequences. a02's SQL-values child owns the behaviour of expressions over those values. Use a short cross-link for an already-established distinction instead of repeating the full money/time-zone/null lesson. **Loss from consolidation:** none; different practical decisions still have explicit owners.
- **Keep the parent's normalisation example sufficient for a simple schema.** Show the copied-current-fact versus agreed-historical-fact distinction here. Move multivalued dependencies, decomposition reasoning and derived-copy maintenance contracts into the child. Requiring the child before the reader can complete the booking schema would weaken the value of the parent.

### Child challenge

| Proposed child | Verdict and minimum useful contribution |
| --- | --- |
| Choosing types and representing missing values | Retain. Representation failures affect ordinary money, time and identifiers, and cannot be reduced to choosing SQL syntax. Keep JSON/arrays/external payloads as a bounded choice against related rows; omit a feature tour. Coordinate with a02 as above. |
| Expressing rules with constraints | Retain. Conditional uniqueness, composite references, constraint timing and the limits of declarative enforcement justify deeper treatment. The example inventory must produce an enforcement decision, not an exhaustive constraint catalogue. a03 owns concurrency protocols; evolution owns adding rules to live data. |
| Normalisation and deliberate redundancy | Retain as one article. Splitting dependency reasoning from controlled redundancy would separate the reason for avoiding copies from the argument for accepting one. Keep formal terms only where a practical decomposition or maintenance decision needs them. |
| Modelling history and data lifecycles | Retain. Choosing what historical questions must remain answerable changes keys, references and deletion semantics. Keep two-time-dimension designs conditional on late information/correction requirements; do not turn them into a compulsory temporal-modelling course. Live changes and physical erasure procedures belong elsewhere. |

No child can be folded into the parent without either making the initial design article much larger or dropping consequential design decisions. The meaningful cuts are pattern breadth and repeated foundations, not the four contextual destinations.

## a02 — Working with SQL

**Pass.** This is the batch's largest potential reading commitment: ten parent sections and five proposed children. It remains defensible because the parent supplies a usable first query/change workflow, while children address distinct causes of plausible but incorrect results. The result-row contract is a good common organising idea and should carry the explanation across syntax changes.

### Consolidation and reading cost

- **Keep general query composition usable in the parent.** “Express a larger question in checkable stages” should complete one useful staged query, including a basic CTE or derived result and an existence test. A reader should not need a second destination merely to organise the first report. The composition child earns its place through scalar cardinality, membership/null traps, duplicate-sensitive set operations and a bounded recursive traversal. Do not repeat a CTE introduction and full staged-report walkthrough there. **Loss from this cut:** none; the child starts from the established reasoning method.
- **Fold ordinary existence-query teaching into one owner.** The joins child proposes existence queries when presence matters, while the composition child proposes correlated existence tests and a checked alternative to `NOT IN`. Let the parent establish the basic presence question, and let the composition child own the detailed `EXISTS`/membership semantics. The joins child can show why an existence query avoids multiplying rows and link to that explanation. **Loss:** no independent capability; one repeated lesson disappears.
- **Keep recursion conditional.** Its cycle, termination, multiplicity and ordering rules justify care once traversal is needed. Do not make recursion a prerequisite for windows, pagination or ordinary data modification, and do not fan out into another graph or recursive-query branch without a concrete relational task. The same applies to subtotals in the joins child. **Loss from omitting general traversal and reporting catalogues:** specialist breadth outside the commissioned target, not the ability to solve the stated practical cases.
- **Keep examples of basic joins, grouping, nulls and data changes in the parent; put exceptional cases in their children.** Removing these introductory examples would save words but create a link-dependent syntax overview. Conversely, repeating all adversarial fixtures in both places would double the work. The final parent check should complete the original task with a compact fixture set; child checks should target their additional failure cases. This preserves a complete first workflow.

### Child challenge

| Proposed child | Verdict and minimum useful contribution |
| --- | --- |
| Getting SQL values right | Retain. SQL predicate and expression behaviour is a different decision from schema representation. Use concrete wrong answers to earn arithmetic, conversion, comparison and time detail. Link to a01 for representation choices rather than rebuilding its type survey. |
| Joining and summarising data | Retain. Multiplication of independent details and outer-join filtering are central correctness problems. Teach the result's level of detail and its repair; avoid a second full lesson on query composition or physical joins. |
| Composing larger SQL queries | Retain with the narrowed division above. Its advanced cardinality/membership/set/recursion checks justify a destination; a repeated tutorial on breaking a query into stages would not. Keep one bounded traversal rather than a catalogue of tree and graph representations. |
| Calculating across related rows | Retain. Windows have distinct partitions, peers, frames and filtering semantics that a brief `OVER` example cannot safely cover. Ranking and running/moving calculations should share a small set of datasets rather than become separate tutorials for every listed function. |
| Changing data with SQL | Retain. Target-set reasoning and inspection of results are substantial capabilities. Consolidate conflict-handling inserts, upsert and `MERGE` into the decision about intended outcomes; they do not each warrant a future article solely because syntax differs. Concurrency guarantees belong to a03 and production correction procedures to evolution. |

Merging the five children indiscriminately would reduce the article count while increasing the amount an individual reader must search through. Each has an identifiable result-correctness or change-correctness task. Keep pagination in this parent as planned: another pagination article is not yet justified.

## a03 — Making concurrent changes correct

**Pass.** This branch makes concurrent correctness a coverage argument over every writer, rather than a list of isolation levels or named anomalies. Its two proposed children have distinct practitioner purposes: constructing a locking protocol and establishing what an engine actually guarantees. The parent should leave the reader able to choose and justify a simple conditional update, a constraint, a coordination row or stronger isolation.

### Consolidation and reading cost

- **Use one escalating invariant example across the central sections.** “Two correct-looking transactions…”, “Choose protection…” and “Understand the isolation contract…” all propose schedules involving reads, predicates, locks and aborts. Keep the reservation/capacity problem as the main thread and introduce the staffing rule only to reveal a genuinely different multirow dependency. Reuse the same schedules when explaining a repair or an engine mechanism. A fresh example for every mechanism would make readers repeatedly reconstruct the state without earning another decision. **Loss from consolidation:** none; the additional multirow failure remains visible.
- **Assign the two children a clear contract/implementation boundary.** The locking child owns the all-writers protocol argument, protected rows/predicates, acquisition order and a working two-session demonstration. The isolation child owns interpreting and testing snapshots, concurrent updates and serialisation guarantees, including consequential PostgreSQL/InnoDB differences. It should link to the locking protocol rather than reproduce its row-selection and deadlock tutorial. Conversely the locking child should state the particular verified isolation assumptions it needs rather than repeat the cross-engine comparison. **Loss:** none; evidence and design remain connected without two parallel accounts of every locking read.
- **Keep queue/claim patterns optional and bounded.** The locking child only needs one example if skipping/refusing locked work clarifies a changed application guarantee. A separate queue curriculum, scheduling fairness tour or catalogue of lock modes would exceed what the original relational-practice goal needs here. **Loss from the cut:** queue-specific breadth; ordinary lock correctness, contention and deadlock judgement remain.
- **Retain the short abort-versus-unknown-outcome distinction and external-effect failure windows.** These are essential foundations, even though application integration will teach recovery procedures. Cut backoff algorithms, request identity storage designs and message-delivery workflows from this branch if they appear later. Likewise, retain the meaning of a durability acknowledgement but put restore procedures and service configurations in operations. **Loss:** no capability, provided the links identify the next practical decision.

### Child challenge

| Proposed child | Verdict and minimum useful contribution |
| --- | --- |
| Designing changes that coordinate with locks | Retain. Correctly covering missing rows, inserts and all writers is a separate design task that a short row-lock example can conceal. Keep a compact correctness argument plus verified demonstration. |
| Reading and testing isolation guarantees | Retain. The same isolation name can conceal differences relevant to an application's protocol, so this is practical engine literacy rather than an optional vendor catalogue. Use only cases that change the reader's choice of protection or failure handling. |

Merging these children would place engine-contract investigation and explicit protocol construction in the same long destination. With the stated division, the reader can take the one needed for the current decision. Do not add separate articles for each anomaly, isolation level or engine merely to elaborate this branch.

## Batch conclusion

Retain the proposed child structure. The largest savings come from reusing a few cases, moving depth out of parent introductions, and giving shared explanations one owner. No additional specialist branch is justified by this batch. When the children are expanded, reapply the original decision-based stopping rule: a list of available SQL features, modelling forms or concurrency mechanisms is not itself evidence that each requires another article.
