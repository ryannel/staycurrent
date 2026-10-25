-- Backup, restore and reconciliation: database-side teaching fixture.
-- Use a disposable PostgreSQL session. All tables and functions are temporary.
-- This DOES NOT restore a backup, test a backup chain, or contact a provider.
-- The starting state models the already restored cut before the price mistake.
-- A single controlled reconciler runs while ordinary mutation/dispatch is stopped.
-- Its provider_evidence row is an assumed external input, not a provider lookup.

CREATE TEMP TABLE customers (
  customer_id integer PRIMARY KEY, name text NOT NULL
);
CREATE TEMP TABLE products (
  product_id text PRIMARY KEY, name text NOT NULL,
  price numeric(8,2) NOT NULL CHECK (price >= 0),
  stock integer NOT NULL CHECK (stock >= 0)
);
CREATE TEMP TABLE orders (
  order_id integer PRIMARY KEY,
  customer_id integer NOT NULL REFERENCES customers,
  placed_at timestamptz NOT NULL,
  status text NOT NULL CHECK (status IN ('pending','paid','cancelled'))
);
CREATE TEMP TABLE order_items (
  order_id integer REFERENCES orders, line_no integer,
  product_id text NOT NULL REFERENCES products,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric(8,2) NOT NULL,
  PRIMARY KEY(order_id,line_no)
);
CREATE TEMP TABLE payments (
  payment_id integer PRIMARY KEY,
  order_id integer NOT NULL REFERENCES orders,
  amount numeric(8,2) NOT NULL CHECK (amount > 0), method text NOT NULL
);
INSERT INTO customers VALUES
  (1,'Mina Shah'),(2,'Tariq Aziz'),(3,'Edda Berg');
INSERT INTO products VALUES
  ('P3','Green tea, 50 g',4.50,10),('P7','Blue mug',20.00,0),('P9','Teapot',35.00,4);
INSERT INTO orders VALUES
  (101,1,'2026-10-12 09:30+00','paid'),
  (102,2,'2026-10-14 16:05+00','paid'),
  (103,1,'2026-10-20 10:15+00','pending');
INSERT INTO order_items VALUES
  (101,1,'P3',1,4.50),(101,2,'P9',1,35.00),
  (102,1,'P7',2,20.00),(103,1,'P7',1,20.00),(103,2,'P3',2,4.50);
INSERT INTO payments VALUES
  (501,101,30.00,'card'),(502,101,9.50,'gift card'),(503,102,40.00,'card');

-- Retained mapping + known provider result supplied by the recovery process.
-- No currency, provider payment ID, commit time or native log position is invented.
CREATE TEMP TABLE provider_evidence (
  operation_id text PRIMARY KEY,
  order_id integer NOT NULL, payment_id integer NOT NULL,
  amount numeric(8,2) NOT NULL, method text NOT NULL,
  outcome text NOT NULL CHECK (outcome IN ('accepted','unresolved'))
);
INSERT INTO provider_evidence VALUES
  ('order-103-part-payment-1',103,504,10.00,'card','accepted');
CREATE TEMP TABLE recovered_operations (
  operation_id text PRIMARY KEY,
  order_id integer NOT NULL REFERENCES orders,
  payment_id integer NOT NULL UNIQUE REFERENCES payments,
  amount numeric(8,2) NOT NULL, method text NOT NULL
);

-- One statement calling this function is one atomic database operation.
-- This is a bounded, sequential fixture, not a production permissions/concurrency API.
CREATE FUNCTION pg_temp.reconcile_payment(
  p_operation text, p_order integer, p_payment integer,
  p_amount numeric, p_method text
) RETURNS text LANGUAGE plpgsql AS $$
DECLARE
  evidence provider_evidence%ROWTYPE;
  recorded recovered_operations%ROWTYPE;
  paid_row payments%ROWTYPE;
  current_status text;
  agreed_total numeric;
  already_paid numeric;
BEGIN
  SELECT * INTO evidence FROM provider_evidence WHERE operation_id = p_operation;
  IF NOT FOUND OR evidence.outcome <> 'accepted' THEN
    RAISE EXCEPTION 'Provider outcome unresolved';
  END IF;
  IF ROW(evidence.order_id,evidence.payment_id,evidence.amount,evidence.method)
     IS DISTINCT FROM ROW(p_order,p_payment,p_amount,p_method) THEN
    RAISE EXCEPTION 'Operation meaning disagrees with evidence';
  END IF;

  SELECT status INTO current_status FROM orders WHERE order_id = p_order FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Order is absent'; END IF;

  SELECT * INTO recorded FROM recovered_operations WHERE operation_id = p_operation;
  IF FOUND THEN
    IF ROW(recorded.order_id,recorded.payment_id,recorded.amount,recorded.method)
       IS DISTINCT FROM ROW(p_order,p_payment,p_amount,p_method) THEN
      RAISE EXCEPTION 'Recorded mapping disagrees';
    END IF;
    SELECT * INTO paid_row FROM payments WHERE payment_id = recorded.payment_id;
    IF NOT FOUND OR ROW(paid_row.order_id,paid_row.amount,paid_row.method)
       IS DISTINCT FROM ROW(p_order,p_amount,p_method) THEN
      RAISE EXCEPTION 'Recorded payment disagrees';
    END IF;
    RETURN 'verified existing payment';
  END IF;

  IF EXISTS (SELECT 1 FROM payments WHERE payment_id = p_payment) THEN
    RAISE EXCEPTION 'Payment exists without this operation mapping; investigate';
  END IF;
  IF current_status <> 'pending' THEN
    RAISE EXCEPTION 'Order is not pending; investigate';
  END IF;
  SELECT sum(quantity * unit_price) INTO agreed_total FROM order_items WHERE order_id = p_order;
  SELECT coalesce(sum(amount),0) INTO already_paid FROM payments WHERE order_id = p_order;
  IF agreed_total IS NULL OR p_amount <= 0 OR already_paid + p_amount > agreed_total THEN
    RAISE EXCEPTION 'Payment would violate the recovered agreement';
  END IF;
  INSERT INTO payments VALUES (p_payment,p_order,p_amount,p_method);
  INSERT INTO recovered_operations VALUES (p_operation,p_order,p_payment,p_amount,p_method);
  RETURN 'recorded known provider payment';
END;
$$;

-- Demonstration. No new provider request is made by either call.
SELECT pg_temp.reconcile_payment('order-103-part-payment-1',103,504,10.00,'card');
-- recorded known provider payment
SELECT pg_temp.reconcile_payment('order-103-part-payment-1',103,504,10.00,'card');
-- verified existing payment
SELECT
  (SELECT price FROM products WHERE product_id = 'P7') AS p7_price,
  o.status,
  (SELECT sum(quantity * unit_price) FROM order_items WHERE order_id = o.order_id) AS line_total,
  (SELECT coalesce(sum(amount),0)::numeric(8,2) FROM payments WHERE order_id = o.order_id) AS paid
FROM orders o WHERE o.order_id = 103;
-- 20.00 | pending | 29.00 | 10.00
SELECT payment_id,order_id,amount,method FROM payments WHERE payment_id = 504;
-- 504 | 103 | 10.00 | card
SELECT product_id,stock FROM products ORDER BY product_id;
-- P3 10; P7 0; P9 4
