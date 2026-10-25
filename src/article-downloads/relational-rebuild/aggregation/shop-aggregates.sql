BEGIN;
SET LOCAL TIME ZONE 'UTC';
CREATE TEMP TABLE customers (customer_id integer PRIMARY KEY, name text NOT NULL);
CREATE TEMP TABLE orders (
  order_id integer PRIMARY KEY,
  customer_id integer NOT NULL REFERENCES customers,
  placed_at timestamptz NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'paid', 'cancelled'))
);
CREATE TEMP TABLE order_items (
  order_id integer REFERENCES orders, line_no integer,
  product_id text NOT NULL, quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric(8,2) NOT NULL, PRIMARY KEY (order_id, line_no)
);
INSERT INTO customers VALUES (1, 'Mina Shah'), (2, 'Tariq Aziz'), (3, 'Edda Berg');
INSERT INTO orders VALUES
  (101, 1, '2026-10-12 09:30+00', 'paid'),
  (102, 2, '2026-10-14 16:05+00', 'paid'),
  (103, 1, '2026-10-20 10:15+00', 'pending');
INSERT INTO order_items VALUES
  (101, 1, 'P3', 1, 4.50), (101, 2, 'P9', 1, 35.00),
  (102, 1, 'P7', 2, 20.00),
  (103, 1, 'P7', 1, 20.00), (103, 2, 'P3', 2, 4.50);
CREATE TEMP VIEW line_facts AS
SELECT i.order_id, i.line_no, i.product_id,
       i.quantity, i.unit_price,
       i.quantity * i.unit_price AS line_value,
       o.placed_at, o.status
FROM order_items AS i
JOIN orders AS o ON o.order_id = i.order_id;
-- A separate worked measurement scenario; NULL means not yet measured.
CREATE TEMP TABLE product_weights (product_id text PRIMARY KEY, package_weight_g integer);
INSERT INTO product_weights VALUES ('P3', 65), ('P7', NULL), ('P9', 820);

-- lineFacts
SELECT i.order_id, i.line_no, i.product_id,
       i.quantity, i.unit_price,
       i.quantity * i.unit_price AS line_value,
       o.placed_at, o.status
FROM order_items AS i
JOIN orders AS o ON o.order_id = i.order_id;

-- grouped
SELECT product_id, COUNT(*) AS lines,
       SUM(quantity) AS units
FROM line_facts
GROUP BY product_id
ORDER BY product_id;

-- split
SELECT product_id, status, SUM(quantity) AS units
FROM line_facts
GROUP BY product_id, status
ORDER BY product_id, status;

-- maxima
SELECT product_id, MAX(quantity) AS largest_quantity,
       MAX(order_id) AS largest_order_id
FROM line_facts
GROUP BY product_id
ORDER BY product_id;

-- where
SELECT product_id, SUM(quantity) AS units
FROM line_facts
WHERE status = 'paid'
GROUP BY product_id
ORDER BY product_id;

-- having
SELECT product_id, SUM(quantity) AS units
FROM line_facts
GROUP BY product_id
HAVING SUM(quantity) >= 3
ORDER BY product_id;

-- filter
SELECT product_id, SUM(quantity) AS all_units,
       SUM(quantity) FILTER (WHERE status = 'paid')
         AS paid_units
FROM line_facts
GROUP BY product_id
ORDER BY product_id;

-- counts
SELECT COUNT(*) AS lines,
       COUNT(quantity) AS known_quantities,
       COUNT(DISTINCT product_id) AS products,
       SUM(quantity) AS units
FROM line_facts;

-- customerCounts
SELECT c.customer_id, COUNT(*) AS joined_rows,
       COUNT(o.order_id) AS orders
FROM customers AS c
LEFT JOIN orders AS o ON o.customer_id = c.customer_id
GROUP BY c.customer_id
ORDER BY c.customer_id;

-- weights
SELECT COUNT(*) AS products,
       COUNT(package_weight_g) AS measured,
       SUM(package_weight_g) AS measured_grams,
       AVG(package_weight_g) AS mean_measured_grams
FROM product_weights;

-- scalarEmpty
SELECT COUNT(*) AS lines, SUM(quantity) AS units
FROM line_facts
WHERE status = 'cancelled';

-- groupedEmpty
SELECT product_id, SUM(quantity) AS units
FROM line_facts
WHERE status = 'cancelled'
GROUP BY product_id;

-- allNull
SELECT COUNT(package_weight_g) AS measured,
       SUM(package_weight_g) AS grams
FROM product_weights
WHERE product_id = 'P7';

-- window
SELECT order_id, line_no, product_id, quantity,
       SUM(quantity) OVER (
         PARTITION BY product_id
       ) AS product_units,
       ROUND(100.0 * quantity / SUM(quantity) OVER (
         PARTITION BY product_id
       ), 1) AS percent_of_product
FROM line_facts
ORDER BY product_id, order_id, line_no;

