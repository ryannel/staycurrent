-- Run only in an explicitly owned disposable schema. No stock reconstruction.
CREATE TABLE customers (customer_id integer PRIMARY KEY, name text NOT NULL);
CREATE TABLE products (product_id text PRIMARY KEY, name text NOT NULL,
 price numeric(8,2) NOT NULL CHECK(price>=0), stock integer NOT NULL CHECK(stock>=0));
CREATE TABLE orders (order_id integer PRIMARY KEY, customer_id integer NOT NULL REFERENCES customers,
 placed_at timestamptz NOT NULL, status text NOT NULL CHECK(status IN ('pending','paid','cancelled')));
CREATE TABLE order_items (order_id integer REFERENCES orders, line_no integer,
 product_id text NOT NULL REFERENCES products, quantity integer NOT NULL CHECK(quantity>0),
 unit_price numeric(8,2) NOT NULL, PRIMARY KEY(order_id,line_no));
CREATE TABLE payments (payment_id integer PRIMARY KEY, order_id integer NOT NULL REFERENCES orders,
 amount numeric(8,2) NOT NULL CHECK(amount>0), method text NOT NULL);
INSERT INTO customers VALUES (1,'Mina Shah'),(2,'Tariq Aziz'),(3,'Edda Berg');
INSERT INTO products VALUES ('P3','Green tea, 50 g',4.50,10),('P7','Blue mug',20,0),('P9','Teapot',35,4);
INSERT INTO orders VALUES (101,1,'2026-10-12 09:30+00','paid'),(102,2,'2026-10-14 16:05+00','paid'),(103,1,'2026-10-20 10:15+00','pending');
INSERT INTO order_items VALUES (101,1,'P3',1,4.5),(101,2,'P9',1,35),(102,1,'P7',2,20),(103,1,'P7',1,20),(103,2,'P3',2,4.5);
INSERT INTO payments VALUES (501,101,30,'card'),(502,101,9.5,'gift card'),(503,102,40,'card');
INSERT INTO customers SELECT id,'Generated customer '||id FROM generate_series(1001,2000) AS g(id);
-- n = 0..119999. Seed is an arithmetic offset, not a random-number seed.
WITH generated AS (
 SELECT n, (n*37+20261025)%365 AS day_no,
        (n*53+20261025)%100 AS status_no
 FROM generate_series(0,119999) AS g(n)
)
INSERT INTO orders
SELECT 100001+n,
 CASE WHEN n%10<7 THEN 1001 ELSE 1002+(n*17+20261025)%999 END,
 timestamptz '2026-01-01 12:00+00'+day_no*interval '1 day',
 CASE WHEN (day_no>=273 AND day_no<304 AND status_no<90)
        OR ((day_no<273 OR day_no>=304) AND status_no<10)
      THEN 'paid' ELSE 'pending' END
FROM generated;
INSERT INTO order_items
SELECT 100001+n,l.line_no,l.product_id,1,l.price
FROM generate_series(0,119999) AS g(n)
CROSS JOIN (VALUES (1,'P3',4.50::numeric),(2,'P7',20.00),(3,'P9',35.00)) AS l(line_no,product_id,price);
ANALYZE customers;
ANALYZE orders;
ANALYZE order_items;
