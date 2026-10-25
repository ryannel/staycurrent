import { PGlite } from '../node_modules/@electric-sql/pglite/dist/index.js';
import { packages, filters } from '../src/components/relational-rebuild-values/model.mjs';
import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const db = new PGlite();
const report = { runtime: '@electric-sql/pglite 0.5.8; owned in-memory disposable database', observations: [], errorsExpected: [], displayedSnippets: [] };
const observe = async (name, sql) => {
  const result = await db.query(sql);
  report.observations.push({ name, sql, rows: result.rows });
  return result.rows;
};
const fails = async (name, sql, code) => {
  try { await db.query(sql); assert.fail(`${name}: unexpectedly accepted`); }
  catch(error) { assert.equal(error.code, code); report.errorsExpected.push({name,sql,code:error.code,message:error.message}); }
};
try {
  await observe('Version', 'SELECT version(), current_setting(\'server_version\') AS server_version, current_setting(\'TimeZone\') AS initial_zone');
  await observe('Database locale', 'SELECT datcollate, datctype FROM pg_database WHERE datname=current_database()');
  await db.exec(`SET TIME ZONE 'UTC'; SET datestyle = 'ISO, YMD';
    CREATE TABLE products(product_id text PRIMARY KEY, name text NOT NULL, price numeric(8,2) NOT NULL CHECK(price >= 0), package_weight_g integer);
    INSERT INTO products VALUES ('P3','Green tea, 50 g',4.50,65),('P7','Blue mug',20.00,NULL),('P9','Teapot',35.00,820);
    CREATE TABLE orders(order_id integer PRIMARY KEY, placed_at timestamptz NOT NULL);
    INSERT INTO orders VALUES(103, timestamptz '2026-10-20 10:15+00');`);
  assert.deepEqual(await observe('Input measurements', 'SELECT product_id, package_weight_g FROM products ORDER BY product_id'), packages.map(p=>({product_id:p.id,package_weight_g:p.weight})));
  for (const filter of filters) {
    const actual = await observe(`Filter ${filter.key}`, `SELECT product_id, (${filter.sql}) AS result FROM products ORDER BY product_id`);
    assert.deepEqual(actual.map(r=>r.result),filter.values);
    const kept = await observe(`WHERE ${filter.key}`, `SELECT product_id FROM products WHERE ${filter.sql} ORDER BY product_id`);
    assert.deepEqual(kept.map(r=>r.product_id), packages.filter((p,i)=>filter.values[i]===true).map(p=>p.id));
  }
  assert.deepEqual(await observe('Decimal versus float',`SELECT 0.1::numeric + 0.2::numeric = 0.3::numeric AS exact,
    0.1::double precision + 0.2::double precision = 0.3::double precision AS approximate`),[{exact:true,approximate:false}]);
  await observe('Arithmetic', `SELECT (20/3)::numeric AS after, 20::numeric/3 AS before, 20/3.0 AS implicit,
    20.005::numeric(8,2) AS rounded, round(20.00/3,2)*3 AS rounded_shares, 6.67+6.67+6.66 AS allocated,
    2000/3 AS minor_share, 2000%3 AS remainder`);
  await fails('Scale overflow after rounding', 'SELECT 999999.995::numeric(8,2)', '22003');
  await fails('Negative price refused', "INSERT INTO products VALUES ('negative', 'Invalid', -0.01, 1)", '23514');
  await observe('Finite numeric endpoints', 'SELECT 999999.99::numeric(8,2) AS maximum, (-999999.99)::numeric(8,2) AS minimum');
  assert.deepEqual(await observe('Same instant', "SELECT timestamptz '2026-10-20 10:15+00' = timestamptz '2026-10-20 12:15+02' AS same"),[{same:true}]);
  await observe('UTC display', 'SELECT placed_at::text FROM orders');
  await db.exec("SET TIME ZONE 'Europe/Stockholm'");
  assert.deepEqual(await observe('Stockholm display', 'SELECT placed_at::text FROM orders'),[{placed_at:'2026-10-20 12:15:00+02'}]);
  assert.deepEqual(await observe('Calendar versus elapsed', `SELECT (timestamptz '2026-10-25 00:00+02' + interval '1 day')::text AS calendar,
    (timestamptz '2026-10-25 00:00+02' + interval '24 hours')::text AS elapsed,
    extract(epoch from ((timestamptz '2026-10-25 00:00+02' + interval '1 day') - timestamptz '2026-10-25 00:00+02'))/3600 AS hours`),
    [{calendar:'2026-10-26 00:00:00+01',elapsed:'2026-10-25 23:00:00+01',hours:'25.0000000000000000'}]);
  await observe('Ambiguous clock has two instants', `SELECT timestamptz '2026-10-25 02:30+02'::text AS first,
    timestamptz '2026-10-25 02:30+01'::text AS second`);
  await observe('Ignore offset for timestamp', "SELECT timestamp '2026-10-20 12:15+02'::text AS local_fields");
  await observe('Explicit business date', "SELECT (placed_at AT TIME ZONE 'Europe/Stockholm')::date::text FROM orders");
  await db.exec("SET TIME ZONE 'UTC'");
  const utcCast = await observe('Implicit UTC date boundary', "SELECT timestamptz '2026-10-20 23:15+00'::date::text AS day");
  await db.exec("SET TIME ZONE 'Europe/Stockholm'");
  const stockholmCast = await observe('Implicit Stockholm date boundary', "SELECT timestamptz '2026-10-20 23:15+00'::date::text AS day");
  assert.notDeepEqual(utcCast,stockholmCast);
  await observe('Deterministic text examples', `SELECT 'P7'::text COLLATE "C" = 'p7' AS case_equal,
    'P7'::text COLLATE "C" = 'P7 ' AS space_equal,
    'P7'::char(3) = 'P7 '::char(3) AS char_space_equal,
    'P10'::text COLLATE "C" < 'P7' AS code_order,
    '007'::integer AS converted_code,
    'é'::text COLLATE "C" = 'é' AS normal_forms_equal`);
  await observe('JSON syntax does not enforce pack meaning', `SELECT '{"amount":50,"unit":"g"}'::jsonb AS pack,
    '{"amount":"large","unit":"perhaps"}'::jsonb AS invalid_business_value`);
  await observe('IN truth cases', 'SELECT 65 IN (820,NULL) AS in_unknown, 65 NOT IN (820,NULL) AS not_in_unknown, 65 IN (65,NULL) AS in_true');
  await observe('Missing comparison', 'SELECT NULL::integer = NULL::integer AS eq, NULL::integer IS NOT DISTINCT FROM NULL::integer AS same, NULL::integer IS NOT DISTINCT FROM 65 AS different');
  await observe('Full truth table', 'SELECT a,b,a AND b AS conjunction,a OR b AS disjunction,NOT a AS negated FROM (VALUES(true),(false),(NULL::boolean)) x(a) CROSS JOIN (VALUES(true),(false),(NULL::boolean)) y(b)');
  await observe('Fallback versus missing', "SELECT product_id, COALESCE(package_weight_g::text,'Not yet measured') AS label, COALESCE(package_weight_g,0) AS substituted FROM products ORDER BY product_id");
  await db.exec(`CREATE TABLE loyalty_default(customer_id integer PRIMARY KEY, loyalty_code text UNIQUE);
    INSERT INTO loyalty_default VALUES(1,'TEA-7'),(2,NULL),(3,NULL);
    CREATE TABLE loyalty_strict(customer_id integer PRIMARY KEY, loyalty_code text, UNIQUE NULLS NOT DISTINCT(loyalty_code));
    INSERT INTO loyalty_strict VALUES(1,'TEA-7'),(2,NULL);
    CREATE TABLE weight_check(weight integer CHECK(weight>0)); INSERT INTO weight_check VALUES(NULL),(65);
    CREATE TABLE weight_required(weight integer NOT NULL CHECK(weight>0)); INSERT INTO weight_required VALUES(65);`);
  await observe('Optional default UNIQUE accepts two absent codes', 'SELECT * FROM loyalty_default ORDER BY customer_id');
  await fails('Known duplicate refused', "INSERT INTO loyalty_default VALUES(4,'TEA-7')", '23505');
  await fails('NULLS NOT DISTINCT refuses second NULL', 'INSERT INTO loyalty_strict VALUES(3,NULL)', '23505');
  await observe('DISTINCT gives one NULL', 'SELECT DISTINCT loyalty_code FROM loyalty_default ORDER BY loyalty_code NULLS LAST');
  await fails('CHECK refuses zero', 'INSERT INTO weight_check VALUES(0)', '23514');
  await fails('NOT NULL refuses absent weight', 'INSERT INTO weight_required VALUES(NULL)', '23502');
  await observe('NULL allowed by CHECK', 'SELECT * FROM weight_check ORDER BY weight NULLS LAST');
  assert.deepEqual((await observe('Explicit sort', 'SELECT product_id FROM products ORDER BY package_weight_g ASC NULLS LAST, product_id')).map(r=>r.product_id), ['P3','P9','P7']);
  await db.exec('CREATE TABLE identity_only(id integer GENERATED BY DEFAULT AS IDENTITY); INSERT INTO identity_only VALUES(1),(1)');
  await observe('Identity alone permits manually repeated ID', 'SELECT * FROM identity_only');
  // Run every displayed SQL block, unchanged, against the owned fixture.
  const source = await readFile(new URL('../src/articles/current/article.astro', import.meta.url),'utf8');
  for (const match of source.matchAll(/<Sql label="([^"]+)" code=\{`([\s\S]*?)`\} \/>/g)) {
    const results = await db.exec(match[2]);
    report.displayedSnippets.push({ label:match[1], sql:match[2], rows:results.map(r=>r.rows) });
  }
  assert.equal(report.displayedSnippets.length,7);
  report.result = 'PASS';
} finally {
  await db.close();
  report.closed = true;
  await writeFile(new URL('./sql-results.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
}
console.log(JSON.stringify({result:report.result,observations:report.observations.length,expectedErrors:report.errorsExpected.length,snippets:report.displayedSnippets.length,closed:report.closed}));
