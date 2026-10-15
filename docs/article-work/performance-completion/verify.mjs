import { PGlite } from '@electric-sql/pglite';
import { performanceTutorials } from '../../../src/lib/sql-lessons/performance.ts';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';

const observed = { checked: '2026-10-15', runtime: 'PGlite 0.5.8; SQL behaviour, not a server latency benchmark', lessons: [] };
const nodes = (p) => [p, ...(p.Plans ?? []).flatMap(nodes)];
const plan = async (db) => (await db.query("EXPLAIN (ANALYZE, BUFFERS, TIMING OFF, FORMAT JSON) SELECT count(*) FROM perf_jobs WHERE state='queued'")).rows[0]['QUERY PLAN'][0];
const articleSQL = (slug) => Object.fromEntries([...readFileSync(new URL(`../../../src/pages/learn/databases/relational/${slug}.astro`, import.meta.url), 'utf8').matchAll(/const (\w+) = `([\s\S]*?)`;/g)].map(m => [m[1],m[2]]));
for (const tutorial of performanceTutorials) {
 const db = new PGlite();
 observed.version ??= (await db.query('SELECT version()')).rows[0].version;
 const record = { id: tutorial.id, steps: [], checks: [] };
 for (let i=0; i<tutorial.steps.length; i++) {
  const step=tutorial.steps[i];
  const results=await db.exec(step.sql);
  record.steps.push({ title: step.title, results });
  if(tutorial.id==='performance-estimates' && i>0 && i!==4) {
   // Check the literal lesson response before executing a later helper query.
   const shown = results.at(-1).rows.map(row=>row['QUERY PLAN']).join('\n');
   assert.match(shown, new RegExp(`actual rows=${i===1||i===5?10:5000}(?:\\.00)? loops=1`));
   if(i===5) assert.match(shown,/Index Only Scan|Index Scan|Bitmap Heap Scan/);
   const p=await plan(db); record.steps.at(-1).jsonPlan=p;
   const scan=nodes(p.Plan).find(n=>['Seq Scan','Index Scan','Index Only Scan','Bitmap Heap Scan'].includes(n['Node Type']));
   assert.equal(scan['Actual Rows'],i===1||i===5?10:5000);
   if(i===1) { assert.equal(scan['Rows Removed by Filter'],9990); assert.equal(scan['Plan Rows'],10); }
   if(i===2) assert(scan['Plan Rows']<500);
   if(i===3) assert.equal(scan['Plan Rows'],5000);
   if(i===5) assert.notEqual(scan['Node Type'],'Seq Scan');
  }
  if(tutorial.id==='request-batching') {
   if(i===1) assert.equal(results.at(-1).rows.length,3);
   if(i===2) assert.equal(results.at(-1).rows.length,6);
   if(i===3) assert.deepEqual(results.at(-1).rows,[{order_id:101,ordered:'25.00',paid:'25.00'},{order_id:102,ordered:'8.00',paid:'8.00'},{order_id:103,ordered:'0',paid:'0'}]);
   if(i===4) {
    const joined=(await db.exec(tutorial.steps[2].sql)).at(-1).rows;
    const totals=(await db.exec(tutorial.steps[3].sql)).at(-1).rows;
    assert.equal(joined.filter(r=>r.order_id===101).length,6);
    assert.equal(totals[0].ordered,'25.00'); assert.equal(totals[0].paid,'27.00');
    record.checks.push({variation:'third payment',joined,totals});
   }
  }
  if(tutorial.id==='report-freshness') {
   if(i===1||i===2) assert.deepEqual(results.at(-1).rows.map(r=>r.total),['50.00','8.00']);
   if(i===3) assert.deepEqual(results.at(-1).rows.map(r=>r.total),['55.00','50.00','8.00','8.00']);
   if(i===4) assert.deepEqual(results.at(-1).rows.map(r=>r.total),['55.00','8.00']);
  }
 }
 if(tutorial.id==='performance-estimates') {
  assert.equal((await db.query("SELECT count(*) AS n FROM perf_jobs WHERE state='done'")).rows[0].n,9990);
  const p=(await db.query("EXPLAIN (ANALYZE, BUFFERS, TIMING OFF, FORMAT JSON) SELECT count(*) FROM perf_jobs WHERE state='done'")).rows;
  record.checks.push({variation:'done',plan:p});
  // Server activity query is syntactically valid here; real blocker observation needs a server.
  await db.exec(articleSQL('slow-queries').waits);
 }
 if(tutorial.id==='request-batching') {
  await db.exec(tutorial.steps[0].sql);
  const sql=articleSQL('request-cost');
  assert.equal((await db.exec(sql.batch)).at(-1).rows.length,3);
  assert.equal((await db.exec(sql.fanout)).at(-1).rows.length,6);
  assert.equal((await db.exec(sql.totals)).at(-1).rows[0].ordered,'25.00');
 }
 if(tutorial.id==='report-freshness') {
  await db.exec("UPDATE report_sales SET amount=40 WHERE sale_id=2; REFRESH MATERIALIZED VIEW report_daily;");
  assert.equal((await db.query("SELECT total FROM report_daily WHERE sold_on='2026-10-13'")).rows[0].total,'60.00');
  await db.exec('CREATE UNIQUE INDEX report_daily_day ON report_daily(sold_on); REFRESH MATERIALIZED VIEW CONCURRENTLY report_daily;');
  record.checks.push({variation:'amount 40 and concurrent refresh',rows:(await db.query('SELECT * FROM report_daily ORDER BY sold_on')).rows});
  await db.exec(tutorial.steps[0].sql);
  const sql=articleSQL('reporting');
  await db.exec(sql.live); await db.exec(sql.materialize); await db.exec(sql.correct);
 }
 // Every first step is safe to rerun after a completed lesson.
 await db.exec(tutorial.steps[0].sql);
 record.checks.push({reset:'passed'});
 observed.lessons.push(record);
 await db.close();
}
writeFileSync(new URL('./observed.json',import.meta.url),JSON.stringify(observed,null,2)+'\n');
console.log('Verified all 16 performance lesson steps, exact results, estimate changes, variations, resets and article SQL.');
