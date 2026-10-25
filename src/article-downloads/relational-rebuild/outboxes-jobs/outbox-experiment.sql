-- Outboxes and database-backed jobs: one-session experiment.
-- Run on a disposable PostgreSQL database with ON_ERROR_STOP=1.
-- All tables are temporary. No external service is called.
-- Each experiment starts from the purchase replay before order 103 exists.
BEGIN;
CREATE TEMP TABLE customers(customer_id integer PRIMARY KEY, name text NOT NULL);
CREATE TEMP TABLE products(product_id text PRIMARY KEY, name text NOT NULL,
 price numeric(8,2) NOT NULL CHECK(price>=0), stock integer NOT NULL CHECK(stock>=0));
CREATE TEMP TABLE orders(order_id integer PRIMARY KEY, customer_id integer NOT NULL REFERENCES customers,
 placed_at timestamptz NOT NULL, status text NOT NULL CHECK(status IN('pending','paid','cancelled')));
CREATE TEMP TABLE order_items(order_id integer REFERENCES orders, line_no integer,
 product_id text NOT NULL REFERENCES products, quantity integer NOT NULL CHECK(quantity>0),
 unit_price numeric(8,2) NOT NULL, PRIMARY KEY(order_id,line_no));
CREATE TEMP TABLE payments(payment_id integer PRIMARY KEY, order_id integer NOT NULL REFERENCES orders,
 amount numeric(8,2) NOT NULL CHECK(amount>0), method text NOT NULL);
INSERT INTO customers VALUES (1,'Mina Shah'),(2,'Tariq Aziz'),(3,'Edda Berg');
INSERT INTO products VALUES ('P3','Green tea, 50 g',4.50,12),('P7','Blue mug',20.00,1),('P9','Teapot',35.00,4);
INSERT INTO orders VALUES (101,1,'2026-10-12 09:30+00','paid'),(102,2,'2026-10-14 16:05+00','paid');
INSERT INTO order_items VALUES (101,1,'P3',1,4.50),(101,2,'P9',1,35.00),(102,1,'P7',2,20.00);
INSERT INTO payments VALUES (501,101,30.00,'card'),(502,101,9.50,'gift card'),(503,102,40.00,'card');
CREATE TEMP TABLE outbox (
 work_id text PRIMARY KEY, kind text NOT NULL, payload jsonb NOT NULL,
 state text NOT NULL DEFAULT 'ready' CHECK(state IN('ready','running','done','failed','cancelled')),
 available_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 claim_generation bigint NOT NULL DEFAULT 0, claimed_by text, lease_until timestamptz,
 completed_at timestamptz,
 CHECK ((state = 'running') = (claimed_by IS NOT NULL AND lease_until IS NOT NULL))
);
CREATE FUNCTION pg_temp.place_order() RETURNS void LANGUAGE plpgsql AS $body$
BEGIN
 UPDATE products SET stock=stock-2 WHERE product_id='P3' AND stock>=2;
 IF NOT FOUND THEN RAISE EXCEPTION 'Tea unavailable'; END IF;
 UPDATE products SET stock=stock-1 WHERE product_id='P7' AND stock>=1;
 IF NOT FOUND THEN RAISE EXCEPTION 'Mug unavailable'; END IF;
 INSERT INTO orders VALUES (103,1,'2026-10-20 10:15+00','pending');
 INSERT INTO order_items VALUES (103,1,'P7',1,20.00),(103,2,'P3',2,4.50);
 INSERT INTO outbox(work_id,kind,payload) VALUES
 ('order-103-ack','order_received','{"order_id":103,"customer_id":1,"total":"29.00","message":"Order received; payment still pending"}');
END $body$;
COMMIT;
-- The protected transaction rolls both records and stock back together.
BEGIN;
SELECT pg_temp.place_order();
ROLLBACK;
DO $body$ BEGIN
 IF EXISTS(SELECT FROM orders WHERE order_id=103) OR EXISTS(SELECT FROM outbox)
 OR (SELECT stock FROM products WHERE product_id='P7')<>1
 OR (SELECT stock FROM products WHERE product_id='P3')<>12 THEN
 RAISE EXCEPTION 'Rollback left partial purchase'; END IF;
