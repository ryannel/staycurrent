import {readFileSync,writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {Client}=require('/private/tmp/staycurrent-pg-lab/node_modules/pg/lib/index.js');
const db=new Client({host:'/private/tmp/staycurrent-pg-rebuild/socket',port:55438,user:'ryannel',database:'pg_capability_lab'});
await db.connect();
const sql=readFileSync(new URL('./spatial-experiment.sql',import.meta.url),'utf8');
const results=[];
for(const statement of sql.replace(/^--.*$/gm,'').split(';').map(s=>s.trim()).filter(Boolean)){
 const res=await db.query(statement);if(res.rows.length)results.push({sql:statement,rows:res.rows});
}
const selections=results.filter(x=>x.sql.startsWith('SELECT v.venue_id'));
assert.deepEqual(selections[0].rows.map(x=>x.venue_id),[2]);
assert.deepEqual(selections[1].rows.map(x=>x.venue_id),[2,4]);
const plan=results.find(x=>x.rows[0]['QUERY PLAN']);
assert.ok(plan.rows.some(x=>x['QUERY PLAN'].includes('pg_cap_spatial_gist')));
writeFileSync(new URL('./spatial-observed.json',import.meta.url),JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify(results,null,2));await db.end();
