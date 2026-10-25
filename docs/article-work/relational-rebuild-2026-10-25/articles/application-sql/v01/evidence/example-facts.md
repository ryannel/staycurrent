# Application SQL example continuity

Starting record: supplied docs/coverage/relational-rebuild-2026-10-25-example.md. No new shared records introduced. Commissioned direct writing, no older drafts or reviews.

- History begins after purchase103, with Mina/customer1 owning103 (pending,20October10:15UTC) and101 (paid,12October09:30UTC). Each has two lines, quantities/prices from the shared record. Batched lines ordered by order ID are101 then103, independently of newest-first parent order103 then101.
- Loop loading returns2+2+2=6 rows over3 queries; batched returns2+4=6 over2; joined returns4 over1. These are row and query counts, not measured timing or byte costs. No payments join is added to the loader.
- LIMIT2 on the joined result keeps only103's two lines. Bounding parents to2 first retains103 and101 with all4 lines. LEFT JOIN preserves parents even without lines; no new empty order is invented for the displayed data.
- Purchase replay is centrally approved: delete103 and its lines before replay; P3=12,P7=1,P9=4. Apply guarded P3 decrement2 then P7 decrement1, order103 and known lines. After commit P3=10,P7=0,P9=4,103 pending, line value29.00, no payment. This reverses the introduction's illustrative per-product order but preserves its facts and transaction outcome; there is no order-dependence claim.
- Independent guard-failure variant sets P7 stock0 before the attempt. Tea allocation happens first, mug guard matches0, purchase stops and rollback restores the tea count12. Order103 remains absent. This is a counterexample operation, not a new shared starting row.
- Independent split-session counterexample uses two explicitly held native connections. BEGIN/ROLLBACK on A cannot undo B's implicit committed decrement. The figure states possible dispatch, not an observed pool selection order.
- Session setting illustration explicitly starts each comparison from UTC, so the SET LOCAL row does not imply repairing an earlier session-level Stockholm setting.
- Email confirmation is hypothetical external work, with no new payment/order status/job identity or delivery outcome. Authority and row-context examples introduce no new customer or committed rows.

Continuity reread: prerequisites supplied by introduction and query-results; define driver/pool/ORM before use; selected row contract before N+1; one-client ownership before cleanup; known versus unknown outcome before external work. Planned neighbouring reading is explicitly named as planned and no unavailable destination is promised.
