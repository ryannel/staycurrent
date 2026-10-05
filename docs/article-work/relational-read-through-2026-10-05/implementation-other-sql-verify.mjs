import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const root = new URL('../../../', import.meta.url);
const paths = {
  constraints:'src/pages/learn/databases/relational/constraints.astro',
  modelling:'src/pages/learn/databases/relational/modelling.astro',
  pagination:'src/pages/learn/databases/relational/large-results.astro',
  retry:'src/pages/learn/databases/relational/conflicts-and-retries.astro',
  download:'docs/article-work/designing-data/schema.sql',
  extension:'docs/article-work/querying-transactions/query-pagination.sql'
};
const sources = {};
for (const [name,path] of Object.entries(paths)) sources[name] = await readFile(new URL(path,root),'utf8');
const extract = (source,name) => {
  const match = source.match(new RegExp('const '+name+' = `([\\s\\S]*?)`;'));
  assert.ok(match, name);
  assert.equal(match[1].includes('${'),false);
  return match[1];
};
// These bounded constants contain no semicolons inside string literals.
const statements = sql => sql.replace(/^\s*--.*$/gm,'').split(';').map(s=>s.trim()).filter(Boolean).map(s=>s+';');
const sql = {
  constraints:Object.fromEntries(['schema','fixture','lineWrites','skuWrites'].map(n=>[n,extract(sources.constraints,n)])),
  receiptQuery:extract(sources.modelling,'receiptQuery'),
  pageWithLines:extract(sources.pagination,'pageWithLines'),
  paginationSetup:extract(sources.pagination,'setup'),
  retry:Object.fromEntries(['setup','claim','reserve','lookup','protocol','retry'].map(n=>[n,extract(sources.retry,n)])),
  download:sources.download, extension:sources.extension
};
const runtime = process.env.PGLITE_MODULE || '/private/tmp/staycurrent-design-sql/node_modules/@electric-sql/pglite/dist/index.js';
const {PGlite} = await import(pathToFileURL(runtime).href);
const db = new PGlite();
const records = [];
const record = (label,result) => records.push({label,result});
const reset = async setup => {
  await db.exec('DROP TABLE IF EXISTS stock, order_lines, orders, products, customers CASCADE');
  await db.exec(setup);
};
const attempt = async (label,statement,code) => {
  try {
    const result = await db.query(statement);
    assert.equal(code,null,`${label} should reject`);
    record(label,{accepted:true,affectedRows:result.affectedRows});
  } catch(error) {
    if(error instanceof assert.AssertionError) throw error;
    assert.equal(error.code,code,label);
    record(label,{accepted:false,sqlstate:error.code});
  }
};
for (const mode of ['inline fixture','download fixture']) {
  await reset(mode === 'inline fixture' ? sql.constraints.schema : sql.download);
  if(mode === 'inline fixture') await db.exec(sql.constraints.fixture);
  const lineStatements = statements(sql.constraints.lineWrites);
  const lineCodes = [null,'23505','23503','23514','23502'];
  assert.equal(lineStatements.length,lineCodes.length);
  for(let i=0;i<lineStatements.length;i++) await attempt(`${mode}: lineWrites ${i+1}`,lineStatements[i],lineCodes[i]);
  const skuStatements = statements(sql.constraints.skuWrites);
  const skuCodes = [null,'23505'];
  assert.equal(skuStatements.length,skuCodes.length);
  for(let i=0;i<skuStatements.length;i++) await attempt(`${mode}: skuWrites ${i+1}`,skuStatements[i],skuCodes[i]);
  const lines = (await db.query("SELECT line_no, product_id, quantity FROM order_lines WHERE order_id='O12' ORDER BY line_no")).rows;
  assert.deepEqual(lines,[{line_no:1,product_id:'P7',quantity:2},{line_no:2,product_id:'P7',quantity:1}]);
  record(`${mode}: final O12 lines`,lines);
}

await reset(sql.download);
const receipt = (await db.query(sql.receiptQuery)).rows;
assert.deepEqual(receipt,[{line_no:1,name:'Blue mug',quantity:2,unit_price:'18.00',line_total:'36.00'}]);
record('Copied modelling receiptQuery on named-insert download',receipt);

const expectedLines = [
  {order_id:'O12',line_no:1,product_id:'P7',quantity:2},
  {order_id:'O13',line_no:1,product_id:'P7',quantity:1},
  {order_id:'O13',line_no:2,product_id:'P8',quantity:1}
];
await db.exec(sql.paginationSetup);
assert.deepEqual((await db.query(sql.pageWithLines)).rows,expectedLines);
record('Copied pageWithLines: two oldest orders, three lines',(await db.query(sql.pageWithLines)).rows);
await db.exec('BEGIN');
await db.query("DELETE FROM order_lines WHERE order_id='O12'");
const emptyO12 = (await db.query(sql.pageWithLines)).rows;
assert.deepEqual(emptyO12,[{order_id:'O12',line_no:null,product_id:null,quantity:null},...expectedLines.slice(1)]);
record('Copied pageWithLines: O12 has no lines',emptyO12);
await db.query("DELETE FROM order_lines WHERE order_id='O13'");
const bothEmpty = (await db.query(sql.pageWithLines)).rows;
assert.deepEqual(bothEmpty,[{order_id:'O12',line_no:null,product_id:null,quantity:null},{order_id:'O13',line_no:null,product_id:null,quantity:null}]);
record('Copied pageWithLines: both oldest headers have no lines',bothEmpty);
await db.exec('ROLLBACK');

