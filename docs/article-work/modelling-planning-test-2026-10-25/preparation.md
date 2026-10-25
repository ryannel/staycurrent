# Preparation record

This is the first complete, unreviewed planning draft for the supplied relational data modelling commission. No article prose, figure implementation, delegation, review or repair was commissioned or performed.

## Input exposure

Local reads were confined to `/private/tmp/staycurrent-modelling-plan-20261025/input/`:

- `commission.md`.
- The supplied revised `staycurrent-breakdown/SKILL.md`, `staycurrent-write/SKILL.md` reference-reading procedure, and `staycurrent-continuity/SKILL.md`.
- `docs/coverage/relational-example.md`.
- The reference-reading helper and its complete bounded text outputs: Sequence diagrams parts 1–6, Indexes parts 1–7, Storage and durability parts 1–6. Each part was read in its own tool result with the END marker present. None of the 19 text results needed clipping recovery.

Complete text identifiers reported by the helper:

- Sequence diagrams: `722e27d04275d6ee28dfa024951827a78b5c591dc8b5f98584af197b5884809c`.
- Indexes: `d60bf12b37f922f0ced9ec54a51b1ef6b94841a40da5f20be6dafdbf75bec8c1`.
- Storage and durability: `2bebcdf28bacf1f5ecc2220e8d20a7c34682e052fff3ecde56ca1a56aba08c07`.

Finished rendered references inspected in three newly created browser tabs:

- `http://127.0.0.1:4582/review/examples/sequences/`: all 13 numbered drawings. Inspected lifelines and message arrows; nested wait bars at the 3-second setting; email inside the request; outbox and lease messages; the crowded drawing; the early worker poll; the alt/opt frames; the polling loop; parallel requests; the TLS ladder; central control; repeated customer lookups; and the sign-in trust boxes. Stepped the interactive drawings to their ends using their own controls and read them against the complete explanations. The static first drawing was visible over successive views. This was reference study, not a test of every control variant.
- `http://127.0.0.1:4582/review/examples/indexes/`: all 11 numbered drawings, following the scan, copied entries, B-tree descent, leaf links, clustered lookup, selectivity, composite order, visibility-map layout, writes, splits and deleted-entry layout. Used the figure controls and viewed their drawings with labels and counters. Some transitions were still moving in immediate screenshots; the complete text supplied each step and its stated result. No engine measurement was performed.
- `http://127.0.0.1:4582/review/examples/storage/`: all 10 numbered drawings, following page filling, buffer replacement, retained row versions, the hypothetical missing log, WAL ordering, a query waiting for a dirty-page write, grouped commits, crash recovery, the flush path and asynchronous-commit loss. Used playback/step controls; additionally stepped grouped commits through its three states and revisited the recovery outcome. Read the memory/disk boundaries, page/log state and application result against their explanations.

No other local site route was opened. No reference links into other Stay Current articles were followed. The main repository, Git/history, previous plans, target drafts, naming changes, previous tests and review feedback were not consulted. The optional saved HTML location was not needed. No existing browser tab, viewport, colour theme or shared preference was changed. The three owned tabs were closed after study. One attempt to create a subsequent tab with an explicit hidden-visibility option reported that visibility control was unsupported for a subagent; creating the owned tab with the default options succeeded.

## What the references contributed

The sequence reference establishes the smallest useful drawing, changes one element at a time, and later teaches readings of a design rather than only notation. This plan starts with the meaning of one row, carries the same line through key and relationship choices, then asks the reader to assess changes and failures.

Indexes develops mechanism before selection rules. Its small visible model is kept distinct from measured execution, and its later operational and specialised questions appear where the explanation creates a reason for them. Here dependency arrows and actual rows precede normal-form judgements; the child stubs appear under the question that needs them. No page-count or performance claim is inferred from a model diagram.

Storage repeatedly follows one change through the same state and then changes one assumption. The planned price and stored-total comparisons do the same: show what changes, what the result means, and what additional maintenance is required. Their illustrative states must be labelled as proposals rather than added to the core shop timeline by implication.

## Primary and standard sources consulted

Consulted through external web tools on 25 October 2026. No Stay Current material was searched for.

