SET application_name = 'staycurrent-crdb-locality-verifier';
SET statement_timeout = '45s';
SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;
