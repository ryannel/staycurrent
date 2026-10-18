-- PostgreSQL 18. Run in a scratch database. Builds the tables the Indexing
-- queries article measures: 1,000 customers, 60,000 orders, 60,000 accounts.
SET TIME ZONE 'UTC';
DROP TABLE IF EXISTS orders, customers, accounts CASCADE;

CREATE TABLE customers (
  customer_id integer PRIMARY KEY,
  name        text NOT NULL,
  region      text NOT NULL
);
INSERT INTO customers
SELECT n, 'Customer ' || n, CASE WHEN n % 200 = 0 THEN 'north' ELSE 'other' END
FROM generate_series(1, 1000) AS s(n);

CREATE TABLE orders (
  order_id    integer PRIMARY KEY,
  customer_id integer NOT NULL REFERENCES customers (customer_id),
  placed_at   timestamptz NOT NULL,
  status      text NOT NULL,
  total       numeric(10,2) NOT NULL,
  note        text NOT NULL
);
INSERT INTO orders
SELECT n, 1 + n % 1000,
       timestamptz '2026-01-01 00:00:00+00' + n * interval '1 minute',
       CASE WHEN (n / 1000) % 5 = 0 THEN 'pending' ELSE 'paid' END,
       (1000 + n % 9000)::numeric / 100,
       repeat('delivery note ', 12)
FROM generate_series(1, 60000) AS s(n);

CREATE TABLE accounts (
  account_id integer PRIMARY KEY,
  email      text NOT NULL,
  deleted_at timestamptz
);
INSERT INTO accounts
SELECT n, substr(md5(n::text), 1, 12) || '@example.com', NULL
FROM generate_series(1, 60000) AS s(n);

VACUUM ANALYZE;  -- sets the visibility map, so index-only scans are possible
