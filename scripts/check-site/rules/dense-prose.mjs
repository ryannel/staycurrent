// Sentences and paragraphs that ask the reader to hold too much at once.
//
// A sentence's load is its words plus a cost for each extra thing to track:
// 3 per comma, semicolon, colon or dash, 5 per parenthesis, 2 per number.
// Inline code counts as one word, so SQL and commands don't count as clauses.
//
// The limits come from two human-written explainers the publication aims to sit
// beside, Bartosz Ciechanowski's "Gears" (ciechanow.ski/gears/) and Sam Rose's
// "Load Balancing" (samwho.dev/load-balancing/), measured on 28 October 2026:
// 393 sentences in 166 paragraphs. Their sentences are no shorter than ours on
// average; they differ in what each carries. Under 1% of their sentences reach
// a load of 45, about 2% of their paragraphs average 33, and none of their
// paragraphs reaches 90 words.
import { insideFigure } from '../site.mjs';

const ABBREVIATIONS = /\b(e\.g|i\.e|etc|vs|cf)\./g;

/** A paragraph's text with each code span reduced to one word. */
function prose(el) {
  return el.childNodes.map((n) => {
    if (n.nodeType === 3) return n.rawText;
    if (['CODE', 'KBD', 'SAMP'].includes(n.tagName)) return ' code ';
    return n.nodeType === 1 ? prose(n) : '';
  }).join('');
}

const decode = (s) => s.replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, '’').replace(/&quot;/g, '"');

export function sentences(text) {
  return text.replace(ABBREVIATIONS, '$1').split(/(?<=[.?!]["”’)]?)\s+(?=[A-Z"“‘(])/).filter((s) => s.split(/\s+/).length > 2);
}

export function load(sentence) {
  const count = (re) => (sentence.match(re) ?? []).length;
  const parts = {
    words: sentence.split(/\s+/).length,
    clauses: count(/,(?!\d)|;|:\s| [—–] /g),
    parens: count(/\(/g),
    numbers: count(/\b\d[\d,.]*/g),
  };
  return { ...parts, load: parts.words + 3 * parts.clauses + 5 * parts.parens + 2 * parts.numbers };
}

const describe = (l) => [`${l.words} words`, l.clauses && `${l.clauses} commas or colons`, l.parens && `${l.parens} brackets`, l.numbers && `${l.numbers} numbers`].filter(Boolean).join(', ');
const excerpt = (s) => (s.length > 90 ? s.slice(0, 87) + '…' : s);

export default {
  id: 'dense-prose',
  why: 'Each sentence should carry one idea a reader can take in on one reading, and each paragraph a few of them: split crowded sentences, give numbers and caveats their own sentences, drop caveats that do not change what the reader does, and break long paragraphs.',
  kinds: ['Article'],
  check(page, site, { sentence = 45, paragraph = 33, paragraphWords = 90 } = {}) {
    const issues = [];
    for (const p of page.article.querySelectorAll('p')) {
      if (insideFigure(p) || p.closest('aside, figcaption, .essay-sources')) continue;
      const loads = sentences(decode(prose(p)).replace(/\s+/g, ' ').trim()).map((s) => ({ s, ...load(s) }));
      for (const l of loads) if (l.load >= sentence) issues.push({ message: `sentence (${describe(l)}): "${excerpt(l.s)}"` });
      const words = loads.reduce((a, l) => a + l.words, 0);
      if (words >= paragraphWords) issues.push({ message: `paragraph of ${words} words: "${excerpt(loads[0].s)}"` });
      const mean = loads.reduce((a, l) => a + l.load, 0) / loads.length;
      if (loads.length >= 2 && mean >= paragraph && !loads.every((l) => l.load >= sentence)) {
        issues.push({ message: `paragraph of ${loads.length} heavy sentences: "${excerpt(loads[0].s)}"` });
      }
    }
    return issues;
  },
};
