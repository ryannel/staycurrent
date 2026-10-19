\set ON_ERROR_STOP on
\pset pager off
SELECT version(), current_database(), current_user;
SHOW TimeZone;
SHOW default_transaction_isolation;
\ir ../a01/schema.sql
\ir ../a01/fixture.sql
\ir extension.sql
INSERT INTO service_categories VALUES (1,'C1','Equipment'),(1,'C2','Refreshments');
INSERT INTO services VALUES (1,'KIT','Kit','C1'),(1,'TEA','Tea','C2'),(1,'MAP','Printed map','C1');
INSERT INTO booked_services VALUES
 (1,11,'KIT',2,3,'active'),(1,11,'TEA',1,4,'active'),(1,12,'KIT',1,3,'active');

CREATE TABLE original_mixed AS
 SELECT b.tenant_id,b.booking_id,b.customer_id,b.session_id,b.status AS booking_status,
        l.service_id,s.service_name,s.category_id,c.category_label,l.quantity,
        l.agreed_unit_fee_eur,l.status AS line_status
 FROM bookings b JOIN booked_services l USING(tenant_id,booking_id)
 JOIN services s USING(tenant_id,service_id)
 JOIN service_categories c USING(tenant_id,category_id);
CREATE VIEW reconstructed AS
 SELECT b.tenant_id,b.booking_id,b.customer_id,b.session_id,b.status AS booking_status,
        l.service_id,s.service_name,s.category_id,c.category_label,l.quantity,
        l.agreed_unit_fee_eur,l.status AS line_status
 FROM bookings b JOIN booked_services l USING(tenant_id,booking_id)
 JOIN services s USING(tenant_id,service_id)
 JOIN service_categories c USING(tenant_id,category_id);
SELECT 'round_trip_difference' AS check,
 count(*) AS expected_zero FROM (
 (SELECT * FROM original_mixed EXCEPT SELECT * FROM reconstructed)
 UNION ALL
 (SELECT * FROM reconstructed EXCEPT SELECT * FROM original_mixed)) difference;

-- Figure 2's unsafe projection: both fixture lines have distinct quantities.
WITH original(tenant,booking,service,quantity) AS (VALUES(1,11,'KIT',2),(1,12,'TEA',1)),
 left_side AS (SELECT DISTINCT tenant,booking,quantity FROM original),
 right_side AS (SELECT DISTINCT tenant,service FROM original),
 reconstructed AS (SELECT tenant,booking,service,quantity FROM left_side JOIN right_side USING(tenant))
SELECT 'unsafe_split_invented' AS check,count(*) AS expected_two FROM
 (SELECT * FROM reconstructed EXCEPT SELECT * FROM original) invented;

UPDATE service_categories SET category_label='Equipment and supplies' WHERE tenant_id=1 AND category_id='C1';
SELECT service_id,category_label FROM reconstructed WHERE service_id='KIT' ORDER BY booking_id;
DELETE FROM booked_services WHERE tenant_id=1 AND service_id='KIT';
SELECT 'KIT_survives_last_line_deletion' AS check,count(*) AS expected_one FROM services WHERE service_id='KIT';
SELECT 'MAP_unbooked_service' AS check,count(*) AS expected_one FROM services s
 WHERE service_id='MAP' AND NOT EXISTS(SELECT FROM booked_services l WHERE (l.tenant_id,l.service_id)=(s.tenant_id,s.service_id));

-- Restore the subtotal fixture after the deletion check.
INSERT INTO booked_services VALUES (1,11,'KIT',2,3,'active'),(1,12,'KIT',1,3,'active');
CREATE VIEW source_totals AS
 SELECT b.tenant_id,b.booking_id,
 CASE WHEN b.status='booked' THEN coalesce(sum(l.quantity*l.agreed_unit_fee_eur)
 FILTER(WHERE l.status='active'),0) ELSE 0 END AS optional_subtotal_eur
 FROM bookings b LEFT JOIN booked_services l USING(tenant_id,booking_id)
 GROUP BY b.tenant_id,b.booking_id,b.status;
