// Every invocation creates and stops its own native PostgreSQL cluster.
// Pass a fresh unused port for a later run: node verify.mjs 56130.
import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, existsSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { strict as assert } from 'node:assert';
import { setup, insert103, summary, wrong, correct, guarded, reserve, race, multiplied } from './model.mjs';

const started = new Date();
const port = Number(process.argv[2]);
assert(Number.isInteger(port) && port >= 56130, 'Supply an unused assigned port, starting at 56130');
const bin = '/opt/homebrew/opt/postgresql@18/bin';
const dir = mkdtempSync('/tmp/staycurrent-t3-a00-');
const data = `${dir}/data`;
const env = { ...process.env };
for (const k of ['PGHOSTADDR','PGSERVICE','PGSERVICEFILE','PGOPTIONS','PGDATABASE']) delete env[k];
Object.assign(env, { PGHOST: dir, PGPORT: String(port), PGDATABASE: 'a00', PGUSER: process.env.USER, PGCONNECT_TIMEOUT: '5' });
const log = { started: started.toISOString(), command: `node src/components/relational-trial-3/a00/verify.mjs ${port}`, port, cluster: data, commands: [], checks: [] };
const sessions = [];
function run(program, args, input, allowed = false) {
 const r = spawnSync(`${bin}/${program}`, args, {env, input, encoding:'utf8', timeout:15000});
 log.commands.push({program, args, input, status:r.status, stdout:r.stdout, stderr:r.stderr});
 if (!allowed && r.status !== 0) throw new Error(`${program}: ${r.stderr || r.error}`);
 return r;
}
const sql = (s, allowed = false) => run('psql', ['-XqAt','-v','ON_ERROR_STOP=1'], s, allowed);
const reset = () => sql(`DROP TABLE IF EXISTS payments,order_items,orders,products,customers CASCADE;\n${setup}`);
const check = (name, actual, expected) => { assert.deepEqual(actual, expected, name); log.checks.push({name, actual, expected}); };
function session(name) {
 const p = spawn(`${bin}/psql`, ['-XqAt','-v','ON_ERROR_STOP=1'], {env, stdio:['pipe','pipe','pipe']});
 const pending = [];
 let counter = 0, stderr = '';
 p.stderr.on('data', b => { stderr += b; });
 createInterface({input:p.stdout}).on('line', line => {
  const q = pending[0];
  if (!q) return;
  if (line === q.marker) { pending.shift(); log.commands.push({session:name, input:q.sql, stdout:q.lines.join('\n')}); q.resolve(q.lines.join('\n')); }
  else q.lines.push(line);
 });
 p.on('exit', code => { for (const q of pending.splice(0)) q.reject(new Error(`${name} exited ${code}: ${stderr}`)); });
 const s = { query(statement) { return new Promise((resolve,reject) => {
  const marker = `__a00_${name}_${counter++}__`;
  pending.push({marker, sql:statement, lines:[], resolve,reject});
  p.stdin.write(`${statement}\nSELECT '${marker}';\n`);
 }); }, stop() { p.stdin.end('\\q\n'); } };
 sessions.push(s); return s;
}
async function waitForLock(pid) {
 const deadline = Date.now() + 5000;
 while (Date.now() < deadline) {
  if (sql(`SELECT wait_event_type FROM pg_stat_activity WHERE pid=${pid};`).stdout.trim() === 'Lock') return;
  await new Promise(resolve => setTimeout(resolve,20));
 }
 throw new Error('Competing updater did not reach a lock wait');
}
let failed;
try {
 run('initdb', ['-D',data,'--locale=C','--encoding=UTF8','--auth-local=trust','--auth-host=reject']);
 run('pg_ctl', ['-D',data,'-l',`${dir}/server.log`,'-o',`-h '' -k '${dir}' -p ${port}`,'-w','-t','15','start']);
 run('createdb', ['a00']);
 log.version = sql('SELECT version();').stdout.trim();
 assert(log.version.includes('PostgreSQL 18.6'), log.version);
 log.settings = sql('SHOW default_transaction_isolation; SHOW fsync; SHOW synchronous_commit; SHOW full_page_writes;').stdout.trim();
 reset();
 for (const [name, statement, message] of [
  ['zero quantity',"INSERT INTO order_items VALUES (101,3,'P3',0,4.50);",'check constraint'],
  ['missing quantity',"INSERT INTO order_items VALUES (101,3,'P3',NULL,4.50);",'not-null constraint'],
  ['duplicate line identity',"INSERT INTO order_items VALUES (101,1,'P7',1,20);",'unique constraint'],
  ['missing order reference',"INSERT INTO order_items VALUES (999,1,'P7',1,20);",'foreign key constraint']
 ]) {
  const r = sql(statement,true); assert.notEqual(r.status,0); assert(r.stderr.includes(message)); log.checks.push({name, rejected:true, error:r.stderr.trim()});
 }
 sql(reserve);
 check('complete order stock',sql("SELECT product_id,stock FROM products ORDER BY product_id;").stdout.trim(),'P3|10\nP7|0\nP9|4');
 check('order 103 summary',sql(summary).stdout.trim(),'103|Mina Shah|29.00');
 check('wrong join exposes multiplication despite zero balance',sql(wrong).stdout.trim(),'79.00|79.00');
 check('independent totals repair',sql(correct).stdout.trim(),'39.50|39.50');
 check('model multiplied detail rows',multiplied,[ [1,'4.50',501,'30.00'], [1,'4.50',502,'9.50'], [2,'35.00',501,'30.00'], [2,'35.00',502,'9.50'] ]);
 // Counterexample: remove payment 502. The wrong join now gives 39.50|60,
 // while the true paid amount is 30; equal totals no longer hide the error.
 sql('DELETE FROM payments WHERE payment_id=502;');
 check('unequal detail multiplicities, wrong',sql(wrong).stdout.trim(),'39.50|60.00');
 check('unequal detail multiplicities, repaired',sql(correct).stdout.trim(),'39.50|30.00');
 reset();
 const a=session('Mina'), b=session('Tariq');
 const bPid=Number(await b.query('SELECT pg_backend_pid();'));
 await a.query('BEGIN;'); await b.query('BEGIN;');
 check('Mina early read',await a.query("SELECT stock FROM products WHERE product_id='P7';"),'1');
 check('Tariq early read',await b.query("SELECT stock FROM products WHERE product_id='P7';"),'1');
 await a.query("UPDATE products SET stock=0 WHERE product_id='P7'; UPDATE products SET stock=stock-2 WHERE product_id='P3';" + insert103);
 const staleB=b.query("UPDATE products SET stock=0 WHERE product_id='P7'; INSERT INTO orders VALUES (104,2,'2026-10-20 10:15+00','pending'); INSERT INTO order_items VALUES (104,1,'P7',1,20.00); COMMIT;");
 await waitForLock(bPid);
 await a.query('COMMIT;'); await staleB;
 check('unprotected counterexample',sql("SELECT stock,(SELECT count(*) FROM order_items WHERE order_id IN (103,104) AND product_id='P7') FROM products WHERE product_id='P7';").stdout.trim(),'0|2');
 reset();
 await a.query('BEGIN;'); await b.query('BEGIN;');
 check('Mina guarded claim',await a.query(guarded),'0');
 const protectedB=b.query(guarded);
 await waitForLock(bPid);
 await a.query("UPDATE products SET stock=stock-2 WHERE product_id='P3' AND stock>=2;"+insert103+' COMMIT;');
 check('Tariq guarded claim refuses after waiting',await protectedB,'');
 await b.query('ROLLBACK;');
 check('protected committed state',sql("SELECT stock,(SELECT count(*) FROM orders WHERE order_id IN (103,104)) FROM products WHERE product_id='P7';").stdout.trim(),'0|1');
 check('figure endpoints', [race.stale.at(-1)[4],race.guarded.at(-1)[4]],[0,0]);
 reset(); sql("UPDATE products SET stock=1 WHERE product_id='P3';");
 await a.query('BEGIN;');
 check('failure-case mug claimed',await a.query(guarded),'0');
 check('insufficient tea returns no row',await a.query("UPDATE products SET stock=stock-2 WHERE product_id='P3' AND stock>=2 RETURNING stock;"),'');
 await a.query('ROLLBACK;');
 check('rollback restores mug and leaves no new order',sql("SELECT stock,(SELECT count(*) FROM orders WHERE order_id=103) FROM products WHERE product_id='P7';").stdout.trim(),'1|0');
 // Counterexample to forgetting that rollback: commit the mug subtraction
 // after tea refusal, and the mug disappears without a new order.
 await a.query('BEGIN;'); await a.query(guarded); await a.query('COMMIT;');
 check('missing rollback visibly violates complete-order rule',sql("SELECT stock,(SELECT count(*) FROM orders WHERE order_id=103) FROM products WHERE product_id='P7';").stdout.trim(),'0|0');
 log.result='PASS';
} catch(error) { failed=error; log.result='FAIL'; log.error=String(error.stack); }
finally {
 for(const s of sessions) s.stop();
 if (existsSync(`${data}/postmaster.pid`)) {
  const stopped=run('pg_ctl',['-D',data,'-m','fast','-w','-t','15','stop'],undefined,true);
  log.serverStopped=stopped.status===0;
 } else log.serverStopped=true;
 log.ended=new Date().toISOString();
 log.elapsedSeconds=(Date.now()-started.getTime())/1000;
 const evidence=process.argv[3] || 'docs/article-work/relational-skill-trial-3/a00-evidence';
 mkdirSync(evidence,{recursive:true});
 writeFileSync(`${evidence}/native-${port}.json`,JSON.stringify(log,null,2));
 if(log.serverStopped) rmSync(dir,{recursive:true,force:true});
 console.log(JSON.stringify({result:log.result,version:log.version,checks:log.checks.length,serverStopped:log.serverStopped,evidence:`${evidence}/native-${port}.json`}));
}
if(failed) throw failed;
assert(log.serverStopped,'Server shutdown failed; inspect its recorded directory');
