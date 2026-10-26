#!/bin/bash
set -euo pipefail
base=/tmp/sc-pg-extensions-20261025
bin=/usr/lib/postgresql/18/bin
mkdir -p "$base/results" "$base/source-socket" "$base/restore-socket"
exec >"$base/results/native-transcript.txt" 2>&1
cleanup() { for side in source restore; do "$bin/pg_ctl" -D "$base/$side-data" -m fast -w stop || true; done; }
trap cleanup EXIT
for side in source restore; do
  test ! -e "$base/$side-data"
  "$bin/initdb" -D "$base/$side-data" -U sc_owner --auth-local=trust --auth-host=reject --no-locale
  "$bin/pg_ctl" -D "$base/$side-data" -l "$base/results/$side-server.log" -o "-c listen_addresses='' -c unix_socket_directories='$base/$side-socket' -c max_connections=12 -c shared_buffers=32MB" -w start
  "$bin/createdb" -h "$base/$side-socket" -U sc_owner sc_extensions
  "$bin/psql" -X -v ON_ERROR_STOP=1 -h "$base/$side-socket" -U sc_owner -d sc_extensions -v expected_dir="$base/$side-data" <<'SQL'
SELECT current_setting('server_version_num')='180006' AND current_setting('data_directory')=:'expected_dir' AND current_setting('listen_addresses')='' AS verified_identity \gset
\if :verified_identity
SELECT system_identifier FROM pg_control_system();
\else
\echo Unexpected owned cluster identity
\quit 3
\endif
SELECT version(),current_database(),current_user,current_setting('data_directory'),current_setting('listen_addresses');
CREATE ROLE sc_migrate; CREATE ROLE sc_runtime;
GRANT CREATE ON DATABASE sc_extensions TO sc_migrate;
CREATE SCHEMA sc_ext AUTHORIZATION sc_migrate;
CREATE SCHEMA sc_app AUTHORIZATION sc_migrate;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
SQL
done
psql_source() { "$bin/psql" -X -v ON_ERROR_STOP=1 -h "$base/source-socket" -U sc_owner -d sc_extensions "$@"; }
psql_restore() { "$bin/psql" -X -v ON_ERROR_STOP=1 -h "$base/restore-socket" -U sc_owner -d sc_extensions "$@"; }
psql_source <<'SQL'
SELECT name,default_version,installed_version FROM pg_available_extensions WHERE name IN ('btree_gist','postgis');
SELECT version,superuser,trusted,relocatable,requires FROM pg_available_extension_versions WHERE name='btree_gist' ORDER BY version;
SELECT source,target,path FROM pg_extension_update_paths('btree_gist') ORDER BY source,target;
SET ROLE sc_migrate;
SET search_path = pg_catalog,sc_app,sc_ext;
CREATE TABLE sc_app.reservations(reservation_id integer PRIMARY KEY,room text NOT NULL,during tstzrange NOT NULL CHECK(NOT isempty(during) AND NOT lower_inf(during) AND NOT upper_inf(during) AND lower_inc(during) AND NOT upper_inc(during)));
DO $$BEGIN
 BEGIN
  ALTER TABLE sc_app.reservations ADD CONSTRAINT room_free EXCLUDE USING gist(room WITH =,during WITH &&);
  RAISE EXCEPTION 'unexpected missing-opclass success';
 EXCEPTION WHEN undefined_object THEN RAISE NOTICE 'missing text GiST class: % [%]',SQLERRM,SQLSTATE; END;
END$$;
SELECT default_version AS chosen_version FROM pg_available_extensions WHERE name='btree_gist' \gset
CREATE EXTENSION btree_gist WITH SCHEMA sc_ext VERSION :'chosen_version';
ALTER TABLE sc_app.reservations ADD CONSTRAINT room_free EXCLUDE USING gist(room WITH =,during WITH &&);
INSERT INTO sc_app.reservations VALUES(7001,'R1','[2026-11-02 10:00+00,2026-11-02 11:00+00)');
SELECT during && '[2026-11-02 10:30+00,2026-11-02 11:30+00)'::tstzrange AS overlaps_7002,during && '[2026-11-02 11:00+00,2026-11-02 12:00+00)'::tstzrange AS overlaps_7003,during -|- '[2026-11-02 11:00+00,2026-11-02 12:00+00)'::tstzrange AS adjacent_7003,during @> '2026-11-02 11:00+00'::timestamptz AS contains_11 FROM sc_app.reservations;
DO $$BEGIN
 BEGIN INSERT INTO sc_app.reservations VALUES(7002,'R1','[2026-11-02 10:30+00,2026-11-02 11:30+00)'); RAISE EXCEPTION 'unexpected overlap accepted';
 EXCEPTION WHEN exclusion_violation THEN RAISE NOTICE 'overlap refused: % [%]',SQLERRM,SQLSTATE; END;
