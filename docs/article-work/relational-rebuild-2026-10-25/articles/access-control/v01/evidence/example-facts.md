# Example and continuity

Approved central access scenario only: shop_runtime, shop_migrate, shop_support; customers1 Mina Shah,2 Tariq Aziz,3 Edda Berg belong to tenant10; customer4 Rowan Vale belongs to tenant20; customer IDs globally unique. Orders101/102/103 keep approved customer/status/times. No new rows or people.

Independent conceptual connection reuse: tenant10 request sets10, ends; tenant20 request borrows same connection but omits setup. Transaction-only missing context produces no rows; retained10 exposes Mina/Tariq/Edda. Correctly setting20 returns Rowan. No arbitrary timing is implied. Baseline has no older session tenant to restore. Figure3 is labelled a conceptual sequence, not an observed trace.

Native experiment is narrower: customer/order projection; runtime tenant10 reads1–3, customer4 hidden; forged20 returns4; retained20 continues returning4 in a new transaction. Original orders unchanged. Forbidden insert reuses order103 and fails RLS before the key conflict; no new order invented. Owner is a deliberate bypass counterexample. Fixtures clean up all objects/logins; root removed server.

Runtime purchase authority in table is a proposed design from the shared purchase replay (reads customer/products; inserts orders/lines; updates stock; no payment). It is not claimed as a fully executed purchase privilege suite. Native order UPDATE permission is a bounded policy probe, not extra recommended checkout authority.

Continuity reread: person/service/tenant introduced before row policy; policy introduced before context lifetime; existing/proposed-row checks before integrity comparison. Tenant membership does not authorise all people within tenant10. Integrity link owns composite-reference procedure. PostgreSQL link owns native roles, bypass and privileged-code procedures; CockroachDB link owns its secure implementation. No unresolved example extension needed.
