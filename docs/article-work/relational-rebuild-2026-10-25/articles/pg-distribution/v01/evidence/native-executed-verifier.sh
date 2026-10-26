#!/bin/bash
set -euo pipefail
export PATH=/usr/lib/postgresql/18/bin:/usr/bin:/bin
export LANG=C LC_ALL=C
unset PGHOST PGPORT PGDATABASE PGUSER PGPASSWORD PGSERVICE PGSERVICEFILE PGOPTIONS PGAPPNAME PGPASSFILE
base=/tmp/sc-pg-distribution-20261025
out="$base/results"
mkdir -p "$out"
cleanup() { for n in C S D; do test ! -f "$base/$n/data/postmaster.pid" || pg_ctl -D "$base/$n/data" -m fast -w stop >> "$out/cleanup.txt" 2>&1 || true; done; }
trap cleanup EXIT
for n in C S D; do
 mkdir -p "$base/$n/socket"
 initdb -D "$base/$n/data" -A trust --no-locale > "$out/init-$n.txt"
 pg_ctl -D "$base/$n/data" -l "$out/server-$n.log" -o "-k $base/$n/socket -p 55432 -c listen_addresses='' -c shared_buffers=32MB -c max_connections=12 -c cluster_name=sc-distribution-$n" -w start > "$out/start-$n.txt"
done
sql() { local n=$1; shift; psql -X -v ON_ERROR_STOP=1 -h "$base/$n/socket" -p 55432 -U postgres -d postgres "$@"; }
for n in C S D; do
 sql "$n" -c "SELECT version(),current_database(),current_user,current_setting('data_directory'),current_setting('listen_addresses'),current_setting('cluster_name'); SELECT system_identifier FROM pg_control_system();" > "$out/identity-$n.txt"
 test "$(sql "$n" -Atc "SELECT current_setting('server_version_num')::int=180006 AND current_database()='postgres' AND current_user='postgres' AND current_setting('data_directory')='$base/$n/data' AND current_setting('listen_addresses')='' AND current_setting('cluster_name')='sc-distribution-$n'")" = t
 sql "$n" -Atc "SELECT system_identifier FROM pg_control_system()" >> "$out/system-ids.txt"
done
test "$(sort -u "$out/system-ids.txt" | wc -l)" -eq 3
for n in S D; do
sql "$n" <<'SQL'
CREATE TABLE customers(customer_id int PRIMARY KEY,name text NOT NULL);
CREATE TABLE orders(order_id int PRIMARY KEY,customer_id int NOT NULL REFERENCES customers,placed_at timestamptz NOT NULL,status text NOT NULL);
CREATE TABLE order_items(order_id int REFERENCES orders,line_no int,product_id text NOT NULL,quantity int NOT NULL,unit_price numeric(8,2) NOT NULL,PRIMARY KEY(order_id,line_no));
CREATE TABLE payments(payment_id int PRIMARY KEY,order_id int NOT NULL REFERENCES orders,amount numeric(8,2) NOT NULL,method text NOT NULL);
CREATE TABLE request_results(customer_id int,operation text,token text,payload text,result_order int REFERENCES orders,PRIMARY KEY(customer_id,operation,token));
CREATE TABLE group_gate(group_id text PRIMARY KEY,accepts boolean NOT NULL,epoch int NOT NULL);
INSERT INTO group_gate VALUES('A',false,1);
CREATE FUNCTION recover_purchase(p_token text,p_payload text) RETURNS int LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE r request_results;
BEGIN
 PERFORM 1 FROM group_gate WHERE group_id='A' AND accepts FOR SHARE;
 IF NOT FOUND THEN RAISE EXCEPTION 'group A closed: refresh route or fail'; END IF;
 SELECT * INTO r FROM request_results WHERE customer_id=1 AND operation='purchase' AND token=p_token;
 IF NOT FOUND THEN RAISE EXCEPTION 'new purchase not implemented in this fixture'; END IF;
 IF r.payload<>p_payload THEN RAISE EXCEPTION 'request payload mismatch'; END IF;
 RETURN r.result_order;
