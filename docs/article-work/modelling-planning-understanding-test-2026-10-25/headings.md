# Relational data modelling

Design and assess the structure of related data, starting from the shop's business rules rather than an application screen or an existing set of classes. Be able to state what a row represents, choose keys, express the permitted relationships, explain dependencies and normalisation, and check that splitting tables preserves the intended facts. Recognise designs that permit contradictory copies, lose independent facts, invent associations or require schema changes for every new item. Judge common choices involving historical facts, hierarchies, subtypes, flexible attributes and derived results. The reader already knows tables, primary and foreign keys, basic joins, constraints and transactions; develop the reasoning behind a design instead of repeating that introduction. Use customers, orders, numbered order lines, products and payments selectively. Detailed types and missing-data semantics, constraint enforcement and tenant boundaries, query construction, temporal correction, isolation and physical performance belong to neighbours.

## What a row represents

Understand a table as a set of facts with an explicit meaning for each row. Start with what the shop must remember and do: record a customer before an order exists, place an order with several numbered lines, change a catalogue price and record more than one payment. Distinguish an order, one line of that order and one payment; a screen displaying all three does not make them one kind of fact. State the grain of each proposed table and which facts must be able to exist independently. Establish that modelling chooses which valid situations the database can represent.

## Keys and identity

Choose identifiers from the meaning and permitted future states of the data, rather than from values that happen to be unique in a sample. Understand a candidate key as a minimal set of columns identifying a row, a superkey as any identifying set, and the primary key as the selected candidate. Judge natural and surrogate keys by uniqueness, stability and the references that must survive a change. A generated ID does not remove the need to recognise and enforce other business keys. Leave identifier formats, generation mechanisms and index costs to their neighbours.

### Composite keys and local identity

Explain why an order line is identified by (order_id, line_no), while line_no alone is local to one order. The product is what the line refers to, not its identity: the supplied schema does not prohibit the same product appearing on two lines. Distinguish that design from a rule allowing only one line per product per order. If a surrogate line ID is introduced, retain the separate uniqueness rule for order and line number. Make the scope of the identifiers visible.

## Repeating groups

Recognise the cost of product_1, product_2 and product_3 columns, parallel lists of products and quantities, and a comma-separated product list. An extra order line should add a row rather than require a new column or an agreed position in several lists. Relate this to first normal form and the use of values as indivisible units in the relational design. Do not turn atomicity into a demand to split every string. Identify when members need individual identity, relationships, constraints or updates; later flexible-attribute choices address deliberately structured values.

## Functional dependencies and anomalies

Understand X determines Y as a rule that two legal rows agreeing on X must agree on Y, rather than a correlation in today's rows. Use a hypothetical order sheet with one row per order line to expose the different determinants: order_id determines customer_id and placed_at; customer_id determines the stored customer name; product_id determines the current product name and catalogue price; the line key determines quantity and unit_price. Make the dependencies and the copies of each fact visible. Product identity does not determine an agreed line price.

### Update, insertion and deletion anomalies

Explain the concrete failures caused by storing these facts together: changing a customer's current name in several lines, being unable to record Edda without inventing an order, and losing a customer's only stored details when their last line is removed. Distinguish repeated values from redundant representations of the same fact. Adding a unique sheet-row ID removes none of these dependencies or failures. These examples should give the reader a reason to split the sheet.

## Normalisation

Use the dependencies to distribute facts among tables, following what determines each fact rather than aiming for a particular number of tables. Develop the shop's separate orders, customers, order_items and products from the order sheet and show which anomaly each separation removes. Normal forms describe properties under stated rules; they do not discover the shop's requirements or guarantee that every useful fact has been included. Keep this worked reasoning complete in the parent.

### Second normal form

Understand full and partial dependency through order-level facts repeated under the composite line key. Separate facts determined by order_id from those determined by the whole line key. State second normal form in terms of non-prime attributes and every candidate key, explaining the terms through this example. A single-column surrogate primary key does not establish second normal form when a composite alternate candidate key still has a partial dependency.

### Third normal form and Boyce–Codd normal form

Follow the remaining dependencies from an order to its customer and from a line to its product. Understand why storing a customer's current name with every order, or a product's catalogue price with every line, creates another fact to keep consistent. Establish the third-normal-form rule, including the exception for attributes in a candidate key, and BCNF's stricter requirement that a non-trivial functional dependency have a superkey as determinant. Explain why inspecting only the declared primary key can miss a problem. Leave systematic analysis of overlapping keys to the deeper treatment introduced after decomposition.

## Lossless decomposition

Judge a split by whether joining the projections reconstructs exactly the original facts, without inventing combinations. Follow the sheet's customer_id into customers and back; contrast joining through a customer name when two customers may share it. Make the unwanted combinations visible. For a binary split governed by functional dependencies, explain why the shared columns determining all of one side provide a lossless join. Separately ask whether the original dependency rules remain checkable from the resulting tables. Lossless reconstruction and dependency preservation are different requirements; BCNF decomposition does not always deliver both.

**Nested article: Normal forms and decomposition**

Topic: Normal forms and relational decomposition

Develop systematic ways to justify a relational design from stated dependencies. The parent establishes the shop's normalisation, the meaning of 3NF and BCNF, a simple lossless split, and the distinction between reconstruction and preserving rules. Build on that to find candidate keys using attribute closure, analyse overlapping keys, compare dependency-preserving 3NF synthesis with BCNF decomposition, and reason about multivalued and join dependencies where independent sets produce redundancy even in BCNF. Explain 4NF and the practical question behind 5NF with explicit business rules and counterexamples. The outcome is being able to test and defend difficult decompositions, rather than choosing a normal form by its number.

