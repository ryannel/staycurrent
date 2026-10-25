# Example facts — first version

Authoritative core: `docs/coverage/relational-example.md`. No currency assigned. `order_items` rows are called order lines. All times shown are UTC. Catalogue snapshot P3 4.50, P7 20.00, P9 35.00; customers 1 Mina Shah, 2 Tariq Aziz, 3 Edda Berg. Order 101: P3 ×1 at 4.50, P9 ×1 at 35.00; order 102 P7 ×2 at 20.00; order 103 P7 ×1 at 20.00, P3 ×2 at 4.50. Payments 501/502 settle order 101 with 30.00 card and 9.50 gift card, 503 settles 102 with 40.00. Order 103 has no payment. No stock operation is modelled here.

Accepted hypothetical extensions, kept separate from the snapshot:
- After order 103, P7 catalogue price changes to 22.00; its agreed line price remains 20.00. Order 103 remains 29.00. Repricing with the new catalogue would wrongly give 31.00.
- A possible third line for P7 on order 103 is a structural key test, not an inserted row or a claim about available stock. No quantity or new order total is assigned to it.
- Offers: S1 offers P7 to South and P3 to North; S2 offers P7 to North. These are the complete three illustrative triples. Rejoining their three pairwise projections additionally admits (S1,P7,North), which is not an offer.
- Independent P7 tags: blue, gift. Independent P7 suppliers: S1, S2. These catalogue supplier memberships do not promise delivery to every location; the offers are separate facts. A proposed third tag adds two combinations in the flattened representation.
- Categories: Shop is parent of Tea and Teaware; Cups is a child of Teaware. Allowing Cups also below Gifts is a separate multiple-parent alternative. A possible Cups→Teaware parent reversal illustrates a cycle, not a valid category state.
- Optional subtype examples: tea has a leaf-style attribute, teaware has capacity in ml; values are not asserted for core products. The prose asks whether the shop wants disjoint/exhaustive types and does not silently choose that policy.
- JSON example is a hypothetical descriptive care note for a product, not an authoritative product attribute.

Illustrative flattened tables and decompositions are deliberately alternative designs for these facts, not existing schema changes. Customer-name correction and deletion scenarios do not alter the core snapshot. All figure data and calculations live in `src/components/modelling-first-draft/model.mjs`.
