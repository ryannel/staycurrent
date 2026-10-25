# Example facts — modelling first version

Core remains the supplied docs/coverage/relational-example.md snapshot. Monetary amounts have no currency. `order_items` rows are called order lines. Dates are October 2026, UTC. The compact figure omits the year in displayed dates and omits status, stock and catalogue price; it does not change them.

customers: 1 Mina Shah (orders 101 and 103); 2 Tariq Aziz (102); 3 Edda Berg (no orders).
products: P3 Green tea, 50 g, price 4.50; P7 Blue mug, 20.00; P9 Teapot, 35.00.
lines: 101/1 P3 ×1 at 4.50; 101/2 P9 ×1 at 35.00; 102/1 P7 ×2 at 20.00; 103/1 P7 ×1 at 20.00; 103/2 P3 ×2 at 4.50.
payments: 501, 101, 30.00 card; 502, 101, 9.50 gift card; 503, 102, 40.00 card. Order 103 has none. Totals 101 39.50, 102 40.00, 103 29.00. Grain figure has four combinations for order 101 and doubles both sums to 79.00.

Accepted hypothetical extensions used, always marked as such:

- Later catalogue P7 price rises from 20.00 to 22.00. The agreed 103/1 price stays 20.00 and total stays 29.00; repricing at current prices would give 31.00. No additional taxes, delivery charges or discounts are part of this simple line total.
- Supplier S1 North and S2 Harbour; shop location L1 Town and L2 Station. Complete offers are exactly (S1,P3,L1), (S1,P7,L2), (S2,P3,L2). Pair projections admit the additional (S1,P3,L2). One current offer per triple is the stated key assumption.
- Separate independent-set illustration: P7 tags gift and ceramic, suppliers S1 and S2. Tags do not restrict suppliers. These supplier facts are independent of the location-specific offers, not a claim of offers at every location.
- Optional subtype illustration: P3 tea details brewing temperature 80 °C; P7 teaware material ceramic. Tea and teaware are disjoint and total under the example's stated policy, which the detail tables alone do not enforce. P9 belongs to teaware but no extra material value is invented for it.
- Hypothetical categories: Tea things root; Drinkware and Gifts beneath it; Mugs beneath Drinkware. Moving Mugs to Gifts is one change case; multiple-parent version connects Mugs to both Drinkware and Gifts. No core product-to-category assignments are claimed.
- Hypothetical third line (103,3) for P7 with a different agreed price is a schema counterexample, not a stored row or a new total. No new agreed amount is assigned.
- Name correction and a new unsold product are change cases; no replacement name/product code is invented. Removing P9's sole sale line is a diagnostic thought experiment, not an edit to the core.

Central illustration data: src/components/modelling-first-draft/model.mjs. Static figures repeat only the small visible facts needed to read them. No canonical collection record was changed. Planned children have no live links and are labelled unavailable.
