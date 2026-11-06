#!/bin/bash
# A client killed one second into an eight-second query: does its backend keep running?
# Run once with client_connection_check_interval off (the default) and once at 250 ms.
P="psql -h 127.0.0.1 -p 5498 -U postgres -d postgres"
for interval in 0 250ms; do
  echo "# client_connection_check_interval = $interval"
  PGOPTIONS="-c client_connection_check_interval=$interval" \
    $P -Atc "select pg_sleep(8) /*killed*/" > /dev/null 2>&1 &
  CLIENT=$!
  sleep 1
  kill -9 $CLIENT; wait $CLIENT 2>/dev/null
  echo "  t=1.0 s: client process $CLIENT killed with SIGKILL"
  for t in 1.5 3 7.5 9; do
    sleep_for=$(python3 -c "print({'1.5':0.5,'3':1.5,'7.5':4.5,'9':1.5}['$t'])")
    sleep $sleep_for
    echo "  t=$t s: $($P -Atc "select count(*) || ' backend(s) still active, running for ' || coalesce(max(round(extract(epoch from clock_timestamp() - query_start)::numeric, 1))::text, '-') || ' s' from pg_stat_activity where query like '%/*killed*/%' and state = 'active' and pid <> pg_backend_pid()")"
  done
  sleep 1
done
