# Values planning notes

This is the detailed outline for the accepted `values` node. No child or ownership change is proposed. Its several representations serve one outcome: choosing which distinctions a value must preserve, then predicting the operations performed on it. The reader starts with columns and values; small SQL expressions and filters must be explained as they appear. PostgreSQL 18 is a concrete dialect for examples, not evidence that every engine has the same coercion or collation rules.

## Reference exposure

Read all 19 bounded text parts separately using `scripts/read-writing-reference.py`: sequences 1–6, indexes 1–7 and storage 1–6. Every END marker arrived. Studied the finished drawings at the supplied port 4584 in one owned hidden tab: sequences' Replies and activation bars, indexes' composite-index comparison, and storage's write-ahead log. Closed the tab; did not change viewport or theme or inspect another tab.

The sequence reference changes one condition while retaining the same booking; its prose tells the reader where to look before explaining the consequence afterwards. The composite index drawing retains the same table while ordering changes; counters establish the resulting work. The WAL drawing keeps the old and new copies visible so the reader can explain what survives. Values needs comparable visibility of preserved versus lost distinctions and of predicate results versus retained rows. These are teaching needs, not prescribed figure layouts or controls. Leave the finished prose and visual design to the writer.

## Shared example decisions for central agreement

Keep `products.price` and `order_items.unit_price` at numeric(8,2), and keep every amount currency-free. Keep the placement times as UTC facts. Order 103's 10:15+00 and 12:15+02 are alternative written forms of the existing instant; +02 is an offset, not an assertion of the shop's location. Allocation of 20.00 into three shares is an isolated arithmetic question, not a change to any order or payment.

The coordinator accepted these isolated worked scenarios; root will record them centrally. They do not change the starting schema or rows:

- `products.package_weight_g`: P3 65, P7 NULL, P9 820. All three are physical products; P7 has not yet been measured. These are package weights, distinct from P3's stated 50 g net pack size. A predicate `package_weight_g > 100` and its negation both leave the unknown case unclassified. An application which needs to distinguish not measured from inapplicable must record that reason; do not silently give this one NULL two meanings.
- `customers.loyalty_code`: Mina `TEA-7`, Tariq NULL, Edda NULL. An absent code makes no assertion that Tariq and Edda are the same customer. This earns the unique-null example without adding a new entity or changing a core identity.

Incoming `P7`/`p7`, accented strings and Unicode forms can be labelled comparison candidates without adding products or renaming a customer. Green tea, 50 g already supplies the attribute-decomposition question; do not turn it into a string-parsing exercise or assume every product name encodes a size.

## Primary-source checks

Checked 25 October 2026. These sources establish the planned claims; no database was run, so any later displayed SQL outputs require the writer's designated verification or explicit documented-model labelling.

- [Numeric types](https://www.postgresql.org/docs/18/datatype-numeric.html): exact decimal versus approximate binary values; precision/scale; rounding to declared scale followed by overflow checking. Exact storage does not make every division exact. Avoid presenting two decimal places as a property of all currencies.
- [Mathematical functions](https://www.postgresql.org/docs/18/functions-math.html) and [type conversion overview](https://www.postgresql.org/docs/18/typeconv-overview.html): operand types determine division and mixed-expression behaviour; integral division truncates towards zero. Explicit conversion needs to happen before discarded information is needed.
- [Date/time types](https://www.postgresql.org/docs/18/datatype-datetime.html): calendar and timestamp types, explicit typed input, UTC conversion, session display, and loss of the original zone. Bare PostgreSQL `timestamp` means without time zone.
- [Date/time functions](https://www.postgresql.org/docs/18/functions-datetime.html): mixed timestamp comparison assumes the session zone; calendar-day and elapsed-hour arithmetic can differ across daylight-saving changes. If the writer chooses a dated named-zone example, verify that scenario and state the zone; no shop zone is established.
- [Character types](https://www.postgresql.org/docs/18/datatype-character.html) and [collation](https://www.postgresql.org/docs/18/collation.html): length limits, blank padding and whitespace distinctions; deterministic comparison uses bytes to break ties, while configured nondeterministic comparison may ignore selected differences. Case-insensitivity is not an automatic property of all collations.
- [UUID type](https://www.postgresql.org/docs/18/datatype-uuid.html) and [identity columns](https://www.postgresql.org/docs/18/ddl-identity-columns.html): native identifier representation and generation are distinct from uniqueness enforcement. Do not teach random identifiers as permission checks or promise event/commit order from an identifier.
- [Composite types](https://www.postgresql.org/docs/18/rowtypes.html) and [JSON document design](https://www.postgresql.org/docs/18/datatype-json.html#JSON-DOC-DESIGN): a value can contain fields; structured documents can coexist with relational facts. General decomposition judgement belongs here; native JSONB working procedures remain with `pg-json`.
- [Logical operators](https://www.postgresql.org/docs/18/functions-logical.html), [comparisons](https://www.postgresql.org/docs/18/functions-comparison.html), [WHERE](https://www.postgresql.org/docs/18/queries-table-expressions.html#QUERIES-WHERE) and [subquery expressions](https://www.postgresql.org/docs/18/functions-subquery.html): three-valued combinations, NULL tests, null-safe comparison, true-only filtering and the NULL effect on NOT IN.
- [Conditional expressions](https://www.postgresql.org/docs/18/functions-conditional.html): COALESCE returns the first non-null argument; whether that substitution is valid is the application contract.
- [Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html): CHECK admits true or unknown; NOT NULL forbids the marker. PostgreSQL UNIQUE permits repeated null-containing keys by default and supports NULLS NOT DISTINCT. The standard leaves the default null uniqueness treatment implementation-defined.
- [Select lists](https://www.postgresql.org/docs/18/queries-select-lists.html#QUERIES-DISTINCT) and [ordering](https://www.postgresql.org/docs/18/queries-order.html): DISTINCT treats nulls alike for duplicate elimination; null placement in sorting is specified separately from comparison predicates.

## Continuity and remaining scope

The outline moves from existing typed values to representation choices, then to absent information and operation-specific comparison. It does not require the report, joins, aggregation or index machinery as prerequisites. Missing payment *rows* stay with query results; nullable stored attributes carry this explanation. Money's current-versus-agreed meaning stays with modelling/history. NULL treatment in DISTINCT is a boundary explanation, not a second lesson in set operations or grouping. CHECK/UNIQUE examples establish semantics only; enforcement procedures stay with constraints. No separate deeper outcome earns a child within this node. No writing, implementation, review, builds, server changes, commits or publication performed.
