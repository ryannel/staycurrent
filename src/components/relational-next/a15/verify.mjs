import assert from 'node:assert/strict';
import {writeFileSync,readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import * as q from './queries.mjs';
import {membershipRows,setRows,walkModel,definitions,frames} from './model.mjs';
const base='docs/article-work/relational-writing-2026-10-19/nodes/a15/';
const psql='/opt/homebrew/Cellar/postgresql@18/18.6_1/bin/psql';
const args=['--no-psqlrc','postgresql://staycurrent@127.0.0.1:57319/rel3_a15_run1','-X','-v','ON_ERROR_STOP=1','-t','-A'];
const log=[];const sql=[];
function run(s){sql.push(s);const r=spawnSync(psql,args,{input:s,encoding:'utf8'});log.push({sql:s,output:r.stdout.trim(),stderr:r.stderr.trim(),status:r.status});if(r.status!==0)throw new Error(r.stderr);return r.stdout.trim();}
function rows(s){return JSON.parse(run(`SELECT COALESCE(json_agg(r), '[]') FROM (${s.trim().replace(/;$/,'')}) AS r;`));}
run('DROP VIEW IF EXISTS january_follow_up; DROP TABLE IF EXISTS categories;\n'+q.setup+'\n'+q.hierarchySetup);
run('SELECT version(); SHOW TimeZone; SHOW default_transaction_isolation; SHOW statement_timeout;');
assert.deepEqual(rows(q.correlated),[{order_id:101,paid:15,has_payment:true},{order_id:102,paid:null,has_payment:false}]);
assert.deepEqual(rows(q.global),[{order_id:101,paid:65,has_payment:true},{order_id:102,paid:65,has_payment:true}]);
assert.deepEqual(rows(q.derived),[{order_id:101,paid:15},{order_id:102,paid:null}]);
assert.deepEqual(rows(q.rawJoin),[{order_id:101,amount:10},{order_id:101,amount:5}]);
for(const [id,value]of [[100,10],[102,null]])assert.deepEqual(rows(`SELECT o.order_id,(SELECT p.amount FROM payments AS p WHERE p.order_id=o.order_id) AS receipt FROM orders AS o WHERE o.order_id=${id}`),[{order_id:id,receipt:value}]);
assert.deepEqual(rows(q.nullScalar.split('--')[0]),[{receipt:null}]);
run(`DO $$ BEGIN
 BEGIN PERFORM (SELECT p.amount FROM payments AS p WHERE p.order_id=101);
 RAISE EXCEPTION 'expected cardinality violation';
 EXCEPTION WHEN cardinality_violation THEN RAISE NOTICE 'EXPECTED SQLSTATE %: %',SQLSTATE,SQLERRM; END;
END $$;`);
for(const kind of ['null','known','empty','safe']){const actual=rows(q.membership(kind,kind==='safe')).map(r=>[r.customer_id,r.included,r.excluded,r.present,r.absent]);assert.deepEqual(actual,membershipRows(kind));}
assert.deepEqual(rows(q.exclusion.split('--')[0]),[{customer_id:2}]);
for(const op of ['UNION','UNION ALL','INTERSECT','INTERSECT ALL','EXCEPT','EXCEPT ALL'])assert.deepEqual(rows(q.setQuery(op)).map(r=>r.customer_id),setRows(op));
assert.deepEqual(rows(q.customerSets.split('--')[0]).map(r=>r.customer_id),[1,2,3]);
const article=readFileSync(base+'article.astro','utf8');
const snippet=name=>article.match(new RegExp('const '+name+'=`([\\s\\S]*?)`;'))[1];
assert.deepEqual(rows(snippet('lookup')),[{order_id:101,name:'Mina'},{order_id:102,name:'Mina'}]);
assert.deepEqual(rows(snippet('limited')).map(r=>r.customer_id),[2,3]);
assert.deepEqual(rows(q.setFixture+', c(customer_id) AS (VALUES (3))\n'+snippet('mixed')).map(r=>r.customer_id),[1,2,null]);
run(q.view);assert.deepEqual(rows(q.consume),[{order_id:101,name:'Mina',due:15,has_payment:true},{order_id:102,name:'Mina',due:20,has_payment:false},{order_id:106,name:'Edda',due:null,has_payment:false}]);
assert.equal(run('SELECT pg_typeof(order_id),pg_typeof(customer_id),pg_typeof(placed_at),pg_typeof(due),pg_typeof(has_payment) FROM january_follow_up LIMIT 1;'),'integer|integer|timestamp with time zone|numeric|boolean');
assert.ok(run('BEGIN; INSERT INTO payments VALUES (204,101,5); SELECT due FROM january_follow_up WHERE order_id=101; ROLLBACK;').split('\n').includes('10.00')); assert.equal(rows(q.consume)[0].due,15);
for(const kind of ['normal','bound','missing','leaf','cycle']){
 if(kind==='cycle')run('UPDATE categories SET parent_id=5 WHERE category_id=1;');
 const model=walkModel(kind);const actual=rows(q.traverse(model.root,model.cap));assert.deepEqual(actual,model.rows.map(w=>({category_id:w.id,name:w.name,depth:w.depth,path:w.path,truncated:w.truncated})));
 if(kind==='cycle')run('UPDATE categories SET parent_id=NULL WHERE category_id=1;');
}
assert.equal(run(`WITH RECURSIVE bad(id,depth) AS (SELECT 1,0 UNION SELECT 1,depth+1 FROM bad WHERE depth<3) SELECT count(*) FROM bad;`),'4');
// Verify documented errors without leaving a failed transaction or aborted psql session.
run(`DO $$ BEGIN
 BEGIN EXECUTE 'SELECT 1 UNION SELECT 1,2'; RAISE EXCEPTION 'expected shape error'; EXCEPTION WHEN syntax_error THEN RAISE NOTICE 'EXPECTED: %',SQLERRM; END;
 BEGIN EXECUTE $$DUMMY$$; END;
END $$;`.replace(' BEGIN EXECUTE $$DUMMY$$; END;',''));
for(const [scene,def]of Object.entries(definitions))for(const [choice]of def.options){const f=frames(scene,choice);assert.ok(f.length>=2);for(const step of f){assert.ok(step.note);assert.ok(step.panels.length);for(const panel of step.panels)for(const row of panel.rows)assert.equal(row.length,panel.columns.length);}}
writeFileSync(base+'verification.sql',sql.join('\n\n')+'\n');writeFileSync(base+'native-results.json',JSON.stringify(log,null,2)+'\n');
console.log('PASS native PostgreSQL results match scalar, correlation, membership, set, view and hierarchy models; all frame shapes pass.');