END $body$;
-- The same purchase commits both records together.
BEGIN;
SELECT pg_temp.place_order();
COMMIT;
DO $body$ BEGIN
 IF (SELECT count(*) FROM outbox)<>1 OR (SELECT status FROM orders WHERE order_id=103)<>'pending'
 OR (SELECT sum(quantity*unit_price) FROM order_items WHERE order_id=103)<>29.00
 OR EXISTS(SELECT FROM payments WHERE order_id=103)
 OR (SELECT stock FROM products WHERE product_id='P3')<>10
 OR (SELECT stock FROM products WHERE product_id='P7')<>0
 OR (SELECT stock FROM products WHERE product_id='P9')<>4 THEN
 RAISE EXCEPTION 'Committed purchase differs from shared facts'; END IF;
END $body$;
-- Start this independent worker experiment after six earlier claims.
UPDATE outbox SET claim_generation=6;
BEGIN;
WITH candidates AS (
 SELECT work_id FROM outbox
 WHERE state IN('ready','running') AND available_at<=clock_timestamp()
 AND (lease_until IS NULL OR lease_until<=clock_timestamp())
 ORDER BY available_at,work_id FOR UPDATE SKIP LOCKED LIMIT 10
)
UPDATE outbox j SET state='running',claimed_by='A',claim_generation=j.claim_generation+1,
 lease_until=clock_timestamp()+interval '1 minute'
FROM candidates c WHERE j.work_id=c.work_id
RETURNING j.work_id,j.claim_generation;
COMMIT;
DO $body$ BEGIN
 IF (SELECT claim_generation FROM outbox)<>7 THEN RAISE EXCEPTION 'Expected claim 7'; END IF;
END $body$;
-- Simulate time passing by changing this disposable row's deadline.
-- This tests the expiry predicate; it is not a real-time lease measurement.
UPDATE outbox SET lease_until=clock_timestamp()-interval '1 second';
-- An expired claim cannot renew itself under the guard.
DO $body$ BEGIN
 UPDATE outbox SET lease_until=clock_timestamp()+interval '1 minute'
 WHERE work_id='order-103-ack' AND state='running' AND claimed_by='A'
 AND claim_generation=7 AND lease_until>clock_timestamp();
 IF FOUND THEN RAISE EXCEPTION 'Expired claim renewed'; END IF;
END $body$;
BEGIN;
WITH candidates AS (
 SELECT work_id FROM outbox
 WHERE state IN('ready','running') AND available_at<=clock_timestamp()
 AND (lease_until IS NULL OR lease_until<=clock_timestamp())
 ORDER BY available_at,work_id FOR UPDATE SKIP LOCKED LIMIT 10
)
UPDATE outbox j SET state='running',claimed_by='B',claim_generation=j.claim_generation+1,
 lease_until=clock_timestamp()+interval '1 minute'
FROM candidates c WHERE j.work_id=c.work_id
RETURNING j.work_id,j.claim_generation;
COMMIT;
-- Counterexample: work_id alone lets stale A finish B's claim. Roll it back.
BEGIN;
UPDATE outbox SET state='done',claimed_by=NULL,lease_until=NULL WHERE work_id='order-103-ack';
DO $body$ BEGIN
 IF (SELECT state FROM outbox)<>'done' THEN RAISE EXCEPTION 'Counterexample did not expose stale completion'; END IF;
END $body$;
ROLLBACK;
-- Correct guard: A cannot finish; B can.
BEGIN;
SELECT work_id FROM outbox WHERE work_id='order-103-ack' FOR UPDATE;
DO $body$ BEGIN
 UPDATE outbox SET state='done',completed_at=clock_timestamp(),claimed_by=NULL,lease_until=NULL
 WHERE work_id='order-103-ack' AND state='running' AND claimed_by='A'
 AND claim_generation=7 AND lease_until>clock_timestamp();
 IF FOUND THEN RAISE EXCEPTION 'Stale A finished'; END IF;
 UPDATE outbox SET state='done',completed_at=clock_timestamp(),claimed_by=NULL,lease_until=NULL
 WHERE work_id='order-103-ack' AND state='running' AND claimed_by='B'
 AND claim_generation=8 AND lease_until>clock_timestamp();
 IF NOT FOUND THEN RAISE EXCEPTION 'Current B could not finish'; END IF;
END $body$;
COMMIT;
SELECT order_id,status FROM orders WHERE order_id=103;
SELECT work_id,state,claim_generation FROM outbox;
-- Expected: order 103 pending; order-103-ack done generation 8; no payment.
DROP FUNCTION pg_temp.place_order();
