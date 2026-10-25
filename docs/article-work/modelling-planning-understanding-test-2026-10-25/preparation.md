# Preparation for the first article plan

This is the first complete, unreviewed planning draft for the supplied commission. No article was written, no media was implemented, and no review, delegation, repair iteration or publication was undertaken.

## Input exposure

Local reading was confined to the assigned input packet:

- `commission.md`.
- `.agents/skills/staycurrent-breakdown/SKILL.md`, the revised planning skill.
- `.agents/skills/staycurrent-write/SKILL.md`, for its reference-reading procedure.
- `.agents/skills/staycurrent-continuity/SKILL.md`.
- `docs/coverage/relational-example.md`.
- The supplied reference-reading helper and its complete text exports of the three fixed references.

No repository files, Git data, previous plans, target drafts, review feedback, naming corrections, prior tests or additional Stay Current material were read. The commission supplied the neighbouring coverage. Links from the reference pages to other Stay Current articles were not followed. The alternative saved HTML location supplied in the assignment was not needed.

## Complete reference preparation

The helper was run from the isolated input root. Its inventory listed Sequence diagrams as six parts (52,666 characters), Indexes as seven parts (59,821 characters), and Storage and durability as six parts (52,355 characters). Every numbered part was read separately, with a 7,000-token output allowance. All 19 END markers arrived; no bounded reference-text result was clipped.

Complete-text checksums reported by the helper:

- Sequence diagrams: `722e27d04275d6ee28dfa024951827a78b5c591dc8b5f98584af197b5884809c`.
- Indexes: `d60bf12b37f922f0ced9ec54a51b1ef6b94841a40da5f20be6dafdbf75bec8c1`.
- Storage and durability: `2bebcdf28bacf1f5ecc2220e8d20a7c34682e052fff3ecde56ca1a56aba08c07`.

The finished articles were also inspected in three owned browser tabs, at precisely the supplied routes on `http://127.0.0.1:4584`:

- `/review/examples/sequences/`: all 13 numbered drawings, from the initial four messages through activation bars, email waiting/asynchrony, the outbox, crowded/focused diagrams, reordered messages, fragments, round trips, fork/stair, repeated calls and sign-in trust boundaries. Changed cases included the three-second database wait, an email call that does not wait, and the focused booking drawing. The drawing positions, messages, frames, status labels and captions were followed against the complete explanation.
- `/review/examples/indexes/`: all 11 numbered drawings, including the six-page scan, sorted entries and row pointers, B-tree path, leaf links, clustered lookups, widening matches, column order, visibility bits, index writes, ordered/random insertion and deletion/rebuild. Initial and completed states were inspected where needed; controls were used to follow the mechanisms, including changed covering-index/table states. The distinction between the small invented drawings and the separate measured results was retained.
- `/review/examples/storage/`: all 10 numbered drawings, following pages and pointers, buffer reuse, old versions, the hypothetical no-log failure, WAL, eviction, group commit, recovery, the flush path and asynchronous commit. Changed cases included InnoDB's undo representation and recovery/acknowledgement outcomes. The memory/disk distinction, old and new values, counters and step explanations were read together.

No viewport, theme or shared preference was changed. One attempt to create an additional tab with an explicit visibility override was refused in the subagent context; creating the owned tab without that override succeeded. All three owned tabs were closed after reading.

### What the references contributed

The references establish a subject's useful meaning early, then develop a mechanism with a small example before asking the reader to judge alternatives. Their headings name recognisable subjects; they do not divide the article into equally sized teaching stages. Their examples change when a new question warrants it, and their parent explanations remain useful before a deeper companion is introduced.

That led to a plan which develops row meaning, identifiers, dependencies, decomposition and relationship rules before asking the reader to assess more varied structures. The normalisation example carries the explanatory work; later historical prices, categories and optional product details extend the reasoning where the question changes. The plan identifies hard-to-picture dependencies, invented join combinations, cardinalities and cycles without prescribing the writer's figures or paragraph sequence.

## Primary sources and standard texts consulted

These are research notes, separate from the reader-facing titles and teaching briefs. They establish technical boundaries for the plan; the writer should check the final claims and cite the precise supporting passages during drafting.

