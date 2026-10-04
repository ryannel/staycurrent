// From the repository root: node docs/article-work/querying-transactions/query-verify.mjs
// Extracts displayed SQL, verifies results, and refreshes the downloadable examples.
// Supply PGLITE_MODULE if the existing test installation is elsewhere.
import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
const modulePath = process.env.PGLITE_MODULE || '/private/tmp/staycurrent-design-sql/node_modules/@electric-sql/pglite/dist/index.js';
const { PGlite } = await import(pathToFileURL(modulePath).href);
const directory = 'docs/article-work/querying-transactions/';
const base = readFileSync('docs/article-work/designing-data/schema.sql', 'utf8');
const extract = slug => Object.fromEntries([...readFileSync(`src/pages/learn/databases/relational/${slug}.astro`,'utf8').matchAll(/const (\w+) = `([\s\S]*?)`;/g)].map(match=>[match[1], match[2]]));
const results = [];
const rows = async (db, label, sql, params=[]) => { const answer=(await db.query(sql,params)).rows; results.push({label,sql,rows:answer}); return answer; };
const ids = values => values.map(row=>row.order_id);
const normalized = values => JSON.parse(JSON.stringify(values));
const q=extract('query-results');
const db=new PGlite(); await db.exec(base); await db.exec(q.setup);
const version=(await db.query('SELECT version() AS version')).rows[0].version;
assert.match(version,/PostgreSQL 18\.3/);
assert.deepEqual(await rows(db,'O13 lines',q.firstQuery),[
 {order_id:'O13',line_no:1,quantity:1,line_total:'20.00'},
 {order_id:'O13',line_no:2,quantity:1,line_total:'24.00'}]);
assert.deepEqual(await rows(db,'Line/product join',q.joinQuery),[
 {order_id:'O12',line_no:1,name:'Blue mug',quantity:2,line_total:'36.00'},
 {order_id:'O13',line_no:1,name:'Blue mug',quantity:1,line_total:'20.00'},
 {order_id:'O13',line_no:2,name:'Bowl',quantity:1,line_total:'24.00'}]);
assert.deepEqual((await rows(db,'All customers',q.customerJoin)).map(row=>[row.customer_id,row.order_id]),[['C4','O12'],['C4','O13'],['C4','O14'],['C5',null]]);
await db.exec(q.filterSetup);
assert.deepEqual((await rows(db,'Filter in ON',q.onFilter)).map(row=>[row.customer_id,row.order_id]),[['C4','O13'],['C4','O14'],['C5',null],['C6',null]]);
assert.deepEqual(ids(await rows(db,'Filter in WHERE',q.whereFilter)),['O13','O14']);
assert.deepEqual(await rows(db,'Counts and totals',q.totalsQuery),[
 {order_id:'O12',joined_rows:1,line_count:1,line_total:'36.00'},
 {order_id:'O13',joined_rows:2,line_count:2,line_total:'44.00'},
 {order_id:'O14',joined_rows:1,line_count:0,line_total:null}]);
assert.deepEqual(await rows(db,'HAVING',q.havingQuery),[{order_id:'O13',line_total:'44.00'}]);
assert.deepEqual(await rows(db,'Four line/shipment pairs',q.fanoutQuery),[
 {line_no:1,shipment_id:'S1',line_total:'20.00'},{line_no:1,shipment_id:'S2',line_total:'20.00'},
 {line_no:2,shipment_id:'S1',line_total:'24.00'},{line_no:2,shipment_id:'S2',line_total:'24.00'}]);
