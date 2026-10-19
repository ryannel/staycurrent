-- PostgreSQL 18.6. Use an isolated schema; expected errors are documented in native output.
CREATE TABLE booking_flat (booking_id text, session_id text, room text);
INSERT INTO booking_flat VALUES ('b17','s7','North'),('b18','s7','North');
UPDATE booking_flat SET room = 'South' WHERE booking_id = 'b17';
SELECT * FROM booking_flat ORDER BY booking_id;


CREATE TABLE customers (
  tenant_id text NOT NULL,
  customer_id integer NOT NULL,
  name text NOT NULL,
  PRIMARY KEY (tenant_id, customer_id)
);
CREATE TABLE sessions (
  tenant_id text NOT NULL,
  session_id text NOT NULL,
  room text NOT NULL,
  capacity integer NOT NULL CHECK (capacity > 0),
  PRIMARY KEY (tenant_id, session_id)
);
CREATE TABLE bookings (
  tenant_id text NOT NULL,
  booking_id text NOT NULL,
  customer_id integer NOT NULL,
  session_id text NOT NULL,
  PRIMARY KEY (tenant_id, booking_id),
  UNIQUE (tenant_id, customer_id, session_id),
  FOREIGN KEY (tenant_id, customer_id)
    REFERENCES customers (tenant_id, customer_id),
  FOREIGN KEY (tenant_id, session_id)
    REFERENCES sessions (tenant_id, session_id)
);
INSERT INTO customers VALUES ('t4',42,'Ada'), ('t4',43,'Ben');
INSERT INTO sessions VALUES ('t4','s7','North',2);
INSERT INTO bookings VALUES ('t4','b17',42,'s7'), ('t4','b18',43,'s7');
UPDATE sessions SET room = 'South'
WHERE tenant_id = 't4' AND session_id = 's7';
SELECT b.booking_id, c.name, s.room
FROM bookings b
JOIN customers c USING (tenant_id, customer_id)
JOIN sessions s USING (tenant_id, session_id)
ORDER BY b.booking_id;


CREATE TABLE products (
  tenant_id text, product_id text,
  current_price numeric(10,2) NOT NULL,
  PRIMARY KEY (tenant_id, product_id)
);
CREATE TABLE orders (
  tenant_id text, order_id text, customer_id integer NOT NULL,
  PRIMARY KEY (tenant_id, order_id),
  FOREIGN KEY (tenant_id, customer_id)
    REFERENCES customers (tenant_id, customer_id)
);
CREATE TABLE order_lines (
  tenant_id text, order_id text, line_no integer,
  product_id text NOT NULL, quantity integer NOT NULL CHECK (quantity > 0),
  agreed_unit_price numeric(10,2) NOT NULL CHECK (agreed_unit_price >= 0),
  PRIMARY KEY (tenant_id, order_id, line_no),
  FOREIGN KEY (tenant_id, order_id) REFERENCES orders,
  FOREIGN KEY (tenant_id, product_id) REFERENCES products
);
INSERT INTO products VALUES ('t4','seat',20);
INSERT INTO orders VALUES ('t4','o81',42);
INSERT INTO order_lines VALUES ('t4','o81',1,'seat',2,20);
UPDATE products SET current_price = 22
WHERE tenant_id = 't4' AND product_id = 'seat';
SELECT quantity * agreed_unit_price AS agreed_total
FROM order_lines WHERE tenant_id = 't4' AND order_id = 'o81';
