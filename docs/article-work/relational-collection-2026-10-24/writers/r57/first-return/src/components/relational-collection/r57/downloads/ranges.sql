-- PostgreSQL 18, btree_gist available. Run only in a disposable database.
-- btree_gist is installed in this database and retained after this file.
SET TIME ZONE 'UTC';
CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE TEMP TABLE loose_reservations(room text, during tstzrange);
INSERT INTO loose_reservations VALUES
('R1','[2026-11-04 18:00Z,2026-11-04 19:00Z)'),
('R1','[2026-11-04 18:30Z,2026-11-04 19:30Z)');
SELECT 'unprotected_overlap_count',count(*) FROM loose_reservations;
CREATE TEMP TABLE reservations (
 room text NOT NULL,
 during tstzrange NOT NULL,
 CHECK (NOT isempty(during) AND lower_inc(during) AND NOT upper_inc(during)
        AND NOT lower_inf(during) AND NOT upper_inf(during)
        AND isfinite(lower(during)) AND isfinite(upper(during))),
 EXCLUDE USING gist (room WITH =, during WITH &&));
INSERT INTO reservations VALUES ('R1','[2026-11-04 18:00Z,2026-11-04 19:00Z)'),
('R1','[2026-11-04 19:00Z,2026-11-04 20:00Z)'),
('R2','[2026-11-04 18:30Z,2026-11-04 19:30Z)');
DO $$ BEGIN
 BEGIN
  INSERT INTO reservations VALUES ('R1','[2026-11-04 18:30Z,2026-11-04 19:30Z)');
  RAISE EXCEPTION 'overlap unexpectedly accepted';
 EXCEPTION WHEN exclusion_violation THEN RAISE NOTICE 'overlap rejected: 23P01'; END;
 BEGIN
  INSERT INTO reservations VALUES ('R1','empty');
  RAISE EXCEPTION 'empty unexpectedly accepted';
 EXCEPTION WHEN check_violation THEN RAISE NOTICE 'empty rejected: 23514'; END;
END $$;
SELECT room,during FROM reservations ORDER BY room,lower(during);
SELECT 'adjacent_overlap',tstzrange('2026-11-04 18:00Z','2026-11-04 19:00Z','[)') && tstzrange('2026-11-04 19:00Z','2026-11-04 20:00Z','[)');
SELECT extname,extversion FROM pg_extension WHERE extname='btree_gist';
-- This cannot remove the extension while the GiST text operator class is needed.
DO $$ BEGIN
 BEGIN DROP EXTENSION btree_gist;
 EXCEPTION WHEN dependent_objects_still_exist THEN RAISE NOTICE 'dependency-protected drop rejected: 2BP01'; END;
END $$;
