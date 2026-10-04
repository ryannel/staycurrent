# Designing your data · commission, 4 October 2026

Produce the complete three-article design sequence below. These are substantial
teaching articles, following the relational introduction, and intended as a
benchmark for later commissions. The user explicitly merged modelling and
normalisation: separating them interrupted the same reasoning. Depth means showing
why a design works, consequences when information changes, and credible alternatives.

1. **Designing a relational schema** (`modelling`): turn domain facts into records;
   identity, cardinality, one-to-many and many-to-many, types/units, optional values,
   normalisation through update/insertion/deletion problems, and historical facts.
   Introduce functional dependencies and normal forms where they help the actual
   reasoning, rather than an unexplained numbered checklist. Finish with an
   intelligible schema; detailed enforcement belongs in the next article.
2. **Constraints** (`constraints`): turn that schema's assumptions into enforced
   rules. Explain NOT NULL, CHECK including SQL null, UNIQUE, primary/foreign and
   composite keys, referential actions and their consequences. Show what constraints
   cannot establish (complete purchase, cross-row stock decision, outside effects).
   Explain the concurrent duplicate check pitfall without consuming the transaction
   branch. Show real SQL and observed outcomes, distinguish PostgreSQL specifics.
3. **Tables and JSON** (`tables-and-documents`): continue the same shop as products
   acquire different attributes. Compare columns, related rows and embedded JSON;
   access and update patterns, shared identity/enforcement, JSON missing/null/type
   differences, querying, indexing at orientation depth, document write contention,
   schema evolution. Reach a credible hybrid design, not a slogan or JSON prohibition.

## Shared example and boundaries

Use the shop from the introduction: customer C4/Ada, product P7/Blue mug,
order O12, two mugs purchased at EUR 18 each while the catalogue price later
becomes EUR 20. P8 can be Bowl. IDs are illustrative text IDs, not a recommended
production ID generator. Physical row order is never semantic identity.

Baseline names: `customers(customer_id, name)`,
`products(product_id, name, current_price numeric(12,2))`,
`orders(order_id, customer_id, placed_at timestamptz)`,
`order_lines(order_id, line_no, product_id, quantity, unit_price numeric(12,2))`.
One shop uses EUR throughout; state that assumption, and explain an amount needs
a currency rather than presenting decimal scale 2 as universal money design.
Order-line identity is `(order_id, line_no)`; a product can appear on several lines.
Purchases preserve a historical agreed unit price. Delivery snapshots can be
explained but need not expand the runnable schema. Add optional SKU to demonstrate
uniqueness only if its business meaning is clearly stated. Product-specific
attributes belong in the third article, under an `attributes jsonb` column.

Assume the reader knows the relational introduction, but recap a prerequisite
locally when needed. Each article should also work as a direct entry. Prose must
explain conclusions independently of media. Experiments contain their own setup,
controls, result and limits; labels match nearby examples. Static aids should make
relationships visible rather than restyling prose as boxes.

Use the planning, authoring, style, research and review skills. Human references
and the revised relational introduction are useful working examples. Develop an
original, patient explanation with plain headings and transitions in reasoning.
Technical examples use identified PostgreSQL behaviour; execution evidence must
say what actually ran. Keep the draft/noindex state. Do not publish or add feed news.

Writer owns the three article sources; media engineer owns the supporting
components/styles; technical agent owns SQL verification and evidence. Root owns
collection routing, final integration and editorial judgement. Coordinate data and
media placement through this brief and messages. Independent fresh/editorial and
technical reviews follow the assembled pages, including uncued media readings.
