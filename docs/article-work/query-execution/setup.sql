-- PostgreSQL 18. Run once in a new empty practice database.
-- Keep the same query-editor connection for the article's later statements.
-- This is an isolated generated shop, not an extension of the receipt dataset.
CREATE TABLE orders (
  order_id integer PRIMARY KEY,
  customer_id integer NOT NULL,
  sales_region text NOT NULL
);
CREATE TABLE order_lines (
  order_id integer NOT NULL REFERENCES orders,
  line_no integer NOT NULL,
  product_id integer NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  PRIMARY KEY (order_id, line_no)
);
INSERT INTO orders (order_id, customer_id, sales_region)
SELECT n, (n - 1) % 1000 + 1,
       CASE WHEN (n - 1) % 1000 + 1 <= 100 THEN 'north' ELSE 'south' END
FROM generate_series(1, 10000) AS g(n);
INSERT INTO order_lines (order_id, line_no, product_id, quantity)
SELECT n, line, line, line
FROM generate_series(1, 10000) AS g(n)
CROSS JOIN generate_series(1, 3) AS l(line)
ORDER BY n, line;
CREATE INDEX orders_customer ON orders (customer_id);
ANALYZE orders;
ANALYZE order_lines;
