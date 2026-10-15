import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import pg from '/private/tmp/staycurrent-pg-lab/node_modules/pg/lib/index.js';
import { relationalDepthPerformanceTutorials } from '../../../../src/lib/sql-lessons/relational-depth-performance.ts';

const config = { host: process.env.PGHOST || '/private/tmp/staycurrent-relational-depth/socket', port: Number(process.env.PGPORT || 55439), user: process.env.PGUSER || 'ryannel' };
const admin = new pg.Client({ ...config, database: 'postgres' });
await admin.connect();
try {
  if (!(await admin.query("SELECT 1 FROM pg_database WHERE datname = 'sc_depth_performance'")).rowCount) await admin.query('CREATE DATABASE sc_depth_performance');
} finally { await admin.end(); }
const native = new pg.Client({ ...config, database: 'sc_depth_performance' });
await native.connect();
const embedded = await PGlite.create();
const observations = {};
try {
  for (const [name, db] of [['PostgreSQL', native], ['PGlite', embedded]]) {
    const exec = async sql => name === 'PGlite' ? db.exec(sql) : [].concat(await db.query(sql));
    await exec("SET statement_timeout = '15s'");
    observations[name] = { version: (await exec('SELECT version()'))[0].rows[0].version, lessons: [] };
    for (const lesson of relationalDepthPerformanceTutorials) {
      const evidence = { id: lesson.id, steps: [] };
      let baseline, paidBaseline;
      for (const [index, step] of lesson.steps.entries()) {
        const results = await exec(step.sql);
        const rows = results.filter(r => r.rows?.length).map(r => r.rows);
        const plan = rows.find(r => r[0]['QUERY PLAN'])?.map(r => r['QUERY PLAN']).join('\n') || '';
        const answer = rows.at(-1);
        if (lesson.id === 'index-order') {
          const all = [59041,58041,57041,56041,55041,54041,53041,52041,51041,50041];
          const paid = [59041,58041,57041,56041,54041,53041,52041,51041,49041,48041];
          assert.deepEqual(answer.map(r => r.order_id), index < 3 ? all : index < 5 ? paid : [55041,50041,45041]);
          if (index === 0) {
            baseline = answer;
            assert.equal(Number(rows[0][0].customer_orders), 60);
            assert.equal(Number(rows[0][0].february_orders), 15);
          }
          if (index === 1 || index === 2) assert.deepEqual(answer, baseline);
          if (index === 3) paidBaseline = answer;
          if (index === 4) assert.deepEqual(answer, paidBaseline);
          if (index === 1) { assert.match(plan, /Sort/); assert.match(plan, /Rows Removed by Filter: 45/); }
          if (index >= 2 && index <= 4) { assert.match(plan, /Index Scan/); assert.doesNotMatch(plan, /Sort/); }
          if (index === 3) assert.match(plan, /Rows Removed by Filter: 2/);
          if (index === 4) assert.doesNotMatch(plan, /Rows Removed by Filter/);
        } else if (index === 0) {
          assert.equal(Number(rows[0][0].orders), 10000);
          assert.equal(Number(rows[0][0].lines), 30000);
          assert.deepEqual(answer.map(r => r.order_id), Array.from({length:10}, (_, i) => 42 + i*1000));
        } else {
          const multiplier = index === 1 ? 10 : index === 4 ? 1000 : 10000;
          assert.deepEqual(answer.map(r => [r.product_id, Number(r.units)]), [[3,3*multiplier],[2,2*multiplier],[1,multiplier]]);
          if (index === 1) { assert.match(plan, /Nested Loop/); assert.match(plan, /actual rows=3(?:\.00)? loops=10/); }
          if (index === 2) { assert.match(plan, /Hash Join/); assert.match(plan, /actual rows=30000(?:\.00)? loops=1/); }
          if (index === 3) assert.match(plan, /Merge Join/);
          if (index === 4) { assert.equal(rows[0][0].enable_hashjoin, 'on'); assert.equal(rows[1][0].enable_nestloop, 'on'); }
        }
        evidence.steps.push({ step: index + 1, rows });
        console.log(name, lesson.id, index + 1, 'passed');
      }
      if (lesson.id === 'index-order') {
        const variation = await exec(`EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT order_id FROM depth_index_orders
WHERE customer_id = 42 AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
ORDER BY placed_at DESC, order_id DESC LIMIT 10;
SELECT order_id FROM depth_index_orders
WHERE customer_id = 42 AND placed_at >= timestamptz '2026-02-01 00:00:00+00'
ORDER BY placed_at DESC, order_id DESC LIMIT 10;`);
        assert.match(variation[0].rows.map(r => r['QUERY PLAN']).join('\n'), /Sort/);
        assert.deepEqual(variation[1].rows.map(r => r.order_id), baseline.map(r => r.order_id));
        evidence.withoutStatusVariation = variation.map(r => r.rows);
      }
      observations[name].lessons.push(evidence);
    }
  }
  await writeFile(new URL('./observed.json', import.meta.url), JSON.stringify(observations, null, 2) + '\n');
} finally {
  await native.query('ROLLBACK').catch(() => {});
  await native.end();
  await embedded.close();
}
