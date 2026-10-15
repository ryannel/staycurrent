import pg from '/private/tmp/staycurrent-pg-lab/node_modules/pg/lib/index.js';
import assert from 'node:assert/strict';import {writeFileSync} from 'node:fs';
const c=new pg.Client({host:'/private/tmp/staycurrent-pg-rebuild/socket',port:55438,user:'ryannel',database:'pg_core_lab'});await c.connect();const q=async s=>(await c.query(s)).rows;const plan=async s=>(await q(`EXPLAIN(ANALYZE,BUFFERS,FORMAT JSON) ${s}`))[0]['QUERY PLAN'][0];
try{
await q(`DROP TABLE IF EXISTS core_documents,core_ordered,core_scattered,core_seek;
CREATE TABLE core_documents(id integer PRIMARY KEY,tags text[] NOT NULL,note text NOT NULL);
INSERT INTO core_documents SELECT n,ARRAY['web',CASE WHEN n%100=0 THEN 'audit' ELSE 'ordinary' END,CASE WHEN n%250=0 THEN 'urgent' ELSE 'routine' END],repeat('document ',15) FROM generate_series(1,20000)n;
CREATE INDEX core_documents_tags ON core_documents USING gin(tags); ANALYZE core_documents;
CREATE TABLE core_ordered(id integer PRIMARY KEY,occurred_at timestamp NOT NULL,note text NOT NULL);
INSERT INTO core_ordered SELECT n,timestamp '2026-01-01'+n*interval '1 second',repeat('event detail ',12) FROM generate_series(1,20000)n;
CREATE TABLE core_scattered(LIKE core_ordered INCLUDING ALL);
INSERT INTO core_scattered SELECT * FROM core_ordered ORDER BY (id*7919)%20000;
CREATE INDEX core_ordered_time ON core_ordered USING brin(occurred_at) WITH(pages_per_range=4);
CREATE INDEX core_scattered_time ON core_scattered USING brin(occurred_at) WITH(pages_per_range=4);
ANALYZE core_ordered; ANALYZE core_scattered;
CREATE TABLE core_seek(tier integer,id integer,note text);INSERT INTO core_seek SELECT n%3,n,repeat('seek ',20) FROM generate_series(1,100000)n;CREATE INDEX core_seek_tier_id ON core_seek(tier,id);ANALYZE core_seek;`);
const intersection=await plan("SELECT id FROM core_documents WHERE tags @> ARRAY['audit','urgent']");const union=await plan("SELECT id FROM core_documents WHERE tags && ARRAY['audit','urgent']");const minute="WHERE occurred_at>=timestamp '2026-01-01 00:30:00' AND occurred_at<timestamp '2026-01-01 00:31:00'";const ordered=await plan(`SELECT count(*) FROM core_ordered ${minute}`),scattered=await plan(`SELECT count(*) FROM core_scattered ${minute}`);const skip=await plan('SELECT id,note FROM core_seek WHERE id=731');
const summary={};for(const t of ['core_ordered','core_scattered']) summary[t]=await q(`SELECT ((ctid::text::point)[0]::integer/4)*4 AS first_page,min(occurred_at)::text,max(occurred_at)::text,count(*) FROM ${t} GROUP BY 1 ORDER BY 1 LIMIT 4`);
assert.equal(intersection.Plan['Actual Rows'],40);assert.equal(union.Plan['Actual Rows'],240);assert.equal(ordered.Plan.Plans[0]['Node Type'],'Bitmap Heap Scan');assert.equal(scattered.Plan.Plans[0]['Node Type'],'Seq Scan');assert.equal(skip.Plan['Actual Rows'],1);assert.ok(skip.Plan['Index Searches']>1);
writeFileSync(new URL('indexes-observed.json',import.meta.url),JSON.stringify({intersection,union,ordered,scattered,skip,summary},null,2));console.log(JSON.stringify({intersection:40,union:240,ordered:ordered.Plan.Plans[0]['Node Type'],scattered:scattered.Plan.Plans[0]['Node Type'],skip:skip.Plan['Node Type'],searches:skip.Plan['Index Searches'],summary}));
}finally{await c.end()}
