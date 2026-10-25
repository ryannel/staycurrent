# Example and continuity

No shared starting facts were extended. The article uses order 103, customer 1/Mina Shah, P7×1 at20.00 and P3×2 at4.50: total29.00, pending, no payments. It never reprices agreed lines or claims a payment settlement from status alone. `order_items` rows are called order lines.

Independent scenarios:

- Proposed order103 line3: P7 with quantity2,0 or NULL, comparing CHECK alone with required CHECK. Nothing carries forward between attempts.
- Line103/1 duplicate versus a separate103/3 P7 occurrence. Already-stored102/1 demonstrates the same line number in another order; it is explicitly not an attempted insert into the occupied key.
- Optional loyalty code TEA-7 for Mina; Tariq and Edda NULL. Assigned codes unique, several unassigned permitted.
- Delete103 with an explicitly hypothetical editable-order cascade: its two lines vanish, products remain. Retention policy is not inferred.
- Accepted tenant variant:10 owns starting shop,20 owns Rowan Vale/customer4; candidate(10,4) fails the pair reference. IDs remain globally unique. Composite referencing across lines/products/payments follows the same required-tenant association. Permission is kept distinct.
- Accepted R1 reservations7001 [10:00,11:00), attempted7002 [10:30,11:30), adjacent7003 [11:00,12:00), all2 November2026 UTC. Attempts independent.
- Import scenario: new order105 arrives after its line in one deliberately deferred transaction. This is a scenario operation, not an addition to the shared starting rows.
- Accepted payment-ceiling scenario: two proposed20.00 payments read0.00 against29.00, both insert before either commits. Conceptual schedule only. No safe protocol is claimed to have been executed.

Verifier-only schemas also exercise generic actions, omitted protections and partial uniqueness. They are disposable counterexamples, not additional reader facts.

Continuity reread completed: required value precedes NULL-dependent check; keys precede references; ordinary references precede tenant pairs; exclusions precede timing; aggregate/concurrency limits come after declarative choices. The article teaches its full owned rule-design outcome and marks the history/access/transaction destinations as planned. No unresolved shared-example dependency.
