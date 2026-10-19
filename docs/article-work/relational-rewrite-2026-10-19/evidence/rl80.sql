-- PostgreSQL 18.6. Use an isolated schema; expected errors are documented in native output.
CREATE TABLE catalogue (
  tenant_id text, product_id text, current_price numeric(10,2),
  PRIMARY KEY (tenant_id, product_id)
);
CREATE TABLE order_lines (
  tenant_id text, order_id text, line_no integer,
  product_id text NOT NULL, quantity integer NOT NULL,
  agreed_price numeric(10,2) NOT NULL,
  agreed_description text NOT NULL,
  PRIMARY KEY (tenant_id, order_id, line_no)
);
INSERT INTO catalogue VALUES ('t4','seat',20);
INSERT INTO order_lines VALUES ('t4','o81',1,'seat',2,20,'Workshop seat');
UPDATE catalogue SET current_price = 22 WHERE tenant_id = 't4';
SELECT l.order_id, l.quantity * l.agreed_price AS agreed,
       l.quantity * c.current_price AS repriced
FROM order_lines l JOIN catalogue c USING (tenant_id, product_id);


CREATE TABLE price_history (
  tenant_id text NOT NULL, product_id text NOT NULL,
  valid_from date NOT NULL, valid_to date NOT NULL,
  price numeric(10,2) NOT NULL,
  CHECK (valid_from < valid_to),
  PRIMARY KEY (tenant_id, product_id, valid_from)
);
INSERT INTO price_history VALUES
 ('t4','seat','2026-10-01','2026-10-10',20),
 ('t4','seat','2026-10-10','infinity',22);
SELECT price FROM price_history
WHERE tenant_id = 't4' AND product_id = 'seat'
  AND valid_from <= date '2026-10-10'
  AND date '2026-10-10' < valid_to;


CREATE TABLE price_beliefs (
  tenant_id text, product_id text,
  valid_from date, valid_to date,
  recorded_from date, recorded_to date,
  price numeric(10,2)
);
INSERT INTO price_beliefs VALUES
 ('t4','seat','2026-10-01','2026-10-10','2026-10-01','2026-10-15',20),
 ('t4','seat','2026-10-10','infinity','2026-10-01','2026-10-15',22),
 ('t4','seat','2026-10-01','2026-10-08','2026-10-15','infinity',20),
 ('t4','seat','2026-10-08','infinity','2026-10-15','infinity',22);
SELECT q.known_on, h.price
FROM (VALUES (date '2026-10-12'),(date '2026-10-16')) q(known_on)
JOIN price_beliefs h
  ON h.recorded_from <= q.known_on AND q.known_on < h.recorded_to
WHERE h.tenant_id = 't4' AND h.product_id = 'seat'
  AND h.valid_from <= date '2026-10-09' AND date '2026-10-09' < h.valid_to
ORDER BY q.known_on;
