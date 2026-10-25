import { PGlite } from '@electric-sql/pglite';
import { writeFile, readFile } from 'node:fs/promises';
import { setup, queries } from '../src/components/relational-rebuild-aggregation/queries.mjs';
import { lines, groups, frameIndices } from '../src/components/relational-rebuild-aggregation/facts.mjs';
import assert from 'node:assert/strict';
const db = new PGlite();
const results = {};
try {
  results.version = (await db.query('SELECT version()')).rows;
  await db.exec(setup);
  for (const [key, sql] of Object.entries(queries)) results[key] = (await db.query(sql)).rows;
  const vals = (key, col) => results[key].map(row => row[col]);
  assert.deepEqual(vals('grouped','units').map(Number), [3,3,1]);
  assert.deepEqual(vals('grouped','lines').map(Number), [2,2,1]);
  assert.equal(results.split.length,5);
  assert.deepEqual(vals('where','units').map(Number),[1,2,1]);
  assert.deepEqual(vals('having','product_id'),['P3','P7']);
  assert.deepEqual(vals('filter','paid_units').map(Number),[1,2,1]);
  assert.deepEqual(Object.values(results.counts[0]).map(Number),[5,5,3,7]);
  assert.deepEqual(vals('customerCounts','orders').map(Number),[2,1,0]);
  assert.deepEqual(vals('customerCounts','joined_rows').map(Number),[2,1,1]);
  assert.equal(Number(results.weights[0].mean_measured_grams),442.5);
  assert.equal(results.scalarEmpty[0].units,null);
  assert.equal(Number(results.scalarEmpty[0].lines),0);
  assert.equal(results.groupedEmpty.length,0);
  assert.equal(results.allNull[0].grams,null);
  assert.equal(results.window.length,5);
  assert.deepEqual(vals('window','percent_of_product').map(Number),[33.3,66.7,66.7,33.3,100]);
  assert.deepEqual(vals('summaryWindow','all_units').map(Number),[7,7,7]);
  assert.deepEqual(vals('ranking','place').map(Number),[1,1,3]);
  assert.deepEqual(vals('ranking','score_place').map(Number),[1,1,2]);
  assert.deepEqual(vals('tiedBroken','place').map(Number),[1,2,3]);
  for (const [key, mode] of [['defaultFrame','default'],['rowsFrame','rows'],['wholeFrame','whole']]) {
    const col = mode === 'whole' ? 'total_value' : 'cumulative_value';
    assert.deepEqual(vals(key,col).map(Number), lines.map((_,i)=>frameIndices(mode,i).reduce((sum,j)=>sum+lines[j].cents,0)/100));
  }
  assert.deepEqual(vals('defaultFrame','cumulative_value').map(Number),[39.5,39.5,79.5,108.5,108.5]);
  assert.deepEqual(vals('rowsFrame','cumulative_value').map(Number),[4.5,39.5,79.5,99.5,108.5]);
  assert.deepEqual(vals('boundedFrames','two_lines').map(Number),[4.5,39.5,75,60,29]);
  assert.deepEqual(vals('boundedFrames','two_peer_groups').map(Number),[39.5,39.5,79.5,69,69]);
  assert.deepEqual(vals('boundedFrames','three_day_range').map(Number),[39.5,39.5,79.5,29,29]);
  assert.deepEqual(vals('lastValue','default_last').map(Number),[4.5,35,40,20,9]);
  assert.deepEqual(vals('lastValue','partition_last').map(Number),[9,9,9,9,9]);
  assert.deepEqual(vals('lagFrame','previous_order').map(x=>x===null?null:Number(x)),[null,101,null]);
  assert.deepEqual(vals('lagNull','previous'),[-1,null]);
  assert.deepEqual(vals('topRows','product_id'),['P3','P7']);
  assert.equal(Number(results.division[0].integer_share),0);
  assert.equal(Number(results.weightedMean[0].mean_line_price),16.8);
  assert.equal(Number(results.weightedMean[0].mean_unit_price),15.5);
  assert.deepEqual(groups(false).map(g=>g.units),[3,3,1]);
  // Counterexamples for changing the ranked population and filtering before the window.
  results.topTies = (await db.query(queries.topRows.replace('position <= 2','score_place <= 2'))).rows;
  assert.equal(results.topTies.length,3);
  results.firstPlace = (await db.query(queries.topRows.replace('position <= 2','place <= 1'))).rows;
  assert.equal(results.firstPlace.length,2);
  for (const [key,sql] of Object.entries({
    badGroupedColumn: 'SELECT product_id, order_id, SUM(quantity) FROM line_facts GROUP BY product_id',
    badWindowWhere: 'SELECT ROW_NUMBER() OVER (ORDER BY product_id) AS n FROM line_facts WHERE ROW_NUMBER() OVER (ORDER BY product_id) < 3'
  })) {
    await db.exec('SAVEPOINT expected_error');
    try { await db.query(sql); throw new Error('Expected SQL rejection'); }
    catch(e) { assert.ok(e.code); results[key] = {code:e.code,message:e.message}; }
    await db.exec('ROLLBACK TO SAVEPOINT expected_error');
  }
  await db.exec('ROLLBACK');
  results.status = 'All assertions passed';
  await writeFile(new URL('sql-results.json',import.meta.url),JSON.stringify(results,null,2)+'\n');
  console.log(results.version, results.status);
} finally { await db.close(); }
const download = setup + '\n' + Object.entries(queries).map(([key,sql])=>`-- ${key}\n${sql}`).join('\n\n') + '\n\nROLLBACK;\n';
await writeFile(new URL('../public/relational-rebuild/aggregation/shop-aggregates.sql', import.meta.url), download);

const downloadDb = new PGlite();
try {
  const script = await readFile(new URL('../public/relational-rebuild/aggregation/shop-aggregates.sql', import.meta.url), 'utf8');
  const executions = await downloadDb.exec(script);
  assert.equal((await downloadDb.query("SELECT to_regclass('pg_temp.line_facts') AS relation")).rows[0].relation,null);
  await writeFile(new URL('download-results.json',import.meta.url), JSON.stringify({status:'Exact delivered SQL file executed successfully and rolled back', statements:executions.length},null,2)+'\n');
} finally { await downloadDb.close(); }
