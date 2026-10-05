// Targeted recheck of the claim fragment that now opens its own transaction.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const root = new URL('../../../',import.meta.url);
const paths = {
  retry:'src/pages/learn/databases/relational/conflicts-and-retries.astro',
  pagination:'src/pages/learn/databases/relational/large-results.astro',
  extension:'docs/article-work/querying-transactions/query-pagination.sql',
  download:'docs/article-work/designing-data/schema.sql'
};
const source = {};
for(const [name,path] of Object.entries(paths)) source[name] = await readFile(new URL(path,root),'utf8');
const extract = name => {
  const match = source.retry.match(new RegExp('const '+name+' = `([\\s\\S]*?)`;'));
  assert.ok(match,name);
  return match[1];
};
const sql = Object.fromEntries(['setup','claim','reserve','lookup'].map(n=>[n,extract(n)]));
assert.ok(sql.claim.startsWith('BEGIN ISOLATION LEVEL READ COMMITTED;'));
const reserveUpdate = sql.reserve.slice(0,sql.reserve.indexOf(';')+1);
const runtime = process.env.PGLITE_MODULE || '/private/tmp/staycurrent-design-sql/node_modules/@electric-sql/pglite/dist/index.js';
const {PGlite} = await import(pathToFileURL(runtime).href);
const db = new PGlite();
const records = [];
const reset = async () => {
  await db.exec('DROP TABLE IF EXISTS stock, order_lines, orders, products, customers CASCADE');
  await db.exec(source.download);
  await db.exec(sql.setup);
};
await reset();
const freshClaim = (await db.exec(sql.claim)).flatMap(r=>r.rows);
assert.deepEqual(freshClaim,[{order_id:'O14'}]);
const reservation = await db.exec(sql.reserve);
assert.deepEqual(reservation[0].rows,[{available:1}]);
await db.exec('COMMIT');
const purchase = (await db.query(sql.lookup)).rows;
assert.deepEqual(purchase,[{order_id:'O14',customer_id:'C4',product_id:'P7',quantity:2,unit_price:'20.00'}]);
records.push({label:'Exact source claim opens fresh transaction, success commits complete purchase',claim:freshClaim,reservation:reservation[0].rows,lookup:purchase});

const duplicateClaimSql = sql.claim.replaceAll('O14','O15');
const duplicateClaim = (await db.exec(duplicateClaimSql)).flatMap(r=>r.rows);
assert.deepEqual(duplicateClaim,[]);
const duplicateLookup = (await db.query(sql.lookup)).rows;
assert.deepEqual(duplicateLookup,purchase);
await db.exec('COMMIT');
const stockAfterDuplicate = (await db.query("SELECT available FROM stock WHERE product_id='P7'")).rows[0].available;
assert.equal(stockAfterDuplicate,1);
assert.equal((await db.query("SELECT count(*)::integer AS count FROM orders WHERE operation_id='K14'")).rows[0].count,1);
records.push({label:'Source claim with proposed O15 opens duplicate transaction; lookup returns O14',claim:duplicateClaim,lookup:duplicateLookup,stock:stockAfterDuplicate});

await reset();
await db.exec("UPDATE stock SET available=1 WHERE product_id='P7'");
const unavailableClaim = (await db.exec(sql.claim)).flatMap(r=>r.rows);
assert.deepEqual(unavailableClaim,[{order_id:'O14'}]);
const unavailable = await db.query(reserveUpdate);
assert.deepEqual(unavailable.rows,[]);
assert.equal(unavailable.affectedRows,0);
// Follow the article's no-row branch: do not execute the subsequent line insert.
await db.exec('ROLLBACK');
const abandoned = (await db.query(sql.lookup)).rows;
assert.deepEqual(abandoned,[]);
assert.deepEqual((await db.query("SELECT order_id FROM orders WHERE order_id='O14' OR operation_id='K14'")).rows,[]);
assert.equal((await db.query("SELECT available FROM stock WHERE product_id='P7'")).rows[0].available,1);
records.push({label:'Exact source claim opens transaction; unavailable-stock branch rolls back provisional order and key',claim:unavailableClaim,reservation:unavailable.rows,lookupAfterRollback:abandoned,stock:1});

assert.ok(source.pagination.includes('execute their statements one at a time'));
assert.ok(source.pagination.includes('psql -f'));
assert.ok(source.extension.includes('Send statements one at a time'));
assert.ok(source.extension.includes('Do not send this whole file as one multi-statement server query.'));
records.push({label:'Pagination execution-mode clarification reviewed',articleStatementMode:true,downloadStatementMode:true,scriptMode:'psql -f',assessment:'Addresses the previously reproduced whole-batch failure by preserving each explicit transaction boundary.'});

const output = {
  checkedAt:'2026-10-05',runtime,version:(await db.query('SELECT version()')).rows[0].version,
  sources:Object.fromEntries(Object.entries(source).map(([name,content])=>[name,{path:new URL(paths[name],root).pathname,sha256:createHash('sha256').update(content).digest('hex')}])),
  sql:{...sql,reserveUpdate,duplicateClaimSql},records,
  limit:'Targeted source-fragment recheck. No manually supplied BEGIN precedes any claim. Explicit COMMIT/ROLLBACK complete the article branches. One connection executes sequential attempts; no concurrent duplicate wait or lost reply is reproduced. Pagination instructions are re-read; completed pagination execution checks are not repeated.'
};
await writeFile(new URL('./implementation-other-sql-claim-results.json',import.meta.url),JSON.stringify(output,null,2)+'\n');
await db.close();
console.log('Passed fresh success, duplicate recovery and unavailable-stock rollback using the source claim as transaction opener; pagination clarification confirmed.');
