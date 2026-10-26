-- ROOT EXECUTION ONLY. Run only after verifying the isolated fixture identity.
-- Replace __OWNED_DATABASE__ and __NORTH__/__WEST__/__EAST__ with exact owned values.
-- The coordinator creates the fresh database, sets primary North and adds West/East.
-- Do not use a default database or an existing table; CREATE intentionally fails on reuse.
SET database = '__OWNED_DATABASE__';
SET application_name = 'staycurrent-crdb-locality-verifier';
SET statement_timeout = '45s';
SELECT version(), current_database(), gateway_region();
SHOW REGIONS FROM DATABASE __OWNED_DATABASE__;
SHOW CREATE DATABASE __OWNED_DATABASE__;
CREATE TABLE customers (customer_id INT PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE products (product_id TEXT PRIMARY KEY, name TEXT NOT NULL,
  price DECIMAL(8,2) NOT NULL CHECK(price >= 0), stock INT NOT NULL CHECK(stock >= 0))
  LOCALITY REGIONAL BY TABLE IN "__WEST__";
CREATE TABLE orders (order_id INT PRIMARY KEY,
  customer_id INT NOT NULL REFERENCES customers(customer_id),
  placed_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('pending','paid','cancelled')))
  LOCALITY REGIONAL BY ROW;
CREATE TABLE order_items (order_id INT REFERENCES orders(order_id), line_no INT,
  product_id TEXT NOT NULL REFERENCES products(product_id),
  quantity INT NOT NULL CHECK(quantity > 0), unit_price DECIMAL(8,2) NOT NULL,
  PRIMARY KEY(order_id,line_no)) LOCALITY REGIONAL BY ROW;
CREATE TABLE payments (payment_id INT PRIMARY KEY, order_id INT NOT NULL REFERENCES orders(order_id),
  amount DECIMAL(8,2) NOT NULL CHECK(amount > 0), method TEXT NOT NULL);
CREATE TABLE order_statuses(status TEXT PRIMARY KEY) LOCALITY GLOBAL;
CREATE INDEX orders_history ON orders(customer_id, placed_at DESC, order_id DESC) STORING(status);
INSERT INTO customers VALUES (1,'Mina Shah'),(2,'Tariq Aziz'),(3,'Edda Berg');
INSERT INTO products VALUES ('P3','Green tea, 50 g',4.50,10),('P7','Blue mug',20.00,0),('P9','Teapot',35.00,4);
INSERT INTO orders(order_id,customer_id,placed_at,status,crdb_region) VALUES
 (101,1,'2026-10-12 09:30+00','paid','__NORTH__'),
 (102,2,'2026-10-14 16:05+00','paid','__WEST__'),
 (103,1,'2026-10-20 10:15+00','pending','__NORTH__');
INSERT INTO order_items(order_id,line_no,product_id,quantity,unit_price,crdb_region) VALUES
 (101,1,'P3',1,4.50,'__NORTH__'),(101,2,'P9',1,35.00,'__NORTH__'),
 (102,1,'P7',2,20.00,'__WEST__'),(103,1,'P7',1,20.00,'__NORTH__'),(103,2,'P3',2,4.50,'__NORTH__');
INSERT INTO payments VALUES (501,101,30.00,'card'),(502,101,9.50,'gift card'),(503,102,40.00,'card');
INSERT INTO order_statuses VALUES ('pending'),('paid'),('cancelled');
SHOW CREATE TABLE products;
SHOW CREATE TABLE orders;
SHOW CREATE TABLE order_items;
SHOW CREATE TABLE order_statuses;
SELECT order_id,crdb_region FROM orders ORDER BY order_id;
SHOW INDEXES FROM orders;
SHOW PARTITIONS FROM TABLE orders;
SHOW REGIONS FROM CLUSTER;
-- Capture after bounded placement convergence. DETAILS/INDEXES are deliberately scoped.
SHOW RANGES FROM TABLE products WITH DETAILS;
SHOW RANGES FROM TABLE orders WITH INDEXES, DETAILS;
-- In a second phase root changes survival goal, waits for bounded convergence and repeats ranges.
-- ALTER DATABASE __OWNED_DATABASE__ SURVIVE REGION FAILURE;
