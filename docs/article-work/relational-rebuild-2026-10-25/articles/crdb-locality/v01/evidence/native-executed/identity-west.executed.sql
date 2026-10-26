SET application_name = 'staycurrent-crdb-locality-verifier';
SET statement_timeout = '45s';
SET allow_unsafe_internals=true;
SELECT json_build_object('cluster_id',crdb_internal.cluster_id(),'database',current_database(),'user',current_user(),'version',version(),'gateway_region',gateway_region()) AS identity;
