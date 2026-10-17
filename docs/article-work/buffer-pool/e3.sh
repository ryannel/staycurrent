#!/bin/sh
# Restart with and without autoprewarm. PGDATA points at the scratch cluster
# (shared_buffers = 16MB, shared_preload_libraries = 'pg_prewarm', port 54371).
export LANG=C LC_ALL=C
q() { psql -h 127.0.0.1 -p 54371 -U postgres "$@"; }
q -q -c "SELECT * FROM pg_buffercache_evict_all();" \
     -c "DO \$\$ BEGIN FOR i IN 1..5 LOOP PERFORM sum(price) FROM products; END LOOP; END \$\$;" \
     -c "SELECT autoprewarm_dump_now();"
pg_ctl -D "$PGDATA" -w restart; sleep 3
q -f snap.sql
q -c "EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF) SELECT sum(price) FROM products;"
echo "pg_prewarm.autoprewarm = off" >> "$PGDATA/postgresql.conf"
pg_ctl -D "$PGDATA" -w restart; sleep 2
q -f snap.sql
q -c "EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF) SELECT sum(price) FROM products;"
q -c "SELECT pg_prewarm('products'), pg_prewarm('products_pkey');"
q -f snap.sql
