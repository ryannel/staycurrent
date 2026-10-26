SET statement_timeout='20s';
SHOW RANGES FROM TABLE shop.orders WITH DETAILS; SHOW ZONE CONFIGURATION FOR DATABASE sc_crdb_operations; SHOW ZONE CONFIGURATION FOR TABLE shop.orders; SELECT name,value FROM crdb_internal.node_metrics WHERE name IN ('ranges.unavailable','ranges.underreplicated','ranges');
