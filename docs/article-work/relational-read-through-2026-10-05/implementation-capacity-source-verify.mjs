import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const root = new URL('../../../', import.meta.url);
const articlePath = new URL('src/pages/learn/databases/relational/tables-and-documents.astro', root);
const stalePath = new URL('src/components/explainers/design/JsonStaleWrite.astro', root);
const source = await readFile(articlePath, 'utf8');
const staleSource = await readFile(stalePath, 'utf8');
const schema = await readFile(new URL('docs/article-work/designing-data/schema.sql', root), 'utf8');
const sql = Object.fromEntries(['addJson', 'relatedRows', 'valuesQuery', 'jsonQuery', 'typeCheck', 'moveCapacity', 'hybridQuery', 'indexes', 'updateJson'].map(name => {
  const match = source.match(new RegExp('const ' + name + ' = `([\\s\\S]*?)`;'));
  assert.ok(match, `Source constant ${name}`);
  assert.equal(match[1].includes('${'), false, 'No interpolated SQL constants');
  return [name, match[1]];
}));
const runtime = process.env.PGLITE_MODULE || '/private/tmp/staycurrent-design-sql/node_modules/@electric-sql/pglite/dist/index.js';
const { PGlite } = await import(pathToFileURL(runtime).href);
const db = new PGlite();
const records = [];
const record = (label, result) => records.push({label, result});
const readProduct = async () => (await db.query("SELECT attributes FROM products WHERE product_id = 'P7'")).rows[0].attributes;
const reset = async () => {
  await db.exec('DROP TABLE IF EXISTS mug_details, order_lines, orders, products, customers CASCADE');
  await db.exec(schema);
  await db.exec(sql.addJson);
};
await db.exec(schema);
await db.exec(sql.relatedRows);
const alternative = (await db.query('SELECT * FROM mug_details')).rows;
assert.deepEqual(alternative, [{product_id:'P7', capacity_ml:350}]);
record('Copied relatedRows alternative on the four-table setup', alternative);
await reset();
record('Five samples, copied valuesQuery', (await db.query(sql.valuesQuery)).rows);
assert.deepEqual((await db.query(sql.jsonQuery)).rows, [{product_id:'P7', name:'Blue mug', capacity_ml:350}]);
record('Initial copied JSON query', (await db.query(sql.jsonQuery)).rows);
await db.exec(sql.typeCheck);
await db.exec(sql.moveCapacity);
assert.deepEqual(await readProduct(), {material:'ceramic'});
const hybrid = (await db.query(sql.hybridQuery)).rows;
assert.deepEqual(hybrid, [{product_id:'P7', name:'Blue mug', capacity_ml:350}]);
record('Copied migration committed', {P7:await readProduct(), hybrid});
await db.exec(sql.indexes);
const indexes = (await db.query("SELECT indexname FROM pg_indexes WHERE indexname IN ('products_attributes_gin', 'mug_details_capacity_idx') ORDER BY indexname")).rows;
assert.equal(indexes.length, 2);
record('Copied index declarations', indexes);
await db.exec(sql.updateJson);
assert.deepEqual(await readProduct(), {material:'stoneware'});
assert.equal((await db.query("SELECT capacity_ml FROM mug_details WHERE product_id = 'P7'")).rows[0].capacity_ml, 350);
record('Copied current-object update after migration', {P7:await readProduct(), capacity_ml:350});

const samples = [
  ['ordinary integer','{"capacity_ml":350,"material":"ceramic"}',350],
  ['decimal whole','{"capacity_ml":350.0,"material":"ceramic"}',350],
  ['exponent whole','{"capacity_ml":3.5e2,"material":"ceramic"}',350],
  ['minimum','{"capacity_ml":1,"material":"ceramic"}',1],
  ['maximum','{"capacity_ml":2147483647,"material":"ceramic"}',2147483647],
  ['missing','{"material":"ceramic"}',null],
  ['JSON null','{"capacity_ml":null,"material":"ceramic"}',null],
  ['numeric string','{"capacity_ml":"350","material":"ceramic"}',null],
  ['non-numeric string','{"capacity_ml":"large","material":"ceramic"}',null],
  ['fraction','{"capacity_ml":350.5,"material":"ceramic"}',null],
  ['precise fraction','{"capacity_ml":350.9999999999999999999999999999,"material":"ceramic"}',null],
  ['zero','{"capacity_ml":0,"material":"ceramic"}',null],
  ['negative','{"capacity_ml":-1,"material":"ceramic"}',null],
  ['overflow','{"capacity_ml":2147483648,"material":"ceramic"}',null],
  ['above maximum fraction','{"capacity_ml":2147483647.1,"material":"ceramic"}',null],
  ['large valid jsonb number','{"capacity_ml":1e100,"material":"ceramic"}',null],
  ['boolean','{"capacity_ml":true,"material":"ceramic"}',null],
  ['array','{"capacity_ml":[350],"material":"ceramic"}',null],
  ['object','{"capacity_ml":{"value":350},"material":"ceramic"}',null]
];
for (const [label, attributes, expected] of samples) {
  await reset();
  // The earlier type check is optional. Omitting it here exposes every branch
  // of the copied migration guard, including JSON strings and JSON null.
  await db.query("UPDATE products SET attributes = $1::jsonb WHERE product_id = 'P7'", [attributes]);
  const original = await readProduct();
  try {
    await db.exec(sql.moveCapacity);
    assert.notEqual(expected, null, `${label}: migration must fail`);
    const details = (await db.query('SELECT * FROM mug_details')).rows;
    assert.deepEqual(details, [{product_id:'P7', capacity_ml:expected}]);
    assert.deepEqual(await readProduct(), {material:'ceramic'});
    record(`Copied migration: ${label}`, {accepted:true, details, attributes:await readProduct()});
  } catch (error) {
    if (error instanceof assert.AssertionError) throw error;
    assert.equal(expected, null, `${label}: migration must succeed`);
    assert.equal(error.code, '23502');
    await db.exec('ROLLBACK');
    assert.deepEqual(await readProduct(), original);
    const detailsTable = (await db.query("SELECT to_regclass('mug_details') AS relation")).rows[0].relation;
    assert.equal(detailsTable, null, 'CREATE TABLE rolled back too');
    record(`Copied migration: ${label}`, {accepted:false, sqlstate:error.code, rollbackRetainedOriginal:true, attributes:await readProduct(), detailsTable});
  }
}

