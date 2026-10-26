# Example and continuity

Use an independent post-103 catalogue-price variation. Baseline product rows P3/P7/P9: prices4.50/20.00/35.00, stock10/0/4. Pending order103 has lines P7×1 at20.00 and P3×2 at4.50, total29.00, no payment. P7 catalogue changes20.00→22.00 once. Binary return retains22.00 and all order/stock/payment invariants. No business effective/recorded dates, customer identities, payment or new order introduced.

Figure node labels A/B/C are local model labels, not native node IDs. All stop/restart intermediate actions compressed into completed checkpoints; not a timing capture. Figure finalising state assumes actual migration start, not merely an attempted version-setting request. Return path never follows a begun finalisation.

Native verification uses upgrade_shop, an explicitly reduced projection of relevant shared facts, on the exact root-owned fixture. No tenant/security scenario is executed there. Client/TLS/pool and finalisation-dependent view acceptance are described as deployment requirements, not established by this fixture.

Ownership kept: general movement/redundancy budgets with rebalancing; secure identity and drain details with operations; application schema changes with schema-jobs; restore/fencing/reconciliation procedure with backup; retry protocol with native transactions. Article owns binary inventory, held state, return eligibility and finalisation boundary.

Native attempt3 completed binary rollout, rolling return and second rollout. It changed P7 to22.00 before the first restart as a persistence test; figure places that separate change at held acceptance. Both keep the same post-103 invariants. Running-stage version26.1-upgrading-to-26.2-step-016 is an actual observed value; final26.2 outcome is still a documented model. No new shared business fact or ownership extension needed.
