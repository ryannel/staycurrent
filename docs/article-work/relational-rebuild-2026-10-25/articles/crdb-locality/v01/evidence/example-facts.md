# Example and continuity decisions

Use only the authorised CockroachDB locality branches from the updated shared example. North/West/East are technical labels, not customer residence/geography. Products RBT West; its price20.00, post-purchase stock P3/P7/P9=10/0/4. RBR independent order copy:101/103 North,102 West; original order/customer/product/payment references and global integer order_id retained. Lines explicitly receive matching homes. Added history index uses(customer_id,placed_at DESC,order_id DESC)STORING(status), already introduced by finished neighbours; every index is region-partitioned. Dates in figure abbreviate exact UTC timestamps. No added core business rows.

GLOBAL order_statuses(status) contains only pending/paid/cancelled, assumption frequent multi-region reads/rare definition changes; does not replace orders status check. No new status or payment.

Purchase replay is explicitly independent of placement-only post103 state: pre103 stock12/1/4, pending order103+two lines,29.00/no payment, final10/0/4. Native fixture tests placement-only state, not a complete purchase or failure transition.

Local illustrative choices: North primary, stock service West, gateways North/West; illustrative region-survival layout West2/North2/East1, remote2/1 exchange allowed; three West voters plus one nonvoter in each other region for zone model. Figures are structural policy models, never observed node schedules, measured geography or RTT. The row-home figure depicts home partitions, not copy exclusion/range count. Primary default, gateway, home, leaseholder and voter role remain separate throughout.

Continuity pass: opening names prerequisites before using them; table-route comes before row prefixes; identity cost comes before GLOBAL and survival; configured policy precedes actual-placement evidence and request acceptance. Explain selection without expanding query tuning, read protocol internals or cluster maintenance. No shared-fact change proposed.
