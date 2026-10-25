# Relational data modelling

Teach the engineer who already knows tables, keys and joins to decide what each row represents, choose identities and relationship structures, and explain why a design preserves the facts the application needs. Develop the shop's orders into a worked design: the reader should be able to distinguish an order from its lines and payments, state cardinalities in both directions, find repeated facts through functional dependencies, and assess a proposed decomposition. Teach normalisation through actual insertion, change and deletion problems, including the limits of a generated identifier and of normal-form labels. Finish with judgement about historical facts, specialised relationships and deliberately stored results. The reader should leave able to review a model against business rules and plausible changes, identify assumptions requiring an answer, and name the additional consistency work a design creates. Assume the introductory vocabulary rather than reteaching SQL. Connect to the neighbouring articles for detailed types and missing values, constraint enforcement and tenant boundaries, queries, temporal correction, isolation and physical performance. Figures are illustrative models, not observed database execution.

## What one row represents

Start from Mina's order 103: a blue mug and two packs of green tea, on two numbered order lines, for 29.00. Show a small order-line report with order_id, line_no, customer_id, customer name, product_id, product name, quantity and unit_price. Say explicitly that the names in this report are current customer and catalogue names. Compare one row per order, one per order line and one per physical item: quantity two is one line, and line numbers restart in another order. Define the grain of a table as the precise meaning of one row. Use a labelled table, 'Two lines in order 103', to separate order facts, line facts and product facts before any discussion of normal forms. Explain why a response object or a printed report can combine facts that deserve different stored tables.

## Keys and identity

Follow the identity of order 103 and line (103, 2) when values change. Distinguish a superkey, a minimal candidate key, the selected primary key and other candidate keys. Compare meaningful natural keys, generated surrogate keys and composite keys in a compact 'What identifies this row?' table using customer_id, product_id and (order_id, line_no). Names being distinct in the sample does not establish a naming rule. Adding order_item_id would give a convenient reference but would not replace uniqueness of (order_id, line_no). Nor does the existing schema promise uniqueness of (order_id, product_id): decide whether a product may appear on separate lines before imposing that rule. Separate stable identity, duplicate prevention and display numbering. Leave integer, UUID and clustered-index performance choices to their neighbours.

## Relationships and cardinality

Draw 'The shop's relationships' as a small entity–relationship diagram with a legend for minimum and maximum participation, then read every relationship as a sentence in both directions. Mina has orders 101 and 103, Edda has none, order 101 has two payments and order 103 has none. Use these cases to distinguish one-to-many from exactly one, and current rows from rules about every allowed state. Map the rules to the places where keys and references belong, without turning this into the constraint-enforcement article. Do not infer that a foreign key requires a parent to have children, or that the starting schema enforces an order having at least one line.

### Many-to-many relationships

Follow P7 into orders 102 and 103 and order 103 out to P7 and P3. Explain order_items as an associative table whose rows have their own meaning: quantity and agreed unit price describe the line, not either endpoint alone. Expand one part of the relationship diagram into actual rows. Contrast a pure association identified by its two endpoint keys with this numbered-line model, which need not forbid two occurrences of the same product in an order. Ask what a new association row means before choosing its key.

### Optional and one-to-one relationships

Use a proposed optional product-details row to distinguish a nullable reference from an absent related row. Show how a unique reference limits the related rows to at most one, while a required row on the other side is a further rule. Contrast this with the shop's actual payments, which are zero-to-many rather than one-to-one. Explain when separating an optional group gives it its own lifecycle or access pattern, and when a few ordinary columns remain simpler. Leave NULL semantics and the implementation of minimum participation to the values and constraints neighbours.

## Repeating groups and first normal form

Show order 103 stored as product_1, quantity_1, product_2, quantity_2, then ask what happens when a third line is needed. Compare that layout with a comma-separated product list and with numbered rows in order_items. Use 'Adding a third order line' as a before-and-after table: the row model adds data without changing the schema and retains the connection between each product, quantity and price. Introduce first normal form and the importance of deciding what counts as one value for the operations required. Avoid claiming that every structured value or JSON column is inherently a modelling error. Compare an opaque external document with order lines that need their own references and rules; connect detailed JSON and value representation to the neighbour.

## Repeated facts and update anomalies

