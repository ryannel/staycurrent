# Relational data modelling

Design related tables whose rows, keys and relationships express the shop's facts accurately. Judge a schema by the changes it must support, use dependencies and normalisation to diagnose redundancy, and distinguish historical facts from derived copies. Develop practical design judgement here; formal decomposition analysis belongs in the child, with enforcement, query construction, temporal procedures and physical performance in their neighbours.

## What one row represents

State precisely what one row asserts before choosing its columns. Use an order, an order line and a payment to distinguish facts that occur at different levels; make visible why one row containing both a line and a payment repeats facts without establishing a relationship between them.

## Keys and identity

Choose keys from the distinctions the business must preserve, rather than from the accidental uniqueness of the sample rows. Distinguish an identity from a name or a current attribute.

### Candidate keys and surrogate keys

Recognise minimal candidate keys, choose a primary key and retain other required uniqueness rules when adding a surrogate. Judge natural keys by their meaning and stability; leave identifier formats and storage costs to the value and performance articles.

### Composite keys

Explain why line_no identifies a line only within its order, making (order_id, line_no) its key. Show the different rule imposed by (order_id, product_id), and why an extra line ID would not settle which duplicate lines the shop permits.

## Relationships and cardinality

Translate business statements into the minimum and maximum participation on each side of a relationship. Use those rules to choose where references and relationship attributes belong, and read them back from a small schema.

### One-to-many and one-to-one relationships

Use customers and orders to separate many from mandatory: Edda has no orders, while each order identifies one customer. Understand what a unique reference adds for one-to-one relationships, and why a reference alone does not require every parent to have a child; enforcement details belong in the constraint article.

### Many-to-many relationships

Develop order_items as a relationship with its own quantity, agreed price and line identity, rather than a list of product IDs in orders. Decide whether a relationship is a unique pair or a repeatable occurrence from the shop's rules, not from the diagram's shape.

### Relationships involving three things

Use a supplier's offer of one product to one shop location to show why three separate pairwise associations can admit a combination never offered. Keep the complete fact together; make the invented combination visible without developing join syntax or formal join dependencies.

## Functional dependencies

Read X determines Y as a rule over every permitted state, not a pattern discovered in three rows. In a deliberately flattened order-line table, identify which facts belong to the order, customer, product and line.

### Update, insertion and deletion anomalies

Follow a customer-name correction, a product with no orders and the removal of a last line through the flattened design. Explain the disagreement or lost fact each design creates, then give that fact an independent home; repeated foreign keys are not themselves an anomaly.

## Normalisation

Use the dependencies already established to explain the useful normal forms through repairs to the shop schema. Relate each repair to a concrete anomaly; a normal-form label is a diagnostic tool, not a complete design specification or a requirement to maximise the number of tables.

### Repeating groups and first normal form

Compare product_1 and product_2 columns, an encoded product list and separate order lines. Explain the operations that need each item to be addressable, and why a fixed number of columns creates an arbitrary limit; detailed value decomposition belongs in the value article.

### Partial dependencies and second normal form

Use the composite line key to distinguish order-level placed_at from line-level quantity. Show why adding a surrogate key leaves the underlying dependency and repeated order facts in place.

### Transitive dependencies and third normal form

Follow order_id to customer_id to the customer's current name, then separate the customer's fact from the order. Introduce Boyce-Codd normal form as the stronger test that every non-trivial determinant is a superkey; full definitions and overlapping-key cases belong in the normalisation child.

## Decomposing tables safely

Check a split by reconstructing the original facts: a correct split neither loses associations nor invents combinations. Work a keyed shop split and one unsafe split, then distinguish preserving information from preserving dependencies that can be checked separately. Formal tests and algorithms belong in the child.

**Child article: Normalisation and decomposition**

Topic: Relational normalisation and decomposition

Analyse a schema from its declared dependencies: derive candidate keys, apply precise normal-form definitions, and choose lossless, dependency-preserving decompositions where possible. Own closure, synthesis and decomposition procedures, the 3NF versus BCNF trade-off, multivalued and join dependencies, and higher normal forms; the parent develops the practical diagnoses and simple reconstruction examples.

## Independent multivalued facts

Use a product's independent tags and suppliers to reveal repetition that functional dependencies alone can miss. Separate the two sets, contrast them with a genuine supplier-product-location offer, and recognise when fourth normal form is relevant; its formal analysis belongs in the normalisation child.

## Historical facts and derived data

Decide whether similar-looking values express different facts or repeat the same fact. Use that distinction to preserve the meaning of an order while controlling the work and risk of stored calculations.

### Current price and agreed price

Raise products.price for P7 from 20.00 to 22.00 after order 103, leaving its line's unit_price at 20.00. Explain why the price agreed for that line is not redundant current product data; detailed versioned history, corrections and effective dates belong in the temporal article.

### Totals, caches and denormalisation

Derive order 103's 29.00 from its lines, then consider storing a copy. Identify its authority, refresh rule, acceptable staleness and rebuild route before accepting it. Require evidence of a useful saving; measuring performance and implementing concurrent maintenance belong in the performance and transaction articles.

## Modelling variations in the data

Extend the same reasoning to structures that do not fit one uniform list of attributes. Choose a representation from the facts and relationships that must remain expressible and checkable.

### Shared attributes and subtypes

Compare one products table with type-specific columns against a shared product identity with tea and teaware details in subtype tables. Judge which attributes apply, whether types overlap and whether every product must have a subtype; detailed enforcement remains with constraints.

### Recursive relationships

Model product categories with a parent reference, then distinguish a tree from a category allowed several parents. Understand that a valid reference does not itself prevent cycles; the child owns comparisons and working procedures for traversing and maintaining hierarchies.

**Child article: Modelling hierarchies**

Topic: Relational hierarchy modelling

Choose and maintain a relational representation for trees or shared ancestry using adjacency lists, edge tables, paths, closure tables and nested sets. Compare traversal, reparenting, cycle prevention and consistency costs; the parent introduces recursive references and the tree-versus-multiple-parents decision.

### Tables, JSON and entity-attribute-value models

Compare a small, variable product-description document with hiding order relationships or established product attributes inside JSON or generic name-value rows. Judge flexibility against the lost visibility of keys, types and rules; JSON operators, value types and indexing are neighbouring subjects.

## Assessing a schema

Walk the resulting shop model through a new customer, a new product, a repeated product on an order, split payments, a correction and a deletion. Explain where each fact changes, which rules the structure expresses and which need separate enforcement; use required reads to expose missing relationships without turning their SQL into another lesson.

## Sources and further reading

Give the primary documentation and standard treatments supporting the design rules, with routes to formal normalisation and the neighbouring implementation subjects when the reader needs their working depth.
