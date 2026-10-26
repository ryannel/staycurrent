SET application_name = 'staycurrent-crdb-locality-verifier';
SET statement_timeout = '45s';
SELECT marker FROM public.fixture_guard ORDER BY marker;
