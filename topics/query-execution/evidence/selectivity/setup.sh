#!/bin/bash
# setup.sh — selectivity lab (pilot-query-execution re-run of round-3 t3-selectivity)
# Starts a fresh Postgres 16 container from the locally cached postgres:16-alpine image.
# Container: pilot-sel, host port 54315 -> 5432. Nothing installed on the host;
# all SQL goes through `docker exec -i pilot-sel psql -U postgres -X`.
set -uo pipefail

docker run -d --name pilot-sel -e POSTGRES_PASSWORD=pilotpw -p 54315:5432 postgres:16-alpine

# Readiness: poll pg_isready, then prove it with a real query.
for i in $(seq 1 60); do
  if docker exec pilot-sel pg_isready -U postgres >/dev/null 2>&1; then break; fi
  sleep 1
done
docker exec pilot-sel psql -U postgres -X -c "SELECT 1 AS ready;"
docker exec pilot-sel psql -U postgres -X -c "SELECT version();"