- [Silberschatz, Korth and Sudarshan, Database System Concepts, 7th edition, chapter 7 author-hosted slides](https://www.db-book.com/slides-dir/PDF-dir/ch7.pdf). Read the definitions and examples for functional dependencies and candidate keys, lossless decomposition, dependency preservation, BCNF versus 3NF, multivalued dependencies/4NF, and the design-process, denormalisation and temporal-data discussion. These support the normalisation sequence and the distinction between retaining associations and retaining locally checkable rules. The algorithmic and higher-normal-form work belongs in the contextual child. The author-hosted chapter 6 PDF failed to fetch twice and is not claimed as read.
- [PostgreSQL 18, Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html). Checked composite uniqueness, primary keys, foreign keys, self-references and many-to-many associations. Used to keep diagram cardinalities separate from what a reference enforces, particularly child minimum participation, one-to-one maximums and existence versus acyclicity. The manual's own product-order example is not copied into the shop: its `(product_no, order_id)` key would impose a rule absent from the supplied numbered-line schema.
- [PostgreSQL 18, CREATE TABLE](https://www.postgresql.org/docs/18/sql-createtable.html). The primary search result was read for the scope of reference matching and constraint checking. Relevant as a check that key declarations do not express every business rule. Detailed enforcement and referential-action choices remain with the neighbouring article.
- [PostgreSQL 18, JSON Types, especially Designing JSON Documents](https://www.postgresql.org/docs/18/datatype-json.html#JSON-DOC-DESIGN). Read the document-boundary guidance. It supports asking which data must change independently rather than declaring every structured column invalid. Syntax and indexing are outside this plan.
- [PostgreSQL 18, Materialized Views](https://www.postgresql.org/docs/18/rules-materializedviews.html). Read how results are persisted and refreshed, and the stated freshness trade-off. Supports the derived-data section without promising automatic, immediate maintenance of every stored result.
- [PostgreSQL 18, WITH Queries](https://www.postgresql.org/docs/18/queries-with.html). Read the recursive hierarchy example and execution description. Supports the hierarchy child's need to consider traversal; recursive SQL syntax is not part of the parent article.
- [PostgreSQL 18, Inheritance](https://www.postgresql.org/docs/18/ddl-inherit.html). Read the engine-specific inheritance model. Used to keep ordinary shared-key subtype modelling conceptually separate from an engine feature; implementation comparisons are left to the subtype child.

Search results from IBM's normalisation overview and documentation were also exposed. They were not used as the authority for normal-form definitions: the standard text was preferred, particularly where overlapping candidate keys matter. Other search-result snippets were not adopted as additional commission context.

## Scope and teaching decisions

The parent owns the everyday modelling explanation through keys, relationship meaning, repeating groups, update anomalies, functional dependencies, useful normal forms and lossless reconstruction. Normalisation is developed as practical reasoning, not postponed wholesale to a specialist article. The reader also sees why BCNF, losslessness, dependency preservation and enforceability are distinct judgements. The contextual normalisation child carries derivations and higher dependencies.

Hierarchy and subtype introductions transfer the earlier reasoning to common new structures. Their children are justified by substantial alternatives and their maintenance consequences; the parent does not attempt full implementations. Detailed value representation, temporal correction, constraint enforcement, tenant boundaries, query syntax, isolation and physical performance retain the ownership given in the commission. A stored total is used to teach responsibility for duplicate results; no claim is made that denormalisation improves this shop's performance.

The planned end-to-end example uses a current-data order-line report, not a historically complete receipt. This is necessary because the core records agreed unit prices but does not snapshot customer or product names. Later references to document snapshots introduce an explicitly additional requirement.

## Shared-example continuity and proposed extensions

Core names, identifiers and amounts remain authoritative. Mina is customer 1 and owns orders 101 and 103; Tariq owns 102; Edda has no orders. Order 103 has line 1 P7 × 1 at 20.00 and line 2 P3 × 2 at 4.50, totalling 29.00, with no payment. Order 101 has two lines and payments 501/502 for 30.00 and 9.50. Currency is not assigned. Prose calls each `order_items` row an order line. The table and column names from the packet are retained, particularly `products.price` rather than the storage reference's illustrative `current_price`.

Proposals for the coordinator; none has been written into the authoritative record:

- A later P7 catalogue price change from 20.00 to 22.00, leaving order 103's agreed line price and value unchanged. This must be labelled as an additional scenario, not an unrecorded change to the starting rows. A third line, a repeated product line and a line edit are also hypothetical design probes; the starting schema permits repeated product identifiers within an order, but no business rule requiring or forbidding them is invented.
- Regional supplier choices for the 3NF/BCNF and dependency-preservation explanation. Suggested illustrative identifiers: S1 and S2 each serve North; S3 serves South. Choices `(P3, North, S1)`, `(P3, South, S3)` and `(P7, North, S2)`. Rules: each supplier serves exactly one region; a product-region pair has at most one selected supplier. Candidate keys are `(product_id, region_id)` and `(product_id, supplier_id)`. After a lossless split into supplier-region and product-supplier tables, adding `(P3, S2)` demonstrates the rule that local keys no longer enforce. Supplier names and real service regions need not be invented.
- In the normalisation child, a supplier's offered products and delivery days are independent sets only if the business explicitly says so. For illustration S1 could offer P3/P7 on Monday/Thursday with all four combinations allowed. If products have different delivery days, it is a ternary fact and must stay one. This is a proposed child teaching extension, not an assumption about the shop's existing suppliers.
- A category tree with Teaware as parent of Mugs and Teapots, plus product-category memberships. It is an optional new classification, not inferred from the existing product names. The child must decide whether category nodes have one or many parents separately from products belonging to many categories.
- Optional `tea_details` and `teaware_details` rows sharing `product_id` with products. P3 and P7 are useful identity examples, but membership rules and specialised attributes require explicit adoption. Do not invent P7 capacity, assume every product has exactly one subtype, or assign customer characters staff roles.

A planning continuity pass was made while composing the draft: the opening report, dependency arrows, proposed price change and derived total all retain their distinct meanings; the real payments remain plural and independent of individual lines; no foreign key is credited with a parent-minimum or tree guarantee. Open dependencies are the coordinator's acceptance of the named extensions and the business rules explicitly left as questions.