END $$;
CREATE ROLE runtime LOGIN;
REVOKE ALL ON FUNCTION recover_purchase(text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION recover_purchase(text,text) TO runtime;
SQL
done
sql S <<'SQL'
INSERT INTO customers VALUES(1,'Mina Shah');
INSERT INTO orders VALUES(101,1,'2026-10-12 09:30+00','paid'),(103,1,'2026-10-20 10:15+00','pending');
INSERT INTO order_items VALUES(101,1,'P3',1,4.50),(101,2,'P9',1,35.00),(103,1,'P7',1,20.00),(103,2,'P3',2,4.50);
INSERT INTO payments VALUES(501,101,30.00,'card'),(502,101,9.50,'gift card');
INSERT INTO request_results VALUES(1,'purchase','purchase-103','P7:1:20.00;P3:2:4.50',103);
UPDATE group_gate SET accepts=true WHERE group_id='A';
ANALYZE;
SQL
sql C <<SQL
CREATE TABLE routes(group_id text PRIMARY KEY,owner text NOT NULL,epoch int NOT NULL);
INSERT INTO routes VALUES('A','S',1);
CREATE EXTENSION postgres_fdw;
CREATE SERVER source FOREIGN DATA WRAPPER postgres_fdw OPTIONS(host '$base/S/socket',port '55432',dbname 'postgres');
CREATE USER MAPPING FOR CURRENT_USER SERVER source OPTIONS(user 'postgres');
CREATE SCHEMA remote;
IMPORT FOREIGN SCHEMA public LIMIT TO(orders,order_items) FROM SERVER source INTO remote;
EXPLAIN(VERBOSE,COSTS OFF) SELECT order_id,status FROM remote.orders WHERE customer_id=1 ORDER BY order_id;
SELECT order_id,status FROM remote.orders WHERE customer_id=1 ORDER BY order_id;
EXPLAIN(VERBOSE,COSTS OFF) SELECT o.order_id,sum(i.quantity*i.unit_price) AS line_value FROM remote.orders o JOIN remote.order_items i USING(order_id) WHERE o.customer_id=1 GROUP BY o.order_id ORDER BY o.order_id;
SELECT o.order_id,sum(i.quantity*i.unit_price) AS line_value FROM remote.orders o JOIN remote.order_items i USING(order_id) WHERE o.customer_id=1 GROUP BY o.order_id ORDER BY o.order_id;
SQL
# One admitted runtime transaction holds a shared gate lock. Closing waits for it.
PGAPPNAME=admitted sql S -c "BEGIN; SET ROLE runtime; SELECT recover_purchase('purchase-103','P7:1:20.00;P3:2:4.50'); SELECT pg_sleep(2); COMMIT;" > "$out/admitted.txt" & admitted=$!
for attempt in {1..100}; do
 active=$(sql S -Atc "SELECT count(*) FROM pg_stat_activity WHERE application_name='admitted' AND wait_event='PgSleep'")
 test "$active" != 1 || break
 sleep .03
done
test "$active" = 1
PGAPPNAME=close_gate sql S -c "UPDATE group_gate SET accepts=false WHERE group_id='A';" > "$out/close-gate.txt" & closer=$!
for attempt in {1..100}; do
 blocked=$(sql S -Atc "SELECT count(*) FROM pg_stat_activity WHERE application_name='close_gate' AND wait_event_type='Lock'")
 test "$blocked" != 1 || break
 sleep .02
done
test "$blocked" = 1
sql S -c "SELECT application_name,wait_event_type,wait_event FROM pg_stat_activity WHERE application_name IN('admitted','close_gate') ORDER BY application_name;" > "$out/drain-observed.txt"
wait "$admitted"; wait "$closer"
# Closed-source copy includes relationships and durable request outcome.
for table in customers orders order_items payments request_results; do
 sql S -c "\copy $table TO '$out/$table.csv' CSV"
 sql D -c "\copy $table FROM '$out/$table.csv' CSV"
 sql S -Atc "SELECT row_to_json(t) FROM (SELECT * FROM $table ORDER BY 1,2) t" > "$out/S-$table.jsonl"
 sql D -Atc "SELECT row_to_json(t) FROM (SELECT * FROM $table ORDER BY 1,2) t" > "$out/D-$table.jsonl"
 cmp "$out/S-$table.jsonl" "$out/D-$table.jsonl"
done
sql D -c "SELECT count(*) AS copied_orders FROM orders; SELECT sum(quantity*unit_price) AS order_103_value FROM order_items WHERE order_id=103; SELECT * FROM group_gate;" > "$out/copied-closed.txt"
test "$(sql D -Atc "SELECT (SELECT count(*) FROM orders)=2 AND (SELECT sum(quantity*unit_price) FROM order_items WHERE order_id=103)=29 AND NOT EXISTS(SELECT FROM payments WHERE order_id=103) AND NOT (SELECT accepts FROM group_gate WHERE group_id='A')")" = t
# Persist decision before opening D. This fixture has no automatic controller or failover.
sql C -c "UPDATE routes SET owner='D',epoch=2 WHERE group_id='A' AND owner='S' AND epoch=1; TABLE routes;" > "$out/route.txt"
test "$(sql C -Atc "SELECT count(*)=1 AND bool_and(owner='D' AND epoch=2) FROM routes WHERE group_id='A'")" = t
sql D -c "UPDATE group_gate SET accepts=true,epoch=2 WHERE group_id='A';" > "$out/open-D.txt"
if sql S -c "SET ROLE runtime; SELECT recover_purchase('purchase-103','P7:1:20.00;P3:2:4.50');" > "$out/stale-S.txt" 2>&1; then exit 1; fi
sql D -c "SET ROLE runtime; SELECT recover_purchase('purchase-103','P7:1:20.00;P3:2:4.50');" > "$out/retry-D.txt"
test "$(sql D -qAtc "SET ROLE runtime; SELECT recover_purchase('purchase-103','P7:1:20.00;P3:2:4.50');")" = 103
if sql D -c "SET ROLE runtime; SELECT recover_purchase('purchase-103','P7:2:20.00;P3:2:4.50');" > "$out/payload-mismatch.txt" 2>&1; then exit 1; fi
grep -q 'group A closed: refresh route or fail' "$out/stale-S.txt"
grep -q 'request payload mismatch' "$out/payload-mismatch.txt"
test "$(sql S -Atc "SELECT NOT accepts FROM group_gate WHERE group_id='A'")" = t
test "$(sql D -Atc "SELECT accepts AND epoch=2 FROM group_gate WHERE group_id='A'")" = t
# Counterexample in a rolled-back admin transaction: a route alone never closes S.
sql S -c "BEGIN; UPDATE group_gate SET accepts=true WHERE group_id='A'; SET ROLE runtime; SELECT recover_purchase('purchase-103','P7:1:20.00;P3:2:4.50') AS unsafe_old_owner_still_accepts; ROLLBACK;" > "$out/no-gate-counterexample.txt"
sql S -c "TABLE group_gate;" > "$out/final-S.txt"
sql D -c "TABLE group_gate; SELECT count(*) AS results FROM request_results;" > "$out/final-D.txt"
echo 'PASS: native FDW, observed drain, exact closed copy, persisted route, stale-source refusal, retry and payload checks'
