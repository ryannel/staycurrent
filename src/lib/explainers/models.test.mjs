import { test } from 'node:test';
import assert from 'node:assert/strict';
import { records, countryReport, scanModel, pruningModel, insertBatch, mergeSmallest, replicationModel } from './models.mjs';

test('layouts retain the same records and only read pages containing requested fields', () => {
  for (const layout of ['rows', 'columns']) {
    const model = scanModel(layout, [0, 2]);
    assert.equal(new Set(model.pages.flatMap(p => p.values.map(v => `${v.row}:${v.field}`))).size, 96);
    assert.equal(model.useful, 32);
    assert.equal(scanModel(layout, []).read, 0);
    assert.equal(scanModel(layout, [0, 1, 2, 3, 4, 5]).read, 12);
  }
  assert.equal(scanModel('columns', [0, 2]).read, 4);
  assert.equal(scanModel('rows', [0, 2]).read, 12);
});
test('pruning never excludes a matching record and sorting preserves the answer', () => {
  for (const tenant of ['A', 'B', 'C', 'D', 'all']) {
    for (const sorted of [true, false]) {
      const model = pruningModel(sorted, tenant);
      assert.ok(model.blocks.filter(b => !b.read).every(b => b.values.every(r => r.tenant !== tenant)));
      assert.equal(model.matches, tenant === 'all' ? 16 : 4);
    }
  }
  assert.equal(pruningModel(true, 'B').read, 1);
  assert.equal(pruningModel(false, 'B').read, 4);
});
test('merges conserve rows while accounting for rewrite work', () => {
  const original = insertBatch([4, 4], 8);
  const merged = mergeSmallest(original);
  assert.deepEqual(original, [4, 4, 8]);
  assert.equal(merged.parts.reduce((a,b) => a+b, 0), 16);
  assert.equal(merged.rewritten, 8);
  assert.equal(merged.parts.length, 2);
  assert.deepEqual(mergeSmallest([16]), { parts: [16], rewritten: 0 });
});
test('failure before replication loses data but only async mode has acknowledged it', () => {
  assert.equal(replicationModel(2, 5, false, 2).lost, true);
  assert.equal(replicationModel(2, 5, false, 2).acknowledged, true);
  assert.equal(replicationModel(2, 5, true, 2).acknowledged, false);
  assert.equal(replicationModel(8, 5, false, 2).copied, false);
  assert.equal(replicationModel(6, 5, true, 6).copies, 1);
  assert.equal(replicationModel(6, 5, true, 6).lost, false);
});

test('both layouts reconstruct the same actual records and country report', () => {
  assert.deepEqual(countryReport(records, 'B'), [
    { shop: 'B', country: 'Sweden', views: 2 },
    { shop: 'B', country: 'UK', views: 2 },
  ]);
  for (const layout of ['rows', 'columns']) {
    const reconstructed = Array.from({ length: 16 }, (_, id) => ({ id, values: [] }));
    for (const page of scanModel(layout, [0, 2]).pages.filter(p => p.read)) {
      for (const cell of page.values) reconstructed[cell.row].values[cell.field] = cell.value;
    }
    const rows = reconstructed.map(r => ({ tenant: r.values[0], country: r.values[2] }));
    assert.deepEqual(countryReport(rows), countryReport(records));
  }
});
test('pruning keeps complete records aligned and preserves every shop report', () => {
  for (const sorted of [false, true]) {
    for (const shop of ['A', 'B', 'C', 'D', 'all']) {
      const model = pruningModel(sorted, shop);
      const rowsRead = model.blocks.filter(b => b.read).flatMap(b => b.values);
      assert.deepEqual(countryReport(rowsRead, shop), countryReport(records, shop));
      for (const row of model.blocks.flatMap(b => b.values)) assert.deepEqual(row, records[row.id]);
    }
  }
  assert.deepEqual(records[1].values, ['B', '09:41:12', 'Sweden', 'Page view', 'visitor_42', '/products/blue-mug']);
});