1. **Silberschatz, Korth and Sudarshan, Database System Concepts, seventh edition, Chapter 6 author slides: Database Design Using the E-R Model.** [Author-hosted slides](https://www.db-book.com/slides-dir/PDF-dir/ch6.pdf). Read the design phases and the sections on relationship attributes, role names, minimum/maximum participation, keys, weak entities, mapping relationships to schemas, specialisation and non-binary relationships. Relevant to separating conceptual requirements from physical design, choosing association-table keys, distinguishing optional from mandatory participation, and assessing subtype and multi-participant relationships. The extracted page title incorrectly says Chapter 7; the PDF itself identifies Chapter 6.

2. **Silberschatz, Korth and Sudarshan, Chapter 7 author slides: Normalization.** [Author-hosted slides](https://db-book.com/slides-dir/PDF-dir/ch7.pdf). Consulted the sections on functional dependencies, candidate keys, lossless decomposition, dependency preservation, 3NF/BCNF, multivalued dependencies, further normal forms, first normal form and denormalisation. The first two fetches using the `www` host timed out; the non-`www` host returned the PDF. Relevant to judging legal future states, preserving information when splitting tables, the limits of BCNF and why normal forms alone do not settle a design. Formal inference and decomposition algorithms earn deeper treatment than this parent's worked design.

3. **E. F. Codd, Further Normalization of the Data Base Relational Model, IBM Research Report RJ909 (1971).** [Indexed scan of the original report](https://apollo.inf.upol.cz/~urbanec/teaching/2021/data2/files/codd2.pdf). Search exposed the scan's opening text; a direct PDF fetch timed out. The report's definitions of candidate keys, prime attributes and full dependency were read in the extensive indexed excerpt of a [transcription of Codd's report](https://thaumatorium.com/articles/the-papers-of-ef-the-coddfather-codd/1971b-further-normalization-of-the-data-base-relational-model/), rather than in the scan itself. Relevant to using *all* candidate keys in the second-normal-form discussion and to avoiding the false shortcut that adding an ID fixes normalisation. The writer should retrieve the scan or a standard-text equivalent before quoting or developing a formal proof.

4. **PostgreSQL 18, Constraints.** [Official manual](https://www.postgresql.org/docs/18/ddl-constraints.html). Consulted primary keys, multi-column uniqueness, foreign keys, self-reference and many-to-many examples. Relevant to what declared keys and references actually establish. A child reference does not establish parent participation; a self-reference does not establish acyclicity. The plan states the required rules but leaves enforcement depth to its assigned neighbour.

5. **PostgreSQL 18, CREATE TABLE; PostgreSQL identity-column documentation surfaced in search.** [Official CREATE TABLE manual](https://www.postgresql.org/docs/18/sql-createtable.html). Relevant to keeping generated identifiers distinct from a declared uniqueness rule and from the other business keys in a model. No detailed identifier-generation recommendation is made.

6. **Ronald Fagin, Multivalued Dependencies and a New Normal Form for Relational Databases (1977).** [IBM Research publication record and abstract](https://research.ibm.com/publications/multivalued-dependencies-and-a-new-normal-form-for-relational-databases). The original paper's opening text also surfaced in the indexed PDF search result. Relevant to independent sets that retain redundancy beyond BCNF, and to the contextual child on deeper decomposition. The parent uses the shop's independent lines and payments to establish their distinct meaning; it does not label every multi-collection table a 4NF violation without first stating the dependency rules.

7. **PostgreSQL 18, JSON Types, especially Designing JSON Documents.** [Official manual](https://www.postgresql.org/docs/18/datatype-json.html#JSON-DOC-DESIGN). Relevant to treating relational and document structures as complementary choices, while retaining explicit structure and business rules. The parent makes the modelling choice intelligible and leaves operators, detailed types and concurrency mechanisms elsewhere.

8. **PostgreSQL 18, Materialized Views.** [Official manual](https://www.postgresql.org/docs/18/rules-materializedviews.html). Relevant to distinguishing a stored computed result from its authoritative source, and recognising refresh and staleness as design obligations. No performance measurements are imported into the proposed article.

Search also surfaced vendor introductions to normalisation. They were not adopted as formal authorities where they simplify all keys to the primary key or conflate BCNF with fourth normal form. The standard text and original research provide the relevant distinctions.

## Scope decisions

The parent should enable a reader to design and defend an ordinary relational schema, not merely identify a few anti-patterns. It therefore develops normalisation, identity and relationship rules, then tests that understanding against common structural choices. It does not attempt a survey of every modelling notation or reproduce the introduction's SQL walkthrough.

Two child stubs serve distinct outcomes: systematic analysis of difficult dependencies and decompositions; and choosing among tree/graph representations under reads and changes. Their parent sections establish usable understanding before introducing them. Subtypes, flexible attributes and denormalisation remain parent sections because a practical comparison belongs in the general design judgement being commissioned. They are not automatically given separate pages.

Types/missingness, integrity enforcement/tenancy, query construction, temporal history/correction, isolation and physical performance retain the neighbouring ownership stated in the commission. A question may be introduced and its design requirement stated here without developing that neighbour's mechanism. No claim is made that normalisation predicts speed, that every rule is expressible as an ordinary foreign key, or that a schema drawn with a tree shape is necessarily a tree.

## Shared-example continuity and proposed extensions

The supplied example is authoritative. Customer roles and IDs, order dates/statuses, product IDs and names, numbered line keys, all quantities/prices and payments are preserved. A row of `order_items` is called an **order line**. Monetary amounts retain no assigned currency. In this commission the catalogue column is `products.price`; the reference storage article's `current_price` spelling is not imported.

The order sheet is an explicitly hypothetical representation of selected core facts, not another authoritative dataset. Order 101 has two lines and two payments (501 and 502), making four combinations if both collections are expanded together. That does not establish any payment-to-line allocation. Edda remains a customer with no orders; order 103 remains pending with no payment. Existing catalogue and sale prices must be distinguished semantically even while their numeric values agree.

Proposed extensions for the coordinator, not changes to the shared record:

- A hypothetical later P7 catalogue-price change from 20.00 to 22.00, leaving the existing order-line agreements at 20.00. No stock change or extra purchase is implied.
- The possibility of another customer sharing a name, to make a name-based join's ambiguity visible. No new customer ID or row is committed by this plan.
- A product-category structure for the hierarchy section, with the choice between one parent and several parents stated as alternative requirements. Exact categories and assignments should be approved centrally before article figures are made.
- Optional product details for the subtype/flexible-attribute section, for example packaged tea weight and a vessel's capacity. The record needs to decide whether those are sellable-product facts, subtype membership rules, and any actual values. No such values are invented here.
- An order's delivery-address snapshot is only a transfer question in the historical-facts section. No address policy or address rows are assumed. Likewise, payment allocation is only a possible new business requirement, not an assertion about payments 501–503.

While composing, the continuity pass followed the learner from row meaning through keys and dependencies before later design comparisons. The terminology of candidate keys, association rows, current facts and computed results is retained consistently. The plan does not infer stock from the limited order history, derive a full payment/status policy, or present illustrative modelling counterexamples as observed execution.
