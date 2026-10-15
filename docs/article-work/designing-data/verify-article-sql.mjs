// Execute the SQL constants readers see in the Astro article sources.
// Run with the project dependency; an optional argument selects another runtime.
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const { PGlite } = await import(process.argv[2] ? pathToFileURL(process.argv[2]).href : '@electric-sql/pglite');
const articleRoot = new URL('../../../src/pages/learn/databases/relational/', import.meta.url);
const report = { checked: '2026-10-15', sources: {}, statements: [], limits: 'Single connection; concurrency interleaving is documented, not executed. Index creation is verified, not performance.' };
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
function splitStatements(sql) {
  // The commissioned constants contain no procedural blocks or quoted semicolons.
  return sql.replace(/--[^\n]*/g, '').split(';').map(text => text.trim()).filter(Boolean);
}
async function group(db, name, sql, outcomes) {
  const statements = splitStatements(sql);
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
  // The related-row snippet is an alternative, not part of the migration setup.
  const related = new PGlite();
  try {
    await related.exec(constraints.schema);
    await related.exec(constraints.fixture);
    await group(related, 'relatedRows', json.relatedRows, [null, null]);
    assert.deepEqual(await statement(related, 'Alternative typed capacity', 'SELECT capacity_ml FROM mug_details'), [{ capacity_ml: 350 }]);
  } finally { await related.close(); }
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
  await group(db, 'moveCapacity', json.moveCapacity, [null, null, null, null, null]);
  assert.deepEqual(await statement(db, 'hybridQuery after conversion', json.hybridQuery), [{ product_id: 'P7', name: 'Blue mug', capacity_ml: 350 }]);
  assert.deepEqual(await statement(db, 'JSON capacity removed after conversion', `SELECT attributes FROM products WHERE product_id = 'P7'`), [{ attributes: { material: 'ceramic' } }]);
  await group(db, 'indexes', json.indexes, [null, null]);
  await group(db, 'updateJson', json.updateJson, [null]);
  assert.deepEqual(await statement(db, 'Ceramic query after changing material', json.hybridQuery), []);
  assert.deepEqual(await statement(db, 'Changed material preserves typed capacity', `SELECT p.attributes, m.capacity_ml FROM products p JOIN mug_details m USING (product_id) WHERE p.product_id = 'P7'`), [{ attributes: { material: 'stoneware' }, capacity_ml: 350 }]);
  await statement(db, 'Typed capacity rejects zero', `UPDATE mug_details SET capacity_ml = 0 WHERE product_id = 'P7'`, '23514');
  await statement(db, 'Typed capacity rejects SQL NULL', `UPDATE mug_details SET capacity_ml = NULL WHERE product_id = 'P7'`, '23502');

  const conversionInputs = [
    ['whole number', '350', true], ['whole decimal', '350.0', true],
    ['missing key', undefined, false], ['JSON null', 'null', false],
    ['numeric string', '"350"', false], ['fraction', '350.5', false],
    ['zero', '0', false], ['negative', '-1', false],
    ['integer overflow', '2147483648', false], ['object', '{}', false],
  ];
  for (const [label, input, accepted] of conversionInputs) {
    const probe = new PGlite();
    try {
      await probe.exec(constraints.schema);
      await probe.exec(constraints.fixture);
      await probe.exec(json.addJson);
      // Test the conversion policy itself, without the optional earlier type check.
      const attributes = input === undefined ? '{"material":"ceramic"}' : `{"material":"ceramic","capacity_ml":${input}}`;
      await probe.query(`UPDATE products SET attributes = $1::jsonb WHERE product_id = 'P7'`, [attributes]);
      const original = (await probe.query(`SELECT attributes FROM products WHERE product_id = 'P7'`)).rows;
      const [begin, create, insert, remove, commit] = splitStatements(json.moveCapacity);
      assert.equal(splitStatements(json.moveCapacity).length, 5);
      await statement(probe, `${label}: begin conversion`, begin);
      await statement(probe, `${label}: create details`, create);
      await statement(probe, `${label}: convert input`, insert, accepted ? undefined : '23502');
      if (accepted) {
        await statement(probe, `${label}: remove old value`, remove);
        await statement(probe, `${label}: commit`, commit);
        assert.deepEqual(await statement(probe, `${label}: hybrid result`, json.hybridQuery), [{ product_id: 'P7', name: 'Blue mug', capacity_ml: 350 }]);
        assert.deepEqual(await statement(probe, `${label}: one authoritative capacity`, `SELECT attributes FROM products WHERE product_id = 'P7'`), [{ attributes: { material: 'ceramic' } }]);
      } else {
        await statement(probe, `${label}: rollback`, 'ROLLBACK');
        assert.deepEqual(await statement(probe, `${label}: original JSON retained`, `SELECT attributes FROM products WHERE product_id = 'P7'`), original);
        assert.deepEqual(await statement(probe, `${label}: table creation rolled back`, `SELECT to_regclass('mug_details') AS table_name`), [{ table_name: null }]);
      }
    } finally { await probe.close(); }
  }
  await writeFile(new URL('./article-sql-results.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
  console.log(`${report.statements.length} source and focused SQL statements verified.`);
} finally { await db.close(); }
