# Scenario and continuity record

Starting facts: shared Mina customer 1 after order 103; orders 103/pending at 20 October 10:15 UTC and 101/paid at 12 October 09:30 UTC. History SQL explicitly orders descending timestamp then order ID, limit ten. No row, stock, price, payment or business event changes.

Independent illustrative branches:

- Scaled request: 600 ms acquiring a connection, 300 ms statement, final 100 ms receiving/processing/returning result. Consecutive simplified stages; no observed timings. Total is 1,000 ms; nested statement time is not added again.
- Pool-only distinction: a later caller has not borrowed or sent its statement. Borrowers can be doing work, waiting or retaining a client in application code. This is a causal distinction, not an observed pool fixture.
- PostgreSQL lock-only chain: H is a separate connection from the application pool; ACCESS EXCLUSIVE on orders; transaction remains open after lock statement. Three pool clients have blocked ordinary history reads; two later callers queue for clients. One queued caller leaves and is removed. H rolls back; readers can proceed, then consume results/end transactions/return clients. Remaining caller can borrow. Counts and selected order are illustrative. No stock or order changes.
- Resource-sharing branch: same paid-order report as the execution article, October range, exact core result Tariq 40.00 then Mina 39.50, pending 103 excluded, Edda absent. No generated fixture timings or counts are claimed as incident evidence.
- Free-space model: one volume has 12/8/4 GiB at minute 0/5/10. Assumed extra repair requirement is 6 GiB. At minute ten the repair does not fit before further reserve. Constant extrapolation is 0.8 GiB/minute and five minutes remaining; neither the rate nor repair requirement is general advice.

No shared extension or new business identifier was needed. H and client labels describe roles, not new shop people/rows.

Continuity pass: complete article, captions and controls reread. New terms are introduced by function (pool, blocker, backfill). Native commands/counter interpretation, lock-protocol repair, query-plan repair and capacity budgets stay with their assigned owners. Both children have contextual handoffs. Commit uncertainty is qualified and handed to retries, not resolved by a timeout or session end. Illustrations remain models; only exact SQL results claim PGlite execution.