SELECT 'initial_source_totals' AS check,* FROM source_totals ORDER BY booking_id;

-- The BCNF split accepts a state violating booking+service -> adviser.
CREATE TABLE adviser_service (
 tenant_id integer NOT NULL,adviser_id text NOT NULL,service_id text NOT NULL,
 PRIMARY KEY(tenant_id,adviser_id),UNIQUE(tenant_id,adviser_id,service_id),
 FOREIGN KEY(tenant_id,service_id) REFERENCES services);
INSERT INTO adviser_service VALUES(1,'A5','KIT'),(1,'A6','KIT'),(1,'A7','TEA');
CREATE TABLE booking_adviser (
 tenant_id integer NOT NULL,booking_id integer NOT NULL,adviser_id text NOT NULL,
 PRIMARY KEY(tenant_id,booking_id,adviser_id),
 FOREIGN KEY(tenant_id,booking_id) REFERENCES bookings,
 FOREIGN KEY(tenant_id,adviser_id) REFERENCES adviser_service);
INSERT INTO booking_adviser VALUES(1,11,'A5'),(1,11,'A7');
CREATE TEMP TABLE assignment_before AS SELECT * FROM booking_adviser JOIN adviser_service USING(tenant_id,adviser_id);
SELECT 'adviser_split_original_rows' AS check,count(*) AS expected_two FROM assignment_before;
INSERT INTO booking_adviser VALUES(1,11,'A6');
SELECT 'locally_valid_but_two_advisers' AS check,booking_id,service_id,count(*) AS expected_two
 FROM booking_adviser JOIN adviser_service USING(tenant_id,adviser_id)
 GROUP BY booking_id,service_id HAVING count(*)>1;

CREATE TABLE controlled_assignment (
 tenant_id integer NOT NULL,booking_id integer NOT NULL,service_id text NOT NULL,adviser_id text NOT NULL,
 PRIMARY KEY(tenant_id,booking_id,service_id),UNIQUE(tenant_id,booking_id,adviser_id),
 FOREIGN KEY(tenant_id,booking_id) REFERENCES bookings,
 FOREIGN KEY(tenant_id,adviser_id,service_id) REFERENCES adviser_service(tenant_id,adviser_id,service_id));
INSERT INTO controlled_assignment VALUES(1,11,'KIT','A5'),(1,11,'TEA','A7');
DO $$ BEGIN
 BEGIN
 INSERT INTO controlled_assignment VALUES(1,11,'KIT','A6');
 RAISE EXCEPTION 'second adviser unexpectedly accepted';
 EXCEPTION WHEN unique_violation THEN RAISE NOTICE 'PASS: second adviser rejected by booking/service key'; END;
 BEGIN
 UPDATE controlled_assignment SET service_id='MAP' WHERE adviser_id='A5';
 RAISE EXCEPTION 'wrong service unexpectedly accepted';
 EXCEPTION WHEN foreign_key_violation THEN RAISE NOTICE 'PASS: inconsistent service copy rejected'; END;
 BEGIN
 INSERT INTO booked_services VALUES(2,11,'KIT',1,3,'active');
 RAISE EXCEPTION 'tenant crossing unexpectedly accepted';
 EXCEPTION WHEN foreign_key_violation THEN RAISE NOTICE 'PASS: tenant crossing rejected'; END;
END $$;

