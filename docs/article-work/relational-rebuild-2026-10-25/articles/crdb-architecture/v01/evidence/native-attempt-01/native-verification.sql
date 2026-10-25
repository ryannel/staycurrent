-- Run only after the coordinator verifies the unique owned database and cluster.
-- The coordinator prepends identity guards and uses an explicit in-container target.
SET application_name = 'staycurrent_crdb_architecture_20261025';
SET statement_timeout = '30s';
SELECT version(), current_database(), crdb_internal.cluster_id(), crdb_internal.node_id();
CREATE TABLE customers (customer_id integer PRIMARY KEY, name text NOT NULL);
CREATE TABLE products (product_id text PRIMARY KEY, name text NOT NULL,
 price numeric(8,2) NOT NULL CHECK (price >= 0), stock integer NOT NULL CHECK (stock >= 0));
CREATE TABLE orders (order_id integer PRIMARY KEY,
 customer_id integer NOT NULL REFERENCES customers, placed_at timestamptz NOT NULL,
 status text NOT NULL CHECK (status IN ('pending','paid','cancelled')));
CREATE TABLE order_items (order_id integer REFERENCES orders, line_no integer,
 product_id text NOT NULL REFERENCES products, quantity integer NOT NULL CHECK (quantity > 0),
 unit_price numeric(8,2) NOT NULL, PRIMARY KEY (order_id,line_no));
CREATE TABLE payments (payment_id integer PRIMARY KEY, order_id integer NOT NULL REFERENCES orders,
 amount numeric(8,2) NOT NULL CHECK (amount > 0), method text NOT NULL);
INSERT INTO customers VALUES (1,'Mina Shah'),(2,'Tariq Aziz'),(3,'Edda Berg');
INSERT INTO products VALUES ('P3','Green tea, 50 g',4.50,10),('P7','Blue mug',20.00,0),('P9','Teapot',35.00,4);
INSERT INTO orders VALUES (101,1,'2026-10-12 09:30:00+00','paid'),
 (102,2,'2026-10-14 16:05:00+00','paid'),(103,1,'2026-10-20 10:15:00+00','pending');
INSERT INTO order_items VALUES (101,1,'P3',1,4.50),(101,2,'P9',1,35.00),
 (102,1,'P7',2,20.00),(103,1,'P7',1,20.00),(103,2,'P3',2,4.50);
INSERT INTO payments VALUES (501,101,30.00,'card'),(502,101,9.50,'gift card'),(503,102,40.00,'card');
CREATE INDEX orders_customer ON orders (customer_id);
SHOW CREATE TABLE products;
SHOW INDEX FROM orders;
SELECT price FROM products WHERE product_id = 'P7';
SELECT order_id, status FROM orders WHERE customer_id = 1 ORDER BY order_id;
SHOW RANGES FROM TABLE products WITH DETAILS;
-- Deliberate boundary for observation; not an automatic/load-based split.
ALTER TABLE products SPLIT AT VALUES ('P7');
SELECT start_key, end_key, range_id, lease_holder, replicas, voting_replicas, non_voting_replicas
 FROM [SHOW RANGES FROM TABLE products WITH DETAILS] ORDER BY start_key;
BEGIN;
UPDATE products SET price = 22.00 WHERE product_id = 'P7';
COMMIT;
SELECT product_id, price, stock FROM products ORDER BY product_id;
SELECT sum(quantity * unit_price) AS order_103_line_value FROM order_items WHERE order_id = 103;
SELECT status FROM orders WHERE order_id = 103;
SELECT count(*) AS order_103_payments FROM payments WHERE order_id = 103;
