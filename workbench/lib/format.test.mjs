// Unit coverage for workbench/lib/format.mjs — the one genuinely formula-bearing
// module in the CLI (date formats, the due/next-run derivation, the state-block
// padding rule). Run with: `node --test workbench/lib/format.test.mjs`.
//
// The golden fixture below is 01-ui-design.md's rendered state-block example,
// asserted byte-for-byte: three topics at cadence 90d viewed on 2026-07-04
// reproduce exactly the block the design document renders — the spec's own
// example is the test oracle.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatDateLong,
  formatDateShort,
  stateFor,
  renderStateBlock,
  renderHaltTemplate,
} from './format.mjs';

const TODAY = Date.UTC(2026, 6, 4); // 2026-07-04, injectable clock

const topic = (overrides) => ({
  topic: 'example',
  title: 'Example',
  stance: 's',
  version: 1,
  status: 'current',
  cadence: '90d',
  last_researched: '2026-06-12',
  due: false,
  ...overrides,
});

test('formatDateLong renders DD MMM YYYY with a two-digit padded day', () => {
  assert.equal(formatDateLong('2026-06-12'), '12 Jun 2026');
  assert.equal(formatDateLong('2026-03-01'), '01 Mar 2026'); // the padding case the 01 example fixes
});

test('formatDateShort renders DD MMM', () => {
  assert.equal(formatDateShort('2026-09-10'), '10 Sep');
  assert.equal(formatDateShort('2026-10-07'), '07 Oct');
});

test('stateFor: current topic projects the next run from last_researched + cadence', () => {
  assert.equal(stateFor(topic({}), TODAY), 'current — next run 10 Sep'); // 2026-06-12 + 90d
});

test('stateFor: overdue topic renders "due — N days over"', () => {
  // 2026-03-01 + 90d = 2026-05-30; 2026-07-04 is 35 days past it.
  assert.equal(stateFor(topic({ last_researched: '2026-03-01' }), TODAY), 'due — 35 days over');
});

test('stateFor: in-research wins regardless of dates', () => {
  assert.equal(stateFor(topic({ status: 'in-research', last_researched: '2020-01-01' }), TODAY), 'in-research');
});

test('renderStateBlock reproduces the 01-ui-design rendered example byte-for-byte', () => {
  const topics = [
    topic({ topic: 'observability', version: 5, last_researched: '2026-06-12' }),
    topic({ topic: 'testing', version: 3, last_researched: '2026-06-28' }),
    topic({ topic: 'cost-engineering', version: 2, last_researched: '2026-03-01' }),
  ];
  assert.deepEqual(renderStateBlock(topics, TODAY), [
    'observability      v5   researched 12 Jun 2026   current — next run 10 Sep',
    'testing            v3   researched 28 Jun 2026   current — next run 26 Sep',
    'cost-engineering   v2   researched 01 Mar 2026   due — 35 days over',
  ]);
});

test('renderStateBlock pads every column to its widest value plus three spaces', () => {
  const rows = renderStateBlock(
    [
      topic({ topic: 'a', version: 1 }),
      topic({ topic: 'much-longer-slug', version: 10 }),
    ],
    TODAY
  );
  // slug column: widest is 16 chars → 'a' is padded to 16 + 3 = 19.
  assert.ok(rows[0].startsWith('a'.padEnd(19) + 'v1'));
  // version column: widest is 'v10' (3) → 'v1' padded to 3 + 3 = 6.
  assert.ok(rows[0].includes('v1'.padEnd(6) + 'researched'));
});

test('renderStateBlock of zero topics renders zero rows', () => {
  assert.deepEqual(renderStateBlock([], TODAY), []);
});

test('renderHaltTemplate renders the Blocked/Cause/State/Action block with aligned labels', () => {
  const rendered = renderHaltTemplate({
    blocked: 'cut v6 failed the publish gate.',
    cause: 'provenance-non-empty: versions/v6/provenance.md has no entries in Sources or Synthesis',
    state: 'staged set intact at .staycurrent/staged/databases/; topics/ untouched',
    action: 'provide sources, then re-run `cut databases`.',
    extraFailures: [{ check: 'changelog-top-entry', message: "changelog.md top entry is '## v5', expected '## v6'" }],
  });
  const lines = rendered.split('\n');
  assert.match(lines[0], /^Blocked: cut v6 failed/);
  assert.match(lines[1], /^Cause:   provenance-non-empty:/);
  assert.match(lines[2], /^State:   staged set intact/);
  assert.match(lines[3], /^Action:  provide sources/);
  assert.equal(lines[4], "FAIL changelog-top-entry: changelog.md top entry is '## v5', expected '## v6'");
});
