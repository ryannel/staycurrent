CREATE TABLE tenants (
  tenant_id integer PRIMARY KEY
);

CREATE TABLE customers (
  tenant_id integer NOT NULL REFERENCES tenants,
  customer_id integer NOT NULL,
  member_code text NOT NULL,
  display_name text NOT NULL,
  phone text,
  PRIMARY KEY (tenant_id, customer_id),
  UNIQUE (tenant_id, member_code)
);

CREATE TABLE sessions (
  tenant_id integer NOT NULL REFERENCES tenants,
  session_id integer NOT NULL,
  title text NOT NULL,
  starts_at timestamptz NOT NULL CHECK (isfinite(starts_at)),
  capacity integer NOT NULL CHECK (capacity > 0),
  fee_eur numeric(8,2) NOT NULL
    CHECK (fee_eur >= 0 AND fee_eur < 1000000),
  PRIMARY KEY (tenant_id, session_id)
);

CREATE TABLE bookings (
  tenant_id integer NOT NULL,
  booking_id integer NOT NULL,
  customer_id integer NOT NULL,
  session_id integer NOT NULL,
  status text NOT NULL CHECK (status IN ('booked', 'cancelled')),
  agreed_fee_eur numeric(8,2) NOT NULL
    CHECK (agreed_fee_eur >= 0 AND agreed_fee_eur < 1000000),
  PRIMARY KEY (tenant_id, booking_id),
  UNIQUE (tenant_id, customer_id, session_id),
  FOREIGN KEY (tenant_id, customer_id)
    REFERENCES customers (tenant_id, customer_id) ON DELETE RESTRICT,
  FOREIGN KEY (tenant_id, session_id)
    REFERENCES sessions (tenant_id, session_id) ON DELETE RESTRICT
);
