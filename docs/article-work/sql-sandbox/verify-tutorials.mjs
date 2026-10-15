import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite } from '/private/tmp/staycurrent-design-sql/node_modules/@electric-sql/pglite/dist/index.js';
import { sandboxTutorials } from '../../../src/lib/sql-sandbox-tutorials.ts';
const seed = readFileSync('docs/article-work/designing-data/schema.sql', 'utf8') + `
CREATE TABLE stock (
  product_id text PRIMARY KEY REFERENCES products (product_id),
  available integer NOT NULL CHECK (available >= 0)
);
INSERT INTO stock (product_id, available) VALUES ('P7', 3);`;
const expectedErrors = { 'constraints:2': '23514', 'rollback:3': '23514', 'rollback:4': '25P02' };
const summaries = [];
for (const tutorial of sandboxTutorials) {
  const db = new PGlite(); await db.exec(seed);
  const steps = [];
  for (const [index, step] of tutorial.steps.entries()) {
    const expectedError = expectedErrors[`${tutorial.id}:${index}`];
    try {
      const result = await db.exec(step.sql);
      assert.equal(expectedError, undefined, `${tutorial.id} ${index} should reject`);
      steps.push(result.map(r=>r.rows));
    } catch (e) {
      assert.equal(e.code, expectedError, `${tutorial.id} ${index}: ${e.message}`);
      assert.ok(expectedError);
      steps.push({ sqlstate: e.code });
    }
  }
  if (tutorial.id === 'queries') {
    assert.deepEqual(steps[0][0].map(r=>r.name), ['Blue mug','Bowl']);
    assert.equal(steps[1][0].length, 2);
    assert.deepEqual(steps[2][0].map(r=>r.name), ['Blue mug','Bowl']);
    assert.equal(Number(steps[3][0][0].order_total), 44);
    assert.equal(Number((await db.query("SELECT sum(quantity*unit_price) AS total FROM order_lines WHERE order_id='O12'")).rows[0].total), 36);
  }
  if (tutorial.id === 'constraints') assert.equal(steps[3][0][0].quantity, 3);
  if (tutorial.id === 'checkout' || tutorial.id === 'rollback') {
    const row=steps.at(-1)[0][0];
    assert.deepEqual(Object.values(row).map(Number),tutorial.id==='checkout' ? [1,1,1] : [3,0,0]);
  }
  summaries.push({tutorial:tutorial.id, steps});
  await db.close();
}
console.log(JSON.stringify(summaries,null,2));
console.log('All 21 default tutorial steps and three expected errors checked against PostgreSQL 18.3/PGlite 0.5.8.');
