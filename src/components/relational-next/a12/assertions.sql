-- Alternative representation for the late-information requirement.
-- These are explicitly supplied assertion times, not automatic commit times.
CREATE TABLE rate_assertions (
  tenant_id integer NOT NULL,
  customer_id integer NOT NULL,
  assertion_no integer NOT NULL,
  fee_eur numeric(8,2) NOT NULL
    CHECK (fee_eur >= 0 AND fee_eur < 1000000),
  effective_from date NOT NULL CHECK (isfinite(effective_from)),
  effective_to date CHECK (isfinite(effective_to)),
  recorded_from timestamptz NOT NULL CHECK (isfinite(recorded_from)),
  recorded_to timestamptz CHECK (isfinite(recorded_to)),
  PRIMARY KEY (tenant_id, customer_id, assertion_no),
  FOREIGN KEY (tenant_id, customer_id)
    REFERENCES customers (tenant_id, customer_id) ON DELETE RESTRICT,
  CHECK (effective_to IS NULL OR effective_from < effective_to),
  CHECK (recorded_to IS NULL OR recorded_from < recorded_to),
  EXCLUDE USING gist (
    tenant_id WITH =, customer_id WITH =,
    daterange(effective_from, effective_to, '[)') WITH &&,
    tstzrange(recorded_from, recorded_to, '[)') WITH &&
  )
);

INSERT INTO rate_assertions VALUES
  (1,7,1,20.00,'2026-11-01',NULL,
   '2026-11-01 09:00+00','2026-11-12 10:00+00'),
  (1,7,2,20.00,'2026-11-01','2026-11-10',
   '2026-11-12 10:00+00',NULL),
  (1,7,3,22.00,'2026-11-10',NULL,
   '2026-11-12 10:00+00',NULL);
