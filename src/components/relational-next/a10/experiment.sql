\set ON_ERROR_STOP on
SELECT version();
SHOW TimeZone;
CREATE FUNCTION expect_failure(label text, command text, expected text)
RETURNS void LANGUAGE plpgsql AS $$
DECLARE actual text;
BEGIN
  BEGIN
    EXECUTE command;
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS actual = RETURNED_SQLSTATE;
  END;
  IF actual IS DISTINCT FROM expected THEN
    RAISE EXCEPTION '%: expected %, got %', label, expected, actual;
  END IF;
  RAISE NOTICE 'PASS % [%]', label, actual;
END $$;
\ir schema.sql
INSERT INTO tenants VALUES (1),(2);
INSERT INTO customers VALUES (1,7),(2,8);
INSERT INTO resources VALUES (1,21),(1,22),(2,29);
INSERT INTO reservations
  (tenant_id,customer_id,resource_id,external_ref,state,starts_at,ends_at)
VALUES (1,7,21,'R17','confirmed','2026-11-03 10:00Z','2026-11-03 11:00Z');
SELECT expect_failure('null state', $$UPDATE reservations SET state=NULL$$,'23502');
SELECT expect_failure('bad state', $$UPDATE reservations SET state='lost'$$,'23514');
SELECT expect_failure('equal endpoints', $$UPDATE reservations SET ends_at=starts_at$$,'23514');
SELECT expect_failure('reverse endpoints', $$UPDATE reservations SET ends_at=starts_at-interval '1 hour'$$,'23514');
SELECT expect_failure('null bound', $$UPDATE reservations SET starts_at=NULL$$,'23502');
SELECT expect_failure('infinite bound', $$UPDATE reservations SET ends_at='infinity'$$,'23514');
SELECT expect_failure('cross tenant resource', $$UPDATE reservations SET resource_id=29$$,'23503');
SELECT expect_failure('missing customer', $$UPDATE reservations SET customer_id=99$$,'23503');
SELECT expect_failure('parent key update', $$UPDATE resources SET resource_id=23 WHERE tenant_id=1 AND resource_id=21$$,'23001');
SELECT expect_failure('parent delete', $$DELETE FROM customers WHERE tenant_id=1 AND customer_id=7$$,'23001');
SELECT expect_failure('new row ID still duplicates fact', $$INSERT INTO reservations (tenant_id,customer_id,resource_id,external_ref,starts_at,ends_at) VALUES(1,7,21,'R17','2026-11-04 10:00Z','2026-11-04 11:00Z')$$,'23505');
INSERT INTO reservations (tenant_id,customer_id,resource_id,external_ref,starts_at,ends_at)
VALUES (2,8,29,'R17','2026-11-03 10:00Z','2026-11-03 11:00Z');
DO $$ BEGIN IF (SELECT state FROM reservations WHERE tenant_id=2) <> 'draft' THEN RAISE EXCEPTION 'default'; END IF; END $$;
CREATE TABLE nullable_ref(tenant_id integer, external_ref text, UNIQUE(tenant_id,external_ref));
INSERT INTO nullable_ref VALUES(1,NULL),(1,NULL);
CREATE TABLE one_missing_ref(tenant_id integer, external_ref text, UNIQUE NULLS NOT DISTINCT(tenant_id,external_ref));
INSERT INTO one_missing_ref VALUES(1,NULL);
SELECT expect_failure('nulls not distinct', $$INSERT INTO one_missing_ref VALUES(1,NULL)$$,'23505');
CREATE TABLE optional_simple(t integer, r integer, FOREIGN KEY(t,r) REFERENCES resources);
CREATE TABLE optional_full(t integer, r integer, FOREIGN KEY(t,r) REFERENCES resources MATCH FULL);
INSERT INTO optional_simple VALUES(1,NULL);
INSERT INTO optional_full VALUES(NULL,NULL),(1,21);
SELECT expect_failure('match full partial null', $$INSERT INTO optional_full VALUES(1,NULL)$$,'23503');
\ir current.sql
INSERT INTO reservations (tenant_id,customer_id,resource_id,external_ref,state,starts_at,ends_at)
VALUES (1,7,21,'R17','cancelled','2026-11-03 12:00Z','2026-11-03 13:00Z');
SELECT expect_failure('reactivate duplicate', $$UPDATE reservations SET state='confirmed' WHERE state='cancelled'$$,'23505');
SELECT expect_failure('current null reference', $$UPDATE reservations SET external_ref=NULL WHERE tenant_id=1$$,'23502');
SELECT expect_failure('partial index as FK target', $$CREATE TABLE ref_target_test(t integer, r text, FOREIGN KEY(t,r) REFERENCES reservations(tenant_id,external_ref))$$,'42830');
BEGIN;
UPDATE reservations SET state='cancelled' WHERE tenant_id=1 AND state='confirmed';
INSERT INTO reservations(tenant_id,customer_id,resource_id,external_ref,state,starts_at,ends_at)
VALUES(1,7,21,'R17','confirmed','2026-11-03 10:00Z','2026-11-03 11:00Z');
ROLLBACK;
\ir overlap.sql
INSERT INTO reservations(tenant_id,customer_id,resource_id,external_ref,state,starts_at,ends_at)
VALUES(1,7,21,'adjacent','confirmed','2026-11-03 11:00Z','2026-11-03 12:00Z'),
      (1,7,22,'other','confirmed','2026-11-03 10:30Z','2026-11-03 11:30Z'),
      (1,7,21,'candidate','draft','2026-11-03 10:30Z','2026-11-03 11:30Z');
