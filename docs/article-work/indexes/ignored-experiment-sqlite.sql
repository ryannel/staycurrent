CREATE TABLE orders(order_id INTEGER PRIMARY KEY, customer_id INT NOT NULL, placed_at TEXT NOT NULL, status TEXT NOT NULL, total REAL, email TEXT NOT NULL, ref TEXT NOT NULL, shipped_at TEXT);
WITH RECURSIVE n(i) AS (SELECT 1 UNION ALL SELECT i+1 FROM n WHERE i<60000)
INSERT INTO orders SELECT i, 1+i%1000, datetime('2026-01-01', '+'||i||' minutes'), CASE WHEN (i/1000)%5=0 THEN 'pending' ELSE 'paid' END, (1000+i%9000)/100.0, 'User'||(1+i%1000)||'@Example.com', ''||(1+i%1000), CASE WHEN i%3=0 THEN NULL ELSE datetime('2026-01-01','+'||i||' minutes') END FROM n;
CREATE INDEX o_cust ON orders(customer_id);
CREATE INDEX o_email ON orders(email);
CREATE INDEX o_ref ON orders(ref);
CREATE INDEX o_status ON orders(status);
CREATE INDEX o_total ON orders(total);
CREATE INDEX o_shipped ON orders(shipped_at);
ANALYZE;
.print == baseline
EXPLAIN QUERY PLAN SELECT order_id FROM orders WHERE customer_id=42;
.print == function on column
EXPLAIN QUERY PLAN SELECT order_id FROM orders WHERE lower(email)='user42@example.com';
CREATE INDEX o_lower ON orders(lower(email));
EXPLAIN QUERY PLAN SELECT order_id FROM orders WHERE lower(email)='user42@example.com';
.print == LIKE default
EXPLAIN QUERY PLAN SELECT order_id FROM orders WHERE email LIKE 'User42@%';
EXPLAIN QUERY PLAN SELECT order_id FROM orders WHERE email GLOB 'User42@*';
.print == type: text col vs number
EXPLAIN QUERY PLAN SELECT order_id FROM orders WHERE ref = 42;
SELECT count(*) FROM orders WHERE ref=42;
EXPLAIN QUERY PLAN SELECT order_id FROM orders WHERE customer_id = '42';
.print == OR
EXPLAIN QUERY PLAN SELECT order_id FROM orders WHERE customer_id=42 OR order_id=7;
EXPLAIN QUERY PLAN SELECT order_id FROM orders WHERE customer_id=42 OR total=10.5;
EXPLAIN QUERY PLAN SELECT order_id FROM orders WHERE customer_id=42 OR placed_at > '2026-02-01';
.print == AND two indexes
EXPLAIN QUERY PLAN SELECT order_id FROM orders WHERE customer_id=42 AND total BETWEEN 10 AND 20;
.print == INDEXED BY / NOT INDEXED
EXPLAIN QUERY PLAN SELECT order_id FROM orders INDEXED BY o_status WHERE status='paid';
EXPLAIN QUERY PLAN SELECT order_id FROM orders NOT INDEXED WHERE customer_id=42;
EXPLAIN QUERY PLAN SELECT order_id FROM orders WHERE status='paid';
.print == order
EXPLAIN QUERY PLAN SELECT order_id FROM orders ORDER BY shipped_at DESC LIMIT 10;
EXPLAIN QUERY PLAN SELECT order_id FROM orders ORDER BY shipped_at DESC NULLS LAST LIMIT 10;
EXPLAIN QUERY PLAN SELECT order_id FROM orders ORDER BY email LIMIT 10;
EXPLAIN QUERY PLAN SELECT order_id FROM orders ORDER BY email COLLATE NOCASE LIMIT 10;
.print == leading col
CREATE INDEX o_cs ON orders(customer_id, placed_at);
EXPLAIN QUERY PLAN SELECT order_id FROM orders WHERE placed_at > '2026-02-01' AND placed_at < '2026-02-01 00:30';
.print == invisible?
PRAGMA compile_options;
