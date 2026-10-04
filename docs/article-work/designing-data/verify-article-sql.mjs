// Execute the SQL constants readers see in the Astro article sources.
// Uses the same isolated runtime installation as verify-sql.mjs.
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
if (!process.argv[2]) throw new Error('Pass the absolute PGlite dist/index.js path.');
const { PGlite } = await import(pathToFileURL(process.argv[2]).href);
const articleRoot = new URL('../../../src/pages/learn/databases/relational/', import.meta.url);
const report = { checked: '2026-10-04', sources: {}, statements: [], limits: 'Single connection; concurrency interleaving is documented, not executed. Index creation is verified, not performance.' };
async function source(name) {
  const text = await readFile(new URL(`${name}.astro`, articleRoot), 'utf8');
  report.sources[name] = createHash('sha256').update(text).digest('hex');
  return Object.fromEntries([...text.matchAll(/const (\w+) = `([\s\S]*?)`;/g)].map(match => [match[1], match[2]]));
}
async function statement(db, name, sql, code) {
  let result, error;
  try { result = await db.query(sql); } catch (caught) { error = caught; }
  if (code) assert.equal(error?.code, code, name);
  else if (error) throw error;
  report.statements.push({ name, sql, ...(error ? { outcome: 'rejected', code: error.code, message: error.message } : { outcome: 'accepted', rows: result.rows, affectedRows: result.affectedRows }) });
  return result?.rows;
}
async function group(db, name, sql, outcomes) {
  // The commissioned constants contain no procedural blocks or quoted semicolons.
  const statements = sql.replace(/--[^\n]*/g, '').split(';').map(text => text.trim()).filter(Boolean);
  assert.equal(statements.length, outcomes.length, `${name}: statement count`);
  for (let i = 0; i < statements.length; i++) await statement(db, `${name} ${i + 1}`, statements[i], outcomes[i]);
}
const db = new PGlite();
try {
  report.version = (await db.query('SELECT version()')).rows[0].version;
  const constraints = await source('constraints');
  await group(db, 'schema', constraints.schema, [null, null, null, null]);
  await group(db, 'fixture', constraints.fixture, [null, null, null, null]);
  const modelling = await source('modelling');
  const receipt = await statement(db, 'receiptQuery', modelling.receiptQuery);
  assert.deepEqual(receipt, [{ line_no: 1, name: 'Blue mug', quantity: 2, unit_price: '18.00', line_total: '36.00' }]);
  await group(db, 'nullCheck', constraints.nullCheck, [null, null, '23514', null]);
  await group(db, 'lineWrites', constraints.lineWrites, [null, '23505', '23503', '23514', '23502']);
  await group(db, 'skuWrites', constraints.skuWrites, [null, '23505']);
  await group(db, 'duplicateCheck serial statements', constraints.duplicateCheck, [null, null]);
  const json = await source('tables-and-documents');
  await group(db, 'relatedRows', json.relatedRows, [null, null]);
  await group(db, 'addJson', json.addJson, [null, null, null]);
  const values = await statement(db, 'valuesQuery', json.valuesQuery);
  assert.deepEqual(values, [
    { label: 'missing key', has_key: false, json_type: null, text_value: null },
    { label: 'JSON null', has_key: true, json_type: 'null', text_value: null },
    { label: 'number', has_key: true, json_type: 'number', text_value: '350' },
    { label: 'string', has_key: true, json_type: 'string', text_value: '350' },
    { label: 'SQL NULL', has_key: null, json_type: null, text_value: null },
  ]);
  const capacity = await statement(db, 'jsonQuery before changing capacity', json.jsonQuery);
  assert.deepEqual(capacity, [{ product_id: 'P7', name: 'Blue mug', capacity_ml: 350 }]);
  await group(db, 'typeCheck', json.typeCheck, [null]);
  await statement(db, 'Type check accepts fractional number', `UPDATE products SET attributes = jsonb_set(attributes, '{capacity_ml}', '350.5'::jsonb) WHERE product_id = 'P7'`);
  await statement(db, 'Integer query rejects fractional number', json.jsonQuery, '22P02');
  await statement(db, 'Restore whole capacity', `UPDATE products SET attributes = jsonb_set(attributes, '{capacity_ml}', '350'::jsonb) WHERE product_id = 'P7'`);
  await group(db, 'indexes', json.indexes, [null, null]);
  await group(db, 'updateJson', json.updateJson, [null]);
  const updated = await statement(db, 'jsonQuery after changing capacity', json.jsonQuery);
  assert.deepEqual(updated, [{ product_id: 'P7', name: 'Blue mug', capacity_ml: 375 }]);
  await statement(db, 'Expression index rejects fractional indexed write', `UPDATE products SET attributes = jsonb_set(attributes, '{capacity_ml}', '350.5'::jsonb) WHERE product_id = 'P7'`, '22P02');
  await writeFile(new URL('./article-sql-results.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
  console.log(`${report.statements.length} source and focused SQL statements verified.`);
} finally { await db.close(); }