assert.deepEqual(await rows(db,'Independent summaries',q.safeTotals),[{order_id:'O13',amount:'44.00',shipment_count:2}]);
assert.deepEqual(ids(await rows(db,'EXISTS',q.existsQuery)),['O12','O13']);
assert.deepEqual(ids(await rows(db,'NOT EXISTS',q.noLinesQuery)),['O14']);
assert.deepEqual(await rows(db,'Parameter value',q.firstQuery.replace("order_id = 'O13'",'order_id = $1'),['O13']), (await db.query(q.firstQuery)).rows);
await db.exec("INSERT INTO order_lines (order_id,line_no,product_id,quantity,unit_price) VALUES ('O13',3,'P7',1,20)");
assert.deepEqual(ids(await rows(db,'EXISTS after a second mug line',q.existsQuery)),['O12','O13']);
await db.close();
const p=extract('large-results');
const paging=new PGlite(); await paging.exec(base); await paging.exec(p.setup);
assert.deepEqual(ids(await rows(paging,'First page',p.firstPage)),['O16','O15']);
assert.deepEqual(ids(await rows(paging,'Time-only boundary loses tied O14',p.nextPage.replace("(placed_at, order_id)\n      < ('2026-10-04 12:00:00+00', 'O15')", "placed_at < '2026-10-04 12:00:00+00'"))),['O13','O12']);
const scenarios=[
 ['unchanged','',['O14','O13'],['O14','O13']],
 ['new earlier row',p.insertOrder,['O15','O14'],['O14','O13']],
 ['delete seen row',"DELETE FROM orders WHERE order_id = 'O16';",['O13','O12'],['O14','O13']],
 ['move unread row',"UPDATE orders SET placed_at = '2026-10-04 13:00:00+00' WHERE order_id = 'O14';",['O15','O13'],['O13','O12']],
 ['delete boundary row',"DELETE FROM orders WHERE order_id = 'O15';",['O13','O12'],['O14','O13']]
];
for(const [label,change,offset,keyset] of scenarios){
 await paging.exec('BEGIN'); if(change) await paging.exec(change);
 assert.deepEqual(ids(await rows(paging,`${label}: offset`,p.offsetPage)),offset);
 assert.deepEqual(ids(await rows(paging,`${label}: keyset`,p.nextPage)),keyset);
 await paging.exec('ROLLBACK');
}
assert.deepEqual(ids(await rows(paging,'Final keyset page',p.nextPage.replace("'2026-10-04 12:00:00+00', 'O15'", "'2026-10-04 10:00:00+00', 'O13'"))),['O12']);
await paging.exec(p.pageIndex);
const cursor=await paging.exec(p.snapshotCursor);
const batches=cursor.filter(result=>result.rows.length>0).map(result=>ids(result.rows));
assert.deepEqual(batches,[['O12','O13'],['O14','O15'],['O16']]);
results.push({label:'Read-only cursor batches',sql:p.snapshotCursor,batches});
await paging.close();
const header='-- PostgreSQL 18 practice examples.\n-- Run the shared designing-data.sql in a FRESH database first.\n-- Use a separate fresh database for each article extension.\n-- These statements do not drop or overwrite existing tables.\n\n';
const queryOrder=['setup','firstQuery','joinQuery','customerJoin','filterSetup','onFilter','whereFilter','totalsQuery','havingQuery','fanoutQuery','safeTotals','existsQuery','noLinesQuery'];
writeFileSync(directory+'query-results.sql',header+queryOrder.map(name=>`-- ${name}\n${q[name]}`).join('\n\n')+'\n');
writeFileSync(directory+'query-pagination.sql',header+p.setup+'\n\n-- First page\n'+p.firstPage+'\n\n'+scenarios.map(([label,change])=>`-- ${label}: each experiment starts from the original five orders.\nBEGIN;\n${change}\n${p.offsetPage}\n${p.nextPage}\nROLLBACK;`).join('\n\n')+'\n\n'+p.pageIndex+'\n\n'+p.snapshotCursor+'\n');
writeFileSync(directory+'query-results-observed.json',JSON.stringify({checked:'2026-10-04',version,limits:'Single-connection executions. Pagination mutations simulate newly visible committed states; no multi-session isolation or performance benchmark.',results:normalized(results)},null,2)+'\n');
console.log(`Verified ${results.length} query outcomes with ${version}. Refreshed both downloads and observed results.`);
