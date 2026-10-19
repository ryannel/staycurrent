-- Run after the parent article's schema. Amounts are whole-cent euros.
CREATE TABLE service_categories (
  tenant_id integer NOT NULL REFERENCES tenants,
  category_id text NOT NULL,
  category_label text NOT NULL,
  PRIMARY KEY (tenant_id, category_id)
);

CREATE TABLE services (
  tenant_id integer NOT NULL,
  service_id text NOT NULL,
  service_name text NOT NULL,
  category_id text NOT NULL,
  PRIMARY KEY (tenant_id, service_id),
  FOREIGN KEY (tenant_id, category_id)
    REFERENCES service_categories (tenant_id, category_id)
);

CREATE TABLE booked_services (
  tenant_id integer NOT NULL,
  booking_id integer NOT NULL,
  service_id text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  agreed_unit_fee_eur numeric(8,2) NOT NULL
    CHECK (agreed_unit_fee_eur >= 0 AND agreed_unit_fee_eur < 1000000),
  status text NOT NULL CHECK (status IN ('active', 'cancelled')),
  PRIMARY KEY (tenant_id, booking_id, service_id),
  FOREIGN KEY (tenant_id, booking_id)
    REFERENCES bookings (tenant_id, booking_id),
  FOREIGN KEY (tenant_id, service_id)
    REFERENCES services (tenant_id, service_id)
);
