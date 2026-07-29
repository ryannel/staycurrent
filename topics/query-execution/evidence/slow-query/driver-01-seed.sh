#!/bin/bash
# driver-01-seed.sh — adapted copy of round-3 ho-slow-query 01-seed.sql
# (SQL reconstructed verbatim from round-3/evidence/ho-slow-query/raw/01-seed.log,
# whose "input SQL (verbatim)" section embeds it). Target container: pilot-slow.
# setseed(0.42) as in the original, so the data (incl. the heavy-user skew and
# the victim user) should reproduce exactly.
set -uo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
LOG="$DIR/raw/01-seed.log"

SQL=$(cat <<'SQL'
\timing on
SELECT setseed(0.42);

CREATE TABLE users (
  id    bigserial PRIMARY KEY,
  email text UNIQUE
);

CREATE TABLE orders (
  id         bigserial PRIMARY KEY,
  user_id    bigint NOT NULL,
  created_at timestamptz NOT NULL,
  status     text NOT NULL
);

CREATE TABLE order_items (
  id         bigserial PRIMARY KEY,
  order_id   bigint NOT NULL,
  product_id int,
  qty        int
);

-- NOTE: deliberately NO index on orders(user_id) and NO index on order_items(order_id).
-- Only the PKs and the users.email unique constraint exist.

-- ~200,000 users
INSERT INTO users (email)
SELECT 'user' || g || '@example.com'
FROM generate_series(1, 200000) g;

-- 950,000 orders spread uniformly across all users, over the past ~2 years
INSERT INTO orders (user_id, created_at, status)
SELECT 1 + floor(random() * 200000)::bigint,
       now() - (random() * interval '730 days'),
       (ARRAY['pending','paid','shipped','cancelled','refunded'])[1 + floor(random() * 5)::int]
FROM generate_series(1, 950000);

-- 50,000 more orders concentrated on 25 "heavy" users (ids 1..25) -> skew
INSERT INTO orders (user_id, created_at, status)
SELECT 1 + floor(random() * 25)::bigint,
       now() - (random() * interval '730 days'),
       (ARRAY['pending','paid','shipped','cancelled','refunded'])[1 + floor(random() * 5)::int]
FROM generate_series(1, 50000);

-- ~3,000,000 order items across random orders (avg ~3 per order)
INSERT INTO order_items (order_id, product_id, qty)
SELECT 1 + floor(random() * 1000000)::bigint,
       1 + floor(random() * 20000)::int,
       1 + floor(random() * 4)::int
FROM generate_series(1, 3000000);

ANALYZE users;
ANALYZE orders;
ANALYZE order_items;

SELECT count(*) AS users_rows FROM users;
SELECT count(*) AS orders_rows FROM orders;
SELECT count(*) AS order_items_rows FROM order_items;

\d orders
\d order_items

SELECT pg_size_pretty(pg_total_relation_size('users'))       AS users_total,
       pg_size_pretty(pg_total_relation_size('orders'))      AS orders_total,
       pg_size_pretty(pg_total_relation_size('order_items')) AS order_items_total;

-- Scenario setup: identify a real heavy user to be the "victim" of the incident query
SELECT u.id, u.email, count(*) AS order_count
FROM orders o JOIN users u ON u.id = o.user_id
GROUP BY u.id, u.email
ORDER BY order_count DESC
LIMIT 5;
SQL
)

VICTIM_SQL="SELECT count(*) AS user2_orders_last_90d FROM orders WHERE user_id = 2 AND created_at > now() - interval '90 days';"

{
  echo "# Command: driver-01-seed.sh -> docker exec -i pilot-slow psql -X -e -U postgres (SQL embedded below)"
  echo "# Run at (host, UTC): $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
  echo "# ---- input SQL (verbatim) ----"
  printf '%s\n' "$SQL"
  echo "# ---- output (verbatim) ----"
} > "$LOG"

rc=0
printf '%s\n' "$SQL" | docker exec -i pilot-slow psql -X -e -U postgres >> "$LOG" 2>&1 || rc=$?
echo "# ---- finished at (host, UTC): $(date -u '+%Y-%m-%d %H:%M:%S UTC') ----" >> "$LOG"

{
  echo ""
  echo "# ---- appended section: victim-user context (run at $(date -u '+%Y-%m-%d %H:%M:%S UTC')) ----"
  echo "# Command: docker exec -i pilot-slow psql -X -e -U postgres -c \"...user_id=2 ... 90 days\""
} >> "$LOG"
rc2=0
docker exec -i pilot-slow psql -X -e -U postgres -c "$VICTIM_SQL" >> "$LOG" 2>&1 || rc2=$?
echo "# psql exit codes: seed=$rc victim-context=$rc2" >> "$LOG"
exit $(( rc + rc2 ))