-- Independent and correlated sets use exactly Figure 4's pairs.
CREATE TABLE venues(tenant_id integer,venue_id text,PRIMARY KEY(tenant_id,venue_id));
INSERT INTO venues VALUES(1,'V1');
CREATE TABLE venue_facility(tenant_id integer,venue_id text,facility text,PRIMARY KEY(tenant_id,venue_id,facility),FOREIGN KEY(tenant_id,venue_id) REFERENCES venues);
CREATE TABLE venue_language(tenant_id integer,venue_id text,language text,PRIMARY KEY(tenant_id,venue_id,language),FOREIGN KEY(tenant_id,venue_id) REFERENCES venues);
INSERT INTO venue_facility VALUES(1,'V1','Studio'),(1,'V1','Kitchen');
INSERT INTO venue_language VALUES(1,'V1','English'),(1,'V1','French');
SELECT 'independent_pairs' AS check,count(*) AS expected_four FROM venue_facility JOIN venue_language USING(tenant_id,venue_id);
WITH promised(facility,language) AS (VALUES('Studio','English'),('Kitchen','French')),
 joined AS (SELECT facility,language FROM venue_facility JOIN venue_language USING(tenant_id,venue_id))
SELECT 'correlated_false_pairs' AS check,count(*) AS expected_two FROM
 (SELECT * FROM joined EXCEPT SELECT * FROM promised) extras;
DELETE FROM venue_language;
SELECT 'empty_languages_facilities_retained' AS check,count(*) AS expected_two FROM venue_facility;
SELECT 'empty_language_join' AS check,count(*) AS expected_zero FROM venue_facility JOIN venue_language USING(tenant_id,venue_id);

CREATE TABLE cached_totals AS SELECT * FROM source_totals;
-- Sequential reproduction of stale-read replacements, NOT a concurrent run.
INSERT INTO services VALUES(1,'AUDIO','Audio guide','C1');
BEGIN;
INSERT INTO booked_services VALUES(1,11,'MAP',1,3,'active');
UPDATE cached_totals SET optional_subtotal_eur=13 WHERE booking_id=11;
COMMIT;
BEGIN;
INSERT INTO booked_services VALUES(1,11,'AUDIO',1,5,'active');
UPDATE cached_totals SET optional_subtotal_eur=15 WHERE booking_id=11;
COMMIT;
SELECT 'stale_replacements' AS check,s.optional_subtotal_eur AS source_eighteen,
 c.optional_subtotal_eur AS stored_fifteen FROM source_totals s JOIN cached_totals c USING(tenant_id,booking_id) WHERE booking_id=11;
UPDATE cached_totals c SET optional_subtotal_eur=s.optional_subtotal_eur FROM source_totals s WHERE(s.tenant_id,s.booking_id)=(c.tenant_id,c.booking_id);
UPDATE booked_services SET status='cancelled' WHERE booking_id=11 AND service_id='MAP';
SELECT 'cancel_MAP' AS check,optional_subtotal_eur AS expected_fifteen FROM source_totals WHERE booking_id=11;
DELETE FROM booked_services WHERE booking_id=11 AND service_id='TEA';
SELECT 'delete_TEA' AS check,optional_subtotal_eur AS expected_eleven FROM source_totals WHERE booking_id=11;
UPDATE bookings SET status='cancelled' WHERE booking_id=11;
SELECT 'cancel_booking' AS check,optional_subtotal_eur AS expected_zero FROM source_totals WHERE booking_id=11;
UPDATE bookings SET status='booked' WHERE booking_id=11;
SELECT 'reactivate_booking' AS check,optional_subtotal_eur AS expected_eleven FROM source_totals WHERE booking_id=11;

CREATE MATERIALIZED VIEW materialised_totals AS SELECT * FROM source_totals;
UPDATE booked_services SET quantity=3 WHERE booking_id=11 AND service_id='KIT';
SELECT 'materialised_result_waits_for_refresh' AS check,s.optional_subtotal_eur AS source_fourteen,m.optional_subtotal_eur AS stored_eleven
 FROM source_totals s JOIN materialised_totals m USING(tenant_id,booking_id) WHERE booking_id=11;
REFRESH MATERIALIZED VIEW materialised_totals;
SELECT 'materialised_after_refresh' AS check,optional_subtotal_eur AS expected_fourteen FROM materialised_totals WHERE booking_id=11;
