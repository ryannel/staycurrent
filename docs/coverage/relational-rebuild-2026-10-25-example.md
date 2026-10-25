# Shared example: starting state

The shared collection example supplies the starting facts below. Select what serves the explanation. Develop coherent worked scenarios from these facts and record scenario changes with the work. Monetary amounts have no assigned currency. The schema supplies factual context for the article.

## The core example: a small online shop

A shop sells tea and tea things. Customers place orders, each order has numbered order lines, and payments settle orders. The shop is enough to teach keys, joins, constraints, aggregation and a first race between two buyers.

### People

| Person | Role | Notes |
| --- | --- | --- |
| Mina Shah | Customer 1 | Places orders 101 and 103. Wins the race for the last blue mug. |
| Tariq Aziz | Customer 2 | Places order 102. Loses the race for the last mug with order 104. |
| Edda Berg | Customer 3 | Has no orders in the core example. Available as a third buyer or for a customer without orders. |

Customers are always customers. Staff, instructors, managers and other roles get their own names (see the class-booking extension).

### Tables, keys and starting rows

```sql
customers   (customer_id integer PRIMARY KEY, name text NOT NULL)
products    (product_id text PRIMARY KEY, name text NOT NULL,
             price numeric(8,2) NOT NULL CHECK (price >= 0),
             stock integer NOT NULL CHECK (stock >= 0))
orders      (order_id integer PRIMARY KEY,
             customer_id integer NOT NULL REFERENCES customers,
             placed_at timestamptz NOT NULL,
             status text NOT NULL CHECK (status IN ('pending', 'paid', 'cancelled')))
order_items (order_id integer REFERENCES orders, line_no integer,
             product_id text NOT NULL REFERENCES products,
             quantity integer NOT NULL CHECK (quantity > 0),
             unit_price numeric(8,2) NOT NULL,
             PRIMARY KEY (order_id, line_no))
payments    (payment_id integer PRIMARY KEY,
             order_id integer NOT NULL REFERENCES orders,
             amount numeric(8,2) NOT NULL CHECK (amount > 0),
             method text NOT NULL)
```

In prose, a row of `order_items` is an **order line**. The table name stays `order_items`.

**Products** (stock before order 103):

| product_id | name | price | stock |
| --- | --- | --- | --- |
| P3 | Green tea, 50 g | 4.50 | 12 |
| P7 | Blue mug | 20.00 | 1 |
| P9 | Teapot | 35.00 | 4 |

**Orders and order lines:**

| order_id | customer | placed_at (UTC) | status | lines | value |
| --- | --- | --- | --- | --- | --- |
| 101 | Mina (1) | 2026-10-12 09:30 | paid | 1: P3 × 1 at 4.50; 2: P9 × 1 at 35.00 | 39.50 |
| 102 | Tariq (2) | 2026-10-14 16:05 | paid | 1: P7 × 2 at 20.00 | 40.00 |
| 103 | Mina (1) | 2026-10-20 10:15 | pending | 1: P7 × 1 at 20.00; 2: P3 × 2 at 4.50 | 29.00 |

**Payments:** 501 (order 101, 30.00, card), 502 (order 101, 9.50, gift card), 503 (order 102, 40.00, card). Order 103 has no payment, which is what makes the "what is still due" report interesting.

After order 103 commits, stock is P3 10, P7 0, P9 4.

## Worked query scenarios

These scenarios start from the shared rows above. They are separate explorations.

- Partial payment: add payment 504 for order 103, amount 10.00, method card. Keep the lines and pending status. Recorded balance is then 19.00; the order has a payment without being fully paid.
- Equal line values: split order 102's quantity-two P7 line into numbered lines 1 and 2, quantity one and agreed unit price 20.00 each. Keep payment 503 at 40.00. The two occurrences total 40.00; removing equal amounts before summing would give 20.00.

## Worked value scenarios

- Package weights: add a nullable integer package_weight_g field for this scenario. P3 is 65 grams, P7 is NULL meaning not yet measured, and P9 is 820 grams. These are invented example measurements.
- Optional loyalty codes: add loyalty_code for this scenario. Customer 1 has TEA-7; customers 2 and 3 have no assigned code (NULL). Any uniqueness policy and engine behaviour must be stated explicitly.

