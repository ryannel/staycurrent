-- PostgreSQL 18.6. Use an isolated schema; expected errors are documented in native output.
CREATE TABLE sessions (
  tenant_id text NOT NULL, session_id text NOT NULL,
  starts_on date NOT NULL, capacity integer NOT NULL CHECK (capacity > 0),
  PRIMARY KEY (tenant_id, starts_on, session_id)
) PARTITION BY RANGE (starts_on);
CREATE TABLE sessions_oct PARTITION OF sessions
  FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');
CREATE TABLE sessions_nov PARTITION OF sessions
  FOR VALUES FROM ('2026-11-01') TO ('2026-12-01');
INSERT INTO sessions VALUES
 ('t4','s7','2026-10-19',2), ('t4','s8','2026-11-02',12);
SELECT tableoid::regclass AS partition, session_id, starts_on
FROM sessions ORDER BY starts_on;


EXPLAIN (COSTS OFF)
SELECT session_id FROM sessions
WHERE tenant_id = 't4'
  AND starts_on >= date '2026-10-01' AND starts_on < date '2026-11-01';


EXPLAIN (COSTS OFF)
SELECT session_id FROM sessions
WHERE tenant_id = 't4' AND session_id = 's7';


INSERT INTO sessions VALUES ('t4','s9','2026-12-02',6);


CREATE TABLE sessions_dec (LIKE sessions INCLUDING DEFAULTS INCLUDING CONSTRAINTS);
ALTER TABLE sessions_dec ADD CONSTRAINT december_bounds
CHECK (starts_on >= date '2026-12-01' AND starts_on < date '2027-01-01');
INSERT INTO sessions_dec VALUES ('t4','s9','2026-12-02',6);
ALTER TABLE sessions ATTACH PARTITION sessions_dec
FOR VALUES FROM ('2026-12-01') TO ('2027-01-01');


ALTER TABLE sessions DETACH PARTITION sessions_oct;
SELECT session_id FROM sessions ORDER BY session_id;
SELECT session_id FROM sessions_oct ORDER BY session_id;
