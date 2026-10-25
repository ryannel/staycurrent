# Preparation for the first draft

This is the first complete, unreviewed article plan. No article prose, media implementation, review, repair pass or publication was commissioned or performed.

## Input exposure

Local input was restricted to `/private/tmp/staycurrent-modelling-plan-20261025-03/input/`. I read the commission, revised breakdown skill, writing skill, continuity skill and supplied shared shop facts. I did not read the main repository, Git, previous plans or target drafts. The skill's instruction to inspect surrounding material was satisfied by the commission's supplied neighbouring scope; no other corpus was consulted.

Before outlining I ran the supplied reference reader's inventory and read all 19 bounded parts separately: Sequence diagrams 1–6, Indexes 1–7 and Storage and durability 1–6. Every part's END marker was delivered; no bounded text output required recovery. These are the complete supplied exports, including prose, captions, labels and code, rather than headings or excerpts.

I opened only the three permitted finished reference routes at `http://127.0.0.1:4584/review/examples/` in my own browser tabs. I inspected their actual drawings alongside the explanations. The closer visual inspection covered Sequence diagrams' initial booking, waiting/activation, transactional outbox, ordering comparison and alternative-path frame; Indexes' sequential scan, construction of entries, B-tree and composite-key comparison; Storage and durability's page filling and memory/disk/WAL lanes. I operated local figure controls, followed changed states and read the complete descriptions of all other figures in the full exports. No other site route was opened, and no shared viewport, theme or preference was changed. Owned tabs were closed after inspection.

The sequence reference establishes a small vocabulary, develops one running interaction by changing one thing, then uses it to read designs. The indexes reference builds the mechanism before turning it into selection and verification judgement, and separates an invented visible model from measurements. Storage follows a single change through its machinery before weighing settings and failure outcomes. These influenced the plan's progression from row meaning through keys and relationships into dependency-driven repairs, followed by decisions about exceptional structures and a concrete schema assessment. They do not prescribe a section count or visual layout.

## Practitioner outcomes and scope decisions

The reader should be able to explain what a row means, identify the rules behind a key, place a relationship's attributes, challenge assumed cardinalities, diagnose redundant facts, check that a split keeps the intended associations, and distinguish a captured agreement from a calculation stored for convenience. The assessment is about permitted states and meaningful changes, not merely whether the current rows happen to fit.

The introduction already supplies basic keys, joins, constraints and transactions. Here those become design decisions rather than a second vocabulary lesson. Normalisation receives a sufficient practical treatment in the parent; formal dependency derivation and algorithms have their own child. The hierarchy child owns representation comparisons and maintenance procedures. The parent keeps the concrete self-reference and tree-versus-multiple-parents decision. The pattern section remains proportionate examples of applying earlier reasoning, not a catalogue of every database pattern.

Constraint enforcement, tenant boundaries, type/NULL selection, query syntax, historical correction procedures, isolation and physical tuning remain with their specified neighbours. Cardinalities and dependencies are stated as business rules; the plan does not claim that a foreign key enforces every participation rule. Denormalisation has an evidence and maintenance burden rather than an assumed speed advantage.

## Sources consulted

- [Silberschatz, Korth and Sudarshan, Database System Concepts, seventh edition, chapter 6 slides](https://www.db-book.com/slides-dir/PDF-dir/ch6.pdf): consulted the design phases, relationship attributes and cardinalities, mapping relationships to schemas, specialisation, and entity/attribute and binary/non-binary design issues. Relevant to row identity, association facts and subtype choices.
- [The same text, chapter 7 slides](https://www.db-book.com/slides-dir/PDF-dir/ch7.pdf): consulted dependencies and candidate keys, normal forms, lossless reconstruction, dependency preservation, multivalued facts, denormalisation and temporal design. Relevant to separating practical parent examples from formal child procedures. Rules concern all legal states, not sample uniqueness.
- [PostgreSQL 18, Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html): checked composite primary keys, uniqueness, foreign keys and many-to-many structures, nullable references, self-references, and the limits of row CHECK constraints. Relevant to separating a model's cardinality statements from their enforcement.
- [PostgreSQL 18, JSON Types, Designing JSON Documents](https://www.postgresql.org/docs/18/datatype-json.html#JSON-DOC-DESIGN): checked the coexistence of relational and JSON structures, predictable document structure and independently modifiable data. Relevant to the structural decision; operator and index mechanics are outside this article.
- [Ronald Fagin, Multivalued Dependencies and a New Normal Form for Relational Databases, IBM Research publication record](https://research.ibm.com/publications/multivalued-dependencies-and-a-new-normal-form-for-relational-databases): consulted the primary abstract to verify that fourth normal form goes beyond BCNF and admits lossless decomposition. Detailed theory is reserved for the child.

All research was external primary documentation or the authors' standard-text material. Search results pointing to third-party answers were not used. No claim of observed database execution or measured speed is made: shop changes, reconstruction cases and counterexamples are illustrative models.

## Shared-example proposals and continuity decisions

No authoritative shared record was edited. The following are proposals for the coordinator to accept or adjust before writing:

- Preserve all supplied core names, IDs, totals and prices. Use `price` for the product's current price, despite the storage reference's separate `current_price` label. Call an `order_items` row an order line.
- Establish explicitly that `unit_price` records the agreement on that line. Illustrate a later change of P7's current price from 20.00 to 22.00 after order 103; keep that order's mug line at 20.00 and total at 29.00. This is a proposed later state, not a mutation of the core starting rows.
- Do not infer that repeated products within an order are forbidden: the supplied key permits them. Present the decision as a business-policy question and explain what a different key would assert. An extra surrogate line ID must retain any separately chosen business uniqueness rule.
- Use a flattened order-line relation only as an explicitly hypothetical bad design. It must not replace the supplied core schema or imply that customer names are unique.
- Propose product tags and approved suppliers as independent sets for the multivalued-fact example. Their membership must not depend on one another. The counterexample is a supplier's product offer at a shop location: permitted triples are the fact, so pairwise memberships cannot reconstruct them in general. No new names or IDs are required at planning time.
- Propose tea and teaware product details solely for the subtype comparison, and product categories solely for the recursive-relationship example. Do not invent subtype membership for the core products until those rules are settled. A category tree and a structure permitting several parents are alternative requirements, not two simultaneous facts.
- Edda's absence of orders and order 101's two payments already support the optionality and independent-occurrence explanations. Avoid adding a new customer or payment solely for those lessons.

The planned progression introduces dependencies before normal-form language and safe reconstruction before the independent-set counterexample. The later temporal and derived-data decisions reuse those distinctions. No unresolved dependency requires the parent reader to read a child to understand the main design argument.