## Worked integrity scenarios

- Tenant integrity: tenant 10 has the starting shop rows; tenant 20 has customer 4, Rowan Vale. Customer IDs remain globally unique. Orders also carry a tenant ID. The proposed pair `(tenant_id, customer_id) = (10, 4)` exposes a mismatched association.
- Room reservations: R1 has reservation 7001 on 2 November 2026, 10:00–11:00 UTC. Attempt 7002 is 10:30–11:30 and overlaps; attempt 7003 is 11:00–12:00 and adjoins. All intervals use half-open `[start, end)` bounds. This is a resource non-overlap scenario.
- Payment limit: starting from order 103's line value 29.00 and no payments, suppose total recorded payments may not exceed the line value. Two attempted payments of 20.00 (attempt IDs 601 and 602) after separate reads can exceed the rule together. These are scenario attempts, not new starting rows.
- Deferred reference: new order 105 belongs to customer 1, placed 25 October 2026 at 12:00 UTC, pending. Its line 1 is P7, quantity 1, unit price 20.00. The line arrives before its parent within the same illustrative transaction.

## Modelling scenarios

These illustrations start independently from the shared rows unless stated otherwise.

- Add order 103 line 3 for P7 to distinguish line identity from product identity.
- Correct customer 1's current name from Mina Shah to Mina Patel.
- A later P7 catalogue price is 22.00. Its agreed order-103 unit price remains 20.00, preserving the order total 29.00; repricing it would give 31.00.
- Offers are `(S1, P7, North)`, `(S1, P3, South)`, `(S2, P7, South)`. `(S1, P7, South)` is absent.
- P7 has independent tags gift/ceramic and suppliers S1/S2.
- A subtype example gives P3 origin Japan and P7 capacity 300 ml.
- Categories are Teaware → Mugs → Blue mugs. A multiple-parent alternative also places Mugs under Gifts.

## Calculation and clock scenarios

Divide P7's 20.00 into three shares without adding payments; compare written forms P7/p7 without adding a product. A separate clock example compares the Stockholm calendar day 25 October 2026 with 24 elapsed hours. It does not change order 103's time or the shop rows. The writer retains the actual named-zone verification and runtime.

## History scenarios

P7's price 22.00 is initially recorded on 21 October 2026 at 12:00 UTC as effective from 22 October at 00:00 UTC. On 24 October at 09:00 UTC, its effective time is corrected to 21 October at 00:00 UTC. Price 20.00 applies before the relevant effective boundary. Use a displayed window beginning 20 October, without inventing an earlier origin date. These are business recording/effective times, not asserted database commit timestamps. Order 103 remains on 20 October, with agreed unit price 20.00 and total 29.00.

A separate hypothetical later customer-1 deletion request includes a generated invoice PDF and a derived search copy as external dependants. No retention duration or legal outcome is specified; the scenario takes an approved policy decision as an input.

## Catalogue import B17

Immutable source rows have identity `(batch_id, row_no)`:

| Row | Product | Name | Proposed price |
| --- | --- | --- | --- |
| 1 | P7 | Blue mug | 22.00 |
| 2 | P11 (new) | Tea strainer | 8.00 |
| 3 | P3 | Green tea, 50 g | -4.50 (rejected) |
| 4 | P9 | Teapot | 36.00 |

The feed supplies catalogue name and price. Existing stock and order-line agreed prices stay unchanged; new P11 starts with stock 0. Rows 1 and 2 and their applied records commit. Work stops before row 4's chunk starts, leaving row 3 rejected and row 4 pending. This is a known pre-start interruption. Resuming applies row 4; final accounting is 4 received, 4 validation decisions, 1 rejected, 3 applied and 0 pending.

A separate duplicate-P7 input proposes 22.00 and 23.00; both source rows are rejected before application. A separate stock-replenishment illustration starts at 1: adding 2 reaches 3, and an accidental additive replay reaches 5. Neither variation changes B17's starting rows.

## Application purchase replay

