\set ON_ERROR_STOP on
\pset pager off
SELECT version();
SELECT current_database(), current_user, inet_server_addr(), inet_server_port();
SHOW server_version_num;
SHOW TimeZone;
SELECT datcollate, datctype, datlocprovider FROM pg_database WHERE datname=current_database();
SHOW fsync;
SHOW synchronous_commit;
SHOW full_page_writes;
SHOW default_transaction_isolation;
SET TIME ZONE 'UTC';
\ir ../a01/schema.sql
\ir ../a01/fixture.sql
\ir rates.sql
\ir assertions.sql

SELECT d, r.version_no, r.fee_eur
FROM (VALUES (date '2026-10-31'), (date '2026-11-09'),
 (date '2026-11-10'), (date '2026-11-11')) AS dates(d)
LEFT JOIN customer_rates r ON r.tenant_id=1 AND r.customer_id=7
 AND r.effective_from <= d AND (r.effective_to IS NULL OR d < r.effective_to)
ORDER BY d;

SELECT cutoff, fee_eur FROM
 (VALUES (timestamptz '2026-11-11 12:00+00'),
         (timestamptz '2026-11-12 10:00+00')) AS cutoffs(cutoff)
JOIN rate_assertions ON tenant_id=1 AND customer_id=7
 AND daterange(effective_from,effective_to,'[)') @> date '2026-11-11'
 AND tstzrange(recorded_from,recorded_to,'[)') @> cutoff
ORDER BY cutoff;

SELECT version_no, fee_eur FROM customer_rates
WHERE tenant_id=1 AND customer_id=7
 AND daterange(effective_from,effective_to,'[)') &&
     daterange('2026-11-09','2026-11-12','[)')
ORDER BY version_no;

CREATE FUNCTION expect_rejection(label text, command text, expected text)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  BEGIN
    EXECUTE command;
  EXCEPTION WHEN OTHERS THEN
    IF SQLSTATE <> expected THEN RAISE; END IF;
    RAISE NOTICE '%: rejected with %', label, SQLSTATE;
    RETURN;
  END;
  RAISE EXCEPTION '%: unexpected acceptance', label;
END $$;

SELECT expect_rejection('overlap',
 $$INSERT INTO customer_rates VALUES (1,7,3,25,'2026-11-09','2026-11-12')$$,'23P01');
SELECT expect_rejection('empty period',
 $$INSERT INTO customer_rates VALUES (1,7,3,25,'2026-12-01','2026-12-01')$$,'23514');
SELECT expect_rejection('reversed period',
 $$INSERT INTO customer_rates VALUES (1,7,3,25,'2026-12-02','2026-12-01')$$,'23514');
SELECT expect_rejection('infinite start',
 $$INSERT INTO customer_rates VALUES (1,7,3,25,'infinity',NULL)$$,'23514');
SELECT expect_rejection('conflicting assertion',
 $$INSERT INTO rate_assertions VALUES (1,7,4,25,'2026-11-11',NULL,'2026-11-13',NULL)$$,'23P01');

BEGIN;
UPDATE customer_rates SET effective_from='2026-11-12' WHERE version_no=2;
SELECT 'gap accepted' AS observation, count(*) AS matches FROM customer_rates
WHERE tenant_id=1 AND customer_id=7
 AND daterange(effective_from,effective_to,'[)') @> date '2026-11-10';
ROLLBACK;

-- Give tenant 2 matching numeric identities so only complete scope rejects its version.
INSERT INTO customers VALUES (2,7,'MNEW','Other customer',NULL);
INSERT INTO sessions VALUES (2,21,'Other class','2026-11-03 18:00+00',2,20);
INSERT INTO bookings VALUES (2,21,7,21,'booked',20);
ALTER TABLE bookings ADD UNIQUE (tenant_id,booking_id,customer_id);
CREATE TABLE rate_uses (
 tenant_id integer NOT NULL, booking_id integer NOT NULL,
 customer_id integer NOT NULL, version_no integer NOT NULL,
 PRIMARY KEY (tenant_id,booking_id),
 FOREIGN KEY (tenant_id,booking_id,customer_id)
  REFERENCES bookings (tenant_id,booking_id,customer_id),
 FOREIGN KEY (tenant_id,customer_id,version_no)
  REFERENCES customer_rates (tenant_id,customer_id,version_no)
);
INSERT INTO rate_uses VALUES (1,11,7,1);
SELECT expect_rejection('missing version',
 $$INSERT INTO rate_uses VALUES (1,12,7,99)$$,'23503');
SELECT expect_rejection('cross-tenant version',
 $$INSERT INTO rate_uses VALUES (2,21,7,1)$$,'23503');
SELECT expect_rejection('wrong booking customer',
 $$INSERT INTO rate_uses VALUES (1,13,7,1)$$,'23503');
SELECT expect_rejection('referenced customer deletion',
 $$DELETE FROM customers WHERE tenant_id=1 AND customer_id=7$$,'23001');

-- Isolated lifecycle shape; the parent schema deliberately requires its code.
CREATE TEMP TABLE lifecycle_profile (
 id integer PRIMARY KEY, member_code text UNIQUE, active boolean NOT NULL
);
INSERT INTO lifecycle_profile VALUES (7,'M007',true);
UPDATE lifecycle_profile SET active=false WHERE id=7;
SELECT expect_rejection('inactive code remains reserved',
 $$INSERT INTO lifecycle_profile VALUES (8,'M007',true)$$,'23505');
SELECT count(*) AS unfiltered_profiles,
 count(*) FILTER (WHERE active) AS active_profiles FROM lifecycle_profile;
UPDATE lifecycle_profile SET member_code=NULL WHERE id=7;
INSERT INTO lifecycle_profile VALUES (8,'M007',true);
SELECT * FROM lifecycle_profile ORDER BY id;
SELECT current_timestamp = current_timestamp AS transaction_timestamp_is_stable;
