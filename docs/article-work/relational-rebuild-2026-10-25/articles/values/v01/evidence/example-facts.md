# Example facts and continuity · values

Starting facts used: P7 Blue mug, current price 20.00; P3 Green tea, 50 g; P9 Teapot; order 103 placed 2026-10-20 10:15 UTC. Prices have no assigned currency. No price, stock, order line, status or payment was changed. Order 103 remains without a payment row.

Approved value scenarios: package_weight_g is integer, P3=65, P7=NULL meaning not yet measured, P9=820; loyalty_code is TEA-7 for Mina/customer 1, NULL for Tariq/customer 2 and Edda/customer 3. P3’s 50 g of tea is explicitly distinguished from its invented 65 g package measurement. The figure and SQL verifier import the same package and predicate records from model.mjs.

Coordinator approved the following independent illustrations in this authoring turn:

- Divide P7’s 20.00 into three calculated shares, no payment created. Individually rounded shares total20.01; the illustrated allocation6.67+6.67+6.66 totals20.00. The choice of smaller share remains a business rule.
- Compare P7/p7 as candidate input spellings, no new product assignment. P10,007 and café variants are comparison inputs, not added shop rows.
- Clock example at 2026-10-25 00:00+02 in Europe/Stockholm. +1 calendar day reaches26Oct00:00+01 (25elapsed hours); +24hours reaches25Oct23:00+01. This is independent of order103. Zone is explicit in SQL and caption.

The pack-size decomposition is a possible representation of P3’s existing label, not a shared schema migration. Missing reasons beyond not-yet-measured are design alternatives, not new observations.

Continuity pass: types/units precede arithmetic; decimal versus integer input precedes rounding; instant precedes zone arithmetic and business dates; stored characters precede comparison policy; identifiers precede structured values; the nullable weight is introduced before the interactive filter; unknown precedes NOT/AND/OR, IN, null-safe comparison, COALESCE and constraint distinctions. Definitions stay local. The modelling and query-results links name available owners; no unavailable child reading is promised. No unresolved shared-example dependency.
