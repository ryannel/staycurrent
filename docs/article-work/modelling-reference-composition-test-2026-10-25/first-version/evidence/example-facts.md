# Example facts and decisions

The core record in docs/coverage/relational-example.md is unchanged. No currency is assigned.

- Customer 1 is Mina Shah, with orders 101 and 103; customer 2 Tariq has 102; customer 3 Edda has no orders.
- Figure 1 uses order 101's lines (P3 × 1 at 4.50; P9 × 1 at 35.00), and payments 501 (30.00 card) and 502 (9.50 gift card). Combining each line with each payment produces four rows and an erroneous 79.00 payment sum.
- Figure 4 uses the four lines of 101 and 103. Dates are 12 October 2026 09:30 UTC and 20 October 2026 10:15 UTC. The hypothetical name correction Mina → Meena is explicitly an illustration, not a changed canonical fact. Customer names mean current names.
- Order 103 is P7 × 1 at 20.00 plus P3 × 2 at 4.50, total 29.00; it has no payments. Taxes, shipping and additional discounts are excluded from this calculation. A later catalogue price change makes P7's products.price 22.00, leaving line unit_price 20.00. Repricing that order from the current catalogue would incorrectly give 31.00.
- Future order 105 is an independent hypothetical key example: P7 on lines 1 and 2 at agreed prices 20.00 and 18.00. No event, stock reservation, submitted status or payment is asserted. It demonstrates the line identity rule only.
- Optional second unique product catalogue code is a rule hypothetical; no new code values are assigned. The surrogate does not replace its business uniqueness rule.
- Optional receipts are an at-most-one-per-order illustration; not part of the core schema.
- Offers are the three triples (S1,P7,North), (S1,P3,South), (S2,P7,South). Each triple is unique. The three projected pair sets admit the unoffered combination (S1,P7,South). Offers here are current associations, not versioned occurrences.
- P7 has independent tags gift and ceramic, and suppliers S1 and S2. Each product-tag and product-supplier pair is unique. Supplier membership is independent of tags; no location inference follows.
- The unsafe decomposition uses only selected lines 101/1/P3 and 103/1/P7. Dropping order_id from line-product produces two invented matches.
- Tea details may include origin and brewing temperature; teaware details material and capacity. P3 and P7 show optional subtype membership; total and disjoint membership are posed as decisions, not asserted enforcement.
- Category example: Drinks → Tea → Green tea. The multiple-parent alternative adds Gifts → Green tea. Cycles are counterexamples, not accepted ancestry.
- EAV examples P7/capacity_ml/'300' and P3/origin/'Japan' are illustrative description facts, not canonical catalogue additions.

Figure input arrays live in src/components/modelling-first-draft/facts.mjs. Other local examples are stated where introduced; none changes the collection record.
