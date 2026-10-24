#!/bin/sh
set -eu
work=/private/tmp/staycurrent-relational-20261024-r01
bin=/opt/homebrew/opt/postgresql@18/bin
owned=$(mktemp -d /private/tmp/staycurrent-r01-pg.XXXXXX)
printf '%s\n' "$work" > "$owned/OWNER"
cleanup() {
  if [ -f "$owned/OWNER" ] && [ "$(cat "$owned/OWNER")" = "$work" ]; then
    env -i PATH="$bin:/usr/bin:/bin" LC_ALL=C "$bin/pg_ctl" -D "$owned/data" stop -m fast >/dev/null 2>&1 || true
    rm -rf "$owned"
  fi
}
trap cleanup EXIT HUP INT TERM
mkdir "$owned/socket"
env -i PATH="$bin:/usr/bin:/bin" LC_ALL=C "$bin/initdb" -D "$owned/data" -A trust --no-locale -E UTF8 > "$work/evidence/initdb.txt"
env -i PATH="$bin:/usr/bin:/bin" LC_ALL=C "$bin/pg_ctl" -D "$owned/data" -l "$owned/server.log" -o "-k $owned/socket -p 54871 -c listen_addresses=''" start > "$work/evidence/server-start.txt"
actual=$(env -i PATH="$bin:/usr/bin:/bin" LC_ALL=C "$bin/psql" -X -h "$owned/socket" -p 54871 -d postgres -Atqc 'SHOW data_directory')
[ "$actual" = "$owned/data" ] || exit 1
{
  printf 'Owned disposable data directory verified: %s\n' "$actual"
  env -i PATH="$bin:/usr/bin:/bin" LC_ALL=C "$bin/psql" -X -h "$owned/socket" -p 54871 -d postgres -Atqc 'SELECT version();'
} > "$work/evidence/native-environment.txt"
env -i PATH="$bin:/usr/bin:/bin" LC_ALL=C "$bin/psql" -X -h "$owned/socket" -p 54871 -d postgres -v ON_ERROR_STOP=1 -f "$work/src/components/relational-collection/r01/downloads/modelling.sql" > "$work/evidence/modelling-result.txt" 2>&1
cp "$owned/server.log" "$work/evidence/server-log.txt"
