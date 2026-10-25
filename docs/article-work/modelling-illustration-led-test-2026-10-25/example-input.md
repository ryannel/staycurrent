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