await reset(sql.download);
try {
  await db.exec(sql.extension);
  throw new Error('Expected whole-file batch isolation-setting failure');
} catch (error) {
  assert.equal(error.code,'25001');
  await db.exec('ROLLBACK');
  const count = (await db.query('SELECT count(*)::integer AS count FROM orders')).rows[0].count;
  assert.equal(count,2);
  record('Whole-file batch caveat reproduced',{sqlstate:error.code,message:error.message,ordersAfterRollback:count});
}
await reset(sql.download);
const extensionTail = sql.extension.slice(sql.extension.indexOf('WITH page AS (')).trim();
assert.equal(extensionTail,sql.pageWithLines);
const extensionResults = [];
// Preserve the downloadable file's statement order and explicit transaction
// boundaries. A psql-style script sends statements separately.
for(const statement of statements(sql.extension)) extensionResults.push(await db.query(statement));
assert.deepEqual(extensionResults.at(-1).rows,expectedLines);
assert.equal((await db.query("SELECT count(*)::integer AS count FROM orders")).rows[0].count,5);
record('Complete pagination extension ran; appended query matches source exactly',{lastResult:extensionResults.at(-1).rows,ordersAfterExperiments:5});

await reset(sql.download);
await db.exec(sql.retry.setup);
assert.deepEqual((await db.exec(sql.retry.claim)).flatMap(result=>result.rows),[{order_id:'O14'}]);
const freshReserve = await db.exec(sql.retry.reserve);
assert.deepEqual(freshReserve[0].rows,[{available:1}]);
await db.exec('COMMIT');
const freshLookup = (await db.query(sql.retry.lookup)).rows;
assert.deepEqual(freshLookup,[{order_id:'O14',customer_id:'C4',product_id:'P7',quantity:2,unit_price:'20.00'}]);
record('Existing copied checkout protocol: fresh committed branch',freshLookup);
const duplicate = (await db.exec(sql.retry.claim.replaceAll('O14','O15'))).flatMap(result=>result.rows);
assert.deepEqual(duplicate,[]);
assert.deepEqual((await db.query(sql.retry.lookup)).rows,freshLookup);
await db.exec('COMMIT');
record('Existing copied claim: duplicate returns no row and lookup recovers O14',freshLookup);
assert.deepEqual((await db.exec(sql.retry.claim.replaceAll('O14','O15').replaceAll('K14','K15'))).flatMap(result=>result.rows),[{order_id:'O15'}]);
const guardedUpdate = statements(sql.retry.reserve)[0];
const insufficient = await db.query(guardedUpdate);
assert.deepEqual(insufficient.rows,[]);
assert.equal(insufficient.affectedRows,0);
await db.exec('ROLLBACK');
assert.deepEqual((await db.query("SELECT order_id FROM orders WHERE operation_id='K15'")).rows,[]);
assert.equal((await db.query("SELECT available FROM stock WHERE product_id='P7'")).rows[0].available,1);
record('Response table zero-row stock outcome',{affectedRows:insufficient.affectedRows,rows:insufficient.rows,provisionalClaimRolledBack:true,stock:1});

const retryTable = sources.retry.match(/<section id="response-reference">([\s\S]*?)<\/section>/)[1];
const output = {
  checkedAt:'2026-10-05',runtime,version:(await db.query('SELECT version()')).rows[0].version,
  sources:Object.fromEntries(Object.entries(sources).map(([name,content])=>[name,{path:new URL(paths[name],root).pathname,sha256:createHash('sha256').update(content).digest('hex')}])),
  sql,retryTable,records,
  limit:'Single PGlite connection. Rejected constraint statements run separately outside an explicit transaction. The full pagination download is sent statement by statement, preserving explicit transaction boundaries. One initial whole-file db.exec attempt failed with 25001 (SET TRANSACTION ISOLATION LEVEL must be called before any query); sending separately models psql script execution. Pagination mutation checks are reviewer-created rollback probes. The retry table is reviewed against primary documentation; deadlocks, wait cancellation, uncertain COMMIT and simultaneous claims are not reproduced.'
};
await writeFile(new URL('./implementation-other-sql-results.json',import.meta.url),JSON.stringify(output,null,2)+'\n');
await db.close();
console.log(`Passed ${records.length} source SQL checks; retry response reference reviewed separately against primary documentation.`);
