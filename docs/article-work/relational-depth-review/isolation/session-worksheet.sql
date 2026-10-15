-- Isolation and snapshots: two-connection worksheet, PostgreSQL 18.
-- This is a worksheet, NOT a script to run from top to bottom.
-- Open A and B against the SAME disposable database. Execute only the block
-- named by each step, on its named connection. Keep both sessions connected.
-- Load designing-data.sql once before beginning. It supplies products P7/P8.
-- In psql, \set VERBOSITY verbose displays SQLSTATE with error messages.

-- PRICE VIEW, step 1, A: reset outside a transaction, then take the first read.
UPDATE products SET current_price = 20 WHERE product_id = 'P7';
BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY;
SELECT current_price FROM products WHERE product_id = 'P7'; -- 20.00
-- Pause A here. Do not send its next SELECT yet.

-- PRICE VIEW, step 2, B:
BEGIN;
UPDATE products SET current_price = 22 WHERE product_id = 'P7';
COMMIT;

-- PRICE VIEW, step 3, A:
SELECT current_price FROM products WHERE product_id = 'P7'; -- still 20.00
COMMIT;
SELECT current_price FROM products WHERE product_id = 'P7'; -- now 22.00
-- Repeat all three steps, including reset, with READ COMMITTED in step 1.
-- That report returns 20.00, then 22.00 before COMMIT; the new read is 22.00.

-- DISPLAY SETUP, once, A, outside a transaction:
CREATE TABLE featured_products (
  product_id text PRIMARY KEY REFERENCES products(product_id),
  enabled boolean NOT NULL
);
INSERT INTO featured_products (product_id, enabled)
VALUES ('P7', true), ('P8', true);

-- RESET before EACH independent display comparison:
-- First run ROLLBACK on A AND on B; a no-transaction warning is harmless.
ROLLBACK;
-- Only after BOTH sessions have ended their transactions, run this on A:
UPDATE featured_products SET enabled = true;
SELECT product_id, enabled FROM featured_products ORDER BY product_id;
-- Both must be true. Do not reset between a rejected attempt and its retry.

-- WRITE SKEW, step 1, A:
BEGIN ISOLATION LEVEL REPEATABLE READ;
-- Step 2, B:
BEGIN ISOLATION LEVEL REPEATABLE READ;
-- Step 3, A. Keep this transaction open after the returned P7:
UPDATE featured_products SET enabled = false
WHERE product_id = 'P7'
  AND EXISTS (
    SELECT 1 FROM featured_products WHERE product_id = 'P8' AND enabled
  )
RETURNING product_id;
-- Step 4, B. Keep this transaction open after the returned P8:
UPDATE featured_products SET enabled = false
WHERE product_id = 'P8'
  AND EXISTS (
    SELECT 1 FROM featured_products WHERE product_id = 'P7' AND enabled
  )
RETURNING product_id;
-- Step 5, A:
COMMIT;
-- Step 6, B:
COMMIT;
-- After both commits, either connection:
SELECT product_id, enabled FROM featured_products ORDER BY product_id;
-- P7 false, P8 false: both decisions committed.

-- SERIALIZABLE COMPARISON:
-- Perform RESET above on both sessions, then repeat the six steps using
-- BEGIN ISOLATION LEVEL SERIALIZABLE on BOTH connections.
-- At least one attempt is rejected with SQLSTATE 40001. The rejection may
-- happen at UPDATE or COMMIT; stop that attempt and ROLLBACK on its connection.
-- Finish the surviving attempt. Do not send more work on a failed transaction.
-- The recorded run rejected B at COMMIT after A committed P7 false.

-- RETRY B, only for that recorded branch. Do not reset the flags:
ROLLBACK;
BEGIN ISOLATION LEVEL SERIALIZABLE;
UPDATE featured_products SET enabled = false
WHERE product_id = 'P8'
  AND EXISTS (
    SELECT 1 FROM featured_products WHERE product_id = 'P7' AND enabled
  )
RETURNING product_id;
-- Zero rows: the new view sees P7 disabled. The SQL succeeded.
COMMIT;
SELECT product_id, enabled FROM featured_products ORDER BY product_id;
-- P7 false, P8 true. If A was the rejected attempt, retry its original
-- conditional P7 statement instead; the identities in the final result reverse.

-- CONTROL-ROW ALTERNATIVE:
-- RESET both sessions and flags as above. On A, create this table once:
CREATE TABLE display_control (display_id text PRIMARY KEY);
INSERT INTO display_control (display_id) VALUES ('front-page');

-- Step 1, A:
BEGIN ISOLATION LEVEL READ COMMITTED;
SELECT display_id FROM display_control
WHERE display_id = 'front-page' FOR UPDATE;
-- Returns front-page. A holds the lock.

-- Step 2, B:
BEGIN ISOLATION LEVEL READ COMMITTED;
SELECT display_id FROM display_control
WHERE display_id = 'front-page' FOR UPDATE;
-- This SELECT waits. Do not wait for it to finish before continuing on A.

-- Step 3, A:
SELECT product_id, enabled FROM featured_products ORDER BY product_id;
-- Both true.
UPDATE featured_products SET enabled = false
WHERE product_id = 'P7'
  AND EXISTS (
    SELECT 1 FROM featured_products WHERE product_id = 'P8' AND enabled
  )
RETURNING product_id;
COMMIT;

-- Step 4, B, ONLY after its waiting SELECT has returned front-page:
SELECT product_id, enabled FROM featured_products ORDER BY product_id;
-- P7 false, P8 true: this new statement gets a fresh Read Committed view.
UPDATE featured_products SET enabled = false
WHERE product_id = 'P8'
  AND EXISTS (
    SELECT 1 FROM featured_products WHERE product_id = 'P7' AND enabled
  )
RETURNING product_id;
-- Zero rows. Leave P8 enabled and finish:
COMMIT;

-- CONTROL-ROW VARIATION:
-- RESET both sessions and flags. Keep the existing display_control table.
-- Repeat the four control-row steps with REPEATABLE READ on BOTH connections.
-- B still waits, but after the wait its older snapshot sees both flags true.
-- Its conditional update returns P8; both flags end false. A never changed
-- the control row, so locking that row does not cause a changed-row failure.
-- This protocol needs the common lock AND the later Read Committed snapshot.

-- FINISH: run ROLLBACK on both connections if abandoning any open attempt.
-- The disposable tables may remain for another trial. The RESET procedure
-- prepares a new comparison without recreating them.
