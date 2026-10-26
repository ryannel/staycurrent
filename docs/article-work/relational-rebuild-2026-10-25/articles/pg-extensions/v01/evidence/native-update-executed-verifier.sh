#!/bin/bash
set -euo pipefail
base=/tmp/sc-pg-extensions-20261025
bin=/usr/lib/postgresql/18/bin
mkdir -p "$base/results" "$base/update-socket"
exec >"$base/results/update-transcript.txt" 2>&1
cleanup(){ "$bin/pg_ctl" -D "$base/update-data" -m fast -w stop || true; }
trap cleanup EXIT
test ! -e "$base/update-data"
"$bin/initdb" -D "$base/update-data" -U sc_owner --auth-local=trust --auth-host=reject --no-locale
"$bin/pg_ctl" -D "$base/update-data" -l "$base/results/update-server.log" -o "-c listen_addresses='' -c unix_socket_directories='$base/update-socket' -c max_connections=12 -c shared_buffers=32MB" -w start
"$bin/createdb" -h "$base/update-socket" -U sc_owner sc_update
"$bin/psql" -X -v ON_ERROR_STOP=1 -h "$base/update-socket" -U sc_owner -d sc_update <<'SQL'
SELECT current_setting('server_version_num')='180006' AND current_setting('data_directory')='/tmp/sc-pg-extensions-20261025/update-data' AND current_setting('listen_addresses')='' AS verified_identity \gset
\if :verified_identity
SELECT version(),current_database(),current_user,current_setting('data_directory'),current_setting('listen_addresses'),system_identifier FROM pg_control_system();
\else
\echo Unexpected owned cluster identity
\quit 3
\endif
SELECT p.source AS from_version,p.target AS to_version,p.path AS chosen_path FROM pg_extension_update_paths('btree_gist') p JOIN pg_available_extensions a ON a.name='btree_gist' JOIN pg_available_extension_versions av ON av.name=a.name AND av.version=p.source WHERE p.target=a.default_version AND p.source<>p.target AND p.path IS NOT NULL ORDER BY p.source LIMIT 1 \gset upd_
\if :{?upd_from_version}
\echo Selected installable source :upd_from_version and target :upd_to_version via :upd_chosen_path
CREATE EXTENSION btree_gist VERSION :'upd_from_version';
SELECT extversion AS before_update FROM pg_extension WHERE extname='btree_gist';
CREATE TABLE sc_update_rule(room text NOT NULL,during tstzrange NOT NULL,EXCLUDE USING gist(room WITH =,during WITH &&));
INSERT INTO sc_update_rule VALUES('R1','[2026-11-02 10:00+00,2026-11-02 11:00+00)');
ALTER EXTENSION btree_gist UPDATE TO :'upd_to_version';
SELECT extversion AS after_update FROM pg_extension WHERE extname='btree_gist';
SELECT room,during,during @> '2026-11-02 10:30+00'::timestamptz AS contains_1030 FROM sc_update_rule;
DO $$BEGIN BEGIN INSERT INTO sc_update_rule VALUES('R1','[2026-11-02 10:30+00,2026-11-02 11:30+00)'); RAISE EXCEPTION 'updated rule missing'; EXCEPTION WHEN exclusion_violation THEN RAISE NOTICE 'updated rule refused overlap [%]',SQLSTATE; END; END$$;
BEGIN; INSERT INTO sc_update_rule VALUES('R1','[2026-11-02 11:00+00,2026-11-02 12:00+00)'); ROLLBACK;
SELECT source,target,path FROM pg_extension_update_paths('btree_gist') WHERE source=:'upd_to_version' AND target=:'upd_from_version';
\else
\echo No installable nontrivial available path to default; no update claimed.
\endif
SQL