Treat the opening report as a proposed stored table. Change Mina's current name in only one of her rows, try to record a new product before its first sale, and remove a product's last order line. A three-state 'One fact stored several times' figure should show the update, insertion and deletion anomalies and precisely which fact is inconsistent, impossible to record or accidentally lost. Resolve these cases by separating customers, products, orders and order lines. Repeated key values connect facts; they are not themselves an anomaly. Distinguish accidental repetition of one current fact from two facts that happen to have equal values. This distinction prepares the later price example.

## Functional dependencies and normalisation

Give a precise name to the reasoning just used: values that fix other values under the business rules. Draw 'Which key determines which facts?' over the opening table, using order_id to customer_id, customer_id to current name, product_id to current product name, and (order_id, line_no) to product_id, quantity and unit_price. Explain the arrow using two hypothetical rows that agree on its left side. Rules must hold for every legal state; a small sample can disprove a proposed dependency but cannot establish it. Do not imply that a customer's name is immutable over time. Use the same table through the following repairs so the normal forms explain decisions the reader can already see.

### Second normal form

Show order-level columns repeated under the composite line key. Separate them into orders because order_id alone determines them; leave quantities and agreed prices with the full line key. Define second normal form in terms of non-prime attributes and every candidate key, explaining prime as belonging to some candidate key. Use a small dependency diagram to show why adding a single generated primary key does not remove an existing partial dependency.

### Third normal form

Follow order_id through customer_id to the customer's current name, and move the latter fact to customers. Repeat the judgement for current product details. Explain transitive dependencies with the three-box 'Order, customer, current name' drawing and identify where each fact can now change once. Give the accurate third-normal-form condition after the worked case; qualify the familiar shortcut about non-key attributes when candidate keys overlap. Explain why splitting every attribute into its own table is no improvement.

### Boyce–Codd normal form

State the stronger rule that a determinant of a non-trivial dependency must be a superkey. Introduce the proposed regional-supplier example: each supplier serves one region, while the shop chooses at most one supplier for a given product and region. A compact (product_id, region_id, supplier_id) table has overlapping candidate keys and exposes the distinction from third normal form. Show the dependency arrows and identify the repetition before suggesting a split. The next section examines whether that split keeps both facts and rules; higher normal form is not a sufficient design verdict.

## Lossless decomposition

Make reconstruction visible in 'Two ways to split order 103'. A correct split into order facts and line facts joins back through order_id, which identifies the order. A deliberately bad split of the two lines into (order_id, product_id) and (order_id, line_no, quantity, unit_price) recombines the two products with both sets of line terms, producing four rows rather than the original two. Explain lossless decomposition as retaining the associations, not merely retaining every column or row value. State the binary lossless-join test under functional dependencies in words, grounded in the shared columns identifying one side. A split can preserve information and still add unnecessary joins, so it also needs an explanation of the fact it separates.

### Preserving dependencies

Return to the regional-supplier table. Splitting supplier-to-region facts from product-to-supplier choices retains its information, but local keys alone no longer enforce one chosen supplier per product and region. Show the single additional product-supplier row that exposes the problem in a 'Rule before and after the split' table. Distinguish dependency preservation from losslessness and the further question of how SQL enforces a rule. Introduce the deeper article for deriving keys, comparing decompositions and independent lists that functional dependencies alone do not resolve.

**Deeper article: Normalisation in depth**

Topic: Relational normalisation and dependency preservation

Help the same reader justify a difficult decomposition rather than rely on normal-form slogans. Develop attribute closure and candidate-key reasoning from the regional-supplier example, compare lossless BCNF decompositions with a dependency-preserving 3NF design, and explain the practical enforcement consequence. Then use a supplier's independently chosen products and delivery days to distinguish multivalued dependencies from genuine combinations, developing fourth normal form and the reason join dependencies lead to fifth normal form. Use explicit business rules, small counterexample tables and reconstruction drawings throughout.

## Current values and historical facts

Raise P7's catalogue price from 20.00 to 22.00 in an explicitly proposed later scenario. In 'The mug's price changes', show products.price changing while order 103's mug line remains agreed at 20.00 and its order value remains 29.00. These columns describe different facts, so replacing unit_price with a join to the current price would change the meaning of an old order. Contrast a reference to the current customer or product with a separately specified record of what appeared on a document. Ask which changes should propagate, which facts need to be retained, and what correction means. Introduce the temporal-history neighbour for valid time, correction and versioned references rather than teaching those mechanisms here.