END$$;
BEGIN; INSERT INTO sc_app.reservations VALUES(7003,'R1','[2026-11-02 11:00+00,2026-11-02 12:00+00)'); ROLLBACK;
GRANT USAGE ON SCHEMA sc_app,sc_ext TO sc_runtime;
GRANT SELECT,INSERT ON sc_app.reservations TO sc_runtime;
RESET ROLE;
SELECT extname,extversion,extowner::regrole,extnamespace::regnamespace FROM pg_extension WHERE extname='btree_gist';
SELECT opc.opcname,opc.opcowner::regrole,dep.deptype FROM pg_opclass opc JOIN pg_depend dep ON dep.classid='pg_opclass'::regclass AND dep.objid=opc.oid JOIN pg_extension ext ON ext.oid=dep.refobjid WHERE ext.extname='btree_gist' AND opc.opcname='gist_text_ops';
SELECT pg_describe_object(classid,objid,objsubid) AS dependent,deptype,pg_describe_object(refclassid,refobjid,refobjsubid) AS referenced FROM pg_depend WHERE (classid='pg_class'::regclass AND objid='sc_app.room_free'::regclass) OR (classid='pg_constraint'::regclass AND objid=(SELECT oid FROM pg_constraint WHERE conname='room_free')) ORDER BY dependent,referenced;
SET ROLE sc_runtime;
SELECT reservation_id,room,during FROM sc_app.reservations;
DO $$BEGIN BEGIN CREATE EXTENSION hstore; RAISE EXCEPTION 'unexpected runtime installation'; EXCEPTION WHEN insufficient_privilege THEN RAISE NOTICE 'runtime installation refused [%]',SQLSTATE; END; END$$;
RESET ROLE;
BEGIN;
DO $$BEGIN BEGIN DROP EXTENSION btree_gist; RAISE EXCEPTION 'unexpected restrict success'; EXCEPTION WHEN dependent_objects_still_exist THEN RAISE NOTICE 'restrict refused [%]: %',SQLSTATE,SQLERRM; END; END$$;
DROP EXTENSION btree_gist CASCADE;
SELECT count(*) AS surviving_rows FROM sc_app.reservations;
SELECT count(*) AS surviving_exclusion_rules FROM pg_constraint WHERE conrelid='sc_app.reservations'::regclass AND contype='x';
INSERT INTO sc_app.reservations VALUES(7002,'R1','[2026-11-02 10:30+00,2026-11-02 11:30+00)');
SELECT count(*) AS rows_after_unprotected_overlap FROM sc_app.reservations;
ROLLBACK;
SQL
"$bin/pg_dump" -h "$base/source-socket" -U sc_owner -d sc_extensions -Fc -f "$base/results/extensions.dump"
"$bin/pg_restore" -f "$base/results/dump.sql" "$base/results/extensions.dump"
# Source schema containers are already present in the target for roles/authority;
# drop only those empty owned test schemas before restoring their dump definitions.
psql_restore -c 'DROP SCHEMA sc_app,sc_ext;'
"$bin/pg_restore" --exit-on-error -h "$base/restore-socket" -U sc_owner -d sc_extensions "$base/results/extensions.dump"
psql_restore <<'SQL'
SELECT extname,extversion,extowner::regrole FROM pg_extension WHERE extname='btree_gist';
SET ROLE sc_runtime; SET search_path=pg_catalog,sc_app,sc_ext;
SELECT reservation_id,room,during,during @> '2026-11-02 10:30+00'::timestamptz AS contains_1030 FROM sc_app.reservations;
DO $$BEGIN BEGIN INSERT INTO sc_app.reservations VALUES(7002,'R1','[2026-11-02 10:30+00,2026-11-02 11:30+00)'); RAISE EXCEPTION 'restored rule missing'; EXCEPTION WHEN exclusion_violation THEN RAISE NOTICE 'restored rule refused overlap [%]',SQLSTATE; END; END$$;
BEGIN; INSERT INTO sc_app.reservations VALUES(7003,'R1','[2026-11-02 11:00+00,2026-11-02 12:00+00)'); ROLLBACK;
RESET ROLE;
SQL
# Rehearse only an update path actually advertised by these installed files.
"$bin/createdb" -h "$base/source-socket" -U sc_owner sc_update
"$bin/psql" -X -v ON_ERROR_STOP=1 -h "$base/source-socket" -U sc_owner -d sc_update <<'SQL'
SELECT p.source AS from_version,p.target AS to_version FROM pg_extension_update_paths('btree_gist') p JOIN pg_available_extensions a ON a.name='btree_gist' WHERE p.target=a.default_version AND p.source<>p.target AND p.path IS NOT NULL ORDER BY p.source LIMIT 1 \gset upd_
\if :{?upd_from_version}
CREATE EXTENSION btree_gist VERSION :'upd_from_version';
SELECT extversion AS before_update FROM pg_extension WHERE extname='btree_gist';
CREATE TABLE sc_update_rule(room text NOT NULL,during tstzrange NOT NULL,EXCLUDE USING gist(room WITH =,during WITH &&));
INSERT INTO sc_update_rule VALUES('R1','[2026-11-02 10:00+00,2026-11-02 11:00+00)');
ALTER EXTENSION btree_gist UPDATE TO :'upd_to_version';
SELECT extversion AS after_update FROM pg_extension WHERE extname='btree_gist';
DO $$BEGIN BEGIN INSERT INTO sc_update_rule VALUES('R1','[2026-11-02 10:30+00,2026-11-02 11:30+00)'); RAISE EXCEPTION 'updated rule missing'; EXCEPTION WHEN exclusion_violation THEN RAISE NOTICE 'updated rule refused overlap [%]',SQLSTATE; END; END$$;
SELECT source,target,path FROM pg_extension_update_paths('btree_gist') WHERE source=:'upd_to_version' AND target=:'upd_from_version';
\else
\echo No nontrivial available path to default; no update claimed.
\endif
SQL
