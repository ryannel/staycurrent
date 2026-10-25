\set ON_ERROR_STOP on
-- Run with psql only against an explicitly chosen disposable database/schema.
-- Put this file, fixture.sql and index-comparison.sql in the same directory.
-- The fixture creates the shop tables; the comparison creates/drops candidate
-- indexes on orders. It leaves those fixture tables for inspection/disposal.
-- Loading and disabling autovacuum in one transaction prevents a background
-- vacuum from changing the intended pre-VACUUM visibility state.
BEGIN;
\ir fixture.sql
ALTER TABLE orders SET (autovacuum_enabled = false);
COMMIT;
\ir index-comparison.sql