## Hierarchies and subtypes

Extend the model only after the ordinary relationship and dependency reasoning is established. Use the two small proposed examples below to show questions the core shop does not yet require. Distinguish a relationship between rows of one kind from several kinds sharing an identity. Keep the main article's treatment sufficient to recognise the choice and read a proposed schema; commission the deeper decisions at the point where they become relevant.

### Hierarchies

Draw a proposed category tree with Teaware above Mugs and Teapots, and show a category row referencing its parent. Explain a root and the difference between one parent and multiple category memberships. A self-reference ensures that a named parent exists, not that the links form a tree: draw a two-node cycle as the counterexample. Introduce deeper storage choices when readers need descendants, frequent moves or multiple parents; leave recursive SQL construction and concurrency-safe enforcement to the relevant working treatments.

**Deeper article: Hierarchies in relational databases**

Topic: Hierarchical relational data models

Teach the engineer to choose between parent references, materialised paths, closure tables and nested sets by the reads and moves a category hierarchy must support. Carry the same category tree through descendant lookup, a subtree move and an attempted cycle. Distinguish trees from graphs and multiple product memberships. Explain stored redundancy and its maintenance obligations; connect query syntax, constraint enforcement and concurrent moves to their neighbours without assuming that a foreign key proves acyclicity.

### Subtypes

Compare optional columns in products with proposed tea_details and teaware_details tables whose product_id is both their key and a reference to products. In 'One product identity, different details', show P3's proposed tea details and P7's proposed teaware details, leaving unspecified values unspecified. Explain shared identity and where a one-to-one relationship helps. A parent row does not by itself guarantee a subtype row, nor do two subtype tables guarantee exclusivity. Contrast these domain choices with copying an application's class hierarchy into SQL.

**Deeper article: Subtypes in relational databases**

Topic: Relational subtype modelling

Develop the shop's tea and teaware details into a comparison of one table with a discriminator, shared-key subtype tables and separate concrete tables. Make required versus optional membership and exclusive versus overlapping subtypes explicit. Follow creating, reading and changing a product's kind, showing which identity, uniqueness and cross-table rules each design needs. Include why a generic type-and-id reference cannot serve as an ordinary foreign key to several unrelated target tables. Separate portable patterns from engine-specific table inheritance and coordinate enforcement details with the constraints neighbour.

## Derived data and denormalisation

Calculate order 103's 29.00 from its line terms, then compare calculating that value when needed with storing an order total or maintaining a read model. Use 'The total after a line changes', an explicitly hypothetical edit, to show the additional copy becoming stale. Name the authoritative inputs, every operation that changes them, the permitted delay, the maintenance mechanism and how to rebuild or reconcile the result. Contrast this duplicate result with the independent historical unit_price fact. Show how order 101's two lines and two payments produce four combinations if combined, motivating separate aggregation at each grain without teaching query syntax. Present views, materialised views and selected denormalisation as options to assess from measured needs; connect performance, refresh and transaction guarantees to their owners.

## Reviewing a data model

Return to the shop diagram and make the reader use the reasoning, not memorise a list of preferred schemas. Walk through Edda with no orders, a new unsold product, a third line, a second occurrence of a product, a changed catalogue price, a split payment and removal of a referenced product. A concise 'Question, counterexample, design consequence' table should connect each case to grain, identity, cardinality, dependencies, historical meaning or ownership of a derived result. Mark unanswered business rules rather than silently deciding them. Separate what the diagram promises from what declared keys enforce and what needs another mechanism. The resulting design should be explainable in ordinary sentences before it is assessed for physical performance.

## Sources and further reading

Supply the primary references used for consequential claims: Database System Concepts for dependency and decomposition reasoning, PostgreSQL's constraints documentation for what keys and references actually enforce, its JSON guidance for document boundaries, and its materialised-view documentation for stored results and freshness. Link the contextual children and named neighbouring subjects at the points where the article introduces their questions. Keep research and reference-reading notes in preparation.md rather than in the reader's teaching sequence.
