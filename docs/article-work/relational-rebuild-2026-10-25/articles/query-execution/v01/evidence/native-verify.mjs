import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import pg from '/private/tmp/staycurrent-rebuild-client-runtime-20261025/node_modules/pg/lib/index.js';
import {baseline,repair,cases} from './queries.mjs';
const base = new URL('../',import.meta.url);
const fixture = await fs.readFile(new URL('public/relational-rebuild/query-execution/fixture.sql',base),'utf8');
const config = JSON.parse(await fs.readFile('/private/tmp/staycurrent-rebuild-query-execution-native-20261025/connection.json','utf8'));
if(config.host!=='127.0.0.1'||Number(config.port)!==61350||config.database!=='sc_query_execution'||config.user!=='sc_query_execution_writer') throw Error('Unexpected configured target');
const client = new pg.Client(config);
let createdSchema=false;
const schema = 'query_execution_writer_20261025';
const result = {fixtureSha256:crypto.createHash('sha256').update(fixture).digest('hex'),baseline,repair,cases:[],limits:'One isolated Linux PostgreSQL container; ordinary repetitions share warmed caches; no concurrency or production latency claim.'};
await client.connect();
try {
 const identity = (await client.query(`SELECT version(), current_database(),current_user,inet_server_addr()::text AS server_addr,inet_server_port() AS server_port,current_setting('cluster_name') AS cluster_name,current_setting('data_directory') AS data_directory`)).rows[0];
 if(identity.current_database!=='sc_query_execution'||identity.current_user!=='sc_query_execution_writer'||identity.cluster_name!=='staycurrent-query-execution-20261025'||!identity.version.includes('PostgreSQL 18.6')||identity.data_directory!=='/var/lib/postgresql/18/docker') throw Error('Unexpected target identity');
 result.identity=identity;
 await client.query(`SET statement_timeout='30s'; SET lock_timeout='2s'; SET TIME ZONE 'UTC'`);
 await client.query(`CREATE SCHEMA ${schema}`); createdSchema=true;
 await client.query(`SET search_path=${schema},pg_catalog`);
 await client.query(fixture);
 result.settings=(await client.query(`SELECT name,setting,unit FROM pg_settings WHERE name IN ('work_mem','shared_buffers','max_parallel_workers_per_gather','jit','random_page_cost','seq_page_cost','effective_cache_size','default_statistics_target') ORDER BY name`)).rows;
 result.counts=(await client.query(`SELECT (SELECT count(*) FROM orders) AS orders,(SELECT count(*) FROM order_items) AS lines,(SELECT count(*) FROM orders WHERE status='paid') AS paid,(SELECT count(*) FROM orders WHERE status='paid' AND placed_at>='2026-10-01+00' AND placed_at<'2026-11-01+00') AS october_paid`)).rows;
 for (const test of cases) {
  const before=(await client.query(baseline,test.params)).rows;
  const after=(await client.query(repair,test.params)).rows;
  if(JSON.stringify(before)!==JSON.stringify(after)) throw Error('Results differ: '+test.name);
  const entry={...test,resultRows:before.length,resultSha256:crypto.createHash('sha256').update(JSON.stringify(before)).digest('hex'),firstRows:before.slice(0,3),plans:{},ordinaryMs:{baseline:[],repair:[]}};
  for(const [name,sql] of [['baseline',baseline],['repair',repair]]) entry.plans[name]=(await client.query('EXPLAIN (ANALYZE,BUFFERS,FORMAT JSON) '+sql,test.params)).rows[0]['QUERY PLAN'][0];
  for(let n=0;n<6;n++) for(const name of (n%2?['repair','baseline']:['baseline','repair'])) {
    const start=performance.now(); await client.query(name==='baseline'?baseline:repair,test.params); entry.ordinaryMs[name].push(performance.now()-start);
  }
  result.cases.push(entry);
 }
 // Allowed core shape: a paid order without lines must contribute no group.
 await client.query(`INSERT INTO orders VALUES (900001,3,'2026-10-25 12:00+00','paid')`);
 const params=cases[0].params;
 if(JSON.stringify((await client.query(baseline,params)).rows)!==JSON.stringify((await client.query(repair,params)).rows)) throw Error('No-line equivalence failed');
 result.noLineEquivalence=true;
 await fs.writeFile(new URL('evidence/native-results.json',base),JSON.stringify(result,null,2)+'\n');
} finally {
 try { if(createdSchema) await client.query(`DROP SCHEMA ${schema} CASCADE`); } finally { await client.end(); }
}
