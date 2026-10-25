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

- Tenant integrity: tenant10 has the starting shop rows; tenant20 has a distinct customer4, Rowan Vale. In this variant customers keep globally unique customer_id, and orders also carry tenant_id. A proposed order with tenant_id10 and customer_id4 exposes a mismatched tenant/customer association; the composite reference must preserve both.
- Room reservations: tea-tasting room R1 has reservation7001 on 2 November2026 from10:00 to11:00UTC. Attempted reservation7002 from10:30 to11:30 overlaps; reservation7003 from11:00 to12:00 is adjacent. All intervals are half-open [start,end). This is a resource non-overlap scenario, not an enrollment/capacity model.
- Payment limit: from order103's starting state (line value29.00, no payments), suppose the shop prohibits total recorded payments exceeding the line value. Two proposed20.00 payments after separate reads can jointly exceed that rule. These are attempted scenario operations, not new committed starting rows. The constraints article exposes the unsafe aggregate check; transaction protocols have their own owner.

## Modelling scenarios

These illustrations start independently from the shared rows unless stated otherwise. An additional order-103 line 3 for P7 distinguishes line identity from product identity. Customer 1's current name can be corrected from Mina Shah to Mina Patel. A later P7 catalogue price is 22.00; its agreed order-103 unit price remains 20.00, preserving the order total29.00 rather than repricing it to31.00.

For higher-form examples the offers are (S1,P7,North), (S1,P3,South), (S2,P7,South); (S1,P7,South) is absent. P7 has independent tags gift/ceramic and suppliers S1/S2. A subtype example gives P3 origin Japan and P7 capacity300ml. A category hierarchy has Teaware→Mugs→Blue mugs; a multiple-parent alternative also places Mugs under Gifts.
