import assert from 'node:assert/strict';
import { frame, scenarios } from './model.mjs';

let states = 0;
for (const [kind, scenario] of Object.entries(scenarios)) {
  for (const [choice] of scenario.choices) for (const [cause] of (scenario.causes ?? [['']])) {
    for (let step = 0; step < scenario.steps.length; step++) {
      const result = frame(kind, choice, cause, step);
      assert.ok(result.boxes.length && result.note && result.result);
      for (const box of result.boxes) assert.ok(box.title && box.rows.length);
      states++;
    }
  }
}
const resultRows = result => result.boxes.at(-1).rows;
assert.equal(resultRows(frame('reconstruction', 'safe', '', 3)).length, 2);
assert.equal(resultRows(frame('reconstruction', 'unsafe', '', 3)).filter(row => row.state === 'problem').length, 2);
assert.equal(resultRows(frame('advisers', 'split', '', 3)).length, 2);
assert.equal(resultRows(frame('advisers', 'original', '', 3)).length, 1);
assert.equal(resultRows(frame('sets', 'independent', 'two', 3)).filter(row=>row.state==='problem').length, 0);
assert.equal(resultRows(frame('sets', 'correlated', 'two', 3)).filter(row=>row.state==='problem').length, 2);
assert.ok(frame('sets', 'independent', 'empty', 3).result.includes('2 facilities retained'));
assert.equal(frame('total', 'overwrite', '', 5).result, 'Source €18.00 · stored €15.00 · difference €3.00');
assert.equal(frame('total', 'atomic', '', 5).result, 'Source €18.00 · stored €18.00 · difference €0.00');
assert.equal(frame('total', 'lag', '', 6).result, 'Source €18.00 · stored €10.00 · difference €8.00');
assert.equal(frame('total', 'lag', '', 7).result, 'Source €18.00 · stored €18.00 · difference €0.00');
assert.ok(frame('ownership', 'mixed', 'rename', 3).boxes[0].rows.some(row => row.state === 'problem'));
assert.ok(frame('ownership', 'split', 'delete', 3).boxes[0].rows.some(row => row.text === 'TEA · Tea'));
console.log(`PASS: ${states} figure states, reconstruction, local-rule counterexample, independence, empty sets, subtotal drift and publication boundaries`);
