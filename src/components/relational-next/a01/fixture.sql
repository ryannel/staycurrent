INSERT INTO tenants VALUES (1), (2);
INSERT INTO customers VALUES
  (1, 7, 'M007', 'Mina Shah', NULL),
  (1, 8, 'M008', 'Jon Reed', '+44 20 7946 0000'),
  (2, 9, 'M007', 'Other tenant customer', NULL);
INSERT INTO sessions VALUES
  (1, 21, 'Pottery', '2026-11-03 18:00+00', 2, 20.00),
  (1, 22, 'Glazing', '2026-11-10 18:00+00', 4, 25.00),
  (1, 23, 'Unbooked session', '2026-11-17 18:00+00', 4, 25.00);
INSERT INTO bookings VALUES
  (1, 11, 7, 21, 'booked', 20.00),
  (1, 12, 7, 22, 'booked', 25.00),
  (1, 13, 8, 21, 'cancelled', 20.00);
