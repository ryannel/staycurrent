import fs from 'node:fs';
import pg from '/private/tmp/staycurrent-rebuild-client-runtime-20261025/node_modules/pg/lib/index.js';
import assert from 'node:assert/strict';
const cfg=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const result={purpose:'Only investigate the bounded EXPLAIN historical field; no isolation/history rerun',observations:[]};
let c;
try {
 assert.equal(cfg.host,'127.0.0.1');assert.equal(cfg.database,'sc_crdb_reads');assert.equal(cfg.user,'sc_crdb_reads_writer');assert.equal(cfg.ssl,false);
 c=new pg.Client({...cfg,connectionTimeoutMillis:5000,query_timeout:10000});await c.connect();
 await c.query('SET allow_unsafe_internals=true');
 const g=(await c.query('SELECT current_database() AS db,current_user AS principal,version(),crdb_internal.cluster_id()::STRING AS cluster_id')).rows[0];
 assert.equal(g.db,cfg.database);assert.equal(g.principal,cfg.user);assert(g.version.includes('v26.2.8'));assert.equal(g.cluster_id,cfg.expectedClusterId);
 assert.equal((await c.query('SELECT marker FROM fixture_guard')).rows[0].marker,cfg.expectedMarker);result.guard=g;
 await c.query("SET statement_timeout='8s'");
 async function observe(label,sql){const rows=(await c.query(sql)).rows;result.observations.push({label,sql,rows});return rows;}
 await observe('before creation','SELECT now()::STRING AS server_now,cluster_logical_timestamp()::STRING AS hlc');
 await c.query("CREATE SCHEMA bounded_diagnostic; CREATE TABLE bounded_diagnostic.products(product_id STRING PRIMARY KEY,price DECIMAL(8,2)); INSERT INTO bounded_diagnostic.products VALUES ('P7',20.00)");
 await observe('after creation','SELECT now()::STRING AS server_now,cluster_logical_timestamp()::STRING AS hlc');
 await c.query("UPDATE bounded_diagnostic.products SET price=22.00 WHERE product_id='P7'");
 await observe('after update','SELECT now()::STRING AS server_now,cluster_logical_timestamp()::STRING AS hlc');
 const rows=await observe('bounded returned value',"SELECT price FROM bounded_diagnostic.products AS OF SYSTEM TIME with_max_staleness('10s') WHERE product_id='P7'");assert(['20.00','22.00'].includes(rows[0].price));
 try {await observe('bounded projected read HLC',"SELECT price,cluster_logical_timestamp()::STRING AS read_hlc,now()::STRING AS transaction_now FROM bounded_diagnostic.products AS OF SYSTEM TIME with_max_staleness('10s') WHERE product_id='P7'");}catch(e){result.observations.push({label:'projected HLC unavailable',error:{code:e.code,message:e.message}});}
 await observe('bounded EXPLAIN ANALYZE',"EXPLAIN ANALYZE SELECT price FROM bounded_diagnostic.products AS OF SYSTEM TIME with_max_staleness('10s') WHERE product_id='P7'");
 await observe('after plan','SELECT now()::STRING AS server_now,cluster_logical_timestamp()::STRING AS hlc');result.success=true;
}catch(e){result.success=false;result.error={code:e.code,message:e.message};process.exitCode=1;}
finally {if(c)await c.end();fs.writeFileSync(process.argv[3],JSON.stringify(result,null,2)+'\n');}
