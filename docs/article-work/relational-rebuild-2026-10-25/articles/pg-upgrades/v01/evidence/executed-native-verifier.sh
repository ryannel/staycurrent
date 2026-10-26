#!/bin/bash
# Run ONLY by root coordinator as postgres in the agreed disposable container.
set -euo pipefail
umask 077
BASE=/tmp/sc-pg-upgrades-20261025
B17=/usr/lib/postgresql/17/bin
B18=/usr/lib/postgresql/18/bin
[[ "$(id -un)" = postgres && -d "$BASE" && -f "$BASE/shop.sql" ]]
[[ ! -e "$BASE/run" ]]
mkdir "$BASE/run"
cd "$BASE/run"
export PATH="$B18:/usr/bin:/bin" LC_ALL=C PGCONNECT_TIMEOUT=3
unset PGHOST PGPORT PGDATABASE PGUSER PGSERVICE PGSERVICEFILE PGPASSFILE PGOPTIONS PGDATA || true
cleanup(){
  for entry in '17 copy-old' '18 copy-new' '17 link-old' '18 link-new' '17 logical-old' '18 logical-new'; do
    read -r version name <<< "$entry"
    if [[ -f "$BASE/run/$name/postmaster.pid" ]]; then
      "/usr/lib/postgresql/$version/bin/pg_ctl" -D "$BASE/run/$name" -m fast -w -t 15 stop || true
    fi
  done
}
trap cleanup EXIT
exec > >(tee "$BASE/run/results.txt") 2>&1
"$B17/postgres" --version
"$B18/postgres" --version
init(){
  local version=$1 name=$2
  local extra=()
  [[ "$version" = 18 ]] && extra=(--no-data-checksums)
  "/usr/lib/postgresql/$version/bin/initdb" -D "$BASE/run/$name" --auth-local=trust --auth-host=reject --locale=C -E UTF8 "${extra[@]}" > "$name-init.txt"
  mkdir "$BASE/run/$name-socket"
  cat >> "$BASE/run/$name/postgresql.conf" <<EOF
listen_addresses = ''
unix_socket_directories = '$BASE/run/$name-socket'
port = 55432
shared_buffers = '32MB'
max_connections = 15
wal_level = logical
max_replication_slots = 10
max_wal_senders = 10
max_logical_replication_workers = 6
EOF
}
start(){ "/usr/lib/postgresql/$1/bin/pg_ctl" -D "$BASE/run/$2" -l "$BASE/run/$2.log" -w -t 20 start; }
stop(){ "/usr/lib/postgresql/$1/bin/pg_ctl" -D "$BASE/run/$2" -m fast -w -t 20 stop; }
q(){ "$B18/psql" -X -v ON_ERROR_STOP=1 -At -h "$BASE/run/$1-socket" -p 55432 -U postgres -d postgres -c "$2"; }
load(){ "$B18/psql" -X -v ON_ERROR_STOP=1 -h "$BASE/run/$1-socket" -p 55432 -U postgres -d postgres -f "$BASE/shop.sql"; }
assertq(){ local got; got=$(q "$1" "$2"); [[ "$got" = "$3" ]] || { printf 'FAIL %s expected <%s> got <%s>\n' "$2" "$3" "$got"; exit 1; }; printf 'PASS %s => %s\n' "$2" "$got"; }
for mode in copy link; do
  init 17 "$mode-old"; init 18 "$mode-new"
  start 17 "$mode-old"
  assertq "$mode-old" 'SHOW data_directory' "$BASE/run/$mode-old"
  load "$mode-old"
  relation_path=$(q "$mode-old" "SELECT pg_relation_filepath('orders')")
  q "$mode-old" "SELECT version(); SELECT system_identifier FROM pg_control_system();" > "$mode-source-identity.txt"
  stop 17 "$mode-old"
  mkdir "$mode-work"; cd "$mode-work"
  args=(-b "$B17" -B "$B18" -d "$BASE/run/$mode-old" -D "$BASE/run/$mode-new" -s "$BASE/run/$mode-new-socket" -p 55432 -P 55433 --retain)
  [[ "$mode" = link ]] && args+=(--link)
  "$B18/pg_upgrade" "${args[@]}" --check > check.txt 2>&1
  "$B18/pg_upgrade" "${args[@]}" > upgrade.txt 2>&1
  printf 'PASS pg_upgrade --check and full %s upgrade\n' "$mode"
  # Verify file relationship before starting target. Old is never started after link target.
  oldfile="$BASE/run/$mode-old/$relation_path"
  newfile="$BASE/run/$mode-new/$relation_path"
  [[ -f "$oldfile" && -f "$newfile" ]]
  oldinode=$(stat -c '%d:%i' "$oldfile")
  newinode=$(stat -c '%d:%i' "$newfile")
  if [[ "$mode" = copy ]]; then [[ "$oldinode" != "$newinode" ]]; else [[ "$oldinode" = "$newinode" ]]; fi
  printf 'PASS %s orders path=%s old inode=%s target inode=%s\n' "$mode" "$relation_path" "$oldinode" "$newinode"
  start 18 "$mode-new"
  assertq "$mode-new" 'SHOW data_directory' "$BASE/run/$mode-new"
  assertq "$mode-new" "SELECT current_setting('server_version_num')::int / 10000" 18
  q "$mode-new" "SELECT version(); SELECT system_identifier FROM pg_control_system();" > "$mode-target-identity.txt"
  assertq "$mode-new" "SELECT status||'|'||(SELECT sum(quantity*unit_price)::text FROM order_items WHERE order_id=103) FROM orders WHERE order_id=103" 'pending|29.00'
  assertq "$mode-new" "SELECT string_agg(product_id||':'||stock,',' ORDER BY product_id) FROM products" 'P3:10,P7:0,P9:4'
  stop 18 "$mode-new"
  if [[ "$mode" = copy ]]; then
    start 17 copy-old
    assertq copy-old "SELECT price::text FROM products WHERE product_id='P7'" '20.00'
    stop 17 copy-old
  else
    [[ -f "$BASE/run/link-old/global/pg_control.old" ]]
    printf 'PASS link old control renamed; never started after target start\n'
  fi
  cd "$BASE/run"
