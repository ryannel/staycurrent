#!/usr/bin/env node
// scripts/prose-metrics.mjs — the house measuring tool for the countable
// prose tells (staycurrent-style § The editing pass). Measurement, never
// judgment: it prints facts about a markdown file's prose and exits. The
// calibration bands the numbers are read against are judgment, and they live
// in the skills that quote them (staycurrent-style, staycurrent-editor) —
// never here. Nothing imports this file from workbench/cli.mjs, core/, or
// CI, and nothing ever should: the publish gate stays structural-only
// (ADR 0003), and prose measurement stays an arm's length from it.
//
// Consumers: staycurrent-editor's calibration block, the skill evals, and
// anyone editing prose by hand. Before this script existed, three
// measurements of the live databases article circulated (17, 19, and 19.7
// words per sentence) because every measurement re-invented its tokenizer.
// This file is the one tokenizer; a number quoted without it is a guess.
//
// Tokenization, precisely (the numbers are only reproducible because this
// is pinned): YAML frontmatter is stripped; fenced code blocks (```…```)
// are stripped; heading lines (#…) and table lines (|…) are dropped;
// leading list markers (-, *, +, 1.) are stripped so a bullet's text reads
// as plain prose; blockquote `>` rides along and the word pattern ignores
// it. Bold spans are counted on that body as `**…**` pairs. Words are
// [\w'’-] runs containing at least one word character (a bare hyphen is
// never a word). Sentences split after . ! or ? followed by whitespace and
// an opener ([A-Z`"(*>]); fragments of two or fewer word-tokens are
// dropped. Flab markers: multi-word phrases and stems match anywhere,
// single words only at word boundaries ("very" must never count "every").
// Acronym candidates are 2–5 capital tokens listed at first occurrence
// with a yes/no "expansion nearby" reading of that sentence — expansion
// means an adjacent parenthetical, a parenthesized mention, a multi-word
// comma-appositive ("OLTP, online transaction processing,"), or a "short
// for"/"stands for" phrase. The text block prints only the cold candidates;
// --json carries the full list with flags. Candidates for a human to
// check, never verdicts.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Banned-flab union: staycurrent-style eval 2's markers + mechanics.md's
// Zinsser set. `phrase` entries match anywhere (stems included); `word`
// entries require word boundaries.
export const FLAB_MARKERS = [
  { marker: 'it is important to note', kind: 'phrase' },
  { marker: 'when it comes to', kind: 'phrase' },
  { marker: 'in terms of', kind: 'phrase' },
  { marker: 'the fact that', kind: 'phrase' },
  { marker: 'leverag', kind: 'phrase' },
  { marker: 'robust', kind: 'phrase' },
  { marker: 'basically', kind: 'word' },
  { marker: 'probably', kind: 'word' },
  { marker: 'very', kind: 'word' },
  { marker: 'quite', kind: 'word' },
  { marker: 'somewhat', kind: 'word' },
];

