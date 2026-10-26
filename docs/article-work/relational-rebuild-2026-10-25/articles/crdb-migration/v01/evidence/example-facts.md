# Example facts and continuity

Independent application replay before 103: products P3/P7/P9 price 4.50/20.00/35.00, stock 12/1/4. Customers Mina1, Tariq2, Edda3; orders101/102 and original3 lines/payments501–503 copied unchanged. Order103 absent initially.

First accepted target work is purchase-103, scoped to customer1 + operation purchase. Canonical basket P7×1 at20.00 and P3×2 at4.50. Accepted result order103 pending, placed2026-10-20 10:15 UTC, lines1 P7 and2 P3, total29.00, stock10/0/4, no payment. Retained work order-103-ack acknowledges pending order received for29.00; dispatch stays stopped and state remains ready. No real receiver or payment operation.

Native fixture uses a local, explicitly simplified text payload/result encoding and an operation column on purchase_requests; this is not a collection-wide schema revision or a replacement for the neighbouring transaction article's complete retry protocol. It retains the same logical identities and business meaning.

The source original remains pre103 and closed after forward transfer. Return copies all seven tables from closed CockroachDB to a fresh PostgreSQL database sc_pg_crdb_migration_return. Same request/acknowledgement retained; no purchase reconstruction, new charge or dispatch.

Transient native negative scenarios reset before final source export: runtime changes P9 name to Teapot (late writer), administrator restores Teapot; established source snapshot retains P7price20.00 while independent commit changes22.00, then reset20.00. Candidate P7name corruption detects equal-count insufficiency, then resets Blue mug. Unavailable-mug attempt rolls back P3 decrement10→8; retained stock stays10/0/4 and no new records remain. These changes do not become shared starting facts.

Only local representation choices and bounded technical variations used. No proposed shared business extension or ownership change. Copy and authority orderings are explicitly models; observed outcomes are separately qualified. No invented native timestamps, timing, placement, survival or provider outcomes.
