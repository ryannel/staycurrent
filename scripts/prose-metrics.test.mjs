// scripts/prose-metrics.test.mjs — pins the prose-metrics tokenizer.
// Run: node --test scripts/prose-metrics.test.mjs
//
// Two fixture populations. Inline strings pin each tokenization rule the
// header comment promises. The frozen articles under
// topics/databases/versions/v1|v2|v3/ pin whole-file numbers forever —
// those trees are written once at cut time and never change (writer skill,
// § versions/vN snapshot), which makes them permanent fixtures.
//
// One relationship documented rather than asserted: the v3 changelog
// publishes its own before/after numbers ("22 words to 19", "20 percent
// to 11", "1.2 … to 0.4 per hundred words") from the ad-hoc measurement
// used at cut time. Different tokenizers round those differently — which
// is the reason this script exists. The exact values below are this
// script's readings; the story assertions at the end check what the
// changelog's story actually claims: rhythm moved a lot, the uncounted
// tells did not move at all.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { computeMetrics, extractBody, FLAB_MARKERS } from './prose-metrics.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const versionArticle = (v) =>
  fs.readFileSync(
    path.join(repoRoot, 'topics', 'databases', 'versions', v, 'article.md'),
    'utf8'
  );

test('extractBody strips frontmatter, fences, headings, and tables', () => {
  const doc = [
    '---',
    'title: X',
    '---',
    '# Heading',
    'Kept prose line.',
    '```js',
    'const dropped = true;',
    '```',
    '| dropped | table |',
    '> Kept blockquote line.',
    '- Bullet text kept, marker stripped.',
    '',
  ].join('\n');
  const body = extractBody(doc);
  assert.match(body, /Kept prose line\./);
  assert.match(body, /Kept blockquote line\./);
  assert.match(body, /(?<![-*] )Bullet text kept/);
  assert.doesNotMatch(body, /Heading|dropped|title/);
});

test('a bare hyphen is never a word token', () => {
  const m = computeMetrics('Read the write-ahead log - it holds the truth today.');
  // write-ahead counts once; the lone hyphen counts never: 9 words total.
  assert.equal(m.words, 9);
});

test('sentence splitting keeps real sentences and drops fragments', () => {
  const m = computeMetrics(
    'The leader records every write. Yes. A follower that falls behind replays the backlog.'
  );
  // "Yes." is a two-or-fewer-word fragment and is dropped.
  assert.equal(m.sentences, 2);
});

test('bold spans and mirrored constructions are counted on the body', () => {
  const m = computeMetrics(
    'A **B-tree** updates in place, not by appending; not that appends are free. Plain here.'
  );
  assert.equal(m.boldSpans, 1);
  assert.equal(m.notConstructions, 2);
});

test('flab words match only at word boundaries', () => {
  const clean = computeMetrics('Every delivery keeps its discovery honest today.');
  assert.equal(clean.flabHits.length, 0);
  const flabby = computeMetrics('It is important to note this is very robust, basically.');
  const markers = flabby.flabHits.map((h) => h.marker);
  assert.deepEqual(
    markers.sort(),
    ['basically', 'it is important to note', 'robust', 'very'].sort()
  );
});

test('acronym candidates report expansion-nearby readings', () => {
  const m = computeMetrics(
    'An LSM-tree, short for log-structured merge-tree, refuses the random write. CAP binds only during a partition. OLTP, online transaction processing, is many small operations. ACID, however, is asserted cold.'
  );
  const byToken = Object.fromEntries(m.acronymCandidates.map((a) => [a.token, a.expansionNearby]));
  assert.equal(byToken.LSM, true, 'short-for phrase reads as expansion');
  assert.equal(byToken.CAP, false, 'bare mention stays cold');
  assert.equal(byToken.OLTP, true, 'multi-word comma-appositive reads as expansion');
  assert.equal(byToken.ACID, false, 'a one-word aside is not an appositive');
});

test('FLAB_MARKERS carries the eval-2 list and the Zinsser set', () => {
  const markers = FLAB_MARKERS.map((f) => f.marker);
  for (const required of ['it is important to note', 'leverag', 'robust', 'basically', 'probably', 'very', 'quite', 'somewhat', 'when it comes to', 'in terms of', 'the fact that']) {
    assert.ok(markers.includes(required), `missing marker: ${required}`);
  }
});

// ---------------------------------------------------------------------------
// Frozen-version fixtures — exact values as this script computes them.
// ---------------------------------------------------------------------------

const EXPECTED = {
  v1: { words: 2357, sentences: 117, avg: 20.1, over30: 11.1, emDashes: 0, notConstructions: 7, boldSpans: 1 },
  v2: { words: 4730, sentences: 220, avg: 21.5, over30: 18.2, emDashes: 58, notConstructions: 10, boldSpans: 19 },
  v3: { words: 4752, sentences: 251, avg: 18.9, over30: 10.0, emDashes: 17, notConstructions: 10, boldSpans: 19 },
};

for (const [v, expected] of Object.entries(EXPECTED)) {
  test(`frozen ${v} article measures exactly as pinned`, () => {
    const m = computeMetrics(versionArticle(v));
    assert.equal(m.words, expected.words);
    assert.equal(m.sentences, expected.sentences);
    assert.equal(Number(m.avgWordsPerSentence.toFixed(1)), expected.avg);
    assert.equal(Number((100 * m.over30Share).toFixed(1)), expected.over30);
    assert.equal(m.emDashes, expected.emDashes);
    assert.equal(m.notConstructions, expected.notConstructions);
    assert.equal(m.boldSpans, expected.boldSpans);
  });
}

test('the v2→v3 voice edit moved the counted tells and froze the uncounted ones', () => {
  const v2 = computeMetrics(versionArticle('v2'));
  const v3 = computeMetrics(versionArticle('v3'));
  // Counted tells moved, in the magnitude the changelog story claims.
  assert.ok(v2.avgWordsPerSentence - v3.avgWordsPerSentence >= 2);
  assert.ok(v3.over30Share / v2.over30Share <= 0.62, 'over-30 share roughly halved');
  assert.ok(v3.emDashesPer100Words / v2.emDashesPer100Words <= 0.35, 'em-dash density to a third');
  // Uncounted tells did not move at all — the finding the editorial loop exists for.
  assert.equal(v3.notConstructions, v2.notConstructions);
  assert.equal(v3.boldSpans, v2.boldSpans);
});