done
init 17 logical-old; init 18 logical-new
start 17 logical-old; start 18 logical-new
assertq logical-old 'SHOW data_directory' "$BASE/run/logical-old"
assertq logical-new 'SHOW data_directory' "$BASE/run/logical-new"
assertq logical-old "SELECT current_setting('server_version_num')::int / 10000" 17
assertq logical-new "SELECT current_setting('server_version_num')::int / 10000" 18
q logical-old 'SELECT version(); SELECT system_identifier FROM pg_control_system();' > logical-source-identity.txt
q logical-new 'SELECT version(); SELECT system_identifier FROM pg_control_system();' > logical-target-identity.txt
load logical-old
q logical-old 'CREATE ROLE shop_runtime LOGIN; GRANT USAGE ON SCHEMA public TO shop_runtime; GRANT SELECT,INSERT,UPDATE,DELETE ON ALL TABLES IN SCHEMA public TO shop_runtime; GRANT USAGE,SELECT ON ALL SEQUENCES IN SCHEMA public TO shop_runtime; CREATE PUBLICATION shop_all FOR ALL TABLES;'
# Schema only; grants name a separate target role. The role starts without writing privileges.
q logical-new 'CREATE ROLE shop_runtime LOGIN;'
"$B18/pg_dump" -h "$BASE/run/logical-old-socket" -p 55432 -U postgres -d postgres --schema-only --no-owner --no-acl > logical-schema.sql
"$B18/psql" -X -v ON_ERROR_STOP=1 -h "$BASE/run/logical-new-socket" -p 55432 -U postgres -d postgres -f logical-schema.sql
q logical-new "CREATE SUBSCRIPTION shop_move CONNECTION 'host=$BASE/run/logical-old-socket port=55432 dbname=postgres user=postgres' PUBLICATION shop_all WITH (copy_data=true);"
waitq(){ local name=$1 sql=$2 expected=$3; for attempt in $(seq 1 100); do [[ "$(q "$name" "$sql")" = "$expected" ]] && return 0; sleep 0.2; done; printf 'Timed out: %s\n' "$sql"; exit 1; }
waitq logical-new "SELECT count(*)=6 AND bool_and(srsubstate='r') FROM pg_subscription_rel" t
assertq logical-new "SELECT count(*) FROM orders" 3
# Counterexample: target rows are present but its sequence is still at its initial state.
assertq logical-new "SELECT last_value||'|'||is_called FROM order_number" '1|false'
# Close fixture's only application writer identity. No other app sessions are started.
q logical-old 'REVOKE INSERT,UPDATE,DELETE ON ALL TABLES IN SCHEMA public FROM shop_runtime; REVOKE USAGE,SELECT ON ALL SEQUENCES IN SCHEMA public FROM shop_runtime;'
if "$B18/psql" -X -v ON_ERROR_STOP=1 -h "$BASE/run/logical-old-socket" -p 55432 -U shop_runtime -d postgres -c "UPDATE products SET price=2.20 WHERE product_id='P7'" > excluded-source.txt 2>&1; then exit 1; fi
# All required shop writes precede B. A published marker transaction follows B.
boundary=$(q logical-old 'SELECT pg_current_wal_insert_lsn()')
q logical-old "INSERT INTO migration_marker VALUES('closed-shop');"
origin=$(q logical-new "SELECT 'pg_'||oid FROM pg_subscription WHERE subname='shop_move'")
waitq logical-new "SELECT pg_replication_origin_progress('$origin',true) >= '$boundary'::pg_lsn AND EXISTS(SELECT FROM migration_marker WHERE marker='closed-shop')" t
printf 'PASS closed source B=%s; exact subscription origin=%s; durable applied progress=' "$boundary" "$origin"
q logical-new "SELECT pg_replication_origin_progress('$origin',true)"
for table in customers products orders order_items payments; do
 q logical-old "SELECT row_to_json(t) FROM (SELECT * FROM $table ORDER BY 1,2) t" > "source-$table.txt"
 q logical-new "SELECT row_to_json(t) FROM (SELECT * FROM $table ORDER BY 1,2) t" > "target-$table.txt"
 cmp "source-$table.txt" "target-$table.txt"
 printf 'PASS full exact table %s comparison\n' "$table"