SELECT expect_failure('confirmation overlaps', $$UPDATE reservations SET state='confirmed' WHERE external_ref='candidate'$$,'23P01');
SELECT expect_failure('resource change overlaps', $$UPDATE reservations SET resource_id=21 WHERE external_ref='other'$$,'23P01');
SELECT expect_failure('bound change overlaps', $$UPDATE reservations SET starts_at='2026-11-03 10:59Z' WHERE external_ref='adjacent'$$,'23P01');
\ir lead.sql
BEGIN;
INSERT INTO lead_reservations VALUES(1,17,7);
INSERT INTO participants VALUES(1,17,7);
SET CONSTRAINTS reservation_lead IMMEDIATE;
COMMIT;
BEGIN;
INSERT INTO lead_reservations VALUES(1,18,8);
SELECT expect_failure('missing lead when checked', $$SET CONSTRAINTS reservation_lead IMMEDIATE$$,'23503');
ROLLBACK;
CREATE TABLE cascade_customers(id integer PRIMARY KEY);
CREATE TABLE cascade_reservations(id integer PRIMARY KEY, customer_id integer REFERENCES cascade_customers ON DELETE CASCADE);
CREATE TABLE cascade_notes(id integer PRIMARY KEY, reservation_id integer REFERENCES cascade_reservations ON DELETE CASCADE);
INSERT INTO cascade_customers VALUES(7);
INSERT INTO cascade_reservations VALUES(17,7),(18,7);
INSERT INTO cascade_notes VALUES(1,17),(2,18);
DELETE FROM cascade_customers WHERE id=7;
DO $$ BEGIN IF EXISTS(SELECT FROM cascade_notes) OR EXISTS(SELECT FROM cascade_reservations) THEN RAISE EXCEPTION 'cascade'; END IF; END $$;
CREATE TABLE no_action_parent(id integer PRIMARY KEY);
CREATE TABLE no_action_child(id integer REFERENCES no_action_parent DEFERRABLE INITIALLY DEFERRED);
INSERT INTO no_action_parent VALUES(1);
INSERT INTO no_action_child VALUES(1);
BEGIN;
DELETE FROM no_action_parent;
INSERT INTO no_action_parent VALUES(1);
COMMIT;
SELECT 'all stored-state checks passed' AS result;
