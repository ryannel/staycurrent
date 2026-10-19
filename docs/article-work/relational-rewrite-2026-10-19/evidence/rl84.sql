-- PostgreSQL 18.6. Use an isolated schema; expected errors are documented in native output.
CREATE TABLE sessions (
  tenant_id text, session_id text,
  capacity integer NOT NULL CHECK (capacity > 0),
  remaining integer NOT NULL CHECK (remaining >= 0 AND remaining <= capacity),
  PRIMARY KEY (tenant_id, session_id)
);
INSERT INTO sessions VALUES ('t4','s7',2,2);
UPDATE sessions SET remaining = remaining - 1
WHERE tenant_id = 't4' AND session_id = 's7' AND remaining >= 1
RETURNING session_id, remaining;


CREATE TABLE bookings (
  tenant_id text, booking_id text, status text NOT NULL,
  revision integer NOT NULL CHECK (revision > 0),
  PRIMARY KEY (tenant_id, booking_id)
);
INSERT INTO bookings VALUES ('t4','b17','confirmed',7);
UPDATE bookings SET status = 'cancelled', revision = revision + 1
WHERE tenant_id = 't4' AND booking_id = 'b17' AND revision = 7
RETURNING booking_id, status, revision;


INSERT INTO bookings AS current (tenant_id, booking_id, status, revision)
VALUES ('t4','b17','confirmed',6)
ON CONFLICT (tenant_id, booking_id) DO UPDATE
SET status = EXCLUDED.status, revision = EXCLUDED.revision
WHERE EXCLUDED.revision > current.revision
RETURNING booking_id, status, revision;


CREATE TABLE import_raw (
  source_row integer PRIMARY KEY, tenant_id text,
  booking_id text, status text, revision_text text
);
INSERT INTO import_raw VALUES
 (1,'t4','b18','confirmed','1'),
 (2,'t4','b17','confirmed','6'),
 (3,'t4','b17','cancelled','9'),
 (4,'t4','b19','unknown','oops'),
 (5,'t4','b17','confirmed','9'),
 (6,'t4','b18','confirmed','1');


CREATE VIEW import_valid AS
SELECT source_row, tenant_id, booking_id, status,
       CASE WHEN revision_text ~ '^[0-9]{1,9}$'
            THEN revision_text::integer END AS revision
FROM import_raw
WHERE tenant_id = 't4' AND booking_id IS NOT NULL
  AND status IN ('confirmed','cancelled')
  AND revision_text ~ '^[0-9]{1,9}$'
  AND CASE WHEN revision_text ~ '^[0-9]{1,9}$'
           THEN revision_text::integer > 0 ELSE false END;

CREATE TEMP TABLE import_conflicts AS
SELECT tenant_id,booking_id,revision FROM import_valid
GROUP BY tenant_id,booking_id,revision HAVING count(DISTINCT status)>1;
CREATE TEMP TABLE import_candidates AS
SELECT DISTINCT ON (v.tenant_id,v.booking_id)
 v.* FROM import_valid v
WHERE NOT EXISTS (SELECT 1 FROM import_conflicts c
 WHERE (c.tenant_id,c.booking_id,c.revision)=(v.tenant_id,v.booking_id,v.revision))
ORDER BY v.tenant_id,v.booking_id,v.revision DESC,v.source_row;
CREATE TEMP TABLE import_outcomes AS
SELECT r.source_row,
 CASE WHEN v.source_row IS NULL THEN 'malformed'
 WHEN EXISTS (SELECT 1 FROM import_conflicts c WHERE
 (c.tenant_id,c.booking_id,c.revision)=(v.tenant_id,v.booking_id,v.revision)) THEN 'contradictory'
 WHEN EXISTS (SELECT 1 FROM import_valid d WHERE
 (d.tenant_id,d.booking_id,d.revision,d.status)=(v.tenant_id,v.booking_id,v.revision,v.status)
 AND d.source_row<v.source_row) THEN 'duplicate'
 WHEN v.source_row<>c.source_row THEN 'superseded'
 WHEN b.revision>v.revision THEN 'stale'
 WHEN b.revision=v.revision AND b.status<>v.status THEN 'destination disagreement'
 WHEN b.revision=v.revision THEN 'already present'
 ELSE 'applied' END AS outcome
FROM import_raw r LEFT JOIN import_valid v USING(source_row)
LEFT JOIN import_candidates c ON (c.tenant_id,c.booking_id)=(v.tenant_id,v.booking_id)
LEFT JOIN bookings b ON (b.tenant_id,b.booking_id)=(v.tenant_id,v.booking_id);
SELECT * FROM import_outcomes ORDER BY source_row;
INSERT INTO bookings AS current
SELECT tenant_id,booking_id,status,revision FROM import_candidates
ON CONFLICT (tenant_id,booking_id) DO UPDATE
SET status=excluded.status,revision=excluded.revision
WHERE excluded.revision>current.revision
RETURNING *;
SELECT * FROM bookings ORDER BY booking_id;
INSERT INTO bookings AS current
SELECT tenant_id,booking_id,status,revision FROM import_candidates
ON CONFLICT (tenant_id,booking_id) DO UPDATE
SET status=excluded.status,revision=excluded.revision
WHERE excluded.revision>current.revision RETURNING *;
SELECT * FROM bookings ORDER BY booking_id;