for (const [label, attributes, expected] of samples) {
  await reset();
  await db.exec(sql.typeCheck);
  const jsonValue = JSON.parse(attributes).capacity_ml;
  const typeAllowed = jsonValue === undefined || typeof jsonValue === 'number';
  let outcome;
  try {
    await db.query("UPDATE products SET attributes = $1::jsonb WHERE product_id = 'P7'", [attributes]);
    assert.equal(typeAllowed, true, `${label}: type rule must reject`);
    outcome = {accepted:true};
    if (label === 'fraction') {
      try { await db.query(sql.jsonQuery); throw new Error('Text-to-integer must reject fraction'); }
      catch (error) { assert.equal(error.code, '22P02'); outcome.jsonQuerySqlstate = error.code; }
    }
  } catch (error) {
    if (error instanceof assert.AssertionError) throw error;
    assert.equal(typeAllowed, false, `${label}: type rule must accept`);
    assert.equal(error.code, '23514');
    outcome = {accepted:false, sqlstate:error.code};
  }
  record(`Copied optional typeCheck: ${label}`, outcome);
}

const initial = {material:'ceramic', finish:'gloss'};
const staleSchedules = [];
for (const mode of ['whole-object replacement', 'current-object expression']) {
  await reset();
  await db.exec(sql.typeCheck);
  await db.exec(sql.moveCapacity);
  await db.query("UPDATE products SET attributes = $1::jsonb WHERE product_id = 'P7'", [JSON.stringify(initial)]);
  const aRead = await readProduct();
  const bRead = await readProduct();
  assert.deepEqual(aRead, initial);
  assert.deepEqual(bRead, initial);
  await db.exec('BEGIN ISOLATION LEVEL READ COMMITTED');
  await db.query("UPDATE products SET attributes = $1::jsonb WHERE product_id = 'P7'", [JSON.stringify({...aRead, finish:'matte'})]);
  await db.exec('COMMIT');
  const afterA = await readProduct();
  await db.exec('BEGIN ISOLATION LEVEL READ COMMITTED');
  if (mode === 'whole-object replacement') {
    await db.query("UPDATE products SET attributes = $1::jsonb WHERE product_id = 'P7'", [JSON.stringify({...bRead, material:'stoneware'})]);
  } else {
    await db.exec(sql.updateJson);
  }
  await db.exec('COMMIT');
  const afterB = await readProduct();
  assert.deepEqual(afterB, {material:'stoneware', finish:mode === 'whole-object replacement' ? 'gloss' : 'matte'});
  staleSchedules.push({mode, aRead, bRead, afterA, afterB});
}
record('Illustration schedules executed sequentially', staleSchedules);
const version = (await db.query('SELECT version()')).rows[0].version;
const output = {
  checkedAt:'2026-10-05', runtime, version,
  source:{articlePath:articlePath.pathname, articleSha256:createHash('sha256').update(source).digest('hex'), stalePath:stalePath.pathname, staleSha256:createHash('sha256').update(staleSource).digest('hex')},
  sql:{schema,...sql}, records,
  limit:'Source constants are executed verbatim. The stale-write illustration has no executable SQL source except the article updateJson expression; its explicit schedule is implemented with sequential reads and commits in one connection. No concurrent session, lock wait, or benchmark was run.'
};
await writeFile(new URL('./implementation-capacity-source-results.json', import.meta.url), JSON.stringify(output,null,2)+'\n');
await db.close();
console.log(`Passed copied article route, ${samples.length} migration cases with rollback checks, ${samples.length} optional type checks, and both sequential stale-object schedules.`);
