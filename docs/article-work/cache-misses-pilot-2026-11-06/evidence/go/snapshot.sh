#!/bin/bash
# Start the unprotected 600 ms stampede (400 requests a second for one expired key),
# then snapshot the active client backends in pg_stat_activity about 0.6 s after the
# first request. Ages use clock_timestamp(), the time of the snapshot itself.
cd "$1"
./pilot -exp stampede -mode naive -rate 400 -fill 600 > run.out 2>&1 &
sleep ${2:-0.62}
psql -h 127.0.0.1 -p 5498 -U postgres -d postgres -c "select wait_event, count(*), min(clock_timestamp() - query_start) as newest,
       max(clock_timestamp() - query_start) as oldest, left(query, 40) as query
from pg_stat_activity
where backend_type = 'client backend' and state = 'active' and pid <> pg_backend_pid()
group by 1, 5 order by 2 desc;"
wait
cat run.out
