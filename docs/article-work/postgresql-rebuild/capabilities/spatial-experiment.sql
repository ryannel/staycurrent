-- PostgreSQL18 + PostGIS3.6.4. Run in a disposable database:
-- psql -v ON_ERROR_STOP=1 -d your_lab -f spatial-experiment.sql
CREATE EXTENSION IF NOT EXISTS postgis;
SELECT PostGIS_Full_Version();
DROP TABLE IF EXISTS pg_cap_venue_rooms,pg_cap_venues,pg_cap_spatial_scale;
CREATE TABLE pg_cap_venues (
 venue_id integer PRIMARY KEY,name text NOT NULL,open_for_booking boolean NOT NULL,
 location geography(Point,4326) NOT NULL
);
INSERT INTO pg_cap_venues(venue_id,name,open_for_booking,location) VALUES
 (1,'Centre',true,ST_SetSRID(ST_MakePoint(18.0686,59.3293),4326)::geography),
 (2,'North',true,ST_SetSRID(ST_MakePoint(18.0686,59.3343),4326)::geography),
 (3,'East',false,ST_SetSRID(ST_MakePoint(18.0736,59.3293),4326)::geography),
 (4,'Far north',true,ST_SetSRID(ST_MakePoint(18.0686,59.3493),4326)::geography);
CREATE TABLE pg_cap_venue_rooms (
 room_id integer PRIMARY KEY,venue_id integer NOT NULL REFERENCES pg_cap_venues,
 seats integer NOT NULL CHECK(seats>0)
);
INSERT INTO pg_cap_venue_rooms(room_id,venue_id,seats) VALUES(1,1,4),(2,2,12),(3,2,6),(4,3,10),(5,4,20);
SELECT venue_id,name,
 round(ST_Distance(location,ST_SetSRID(ST_MakePoint(18.0686,59.3293),4326)::geography)::numeric,1) AS metres
FROM pg_cap_venues ORDER BY venue_id;
SELECT v.venue_id,v.name FROM pg_cap_venues v
WHERE v.open_for_booking
 AND ST_DWithin(v.location,ST_SetSRID(ST_MakePoint(18.0686,59.3293),4326)::geography,1000)
 AND EXISTS(SELECT 1 FROM pg_cap_venue_rooms r WHERE r.venue_id=v.venue_id AND r.seats>=8)
ORDER BY v.venue_id;
-- Variation: the same eligibility rules, a larger radius.
SELECT v.venue_id,v.name FROM pg_cap_venues v
WHERE v.open_for_booking
 AND ST_DWithin(v.location,ST_SetSRID(ST_MakePoint(18.0686,59.3293),4326)::geography,3000)
 AND EXISTS(SELECT 1 FROM pg_cap_venue_rooms r WHERE r.venue_id=v.venue_id AND r.seats>=8)
ORDER BY v.venue_id;
CREATE TABLE pg_cap_spatial_scale AS
SELECT n AS id,ST_SetSRID(ST_MakePoint(18.0+(n%100)*0.002,59.25+(n/100)*0.002),4326)::geography AS location
FROM generate_series(0,9999) AS g(n);
CREATE INDEX pg_cap_spatial_gist ON pg_cap_spatial_scale USING gist(location);
ANALYZE pg_cap_spatial_scale;
EXPLAIN(ANALYZE,BUFFERS,TIMING OFF)
SELECT id FROM pg_cap_spatial_scale
WHERE ST_DWithin(location,ST_SetSRID(ST_MakePoint(18.0686,59.3293),4326)::geography,1000);
SELECT count(*) AS within_radius FROM pg_cap_spatial_scale
WHERE ST_DWithin(location,ST_SetSRID(ST_MakePoint(18.0686,59.3293),4326)::geography,1000);
