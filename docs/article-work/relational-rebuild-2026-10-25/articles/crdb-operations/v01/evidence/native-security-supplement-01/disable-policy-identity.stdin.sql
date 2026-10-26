SET statement_timeout='20s';
SET allow_unsafe_internals=true; SELECT json_build_object('cluster',crdb_internal.cluster_id(),'database',current_database(),'user',current_user,'marker',(SELECT marker FROM public.fixture_guard));
