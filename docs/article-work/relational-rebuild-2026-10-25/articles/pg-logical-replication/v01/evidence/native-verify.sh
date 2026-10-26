#!/usr/bin/env bash
set -euo pipefail
# Root provisions and retires the two owned clusters. This verifier creates only
# the named disposable article objects in the two exact databases.
: "${PUB_SYSID:?}" "${SUB_SYSID:?}"
PSQL=/usr/lib/postgresql/18/bin/psql
BASE=/tmp/sc-pg-logical-20261025
ROLE=sc_pg_logical_replication_writer
for name in ${!PG@}; do unset "$name"; done
export PGCONNECT_TIMEOUT=5 PGAPPNAME=sc-pg-logical-author-verifier
run() {
  local side=$1 sql=$2 db port sysid
  if [[ $side == publisher ]]; then db=sc_pg_logical_pub; port=5432; sysid=$PUB_SYSID;
  else db=sc_pg_logical_sub; port=55432; sysid=$SUB_SYSID; fi
  {
    cat <<'SQL'
SELECT current_database() = :'db'
 AND current_user = :'role'
 AND current_setting('data_directory') = :'directory'
 AND current_setting('cluster_name') = :'cluster'
 AND current_setting('port') = :'port'
 AND current_setting('listen_addresses') = ''
 AND (SELECT system_identifier::text FROM pg_control_system()) = :'sysid'
 AND current_setting('server_version_num')::integer = 180006 AS owned \gset
\if :owned
\else
\echo OWNERSHIP GUARD FAILED
\quit 9
\endif
SET statement_timeout = '15s';
SET lock_timeout = '3s';
SQL
    printf '%s\n' "$sql"
  } | "$PSQL" -X -A -t -v ON_ERROR_STOP=1 -h "$BASE/sockets/$side" -p "$port" -U "$ROLE" -d "$db" \
    -v db="$db" -v role="$ROLE" -v directory="$BASE/$side" -v cluster="staycurrent-pg-logical-$side-20261025" -v port="$port" -v sysid="$sysid"
}
wait_for() {
  local side=$1 query=$2 expected=$3 output i
  for i in {1..40}; do
    output=$(run "$side" "$query")
    if [[ $(printf '%s\n' "$output" | tail -1) == "$expected" ]]; then printf '%s\n' "$output"; return; fi
    sleep 0.25
  done
  printf 'WAIT FAILED: %s\n%s\n' "$query" "$output" >&2; exit 1
}
printf 'PHASE identity\n'
run publisher "SELECT version(), current_database(), system_identifier FROM pg_control_system();"
run subscriber "SELECT version(), current_database(), system_identifier FROM pg_control_system();"
schema="CREATE TABLE public.products (product_id text PRIMARY KEY, name text NOT NULL, price numeric(8,2) NOT NULL CHECK (price >= 0), stock integer NOT NULL CHECK (stock >= 0));"
run publisher "$schema INSERT INTO public.products VALUES ('P3','Green tea, 50 g',4.50,10),('P7','Blue mug',20.00,0),('P9','Teapot',35.00,4); CREATE PUBLICATION catalogue FOR TABLE public.products;"
run subscriber "$schema"
# This conninfo is guarded against the known publisher immediately before the
# subscriber is asked to open its own replication connection to that endpoint.
run publisher "SELECT 'publisher endpoint verified for subscription';"
run subscriber "CREATE SUBSCRIPTION catalogue_copy CONNECTION 'host=$BASE/sockets/publisher port=5432 dbname=sc_pg_logical_pub user=$ROLE connect_timeout=5 application_name=sc-pg-logical-native-copy' PUBLICATION catalogue WITH (streaming = off);"
printf 'PHASE ready\n'
wait_for subscriber "SELECT srsubstate FROM pg_subscription_rel WHERE srrelid='public.products'::regclass;" r
run subscriber "SELECT product_id,name,price,stock FROM products ORDER BY product_id; SELECT subname, worker_type, received_lsn FROM pg_stat_subscription;"
printf 'PHASE price\n'
run publisher "UPDATE products SET price=22.00 WHERE product_id='P7';"
wait_for subscriber "SELECT price FROM products WHERE product_id='P7';" 22.00
run subscriber "SELECT external_id,remote_lsn,local_lsn FROM pg_replication_origin_status;"
printf 'PHASE identity counterexample\n'
run publisher "CREATE TABLE public.identity_demo(product_id text, price numeric(8,2)); INSERT INTO identity_demo VALUES ('P7',20.00); CREATE PUBLICATION identity_changes FOR TABLE identity_demo;"
set +e
identity_error=$(run publisher "UPDATE identity_demo SET price=22.00 WHERE product_id='P7';" 2>&1)
identity_exit=$?
set -e
printf '%s\n' "$identity_error"
[[ $identity_exit -ne 0 && $identity_error == *"does not have a replica identity"* ]]
run publisher "ALTER TABLE identity_demo ADD PRIMARY KEY (product_id); UPDATE identity_demo SET price=22.00 WHERE product_id='P7'; SELECT * FROM identity_demo; DROP PUBLICATION identity_changes; DROP TABLE identity_demo;"
printf 'PHASE pause\n'
run subscriber "ALTER SUBSCRIPTION catalogue_copy DISABLE;"
wait_for publisher "SELECT active FROM pg_replication_slots WHERE slot_name='catalogue_copy';" f
run publisher "UPDATE products SET price=20.00 WHERE product_id='P7'; SELECT slot_name,active,restart_lsn,confirmed_flush_lsn,wal_status,invalidation_reason,pg_wal_lsn_diff(pg_current_wal_lsn(),restart_lsn) AS retained_distance FROM pg_replication_slots WHERE slot_name='catalogue_copy';"
run subscriber "SELECT price FROM products WHERE product_id='P7'; ALTER SUBSCRIPTION catalogue_copy ENABLE;"
wait_for subscriber "SELECT price FROM products WHERE product_id='P7';" 20.00
printf 'PHASE local-write conflict\n'
# Independent local-write counterexample; P11 is not a new shared starting row.
run subscriber "ALTER SUBSCRIPTION catalogue_copy DISABLE;"
wait_for publisher "SELECT active FROM pg_replication_slots WHERE slot_name='catalogue_copy';" f
run subscriber "INSERT INTO products VALUES ('P11','Tea strainer',8.00,0);"
run publisher "INSERT INTO products VALUES ('P11','Tea strainer',8.00,0);"
run subscriber "ALTER SUBSCRIPTION catalogue_copy ENABLE;"
wait_for subscriber "SELECT (apply_error_count > 0)::text FROM pg_stat_subscription_stats WHERE subname='catalogue_copy';" true
run subscriber "SELECT subname,apply_error_count,sync_error_count,confl_insert_exists FROM pg_stat_subscription_stats WHERE subname='catalogue_copy'; ALTER SUBSCRIPTION catalogue_copy DISABLE;"
wait_for publisher "SELECT active FROM pg_replication_slots WHERE slot_name='catalogue_copy';" f
run subscriber "DELETE FROM products WHERE product_id='P11'; ALTER SUBSCRIPTION catalogue_copy ENABLE;"
wait_for subscriber "SELECT price FROM products WHERE product_id='P11';" 8.00
printf 'PHASE retire\n'
run publisher "SELECT 'publisher endpoint verified before remote slot removal';"
run subscriber "DROP SUBSCRIPTION catalogue_copy; DROP TABLE products;"
run publisher "SELECT count(*) AS remaining_slots FROM pg_replication_slots WHERE database=current_database(); DROP PUBLICATION catalogue; DROP TABLE products;"
printf 'NATIVE VERIFICATION COMPLETE\n'
