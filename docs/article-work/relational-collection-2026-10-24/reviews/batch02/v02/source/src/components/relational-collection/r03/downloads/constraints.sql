-- Constraints and tenant boundaries; PostgreSQL 18.
-- Run in a disposable database with psql -X -v ON_ERROR_STOP=1 -f constraints.sql
-- Temporary objects only. Expected failures are caught and checked by SQLSTATE.
-- Fixed data: collection core.json; quantities/stocks are the after-103 snapshot.
\set ON_ERROR_STOP on
BEGIN;
SET LOCAL client_min_messages = notice;
CREATE FUNCTION pg_temp.expect_error(label text, command text, wanted text)
RETURNS void LANGUAGE plpgsql AS $$
DECLARE got text; cname text;
BEGIN
  BEGIN
    EXECUTE command;
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS got = RETURNED_SQLSTATE, cname = CONSTRAINT_NAME;
    IF got <> wanted THEN
      RAISE EXCEPTION '%: expected %, got %', label, wanted, got;
    END IF;
    RAISE NOTICE '%: SQLSTATE %, constraint %', label, got, cname;
    RETURN;
  END;
  RAISE EXCEPTION '%: expected SQLSTATE %, statement succeeded', label, wanted;
END $$;

-- 1. Row checks and the separate obligation to supply a value.
CREATE TEMP TABLE check_only (quantity integer CHECK (quantity > 0));
INSERT INTO check_only VALUES (NULL);
SELECT 'CHECK alone admits NULL' AS observation, count(*) FROM check_only;
SELECT pg_temp.expect_error('zero quantity',
  'INSERT INTO check_only VALUES (0)', '23514');

CREATE TEMP TABLE customers (customer_id integer PRIMARY KEY, name text NOT NULL);
CREATE TEMP TABLE products (
  product_id text PRIMARY KEY, name text NOT NULL,
  price numeric(8,2) NOT NULL CHECK (price >= 0),
  stock integer NOT NULL CHECK (stock >= 0));
CREATE TEMP TABLE orders (
  order_id integer PRIMARY KEY,
  customer_id integer NOT NULL REFERENCES customers,
  placed_at timestamptz NOT NULL,
  status text NOT NULL CHECK (status IN ('pending','paid','cancelled')));
CREATE TEMP TABLE order_items (
  order_id integer REFERENCES orders, line_no integer,
  product_id text NOT NULL REFERENCES products,
  quantity integer NOT NULL CONSTRAINT order_items_quantity_positive CHECK (quantity > 0),
  unit_price numeric(8,2) NOT NULL,
  PRIMARY KEY (order_id, line_no));
INSERT INTO customers VALUES
  (1, 'Mina Shah'),
  (2, 'Tariq Aziz'),
  (3, 'Edda Berg');
INSERT INTO products VALUES
  ('P3', 'Green tea, 50 g', '4.50', 10),
  ('P7', 'Blue mug', '20.00', 0),
  ('P9', 'Teapot', '35.00', 4);
INSERT INTO orders VALUES
  (101, 1, '2026-10-12T09:30:00Z', 'paid'),
  (102, 2, '2026-10-14T16:05:00Z', 'paid'),
  (103, 1, '2026-10-20T10:15:00Z', 'pending');
INSERT INTO order_items VALUES
  (101, 1, 'P3', 1, '4.50'),
  (101, 2, 'P9', 1, '35.00'),
  (102, 1, 'P7', 2, '20.00'),
  (103, 1, 'P7', 1, '20.00'),
  (103, 2, 'P3', 2, '4.50');

SELECT pg_temp.expect_error('required quantity',
  'UPDATE order_items SET quantity = NULL WHERE order_id=103 AND line_no=1', '23502');
SELECT pg_temp.expect_error('positive quantity',
  'UPDATE order_items SET quantity = 0 WHERE order_id=103 AND line_no=1', '23514');
SELECT pg_temp.expect_error('duplicate line identity',
  $$INSERT INTO order_items VALUES (103,1,'P7',1,20.00)$$, '23505');
SELECT pg_temp.expect_error('missing product',
  $$UPDATE order_items SET product_id='P404' WHERE order_id=103 AND line_no=1$$, '23503');
SELECT pg_temp.expect_error('delete referenced product',
  $$DELETE FROM products WHERE product_id='P7'$$, '23503');
SELECT pg_temp.expect_error('change referenced product key',
  $$UPDATE products SET product_id='P404' WHERE product_id='P7'$$, '23503');
SELECT pg_temp.expect_error('delete referenced order',
  'DELETE FROM orders WHERE order_id=103', '23503');
-- Same data without identity/reference enforcement admits both forbidden states.
CREATE TEMP TABLE unchecked_lines AS SELECT * FROM order_items WITH NO DATA;
INSERT INTO unchecked_lines VALUES (103,1,'P7',1,20.00), (103,1,'P7',1,20.00);
INSERT INTO unchecked_lines VALUES (103,2,'P404',1,20.00);
SELECT 'without a key, duplicate lines' AS observation, count(*)
FROM unchecked_lines WHERE order_id=103 AND line_no=1;
SELECT 'without a reference, missing product' AS observation, product_id
FROM unchecked_lines WHERE product_id='P404';

-- 2. A separately labelled deletion-policy variant; no core rows are deleted.
CREATE TEMP TABLE cascade_orders (order_id integer PRIMARY KEY);
CREATE TEMP TABLE cascade_lines (
  order_id integer REFERENCES cascade_orders ON DELETE CASCADE,
  line_no integer, PRIMARY KEY (order_id,line_no));
