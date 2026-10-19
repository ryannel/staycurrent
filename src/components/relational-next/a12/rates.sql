-- Extend the parent article's schema in an empty disposable database.
CREATE EXTENSION btree_gist;
CREATE TABLE customer_rates (
  tenant_id integer NOT NULL,
  customer_id integer NOT NULL,
  version_no integer NOT NULL CHECK (version_no > 0),
  fee_eur numeric(8,2) NOT NULL
    CHECK (fee_eur >= 0 AND fee_eur < 1000000),
  effective_from date NOT NULL CHECK (isfinite(effective_from)),
  effective_to date CHECK (isfinite(effective_to)),
  PRIMARY KEY (tenant_id, customer_id, version_no),
  FOREIGN KEY (tenant_id, customer_id)
    REFERENCES customers (tenant_id, customer_id) ON DELETE RESTRICT,
  CHECK (effective_to IS NULL OR effective_from < effective_to),
  EXCLUDE USING gist (
    tenant_id WITH =,
    customer_id WITH =,
    daterange(effective_from, effective_to, '[)') WITH &&
  )
);

INSERT INTO customer_rates VALUES
  (1, 7, 1, 20.00, '2026-11-01', '2026-11-10'),
  (1, 7, 2, 22.00, '2026-11-10', NULL);
