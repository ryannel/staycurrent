import {createRequire} from 'node:module';
import {writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {rangeCapabilitySql} from '../../../../src/lib/sql-lessons/postgresql-capabilities.ts';
const require=createRequire(import.meta.url);
const {Client}=require('/private/tmp/staycurrent-pg-lab/node_modules/pg/lib/index.js');
const cfg={host:'/private/tmp/staycurrent-pg-rebuild/socket',port:55438,user:'ryannel',database:'pg_capability_lab'};
const a=new Client({...cfg,application_name:'range-author-a'}),b=new Client({...cfg,application_name:'range-author-b'}),observer=new Client(cfg);
await Promise.all([a.connect(),b.connect(),observer.connect()]);
await a.query(rangeCapabilitySql.setup);await a.query(rangeCapabilitySql.adjacent);
await a.query('BEGIN');await b.query('BEGIN');
await a.query("INSERT INTO pg_cap_booking(booking_id,room,during) VALUES(10,'Cedar','[2026-10-15 12:00,2026-10-15 13:00)')");
const events=[{actor:'A',event:'insert accepted, transaction open'}];
const pending=b.query("INSERT INTO pg_cap_booking(booking_id,room,during) VALUES(11,'Cedar','[2026-10-15 12:30,2026-10-15 13:30)')").then(()=>({accepted:true}),e=>({code:e.code,message:e.message}));
let wait;
for(let i=0;i<20;i++){
 await new Promise(resolve=>setTimeout(resolve,50));
 wait=(await observer.query("SELECT wait_event_type,wait_event FROM pg_stat_activity WHERE application_name='range-author-b'")).rows[0];
 if(wait?.wait_event_type==='Lock')break;
}
assert.equal(wait.wait_event_type,'Lock');events.push({actor:'B',event:'blocked behind A',...wait});
await a.query('COMMIT');events.push({actor:'A',event:'commit'});
const result=await pending;assert.equal(result.code,'23P01');events.push({actor:'B',event:'exclusion rejection',...result});await b.query('ROLLBACK');
const final=(await observer.query('SELECT booking_id,room,during::text FROM pg_cap_booking ORDER BY booking_id')).rows;
assert.deepEqual(final.map(x=>x.booking_id),[1,2,10]);
writeFileSync(new URL('./range-concurrency-observed.json',import.meta.url),JSON.stringify({version:(await observer.query('SELECT version()')).rows[0].version,events,final},null,2)+'\n');
await Promise.all([a.end(),b.end(),observer.end()]);console.log(JSON.stringify(events));
