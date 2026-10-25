import pg from '/private/tmp/staycurrent-rebuild-client-runtime-20261025/node_modules/pg/lib/index.js';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const source=new URL('../public/relational-rebuild/hierarchies/hierarchy-example.sql',import.meta.url);
const checksPath=new URL('./native-checks.sql',import.meta.url);
const sql=await fs.readFile(source,'utf8'),checks=await fs.readFile(checksPath,'utf8');
const config=JSON.parse(await fs.readFile('/private/tmp/staycurrent-rebuild-hierarchies-native-20261025/connection.json','utf8'));
assert.equal(config.host,'127.0.0.1');assert.equal(Number(config.port),63893);
assert.equal(config.database,'sc_hierarchies');assert.equal(config.user,'sc_hierarchies_writer');
const clients=[];let created=false;const evidence={sqlSha256:sha(sql),checksSha256:sha(checks),runtime:'native PostgreSQL, real pg 8.23.1 clients',limits:'Five category rows; no timing or performance claim. Educational functions are not a privileges boundary.'};
function sha(s){return crypto.createHash('sha256').update(s).digest('hex')}
async function connect(){const c=new pg.Client({...config,connectionTimeoutMillis:5000,application_name:'hierarchies-author-verifier'});await c.connect();clients.push(c);await c.query("SET statement_timeout='12s'; SET lock_timeout='8s'");return c;}
try{
 const observer=await connect();
 const identity=(await observer.query("SELECT version(),current_database() AS db,current_user AS usr,current_setting('cluster_name') AS cluster,current_setting('data_directory') AS data_directory,inet_server_addr()::text AS server_addr,inet_server_port() AS server_port")).rows[0];
 assert.match(identity.version,/PostgreSQL 18\.6/);assert.equal(identity.db,'sc_hierarchies');assert.equal(identity.usr,'sc_hierarchies_writer');assert.equal(identity.cluster,'staycurrent-hierarchies-20261025');assert.equal(identity.data_directory,'/var/lib/postgresql/18/docker');
 evidence.identity=identity;
 const available=(await observer.query("SELECT name,default_version FROM pg_available_extensions WHERE name='ltree'")).rows;
 assert.equal(available.length,1,'ltree is unavailable; ask root');evidence.extension=available;
 assert.equal((await observer.query("SELECT count(*)::integer AS n FROM pg_namespace WHERE nspname='hierarchy_lab'")).rows[0].n,0,'owned schema must be absent before setup');
 created=true;
 const setup=await observer.query(sql);evidence.setup=Array.isArray(setup)?setup.filter(r=>r.rows?.length).map(r=>r.rows):setup.rows;
 const verified=await observer.query(checks);evidence.checks=Array.isArray(verified)?verified.filter(r=>r.rows?.length).map(r=>r.rows):verified.rows;
 await observer.query('COMMIT');
 const a=await connect(),b=await connect();
 await a.query('SET search_path=hierarchy_lab,public');await b.query('SET search_path=hierarchy_lab,public');
 await a.query('BEGIN ISOLATION LEVEL READ COMMITTED');await b.query('BEGIN ISOLATION LEVEL READ COMMITTED');
 const membership=`WITH RECURSIVE subtree(id) AS (SELECT category_id FROM categories WHERE category_id=$1 UNION SELECT c.category_id FROM categories c JOIN subtree s ON c.parent_id=s.id) SELECT EXISTS(SELECT FROM subtree WHERE id=$2) AS forbidden`;
 const aCheck=(await a.query(membership,[10,20])).rows[0].forbidden;
 const bCheck=(await b.query(membership,[20,10])).rows[0].forbidden;assert.equal(aCheck,false);assert.equal(bCheck,false);
 await a.query('UPDATE categories SET parent_id=20 WHERE category_id=10');
 await b.query('UPDATE categories SET parent_id=10 WHERE category_id=20');
 await a.query('COMMIT');await b.query('COMMIT');
 const unprotected=(await observer.query('SELECT category_id,parent_id FROM hierarchy_lab.categories WHERE category_id IN (10,20) ORDER BY category_id')).rows;
 assert.deepEqual(unprotected,[{category_id:10,parent_id:20},{category_id:20,parent_id:10}]);evidence.unprotected={checks:{aCheck,bCheck},final:unprotected};
 await observer.query('UPDATE hierarchy_lab.categories SET parent_id=0 WHERE category_id IN(10,20)');await observer.query('SELECT hierarchy_lab.assert_derived()');
 await a.query('BEGIN ISOLATION LEVEL READ COMMITTED');await b.query('BEGIN ISOLATION LEVEL READ COMMITTED');
 const aPid=(await a.query('SELECT pg_backend_pid() AS pid')).rows[0].pid;
 const bPid=(await b.query('SELECT pg_backend_pid() AS pid')).rows[0].pid;
 await a.query('SELECT move_tree_node(10,20)');
 let bFinished=false;
 const bAttempt=b.query('SELECT move_tree_node(20,10)').then(r=>{bFinished=true;return {rows:r.rows};},e=>{bFinished=true;return {error:{message:e.message,code:e.code}};});
 let blockers=[];const deadline=Date.now()+5000;
 while(Date.now()<deadline){blockers=(await observer.query('SELECT pg_blocking_pids($1) AS pids',[bPid])).rows[0].pids;if(blockers.includes(aPid))break;assert.equal(bFinished,false,'B completed before blocking was observed');await new Promise(resolve=>setTimeout(resolve,30));}
 assert.ok(blockers.includes(aPid),'B did not block on A');
 await a.query('COMMIT');const bResult=await bAttempt;await b.query('ROLLBACK');
 assert.equal(bResult.error?.message,'new parent is inside the moving subtree');assert.equal(bResult.error.code,'P0001');
 const protectedFinal=(await observer.query('SELECT category_id,parent_id FROM hierarchy_lab.categories WHERE category_id IN(10,20) ORDER BY category_id')).rows;
 assert.deepEqual(protectedFinal,[{category_id:10,parent_id:20},{category_id:20,parent_id:0}]);await observer.query('SELECT hierarchy_lab.assert_derived()');
 evidence.protected={aPid,bPid,observedBlockers:blockers,bResult,final:protectedFinal};
 evidence.passed=true;
} catch(e){evidence.passed=false;evidence.failure={message:e.message,code:e.code};process.exitCode=1;}
finally{
 for(const c of clients){try{await c.query('ROLLBACK')}catch{}}
 if(created&&clients[0]){try{await clients[0].query('DROP SCHEMA hierarchy_lab CASCADE');evidence.cleanup='Owned hierarchy_lab schema removed; clients closed.';}catch(e){evidence.cleanupError=e.message;process.exitCode=1;}}
 await Promise.allSettled(clients.map(c=>c.end()));
 await fs.writeFile(new URL('./native-results.json',import.meta.url),JSON.stringify(evidence,null,2));
 console.log(JSON.stringify({passed:evidence.passed,sqlSha256:evidence.sqlSha256,checksSha256:evidence.checksSha256,cleanup:evidence.cleanup,failure:evidence.failure}));
}
