-- Catalogue import B17: PostgreSQL 18; checked in PGlite 0.5.8 / PostgreSQL 18.3 WASM.
-- Run only in a fresh disposable database. Creates writes_example and refuses to reuse it.
-- Literal source input, one designated importer; no client/server file transfer or concurrency test.
-- Source and decisions are fixed after receipt/validation; application permissions must enforce that in use.
-- This is a partial catalogue feed: existing stock and order-line agreements are preserved.

CREATE SCHEMA writes_example;
SET search_path = writes_example, pg_catalog;
CREATE TABLE products (
  product_id text PRIMARY KEY,
  name text NOT NULL,
  price numeric(8,2) NOT NULL CHECK (price >= 0),
  stock integer NOT NULL CHECK (stock >= 0)
);
INSERT INTO products VALUES
  ('P3', 'Green tea, 50 g', 4.50, 12),
  ('P7', 'Blue mug', 20.00, 1),
  ('P9', 'Teapot', 35.00, 4);
CREATE TABLE order_items (
  order_id integer, line_no integer,
  product_id text NOT NULL REFERENCES products,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric(8,2) NOT NULL,
  PRIMARY KEY (order_id, line_no)
);
INSERT INTO order_items VALUES
  (103, 1, 'P7', 1, 20.00), (103, 2, 'P3', 2, 4.50);
CREATE TABLE catalogue_batches (
  batch_id text PRIMARY KEY,
  expected_rows integer NOT NULL CHECK (expected_rows >= 0)
);
CREATE TABLE catalogue_raw (
  batch_id text REFERENCES catalogue_batches,
  row_no integer CHECK (row_no > 0),
  product_id_raw text, name_raw text, price_raw text,
  PRIMARY KEY (batch_id, row_no)
);
CREATE TABLE catalogue_decisions (
  batch_id text, row_no integer,
  product_id text, name text, price numeric(8,2), reason text,
  PRIMARY KEY (batch_id, row_no),
  FOREIGN KEY (batch_id, row_no) REFERENCES catalogue_raw,
  CHECK (reason IS NOT NULL OR
    (product_id IS NOT NULL AND name IS NOT NULL AND
     price IS NOT NULL AND price >= 0))
);
CREATE UNIQUE INDEX one_ready_product
ON catalogue_decisions (batch_id, product_id)
WHERE reason IS NULL;
CREATE TABLE catalogue_applied (
  batch_id text, row_no integer,
  PRIMARY KEY (batch_id, row_no),
  FOREIGN KEY (batch_id, row_no) REFERENCES catalogue_decisions
);

-- Receive the complete four-record input. Keep its original file/manifest outside this example.
BEGIN;
INSERT INTO catalogue_batches VALUES ('B17', 4);
INSERT INTO catalogue_raw VALUES
  ('B17', 1, 'P7', 'Blue mug', '22.00'),
  ('B17', 2, 'P11', 'Tea strainer', '8.00'),
  ('B17', 3, 'P3', 'Green tea, 50 g', '-4.50'),
  ('B17', 4, 'P9', 'Teapot', '36.00');
COMMIT;

-- Validate once, preserving raw values and rejection reasons.
BEGIN;
WITH converted AS (
  SELECT r.*,
    CASE WHEN price_raw ~ '^-?[0-9]+([.][0-9]{1,2})?$'
           AND pg_input_is_valid(price_raw, 'numeric(8,2)')
         THEN price_raw::numeric(8,2) END AS price,
    count(*) OVER (PARTITION BY batch_id, product_id_raw) AS key_count
  FROM catalogue_raw r WHERE batch_id = 'B17'
)
INSERT INTO catalogue_decisions
SELECT batch_id, row_no, product_id_raw, name_raw, price,
  CASE
    WHEN product_id_raw IS NULL OR btrim(product_id_raw) = '' THEN 'missing product key'
    WHEN name_raw IS NULL OR btrim(name_raw) = '' THEN 'missing name'
    WHEN price IS NULL THEN 'invalid price: use at most two decimal places'
    WHEN price < 0 THEN 'negative price'
    WHEN key_count > 1 THEN 'duplicate product key'
    ELSE NULL
  END
FROM converted;
COMMIT;

-- First chunk: rows 1 and 2, target and progress together.
BEGIN;
CREATE TEMP TABLE chunk ON COMMIT DROP AS
SELECT d.batch_id, d.row_no, d.product_id, d.name, d.price
FROM catalogue_decisions d
WHERE d.batch_id = 'B17' AND d.reason IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM catalogue_applied a
    WHERE (a.batch_id, a.row_no) = (d.batch_id, d.row_no)
  )