Replay order 103 creation before that order or its lines exist, with stock P3 = 12, P7 = 1, P9 = 4. Success produces the supplied pending order 103 and two lines, stock P3 = 10, P7 = 0, P9 = 4, and no payment. Other existing orders/payments remain unchanged. This is the introduction's before/after-purchase scenario.

## Pagination list scenarios

An independent projected list adds pending order rows 201 and 202, customer 3, both placed 20 October 2026 at 10:15 UTC, tied with 103. Their unused line/payment details are unspecified. Descending `(placed_at, order_id)` gives 202, 201, 103, 102, 101. Page size 2 ends at 201; the next cursor needs timestamp and ID to retain 103.

Independent next-page mutations:

- Insert 203 at 21 October 2026, 09:00 UTC, exposing an offset repeat.
- Delete 202, exposing offset omission of 103.
- Correct unread 103 to 21 October 2026, 08:00 UTC, exposing omission across a keyset boundary.
- Move already-read 202 to 19 October 2026, 12:00 UTC, exposing a repeat after cursor 201.

Preserve core 103/104 and the separate constraint-deferral 105 scenario.

For a separate export comparison, change unread 103 from pending to paid between batches while its sort key stays fixed. Compare separate Read Committed observations with one read-only Repeatable Read transaction whose first SELECT has already established its snapshot. A retained projection created by one SELECT can keep the earlier status; retaining IDs then joining live rows cannot preserve earlier values. Native two-session verification is retained with the pagination first version.

## Transaction and locking scenarios

The order 103 purchase replay and payment-limit attempts 601/602 are separate experiments. PostgreSQL Read Committed absolute stock writes can both store 0; a guarded decrement makes the second attempt wait and then affect 0 rows. Any earlier tea decrement in the losing purchase rolls back with it. Repeatable Read establishes its ordinary snapshot at the first snapshot-taking statement, not merely BEGIN; a conflicting same-row change can fail with 40001. Independent payment inserts under Repeatable Read can both accept 20 against the same earlier total 0; Serializable must reject one such execution, and a fresh attempt sees 20 and declines the additional 20. No particular session is universally the victim.

For the payment-limit lock protocol, every relevant payment and order-line mutation must coordinate through the same order authority row. A separate Read Committed read after acquiring that row lock can see the first committed payment of 20. Locking an unchanged authority row does not refresh an earlier Repeatable Read snapshot. Acquiring the guard and reading payments within one Read Committed statement also retains that statement's earlier snapshot. Lock-only P3/P7 experiments isolate waiting/deadlock: reversed acquisition may produce 40P01 with no prescribed victim; consistent P3 then P7 order completes both. These lock-only experiments do not change stock.

## Request identity and asynchronous work

The purchase replay may add caller request token `purchase-103`, scoped by customer 1 and operation purchase. It is distinct from the resulting order number. Store the relevant canonical payload and durable terminal result together with the purchase; the fixed request is P7 × 1 at 20.00 and P3 × 2 at 4.50. Repeating it recovers order 103 without a second decrement; changing quantities under that identity is rejected. Concurrent attempts and missing commit/API replies are separate illustrative executions.

A separate outbox replay atomically creates stable work identity `order-103-ack`: acknowledgement of the pending order received, total 29.00, with no payment or paid-status change. Workers A/B may have claim generations 7/8. The independent replay may use the illustrative lease window 20 October 2026, 10:16–10:17 UTC, after the 10:15 order; these fixed model times are distinct from any native server clock. A hypothetical receiver can deduplicate the stable identity plus fixed payload; ordinary email is not assumed to supply this contract. A bounded optional fencing model uses a receiver that rejects lower resource-scoped generations after accepting a higher one. These are explicit example receiver contracts, not observed production services.

## Access identities

An independent access scenario uses logical identities `shop_runtime`, `shop_migrate` and `shop_support`. Runtime serves authorised tenant requests; migration authority is held separately and changes the schema; support performs a tenant-scoped read of selected customer/order details, with no payment-changing or schema-changing task. These names identify tasks, not existing customers or staff people.

Tenant 10 has the starting shop rows; tenant 20 has customer 4, Rowan Vale. A request authorised for tenant 10 tries selecting tenant 20 or customer 4. No new rows are added. Tenant scope alone does not establish which people may read other people's details within one tenant. Native grants and policy implementation remain with their implementation owners.

