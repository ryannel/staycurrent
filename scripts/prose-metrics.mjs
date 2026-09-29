#!/usr/bin/env node
// scripts/prose-metrics.mjs — counts the prose tells staycurrent-style's
// editing pass names: words per sentence, the share of sentences over thirty
// words, em-dashes, "X, not Y" constructions, bold spans, filler words, and
// acronyms with no expansion nearby. Measurement only; the bands the numbers
// are read against live in the skill. Nothing in the site build imports it.
//
// Usage: node scripts/prose-metrics.mjs <file.md> [--json]
//
// Frontmatter, fenced code, headings, and table lines are stripped before
// counting; list markers are stripped so a bullet reads as prose. Acronym
// candidates are listed for a human to check, never as verdicts.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// The flab markers staycurrent-style's editing pass names. `phrase` entries match anywhere (stems included); `word`
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