ORDER BY d.row_no
LIMIT 2;

WITH written AS (
  INSERT INTO products (product_id, name, price, stock)
  SELECT product_id, name, price, 0 FROM chunk
  ON CONFLICT (product_id) DO UPDATE
  SET name = EXCLUDED.name, price = EXCLUDED.price
  RETURNING product_id
)
INSERT INTO catalogue_applied (batch_id, row_no)
SELECT c.batch_id, c.row_no
FROM chunk c JOIN written w USING (product_id);
COMMIT;

-- Known interruption: stop here, before the next chunk begins.
SELECT r.row_no, r.product_id_raw,
  CASE WHEN d.row_no IS NULL THEN 'unvalidated'
       WHEN d.reason IS NOT NULL THEN 'rejected'
       WHEN a.row_no IS NOT NULL THEN 'applied'
       ELSE 'pending' END AS status,
  d.reason
FROM catalogue_raw r
LEFT JOIN catalogue_decisions d USING (batch_id, row_no)
LEFT JOIN catalogue_applied a USING (batch_id, row_no)
WHERE r.batch_id = 'B17'
ORDER BY r.row_no;

-- Resume: pending row 4 only.
BEGIN;
CREATE TEMP TABLE chunk ON COMMIT DROP AS
SELECT d.batch_id, d.row_no, d.product_id, d.name, d.price
FROM catalogue_decisions d
WHERE d.batch_id = 'B17' AND d.reason IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM catalogue_applied a
    WHERE (a.batch_id, a.row_no) = (d.batch_id, d.row_no)
  )
ORDER BY d.row_no
LIMIT 2;

WITH written AS (
  INSERT INTO products (product_id, name, price, stock)
  SELECT product_id, name, price, 0 FROM chunk
  ON CONFLICT (product_id) DO UPDATE
  SET name = EXCLUDED.name, price = EXCLUDED.price
  RETURNING product_id
)
INSERT INTO catalogue_applied (batch_id, row_no)
SELECT c.batch_id, c.row_no
FROM chunk c JOIN written w USING (product_id);
COMMIT;

-- Same batch replay: empty chunk, no writes.
BEGIN;
CREATE TEMP TABLE chunk ON COMMIT DROP AS
SELECT d.batch_id, d.row_no, d.product_id, d.name, d.price
FROM catalogue_decisions d
WHERE d.batch_id = 'B17' AND d.reason IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM catalogue_applied a
    WHERE (a.batch_id, a.row_no) = (d.batch_id, d.row_no)
  )
ORDER BY d.row_no
LIMIT 2;

WITH written AS (
  INSERT INTO products (product_id, name, price, stock)
  SELECT product_id, name, price, 0 FROM chunk
  ON CONFLICT (product_id) DO UPDATE
  SET name = EXCLUDED.name, price = EXCLUDED.price
  RETURNING product_id
)
INSERT INTO catalogue_applied (batch_id, row_no)
SELECT c.batch_id, c.row_no
FROM chunk c JOIN written w USING (product_id);
COMMIT;

-- Reconcile identities, intended values and all four input records.
SELECT r.row_no, r.product_id_raw,
  CASE WHEN d.row_no IS NULL THEN 'unvalidated'
       WHEN d.reason IS NOT NULL THEN 'rejected'
       WHEN a.row_no IS NOT NULL THEN 'applied'
       ELSE 'pending' END AS status,
  d.reason
FROM catalogue_raw r
LEFT JOIN catalogue_decisions d USING (batch_id, row_no)
LEFT JOIN catalogue_applied a USING (batch_id, row_no)
WHERE r.batch_id = 'B17'
ORDER BY r.row_no;
SELECT product_id, name, price::text, stock FROM products ORDER BY product_id;
SELECT sum(quantity * unit_price)::text AS order_103_total FROM order_items WHERE order_id = 103;
SELECT b.expected_rows, count(r.row_no)::int AS received,
       count(d.row_no)::int AS validated,
       count(*) FILTER (WHERE d.reason IS NOT NULL)::int AS rejected,
       count(a.row_no)::int AS applied,
       count(*) FILTER (WHERE d.row_no IS NOT NULL AND d.reason IS NULL AND a.row_no IS NULL)::int AS pending
FROM catalogue_batches b
LEFT JOIN catalogue_raw r USING (batch_id)
LEFT JOIN catalogue_decisions d USING (batch_id, row_no)
LEFT JOIN catalogue_applied a USING (batch_id, row_no)
WHERE b.batch_id = 'B17' GROUP BY b.batch_id, b.expected_rows;
