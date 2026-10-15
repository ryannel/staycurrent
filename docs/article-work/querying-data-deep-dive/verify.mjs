// Run from the repository root. Uses the project's PostgreSQL runtime.
import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';
import { queryWork } from '../../../src/components/explainers/querying/query-work-model.ts';
const source=readFileSync('src/pages/learn/databases/relational/query-results.astro','utf8');
const sql=Object.fromEntries([...source.matchAll(/const (\w+) = `([\s\S]*?)`;/g)].map(m=>[m[1],m[2]]));
const db=new PGlite();
await db.exec(readFileSync('docs/article-work/designing-data/schema.sql','utf8'));
await db.exec(sql.setup);
const observations=[];
const check=async(name,expected)=>{
 const rows=(await db.query(sql[name])).rows;
 assert.deepEqual(rows,expected); observations.push({name,rows});
};
await check('receiptQuery', [{line_no:1,name:'Blue mug',line_total:'20.00'},{line_no:2,name:'Bowl',line_total:'24.00'}]);
await check('firstQuery', [{order_id:'O13',line_no:1,quantity:1,line_total:'20.00'},{order_id:'O13',line_no:2,quantity:1,line_total:'24.00'}]);
await check('totalsQuery', [{order_id:'O12',joined_rows:1,line_count:1,line_total:'36.00'},{order_id:'O13',joined_rows:2,line_count:2,line_total:'44.00'},{order_id:'O14',joined_rows:1,line_count:0,line_total:null}]);
await check('safeTotals',[{order_id:'O13',amount:'44.00',shipment_count:2}]);
await check('existsQuery',[{order_id:'O12'},{order_id:'O13'}]);
await check('noLinesQuery',[{order_id:'O14'}]);
await db.exec(sql.filterSetup);
await check('onFilter',[{customer_id:'C4',name:'Ada',order_id:'O13'},{customer_id:'C4',name:'Ada',order_id:'O14'},{customer_id:'C5',name:'Ben',order_id:null},{customer_id:'C6',name:'Cara',order_id:null}]);
await check('whereFilter',[{customer_id:'C4',name:'Ada',order_id:'O13'},{customer_id:'C4',name:'Ada',order_id:'O14'}]);
await db.exec('ANALYZE products; ANALYZE order_lines;');
const observedPlan=(await db.query('EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF) '+sql.receiptQuery)).rows.map(r=>r['QUERY PLAN']);
// Check the pedagogically consequential node counts; timing/memory are not promises.
for(const pattern of [/Sort \(actual rows=2.00 loops=1\)/,/Nested Loop \(actual rows=2.00 loops=1\)/,/Materialize \(actual rows=1.50 loops=2\)/,/Rows Removed by Join Filter: 1/,/Rows Removed by Filter: 1/]) assert(observedPlan.some(line=>pattern.test(line)),String(pattern));
// Execute the downloadable script as well, not merely its displayed equivalent.
const download=await db.exec(readFileSync('docs/article-work/querying-data-deep-dive/execution.sql','utf8'));
assert.deepEqual(download[2].rows,observations[0].rows);
// Cross-check both browser algorithms against actual SQL for every control combination.
await db.exec('CREATE TEMP TABLE lab_products(id text PRIMARY KEY, name text); CREATE TEMP TABLE lab_lines(line integer, product text, amount integer);');
for(const size of [2,20,200]) for(const count of [1,2,6]) {
 const model=queryWork(size,count);
 assert.deepEqual(model.scanRows,model.lookupRows);
 assert.equal(model.comparisons,size*count); assert.equal(model.builds,size); assert.equal(model.probes,count);
 await db.exec('TRUNCATE lab_products,lab_lines;');
 for(const p of model.products) await db.query('INSERT INTO lab_products VALUES ($1,$2)',[p.id,p.name]);
 for(const l of model.lines) await db.query('INSERT INTO lab_lines VALUES ($1,$2,$3)',[l.line,l.product,l.amount]);
 const actual=(await db.query('SELECT l.line,l.product,p.name,l.amount FROM lab_lines l JOIN lab_products p ON p.id=l.product ORDER BY l.line')).rows;
 assert.deepEqual(model.scanRows,actual);
 observations.push({name:`model ${size} products, ${count} lines`,comparisons:model.comparisons,builds:model.builds,probes:model.probes,rows:actual});
}
const version=(await db.query('SELECT version()')).rows[0].version;
await db.close();
writeFileSync('docs/article-work/querying-data-deep-dive/observed.json',JSON.stringify({checked:'2026-10-14',version,observations,observedPlan},null,2)+'\n');
console.log('Verified eight article results, the receipt plan/download, and all nine model data combinations against PostgreSQL.');
