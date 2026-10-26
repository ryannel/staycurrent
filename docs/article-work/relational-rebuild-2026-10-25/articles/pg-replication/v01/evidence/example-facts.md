# Example and continuity decisions

Reuse the independent P7 catalogue-price replay20.00→22.00. No currency is assigned. Post103 stock remains P3=10/P7=0/P9=4. Order103 remains pending, no payment, P7×1 at20.00 and P3×2 at4.50, total29.00. It is not repriced when the catalogue changes.

H/U/C are illustrative history/update/commit labels, not observed native positions or business recording/effective times. A contains usable C durably before replay; B lacks U/C in the chosen schedule and obtains no extra source. Figure1's stages are chosen separately to expose their meanings, not an observed packet/process trace. Its report's earlier Repeatable Read snapshot was established before U; every 'new read' after C replay uses a later snapshot.

The report/cleanup conflict is a separate continuation: commit replay precedes its cleanup WAL, so that conflict can delay subsequent history rather than preventing the already replayed22.00 from appearing in new snapshots. No additional product operation is invented. Feedback changes primary tuple retention, not the shop's facts.

FIRST/ANY policies are illustrative configuration comparisons, not assertions that every copy retains every confirmed commit. B-loss figure is conceptual. Native B is deliberately stopped before the price update and stays stopped; the verifier does not claim a second promotion of B.

Disposable SQL/native fixtures project the three products and order103/lines/payments, omitting unrelated orders, customers and unused columns. They do not replace the shared schema. The remote_apply demonstration repeats SET price=22.00 as a no-op business change to test the wait. The native return uses a fresh base copy; pg_rewind remains documented procedure, not an executed observation.

Ownership: native physical setup/progress/retention/commit promises/promotion/return here. General read-routing choice remains replicas; general authority/reconciliation remains failover; archives and past-target restore remain pg-backup; selective row streams remain pg-logical-replication; primary cleanup mechanics remain pg-vacuum. No central ownership or shared business-fact change needed.
