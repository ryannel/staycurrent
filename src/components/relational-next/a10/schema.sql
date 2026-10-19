CREATE TABLE tenants (tenant_id integer PRIMARY KEY);
CREATE TABLE customers (
  tenant_id integer NOT NULL REFERENCES tenants,
  customer_id integer NOT NULL,
  PRIMARY KEY (tenant_id, customer_id)
);
CREATE TABLE resources (
  tenant_id integer NOT NULL REFERENCES tenants,
  resource_id integer NOT NULL,
  PRIMARY KEY (tenant_id, resource_id)
);
CREATE TABLE reservations (
  reservation_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tenant_id integer NOT NULL REFERENCES tenants,
  customer_id integer NOT NULL,
  resource_id integer NOT NULL,
  external_ref text NOT NULL CHECK (external_ref <> ''),
  state text NOT NULL DEFAULT 'draft'
    CHECK (state IN ('draft', 'confirmed', 'cancelled')),
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  CONSTRAINT reservation_interval CHECK (
    isfinite(starts_at) AND isfinite(ends_at)
    AND starts_at < ends_at
  ),
  CONSTRAINT reservation_reference UNIQUE (tenant_id, external_ref),
  CONSTRAINT reservation_customer FOREIGN KEY (tenant_id, customer_id)
    REFERENCES customers (tenant_id, customer_id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT reservation_resource FOREIGN KEY (tenant_id, resource_id)
    REFERENCES resources (tenant_id, resource_id)
    ON UPDATE RESTRICT ON DELETE RESTRICT
);
