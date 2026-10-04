# Designing your data · media intentions

Keep these notes separate from the artifacts used for a first, uncued reading.
The components include their own setup, instructions, labels and captions.
All drawings use exact HTML records and SVG/CSS paths. No generated artwork is
needed: the teaching depends on identifiers, containment and recorded values.

## SchemaMap (`schema-map`)

An additional order O13 makes the many-to-many relationship visible without
changing O12's receipt. O12 has line 1, P7, quantity 2. O13 has line 1, P7,
quantity 1, and line 2, P8, quantity 1. The desktop arrangement puts the lines
between their order and their products, with arrows following stored references.
The phone arrangement preserves all rows and follows the same references using
vertical arrows. A reader should be able to find C4 from either order, distinguish
line identity from product identity, and recognise that P7 belongs to two orders.

## FactChangeLab (`fact-change-lab`)

The two layouts store the same current-name fact differently. The correction
changes one order copy first, revealing disagreement until the second copy is
updated. With a customer record, one stored change makes both displays resolve
Ada Noor. The model counts row updates, not latency or physical writes.
Changing P7's current catalogue price from EUR 18 to EUR 20 changes the product
record while O12's purchased unit price remains EUR 18 and total remains EUR 36.
Both layouts preserve that historical fact. Controls deliberately expose
intermediate states; there is no transaction or automatic copy propagation.

## CheckConstraintLab (`check-constraint-lab`)

Changing quantity across positive, zero, negative and SQL NULL inputs separates
the SQL comparison result from CHECK acceptance. Adding NOT NULL makes the null
case fail independently of CHECK. The result must not suggest that UNKNOWN is
FALSE or that a successful CHECK alone means a row satisfies every rule.

## UniqueWriteTimeline (`unique-write-timeline`)

Two requests initially find the absent SKU CUP-GREEN available. A's insert uses
P11; B's uses P12. A continuous waiting span begins at B's attempt and ends at
A's commit, followed by B's uniqueness error. The schedule illustrates an
ordinary immediate PostgreSQL UNIQUE constraint. It is not a timing benchmark.

## JsonValueLab (`json-value-lab`)

Five stored inputs expose number versus string and missing key versus JSON null
versus a SQL NULL column. Four expressions keep key existence, JSON extraction,
text extraction and JSON type side by side. The important comparisons are that
text extraction loses type information and that SQL NULL is distinct from the
JSON value null. All text is fixed data; this model does not parse reader input
or open a database connection.

## ProductAttributesMap (`product-attributes-map`)

The comparison uses the same mug identity and capacity in three arrangements.
The visual boundary shows which facts belong to the same product row and which
live in a related row. A JSON object is drawn inside the product's attributes
field rather than as another independently identified record. The figure
distinguishes typed columns from JSON validity, and makes the product_id
reference explicit for the related record.

## Verification

All components provide useful server-rendered content before JavaScript runs.
Interactive controls appear only after their handlers initialise. Native select
controls, buttons, checkbox and disclosure retain keyboard access. Changes are
announced through a separate status paragraph. Paper and control tokens follow
the existing light/dark conventions; text and placement carry meaning alongside
colour. Root owns assembled browser acceptance and independent media review.

The technical agent executed the CHECK inputs and the five JSON cases in
PostgreSQL 18.3 through PGlite 0.5.8; the predicted values match the recorded
results in `sql-results.json`. Whole-column SQL NULL in the JSON probe is
diagnostic, because the article's products definition rejects it with NOT NULL.
Root's initial browser run confirmed the copied-name intermediate state,
two updates to repair both copies and the unchanged EUR 36 historical total.
It caught a wide-figure centring conflict, repaired with an explicit wide margin.
The source compiler caught literal JSON braces in option text; those are now
Astro string expressions. The final build succeeds. Full browser and blind-review
acceptance remains with root; this note records checks completed at handoff.
