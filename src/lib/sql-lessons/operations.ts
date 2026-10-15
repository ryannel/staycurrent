import type { Tutorial } from '../sql-sandbox-tutorials';

export const operationsTutorials: Tutorial[] = [
 {
  id: 'schema-evolution', title: 'Change a column while old writers still exist',
  description: 'Add a replacement column, synchronise old writes, backfill in batches and find the cutover boundary.',
  articleHref: '/learn/databases/relational/schema-changes/',
  steps: [
   { title: 'Prepare the old application’s records', instruction: 'Run this setup first. The migration_ table and function belong only to this lesson. The old application reads and writes delivery_note. You send commands on one connection; sequential old-writer commands model compatibility, not actual concurrent sessions. Restart the lesson or rerun this setup to reset.',
     sql: `DROP TABLE IF EXISTS migration_orders;
DROP FUNCTION IF EXISTS migration_copy_note();
CREATE TABLE migration_orders (order_id integer PRIMARY KEY, delivery_note text NOT NULL);
INSERT INTO migration_orders (order_id, delivery_note) VALUES (1, 'Front desk'), (2, 'Ring bell'), (3, 'Side door');
SELECT * FROM migration_orders ORDER BY order_id;`, expected: 'Three orders with required delivery notes. The replacement column does not exist yet.' },
   { title: 'Expand the schema and preserve old writes', instruction: 'The new column is initially nullable. This trigger copies a supplied old note on insertion and every change to the old column. Existing records still need a backfill. Predict whether adding the column alone will copy their notes.',
     sql: `ALTER TABLE migration_orders ADD COLUMN delivery_instructions text;
CREATE FUNCTION migration_copy_note() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'UPDATE' OR NEW.delivery_note IS NOT NULL THEN
    NEW.delivery_instructions := NEW.delivery_note;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER migration_sync_note
BEFORE INSERT OR UPDATE OF delivery_note ON migration_orders
FOR EACH ROW EXECUTE FUNCTION migration_copy_note();
SELECT * FROM migration_orders ORDER BY order_id;`, expected: 'All three delivery_instructions values are null. The trigger handles future old-column writes, not rows that already existed. Run this schema-changing step once per setup.' },
   { title: 'Backfill two records', instruction: 'A batch chooses at most two missing rows and copies the old value inside one UPDATE. Predict which order remains incomplete. Running this statement again safely handles the next batch rather than copying every row again.',
     sql: `WITH batch AS (
 SELECT order_id FROM migration_orders
 WHERE delivery_instructions IS NULL ORDER BY order_id LIMIT 2
)
UPDATE migration_orders AS o
SET delivery_instructions = o.delivery_note
FROM batch WHERE o.order_id = batch.order_id
  AND o.delivery_instructions IS NULL
RETURNING o.order_id, o.delivery_instructions;`, expected: 'Orders 1 and 2 receive Front desk and Ring bell. Order 3 remains null. RETURNING row order is not guaranteed, even though batch selection is ordered.' },
   { title: 'Let an old writer change a copied row', instruction: 'The old application still writes delivery_note. Change order 1, then read both columns. Predict whether a completed backfill alone would have kept the new column current.',
     sql: `UPDATE migration_orders SET delivery_note = 'Reception' WHERE order_id = 1;
SELECT * FROM migration_orders WHERE order_id = 1;`, expected: 'Both columns say Reception because the trigger also handles updates after backfill. Without ongoing synchronisation, the copied column would still say Front desk.' },
   { title: 'Finish and validate the replacement', instruction: 'Finish the remaining rows, add a check without an immediate historical scan, then validate it. NOT VALID still enforces the check for subsequent writes. The validated check lets PostgreSQL establish NOT NULL without another full null-check scan. Each ALTER still needs its documented lock; this single-session exercise does not measure live lock waiting.',
     sql: `UPDATE migration_orders SET delivery_instructions = delivery_note
WHERE delivery_instructions IS NULL;
ALTER TABLE migration_orders ADD CONSTRAINT migration_note_present
CHECK (delivery_instructions IS NOT NULL) NOT VALID;
ALTER TABLE migration_orders VALIDATE CONSTRAINT migration_note_present;
ALTER TABLE migration_orders ALTER COLUMN delivery_instructions SET NOT NULL;
ALTER TABLE migration_orders DROP CONSTRAINT migration_note_present;
SELECT count(*) AS missing FROM migration_orders WHERE delivery_instructions IS NULL;`, expected: 'missing = 0. All three new values are present and required. Old writers still work through the trigger. Do not repeat this whole schema step without resetting.' },
   { title: 'Switch to new-only writers', instruction: 'Assume every old-only reader has been retired and all current readers use delivery_instructions. Relax the old column before the new application starts inserting without it. Predict the old value of this new record and what that means for rolling back to the original application.',
     sql: `ALTER TABLE migration_orders ALTER COLUMN delivery_note DROP NOT NULL;
INSERT INTO migration_orders (order_id, delivery_instructions) VALUES (4, 'Loading bay');
SELECT * FROM migration_orders WHERE order_id = 4;`, expected: 'Order 4 has null delivery_note and Loading bay in delivery_instructions. The original application can no longer read every note correctly. Rolling it back now requires a reverse backfill or stopping new-only writes; retaining the column alone is insufficient.' },
   { title: 'Retire the old representation', instruction: 'Assume all old-column writers, jobs and reports have now stopped. Remove the compatibility machinery and old column. Then edit the SELECT to find order 4. Restart the lesson to explore another batch size or another old-writer edit.',
     sql: `DROP TRIGGER migration_sync_note ON migration_orders;
ALTER TABLE migration_orders DROP COLUMN delivery_note;
DROP FUNCTION migration_copy_note();
SELECT order_id, delivery_instructions FROM migration_orders ORDER BY order_id;`, expected: 'Four orders survive with Reception, Ring bell, Side door and Loading bay. The final application uses only delivery_instructions. Old SQL mentioning delivery_note now fails, so retirement is a deployment decision, not just a successful ALTER.' },
  ],
 },
 {
  id: 'recovery-reconciliation', title: 'Find what a recovered copy is missing',
  description: 'Compare a model of an older restore with independently recorded successful requests.',
  articleHref: '/learn/databases/relational/backup-and-restore/',
  steps: [
   { title: 'Prepare a recovery model', instruction: 'This is a SQL model of recovery reconciliation, not a backup or disk-loss test. A saved table represents a recoverable point after order 101. A separate receipt table represents durable acknowledgements kept outside that lost database. Both tables are here only so the browser can show their relationship. Rerun this setup or restart to reset.',
     sql: `DROP TABLE IF EXISTS recovery_saved, recovery_receipts, recovery_orders;
CREATE TABLE recovery_orders (order_id integer PRIMARY KEY, request_key text UNIQUE NOT NULL, amount numeric(10,2) NOT NULL);
INSERT INTO recovery_orders (order_id, request_key, amount) VALUES (101, 'req-a', 25);
CREATE TABLE recovery_saved AS TABLE recovery_orders;
CREATE TABLE recovery_receipts (request_key text PRIMARY KEY, expected_amount numeric(10,2) NOT NULL);
INSERT INTO recovery_receipts (request_key, expected_amount) VALUES ('req-a', 25), ('req-b', 8);
INSERT INTO recovery_orders (order_id, request_key, amount) VALUES (102, 'req-b', 8);
SELECT * FROM recovery_orders ORDER BY order_id;`, expected: 'Live orders are 101/req-a/25 and 102/req-b/8. The saved copy has only 101, but both requests have independent success receipts.' },
   { title: 'Replace live records with the older copy', instruction: 'In this disposable model only, replace the live table contents from the saved rows. Predict which acknowledged order disappears. Real restoration uses a backup tool into an isolated target, not DELETE and INSERT in the damaged service.',
     sql: `BEGIN;
DELETE FROM recovery_orders;
INSERT INTO recovery_orders (order_id, request_key, amount)
SELECT order_id, request_key, amount FROM recovery_saved;
COMMIT;
SELECT * FROM recovery_orders ORDER BY order_id;`, expected: 'Only 101 remains. The table is structurally valid, but structural validity does not establish that every acknowledged request was recovered.' },
   { title: 'Reconcile acknowledged requests', instruction: 'Compare receipts with recovered orders by the stable request identity. Predict the result before running. A mismatch is something to investigate before reopening; it is not permission to charge a customer again.',
     sql: `SELECT r.request_key, r.expected_amount, o.amount AS recovered_amount
FROM recovery_receipts AS r
LEFT JOIN recovery_orders AS o ON o.request_key = r.request_key
WHERE o.request_key IS NULL OR o.amount IS DISTINCT FROM r.expected_amount
ORDER BY r.request_key;`, expected: 'req-b appears with expected_amount 8 and a null recovered_amount. The restored data is missing an acknowledged purchase.' },
   { title: 'Repair the known missing record', instruction: 'For this model, the operator has verified the complete missing order against an authoritative external record. Insert that order once, then repeat step 3. This represents an authorised reconciliation; a real order may need more facts, related records and payment-state checks than these three columns.',
     sql: `INSERT INTO recovery_orders (order_id, request_key, amount)
VALUES (102, 'req-b', 8);
SELECT count(*) AS orders, sum(amount) AS total FROM recovery_orders;`, expected: 'Two orders total 33, and step 3 returns no mismatches. The unique request_key prevents accidental duplicate insertion. No external payment has been replayed.' },
   { title: 'Try a wrong recovered amount', instruction: 'Change req-b to 9, then reload step 3 and predict its mismatch. Restore 8 afterwards or restart. This variation shows why matching counts alone are not sufficient validation.',
     sql: `UPDATE recovery_orders SET amount = 9 WHERE request_key = 'req-b';
SELECT count(*) AS orders, sum(amount) AS total FROM recovery_orders;`, expected: 'There are still two orders, but the total is now 34. Reconciliation finds req-b with expected 8 and recovered 9. This model teaches validation; it says nothing about your actual restore time or backup integrity.' },
  ],
 },
 {
  id: 'least-privilege', title: 'Read and update only what the job needs',
  description: 'Use a nonowner role, column privileges and a row policy; inspect real denied statements.',
  articleHref: '/learn/databases/relational/access-control/',
  steps: [
   { title: 'Prepare an owner and a restricted role', instruction: 'Run setup as the sandbox administrator. It creates a dedicated schema and a nonlogin role used with SET ROLE. This role is fixed to tenant 1 for the lesson. It can read order IDs and status and change status, but cannot read email or delete orders. Reset begins with RESET ROLE so it also works after a denied statement.',
     sql: `RESET ROLE;
DROP SCHEMA IF EXISTS ops_access CASCADE;
DO $$ BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'ops_shipping') THEN
   CREATE ROLE ops_shipping NOLOGIN;
 END IF;
END $$;
CREATE SCHEMA ops_access;
CREATE TABLE ops_access.orders (order_id integer PRIMARY KEY, tenant_id integer NOT NULL, email text NOT NULL, status text NOT NULL);
INSERT INTO ops_access.orders (order_id, tenant_id, email, status)
VALUES (1, 1, 'ada@example.invalid', 'ready'), (2, 2, 'lin@example.invalid', 'ready');
GRANT USAGE ON SCHEMA ops_access TO ops_shipping;
GRANT SELECT (order_id, status), UPDATE (status) ON ops_access.orders TO ops_shipping;
ALTER TABLE ops_access.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY shipping_tenant ON ops_access.orders TO ops_shipping
USING (tenant_id = 1) WITH CHECK (tenant_id = 1);
SELECT order_id, tenant_id, status FROM ops_access.orders ORDER BY order_id;`, expected: 'The administrator sees two orders. Object ownership and administrator bypass are not the shipping worker’s permissions; the next step changes the effective role.' },
   { title: 'Read as the worker', instruction: 'SET ROLE persists on this connection until RESET ROLE. Predict which order is visible and which columns the role can request.',
     sql: `SET ROLE ops_shipping;
SELECT current_user;
SELECT order_id, status FROM ops_access.orders ORDER BY order_id;`, expected: 'current_user is ops_shipping. Only order 1 appears; the row policy excludes tenant 2. SELECT * would also request forbidden columns and is not allowed.' },
   { title: 'Try to read a sensitive column', instruction: 'Run this deliberately denied standalone statement. Predict whether the row policy alone would hide the email of an otherwise visible tenant-1 order.',
     sql: `SELECT order_id, email FROM ops_access.orders;`, expected: 'Permission denied, SQLSTATE 42501. The column grant excludes email even on an allowed row. Because this is outside BEGIN, the connection remains usable after the error.', expectedError: '42501' },
   { title: 'Perform the allowed job', instruction: 'Update visible order 1, then attempt the same permitted status update for order 2. Predict whether the second command errors or changes zero rows.',
     sql: `UPDATE ops_access.orders SET status = 'packed' WHERE order_id = 1 RETURNING order_id, status;
UPDATE ops_access.orders SET status = 'packed' WHERE order_id = 2 RETURNING order_id, status;`, expected: 'Order 1 returns packed. Order 2 returns no row because it is outside the policy’s visible set. Zero rows is not a permission error; the handler must inspect that result.' },
   { title: 'Try an operation outside the role', instruction: 'DELETE was never granted, even for tenant 1. Run it and inspect the error. Then move to the reset-role step.',
     sql: `DELETE FROM ops_access.orders WHERE order_id = 1;`, expected: 'Permission denied, SQLSTATE 42501. Order 1 remains; a row policy does not grant a missing table operation.', expectedError: '42501' },
   { title: 'Return to the administrator and compare', instruction: 'RESET ROLE returns the session to its administrator. Predict what it can see. As a variation, change the policy to tenant_id = 2 in both USING and WITH CHECK, SET ROLE again and repeat the reads. Reset setup restores tenant 1.',
     sql: `RESET ROLE;
SELECT order_id, tenant_id, status FROM ops_access.orders ORDER BY order_id;`, expected: 'The administrator sees order 1 packed and order 2 ready. Testing as the administrator would have missed the restriction. The policy variation permits order 2 instead; it does not grant email or DELETE.' },
  ],
 },
 {
  id: 'deletion-and-copies', title: 'Delete a customer and prevent an old copy reviving them',
  description: 'Follow dependent records, a deletion ledger and a retained snapshot through a model restore.',
  articleHref: '/learn/databases/relational/data-lifecycle/',
  steps: [
   { title: 'Prepare live records and a retained-copy model', instruction: 'This independent dataset has Ada (1) and Lin (2), with one note each. A separate snapshot table models an older retained copy; it is not a real backup. The deletion ledger models decisions preserved independently across a restore. Restart or rerun this setup to reset.',
     sql: `DROP TABLE IF EXISTS lifecycle_notes, lifecycle_saved, lifecycle_deletions, lifecycle_customers;
CREATE TABLE lifecycle_customers (customer_id integer PRIMARY KEY, name text NOT NULL);
CREATE TABLE lifecycle_notes (note_id integer PRIMARY KEY, customer_id integer NOT NULL REFERENCES lifecycle_customers, note text NOT NULL);
CREATE TABLE lifecycle_deletions (customer_id integer PRIMARY KEY, requested_at date NOT NULL);
INSERT INTO lifecycle_customers (customer_id, name) VALUES (1, 'Ada'), (2, 'Lin');
INSERT INTO lifecycle_notes (note_id, customer_id, note) VALUES (10, 1, 'Call at noon'), (20, 2, 'Use front desk');
CREATE TABLE lifecycle_saved AS TABLE lifecycle_customers;
SELECT * FROM lifecycle_customers ORDER BY customer_id;`, expected: 'Two live customers, two notes, two saved customer rows and an empty deletion ledger.' },
   { title: 'Try deleting only the parent', instruction: 'Predict what the foreign key does when Ada still has a note. This deliberately rejected standalone DELETE tests the dependency before we perform the complete operation.',
     sql: `DELETE FROM lifecycle_customers WHERE customer_id = 1;`, expected: 'Foreign-key violation, SQLSTATE 23503. Ada remains. PostgreSQL will not leave note 10 pointing to a nonexistent customer.', expectedError: '23503' },
   { title: 'Record and apply the live deletion', instruction: 'In one transaction, record the deletion identity, remove Ada’s dependent note and remove Ada. The ledger contains the minimum model identity needed for replay, not a copy of her profile. Predict the remaining live and saved counts.',
     sql: `BEGIN;
INSERT INTO lifecycle_deletions (customer_id, requested_at) VALUES (1, '2026-10-15');
DELETE FROM lifecycle_notes WHERE customer_id = 1;
DELETE FROM lifecycle_customers WHERE customer_id = 1;
COMMIT;
SELECT (SELECT count(*) FROM lifecycle_customers) AS live,
       (SELECT count(*) FROM lifecycle_notes) AS notes,
       (SELECT count(*) FROM lifecycle_saved) AS saved;`, expected: 'live = 1, notes = 1, saved = 2. The current database no longer has Ada’s profile or note, but the older retained copy still has her profile.' },
   { title: 'Model restoring an older copy', instruction: 'Insert missing saved customer rows back into the practice live table. Predict which customer reappears. In real recovery this happens in an isolated restored environment, before traffic resumes.',
     sql: `INSERT INTO lifecycle_customers (customer_id, name)
SELECT customer_id, name FROM lifecycle_saved
ON CONFLICT (customer_id) DO NOTHING;
SELECT * FROM lifecycle_customers ORDER BY customer_id;`, expected: 'Ada reappears alongside Lin. A restore from before a deletion can revive data even when the original live deletion succeeded.' },
   { title: 'Reapply the deletion ledger before reopening', instruction: 'The model ledger survived separately from the old copy. Remove any restored dependants and customers it names, then check that no suppressed identity remains. Running this replay again is safe. As a variation, rerun step 4 and then this step; Ada should be removed again.',
     sql: `BEGIN;
DELETE FROM lifecycle_notes AS n USING lifecycle_deletions AS d WHERE n.customer_id = d.customer_id;
DELETE FROM lifecycle_customers AS c USING lifecycle_deletions AS d WHERE c.customer_id = d.customer_id;
COMMIT;
SELECT c.* FROM lifecycle_customers AS c JOIN lifecycle_deletions AS d USING (customer_id);
SELECT * FROM lifecycle_customers ORDER BY customer_id;`, expected: 'The first SELECT returns no rows. The second contains only Lin. This protects reopening in the model; a real process must replay across all restored copies and prevent new ingestion from recreating the deleted identity.' },
  ],
 },
];
