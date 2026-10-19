INSERT INTO tenants VALUES (1), (2);
INSERT INTO customers VALUES (1, 7), (2, 8);
INSERT INTO resources VALUES (1, 21), (1, 22), (2, 29);
INSERT INTO reservations
  (tenant_id, customer_id, resource_id, external_ref,
   state, starts_at, ends_at)
VALUES (1, 7, 21, 'R17', 'confirmed',
        '2026-11-03 10:00+00', '2026-11-03 11:00+00');
