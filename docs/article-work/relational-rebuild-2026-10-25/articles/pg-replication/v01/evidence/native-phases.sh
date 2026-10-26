#!/usr/bin/env bash
# SQL-only phases; root owns container and process lifecycle.
set -euo pipefail
: "${VERIFY_PG_BIN:?Supply absolute binary directory in pinned PG18.6 container}"
: "${VERIFY_SYSTEM_ID:?Supply root-observed primary system identifier}"
[[ "$VERIFY_PG_BIN" = /* && -x "$VERIFY_PG_BIN/psql" ]] || exit 2
[[ "$VERIFY_SYSTEM_ID" =~ ^[0-9]+$ ]] || exit 2
VERIFY_ROOT=/tmp/sc-pg-replication-20261025
VERIFY_STATE="$VERIFY_ROOT/evidence"
mkdir -p "$VERIFY_STATE"
export PATH="$VERIFY_PG_BIN:/usr/bin:/bin"
sql() {
  local name=$1 port query
  query=$2
  case "$name" in primary) port=5432;; a) port=55432;; b) port=55433;; *) exit 2;; esac
  local identity_sql="DO \$identity\$ BEGIN
IF current_database() <> 'sc_pg_replication'
 OR session_user <> 'sc_pg_replication_writer'
 OR (SELECT system_identifier::text FROM pg_control_system()) <> '$VERIFY_SYSTEM_ID'
 OR current_setting('server_version_num') <> '180006'
 OR current_setting('data_directory') <> '$VERIFY_ROOT/$name'
 OR current_setting('cluster_name') <> 'staycurrent-pg-replication-$name-20261025'
 OR current_setting('listen_addresses') <> ''
THEN RAISE EXCEPTION 'Fixture identity mismatch'; END IF;
END \$identity\$;"
  env -i PATH="$PATH" PGCONNECT_TIMEOUT=2 psql -X -qAt -v ON_ERROR_STOP=1 -h "$VERIFY_ROOT/sockets/$name" -p "$port" -U sc_pg_replication_writer -d sc_pg_replication -c "$identity_sql" -c "$query"
}
guard() {
  local name=$1
  [[ $(sql "$name" 'SHOW data_directory') = "$VERIFY_ROOT/$name" ]] || exit 3
  [[ $(sql "$name" 'SELECT system_identifier FROM pg_control_system()') = "$VERIFY_SYSTEM_ID" ]] || exit 3
  [[ $(sql "$name" 'SHOW server_version_num') = 180006 ]] || exit 3
  [[ $(sql "$name" 'SHOW cluster_name') = "staycurrent-pg-replication-$name-20261025" ]] || exit 3
  [[ $(sql "$name" 'SHOW listen_addresses') = '' ]] || exit 3
  echo "IDENTITY VERIFIED $name sysid=$VERIFY_SYSTEM_ID"
}
wait_true() {
  local name=$1 query=$2
  for ((i=0;i<100;i++)); do if [[ $(sql "$name" "$query") = t ]]; then return 0; fi; sleep 0.1; done
  echo "Bounded condition failed: $name $query"; return 1
}
facts() {
  sql "$1" "SELECT p.price,p.stock,o.status,(SELECT sum(quantity*unit_price) FROM order_items WHERE order_id=103),(SELECT count(*) FROM payments WHERE order_id=103) FROM products p CROSS JOIN orders o WHERE product_id='P7' AND order_id=103;"
}
phase=${1:?Choose seed, streaming, durable-gap, remote-apply, ready-to-stop, promoted or returned}
echo "BEGIN PHASE $phase"
case "$phase" in
seed)
  guard primary
  [[ $(sql primary 'SELECT pg_is_in_recovery()') = f ]] || exit 3
  sql primary "SELECT version(); SHOW fsync; SHOW full_page_writes; SHOW synchronous_commit; SHOW synchronous_standby_names;"
  sql primary "CREATE TABLE products(product_id text PRIMARY KEY,name text NOT NULL,price numeric(8,2) NOT NULL CHECK(price>=0),stock integer NOT NULL CHECK(stock>=0));
CREATE TABLE orders(order_id integer PRIMARY KEY,status text NOT NULL);
CREATE TABLE order_items(order_id integer REFERENCES orders,line_no integer,product_id text REFERENCES products,quantity integer,unit_price numeric(8,2),PRIMARY KEY(order_id,line_no));
CREATE TABLE payments(payment_id integer PRIMARY KEY,order_id integer REFERENCES orders,amount numeric(8,2));
INSERT INTO products VALUES('P3','Green tea, 50 g',4.50,10),('P7','Blue mug',20.00,0),('P9','Teapot',35.00,4);
INSERT INTO orders VALUES(103,'pending');
INSERT INTO order_items VALUES(103,1,'P7',1,20.00),(103,2,'P3',2,4.50);"
  facts primary
  ;;
streaming)
  for name in primary a b; do guard "$name"; done
  wait_true primary "SELECT count(*)=2 FROM pg_stat_replication WHERE state='streaming'"
  for name in a b; do
    [[ $(sql "$name" 'SELECT pg_is_in_recovery()') = t ]] || exit 3
    sql "$name" 'SHOW transaction_read_only; SELECT status,sender_host,sender_port,slot_name,receive_start_tli,received_tli,written_lsn,flushed_lsn FROM pg_stat_wal_receiver;'
    facts "$name"
  done
  ;;
durable-gap)
  guard primary; guard a
  [[ ! -e "$VERIFY_ROOT/b/postmaster.pid" ]] || exit 3
  sql a 'SELECT pg_wal_replay_pause();'
  wait_true a "SELECT pg_get_wal_replay_pause_state()='paused'"
  sql primary "ALTER SYSTEM SET synchronous_standby_names='FIRST 1 (shop_a, shop_b)'"
  sql primary 'SELECT pg_reload_conf()'
  wait_true primary "SELECT count(*)=1 FROM pg_stat_replication WHERE application_name='shop_a' AND sync_state='sync'"
  sql primary "BEGIN; SET LOCAL synchronous_commit=on; UPDATE products SET price=22.00 WHERE product_id='P7'; COMMIT;"
  REQUIRED=$(sql primary 'SELECT pg_current_wal_insert_lsn()')
  echo "$REQUIRED" > "$VERIFY_STATE/required-lsn"
  echo "Successful COMMIT observed. Conservative required_lsn=$REQUIRED"
  wait_true a "SELECT pg_last_wal_receive_lsn()>='$REQUIRED'::pg_lsn"
  [[ $(sql a "SELECT price FROM products WHERE product_id='P7'") = 20.00 ]] || exit 4
  [[ $(sql a "SELECT pg_last_wal_replay_lsn()<'$REQUIRED'::pg_lsn") = t ]] || exit 4
  echo 'PASS durable receive reached required boundary while fresh snapshot returns 20.00'
  sql a 'SELECT pg_last_wal_receive_lsn(),pg_last_wal_replay_lsn(),pg_is_in_recovery();'
  sql primary 'SELECT application_name,state,sync_state,sent_lsn,write_lsn,flush_lsn,replay_lsn FROM pg_stat_replication;'
  sql primary 'SELECT slot_name,active,restart_lsn,wal_status,safe_wal_size,invalidation_reason,pg_wal_lsn_diff(pg_current_wal_lsn(),restart_lsn) FROM pg_replication_slots;'
  facts a
  ;;
remote-apply)
  guard primary; guard a
  sql primary "SET application_name='verify_remote_apply'; BEGIN; SET LOCAL synchronous_commit=remote_apply; UPDATE products SET price=22.00 WHERE product_id='P7'; COMMIT;" > "$VERIFY_STATE/remote-apply-client.txt" 2>&1 &
  APPLY_PID=$!
  trap 'kill "$APPLY_PID" 2>/dev/null || true' EXIT
  wait_true primary "SELECT count(*)=1 FROM pg_stat_activity WHERE application_name='verify_remote_apply' AND wait_event='SyncRep'"
  kill -0 "$APPLY_PID"
  echo 'PASS remote_apply client waiting with A replay paused'
  sql a 'SELECT pg_wal_replay_resume();'
  for ((i=0;i<100;i++)); do if ! kill -0 "$APPLY_PID" 2>/dev/null; then break; fi; sleep 0.1; done
  if kill -0 "$APPLY_PID" 2>/dev/null; then echo 'Client completion exceeded 10 s'; exit 4; fi
  wait "$APPLY_PID"
  trap - EXIT
  cat "$VERIFY_STATE/remote-apply-client.txt"
  wait_true a "SELECT price=22.00 FROM products WHERE product_id='P7'"
  echo 'PASS remote_apply COMMIT completed after resume; fresh A read 22.00'
  facts a
  ;;
ready-to-stop)
  guard primary; guard a
  FINAL=$(sql primary 'SELECT pg_current_wal_insert_lsn()')
  echo "$FINAL" > "$VERIFY_STATE/final-required"
  sql primary 'SELECT timeline_id FROM pg_control_checkpoint()' > "$VERIFY_STATE/old-tli"
  wait_true a "SELECT pg_last_wal_replay_lsn()>='$FINAL'::pg_lsn"
  echo "PASS A replay reached final application boundary $FINAL; root may stop primary and preserve exclusion before promotion."
  ;;
promoted)
  guard a
  ROLE=$(sql a 'SELECT pg_is_in_recovery()')
  OLD_TLI=$(cat "$VERIFY_STATE/old-tli")
  CHECKPOINT_TLI=$(sql a 'SELECT timeline_id FROM pg_control_checkpoint()')
  WAL_FILE=$(sql a 'SELECT pg_walfile_name(pg_current_wal_insert_lsn())')
  [[ "$WAL_FILE" =~ ^[0-9A-F]{24}$ ]] || exit 5
  NEW_TLI=$((16#${WAL_FILE:0:8}))
  echo "PROMOTION EVIDENCE recovery=$ROLE old_checkpoint_tli=$OLD_TLI latest_checkpoint_tli=$CHECKPOINT_TLI current_insert_wal_file=$WAL_FILE current_tli=$NEW_TLI"
  [[ ! -e "$VERIFY_ROOT/primary/postmaster.pid" ]] || exit 5
  [[ "$ROLE" = f ]] || exit 5
  [[ "$NEW_TLI" -gt "$OLD_TLI" ]] || exit 5
  [[ $(sql a "SELECT price FROM products WHERE product_id='P7'") = 22.00 ]] || exit 5
  facts a
  echo "PASS promoted A old_tli=$OLD_TLI new_tli=$NEW_TLI C retained"
  sql a "ALTER SYSTEM SET synchronous_standby_names=''"
  sql a 'SELECT pg_reload_conf()'
  ;;
returned)
  guard primary; guard a
  [[ $(sql primary 'SELECT pg_is_in_recovery()') = t ]] || exit 6
  wait_true primary "SELECT price=22.00 FROM products WHERE product_id='P7'"
  sql primary 'SELECT status,sender_host,sender_port,slot_name,received_tli,written_lsn,flushed_lsn FROM pg_stat_wal_receiver;'
  sql a "SELECT application_name,state,sync_state,flush_lsn,replay_lsn FROM pg_stat_replication;"
  sql a "ALTER SYSTEM SET synchronous_standby_names='FIRST 1 (shop_returned)'"
  sql a 'SELECT pg_reload_conf()'
  wait_true a "SELECT count(*)=1 FROM pg_stat_replication WHERE application_name='shop_returned' AND sync_state='sync'"
  sql a "BEGIN; SET LOCAL synchronous_commit=remote_apply; UPDATE products SET price=22.00 WHERE product_id='P7'; COMMIT;"
  facts primary
  echo 'PASS returned copy follows A in recovery; explicit synchronous policy passed remote_apply commit.'
  ;;
*) exit 2;;
esac
echo "END PHASE $phase"
