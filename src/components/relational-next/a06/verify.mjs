import assert from 'node:assert/strict';
import { scenes, getFrame, evolution, race, move } from './model.mjs';

for (const [scene, config] of Object.entries(scenes)) {
  for (const mode of config.options.length ? config.options.map(option => option[0]) : ['']) {
    for (let step = 0; step < config.steps.length; step++) {
      const current = getFrame(scene, mode, step);
      for (const key of ['action', 'note', 'gate']) assert.ok(current[key].length > 10);
      for (const side of ['left', 'right']) {
        assert.ok(current[side].label);
        assert.ok(current[side].rows.length);
        assert.equal(new Set(current[side].rows.map(row => row.id)).size, current[side].rows.length);
        for (const row of current[side].rows) assert.equal(typeof row.value, 'string');
      }
      assert.ok(['left', 'right'].includes(current.active));
    }
    assert.deepEqual(getFrame(scene, mode, -10), getFrame(scene, mode, 0));
    assert.deepEqual(getFrame(scene, mode, 999), getFrame(scene, mode, config.steps.length - 1));
  }
}
assert.ok(evolution(1).right.rows.every(row => row.value === 'pending'));
assert.equal(evolution(3).right.rows.filter(row => row.note === 'current').length, 2);
assert.match(evolution(3).gate, /STOP.*103/);
assert.equal(evolution(4).right.rows[2].value, '7 Oak Lane · York · YO1 3CC');
assert.ok(evolution(6).left.rows.every(row => row.value === 'column removed'));
assert.deepEqual(evolution(5).right.rows, evolution(6).right.rows);
assert.equal(race(2, 'guarded').right.rows[0].value, '12 Birch Road');
assert.equal(race(3, 'guarded').right.rows[1].value, '12 Birch Road');
assert.equal(race(3, 'blind').right.rows[1].value, '8 Ash Road');
assert.equal(race(4, 'guarded').left.rows[0].value, '12 Birch Road');
assert.match(race(3, 'blind').gate, /STOP/);
assert.equal(move(1, 'fenced').left.rows.length, 2);
assert.equal(move(1, 'fenced').right.rows.length, 1);
assert.deepEqual(move(3, 'fenced').left.rows, move(3, 'fenced').right.rows);
assert.match(move(3, 'fenced').left.label, /fenced/);
assert.equal(move(5, 'fenced').left.rows.some(row => row.id === '103'), false);
assert.equal(move(5, 'fenced').right.rows.find(row => row.id === '103').value, 'paid');
assert.notEqual(move(5, 'routing').left.rows.find(row => row.id === '103').value, move(5, 'routing').right.rows.find(row => row.id === '103').value);
assert.match(move(5, 'routing').gate, /UNSAFE/);
console.log('a06: all 29 scene/mode frames, transition gates, version-race outcomes and cutover divergence verified.');
