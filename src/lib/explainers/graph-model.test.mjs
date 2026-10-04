import test from 'node:test';
import assert from 'node:assert/strict';
import { graphStart, graphStep, graphRun, graphEdges } from './graph-model.mjs';
test('one incoming hop finds direct callers, with relationships examined separately', () => {
  const s = graphRun({limit: 1});
  assert.deepEqual(s.visited, ['inventory', 'checkout', 'warehouse']); assert.equal(s.inspected.length, 2); assert.equal(s.done, true);
});
test('hop-limit termination retains an unexpanded frontier instead of claiming full closure', () => {
  const s = graphRun({limit: 1});
  assert.equal(s.stopReason, 'hop-limit');
  assert.deepEqual(s.frontier, ['checkout', 'warehouse']);
  assert.equal(s.visited.includes('storefront'), false);
  assert.equal(graphRun({limit: 2}).visited.includes('storefront'), true);
});
test('an exhausted frontier is complete under the filter even at the hop bound', () => {
  const s = graphRun({start: 'warehouse', limit: 2});
  assert.equal(s.stopReason, 'frontier-exhausted'); assert.deepEqual(s.frontier, []);
  assert.deepEqual(s.visited, graphRun({start: 'warehouse', limit: 4}).visited);
});
test('required-property filter prunes optional callers before their expansion', () => {
  const strict = graphRun({limit: 3}); const all = graphRun({limit: 3, requiredOnly: false});
  assert.equal(strict.visited.includes('email'), false); assert.equal(strict.visited.includes('reports'), false);
  assert.equal(all.visited.includes('email'), true); assert.equal(all.visited.includes('reports'), true);
  assert.equal(strict.inspected.filter(e => e.decision === 'optional').length, 2);
});
test('return/warehouse cycle does not enqueue the same node twice', () => {
  const s = graphRun({start: 'warehouse', limit: 4});
  assert.equal(new Set(s.visited).size, s.visited.length);
  assert.equal(s.inspected.some(e => e.from === 'warehouse' && e.to === 'returns' && e.decision === 'seen'), true);
  assert.equal(s.depth, 2); assert.equal(s.frontier.length, 0);
});
test('additional links increase examined work even when the endpoint set stays small', () => {
  const sparse = graphRun({limit: 4}); const dense = graphRun({limit: 4, dense: true});
  assert.ok(dense.inspected.length > sparse.inspected.length); assert.ok(dense.visited.length <= 8);
});
test('saved witness paths follow actual required call relationships toward failure', () => {
  const s = graphRun({limit: 4, dense: true}); const edges = graphEdges(true);
  for (const path of Object.values(s.paths)) {
    assert.equal(path.at(-1), s.start); assert.ok(path.length - 1 <= 4);
    for (let i = 0; i < path.length - 1; i++) assert.ok(edges.some(e => e.from === path[i] && e.to === path[i + 1] && e.required));
  }
});
test('one layer advance preserves input and finished runs are stable', () => {
  const initial = graphStart(); const one = graphStep(initial);
  assert.equal(initial.depth, 0); assert.equal(initial.visited.length, 1); assert.equal(one.depth, 1);
  const finished = graphRun(); assert.deepEqual(graphStep(finished), finished);
  assert.throws(() => graphStart({limit: 0}));
});
