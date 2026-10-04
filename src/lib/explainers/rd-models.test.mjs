import test from 'node:test';
import assert from 'node:assert/strict';
import { checkoutStart, checkoutStep, catalogueStart, catalogueRename, cataloguePropagate, catalogueRead, catalogueStale } from './rd-models.mjs';

function concurrent(policy) {
  let s = checkoutStart(policy);
  for (const buyer of ['A', 'B', 'A', 'B', 'A', 'B', 'B']) s = checkoutStep(s, buyer);
  return s;
}
test('stale application arithmetic sells one item twice without negative stock', () => {
  const s = concurrent('unsafe');
  assert.equal(s.stock, 0); assert.deepEqual(s.orders, ['A', 'B']);
});
test('guarded predicate is checked against current stock after waiting', () => {
  const s = concurrent('guarded');
  assert.equal(s.stock, 0); assert.deepEqual(s.orders, ['A']); assert.equal(s.buyers.B.phase, 'rejected');
});
test('uncommitted stock and order remain invisible; rollback releases writer', () => {
  let s = checkoutStart('guarded');
  s = checkoutStep(checkoutStep(s, 'A'), 'A');
  assert.equal(s.stock, 1); assert.deepEqual(s.orders, []); assert.equal(s.lock, 'A');
  s = checkoutStep(s, 'B'); assert.equal(s.buyers.B.read, 1);
  const blocked = checkoutStep(s, 'B'); assert.equal(blocked.buyers.B.phase, 'read'); assert.equal(blocked.lock, 'A');
  s = checkoutStep(blocked, 'A', 'abort');
  s = checkoutStep(checkoutStep(s, 'B'), 'B');
  assert.deepEqual(s.orders, ['B']); assert.equal(s.stock, 0);
});
test('sequential buyers do not oversell even with the unsafe policy', () => {
  let s = checkoutStart(); for (const b of ['A', 'A', 'A', 'B', 'B']) s = checkoutStep(s, b);
  assert.deepEqual(s.orders, ['A']); assert.equal(s.buyers.B.phase, 'rejected');
});
test('steps do not mutate their input and finished transactions cannot run twice', () => {
  const start = checkoutStart(); let s = start;
  for (let i = 0; i < 3; i++) s = checkoutStep(s, 'A');
  assert.deepEqual(start, checkoutStart()); assert.deepEqual(checkoutStep(s, 'A'), s);
});
test('embedded rename temporarily disagrees; each propagation repairs one copy', () => {
  let s = catalogueRename(catalogueStart('embedded', 5));
  assert.equal(catalogueStale(s), 5); assert.equal(catalogueRead(s, 1).documents, 1);
  s = cataloguePropagate(s);
  assert.equal(catalogueRead(s, 1).stale, false); assert.equal(catalogueRead(s, 2).stale, true);
  for (let i = 0; i < 4; i++) s = cataloguePropagate(s);
  assert.equal(catalogueStale(s), 0); assert.equal(s.writes, 6);
  assert.deepEqual(cataloguePropagate(s), s);
});
test('reference rename changes every resolved view with one document write', () => {
  const s = catalogueRename(catalogueStart('reference', 8));
  for (const p of s.products) assert.deepEqual(catalogueRead(s, p.id), { name: p.name, brand: 'Harbour Studio', documents: 2, stale: false });
  assert.equal(s.writes, 1); assert.equal(catalogueStale(s), 0);
  assert.deepEqual(cataloguePropagate(s), s);
});
test('catalogue operations are immutable and invalid identities are rejected', () => {
  const s = catalogueStart(); catalogueRename(s); assert.equal(s.source, 'Harbour Clay');
  assert.throws(() => catalogueRead(s, 99)); assert.throws(() => catalogueStart('embedded', 9));
});
