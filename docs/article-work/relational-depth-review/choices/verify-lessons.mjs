import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import pg from '/private/tmp/staycurrent-pg-lab/node_modules/pg/lib/index.js';
import { relationalDepthChoicesTutorials } from '../../../../src/lib/sql-lessons/relational-depth-choices.ts';

const native = new pg.Client({
  host: process.env.PGHOST || '/private/tmp/staycurrent-relational-depth/socket',
  port: Number(process.env.PGPORT || 55439), user: process.env.PGUSER || 'ryannel',
  database: 'sc_depth_choices',
});
await native.connect();
const embedded = await PGlite.create();
const observations = {};
try {
  for (const [name, db] of [['PostgreSQL', native], ['PGlite', embedded]]) {
    const exec = async sql => name === 'PGlite' ? db.exec(sql) : [].concat(await db.query(sql));
    observations[name] = { version: (await exec('SELECT version()'))[0].rows[0].version, lessons: [] };
    for (const lesson of relationalDepthChoicesTutorials) {
      const evidence = { id: lesson.id, steps: [] };
      for (const [index, step] of lesson.steps.entries()) {
        try {
          const results = await exec(step.sql);
          assert(!step.expectedError, 'Expected SQLSTATE was not raised');
          evidence.steps.push({ step: index + 1, rows: results.map(r => r.rows) });
          if (lesson.id === 'policy-composition') {
            const visible = results.findLast(r => r.rows?.[0]?.order_id !== undefined)?.rows.map(r => r.order_id) || [];
            const expected = { 0: [1, 3], 1: [1, 2, 3], 2: [1], 4: [], 5: [1] }[index];
            assert.deepEqual(visible, expected);
          } else {
            if (index === 1) {
              assert.deepEqual(results.at(-2).rows, [{ version: 1, active: true }]);
              assert.equal(Number(results.at(-1).rows[0].pending), 0);
            }
            if (index === 2) {
              const row = results.at(-1).rows[0];
              assert.equal(row.version, 2); assert.equal(row.active, false); assert.equal(row.delivered_at, null);
            }
            if (index === 3) assert.deepEqual(results.at(-1).rows, [{ product_id: 1, title: 'Blue mug' }]);
            if (index === 4) assert.equal(Number(results.at(-1).rows[0].pending), 1);
            if (index === 5) {
              assert.deepEqual(results[0].rows, []);
              assert.equal(results.at(-1).rows[0].applied_version, 2);
              assert.equal(Number(results.at(-1).rows[0].pending), 0);
            }
            if (index === 6) {
              assert.equal(results.at(-2).rows[0].active, false);
              assert.equal(results.at(-2).rows[0].version, 2);
              assert.deepEqual(results.at(-1).rows, []);
            }
          }
        } catch (error) {
          if (!step.expectedError || error.code !== step.expectedError) throw error;
          evidence.steps.push({ step: index + 1, sqlstate: error.code });
        }
      }
      observations[name].lessons.push(evidence);
    }
    await exec(`RESET ROLE;
ALTER POLICY ready_orders ON depth_access.orders USING (status = 'packed');
SET ROLE depth_shipping;`);
    const variant = await exec('SELECT order_id, status FROM depth_access.orders ORDER BY order_id');
    assert.deepEqual(variant[0].rows, [{ order_id: 3, status: 'packed' }]);
    observations[name].packedVariation = variant[0].rows;
    await exec('RESET ROLE');
  }
  await writeFile(new URL('./lessons-observed.json', import.meta.url), JSON.stringify(observations, null, 2) + '\n');
  console.log('Both lessons and the packed-policy variation passed on PostgreSQL and PGlite.');
} finally {
  await native.end();
  await embedded.close();
}