INSERT INTO cascade_orders VALUES (103);
INSERT INTO cascade_lines VALUES (103,1),(103,2);
DELETE FROM cascade_orders WHERE order_id=103;
SELECT 'cascade leaves no component lines' AS observation, count(*) FROM cascade_lines;

-- 3. Tenant-scoped variant. Copies core rows into shop 10; accepted second P7 is shop 20.
CREATE TEMP TABLE scoped_customers (
  shop_id integer, customer_id integer, name text NOT NULL,
  PRIMARY KEY (shop_id, customer_id));
CREATE TEMP TABLE scoped_products (
  shop_id integer, product_id text, name text NOT NULL,
  price numeric(8,2) NOT NULL CHECK(price >= 0),
  PRIMARY KEY (shop_id, product_id));
CREATE TEMP TABLE scoped_orders (
  shop_id integer, order_id integer, customer_id integer NOT NULL,
  PRIMARY KEY (shop_id, order_id),
  FOREIGN KEY (shop_id,customer_id) REFERENCES scoped_customers);
CREATE TEMP TABLE scoped_lines (
  shop_id integer, order_id integer, line_no integer,
  product_id text NOT NULL,
  quantity integer NOT NULL CHECK(quantity>0), unit_price numeric(8,2) NOT NULL,
  PRIMARY KEY (shop_id,order_id,line_no),
  CONSTRAINT line_order_same_shop FOREIGN KEY (shop_id,order_id)
    REFERENCES scoped_orders (shop_id,order_id),
  CONSTRAINT line_product_same_shop FOREIGN KEY (shop_id,product_id)
    REFERENCES scoped_products (shop_id,product_id));
INSERT INTO scoped_customers SELECT 10,customer_id,name FROM customers;
INSERT INTO scoped_products SELECT 10,product_id,name,price FROM products;
INSERT INTO scoped_products VALUES (20,'P7','Copper mug',18.00);
INSERT INTO scoped_orders SELECT 10,order_id,customer_id FROM orders;
INSERT INTO scoped_lines SELECT 10,order_id,line_no,product_id,quantity,unit_price FROM order_items;
SELECT 'P7 alone identifies two products' AS observation, shop_id,product_id,name
FROM scoped_products WHERE product_id='P7' ORDER BY shop_id;
SELECT pg_temp.expect_error('P7 alone is not a unique reference target',
 $$CREATE TEMP TABLE wrong_target (product_id text REFERENCES scoped_products(product_id))$$,
 '42830');
SELECT pg_temp.expect_error('shop20 product exists but order20/103 does not',
 $$INSERT INTO scoped_lines VALUES (20,103,1,'P7',1,18.00)$$, '23503');
-- Removing only the order reference makes the same invalid line admissible.
ALTER TABLE scoped_lines DROP CONSTRAINT line_order_same_shop;
INSERT INTO scoped_lines VALUES (20,103,1,'P7',1,18.00);
SELECT 'missing order reference admits invalid shop20 line' AS observation,
 shop_id,order_id,product_id FROM scoped_lines WHERE shop_id=20;
DELETE FROM scoped_lines WHERE shop_id=20;
ALTER TABLE scoped_lines ADD CONSTRAINT line_order_same_shop
 FOREIGN KEY (shop_id,order_id) REFERENCES scoped_orders;
SELECT pg_temp.expect_error('tenant line requires its product',
 $$INSERT INTO scoped_lines VALUES (10,103,3,NULL,1,20.00)$$, '23502');

-- 4. Anonymous optional composite reference: partial absence versus no reference.
CREATE TEMP TABLE pair_parent (a integer,b integer, PRIMARY KEY(a,b));
INSERT INTO pair_parent VALUES (1,2);
CREATE TEMP TABLE pair_simple (a integer,b integer,
 FOREIGN KEY(a,b) REFERENCES pair_parent MATCH SIMPLE);
CREATE TEMP TABLE pair_full (a integer,b integer,
 FOREIGN KEY(a,b) REFERENCES pair_parent MATCH FULL);
INSERT INTO pair_simple VALUES(999,NULL);
INSERT INTO pair_full VALUES(NULL,NULL),(1,2);
SELECT pg_temp.expect_error('MATCH FULL refuses a half-missing pair',
 'INSERT INTO pair_full VALUES(999,NULL)', '23503');
SELECT 'MATCH SIMPLE admits half-missing pair' AS observation,a,b FROM pair_simple;

-- 5. Same order ID in a separate scratch definition; checks can be deferred.
CREATE TEMP TABLE deferred_orders (order_id integer PRIMARY KEY);
CREATE TEMP TABLE deferred_lines (
  order_id integer NOT NULL,
  CONSTRAINT deferred_order_exists FOREIGN KEY(order_id)
    REFERENCES deferred_orders DEFERRABLE INITIALLY DEFERRED);
INSERT INTO deferred_lines VALUES(103); -- temporarily has no parent
INSERT INTO deferred_orders VALUES(103);
SET CONSTRAINTS deferred_order_exists IMMEDIATE; -- now valid
SET CONSTRAINTS deferred_order_exists DEFERRED;
SELECT pg_temp.expect_error('unrepaired deferred reference still fails',
 $$DO $body$ BEGIN
    INSERT INTO deferred_lines VALUES(999);
    SET CONSTRAINTS deferred_order_exists IMMEDIATE;
 END $body$;$$, '23503');
SELECT 'core line count unchanged' AS observation,count(*) FROM order_items;
ROLLBACK;
\echo All expected constraint outcomes checked; temporary work rolled back.
