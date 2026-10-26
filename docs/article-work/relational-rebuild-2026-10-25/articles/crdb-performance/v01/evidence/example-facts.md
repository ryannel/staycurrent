# Example and continuity decisions

Core figure1 uses Mina1, orders103 (20Oct10:15UTC, pending) and101 (12Oct09:30UTC, paid), with Tariq2/order102 (14Oct16:05UTC, paid) outside her prefix. Dates are abbreviated in the drawing. Its secondary index is an illustrative added structure. No new orders or committed business changes.

Native history fixture preserves the three exact core order rows and reuses the shared generated model: orders100001–220000, n0–119999, seed20261025, day(37n+seed)%365; customer1001 for n%10<7 else1002+(17n+seed)%999; paid threshold90 for October offsets273–303 and10 otherwise, selector(53n+seed)%100. Orders only in this projected access-path fixture; generated customers, lines, payments and stock are not inferred as newly created shop business facts.

Figure4's A/B/C are symbolic successive orders for customer1001; X/Y symbolically belong to customers1002/1003. This keeps A before Y in a shared bucket under ascending customer-ID order. Neither keys nor bucket assignments are claimed native values. Four buckets do not promise four ranges/nodes. Prefix hashing preserves common-customer concentration.

Figure5 and the lock experiment are independent of purchase103: P7 stock1, P3stock12, P9stock4. A is lock-only; B alone decrements P7 to0. This does not claim two purchases succeeded or alter post103 stock in the shared baseline.

The paid-order report's small result remains Tariq40.00, Mina39.50; it sums agreed line values for paid orders, not payments. The distributed drawing splits the three contributing lines across processors: A has101/1=4.50 and102/1=40.00; B has101/2=35.00. Each line is processed once, eligible-order/customer information is available to both sides, and customer1 partials require final combination. Three partials for three lines show no reduction at this tiny scale; the generated model can collapse many lines into a partial. No actual distributed placement or latency is asserted.

Ownership retained: general operator repair/query execution; regional policy/locality; native transaction retries/transactions; historical choices/reads; cluster health/operations; index rollout/schema jobs. Incoming index-choice responsibility is addressed through query, write and ordering costs. No shared ownership changes proposed.

Successful native run:120003 projected orders; all four index paths preserve ordered results for8 combinations (customer1001/1002, lower bound1Jan/1Oct, paid-only/all). The single native range83 covers the history index and a broader key interval, with only node1. Independent stock probe ends P3=12/P7=0/P9=4; it does not replay the multi-line purchase. P7 holder/waiter transaction IDs share /Table/108/1/"P7"/0. Native identifiers/times are evidence, not shared business facts.
