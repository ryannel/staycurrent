-- PostgreSQL 18 with compatible PostGIS installed on the server.
-- Run only in a disposable database. Installs PostGIS and creates schema r57_spatial.
-- Coordinates are an invented local planar metre grid, SRID0 (no geodetic CRS).
CREATE EXTENSION postgis;
CREATE SCHEMA r57_spatial;
CREATE TABLE r57_spatial.points(label text PRIMARY KEY, location geometry(Point,0) NOT NULL);
INSERT INTO r57_spatial.points VALUES
('A',ST_Point(300,400)),('B',ST_Point(600,800)),('C',ST_Point(0,1200)),('D',ST_Point(700,700));
INSERT INTO r57_spatial.points
SELECT 'far-'||g, ST_Point(10000+(g%100)*100,10000+(g/100)*100)
FROM generate_series(1,10000) g;
CREATE INDEX points_location ON r57_spatial.points USING gist(location);
ANALYZE r57_spatial.points;
SELECT label,round(ST_Distance(location,ST_Point(0,0))::numeric,2) AS metres
FROM r57_spatial.points WHERE label IN ('A','B','C','D') ORDER BY label;
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT label FROM r57_spatial.points
WHERE ST_DWithin(location,ST_Point(0,0),750);
SELECT label FROM r57_spatial.points
WHERE ST_DWithin(location,ST_Point(0,0),750) ORDER BY label;
SELECT postgis_full_version();
