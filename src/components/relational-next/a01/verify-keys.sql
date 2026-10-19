-- Run after schema.sql and fixture.sql, or against rel3_a01_run1.
-- This transaction restores the existing article fixture afterwards.
BEGIN;
DELETE FROM bookings;
INSERT INTO bookings VALUES (1,11,7,21,'booked',20.00);
DO $$ BEGIN
  ASSERT EXISTS (SELECT FROM bookings WHERE tenant_id=1 AND booking_id=11
    AND customer_id=7 AND session_id=21), 'original B11 accepted';
  BEGIN
    INSERT INTO bookings VALUES (1,99,7,21,'booked',20.00);
    RAISE EXCEPTION 'B99 was unexpectedly accepted';
  EXCEPTION WHEN unique_violation THEN
    RAISE NOTICE 'PASS B99: new row key, duplicate business key, rejected (23505)';
  END;
  BEGIN
    INSERT INTO bookings VALUES (1,14,9,21,'booked',20.00);
    RAISE EXCEPTION 'B14 was unexpectedly accepted';
  EXCEPTION WHEN foreign_key_violation THEN
    ASSERT EXISTS (SELECT FROM customers WHERE tenant_id=2 AND customer_id=9);
    ASSERT NOT EXISTS (SELECT FROM customers WHERE tenant_id=1 AND customer_id=9);
    RAISE NOTICE 'PASS B14: customer (2,9) exists; required (1,9) does not; rejected (23503)';
  END;
  RAISE NOTICE 'PASS original B11: accepted with unique keys and valid complete references';
END; $$;
ROLLBACK;
