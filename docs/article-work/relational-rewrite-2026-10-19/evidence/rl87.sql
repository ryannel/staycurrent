-- PostgreSQL 18.6. Use an isolated schema; expected errors are documented in native output.
CREATE TABLE events (
  event_id integer PRIMARY KEY, kind text NOT NULL, payload text NOT NULL
) WITH (autovacuum_enabled = false);
CREATE TABLE deliveries (
  event_id integer PRIMARY KEY, address text NOT NULL
);
INSERT INTO events SELECT n,'done',repeat('x',100)
FROM generate_series(1,50000) n;
INSERT INTO deliveries SELECT n,repeat('y',40)
FROM generate_series(1,90000) n;
CREATE INDEX events_kind ON events(kind);
ANALYZE events;
ANALYZE deliveries;
INSERT INTO events SELECT n,'new',repeat('x',100)
FROM generate_series(50001,90000) n;
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT count(*) FROM events e JOIN deliveries d USING (event_id)
WHERE e.kind = 'new';


ANALYZE events;
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT count(*) FROM events e JOIN deliveries d USING (event_id)
WHERE e.kind = 'new';