## Query execution workload

The initial report sums agreed order-line values for paid orders in the half-open UTC October 2026 range, grouped by customer and ordered by descending value then customer ID. Core rows produce Tariq 40.00 and Mina 39.50; pending order 103 is excluded and Edda has no result row. This is paid-order line value, not payments received.

A separate generated reporting fixture may add historical orders and lines, preserving core rows. The writer must agree exact non-conflicting IDs, counts, seed and skew before reporting observations. Uneven customer frequencies or related date/status distributions may support the explanation; they are not mandatory scenarios. Generated history is a workload model, not a reconstruction of stock. No timing, plan or improvement is established before execution on an owned fixture. Native counter-by-counter interpretation remains with its implementation article.

## Generated report fixture

The generated query fixture uses customers 1001–2000 and orders 100001–220000, with three lines per generated order and no generated payments. For n = 0…119999, day offset is `(37n + 20261025) mod 365` and status selector is `(53n + 20261025) mod 100`. Customer is 1001 when `n mod 10 < 7`, otherwise `1002 + (17n + 20261025) mod 999`. October is day offsets 273…303; paid requires selector < 90 there or < 10 elsewhere. Each generated order has P3/P7/P9 quantity 1 at 4.50/20.00/35.00. Core stock stays at the post-103 values 10/0/4. The native workload has 120003 orders and 360005 lines; observations/settings stay with query-execution evidence, separate from the small teaching rows.

## Formal normalisation variations

A separate `buyer_advice(customer_id, tea_style, advisor_id)` scenario declares `advisor_id → tea_style` and `(customer_id, tea_style) → advisor_id`. Advisers A1, Iris Lin, and A2, Oren Moss, both advise green tea; advisers are not customers. Begin with a valid assignment before demonstrating how separate adviser/style and customer/adviser relations can admit two green-tea advisers for customer 1. No core orders change. Candidate keys and preservation follow the declared dependencies, not apparent uniqueness in sample rows.

Keep the original three ternary offers and its absent `(S1, P7, South)` unchanged. A separately labelled pairwise-approval policy defines eligible offers exactly by supplier/product, supplier/region and product/region approvals. Its closure contains those original three tuples plus `(S1, P7, South)`. This is an independent policy variation for the declared join dependency; no new starting offer is silently added.

## Hierarchy variations

Category IDs are 0 Catalogue (a synthetic root), 10 Teaware, 11 Mugs, 12 Blue mugs and 20 Gifts. Baseline edges are 0→10, 10→11, 11→12 and 0→20. No product membership or order facts are added.

Independent variations move the Mugs subtree from Teaware to Gifts (replace 10→11 with 20→11), retain both parent edges for the multiple-parent alternative, or attempt the descendant-parent edge 12→10 that closes a cycle. Opposing concurrent Teaware/Gifts reparent attempts start from their initially separate branches; any outcome and protection depend on the complete stated protocol/isolation. These variations do not silently become the baseline.

## Index history-query variation

Reuse the exact generated report fixture for a customer-history query returning `order_id`, `placed_at` and `status`, filtered by one customer ID and a UTC lower time bound, ordered by `placed_at DESC, order_id DESC`, limited to 10. Compare common customer 1001 with rare customer 1002 and full history with paid-only history. No new fields, totals or rows are implied. Paid-only history can support a partial-index example; the generated pending population is broad, so do not call it a small slice. The 201/202 pagination projection remains an independent tie illustration if reused.

## Physical storage and durability variations

An independent physical-storage replay updates `P7.price` from 20.00 to 22.00. It retains post-103 stock 10/0/4, pending order 103, no payment and agreed line total 29.00. A report explicitly establishes its snapshot before the update; a later query starts after commit. This variation supplies no business effective/recorded times, transaction IDs, native page addresses or measured counts. Pages and log positions are illustrative unless observed separately.

A separate mistaken committed price 2.20 variation supports recovery choices; it is isolated from the successful 22.00 replay. Do not infer that PostgreSQL asynchronous commit can preserve a dependent database transaction while losing the earlier commit it depends on; external early effects remain a distinct risk.

