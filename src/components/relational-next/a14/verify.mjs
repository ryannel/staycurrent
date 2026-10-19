import assert from 'node:assert/strict';
import {PGlite} from '@electric-sql/pglite';
import {execFileSync} from 'node:child_process';
import {matchFrames, outerFrames, fanoutFrames} from './models.mjs';
import {setup, queries, orderValues, stages, expectedReport} from './queries.mjs';
const native = process.argv.includes('--native');
const bin = '/opt/homebrew/Cellar/postgresql@18/18.6_1/bin';
const dbName = `rel3_a14_run${Date.now()}`;
const connection = `postgresql://staycurrent@127.0.0.1:57319/${dbName}`;
if(native) execFileSync(`${bin}/createdb`,['-h','127.0.0.1','-p','57319','-U','staycurrent',dbName]);
const psql = sql => execFileSync(`${bin}/psql`,['--no-psqlrc',connection,'-v','ON_ERROR_STOP=1','-tA','-c',sql],{encoding:'utf8'}).trim();
const db = native ? {
 exec:async sql=>psql(sql),
 query:async sql=>({rows:JSON.parse(psql(`SELECT COALESCE(json_agg(t), '[]'::json) FROM (${sql.trim().replace(/;$/, '')}) AS t`))}),
 close:async()=>execFileSync(`${bin}/dropdb`,['-h','127.0.0.1','-p','57319','-U','staycurrent',dbName])
} : new PGlite();
await db.exec(native?setup.replaceAll('CREATE TEMP TABLE','CREATE TABLE'):setup);
const run = async sql => (await db.query(sql)).rows;
const normal = rows => rows.map(row => Object.fromEntries(Object.entries(row).map(([k,v]) => [k, typeof v === 'string' && /^\d+(\.\d+)?$/.test(v) ? Number(v) : v])));
const report = await run(queries.report);
assert.equal((await run(queries.pairs)).length,4);
assert.equal((await run(queries.pairs.replace('ON o.customer_id = c.customer_id','ON true'))).length,20);
assert.equal(matchFrames('key').at(-1).stats[0][1],4);
assert.equal(matchFrames('all').at(-1).stats[0][1],20);
assert.deepEqual(outerFrames('on').at(-1).stats.map(s=>s[1]),[5,6]);
assert.deepEqual(outerFrames('where').at(-1).stats.map(s=>s[1]),[3,4]);
assert.deepEqual(fanoutFrames('details').at(-1).stats.map(s=>s[1]),[100,60]);
assert.deepEqual(fanoutFrames('totals').at(-1).stats.map(s=>s[1]),[50,30]);
assert.equal(Number((await run(queries.groups.replace('c.customer_id, c.name,','c.name,').replace('GROUP BY c.customer_id, c.name','GROUP BY c.name').replace('ORDER BY c.customer_id','ORDER BY c.name')))[0].order_count),3);
assert.deepEqual(normal(report), normal(expectedReport));
assert.equal(new Set(report.map(r => r.customer_id)).size, 5);
assert.deepEqual((await run(queries.outerOn)).map(r=>[r.customer_id,r.order_id]), [[1,101],[1,102],[2,null],[3,104],[4,null],[5,105]]);
assert.deepEqual((await run(queries.outerWhere)).map(r=>[r.customer_id,r.order_id]), [[1,101],[1,102],[3,104],[5,105]]);
assert.deepEqual((await run(queries.presence)).map(r=>r.customer_id),[1,3,5]);
assert.deepEqual(normal(await run(queries.counts)), [
 {customer_id:1,joined_rows:3,lines:3,known_amounts:3,different_amounts:2},
 {customer_id:2,joined_rows:1,lines:0,known_amounts:0,different_amounts:0},
 {customer_id:3,joined_rows:1,lines:1,known_amounts:1,different_amounts:1},
 {customer_id:4,joined_rows:1,lines:0,known_amounts:0,different_amounts:0},
 {customer_id:5,joined_rows:1,lines:1,known_amounts:0,different_amounts:0}
]);
assert.deepEqual(normal(await run(queries.groups)),[{customer_id:1,name:'Mina',order_count:2}]);
assert.deepEqual(normal(await run(queries.conditional)),[
 {customer_id:1,paid_value:30,unpaid_value:20},
 {customer_id:3,paid_value:40,unpaid_value:0},
 {customer_id:5,paid_value:null,unpaid_value:0}
]);
assert.deepEqual(normal(await run(queries.empty)),[{n:0,total:null}]);
assert.deepEqual(await run(queries.noGroups),[]);
assert.deepEqual(await run(queries.self),[{employee:'Mina',manager:null},{employee:'Tariq',manager:'Mina'}]);
assert.equal((await run(queries.composite)).length,2);
assert.equal((await run(queries.composite.replace('l.tenant_id = o.tenant_id AND ',''))).length,4);
for (const stage of ['order_totals','payment_totals']) {
 assert.deepEqual(await run(`${stages} SELECT customer_id FROM ${stage} GROUP BY customer_id HAVING COUNT(*) > 1`),[]);
}
const independent = await run(`WITH order_values AS (${orderValues}) SELECT COUNT(*) AS orders, COUNT(order_value) AS valued, SUM(order_value) AS known_value FROM order_values`);
assert.deepEqual(normal(independent),[{orders:4,valued:3,known_value:90}]);
assert.equal(Number((await run("SELECT SUM(amount) AS v FROM payments WHERE paid_on >= DATE '2026-01-01' AND paid_on < DATE '2026-02-01'"))[0].v),45);
assert.deepEqual(normal((await run(queries.wrong)).slice(0,1)),[{customer_id:1,order_value:100,payment_value:60}]);
const sharedValues = rows => normal(rows).map(({customer_id, order_value, payment_value})=>({customer_id, order_value, payment_value}));
await assert.rejects(async()=>assert.deepEqual(sharedValues(await run(queries.wrong)),sharedValues(expectedReport)));
await assert.rejects(async()=>assert.deepEqual(await run(queries.outerWhere),await run(queries.outerOn)));
assert.equal(Number((await run("SELECT SUM(DISTINCT amount) AS v FROM payments WHERE customer_id=1"))[0].v),15);
// Remove the only measured line: a line-less order remains unknown, not zero.
await db.exec('DELETE FROM order_lines WHERE order_id=105');
assert.equal((await run(queries.report)).find(r=>r.customer_id===5).order_value,null);
await db.exec('INSERT INTO order_lines VALUES (105,1,NULL)');
// Move both period boundaries to February: no qualifying details, all customers retained.
const feb = queries.report.replaceAll("'2026-02-01'", "'2026-03-01'").replaceAll("'2026-01-01'", "'2026-02-01'");
assert.deepEqual(normal(await run(feb)).map(r=>[r.customer_id,r.order_count,r.order_value,r.payment_value]),[[1,0,0,0],[2,0,0,0],[3,0,0,0],[4,0,0,0],[5,0,0,0]]);
console.log(JSON.stringify({engine:(await run('SELECT version() AS version'))[0].version,report,independent,wrongMina:(await run(queries.wrong))[0],checks:'all assertions passed'},null,2));
await db.close();
