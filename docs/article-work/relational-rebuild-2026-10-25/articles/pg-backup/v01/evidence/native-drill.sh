#!/bin/bash
# Root-owned fixture execution only. No provision/initdb/install/container lifecycle.
set -euo pipefail
umask 077
export PATH=/usr/lib/postgresql/18/bin:/usr/bin:/bin
unset PGHOST PGPORT PGDATABASE PGUSER PGSERVICE PGSERVICEFILE PGPASSFILE PGOPTIONS PGHOSTADDR PGSSLMODE PGTARGETSESSIONATTRS
ROOT=/tmp/sc-pg-backup-20261025
SOURCE=/var/lib/postgresql/18/docker
DB=sc_pg_backup
ROLE=sc_pg_backup_writer
: "${SC_EXPECTED_SYSID:?Root must supply exact disposable system identifier}"
test "$(id -un)" = postgres
test -f "$ROOT/ROOT-OWNED-FIXTURE"
test "$(cat "$ROOT/ROOT-OWNED-FIXTURE")" = staycurrent-pg-backup-20261025
checked_sql() {
 local socket=$1 port=$2 database=$3 data cluster
 case "$socket:$port:$database" in
  /var/run/postgresql:5432:sc_pg_backup|/var/run/postgresql:5432:sc_pg_backup_logical)
    data="$SOURCE"; cluster=staycurrent-pg-backup-20261025 ;;
  "$ROOT/sockets/restore:55432:sc_pg_backup")
    data="$ROOT/restore"; cluster=staycurrent-pg-backup-restore-20261025 ;;
  "$ROOT/sockets/gap:55433:sc_pg_backup")
    data="$ROOT/gap"; cluster=staycurrent-pg-backup-gap-20261025 ;;
  *) exit 65 ;;
 esac
 local guard
 guard="DO \$sc_guard\$ BEGIN
 IF current_database() <> '$database' OR session_user <> '$ROLE'
 OR current_setting('server_version_num') <> '180006'
 OR (SELECT system_identifier::text FROM pg_control_system()) <> '$SC_EXPECTED_SYSID'
 OR current_setting('data_directory') <> '$data'
 OR current_setting('cluster_name') <> '$cluster'
 OR current_setting('listen_addresses') <> ''
 THEN RAISE EXCEPTION 'Wrong disposable fixture identity'; END IF;
 END \$sc_guard\$;"
 psql -X -q -v ON_ERROR_STOP=1 -h "$socket" -p "$port" -U "$ROLE" -d "$database" -c "$guard" "${@:4}"
}
[[ "$SC_EXPECTED_SYSID" =~ ^[0-9]+$ ]]
sql() { checked_sql "$1" "$2" "$DB" "${@:3}"; }
source_sql() { sql /var/run/postgresql 5432 "$@"; }
identity() {
 local socket=$1 port=$2 data=$3
 test "$(sql "$socket" "$port" -Atc 'select system_identifier from pg_control_system()')" = "$SC_EXPECTED_SYSID"
 test "$(sql "$socket" "$port" -Atc 'show data_directory')" = "$data"
 test "$(sql "$socket" "$port" -Atc 'show listen_addresses')" = ''
 test "$(sql "$socket" "$port" -Atc 'show server_version_num')" = 180006
}
facts() { sql "$1" "$2" -Atc "select (select price from products where product_id='P7'),status,(select sum(quantity*unit_price) from order_items where order_id=103),(select coalesce(sum(amount),0)::numeric(8,2) from payments where order_id=103),(select string_agg(stock::text,',' order by product_id) from products) from orders where order_id=103"; }
case "${1:?phase required}" in
 source)
 identity /var/run/postgresql 5432 "$SOURCE"
 test "$(source_sql -Atc 'show cluster_name')" = staycurrent-pg-backup-20261025
 test "$(source_sql -Atc 'show archive_mode')" = on
 test "$(source_sql -Atc 'show wal_level')" = replica
 test "$(source_sql -Atc "select count(*) from pg_class where relnamespace='public'::regnamespace and relkind='r'")" = 0
 test ! -e "$ROOT/base/backup_manifest"
 source_sql -f "$ROOT/seed.sql"
 test "$(facts /var/run/postgresql 5432)" = '20.00|pending|29.00|0.00|10,0,4'
 source_sql -Atc 'select version(); select system_identifier from pg_control_system(); select timeline_id from pg_control_checkpoint();' > "$ROOT/logs/source-identity.txt"
 pg_dump -h /var/run/postgresql -p 5432 -U "$ROLE" -d "$DB" --format=custom --file="$ROOT/logical/shop.dump"
 pg_basebackup -h /var/run/postgresql -p 5432 -U "$ROLE" -D "$ROOT/base" --format=plain --wal-method=stream --checkpoint=fast --manifest-checksums=SHA256 > "$ROOT/logs/base.txt" 2>&1
 pg_verifybackup "$ROOT/base" > "$ROOT/logs/verify-base.txt" 2>&1
 # Ensure the marker is in a segment after the WAL bundled with the backup.
 source_sql -Atc 'select pg_switch_wal();' > "$ROOT/logs/post-base-switch.txt"
 source_sql -Atc "select pg_create_restore_point('before_price_mistake');" > "$ROOT/logs/target-lsn.txt"
 source_sql -Atc "select pg_walfile_name('$(cat "$ROOT/logs/target-lsn.txt")'::pg_lsn);" > "$ROOT/logs/target-segment.txt"
 source_sql -c "update products set price=2.20 where product_id='P7';"
 source_sql -c "begin; insert into payments values(504,103,10.00,'card'); insert into payment_operations values('order-103-part-payment-1',103,10.00,'card',504); commit;"
 source_sql -Atc "select pg_create_restore_point('after_payment');" > "$ROOT/logs/after-payment-lsn.txt"
 source_sql -Atc "select pg_walfile_name('$(cat "$ROOT/logs/after-payment-lsn.txt")'::pg_lsn);" > "$ROOT/logs/after-payment-segment.txt"
 source_sql -Atc 'select pg_switch_wal();' > "$ROOT/logs/final-switch.txt"
 for n in $(seq 1 60); do
   if test -f "$ROOT/archive/$(cat "$ROOT/logs/target-segment.txt")" && test -f "$ROOT/archive/$(cat "$ROOT/logs/after-payment-segment.txt")"; then break; fi
   sleep 1
 done
 test -f "$ROOT/archive/$(cat "$ROOT/logs/target-segment.txt")"
 test -f "$ROOT/archive/$(cat "$ROOT/logs/after-payment-segment.txt")"
 test "$(facts /var/run/postgresql 5432)" = '2.20|pending|29.00|10.00|10,0,4'
 source_sql -c 'select archived_count,last_archived_wal,failed_count,last_failed_wal from pg_stat_archiver;' > "$ROOT/logs/archiver.txt"
 facts /var/run/postgresql 5432 > "$ROOT/logs/source-facts.txt"
 ;;
 prepare)
 test -f "$ROOT/base/backup_manifest"
 pg_verifybackup "$ROOT/base" > "$ROOT/logs/verify-before-copy.txt" 2>&1
 test -z "$(ls -A "$ROOT/restore")"
 test -z "$(ls -A "$ROOT/gap")"
 cp -a "$ROOT/base/." "$ROOT/restore/"
 cp -a "$ROOT/base/." "$ROOT/gap/"
 test ! -e "$ROOT/archive-gap"
 mkdir "$ROOT/archive-gap"
 cp -a "$ROOT/archive/." "$ROOT/archive-gap/"
 segment=$(cat "$ROOT/logs/target-segment.txt")
 [[ "$segment" =~ ^[0-9A-F]{24}$ ]]
 # The sole removal is from the copied archive, never the original.
 mv "$ROOT/archive-gap/$segment" "$ROOT/logs/withheld-$segment"
 for target in restore gap; do
   data="$ROOT/$target"
   test ! -f "$data/postmaster.pid"
   test ! -f "$data/standby.signal"
   # Base backup included only its own consistency WAL. Confirm omitted later file absent.
   test ! -f "$data/pg_wal/$segment"
   archive="$ROOT/archive"
   name=before_price_mistake
   port=55432
   if test "$target" = gap; then archive="$ROOT/archive-gap"; name=after_payment; port=55433; fi
   cat > "$data/postgresql.auto.conf" <<CFG
