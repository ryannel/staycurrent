#!/bin/bash
# setup.sh — slow-query lab (pilot-query-execution re-run of round-3 ho-slow-query)
# Starts a fresh Postgres 16 container from the locally cached postgres:16-alpine image.
# Container: pilot-slow, host port 54316 -> 5432. Nothing installed on the host;
# all SQL goes through `docker exec -i pilot-slow psql -X -e -U postgres`.
set -uo pipefail

docker run -d --name pilot-slow -e POSTGRES_PASSWORD=pilotpw -p 54316:5432 postgres:16-alpine

# Readiness: poll pg_isready, then prove it with a real query.
for i in $(seq 1 60); do
  if docker exec pilot-slow pg_isready -U postgres >/dev/null 2>&1; then break; fi
  sleep 1
done
docker exec pilot-slow psql -U postgres -X -c "SELECT 1 AS ready;"
docker exec pilot-slow psql -U postgres -X -c "SELECT version();"