const WORD = /[\w'’-]*\w[\w'’-]*/g;
const SENTENCE_SPLIT = /(?<=[.!?])\s+(?=[A-Z`"(*>])/;

/**
 * The pinned body extraction: frontmatter, fences, headings, tables out;
 * list markers stripped so bullet text measures as the prose it is.
 */
export function extractBody(markdown) {
  let text = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---(\r?\n|$)/, '');
  text = text.replace(/```[\s\S]*?```/g, '');
  const lines = text
    .split('\n')
    .filter((l) => !l.startsWith('#') && !l.startsWith('|') && l.trim() !== '')
    .map((l) => l.replace(/^\s*(?:[-*+]|\d+\.)\s+/, ''));
  return lines.join(' ');
}

function countMatches(text, re) {
  return (text.match(re) ?? []).length;
}

function flabHits(body) {
  const lower = body.toLowerCase();
  const hits = [];
  for (const { marker, kind } of FLAB_MARKERS) {
    const re =
      kind === 'word'
        ? new RegExp(`\\b${marker}\\b`, 'g')
        : new RegExp(marker.replace(/ /g, '\\s+'), 'g');
    const n = countMatches(lower, re);
    if (n > 0) hits.push({ marker, count: n });
  }
  return hits;
}

function acronymCandidates(body) {
  const seen = new Map();
  const sentences = body.split(SENTENCE_SPLIT);
  for (const sentence of sentences) {
    for (const token of sentence.match(/\b[A-Z]{2,5}\b/g) ?? []) {
      if (seen.has(token)) continue;
      const expansionNearby =
        new RegExp(`${token}\\s*\\(`).test(sentence) ||
        new RegExp(`\\([^)]*\\b${token}\\b[^)]*\\)`).test(sentence) ||
        new RegExp(`${token},\\s+(?:[\\w'’-]+\\s+)+[\\w'’-]+[,:;.]`).test(sentence) ||
        /short for|stands for/i.test(sentence);
      seen.set(token, { token, expansionNearby });
    }
  }
  return [...seen.values()];
}

/** Every metric for one markdown string. Facts only — no bands, no verdicts. */
export function computeMetrics(markdown) {
  const body = extractBody(markdown);
  const words = countMatches(body, WORD);
  const sentenceList = body
    .split(SENTENCE_SPLIT)
    .filter((s) => (s.match(WORD) ?? []).length > 2);
  const lengths = sentenceList.map((s) => (s.match(WORD) ?? []).length);
  const sentences = lengths.length;
  const over30 = lengths.filter((n) => n > 30).length;
  const emDashes = countMatches(body, /—/g);
  const notConstructions = countMatches(body, /[,;]\s+not\s+/g);
  const boldSpans = countMatches(body, /\*\*[^*]+\*\*/g);
  const per100 = (n) => (words === 0 ? 0 : (100 * n) / words);
  return {
    words,
    sentences,
    avgWordsPerSentence: sentences === 0 ? 0 : lengths.reduce((a, b) => a + b, 0) / sentences,
    over30Share: sentences === 0 ? 0 : over30 / sentences,
    emDashes,
    emDashesPer100Words: per100(emDashes),
    notConstructions,
    notConstructionsPer100Words: per100(notConstructions),
    boldSpans,
    boldSpansPer100Words: per100(boldSpans),
    flabHits: flabHits(body),
    acronymCandidates: acronymCandidates(body),
  };
}

function renderBlock(file, m) {
  const pct = (x) => `${(100 * x).toFixed(1)}%`;
  const lines = [
    `${file}`,
    `  words ${m.words} | sentences ${m.sentences} | avg ${m.avgWordsPerSentence.toFixed(1)} w/s | >30w ${pct(m.over30Share)}`,
    `  em-dash ${m.emDashes} (${m.emDashesPer100Words.toFixed(2)}/100w) | ", not " ${m.notConstructions} (${m.notConstructionsPer100Words.toFixed(2)}/100w) | bold ${m.boldSpans} (${m.boldSpansPer100Words.toFixed(2)}/100w)`,
  ];
  if (m.flabHits.length > 0) {
    lines.push(`  flab: ${m.flabHits.map((h) => `${h.marker}×${h.count}`).join(', ')}`);
  }
  const cold = m.acronymCandidates.filter((a) => !a.expansionNearby);
  if (cold.length > 0) {
    lines.push(
      `  acronym candidates (no expansion nearby — check, don't assume): ${cold.map((a) => a.token).join(', ')}`
    );
  }
  return lines.join('\n');
}

function main(argv) {
  const args = argv.slice(2);
  const json = args.includes('--json');
  const files = args.filter((a) => a !== '--json');
  if (files.length === 0) {
    console.error('usage: node scripts/prose-metrics.mjs [--json] <file...>');
    return 1;
  }
  const results = [];
  for (const file of files) {
    let markdown;
    try {
      markdown = fs.readFileSync(path.resolve(file), 'utf8');
    } catch (err) {
      console.error(`prose-metrics: cannot read ${file}: ${err.message}`);
      return 1;
    }
    results.push({ file, metrics: computeMetrics(markdown) });
  }
  if (json) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    console.log(results.map((r) => renderBlock(r.file, r.metrics)).join('\n'));
  }
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  process.exitCode = main(process.argv);
}
