#!/bin/sh
# SQLite page cache under a scan. Homebrew sqlite3 3.54.0 (default cache_size -2000).
S=${SQLITE:-/opt/homebrew/opt/sqlite/bin/sqlite3}
rm -f shop.db
$S shop.db "PRAGMA journal_mode=WAL;
CREATE TABLE products(product_id INTEGER PRIMARY KEY, name TEXT, price REAL, description TEXT);
WITH RECURSIVE g(i) AS (SELECT 1 UNION ALL SELECT i+1 FROM g WHERE i<20000)
  INSERT INTO products SELECT i,'Product '||i,(i%50)+0.99,printf('%.120c','x') FROM g;
CREATE TABLE page_views(view_id INTEGER PRIMARY KEY, product_id INT, detail TEXT);
WITH RECURSIVE g(i) AS (SELECT 1 UNION ALL SELECT i+1 FROM g WHERE i<300000)
  INSERT INTO page_views SELECT i,(i%20000)+1,printf('%.40c','y') FROM g;
PRAGMA wal_checkpoint(TRUNCATE);" >/dev/null
$S shop.db "PRAGMA page_size; PRAGMA cache_size; SELECT name, count(*) FROM dbstat GROUP BY name;"
printf '.stats on\nSELECT sum(price) FROM products;\nSELECT sum(price) FROM products;\nSELECT count(*), sum(length(detail)) FROM page_views;\nSELECT sum(price) FROM products;\n' \
  | $S shop.db 2>&1 | grep -E '^[0-9]|Page cache (hits|misses)'
