import {readFileSync,writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {Client}=require('/private/tmp/staycurrent-pg-lab/node_modules/pg/lib/index.js');
const db=new Client({host:'/private/tmp/staycurrent-pg-rebuild/socket',port:55438,user:'ryannel',database:'pg_capability_lab'});
await db.connect();
const sql=readFileSync(new URL('./vector-experiment.sql',import.meta.url),'utf8');
// Each statement is sent separately; explicit BEGIN/COMMIT delimit test settings.
const results=[];
for(const statement of sql.replace(/^--.*$/gm,'').split(';').map(s=>s.trim()).filter(Boolean)) {
 const res=await db.query(statement);
 if(res.rows.length) results.push({sql:statement,rows:res.rows});
}
const metrics=results.filter(r=>r.rows[0].recall_at_10!==undefined);
assert.equal(metrics.length,3);
assert.equal((await db.query('SELECT count(*) FROM pg_cap_vector_truth')).rows[0].count,'10');
const plans=results.filter(r=>r.rows[0]['QUERY PLAN']);
assert.ok([plans[0],plans[2]].every(r=>r.rows.some(x=>x['QUERY PLAN'].includes('pg_cap_vector_hnsw'))));
// ef_search also affects cost: the middle run may choose an exact scan.
console.log(JSON.stringify(plans.map(r=>r.rows),null,2));
writeFileSync(new URL('./vector-observed.json',import.meta.url),JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify(metrics,null,2));
await db.end();
