// Run from the repository root with Node. No project dependencies are changed.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const runtime = process.env.PGLITE_MODULE || '/private/tmp/staycurrent-design-sql/node_modules/@electric-sql/pglite/dist/index.js';
const { PGlite } = await import(pathToFileURL(runtime).href);
const db = new PGlite();
const packageVersion = JSON.parse(await readFile(new URL('../package.json', pathToFileURL(runtime)), 'utf8')).version;
const guard = `CASE
  WHEN jsonb_typeof(payload -> 'capacity_ml') = 'number' THEN
    CASE
      WHEN (payload ->> 'capacity_ml')::numeric BETWEEN 1 AND 2147483647
       AND (payload ->> 'capacity_ml')::numeric =
           trunc((payload ->> 'capacity_ml')::numeric)
      THEN ((payload ->> 'capacity_ml')::numeric)::integer
      ELSE NULL
    END
  ELSE NULL
END`;

await db.exec(`CREATE TABLE products (product_id text PRIMARY KEY);
  CREATE TABLE mug_details (
    product_id text PRIMARY KEY REFERENCES products (product_id) ON DELETE CASCADE,
    capacity_ml integer NOT NULL CHECK (capacity_ml > 0)
  );`);

const samples = [
  ['missing key', '{}', null],
  ['JSON null', '{"capacity_ml":null}', null],
  ['numeric string', '{"capacity_ml":"350"}', null],
  ['non-numeric string', '{"capacity_ml":"large"}', null],
  ['fraction below half', '{"capacity_ml":350.1}', null],
  ['fraction at half', '{"capacity_ml":350.5}', null],
  ['fraction near whole', '{"capacity_ml":350.9999999999999999999999999999}', null],
  ['zero', '{"capacity_ml":0}', null],
  ['negative zero', '{"capacity_ml":-0}', null],
  ['negative integer', '{"capacity_ml":-350}', null],
  ['negative fraction', '{"capacity_ml":-350.5}', null],
  ['above integer range', '{"capacity_ml":2147483648}', null],
  ['fraction above maximum', '{"capacity_ml":2147483647.1}', null],
  ['very large valid jsonb number', '{"capacity_ml":1e100}', null],
  ['tiny positive fraction', '{"capacity_ml":1e-100}', null],
  ['boolean', '{"capacity_ml":true}', null],
  ['array value', '{"capacity_ml":[350]}', null],
  ['object value', '{"capacity_ml":{"value":350}}', null],
  ['SQL NULL document', null, null],
  ['top-level JSON null', 'null', null],
  ['top-level JSON array', '[350]', null],
  ['top-level JSON number', '350', null],
  ['minimum', '{"capacity_ml":1}', 1],
  ['ordinary whole number', '{"capacity_ml":350}', 350],
  ['decimal whole number', '{"capacity_ml":350.0}', 350],
  ['exponent whole number', '{"capacity_ml":3.5e2}', 350],
  ['maximum', '{"capacity_ml":2147483647}', 2147483647],
  ['decimal maximum', '{"capacity_ml":2147483647.00}', 2147483647],
];
const observations = [];
for (let i = 0; i < samples.length; i++) {
  const [label, payload, expected] = samples[i];
  const selectSql = `SELECT ${guard} AS capacity_ml FROM (VALUES ($1::jsonb)) AS incoming(payload)`;
  const { rows: selected } = await db.query(selectSql, [payload]);
  assert.equal(selected[0].capacity_ml, expected, label);
  const productId = `probe-${i}`;
  await db.query('INSERT INTO products VALUES ($1)', [productId]);
  const insertSql = `INSERT INTO mug_details (product_id, capacity_ml)
    SELECT $2, ${guard} FROM (VALUES ($1::jsonb)) AS incoming(payload)
    RETURNING capacity_ml`;
  let insertion;
  try {
    const { rows } = await db.query(insertSql, [payload, productId]);
    assert.notEqual(expected, null, `${label}: insert must reject`);
    assert.equal(rows[0].capacity_ml, expected, label);
    insertion = { accepted: true, capacity_ml: rows[0].capacity_ml };
  } catch (error) {
    if (error instanceof assert.AssertionError) throw error;
    assert.equal(expected, null, `${label}: insert must accept`);
    assert.equal(error.code, '23502', `${label}: rejected by NOT NULL`);
    insertion = { accepted: false, sqlstate: error.code, message: error.message };
  }
  observations.push({ label, payload, expected, guardResult: selected[0].capacity_ml, insertion });
}

const rounding = (await db.query(`SELECT 350.1::numeric::integer AS below_half,
  350.5::numeric::integer AS at_half,
  -350.5::numeric::integer AS negative_half`)).rows[0];
assert.deepEqual(rounding, { below_half: 350, at_half: 351, negative_half: -351 });
await db.exec(`INSERT INTO products VALUES ('direct-numeric');
  INSERT INTO mug_details VALUES ('direct-numeric', 350.5::numeric);`);
const directNumeric = (await db.query("SELECT capacity_ml FROM mug_details WHERE product_id = 'direct-numeric'")).rows[0].capacity_ml;
assert.equal(directNumeric, 351);
let directZero;
try {
  await db.exec("INSERT INTO mug_details VALUES ('direct-zero', 0)");
  throw new Error('Zero should fail the positive-value check');
} catch (error) {
  assert.equal(error.code, '23514');
  directZero = { sqlstate: error.code, message: error.message };
}
const version = (await db.query('SELECT version()')).rows[0].version;
const output = {
  checkedAt: '2026-10-05', runtime, packageVersion, version, guard,
  samples: observations,
  contrast: { rounding, directNumericStored: directNumeric, directZero },
  limit: 'One in-memory PGlite connection. Tests establish conversion and constraint outcomes, not concurrent writes or performance.'
};
await writeFile(new URL('./implementation-capacity-results.json', import.meta.url), `${JSON.stringify(output, null, 2)}\n`);
await db.close();
console.log(`Passed ${samples.length} guard cases and their insertion outcomes; numeric conversion contrast confirmed.`);
