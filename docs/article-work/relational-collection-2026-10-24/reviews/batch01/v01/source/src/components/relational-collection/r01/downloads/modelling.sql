-- Relations, keys and normalisation — PostgreSQL 18 worksheet.
-- Run with: psql -X -v ON_ERROR_STOP=1 -f modelling.sql
-- All tables are temporary. The final ROLLBACK discards this experiment.
-- Use a disposable session: BEGIN is intended to start a new transaction.
BEGIN;

CREATE TEMP TABLE r01_customers (
  customer_id integer PRIMARY KEY,
  name text NOT NULL
);
CREATE TEMP TABLE r01_products (
  product_id text PRIMARY KEY,
  name text NOT NULL,
  price numeric(8,2) NOT NULL
);
CREATE TEMP TABLE r01_orders (
  order_id integer PRIMARY KEY,
  customer_id integer NOT NULL REFERENCES r01_customers,
  placed_at timestamptz NOT NULL,
  status text NOT NULL
);
CREATE TEMP TABLE r01_items (
  order_id integer REFERENCES r01_orders,
  line_no integer,
  product_id text NOT NULL REFERENCES r01_products,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric(8,2) NOT NULL,
  PRIMARY KEY (order_id, line_no)
);

INSERT INTO r01_customers VALUES
  (1, 'Mina Shah'), (2, 'Tariq Aziz'), (3, 'Edda Berg');
INSERT INTO r01_products VALUES
  ('P3', 'Green tea, 50 g', 4.50),
  ('P7', 'Blue mug', 20.00), ('P9', 'Teapot', 35.00);
INSERT INTO r01_orders VALUES
  (101, 1, '2026-10-12 09:30:00Z', 'paid'),
  (102, 2, '2026-10-14 16:05:00Z', 'paid'),
  (103, 1, '2026-10-20 10:15:00Z', 'pending');
INSERT INTO r01_items VALUES
  (101, 1, 'P3', 1, 4.50), (101, 2, 'P9', 1, 35.00),
  (102, 1, 'P7', 2, 20.00),
  (103, 1, 'P7', 1, 20.00), (103, 2, 'P3', 2, 4.50);

-- Independent flat fixture, so the reconstruction check is not the same join twice.
CREATE TEMP TABLE r01_sales_sheet (
  order_id integer NOT NULL,
  line_no integer NOT NULL,
  customer_id integer NOT NULL,
  name text NOT NULL,
  product_id text NOT NULL,
  quantity integer NOT NULL,
  unit_price numeric(8,2) NOT NULL,
  PRIMARY KEY (order_id, line_no)
);
INSERT INTO r01_sales_sheet VALUES
  (101, 1, 1, 'Mina Shah', 'P3', 1, 4.50),
  (101, 2, 1, 'Mina Shah', 'P9', 1, 35.00),
  (102, 1, 2, 'Tariq Aziz', 'P7', 2, 20.00),
  (103, 1, 1, 'Mina Shah', 'P7', 1, 20.00),
  (103, 2, 1, 'Mina Shah', 'P3', 2, 4.50);

-- Reconstruct the sheet from the retained references: five rows, no difference.
CREATE TEMP VIEW r01_reconstructed AS
  SELECT i.order_id, i.line_no, c.customer_id, c.name,
         i.product_id, i.quantity, i.unit_price
  FROM r01_items i
  JOIN r01_orders o ON o.order_id = i.order_id
  JOIN r01_customers c ON c.customer_id = o.customer_id;
SELECT * FROM r01_reconstructed ORDER BY order_id, line_no;
DO $$ BEGIN
  IF (SELECT count(*) FROM r01_reconstructed) <> 5 THEN
    RAISE EXCEPTION 'Expected five reconstructed lines';
  END IF;
  IF EXISTS (
    (SELECT * FROM r01_sales_sheet EXCEPT ALL SELECT * FROM r01_reconstructed)
    UNION ALL
    (SELECT * FROM r01_reconstructed EXCEPT ALL SELECT * FROM r01_sales_sheet)
  ) THEN RAISE EXCEPTION 'Reconstruction changed the sheet'; END IF;
END $$;

