SET statement_timeout='20s';
SELECT count(*) FROM information_schema.tables WHERE table_schema='shop' AND table_name='allowed_migration';
