# Relational collection · running example

Written on 20 October 2026, following [staycurrent-continuity](../../.claude/skills/staycurrent-continuity/SKILL.md). The tree is [relational-2026-10-19.yaml](relational-2026-10-19.yaml).

Sources: the trial introduction (`src/articles/relational-trial/a00.astro`, rows in `src/components/relational-trial/a00/model.mjs`) and the trial transactions article (`src/articles/relational-trial/a03.astro`, rows in `src/components/relational-trial/a03/model.mjs`). Both pages were checked against PostgreSQL 18.6 by their `verify.mjs` scripts. The published collection uses a different example, the workshop service (see [Where existing articles disagree](#where-existing-articles-disagree)). This record follows the trial pages, because they are the newest plans and the drafts are being rewritten towards them.

Figures take their rows from here. Where several articles' figures share rows, keep them in one module that each article's model file imports. An article that needs something new proposes an extension below and keeps to it.

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

### The race for the last mug

Mina (order 103) and Tariq (order 104) both try to buy the last blue mug, P7, while its stock is 1. The read-then-write version sells it twice; a conditional update (`stock = stock - 1 WHERE product_id = 'P7' AND stock >= 1`) or Repeatable Read lets only order 103 keep it. Order 104 is Tariq's, is never committed in the protected versions, and holds only the mug.

## Extension: class bookings (transactions, a03)

The shop also runs classes. a03 needs rules of three shapes (one row's value, a unique fact, and a count across rows), and the shop's stock gives only the first. The classes add the other two while keeping the shop's customers.

| Class part | Stands for in the shop |
| --- | --- |
| `classes.remaining` | A product's `stock` |
| A row in `reservations` | An order line that takes stock |
| `request_id` (R7, R8 …) | The order's identifier, used to resolve a lost reply |
| `instructors` | No shop equivalent: the rule that counts rows |

### People

| Person | Role |
| --- | --- |
| Mina Shah, Tariq Aziz, Edda Berg | The shop's customers 1, 2 and 3, booking places |
| Lena | Instructor for class 21 |
| Ravi | Instructor for class 21 |

Instructors are never customers. Mina and Tariq are not instructors.

### Tables, keys and starting rows

```sql
classes      (class_id integer PRIMARY KEY, title text NOT NULL,
              capacity integer NOT NULL CHECK (capacity >= 0),
              remaining integer NOT NULL CHECK (remaining BETWEEN 0 AND capacity))
reservations (request_id text PRIMARY KEY,
              class_id integer NOT NULL REFERENCES classes,
              owner_id integer NOT NULL REFERENCES customers,
              UNIQUE (class_id, owner_id))
instructors  (class_id integer NOT NULL REFERENCES classes,
              person text NOT NULL, available boolean NOT NULL,
              PRIMARY KEY (class_id, person))
```

| class_id | title | capacity | remaining |
| --- | --- | --- | --- |
| 21 | Tea tasting | 1 | 1 |
| 22 | Mug painting | 3 | 2 |

Reservations: R7, class 22, owner 2 (Tariq). Instructors: (21, Lena, true), (21, Ravi, true).

The rules: for each class, `remaining` plus its reservations equals `capacity`; a customer books a class at most once; class 21 keeps at least one available instructor.

### Request identifiers in a03

| Request | Owner | Used for |
| --- | --- | --- |
| R7 | Tariq | His existing booking in class 22 |
| R8 | Mina | Her booking of class 21's last place; moved between classes in Figure 5 |
| R9 | Tariq | His competing request for class 21's last place |
| R10, R11 | Mina | Her double click in class 22 (Figure 3) |
| R12 | Tariq | His second, refused booking in class 22 |
| R13 | Mina | Her booking in the `FOR UPDATE` count variation |
| R14 | Edda | Her competing booking in the same variation |

One request number means one booking everywhere. Runs that never reach the page may use R20 and above.

### Stated variations

These runs change one value of the starting rows, and the article says so where it uses them.

- `FOR UPDATE` count case: class 22's capacity is lowered to 2, so one place is left. Mina (R13) and Edda (R14) each count and book; three bookings result.
- Repeated move: class 21's capacity is 3, so a move sent twice can take two places.

### Further extensions (accepted 21 October 2026, trial 2)

- **The swap.** Mina moves R8 from class 21 to 22 while Tariq moves R7 from 22 to 21. Used for the deadlock and lock order.
- **Load clients.** Customers 101–120 race for one place in load runs. They appear only in run records and downloads, never as named people.

### Children that use the extension

a18 (locking) removes the `remaining` counter and counts reservations instead; a19 (isolation) uses the instructors rule. Both should take these tables, names and rows.

## Extensions to the core example (accepted 21 October 2026, trial 2)

- **Scaled copy for physical work.** Customers 1001–21000 and orders 1001–200000, one line each, generated by `scaledGenerator` in `src/components/relational-trial-2/a00/model.mjs`. The core rows are kept.
- **`orders.delivery_country`.** Added in stages; existing orders are backfilled with `'GB'`, on the stated assumption that the shop shipped only within the UK before. The old application's insert is order 105 for Edda, placed 2026-10-21 08:00 UTC, pending, with no lines.
- **Deletion timeline for recovery.** A clean-up script deletes paid order 101, with its lines and payments, at 10:10 on 20 October. Order 103 is placed at 10:15. A restore stops at 10:09. This timeline is canonical; a07's (09:10, order 106) disagrees.

## Where existing articles disagree

Surveyed on 20 October 2026. Nothing below was edited. Paths are under `src/`; "comp" means `components/relational-next/<id>/`.

### The published collection (`src/articles/relational/`)

Every published article uses a different example: a multi-tenant **workshop service**. Tenant `t4`, Ada is customer 42 and Ben 43, session `s7` "Repair basics" with two places remaining, booking `b17` (later b18–b20) and purchase orders `o81`–`o84` (rl76.md:15–21). Mina, Tariq, Edda, the shop and the classes do not appear, except:

- rl110.md:68 inserts `('t4',42,'Mina'), ('t5',42,'Leon')`, so Mina takes Ada's key.

Within the published collection, the workshop example also disagrees with itself:

- The capacity counter is `remaining` (rl76, rl84, rl124, rl132), `reserved` counting up in a singular `seat` table (rl90, rl91), or plain `capacity` (rl77, rl79, rl89, rl110).
- Bookings are `bookings`, `booking` (rl90, rl91) or `purchase` (rl93, rl94). rl127.md:38 has `bookings(tenant, request, amount)`.
- Order lines are `order_lines` (rl77, rl80) or `lines` (rl81, rl85).
- Customer `('t5', 42)` is "Another Ada" (rl79.md:30–40), Ben (rl81.md:20, 33, against rl77's `('t4', 43)`) and Leon (rl110.md:68).
- rl124 and rl132 drop the `_id` suffix: `orders(tenant, request, customer, amount)`.

### The draft collection (`src/articles/relational-next/`)

Four examples are in use: the shop (a00, a02, a04, a06, a07, a13–a15, a17, a20–a23, a30, a31, a35, a37–a39), a01's class bookings (a01, a09, a11, a12), the transactions line's places and staff (a03, a18, a19), and an inventory reservation service (a08, a32, a34). a10 uses rooms; a05, a16, a24–a26, a28, a29 and a36 use synthetic data or none.

**Instructor and people names**

- a19.astro:82 makes Mina and Tariq the two instructors ("Mina and Tariq are the two instructors"), with `staff (person, available)` (a19.astro:29–31, 51). Use Lena and Ravi. Mina is also the booker there (a19.astro:57).
- a03.astro:73 (draft) does the same: "suppose Mina and Tariq are the class’s two instructors".
- a00.astro:67 (draft) races Mina against **Arun**, not Tariq, and Arun is customer 2 (comp/queries.mjs:45, comp/models.mjs:6). Edda is absent and surnames are dropped.
- a21 makes customer 1 "Jo" and Mina customer 2 (comp/models.mjs:6, 11).
- a14 has two Minas (customers 1 and 3), Edda as customer 4 and a new customer Sol (5) (comp/models.mjs:1; a14.astro:50–53), and makes Mina Tariq's manager in an employee self-join (a14.astro:78–80).
- a01 renames Mina "Mina Patel" (a01.astro:25), customer C7 with member code M007, and adds Jon Reed as C8 (comp/fixture.sql:3–4).

**Shop tables, keys and rows**

- a00 (draft): products `'MUG'`/`'TEA'` with column `available`, no name, price or teapot (comp/queries.mjs:28–30, 46); `order_items` keyed by `(order_id, product_id)` with `unit_price_gbp` and no `line_no` (queries.mjs:38–43); tea costs 8; order 101 is the mug and two teas for £36 (a00.astro:54); 102 is Arun's draft order with no lines (a00.astro:55); status `'pending_payment'`; no payments.
- a02, a13, a15: `order_lines (order_id, line_no, amount)` instead of `order_items` (a02 comp/queries.mjs:15); payments 200–204 (queries.mjs:38); statuses `'open'`/`'cancelled'`; orders 100–107 with 103 as Tariq's (a02.astro:100–105). a13 adds a fee and the label `'Edda_100%'` (comp/queries.mjs:10–15).
- a14: 103 is Tariq's December 2025 order for 90; payments 201–205.
- a17: `stock (tenant_id, sku, available)` with P7 = 5, P8 = 2 and a second tenant's P7 = 9; tables `change_orders`, `change_lines`, `receipts` (comp/queries.mjs:9–44; a17.astro:36–38).
- a21: Mina's 103 has three items and four parcels; SKUs `SKU-1..3` (a21.astro:18–23, 86, 126).
- a25 and a26 use `order_lines` (a25.astro:75; a26.astro:90).
- Tenancy appears without a record entry and with different numbers: tenant 7 (a04 comp/scenes.mjs:5; a21; a38.astro:157), tenant 7 with customer 42 (a22 comp/rehearse.mjs:35–39), tenant 42 (a25.astro:34).
- Order rows: a31 has 101 and 102 pending with totals 20 and 30, and 103 pending at 40 (a31.astro:60; comp/model.mjs:24–25); a37 has 101 at 2200, 102 at 1800, 103 at 500 (a37.astro:55, 138); a38 has 103 paid and test orders 104, 105, 109 (comp/model.mjs:22; a38.astro:134); a39 has 103 paid and 104 as a "later good order" (a39.astro:25, 35), where the record's 104 is Tariq's losing order; a35 moves 101 from paid to packed (comp/rehearse.mjs:53, 62); a29 numbers orders 1–3 (comp/rehearse.mjs:26); a20 inserts order 202 (comp/rehearse.mjs:30); a05 gives Mina ten orders (a05.astro:68).
- a07's model deletes order 103 (comp/models.mjs:66) while its text says paid order 101 disappeared (a07.astro:85–89). That is an internal disagreement as well as one with the record.
- a06 and a30 run the same address job differently: a06 changes 101 to "12 Birch Road" and creates order 102 during the copy, though 102 exists (comp/model.mjs:29; a06.astro:63); a30 changes 101 from "14 Mill Lane" to "22 Mill Lane" (a30.astro:71).

**Class bookings**

- a01, a09, a11, a12: tables `tenants`, `customers`, `sessions`, `bookings`, not `classes` and `reservations`; sessions S21 "Pottery" capacity 2 at €20 and S22 "Glazing" capacity 4 at €25 (a01 comp/fixture.sql:7–8); bookings B11–B13 instead of R-numbers (a01.astro:79, 126, 138); uniqueness on `(tenant_id, customer_id, session_id)`. a11 adds services and advisers A5–A7 (a11.astro:32); a12 adds addresses and rates (a12.astro:47, 82).
- a03 (draft): `places (place_id, capacity, remaining)` and `staff (name, available)`; class 22 has capacity 1 and no title; requests R1 and R2 with owners 7 and 8; no R7 (comp/setup.sql:3–19; a03.astro:142).
- a18: `resources (resource_id, capacity)` with `reservations (request_id, resource_id, owner_id)`; classes 21 and 22 both capacity 1; Mina's R1 with owner 7 and Tariq's R2 with owner 8 (a18.astro:14–18, 35–36, 85, 92; comp/model.mjs:11). Removing the counter is intended (see the extension); the table names, capacities and request numbers are not.
- a19: `places` and `staff`, R1 (comp/model.mjs:16), besides the instructor names above.

**Other domains reusing the record's words**

- a08, a32, a34 use `inventory (sku, available)` and `reservations (request_id, sku, amount)` with seven P7 mugs (a08.astro:17–20, 112; a32.astro:26–45; a34.astro:20–35). `reservations` then means something different from the class extension's table.
- a10 uses rooms in `resources` with `reservations (…, external_ref, state, starts_at, ends_at)`; room 21 collides with class 21, and `'R17'` is an external reference (a10.astro:46, 56–58).
- R-numbers stand for other things: a receipt R1 (a23.astro:77), a request R3 (a28 comp/model.mjs:7), order references `'R'||n` (a31 comp/rehearse.py:115).
- a16 uses "shop" for a store branch (`sales(shop 'North', …)`, comp/queries.mjs:1–25); a28 calls customers "accounts".
