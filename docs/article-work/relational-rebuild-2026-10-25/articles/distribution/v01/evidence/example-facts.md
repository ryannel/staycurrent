# Example and continuity · distribution

Core facts retained: Mina/customer 1 owns 101 and 103; Tariq/customer 2 owns 102; Edda/customer 3 has no core order. Paid line report returns customer 2 40.00, customer 1 39.50. Pending 103 contributes no paid report group and has no payment. Post-purchase stock is P3 10, P7 0, P9 4. Monetary amounts have no assigned currency.

Independent price branch: P7 catalogue 20.00 → 22.00; no change to stock, pending status, payment absence, agreed line prices or 29.00 total. U is a symbolic replicated command, not a native log address or database transaction identifier.

Independent purchase replay: before 103 exists, P7 1/P3 12; create pending 103, lines P7×1 at20.00 and P3×2 at4.50; successful stock0/10; no payment, P9 stays4. The read schedule assumes an atomic purchase, then contrasts separate reads straddling it with two common snapshots. No observed concurrency run is claimed.

Local illustrative assumptions: customer shards A/B/C, products P; related customer/order/line/payment placement is compatible. Product rows P3/P7/P9 all have owner P, giving two *data* participants for purchase103. Extra constraint/index/identity work may add participants and is explicitly outside the figure's data-owner count. A routing column alone is not claimed to enforce global order identity or references.

Topology figure: every shard has three replicas on machines1–3, with rotating leaders. It deliberately repeats every shard on every machine and makes no per-machine storage saving claim. Later product consensus replicas use R1/R2/R3, avoiding collision with customer-shard names. Three-voter Raft model assumes fixed membership, current-term U, non-malicious crash/recovery, and honest durable storage. Leader knowledge of commitment is distinguished from the earlier existence of two durable copies.

Twelve-key range/hash mapping is invented, separate from the core three customers; keys4–12 do not add shop customers. Separate generated-fixture fact: 84,000 of120,000 orders are for1001; no request frequency is inferred. Composite-key duplicate103 pairs are isolated counterexamples, not added orders.

No shared business-fact or ownership extension proposed. Child articles retain detailed commit recovery, timestamp/safe-read algorithms, regional placement and cluster membership procedures. PostgreSQL and CockroachDB mechanisms remain implementation routes.
