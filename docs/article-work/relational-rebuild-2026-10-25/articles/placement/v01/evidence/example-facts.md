# Example and continuity decisions

Regional topology is a local illustrative variation, not a shared business-fact change. Root was informed before drafting. No shared rows, ownership assignment or neighbour scope changed.

- Regions North, West, East are invented; each drawn voter has its own machine and zone.
- Figure 1 has independent fixed groups distributed [3,0,0], [2,1,0], [1,1,1] and [2,2,1]. Removing North zone 1 removes one voter. A North network split leaves West and East communicating with one another. Structural availability is conditional on working survivors, suitable leadership, client access and capacity.
- Figures 2–4 use one voter of each relevant owner per region. P leader West; A leader North; North application. Every owner has an independent majority of two.
- Assumed network-only RTT West–North 40 ms and West–East 90 ms. Healthy Figure 2 assumes North’s acknowledgement is first useful; no storage/SQL/transaction/election time is assigned. Non-required follower progress is unknown after the sends. Leader applies only after establishing commitment; acknowledging follower may still show 20.00.
- Figure 2 and Figure 4 independently reuse P7 catalogue price 20.00→22.00. Post-103 stock remains P3/P7/P9 = 10/0/4. Order 103 stays pending with agreed total 29.00 and no payment. Figure 4 uses West+East as the already successful durable majority, with North not yet applied.
- Figure 3 replays purchase 103 from before order/lines exist: P7 1→0, P3 12→10, P9 remains 4. Order 103’s two agreed lines are P7×1 at 20.00 and P3×2 at 4.50, total 29.00. No payment. A owns related order work; P owns both product rows.
- Optional G is a hypothetical global order-ID association authority, led in East with its own three-region voters. Its association work must join the full atomic purchase protocol. It is not an engine claim, extra starting row, independently committed reservation or proposed shared extension.
- (North,103)/(West,103) are key-rule counterexamples, not additional shop orders. Copies of catalogue data never become independent stock allowances.

Continuity reread covered the full body, all figure states, controls, captions and text alternatives. The route moves from failures → majority count → remote acknowledgement → multiple owners → global invariant → read history → request-level checks. Safe membership changes stay with cluster-change; native settings with crdb-locality; atomic decision/recovery with distributed-commit; safe common read machinery with distributed-snapshots; target qualification and copied-history progress with replicas. No unresolved scope or shared-fact dependency.
