-- Preconditions: source history closed; ordinary target writers/dispatch excluded;
-- independent retained provider evidence establishes acceptance of this exact
-- identity, order and amount. This SQL neither queries nor charges a provider.
DO $repair$
DECLARE total numeric; paid numeric;
BEGIN
  PERFORM 1 FROM orders WHERE order_id=103 AND status='pending' FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Expected pending order 103'; END IF;
  SELECT sum(quantity*unit_price) INTO total FROM order_items WHERE order_id=103;
  IF total IS DISTINCT FROM 29.00 THEN RAISE EXCEPTION 'Agreement mismatch'; END IF;
  IF EXISTS (SELECT 1 FROM payment_operations
      WHERE operation_id='order-103-part-payment-1'
        AND (order_id,amount,method,payment_id) IS DISTINCT FROM (103,10.00,'card',504))
  THEN RAISE EXCEPTION 'Operation meaning mismatch'; END IF;
  IF EXISTS (SELECT 1 FROM payments WHERE payment_id=504
      AND (order_id,amount,method) IS DISTINCT FROM (103,10.00,'card'))
  THEN RAISE EXCEPTION 'Payment meaning mismatch'; END IF;
  IF NOT EXISTS (SELECT 1 FROM payments WHERE payment_id=504) THEN
    SELECT coalesce(sum(amount),0) INTO paid FROM payments WHERE order_id=103;
    IF paid+10.00>total THEN RAISE EXCEPTION 'Would exceed agreement'; END IF;
    INSERT INTO payments VALUES(504,103,10.00,'card');
  END IF;
  INSERT INTO payment_operations VALUES('order-103-part-payment-1',103,10.00,'card',504)
    ON CONFLICT(operation_id) DO NOTHING;
END
$repair$;
