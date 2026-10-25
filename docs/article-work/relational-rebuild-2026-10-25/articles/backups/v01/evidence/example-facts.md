# Example and continuity · backups

Uses the shared recovery reconciliation branch, separately from the successful 22.00 price change and the bitemporal schedule. Start post-103: P7 catalogue 20.00; pending order 103; lines P7×1 at20.00 + P3×2 at4.50 =29.00; no payment; stock P3/P7/P9=10/0/4. Mistake sets catalogue2.20. Later payment504 records10.00 by card; pending balance19.00. Hypothetical provider’s accepted charge survives the restore.

Stable operation identity exactly `order-103-part-payment-1`, immutable order/amount mapping and queryable result. No currency, new native times, LSNs, transaction IDs or provider object IDs supplied or inferred. Pre-mistake restore retains the purchase/stock and omits both mistaken update and later payment. Reconciliation records payment504 and its identity once; it does not charge, place the purchase or consume stock again.

A/B/C are conceptual required log intervals with order103/mistake/payment respectively. Starting copy includes its required consistency history. Missing B blocks C on that path; no claim that all alternative paths are lost. Source-final boundary is an explicit prerequisite to completing later-work accounting. Provider uncertainty/mismatch remains open.

Local temporary `provider_evidence` and `recovered_operations` model supplied evidence and reconciliation records; they do not extend the shared starting shop. SQL fault injections (mismatched amount/mapping/payment; moved existing503; split write; deliberate ledger failure) are isolated verification perturbations, not further shop events. All revert/clean before the final fixture state and disposable instance close.

Continuity pass: introduced backup/restore then objectives/dependencies, target, verification, finite source boundary, operation classification, identity/atomicity, external outcome, service handover. Figures/captions/text alternatives use the same facts. Business correction stays with history; fencing with failover; native recovery commands with PostgreSQL/CockroachDB; delivery mechanics with outboxes. No unresolved shared extension requested.
