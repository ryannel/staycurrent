SET application_name = 'staycurrent-crdb-locality-verifier';
SET statement_timeout = '45s';
ALTER DATABASE sc_crdb_locality PRIMARY REGION "North";
ALTER DATABASE sc_crdb_locality ADD REGION "West";
ALTER DATABASE sc_crdb_locality ADD REGION "East";
