# Relational collection example · 24 October 2026

Status: authoritative clean core, followed by **extensions E1–E7 accepted by the coordinator for this commission**. These extensions settle only the shared facts and explicit variants needed by the plan. They do not prescribe SQL, physical layouts, schedules or artwork. Each article uses a small relevant subset and states its starting state.

The core is reproduced without changing its rows or claims. The three core views are distinct: the report view includes order 103; the race rewinds to before 103; the final protected state includes 103 and excludes 104. Existing orders 101 and 102 are historical examples, not additional deductions from the stated starting stock. Monetary amounts have no assigned currency in the core.

## Authoritative core

Extracted from the canonical relational example record. These are shared facts; select what serves the explanation. The schema is factual context, not a prescribed illustration or SQL lesson. Propose extensions to the coordinator.

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

### Competing purchases

Mina (order 103) and Tariq (order 104) both try to buy the last blue mug, P7, while its stock is 1. The intended business rule is to sell at most that one remaining mug. In the protected example outcome, order 103 succeeds and order 104 does not commit. Order 104 belongs to Tariq and contains only the mug. Choose and verify the explanation of unsafe and protected behaviour against the engine/protocol actually discussed.


## Accepted extension E1: several shops

For tenant integrity, skew, access and sharding examples only, the same application serves shop 10 (the original shop) and shop 20 (Harbour Tea). The original customers, products, orders, lines and payments belong to shop 10. Customer identities stay customer identities. A tenant is a shop, not a customer.

A **tenant-scoped schema variant** adds `shop_id` to related rows, keys and references. In that variant, a product is identified by `(shop_id, product_id)`, an order by `(shop_id, order_id)` and an order line by `(shop_id, order_id, line_no)`. Every child reference carries the same shop ID. This is a deliberate extension, not a silent amendment to the introductory schema. A writer must show which variant is in use.

Shop 20 may have its own P7, called Copper mug at 18.00. Its P7 is distinct from shop 10’s Blue mug. Do not use cross-shop references to satisfy a foreign key. Tenancy enforcement and authorisation remain separate: a correctly scoped reference does not prove a caller may read the row.

For skewed-plan and load examples, enlarge this variant with deterministically generated rows whose seed, size, distribution and observation method are recorded by the implementation writer. No shared performance numbers are fixed. A large shop, a hot product row and a hot key range are different sources of load.

## Accepted extension E2: tea classes

The shops also sell places in tea classes. A class describes an activity; a session is one scheduled occurrence. These are additional relations, not renamed shop orders.

- Class C1 is Tea tasting. Session S501 belongs to shop 10, starts at `2026-11-04 18:00:00Z` and has capacity 1. Its named display zone is `Europe/Stockholm`. The introductory core uses only UTC instants; retain the named zone separately when local scheduling requires it.
- The capacity race starts with no bookings for S501. Mina attempts B201 and Tariq attempts B202. In the protected outcome only B201 commits, leaving remaining capacity 0. A booking is not an order and does not use order IDs 103 or 104. If both a capacity and remaining-capacity representation appear, identify the chosen schema and keep them consistent.
- Staff instructors Ada Lind (I1) and Tomas Ek (I2) cover session S502. At the start both are on duty and the rule requires at least one. This is the separate write-skew example: each can observe the other before attempting to go off duty. Customers never become instructors. State the engine, isolation and protocol before claiming an outcome.
- Room R1 can have time-interval reservations. Use half-open intervals `[start,end)` so adjacent reservations may meet at an endpoint. Choose and label a date when instantiating an overlap example. A room-overlap rule is distinct from a session-capacity rule.

Class, session, booking, instructor and room schemas are owned by their explanations; the IDs and stated business facts above remain shared. A capacity protocol may use an existing session guard row or a conditional remaining-capacity update. Locking only currently matching bookings does not establish protection for the empty case. A guard also needs a declared snapshot protocol: every capacity-changing writer uses it, and a count must include earlier admitted bookings. RL91 owns the comparison between a fresh Read Committed count after acquiring the guard, a conflicting guard update with complete retry where required, and Serializable. A lock-only guard does not refresh an already-established Repeatable Read snapshot; the protected outcome is conditional on the complete protocol, not waiting alone.

## Accepted extension E3: price history and representation

The core snapshot is unchanged. In a **later** history, P7’s catalogue price changes from 20.00 to 25.00 at `2026-10-21 09:00:00Z`. Staff record a correction on `2026-10-22 14:00:00Z`: the intended price from the earlier effective instant was 24.00. The recorded sequence and effective periods are different questions. Order 103’s agreed unit price remains 20.00 throughout; do not recompute it from the corrected catalogue.

For schema-migration examples, add `unit_price_minor` to `order_items` as the exact hundredths representation of the existing two-decimal `unit_price`: 4.50→450, 20.00→2000 and 35.00→3500. This is an explicitly single-unit, fixed-scale variant; it is not a universal representation for every currency. Do not invent an authoritative `orders.total` merely to run this migration. Writers choose and verify a compatible old/new write protocol and final equivalence check.