## Relationships and cardinality

Express what each row may and must relate to in both directions, then translate those rules into the schema. Read a small entity–relationship diagram whose minimum and maximum counts are explained locally. In the shop each order has one customer, a customer may have no orders, each line belongs to one order, and an order may have several payments or none. Edda and order 103 show that an absent related row is a valid state. Distinguish a foreign key's requirement on a child from a requirement that every parent have a child; the latter needs separate enforcement.

### One-to-many and one-to-one relationships

Explain why the foreign key normally belongs on the many side. For a one-to-one extension, compare using the parent's key as the child's key with using a unique foreign key. Distinguish at most one from exactly one, and optional participation from unknown attribute values. Choose whether an extension deserves a separate table from the fact's meaning, applicability and lifetime. Refer the resulting integrity requirements to the constraints article without developing its implementation procedures.

### Many-to-many relationships and association tables

Understand how association rows represent relationships between many rows on either side, and why relationship attributes belong with the association. Orders and products are connected through order lines, whose quantity, agreed unit price and local line identity make them more than an unqualified pair of IDs. Choose uniqueness from the intended relationship rather than assuming every association uses the two foreign keys as its primary key.

### Independent relationships

Use order 101's two lines and two payments to distinguish two independent collections from four meaningful line–payment pairings. Keeping them in separate tables preserves their separate identities and allows either collection to change independently. A report may combine their rows, but its result is not automatically a suitable base-table design. If the shop later records which payment settles which line, that allocation is a new relationship requiring its own meaning and rules. Recognise that breaking a joint fact into independent pairwise links can also lose which combination occurred; connect this to the lossless-decomposition test. Leave aggregate-query construction to the queries article.

## Current facts and historical facts

Judge whether equal-looking values represent the same fact at the same time. Contrast products.price, the current catalogue price, with order_items.unit_price, the price agreed on one line. In an explicitly hypothetical later catalogue change from P7's 20.00 to 22.00, existing P7 order lines still record 20.00. Their stored prices are not redundant copies of today's catalogue price. Apply the same question to a customer address versus an order's delivery address without adding an address policy to the shared core. Establish what is being remembered and when; temporal histories, version intervals and corrections belong to the temporal article.

## Hierarchies and graphs

Understand a self-referencing relationship by giving its two roles clear names. Use a proposed product-category extension to distinguish a tree, with at most one parent per category, from a graph permitting several parents. A parent_category_id foreign key says that a referenced category exists; it does not by itself prohibit cycles or establish a single tree. Recognise the structural decisions about roots, multiple parents and whether products may belong to several categories. Make a small valid hierarchy and a cycle visible. Keep a straightforward adjacency-list model intelligible here before introducing alternative representations.

**Nested article: Trees and graphs in relational databases**

Topic: Relational modelling of trees and graphs

Choose and assess representations for hierarchical and graph data. The parent establishes self-referencing roles, adjacency lists, multiple-parent relationships and the limits of a foreign key. Develop the trade-offs among adjacency lists, closure tables, materialised paths and nested sets by following ancestor searches, subtree moves and deletions on the same proposed category example. Distinguish a general graph from a tree and explain the additional invariants and stored redundancy each representation introduces. Connect enforcement, recursive SQL and measured performance to their neighbours rather than assuming the representation alone guarantees them.

## Subtypes and flexible attributes

Judge how to represent facts applying to only some members of a shared entity type. With a proposed product-detail extension, compare optional typed columns, subtype tables sharing product identity, and separate concrete-type tables. State whether subtype membership may overlap and whether every product must have a subtype; a subtype foreign key alone does not enforce those rules. Distinguish an is-a relationship from a has-a relationship and avoid letting an application's class hierarchy decide the tables automatically.

### JSON and entity–attribute–value models

Recognise the trade in moving variable product details into a JSON value or an entity–attribute–value table. Judge it from which values need shared definitions, types, references, uniqueness, searching and independent updates. A deliberately bounded document can complement relational tables; a generic attributes table transfers substantial interpretation and validation into metadata and application code. A type label plus an ID naming any of several target tables also needs an explicit referential-integrity design. Keep the decision intelligible here, leaving JSON operators, type details and enforcement mechanisms to the relevant neighbours.

## Derived data and denormalisation

Distinguish an authoritative fact, a historical observation and a result computed from other facts. The line quantities and agreed prices give order 101 a value of 39.50 and order 103 a value of 29.00; storing another total introduces an agreement to maintain. Explain what a view avoids and what a cached result or materialised view adds: refresh rules, possible staleness and a way to rebuild from authoritative rows. Judge deliberate denormalisation against a demonstrated read need and its extra write and correctness work. A normal form does not predict query speed. Detailed plans, indexes, refresh procedures and concurrent maintenance belong to their neighbours.

## Reviewing a data model

Apply the article's reasoning to a proposed schema: state each row's meaning; identify every candidate key; write the determining facts and relationship bounds; try valid situations with zero, one and several related rows; and test insertions, changes and deletions for unintended consequences. Follow the shop's price change, new customer, extra line and split payment through the model. Check that required questions can be answered without inventing data or losing associations, while leaving their SQL construction to the query article. Record which rules the schema enforces and which need another mechanism. End with the ability to explain and defend the design's compromises, including deliberate redundancy, rather than a checklist of table-count preferences.

## Sources and further reading

Provide primary documentation and standard treatments for the reasoning used here, with the question each helps answer. Keep advanced normalisation and hierarchical modelling available through their contextual articles, and connect the neighbouring treatments of values, integrity, queries, time and performance where the parent reaches their boundaries.
