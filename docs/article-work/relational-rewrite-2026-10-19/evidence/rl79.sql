-- PostgreSQL 18.6. Use an isolated schema; expected errors are documented in native output.
CREATE TABLE customers (
  tenant_id text NOT NULL, customer_id integer NOT NULL,
  name text NOT NULL,
  PRIMARY KEY (tenant_id, customer_id)
);
CREATE TABLE sessions (
  tenant_id text NOT NULL, session_id text NOT NULL,
  capacity integer NOT NULL CHECK (capacity > 0),
  PRIMARY KEY (tenant_id, session_id)
);
CREATE TABLE bookings (
  tenant_id text NOT NULL, booking_id text NOT NULL,
  customer_id integer NOT NULL, session_id text NOT NULL,
  seats integer NOT NULL CHECK (seats > 0),
  status text NOT NULL CHECK (status IN ('confirmed','cancelled')),
  PRIMARY KEY (tenant_id, booking_id),
  FOREIGN KEY (tenant_id, customer_id) REFERENCES customers,
  FOREIGN KEY (tenant_id, session_id) REFERENCES sessions
);
INSERT INTO customers VALUES ('t4',42,'Ada'), ('t5',42,'Another Ada');
INSERT INTO sessions VALUES ('t4','s7',2), ('t5','s8',2);
INSERT INTO bookings VALUES ('t4','b17',42,'s7',1,'confirmed');


INSERT INTO bookings VALUES ('t4','b18',42,'s7',0,'confirmed');
INSERT INTO bookings VALUES ('t4','b18',42,'s7',NULL,'confirmed');
INSERT INTO bookings VALUES ('t4','b17',42,'s7',1,'confirmed');


INSERT INTO bookings VALUES ('t4','b18',42,'s8',1,'confirmed');


CREATE UNIQUE INDEX one_confirmed_booking
ON bookings (tenant_id, customer_id, session_id)
WHERE status = 'confirmed';


INSERT INTO customers VALUES ('t4',43,'Ben');
INSERT INTO bookings VALUES ('t4','b19',43,'s7',2,'confirmed');
SELECT s.capacity, sum(b.seats) AS reserved
FROM sessions s JOIN bookings b USING (tenant_id, session_id)
WHERE s.tenant_id = 't4' AND s.session_id = 's7'
GROUP BY s.capacity;