-- Four edit locations for Mina, but only one authoritative customer row.
SELECT count(*) AS copied_name_locations
FROM r01_sales_sheet WHERE customer_id = 1; -- 4
SAVEPOINT before_bad_copy;
-- A deliberately inconsistent illustrative value, not a new shared shop fact.
UPDATE r01_sales_sheet SET name = 'a changed name'
WHERE order_id = 103 AND line_no = 1;
SELECT count(DISTINCT name) AS conflicting_current_names
FROM r01_sales_sheet WHERE customer_id = 1; -- 2
DO $$ BEGIN
  IF (SELECT count(DISTINCT name) FROM r01_sales_sheet WHERE customer_id = 1) <> 2
    THEN RAISE EXCEPTION 'Expected the copied names to disagree'; END IF;
END $$;
ROLLBACK TO SAVEPOINT before_bad_copy;

-- Edda exists as a customer without an invented order line.
SELECT
  (SELECT count(*) FROM r01_sales_sheet WHERE customer_id = 3) AS sheet_rows,
  (SELECT count(*) FROM r01_customers WHERE customer_id = 3) AS customer_rows;
-- 0, 1

-- A hypothetical deletion from the flat design loses Tariq's only record.
SAVEPOINT before_removal;
DELETE FROM r01_sales_sheet WHERE order_id = 102;
SELECT
  (SELECT count(*) FROM r01_sales_sheet WHERE customer_id = 2) AS sheet_rows,
  (SELECT count(*) FROM r01_customers WHERE customer_id = 2) AS customer_rows;
-- 0, 1
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM r01_sales_sheet WHERE customer_id = 2)
    OR NOT EXISTS (SELECT 1 FROM r01_customers WHERE customer_id = 2)
    THEN RAISE EXCEPTION 'Unexpected deletion-anomaly result'; END IF;
END $$;
ROLLBACK TO SAVEPOINT before_removal;

-- Counterexample: two generated IDs do not prevent one business line appearing twice.
CREATE TEMP TABLE r01_surrogate_only (
  line_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id integer NOT NULL REFERENCES r01_orders,
  line_no integer NOT NULL
);
INSERT INTO r01_surrogate_only (order_id, line_no) VALUES (103, 1), (103, 1);
SELECT count(*) AS copies_of_one_line FROM r01_surrogate_only
WHERE order_id = 103 AND line_no = 1; -- 2

-- Keep the surrogate and enforce the independent business identity as well.
CREATE TEMP TABLE r01_surrogate_and_business_key (
  line_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id integer NOT NULL REFERENCES r01_orders,
  line_no integer NOT NULL,
  UNIQUE (order_id, line_no)
);
INSERT INTO r01_surrogate_and_business_key (order_id, line_no) VALUES (103, 1);
DO $$ BEGIN
  BEGIN
    INSERT INTO r01_surrogate_and_business_key (order_id, line_no) VALUES (103, 1);
    RAISE EXCEPTION 'The duplicate line was wrongly accepted';
  EXCEPTION WHEN unique_violation THEN
    RAISE NOTICE 'Expected: UNIQUE (order_id, line_no) refused the duplicate';
  END;
END $$;
SELECT count(*) AS copies_of_one_line FROM r01_surrogate_and_business_key
WHERE order_id = 103 AND line_no = 1; -- 1

-- Enter the accepted later-price history in this disposable experiment only.
UPDATE r01_products SET price = 25.00 WHERE product_id = 'P7';
SELECT p.price AS catalogue_now, i.unit_price AS agreed_then
FROM r01_items i JOIN r01_products p USING (product_id)
WHERE i.order_id = 103 AND i.line_no = 1; -- 25.00, 20.00
SELECT sum(quantity * unit_price) AS order_total
FROM r01_items WHERE order_id = 103; -- 29.00
DO $$ BEGIN
  IF (SELECT count(*) FROM r01_surrogate_only) <> 2
    OR (SELECT count(*) FROM r01_surrogate_and_business_key) <> 1
    OR (SELECT sum(quantity * unit_price) FROM r01_items WHERE order_id = 103) <> 29.00
    THEN RAISE EXCEPTION 'Identity or price acceptance check failed'; END IF;
END $$;
ROLLBACK;
