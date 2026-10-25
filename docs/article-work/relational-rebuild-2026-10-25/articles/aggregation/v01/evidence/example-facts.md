# Example and continuity

Uses the supplied shared example unchanged: Mina orders 101 and 103, Tariq 102, Edda none. Lines 101/1 P3×1 at4.50, 101/2 P9×1 at35.00, 102/1 P7×2 at20.00, 103/1 P7×1 at20.00, 103/2 P3×2 at4.50. Orders 101/102 paid, 103 pending. UTC timestamps remain 12 October09:30, 14 October16:05 and 20 October10:15. Amounts have no assigned currency.

Derived line_facts is one row per order line, identified by (order_id,line_no); quantity is not row count. Names Tea/Mug/Teapot are short figure labels for P3/P7/P9. Values use recorded unit_price, never current catalogue price. P3/P7 total3 units each, P9 total1; five lines, seven units, value108.50.

Reuses existing approved package-weight scenario separately: P3=65g, P7=NULL/not yet measured, P9=820g. No shared extension needed or invented committed rows. LAG(NULL) uses a labelled abstract two-row VALUES counterexample only in verification/download.

Logical figure order is not a physical execution claim. Rank peers use units only; final display uses product ID. ROWS cumulative frames use (placed_at,order_id,line_no); timestamp peer frames intentionally omit line keys. Neighbour owns per-order still-due report; this article generalises grouping rather than reproducing it. No unavailable child reading promised.
