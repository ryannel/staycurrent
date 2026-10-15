// From repository root: node docs/article-work/query-execution/verify.mjs
// Executes the article's SQL constants in an isolated PGlite database.
import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';
const directory = 'docs/article-work/query-execution/';
const source = readFileSync('src/pages/learn/databases/relational/query-execution.astro', 'utf8');
const snippets = Object.fromEntries([...source.matchAll(/const (\w+) = `([\s\S]*?)`;/g)].map(m => [m[1], m[2]]));
const db = new PGlite();
await db.exec(readFileSync(directory + 'setup.sql', 'utf8'));
const version = (await db.query('SELECT version() AS version')).rows[0].version;
assert.match(version, /PostgreSQL 18\.3/);
const findings = [];
const walk = node => [node, ...(node.Plans || []).flatMap(walk)];
async function observe(label, sql) {
  const rows = (await db.query(sql)).rows;
  const json = (await db.query('EXPLAIN (ANALYZE, TIMING OFF, SUMMARY OFF, FORMAT JSON) ' + sql)).rows[0]['QUERY PLAN'][0];
  const text = (await db.query('EXPLAIN (ANALYZE, TIMING OFF, SUMMARY OFF) ' + sql)).rows.map(row => row['QUERY PLAN']);
  findings.push({label, sql, rows, plan: json.Plan, text});
  return {rows, plan:json.Plan, nodes:walk(json.Plan)};
}
const expected = multiplier => [3,2,1].map(product_id => ({product_id, units:product_id * multiplier}));
const narrow = await observe('Natural one-customer plan', snippets.report);
assert.deepEqual(narrow.rows, expected(10));
assert.equal(narrow.nodes.filter(n => n['Node Type'] === 'Sort').length, 2);
assert(narrow.nodes.some(n => n['Node Type'] === 'Aggregate' && n.Strategy === 'Sorted'));
assert(narrow.nodes.some(n => n['Node Type'] === 'Bitmap Heap Scan' && n['Actual Rows'] === 10));
assert(narrow.nodes.some(n => n['Node Type'] === 'Nested Loop' && n['Actual Rows'] === 30));
assert(narrow.nodes.some(n => n['Node Type'] === 'Index Scan' && n['Actual Rows'] === 3 && n['Actual Loops'] === 10));
const broadSQL = snippets.report.replace('= 42', '<= 1000');
const broad = await observe('Natural all-customer plan', broadSQL);
assert.deepEqual(broad.rows, expected(10000));
assert(broad.nodes.some(n => n['Node Type'] === 'Hash Join' && n['Actual Rows'] === 30000));
assert(broad.nodes.some(n => n['Node Type'] === 'Aggregate' && n.Strategy === 'Hashed' && n['Actual Rows'] === 3));
assert.equal(broad.nodes.filter(n => n['Node Type'] === 'Seq Scan').length, 2);
await db.exec('BEGIN; SET LOCAL enable_hashjoin = off; SET LOCAL enable_nestloop = off;');
const merged = await observe('Forced diagnostic merge alternative', broadSQL);
assert.deepEqual(merged.rows, broad.rows);
assert(merged.nodes.some(n => n['Node Type'] === 'Merge Join' && n['Actual Rows'] === 30000));
await db.exec('ROLLBACK;');
// Also execute the displayed transaction block, rather than only the equivalent observation above.
await db.exec(snippets.mergeDiagnostic);
const before = await observe('Correlated filters before dependency statistics', snippets.correlated);
assert.equal(before.plan['Plan Rows'], 1); assert.equal(before.plan['Actual Rows'], 10);
await db.exec(snippets.statistics);
const after = await observe('Correlated filters after dependency statistics', snippets.correlated);
assert.equal(after.plan['Plan Rows'], 10); assert.equal(after.plan['Actual Rows'], 10);
assert.deepEqual(before.rows, after.rows);
await db.exec("BEGIN; SET LOCAL work_mem = '64kB';");
const spillSQL = 'SELECT order_id, product_id FROM order_lines ORDER BY product_id, order_id;';
const spillPlan = (await db.query('EXPLAIN (ANALYZE, TIMING OFF, SUMMARY OFF, FORMAT JSON) ' + spillSQL)).rows[0]['QUERY PLAN'][0].Plan;
assert.equal(spillPlan['Sort Method'], 'external merge');
assert.equal(spillPlan['Sort Space Type'], 'Disk');
assert.equal(spillPlan['Actual Rows'],30000);
assert(spillPlan['Temp Written Blocks'] > 0);
findings.push({label:'Deliberately small memory allowance',sql:spillSQL,plan:spillPlan});
await db.exec('ROLLBACK;');
await db.exec(snippets.spill);
await db.close();
writeFileSync(directory + 'observed.json', JSON.stringify({checked:'2026-10-15',version,limits:'Single-process PGlite observation. No physical disk speed or server latency measurement. Plans are implementation observations, not a requirement for other installations.', findings}, null, 2)+'\n');
const prefix = 'EXPLAIN (ANALYZE, TIMING OFF, BUFFERS OFF, SUMMARY OFF)\n';
writeFileSync(directory + 'experiments.sql', `-- PostgreSQL 18. Run execution-setup.sql once in a new empty practice database first.
-- Keep one SQL-editor or psql connection for these examples.
-- All measured statements below are SELECTs. EXPLAIN ANALYZE executes its statement.
-- Repeat from a fresh setup to reproduce the before/after statistics comparison.

-- One customer: result and natural plan.
${snippets.report}
${prefix}${snippets.report}

-- All customers: change only the filter.
${broadSQL}
${prefix}${broadSQL}

-- Forced diagnostic alternative. ROLLBACK restores the local settings.
${snippets.mergeDiagnostic}

-- A correlated-predicate estimate before and after dependency statistics.
${prefix}${snippets.correlated}
${snippets.statistics}
${prefix}${snippets.correlated}

-- Observe a sort spill with deliberately restricted memory.
${snippets.spill}
`);
console.log(`Verified ${findings.length} observed scenarios with ${version}. Refreshed experiment download and observation record.`);
