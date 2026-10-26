import { test } from 'node:test';
import assert from 'node:assert/strict';
import { relationalRebuildPager } from '../../../src/lib/relational-rebuild-navigation.ts';

const entries = [
  { key: 'introduction', parent: null, available: true },
  { key: 'modelling', parent: 'introduction', available: true },
  { key: 'normalisation', parent: 'modelling', available: true },
  { key: 'hierarchies', parent: 'modelling', available: true },
  { key: 'values', parent: 'introduction', available: true },
  { key: 'postgresql', parent: 'introduction', available: true },
  { key: 'vacuum', parent: 'postgresql', available: true },
];
const path = ['introduction', 'modelling', 'values'];

test('modelling continues to values without making its deeper children prerequisites', () => {
  const pager = relationalRebuildPager(entries[1], entries, path);
  assert.equal(pager.previous.key, 'introduction');
  assert.equal(pager.next.key, 'values');
  assert.equal(pager.primary, true);
});

test('optional and native reading return to their owner without imposing another branch', () => {
  for (const [key, owner] of [['normalisation', 'modelling'], ['postgresql', 'introduction'], ['vacuum', 'postgresql']]) {
    const pager = relationalRebuildPager(entries.find(entry => entry.key === key), entries, path);
    assert.equal(pager.previous.key, owner);
    assert.equal(pager.next, undefined);
    assert.equal(pager.primary, false);
  }
});

test('unavailable pages never become pager destinations', () => {
  const available = entries.map(entry => ({ ...entry, available: entry.key !== 'modelling' }));
  assert.equal(relationalRebuildPager(available[0], available, path).next.key, 'values');
  assert.equal(relationalRebuildPager(available[2], available, path).previous, undefined);
});
