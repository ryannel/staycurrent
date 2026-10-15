-- PostgreSQL 18; use a disposable database and separate query-editor sessions.
-- This is a worksheet, not a script to execute from top to bottom on one session.
-- Finish/ROLLBACK all sessions before repeating SETUP; it replaces only the
-- migration_orders table and migration_copy_note helper used by this lesson.

-- SETUP, session A, in autocommit:
DROP TABLE IF EXISTS migration_orders;
DROP FUNCTION IF EXISTS migration_copy_note();
CREATE TABLE migration_orders(order_id integer PRIMARY KEY, delivery_note text NOT NULL);
INSERT INTO migration_orders VALUES(1,'Front desk'),(2,'Ring bell'),(3,'Side door');
ALTER TABLE migration_orders ADD COLUMN delivery_instructions text;
CREATE FUNCTION migration_copy_note() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_OP = 'UPDATE' OR NEW.delivery_note IS NOT NULL THEN
  NEW.delivery_instructions := NEW.delivery_note;
 END IF;
 RETURN NEW;
END;
$$;
CREATE TRIGGER migration_sync_note BEFORE INSERT OR UPDATE OF delivery_note
ON migration_orders FOR EACH ROW EXECUTE FUNCTION migration_copy_note();

-- 1. A is the old application. Leave this transaction open.
BEGIN ISOLATION LEVEL READ COMMITTED;
UPDATE migration_orders SET delivery_note='Reception' WHERE order_id=1;

-- 2. B is the backfill worker. Send this block; it waits for A.
BEGIN ISOLATION LEVEL READ COMMITTED;
WITH batch AS (
 SELECT order_id FROM migration_orders
 WHERE delivery_instructions IS NULL ORDER BY order_id LIMIT 2
)
UPDATE migration_orders AS o
SET delivery_instructions=o.delivery_note
FROM batch WHERE o.order_id=batch.order_id
 AND o.delivery_instructions IS NULL
RETURNING o.order_id,o.delivery_instructions;

-- 3. A: finish the old-application write.
COMMIT;

-- 4. B: its waiting UPDATE returns only order 2 / Ring bell. Then:
COMMIT;
SELECT * FROM migration_orders ORDER BY order_id;
-- 1: Reception / Reception; 2: Ring bell / Ring bell; 3: Side door / NULL.
-- Repeating B's UPDATE in a new transaction copies order 3.

-- VARIATION: ROLLBACK both sessions, rerun SETUP, then run B's BEGIN+UPDATE
-- before A's BEGIN+UPDATE. A now waits. Commit B, let A finish and commit A.
-- Order 1 ends with Reception in both columns, because the old-write trigger
-- runs after B's backfill has completed.

-- SEPARATE DDL EXPERIMENT. Finish both sessions, then reset on A:
DROP TABLE migration_orders;
DROP FUNCTION migration_copy_note();
CREATE TABLE migration_orders(order_id integer PRIMARY KEY, delivery_note text NOT NULL);
INSERT INTO migration_orders VALUES(1,'Front desk');

-- A: an ordinary read retains its table lock until this transaction ends.
BEGIN;
SELECT order_id,delivery_note FROM migration_orders WHERE order_id=1;

-- B: the migration waits for a conflicting table lock. The manual worksheet
-- uses 10 seconds to allow switching windows; the automated run uses 2 seconds.
BEGIN;
SET LOCAL lock_timeout='10s';
SET LOCAL statement_timeout='20s';
ALTER TABLE migration_orders ADD COLUMN delivery_instructions text;

-- C: a third connection. Send while B is waiting; this read queues behind B.
SELECT order_id,delivery_note FROM migration_orders WHERE order_id=1;

-- B eventually receives 55P03 (lock timeout). C can then finish even while
-- A remains open. B's transaction is failed; do not send ordinary work in it.
-- B:
ROLLBACK;
-- A:
COMMIT;
-- B: retry only after the blocker has ended. This succeeds in the fixture.
BEGIN;
SET LOCAL lock_timeout='2s';
SET LOCAL statement_timeout='10s';
ALTER TABLE migration_orders ADD COLUMN delivery_instructions text;
COMMIT;
SELECT * FROM migration_orders;