## Incident diagnosis variations

Use Mina's customer-1 post-103 order-history read across independent illustrative branches, with no committed row changes. A pool-only branch has not borrowed a database connection. In the PostgreSQL lock-only branch, an ACCESS EXCLUSIVE lock on orders blocks ordinary history SELECTs and can occupy borrowed pool clients; ordinary row-update locks do not explain that ordinary-read wait. The resource-sharing branch may reuse the generated paid-order report without borrowing its benchmark timings as incident measurements. Storage counters/free-space trajectories are explicitly synthetic. No new IDs or business facts are added.

## Recovery reconciliation variation

A separate recovery branch starts from the post-103 shop state, commits the mistaken P7 price 2.20, then records the existing partial-payment variation: payment 504 for order 103, 10.00 by card. Order 103 remains pending with 19.00 due. Restoring before the price mistake also omits this valid later database payment; a hypothetical provider's already accepted 10.00 charge survives independently.

The example provider contract uses stable operation identity `order-103-part-payment-1`, an immutable order/amount mapping and a queryable provider result. Reconcile a known accepted result into the restored database, preserving payment 504 and the identity mapping without charging again. An unknown provider outcome remains unresolved. These are illustrative contracts and recovery orderings, with no invented native times, LSNs or transaction IDs.

## Replica read-routing variation

Reuse the independent P7 price 20.00→22.00 replay with one primary and read replicas A/B sharing one identified history. U/C denote symbolic change/commit positions, not native LSNs or measured times. A can have C received and durable before replay, then expose 22.00 to a new snapshot. B can remain before C, so routing a later read from A to B can show 20.00 again. All core stock/order/payment/line facts remain unchanged.

An illustrative required-history token C permits a bounded wait followed by primary fallback or an explicit unavailable result. Qualification is checked on the exact read target before establishing the new snapshot; token semantics and available native controls depend on the engine. Topology/history changes invalidate unqualified position comparisons. Write-authority transfer remains the failover owner's responsibility.

Replica catch-up arithmetic may use an independent assumed 600MiB backlog, 20MiB/s replay capacity and 10MiB/s ongoing generation. Net backlog reduction 10MiB/s implies an ideal 60s; stopping generation gives 30s. These are illustrative fixed-rate inputs, not observed times or a recovery guarantee; no new business facts or native positions are implied.

## Partitioned-copy variation

Use a separate monthly-partitioned copy of the exact generated 2026 order workload, preserving rows, IDs and statuses. A hypothetical approved retirement boundary at 2026-02-01 UTC makes January wholly eligible; a partial-month boundary does not. No real retention duration or legal policy is implied. Core shop rows and schema stay unchanged.

The comparison retains globally meaningful order_id and explicitly distinguishes it from the different uniqueness/reference contract enforced by (order_id, placed_at). Actual retirement must account for incoming references, related lines and retained recovery copies; dropping the model partition does not establish that all related records or copies disappeared.

An isolated key_demo may attempt order_id 103 at 2026-11-01 00:00 UTC to contrast composite-key acceptance with same-pair rejection and ID-only reference refusal. A separate route_demo may reuse 103 at that exact month boundary and beyond supplied ranges, with rollback/owned schema only. Neither demonstration adds an order to the core shop or generated report copy.

## Live representation-migration variation

Independently migrate products.price numeric(8,2) into integer price_hundredths, preserving its existing currency meaning through exact price×100 conversion. Initial P3/P7/P9 values 4.50/20.00/35.00 correspond to 450/2000/3500. Bridge callers read price and atomically write both representations; the chosen protocol drains old-only writers and their in-flight transactions before backfill.

A separate stale-worker race changes P7 price 20.00→22.00 and requires the new representation 2200 to survive an attempted stale 2000 write. A separate late migration arrival may reuse P11 Tea strainer at 8.00/800, initial stock 0, explicitly independently of import B17. Core orders, agreed prices and other stock facts are unchanged. Convergence, writer compatibility and return boundaries must be established by the complete stated protocol, not a cursor reaching the end or a one-time zero-null count.