-- paidWindow
SELECT order_id, line_no, product_id,
       SUM(quantity) OVER (PARTITION BY product_id)
         AS paid_product_units
FROM line_facts
WHERE status = 'paid'
ORDER BY product_id, order_id, line_no;

-- summaryWindow
WITH product_totals AS (
  SELECT product_id, SUM(quantity) AS units
  FROM line_facts
  GROUP BY product_id
)
SELECT product_id, units, SUM(units) OVER () AS all_units
FROM product_totals
ORDER BY product_id;

-- ranking
WITH product_totals AS (
  SELECT product_id, SUM(quantity) AS units
  FROM line_facts
  GROUP BY product_id
)
SELECT product_id, units,
       ROW_NUMBER() OVER (
         ORDER BY units DESC, product_id
       ) AS position,
       RANK() OVER (ORDER BY units DESC) AS place,
       DENSE_RANK() OVER (ORDER BY units DESC) AS score_place
FROM product_totals
ORDER BY units DESC, product_id;

-- tiedBroken
WITH product_totals AS (
  SELECT product_id, SUM(quantity) AS units
  FROM line_facts GROUP BY product_id
)
SELECT product_id, RANK() OVER (
  ORDER BY units DESC, product_id
) AS place
FROM product_totals
ORDER BY units DESC, product_id;

-- defaultFrame
SELECT order_id, line_no, line_value,
       SUM(line_value) OVER (
         ORDER BY placed_at
       ) AS cumulative_value
FROM line_facts
ORDER BY placed_at, order_id, line_no;

-- rowsFrame
SELECT order_id, line_no, line_value,
       SUM(line_value) OVER (
         ORDER BY placed_at, order_id, line_no
         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS cumulative_value
FROM line_facts
ORDER BY placed_at, order_id, line_no;

-- wholeFrame
SELECT order_id, line_no,
       SUM(line_value) OVER (
         ORDER BY placed_at, order_id, line_no
         ROWS BETWEEN UNBOUNDED PRECEDING
                  AND UNBOUNDED FOLLOWING
       ) AS total_value
FROM line_facts
ORDER BY placed_at, order_id, line_no;

-- boundedFrames
SELECT order_id, line_no,
       SUM(line_value) OVER (
         ORDER BY placed_at, order_id, line_no
         ROWS BETWEEN 1 PRECEDING AND CURRENT ROW
       ) AS two_lines,
       SUM(line_value) OVER (
         ORDER BY placed_at
         GROUPS BETWEEN 1 PRECEDING AND CURRENT ROW
       ) AS two_peer_groups,
       SUM(line_value) OVER (
         ORDER BY placed_at
         RANGE BETWEEN INTERVAL '3 days' PRECEDING
                   AND CURRENT ROW
       ) AS three_day_range
FROM line_facts
ORDER BY placed_at, order_id, line_no;

-- lastValue
SELECT order_id, line_no,
       LAST_VALUE(line_value) OVER (
         ORDER BY placed_at, order_id, line_no
       ) AS default_last,
       LAST_VALUE(line_value) OVER (
         ORDER BY placed_at, order_id, line_no
         ROWS BETWEEN UNBOUNDED PRECEDING
                  AND UNBOUNDED FOLLOWING
       ) AS partition_last
FROM line_facts
ORDER BY placed_at, order_id, line_no;

-- lag
SELECT customer_id, order_id, placed_at,
       LAG(placed_at) OVER (
         PARTITION BY customer_id
         ORDER BY placed_at, order_id
       ) AS previous_order_at
FROM orders
ORDER BY customer_id, placed_at, order_id;

-- lagFrame
SELECT order_id,
       LAG(order_id) OVER (
         PARTITION BY customer_id ORDER BY placed_at, order_id
         ROWS BETWEEN CURRENT ROW AND CURRENT ROW
       ) AS previous_order
FROM orders
ORDER BY customer_id, placed_at, order_id;

-- lagNull
SELECT n, value, LAG(value, 1, -1) OVER (ORDER BY n) AS previous
FROM (VALUES (1, NULL::integer), (2, 8)) AS sample(n, value)
ORDER BY n;

-- topRows
WITH product_totals AS (
  SELECT product_id, SUM(quantity) AS units
  FROM line_facts
  GROUP BY product_id
), ranked AS (
  SELECT product_id, units,
         ROW_NUMBER() OVER (
           ORDER BY units DESC, product_id
         ) AS position,
         RANK() OVER (ORDER BY units DESC) AS place,
         DENSE_RANK() OVER (ORDER BY units DESC) AS score_place
  FROM product_totals
)
SELECT product_id, units
FROM ranked
WHERE position <= 2
ORDER BY units DESC, product_id;

-- weightedMean
SELECT AVG(unit_price) AS mean_line_price,
       SUM(quantity * unit_price) / SUM(quantity)
         AS mean_unit_price
FROM line_facts;

-- division
SELECT 1 / 3 AS integer_share, 100.0 * 1 / 3 AS percentage;

ROLLBACK;
