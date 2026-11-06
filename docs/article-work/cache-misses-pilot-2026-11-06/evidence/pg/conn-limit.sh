#!/bin/bash
# Connection-limit check on PostgreSQL 16 with default max_connections and
# superuser_reserved_connections; role "filler" is a non-superuser login role.
S=${1:?usage: conn-limit.sh <scratch dir>}; P="psql -h 127.0.0.1 -p 5498 -d postgres"
mkdir -p "$S/conn"; rm -f "$S"/conn/*.out
echo "# $($P -U postgres -Atc 'select version()')"
echo "# max_connections=$($P -U postgres -Atc 'show max_connections') superuser_reserved_connections=$($P -U postgres -Atc 'show superuser_reserved_connections') reserved_connections=$($P -U postgres -Atc 'show reserved_connections')"
echo "# opening 100 connections as non-superuser role filler, one every 20 ms, each running pg_sleep(10)"
for i in $(seq 1 100); do ($P -U filler -Atc "select pg_sleep(10)" > $S/conn/f$i.out 2>&1 &); sleep 0.02; done
sleep 2
echo "# client backends by role:"; $P -U postgres -Atc "select usename, count(*) from pg_stat_activity where backend_type='client backend' and pid<>pg_backend_pid() group by 1"
for i in $(seq 1 100); do if [ -s $S/conn/f$i.out ]; then echo "filler connection $i: $(cat $S/conn/f$i.out)"; fi; done
echo "# now opening 4 superuser connections"
for i in 1 2 3 4; do ($P -U postgres -Atc "select pg_sleep(4)" > $S/conn/s$i.out 2>&1 &); sleep 0.1; done
sleep 1
for i in 1 2 3 4; do echo "superuser connection $i: $( [ -s $S/conn/s$i.out ] && cat $S/conn/s$i.out || echo connected)"; done
wait; sleep 9
