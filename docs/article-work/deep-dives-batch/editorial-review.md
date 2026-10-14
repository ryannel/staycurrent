# Independent editorial review

Reviewed 14 October 2026. Read the three main articles, their explanatory components and interactive presentation logic, the style and review skills, writing references, and the actual relational introduction. This judgement was formed without reading the other reviewers’ findings. Browser layout and interaction verification remain with the coordinator; this is a source-based editorial reading, not a claim of rendered QA or independent SQL verification.

**Verdict: ready as a draft from this editorial perspective.** I found no material missing teaching step that requires another substantive rewrite. This does not authorise publication or replace the technical and fresh-reader perspectives.

## Designing your data

The article now explains the subject before asking the shop example to carry it. Schema versus records, the meaning of a fact, and the purpose of normalisation are explicit. The healthy arrangement supplies a destination, while the later transformations explain how to get there. Identity leads into dependency; dependency leads into the normal forms; preserving references leads into reconstructing information. These are substantive connections rather than adjacent definitions.

A reader can explain why an assigned row ID does not resolve repeated customer facts, why an order line needs its whole key, why current and agreed prices can legitimately differ, and why an arbitrary one-to-one split does not improve normalisation. The constraints section distinguishes the intended business rule from a constraint that merely happens to reject something. Rows and JSON contains a real design decision, schema, query and result rather than handing the subject off to its child article.

The diagrams do necessary work. NormalisationSteps marks keys and moving columns; RejoinRecords exposes the invented combinations that a lost line identity creates; SchemaTradeoffs shows the cost of unnecessary fragmentation. FactChangeLab distinguishes current-name copies from historical prices, and states that its separate updates omit a transaction. The rules experiment includes an over-restrictive rule as well as missing rules, which is valuable: database rejection alone is not evidence of good design.

The principal cost is length and density in the latter half, especially types and constraint details. I would not remove the concrete distinctions merely to shorten it. The progression remains intelligible, and readers have a contents list. Child links extend subjects that have already received useful treatment.

## Querying your data

The article establishes the gap between stored records and desired answers before introducing SQL. Its central question—what one result row represents—keeps joins, aggregation and existence tests connected. The small results are inspectable. Ben and Cara make the ON/WHERE distinction understandable without assuming the reader already knows outer-join semantics. O14 makes the two COUNT forms meaningful. The shipment example shows both the wrong result and the repair; the additional-line prediction tests whether the reader understood identities rather than memorised the total.

The execution half is sufficiently substantial to belong in the main article. It follows a real receipt into a plan, explains the dependency tree, distinguishes emitted rows from inspected rows, and resolves the fractional Materialize count. The later work experiment changes catalogue and receipt sizes independently while preserving the answer. It supplies a reason to care about cardinality and repeated work before introducing planner estimates. The planned execution and index articles do not carry an explanation missing here.

The work model is deliberately less efficient than the observed nested loop because it always scans the complete catalogue. That simplification is stated before the control and within its scope text. Counts distinguish comparisons, entries and probes, avoiding a fabricated speed ratio. I would preserve those qualifications: they are necessary to prevent the reader generalising the toy comparison into “nested loops are bad.”

## Transactions and concurrency

The opening gives a concrete reason to group changes and then a separate reason to coordinate decisions. The successful purchase and failed line leave explicit inspectable states. Zero rows is explained as a successful statement with a business consequence, which closes a common gap in transaction tutorials.

The concurrency explanation is particularly strong. Both unsafe writers calculate zero correctly, both transactions can be atomic, and the non-negative constraint still passes. The reader can see exactly why the protection failed. The guarded update and locking read then move the decision to a protected value. ConcurrentSchedule includes A rolling back, so the experiment is not merely a button that always makes B lose. Its committed counters and pending request descriptions are labelled separately.

Snapshots have a purpose beyond vocabulary: several report queries may need to agree. The featured-products case establishes why a stable view is insufficient for a rule spanning records. The text explains the incompatible serial orders before naming the Serializable promise. Deadlock recovery, retries and missing commit answers follow from distinct evidence rather than being grouped into a generic error policy.

The operation-key section gives enough of the protocol to understand it independently: claim before reservation, retain identity, validate intent, inspect authoritative state, and distinguish an empty lookup from a settled failure. TransactionRecoveryLab makes the difference between database reality and application knowledge visible. Payment and the outbox introduce explicit unfinished states and recovery requirements without pretending that a local transaction includes the provider.

## Optional refinements

These are preferences or small reading improvements, not blockers:

- The modelling contents list omits “Which facts belong together?” and “How much separation?” Both are substantial parts of its argument. Adding them would make the long article easier to revisit. The other two contents lists also omit some intervening sections, but their grouped journeys are easier to infer.
- In modelling, “Describing the precise guarantee prevents a convenient diagram from promising more than its schema supplies” addresses the editorial artefact rather than the shop. A direct sentence about what writers may rely on would fit the surrounding register better. Similar closing reminders sometimes restate the preceding concrete example; trimming a few would improve rhythm without removing reasoning.
- BoundaryPayment’s heading, “A purchase can have an honest intermediate state,” is more editorial than the introduction’s plain headings. “An order awaiting payment” would identify the state more directly. The explanatory content beneath it is useful.
- The transaction article defines a row lock again in the payment section after teaching it at length. It can recall the stock-lock consequence without bolding and defining the term a second time.
- The querying practice explanation has substantial setup instructions inside disclosures. This is reasonable for a conceptual reading, but the coordinator should verify the complete executable journey separately, particularly temporary-table session lifetime. I did not execute the scripts.

## Overall reading judgement

The main subjects stand alone for a reader arriving from the relational introduction. The articles retain its plain register and concrete progression while supplying considerably more reasoning and worked detail. They do not read like landing pages for their children. Repetition mostly serves a new task: schema identity becomes result identity, and missing lines become a transaction-boundary problem. The media show associations, state changes or alternative outcomes that would otherwise require mental bookkeeping. No further general expansion is justified by this reading alone.
