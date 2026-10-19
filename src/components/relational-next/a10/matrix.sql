\set ON_ERROR_STOP on
SELECT expect_failure('current reference edit', $$UPDATE reservations SET external_ref='R17' WHERE tenant_id=1 AND external_ref='candidate'$$,'23505');
SELECT expect_failure('new overlapping confirmed row', $$INSERT INTO reservations(tenant_id,customer_id,resource_id,external_ref,state,starts_at,ends_at) VALUES(1,7,21,'overlap-new','confirmed','2026-11-03 10:30Z','2026-11-03 11:30Z')$$,'23P01');
SELECT expect_failure('cross tenant resource insert', $$INSERT INTO reservations(tenant_id,customer_id,resource_id,external_ref,starts_at,ends_at) VALUES(1,7,29,'wrong-tenant','2026-11-04 10:00Z','2026-11-04 11:00Z')$$,'23503');
BEGIN;
UPDATE reservations SET state='cancelled' WHERE tenant_id=1 AND state='confirmed';
UPDATE reservations SET state='confirmed' WHERE tenant_id=1 AND external_ref='candidate';
ROLLBACK;
CREATE TABLE temporal_example (
  resource_id integer,
  occupied tstzrange,
  UNIQUE(resource_id, occupied WITHOUT OVERLAPS)
);
INSERT INTO temporal_example VALUES(21,'[2026-11-03 10:00Z,2026-11-03 11:00Z)'),(21,'[2026-11-03 11:00Z,2026-11-03 12:00Z)');
SELECT expect_failure('temporal overlap', $$INSERT INTO temporal_example VALUES(21,'[2026-11-03 10:30Z,2026-11-03 11:30Z)')$$,'23P01');
SELECT 'extra insert, edit, release and temporal-key checks passed' AS result;