cluster_name = 'staycurrent-pg-backup-$target-20261025'
listen_addresses = ''
port = $port
unix_socket_directories = '$ROOT/sockets/$target'
archive_mode = 'off'
primary_conninfo = ''
primary_slot_name = ''
restore_command = 'cp $archive/%f %p'
recovery_target_name = '$name'
recovery_target_timeline = '1'
recovery_target_action = 'pause'
hot_standby = 'on'
CFG
   touch "$data/recovery.signal"
 done
 ;;
 paused)
 identity "$ROOT/sockets/restore" 55432 "$ROOT/restore"
 test "$(sql "$ROOT/sockets/restore" 55432 -Atc "select pg_is_in_recovery() and pg_get_wal_replay_pause_state()='paused'")" = t
 test "$(facts "$ROOT/sockets/restore" 55432)" = '20.00|pending|29.00|0.00|10,0,4'
 test "$(sql "$ROOT/sockets/restore" 55432 -Atc 'select count(*) from payment_operations')" = 0
 sql "$ROOT/sockets/restore" 55432 -c 'select pg_is_in_recovery(), pg_get_wal_replay_pause_state(),pg_last_wal_replay_lsn();' > "$ROOT/logs/paused-state.txt"
 facts "$ROOT/sockets/restore" 55432 > "$ROOT/logs/paused-facts.txt"
 ;;
 logical)
 identity /var/run/postgresql 5432 "$SOURCE"
 test "$(source_sql -Atc "select count(*) from pg_database where datname='sc_pg_backup_logical'")" = 0
 source_sql -c 'create database sc_pg_backup_logical template template0;'
 pg_restore -h /var/run/postgresql -p 5432 -U "$ROLE" -d sc_pg_backup_logical --exit-on-error --single-transaction "$ROOT/logical/shop.dump" > "$ROOT/logs/logical-restore.txt" 2>&1
 checked_sql /var/run/postgresql 5432 sc_pg_backup_logical -c "select product_id,price,stock from products order by product_id; select count(*) from payments where payment_id=504; select extname,extversion from pg_extension; select tablename,tableowner from pg_tables where schemaname='public';" > "$ROOT/logs/logical-facts.txt"
 test "$(checked_sql /var/run/postgresql 5432 sc_pg_backup_logical -Atc "select price from products where product_id='P7'")" = 20.00
 ;;
 reconcile)
 # Root must close/fence source and finish target recovery before this phase.
 test -f "$ROOT/SOURCE-CLOSED"
 identity "$ROOT/sockets/restore" 55432 "$ROOT/restore"
 test "$(sql "$ROOT/sockets/restore" 55432 -Atc 'select pg_is_in_recovery()')" = f
 test "$(facts "$ROOT/sockets/restore" 55432)" = '20.00|pending|29.00|0.00|10,0,4'
 sql "$ROOT/sockets/restore" 55432 -f "$ROOT/reconcile.sql"
 sql "$ROOT/sockets/restore" 55432 -f "$ROOT/reconcile.sql"
 test "$(facts "$ROOT/sockets/restore" 55432)" = '20.00|pending|29.00|10.00|10,0,4'
 test "$(sql "$ROOT/sockets/restore" 55432 -Atc 'select count(*) from payments where payment_id=504')" = 1
 facts "$ROOT/sockets/restore" 55432 > "$ROOT/logs/reconciled-facts.txt"
 sql "$ROOT/sockets/restore" 55432 -Atc 'select timeline_id from pg_control_checkpoint();' > "$ROOT/logs/recovered-timeline.txt"
 ;;
 *) exit 64;;
esac
