# Example facts and continuity

Shared purchase103 replay: before order/lines exist, P3 stock12, P7 stock1, P9 stock4. Customer1 Mina Shah is on shard A; products on P. Atomic purchase makes pending103, two lines P7×1 at20.00 and P3×2 at4.50, total29.00; P3 stock10, P7 stock0, P9 unchanged4; no payment. Order placed_at remains20 October2026 10:15UTC, but no figure treats it as a database commit timestamp.

Local model assumptions, not shared business facts:
- One timestamped MVCC history with atomic commit40. Snapshots35 and45 respectively exclude/include both participants. No new rows or transactions added.
- Counter trace A7→8 send; P3→9 receive→10 event. Independent HLC trace A(100,0) send, receiver physical98 produces(100,1), later physical103 produces(103,0).
- Skew illustration actual completion1000ms / clock1008, subsequent start1002ms / clock998. Independent honest intervals[1000,1010] choose s1010, later[1011,1021] prove earliest>s. All relative coordinates unrelated to business time.
- Closure model35 then45, required local logn8, durable/applied initiallyn6, durability then applicationn8. Relevant provisional outcome38 holds back completeness until resolved or moved. Raw engine closure does not assert all intents cleaned up; complete model frontier does.
- Serviceable intervals A[20,60], P[30,50], intersection[30,50]. Separate retention variation A[52,60] removes overlap. Minimum permissible timestamps48/55 demonstrate bound intersection, not seconds of lag.

Continuity pass: each new term introduced before use; numerical timestamp/log/physical units separated; snapshot/progress/freshness/authority remain distinct throughout; absence needs completeness; read-only freshness does not reserve stock; no ownership change proposed. Atomic decision/recovery and native follower/isolation details remain with their owners.