done
assertq logical-new "SELECT status||'|'||(SELECT sum(quantity*unit_price)::text FROM order_items WHERE order_id=103)||'|'||(SELECT count(*) FROM payments WHERE order_id=103) FROM orders WHERE order_id=103" 'pending|29.00|0'
q logical-new "SELECT setval('order_number',103,true); GRANT USAGE ON SCHEMA public TO shop_runtime; GRANT SELECT,INSERT,UPDATE,DELETE ON ALL TABLES IN SCHEMA public TO shop_runtime; GRANT USAGE,SELECT ON ALL SEQUENCES IN SCHEMA public TO shop_runtime; ALTER SUBSCRIPTION shop_move DISABLE;"
"$B18/psql" -X -v ON_ERROR_STOP=1 -h "$BASE/run/logical-new-socket" -p 55432 -U shop_runtime -d postgres -c "BEGIN; UPDATE products SET price=22.00 WHERE product_id='P7'; ROLLBACK;" > target-validation.txt
# Consumes a fixture-only sequence value; it creates no order row.
assertq logical-new "SELECT nextval('order_number')" 104
assertq logical-new "SELECT price::text FROM products WHERE product_id='P7'" '20.00'
# First committed authoritative change exists only on target.
"$B18/psql" -X -v ON_ERROR_STOP=1 -h "$BASE/run/logical-new-socket" -p 55432 -U shop_runtime -d postgres -c "UPDATE products SET price=22.00 WHERE product_id='P7';" > target-first-write.txt
assertq logical-new "SELECT price::text FROM products WHERE product_id='P7'" '22.00'
assertq logical-old "SELECT price::text FROM products WHERE product_id='P7'" '20.00'
assertq logical-new "SELECT sum(quantity*unit_price)::text FROM order_items WHERE order_id=103" '29.00'
printf 'ALL BOUNDED CHECKS PASSED. No workload duration, external effects or production fencing tested.\n'
