SELECT version();
SHOW timezone;
SELECT datcollate, datctype FROM pg_database WHERE datname=current_database();
CREATE FUNCTION pg_temp.expect_error(label text, command text, expected text)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  BEGIN
    EXECUTE command;
  EXCEPTION WHEN OTHERS THEN
    IF SQLSTATE = expected THEN
      RAISE NOTICE 'PASS %: %', label, SQLSTATE;
      RETURN;
    END IF;
    RAISE;
  END;
  RAISE EXCEPTION 'FAIL %: unexpectedly accepted', label;
END;
$$;

SELECT pg_temp.expect_error('duplicate booking',
  $$INSERT INTO bookings VALUES (1,99,7,21,'booked',20)$$, '23505');
SELECT pg_temp.expect_error('duplicate membership code within tenant',
  $$INSERT INTO customers VALUES (1,99,'M007','Duplicate',NULL)$$, '23505');
SELECT pg_temp.expect_error('missing customer',
  $$INSERT INTO bookings VALUES (1,99,700,21,'booked',20)$$, '23503');
SELECT pg_temp.expect_error('wrong-tenant customer',
  $$INSERT INTO bookings VALUES (1,99,9,21,'booked',20)$$, '23503');
SELECT pg_temp.expect_error('wrong-tenant session',
  $$INSERT INTO bookings VALUES (2,99,9,21,'booked',20)$$, '23503');
SELECT pg_temp.expect_error('required customer',
  $$INSERT INTO bookings VALUES (1,99,NULL,21,'booked',20)$$, '23502');
SELECT pg_temp.expect_error('zero capacity',
  $$UPDATE sessions SET capacity=0 WHERE tenant_id=1 AND session_id=21$$, '23514');
SELECT pg_temp.expect_error('missing capacity',
  $$UPDATE sessions SET capacity=NULL WHERE tenant_id=1 AND session_id=21$$, '23502');
SELECT pg_temp.expect_error('negative fee',
  $$UPDATE sessions SET fee_eur=-1 WHERE tenant_id=1 AND session_id=21$$, '23514');
SELECT pg_temp.expect_error('NaN fee',
  $$UPDATE sessions SET fee_eur='NaN' WHERE tenant_id=1 AND session_id=21$$, '23514');
SELECT pg_temp.expect_error('infinite start',
  $$UPDATE sessions SET starts_at='infinity' WHERE tenant_id=1 AND session_id=21$$, '23514');
SELECT pg_temp.expect_error('unknown status',
  $$UPDATE bookings SET status='waiting' WHERE tenant_id=1 AND booking_id=11$$, '23514');
SELECT pg_temp.expect_error('merge collision even with cancelled booking',
  $$UPDATE bookings SET customer_id=7 WHERE tenant_id=1 AND customer_id=8$$, '23505');
SELECT pg_temp.expect_error('referenced customer deletion',
  $$DELETE FROM customers WHERE tenant_id=1 AND customer_id=7$$, '23001');
SELECT pg_temp.expect_error('referenced session deletion',
  $$DELETE FROM sessions WHERE tenant_id=1 AND session_id=21$$, '23001');

DO $$
DECLARE result_counts bigint[];
BEGIN
  SELECT array_agg(n ORDER BY session_id) INTO result_counts FROM (
    SELECT s.session_id,count(b.booking_id) AS n
    FROM sessions s LEFT JOIN bookings b
    ON b.tenant_id=s.tenant_id AND b.session_id=s.session_id AND b.status='booked'
    WHERE s.tenant_id=1 GROUP BY s.session_id
  ) q;
  ASSERT result_counts = ARRAY[1,1,0]::bigint[], 'baseline counts';
  ASSERT (SELECT count(*)=1 FROM bookings b JOIN customers c
    ON c.tenant_id=b.tenant_id AND c.customer_id=b.customer_id
    WHERE b.tenant_id=1 AND b.session_id=21 AND b.status='booked'), 'roster size';
  RAISE NOTICE 'PASS roster and empty-session counts';
END;
$$;

BEGIN;
INSERT INTO customers VALUES (1,10,'M010','No bookings yet',NULL);
UPDATE bookings SET status='booked' WHERE tenant_id=1 AND booking_id=13;
INSERT INTO bookings VALUES (1,14,10,21,'booked',20);
DO $$ BEGIN
  ASSERT (SELECT count(*)=3 FROM bookings WHERE tenant_id=1 AND session_id=21 AND status='booked'), 'capacity boundary';
  ASSERT (SELECT capacity=2 FROM sessions WHERE tenant_id=1 AND session_id=21);
  RAISE NOTICE 'PASS capacity excess accepted: schema does not enforce it';
END; $$;
ROLLBACK;

SELECT 20.005::numeric(8,2) AS assignment_rounds_to_20_01;
UPDATE customers SET display_name='Mina Patel' WHERE tenant_id=1 AND customer_id=7;
UPDATE sessions SET fee_eur=22.00 WHERE tenant_id=1 AND session_id=21;
UPDATE bookings SET status='cancelled' WHERE tenant_id=1 AND booking_id=11;
DO $$ BEGIN
  ASSERT (SELECT count(*)=0 FROM bookings WHERE tenant_id=1 AND session_id=21 AND status='booked');
  ASSERT (SELECT c.display_name='Mina Patel' AND b.status='cancelled' AND b.agreed_fee_eur=20 AND s.fee_eur=22
    FROM bookings b JOIN customers c ON (c.tenant_id,c.customer_id)=(b.tenant_id,b.customer_id)
    JOIN sessions s ON (s.tenant_id,s.session_id)=(b.tenant_id,b.session_id)
    WHERE b.tenant_id=1 AND b.booking_id=11);
  RAISE NOTICE 'PASS correction, current offer change, retained agreement and cancellation';
END; $$;
SELECT b.booking_id,c.display_name,b.status,b.agreed_fee_eur,s.fee_eur
FROM bookings b JOIN customers c ON (c.tenant_id,c.customer_id)=(b.tenant_id,b.customer_id)
JOIN sessions s ON (s.tenant_id,s.session_id)=(b.tenant_id,b.session_id)
WHERE b.tenant_id=1 AND b.booking_id=11;
