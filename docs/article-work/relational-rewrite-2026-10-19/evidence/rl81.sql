-- PostgreSQL 18.6. Use an isolated schema; expected errors are documented in native output.
CREATE TABLE lines (
  tenant_id text, order_id text, line_no integer,
  description text, quantity integer, agreed_price numeric(10,2),
  PRIMARY KEY (tenant_id, order_id, line_no)
);
CREATE TABLE orders (
  tenant_id text, order_id text, customer_id integer,
  PRIMARY KEY (tenant_id, order_id)
);
CREATE TABLE customers (
  tenant_id text, customer_id integer, name text,
  PRIMARY KEY (tenant_id, customer_id)
);
INSERT INTO customers VALUES ('t4',42,'Ada'), ('t5',42,'Ben');
INSERT INTO orders VALUES ('t4','o81',42), ('t4','o82',42);
INSERT INTO lines VALUES
 ('t4','o81',1,'Workshop seat',2,20),
 ('t4','o81',2,'Workbook',1,5);
SELECT line_no, description, quantity * agreed_price AS amount
FROM lines
WHERE tenant_id = 't4' AND order_id = 'o81'
ORDER BY line_no;


SELECT l.line_no, c.name, l.quantity * l.agreed_price AS amount
FROM lines l
JOIN orders o USING (tenant_id, order_id)
JOIN customers c
  ON c.tenant_id = o.tenant_id AND c.customer_id = o.customer_id
WHERE l.tenant_id = 't4' AND l.order_id = 'o81'
ORDER BY l.line_no;


CREATE TABLE payments (
  tenant_id text, payment_id text, order_id text, amount numeric(10,2),
  PRIMARY KEY (tenant_id, payment_id)
);
INSERT INTO payments VALUES ('t4','p1','o81',20);


INSERT INTO payments VALUES ('t4','p2','o81',25);
SELECT l.line_no, p.payment_id, l.quantity * l.agreed_price AS line_amount
FROM lines l JOIN payments p USING (tenant_id, order_id)
WHERE l.tenant_id = 't4' AND l.order_id = 'o81'
ORDER BY l.line_no, p.payment_id;


WITH purchased AS (
  SELECT tenant_id, order_id, sum(quantity * agreed_price) AS total
  FROM lines GROUP BY tenant_id, order_id
), paid AS (
  SELECT tenant_id, order_id, sum(amount) AS total
  FROM payments GROUP BY tenant_id, order_id
)
SELECT o.order_id, COALESCE(l.total,0) AS purchased,
       COALESCE(p.total,0) AS paid
FROM orders o
LEFT JOIN purchased l USING (tenant_id, order_id)
LEFT JOIN paid p USING (tenant_id, order_id)
WHERE o.tenant_id = 't4'
ORDER BY o.order_id;


CREATE TABLE sessions (tenant_id text, session_id text);
CREATE TABLE bookings (tenant_id text, booking_id text, session_id text, status text);
INSERT INTO sessions VALUES ('t4','s7'), ('t4','s8');
INSERT INTO bookings VALUES ('t4','b17','s7','confirmed');
SELECT s.session_id, b.booking_id
FROM sessions s
LEFT JOIN bookings b
  ON b.tenant_id = s.tenant_id AND b.session_id = s.session_id
 AND b.status = 'confirmed'
WHERE s.tenant_id = 't4'
ORDER BY s.session_id;


SELECT o.order_id FROM orders o
WHERE o.tenant_id = 't4' AND EXISTS (
  SELECT 1 FROM payments p
  WHERE p.tenant_id = o.tenant_id AND p.order_id = o.order_id
)
ORDER BY o.order_id;
