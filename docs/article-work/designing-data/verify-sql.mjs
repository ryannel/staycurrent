// This harness runs real SQL in the installed PGlite WASM PostgreSQL build.
// Install without changing project dependencies:
// npm install --prefix /private/tmp/staycurrent-design-sql @electric-sql/pglite@0.5.8 --ignore-scripts --no-audit --no-fund
// node docs/article-work/designing-data/verify-sql.mjs /private/tmp/staycurrent-design-sql/node_modules/@electric-sql/pglite/dist/index.js
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
const runtime = process.argv[2];
if (!runtime) throw new Error('Pass the absolute path to the PGlite dist/index.js runtime.');
const { PGlite } = await import(pathToFileURL(runtime).href);
const db = new PGlite();
const transcript = [];
async function succeeds(label, sql, expectedRows) {
  const result = await db.query(sql);
  if (expectedRows !== undefined) assert.deepEqual(result.rows, expectedRows, label);
  transcript.push({ label, sql, outcome: 'accepted', rows: result.rows, affectedRows: result.affectedRows });
}
async function fails(label, sql, code) {
  let caught;
  try { await db.query(sql); } catch (error) { caught = error; }
  assert.ok(caught, `${label}: expected rejection`);
  assert.equal(caught.code, code, label);
  transcript.push({ label, sql, outcome: 'rejected', sqlstate: caught.code, message: caught.message });
}
try {
  await succeeds('Runtime version', 'SELECT version()');
  await db.exec(await readFile(new URL('./schema.sql', import.meta.url), 'utf8'));
  await succeeds('Historical price differs from current price', `SELECT p.current_price::text, l.unit_price::text, (l.quantity * l.unit_price)::text AS line_total FROM order_lines l JOIN products p USING (product_id) WHERE l.order_id = 'O12' AND l.line_no = 1`, [{ current_price: '20.00', unit_price: '18.00', line_total: '36.00' }]);
  await succeeds('Exact modelling article receipt query', `SELECT l.line_no, p.name, l.quantity,
       l.unit_price, l.quantity * l.unit_price AS line_total
FROM order_lines AS l
JOIN products AS p ON p.product_id = l.product_id
WHERE l.order_id = 'O12'
ORDER BY l.line_no;`, [{ line_no: 1, name: 'Blue mug', quantity: 2, unit_price: '18.00', line_total: '36.00' }]);
  await fails('Duplicate line identity', `INSERT INTO order_lines VALUES ('O12', 1, 'P8', 1, 25)`, '23505');
  await succeeds('Same product on a different line', `INSERT INTO order_lines VALUES ('O12', 2, 'P7', 1, 18)`);
  await succeeds('Same line number in a different order', `SELECT order_id, line_no FROM order_lines WHERE line_no = 1 ORDER BY order_id`, [{ order_id: 'O12', line_no: 1 }, { order_id: 'O13', line_no: 1 }]);
  await fails('Missing product', `INSERT INTO order_lines VALUES ('O12', 3, 'P404', 1, 18)`, '23503');
  await fails('Zero quantity', `INSERT INTO order_lines VALUES ('O12', 3, 'P7', 0, 18)`, '23514');
  await fails('SQL null quantity', `INSERT INTO order_lines VALUES ('O12', 3, 'P7', NULL, 18)`, '23502');
  await fails('SQL null product', `INSERT INTO order_lines VALUES ('O12', 3, NULL, 1, 18)`, '23502');
  await fails('Null component of primary key', `INSERT INTO order_lines VALUES ('O12', NULL, 'P7', 1, 18)`, '23502');
  await fails('Negative unit price', `INSERT INTO order_lines VALUES ('O12', 3, 'P7', 1, -1)`, '23514');
  await fails('NaN unit price', `INSERT INTO order_lines VALUES ('O12', 3, 'P7', 1, 'NaN')`, '23514');
  await fails('NaN catalogue price', `UPDATE products SET current_price = 'NaN' WHERE product_id = 'P7'`, '23514');
  await succeeds('Zero current price permitted', `INSERT INTO products VALUES ('P9', 'Free sample', 0, NULL)`);
  await fails('Duplicate assigned SKU', `INSERT INTO products VALUES ('P10', 'Other mug', 20, 'MUG-BLUE')`, '23505');
  await succeeds('Several unassigned SKUs', `SELECT count(*)::integer AS count FROM products WHERE sku IS NULL`, [{ count: 2 }]);
  await db.exec('CREATE TABLE qty_probe (quantity integer CHECK (quantity > 0));');
  await succeeds('CHECK alone accepts SQL null', 'INSERT INTO qty_probe VALUES (NULL)');
  await fails('CHECK alone rejects zero', 'INSERT INTO qty_probe VALUES (0)', '23514');
  await fails('CHECK alone rejects minus one', 'INSERT INTO qty_probe VALUES (-1)', '23514');
  await succeeds('SQL null comparison gives unknown', 'SELECT NULL::integer > 0 AS check_result', [{ check_result: null }]);
  await succeeds('Empty order is permitted', `INSERT INTO orders VALUES ('O14', 'C4', '2026-10-01 12:00:00+00')`);
  await succeeds('Empty order remains without lines', `SELECT count(*)::integer AS count FROM order_lines WHERE order_id = 'O14'`, [{ count: 0 }]);
  await fails('Restrict deleting purchased product', `DELETE FROM products WHERE product_id = 'P7'`, '23001');
  await fails('Restrict deleting referenced customer', `DELETE FROM customers WHERE customer_id = 'C4'`, '23001');
  await succeeds('Deleting O13 cascades to its lines', `DELETE FROM orders WHERE order_id = 'O13'`);
  await succeeds('O13 lines removed', `SELECT count(*)::integer AS count FROM order_lines WHERE order_id = 'O13'`, [{ count: 0 }]);
  await db.exec(`CREATE TABLE nullable_link (product_id text REFERENCES products); CREATE TABLE required_link (product_id text NOT NULL REFERENCES products ON DELETE SET NULL);`);
  await succeeds('Nullable foreign key accepts SQL null', 'INSERT INTO nullable_link VALUES (NULL)');
  await succeeds('SET NULL probe setup', `INSERT INTO required_link VALUES ('P9')`);
  await fails('SET NULL still obeys NOT NULL', `DELETE FROM products WHERE product_id = 'P9'`, '23502');
  await db.exec(`ALTER TABLE products ADD COLUMN attributes jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(attributes) = 'object');`);
  await succeeds('Mug JSON attributes', `UPDATE products SET attributes = '{"capacity_ml":350,"material":"ceramic"}' WHERE product_id = 'P7'`);
  await succeeds('Bowl JSON attributes', `UPDATE products SET attributes = '{"diameter_cm":18,"material":"ceramic"}' WHERE product_id = 'P8'`);
  await succeeds('Numeric capacity filter', `SELECT product_id FROM products WHERE (attributes ->> 'capacity_ml')::integer >= 300 ORDER BY product_id`, [{ product_id: 'P7' }]);
  await succeeds('Containment material filter', `SELECT product_id FROM products WHERE attributes @> '{"material":"ceramic"}' ORDER BY product_id`, [{ product_id: 'P7' }, { product_id: 'P8' }]);
  await succeeds('Missing/null/string/number distinctions', `SELECT label, attributes ? 'capacity_ml' AS present, (attributes -> 'capacity_ml') IS NULL AS extracted_sql_null, jsonb_typeof(attributes -> 'capacity_ml') AS json_type, attributes ->> 'capacity_ml' AS text_value FROM (VALUES ('missing','{}'::jsonb),('json_null','{"capacity_ml":null}'::jsonb),('string','{"capacity_ml":"350"}'::jsonb),('number','{"capacity_ml":350}'::jsonb),('whole_sql_null',NULL::jsonb)) AS probe(label,attributes) ORDER BY label`, [
    { label: 'json_null', present: true, extracted_sql_null: false, json_type: 'null', text_value: null },
    { label: 'missing', present: false, extracted_sql_null: true, json_type: null, text_value: null },
    { label: 'number', present: true, extracted_sql_null: false, json_type: 'number', text_value: '350' },
    { label: 'string', present: true, extracted_sql_null: false, json_type: 'string', text_value: '350' },
    { label: 'whole_sql_null', present: null, extracted_sql_null: true, json_type: null, text_value: null },
  ]);
  await succeeds('Numeric and string containment differ', `SELECT '{"capacity_ml":350}'::jsonb @> '{"capacity_ml":"350"}'::jsonb AS matches`, [{ matches: false }]);
  await succeeds('Numeric cast alone accepts a JSON string', `SELECT ('{"capacity_ml":"350"}'::jsonb ->> 'capacity_ml')::integer AS capacity_ml`, [{ capacity_ml: 350 }]);
  await fails('Numeric cast rejects unit-bearing text', `SELECT ('{"capacity_ml":"350 ml"}'::jsonb ->> 'capacity_ml')::integer`, '22P02');
  await fails('Object CHECK rejects a JSON array', `UPDATE products SET attributes = '[]' WHERE product_id = 'P7'`, '23514');
  await fails('Object CHECK rejects JSON null', `UPDATE products SET attributes = 'null' WHERE product_id = 'P7'`, '23514');
  await fails('NOT NULL rejects SQL null attributes', `UPDATE products SET attributes = NULL WHERE product_id = 'P7'`, '23502');
  await succeeds('Object check alone allows wrong nested type', `UPDATE products SET attributes = '{"capacity_ml":"350","material":"ceramic"}' WHERE product_id = 'P7'`);
  await succeeds('Restore intended capacity type', `UPDATE products SET attributes = jsonb_set(attributes, '{capacity_ml}', '350'::jsonb) WHERE product_id = 'P7'`);
  await db.exec(`ALTER TABLE products ADD CONSTRAINT capacity_type CHECK (NOT (attributes ? 'capacity_ml') OR jsonb_typeof(attributes -> 'capacity_ml') = 'number');`);
  await fails('Explicit type rule rejects JSON string', `UPDATE products SET attributes = jsonb_set(attributes, '{capacity_ml}', '"350"'::jsonb) WHERE product_id = 'P7'`, '23514');
  await fails('Explicit type rule rejects JSON null', `UPDATE products SET attributes = jsonb_set(attributes, '{capacity_ml}', 'null'::jsonb) WHERE product_id = 'P7'`, '23514');
  await succeeds('jsonb_set updates one attribute', `UPDATE products SET attributes = jsonb_set(attributes, '{capacity_ml}', '400'::jsonb) WHERE product_id = 'P7'`);
  await succeeds('Sibling attribute preserved', `SELECT (attributes ->> 'capacity_ml')::integer AS capacity_ml, attributes ->> 'material' AS material FROM products WHERE product_id = 'P7'`, [{ capacity_ml: 400, material: 'ceramic' }]);
  await db.exec(`CREATE INDEX products_attributes_gin ON products USING gin (attributes); CREATE INDEX products_capacity ON products (((attributes ->> 'capacity_ml')::integer));`);
  await succeeds('Indexes exist with intended definitions', `SELECT indexname, indexdef FROM pg_indexes WHERE indexname IN ('products_attributes_gin','products_capacity') ORDER BY indexname`);
  transcript.push({ label: 'Limit', outcome: 'not executed', detail: 'PGlite has a single exclusive connection. No multi-session uniqueness waiting, locking, or throughput experiment was run. Index creation is verified, not index selection or performance.' });
  await writeFile(new URL('./sql-results.json', import.meta.url), JSON.stringify({ checked: '2026-10-04', transcript }, null, 2) + '\n');
  console.log(`${transcript.length - 1} SQL cases passed; transcript saved to sql-results.json.`);
} finally {
  await db.close();
}
