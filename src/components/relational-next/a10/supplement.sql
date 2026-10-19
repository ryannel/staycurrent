\set ON_ERROR_STOP on
BEGIN;
INSERT INTO lead_reservations VALUES(1,19,7);
SELECT expect_failure('lead from another reservation', $$SET CONSTRAINTS reservation_lead IMMEDIATE$$,'23503');
ROLLBACK;
ALTER TABLE lead_reservations ALTER CONSTRAINT reservation_lead INITIALLY IMMEDIATE;
SELECT expect_failure('immediate cycle first insert', $$INSERT INTO lead_reservations VALUES(1,20,7)$$,'23503');
ALTER TABLE lead_reservations ALTER CONSTRAINT reservation_lead INITIALLY DEFERRED;
\echo Expected commit-time missing-lead rejection follows:
BEGIN;
INSERT INTO lead_reservations VALUES(1,18,8);
\set ON_ERROR_STOP off
COMMIT;
\set ON_ERROR_STOP on
DO $$ BEGIN IF EXISTS(SELECT FROM lead_reservations WHERE reservation_id=18) THEN RAISE EXCEPTION 'invalid commit survived'; END IF; END $$;
CREATE TABLE optional_referrer (
  tenant_id integer NOT NULL,
  referrer_id integer,
  FOREIGN KEY(tenant_id,referrer_id) REFERENCES customers
    ON DELETE SET NULL (referrer_id)
);
INSERT INTO customers VALUES(1,99);
INSERT INTO optional_referrer VALUES(1,99);
DELETE FROM customers WHERE tenant_id=1 AND customer_id=99;
DO $$ BEGIN IF NOT EXISTS(SELECT FROM optional_referrer WHERE tenant_id=1 AND referrer_id IS NULL) THEN RAISE EXCEPTION 'set null'; END IF; END $$;
SELECT 'supplemental timing and nulling checks passed' AS result;
