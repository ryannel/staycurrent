#!/bin/bash
# Local disposable archive helper, not a production storage-durability design.
set -euo pipefail
root=/tmp/sc-pg-backup-20261025
test "$(cat "$root/ROOT-OWNED-FIXTURE")" = staycurrent-pg-backup-20261025
test "$#" = 2
source_file=$1
wal_name=$2
[[ "$wal_name" =~ ^([0-9A-F]{24}|[0-9A-F]{8}\.history|[0-9A-F]{24}\.[0-9A-F]{8}\.backup)$ ]]
case "$source_file" in
  pg_wal/*|/var/lib/postgresql/18/docker/pg_wal/*) ;;
  *) exit 65 ;;
esac
test "${source_file##*/}" = "$wal_name"
test -f "$source_file"
destination="$root/archive/$wal_name"
if test -e "$destination"; then
  cmp -s -- "$source_file" "$destination"
else
  temporary="$destination.tmp.$$"
  trap 'rm -f -- "$temporary"' EXIT
  cp -- "$source_file" "$temporary"
  chmod 600 "$temporary"
  mv -- "$temporary" "$destination"
  trap - EXIT
fi
