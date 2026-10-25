# Example and continuity record

No shared business-fact extension or ownership change proposed.

Independent purchase-103 replay: order and lines absent before the attempt; customer 1 Mina; A owns order work and P owns both product stock rows. Successful purchase creates pending order 103, line 1 P7 × 1 at 20.00 and line 2 P3 × 2 at 4.50, total 29.00, no payment. P3/P7/P9 stock 12/1/4 becomes 10/0/4. Aborted branch retains no purchase and original stock. Other supplied orders/payments are unaffected and omitted.

Author-chosen local protocol assumptions:

- Fixed A/P participant list for the teaching walk; real constraints/indexes can add work/participants. P refusal abstracts a failed readiness check or durable preparation; it adds no buyer or competing row.
- A/P may each have replicated state; the walk omits their replica messages. Prepared states retain enough durable work and protection to honour the final decision.
- Classic 2PC uses one coordinator log, records before notification, and waits for both participants to finish before replying in this deliberately simple schedule. Outcome notifications go to both, including a refuser; this is not prescribed engine traffic.
- Fail-stop/recover processes, durable acknowledged storage, delayed/lost/duplicate messages, retained transaction identities/outcomes. No arbitrary failure timeout, measured delay, production protocol or protection from destroyed durable histories is implied.
- Replicated recovery variant has a separate logical decision state on fixed three voters D1/D2/D3. Its agreement/election rules preserve established final decisions. This is a schematic replicated state machine, not a claim that two cached copies or a replacement process alone establish authority.
- COMMIT already established on D1/D2; D3 earlier. With D1 lost, D2/D3 recover authority and preserve COMMIT. The no-quorum branch fails before either A or P learns COMMIT, leaves only older D3 reachable and provides no other accessible decision witness. This prevents incorrectly implying a quorum read is required even when a participant can supply an already known authoritative outcome. Separate branches, same business result.

Boundaries retained: distribution establishes replica agreement; this article owns distributed atomic outcome and coordinator-loss recovery; isolation, common snapshots, caller request recovery, native CockroachDB protocol/errors and external effects route to their owners. Stable request `purchase-103` is scoped to customer 1/purchase, distinct from order number, and its same payload/result remains atomic with the purchase.
