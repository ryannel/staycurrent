-- Designing your data: PostgreSQL practice schema and sample rows.
-- Run in an empty practice database. These commands create four new tables;
-- they do not drop or replace existing tables. Run the file once per database.
-- Use a PostgreSQL query editor or SQL script mode (for example psql -f).
-- Executed with PostgreSQL 18.3 (PGlite 0.5.8), 4 October 2026.
-- One shop, all prices in EUR; illustrative text identifiers.
CREATE TABLE customers (
  customer_id text PRIMARY KEY,
  name text NOT NULL
);

CREATE TABLE products (
  product_id text PRIMARY KEY,
  name text NOT NULL,
  current_price numeric(12,2) NOT NULL
    CHECK (current_price >= 0 AND current_price <> 'NaN'::numeric),
  sku text UNIQUE
);

CREATE TABLE orders (
  order_id text PRIMARY KEY,
  customer_id text NOT NULL REFERENCES customers ON DELETE RESTRICT,
  placed_at timestamptz NOT NULL
);

CREATE TABLE order_lines (
  order_id text REFERENCES orders ON DELETE CASCADE,
  line_no integer CHECK (line_no > 0),
  product_id text NOT NULL REFERENCES products ON DELETE RESTRICT,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric(12,2) NOT NULL
    CHECK (unit_price >= 0 AND unit_price <> 'NaN'::numeric),
  PRIMARY KEY (order_id, line_no)
);

INSERT INTO customers (customer_id, name) VALUES ('C4', 'Ada');
INSERT INTO products (product_id, name, current_price, sku) VALUES
  ('P7', 'Blue mug', 20.00, 'MUG-BLUE'),
  ('P8', 'Bowl', 24.00, NULL);
INSERT INTO orders (order_id, customer_id, placed_at) VALUES
  ('O12', 'C4', '2026-10-04 09:00:00+00'),
  ('O13', 'C4', '2026-10-04 10:00:00+00');
INSERT INTO order_lines
  (order_id, line_no, product_id, quantity, unit_price)
VALUES
  ('O12', 1, 'P7', 2, 18.00),
  ('O13', 1, 'P7', 1, 20.00),
  ('O13', 2, 'P8', 1, 24.00);

-- O12 keeps its agreed EUR 18.00 unit price while P7 is now offered at EUR 20.00.
-- This query still returns a line total of EUR 36.00.
SELECT l.line_no, p.name, l.quantity,
       l.unit_price, l.quantity * l.unit_price AS line_total
FROM order_lines AS l
JOIN products AS p ON p.product_id = l.product_id
WHERE l.order_id = 'O12'
ORDER BY l.line_no;