For pagination and window examples, additional orders 105 and 106 may share `placed_at = 2026-10-21 12:00:00Z`, belonging to Mina and Edda respectively. They are separate later illustrative rows; no lines, payments or stock effects are fixed until an article needs and declares them. They do not enter the core still-due report. Use `(placed_at, order_id)` as a total order when demonstrating ascending continuation; mutable ordering needs its own contract.

## Accepted extension E4: identities and external work

A logical purchase request carries a stable opaque request key, for example `purchase-mina-103`, and a fingerprint of its meaningful payload. A retry of that purchase reuses the key. Reuse with a different payload is a conflict. Store the key and purchase outcome atomically under the actual chosen protocol. A request key is distinct from a transaction ID, order ID, payment ID and outbox event ID.

An outbox event may be called `order-103-created`. This is an illustrative event identity, not proof that a message was delivered or a provider acted. A payment provider’s effect ID, consumer deduplication record and worker fencing token belong to their respective authorities. An expired lease by itself cannot prevent an already-running worker from acting. No provider charge or email-send result is fixed by the core payments table.

An import row may carry `source_id`, `source_version` and `batch_id`; these are source-domain identities. A replay policy must distinguish repeated identical input, a conflicting duplicate and an older source version. Do not equate source versions with database commit order.

## Accepted extension E5: geography and shared quotas

Use three logical region labels: `eu-north`, `eu-west` and `us-east`. Shop 10’s home is `eu-north`; shop 20’s home is `eu-west`. These are teaching labels, not claimed cloud locations or measured network distances. Sessions can have a home region separately from the customer’s current request location. Region-owned stock is a separate accepted variant from the core single stock row; do not silently divide P7’s last mug among regions.

For a quorum model only, five voting replicas may be placed 2–2–1 across those regions, requiring three votes. One region loss leaves a possible majority; this assumes the remaining voters communicate and does not establish a product’s entire table-locality configuration. Native product placement must be inspected separately.

A promotion quota of 100 redeemed vouchers **across all regions** supplies a global invariant. State its remaining amount before each schedule. Do not portray three regional copies of the quota as three independent allowances. Localities and survival goals concern placement and availability; they do not remove global coordination for this rule.

Local process tests can demonstrate mechanisms. They are not observations of regional round-trip time, correlated power loss, independent storage failure or real geographic isolation. Writers must identify process, machine and region boundaries honestly.

## Accepted extension E6: recovery histories

Recovery drills are explicit alternative histories in disposable environments; none changes the core snapshot. Use the shared order or booking IDs to track effects, not to imply a single production incident across the collection.

**Shop restore variant:** at `2026-10-23 11:00:00Z`, an erroneous transaction changes or deletes a stated set of orders; record its exact identity in the drill. Valid order 107 commits after the mistake at `11:05:00Z`, for Edda. It contains one P3 at 4.50 and consumes one unit from whatever starting P3 stock the drill declares. Restoring to before 11:00 removes both the mistake and later order 107. Reconciliation must restore 107’s line and stock effect once, and check external effects independently. The earlier 101–103 report still excludes 107.

**Class restore variant:** session S503 has capacity 3, no bookings and remaining capacity 3 at the drill’s start. A mistake occurs at 11:00; valid booking B203 for Edda commits at 11:05, taking remaining capacity to 2. A pre-mistake restore excludes B203 and starts from remaining capacity 3. Reconciliation applies B203 and its single capacity decrement together, once. This is separate from the full S501 capacity race and S502 instructor rule.

For final reconciliation, fence the old write authority and resolve in-flight or uncertain requests before enumerating valid excluded work. Keep that history closed through identity, stock/capacity and external-effect acceptance, then transfer authority. B203 is the named later booking, not proof that enumerating it covers every request at the boundary; the native drill must account for or reject a request racing the fence.

The writer must pin base state, exact target/inclusivity, log or incremental chain, identities, fences and acceptance queries. Do not claim a recovered clock time proves a target transaction was excluded. No RPO, RTO, dataset volume, latency or native success result is fixed here.

## Accepted extension E7: specialist catalogue data

Text search may add a small, explicitly displayed product-description corpus with title and description weights. Fix expected matches for each query and configuration inside that article; no unstated document corpus is shared. Full-text ranks are algorithm scores, not observed customer satisfaction.

Vector search may add labelled low-dimensional **toy** product vectors for geometry. They are not model-generated embeddings or evidence of semantic quality. A real retrieval experiment records model/version, dimensions, distance, corpus, eligible filtered set, exact baseline, relevance judgements and measured approximate recall separately.

JSON examples may add optional product attributes such as material or brewing temperature. These do not replace products’ identities, prices or stock. Spatial examples may add collection points for shops; coordinate system, units and points must be declared with the native experiment. No geographic distance is inferred from the region labels.

## Continuity rules for all writers

Use the clean core for introductory arithmetic. Mark an extension or alternative history before its first new fact; never combine independent race, tie, history and recovery variants as though they were one observed execution. Prefer existing names and IDs when their roles fit. Introduce only the rows an explanation needs, and record a further shared extension with the coordinator before relying on it elsewhere. Explain a conceptual schedule as a schedule; reserve “observed” and timing claims for recorded native runs.
