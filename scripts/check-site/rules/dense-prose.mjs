// Sentences and paragraphs that ask the reader to hold too much at once.
//
// A sentence's load is its words plus a cost for each extra thing to track:
// 3 per comma, semicolon, colon or dash, 5 per parenthesis, 2 per number.
// Inline code counts as one word, so SQL and commands don't count as clauses,
// but messages quote it as written so the passage can be found in the source.
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
// A code span stands in the text as a numbered token, so it scores as one word
// and a sentence that starts with one still splits from the sentence before.
const CODE = /\uE000(\d+)\uE001/g;

/** A paragraph's text, with each code span replaced by a token and kept in codes. */
function prose(el, codes) {
  return el.childNodes.map((n) => {
    if (n.nodeType === 3) return n.rawText;
    if (['CODE', 'KBD', 'SAMP'].includes(n.tagName)) return `\uE000${codes.push(n.text) - 1}\uE001`;
    if (n.tagName === 'BR') return ' ';
    return n.nodeType === 1 ? prose(n, codes) : '';
  }).join('');
}

const decode = (s) => s.replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, '’').replace(/&quot;/g, '"');

export function sentences(text) {
  return text.replace(ABBREVIATIONS, '$1').split(/(?<=[.?!]["”’)]?)\s+(?=[A-Z0-9"“‘(\uE000])/).filter((s) => s.split(/\s+/).length > 2);
}

export function load(sentence) {
  const plain = sentence.replace(CODE, 'Code');
  const count = (re) => (plain.match(re) ?? []).length;
  const parts = {
    words: plain.split(/\s+/).length,
    clauses: count(/,(?!\d)|;|:\s| [—–] /g),
    parens: count(/\(/g),
    numbers: count(/\b\d[\d,.]*/g),
  };
  return { ...parts, load: parts.words + 3 * parts.clauses + 5 * parts.parens + 2 * parts.numbers };
}

const plural = (n, one, many = one + 's') => `${n} ${n === 1 ? one : many}`;
const list = (items) => (items.length > 1 ? `${items.slice(0, -1).join(', ')} and ${items.at(-1)}` : items[0]);

/** What makes a sentence heavy, in words a writer can check against the sentence. */
function describe(l) {
  return list([
    plural(l.words, 'word'),
    l.numbers && plural(l.numbers, 'number'),
    l.clauses && plural(l.clauses, 'comma, colon or dash', 'commas, colons or dashes'),
    l.parens && plural(l.parens, 'aside in brackets', 'asides in brackets'),
  ].filter(Boolean));
}

const opening = (s) => {
  const words = s.split(' ');
  return words.length > 12 ? words.slice(0, 12).join(' ') + '…' : s;
};

export default {
  id: 'dense-prose',
  why: 'These passages are harder to read than the human-written explainers we measure against. Rewrite each so a reader gets it on one read and loses nothing they need; the counts only show where to look.',
  kinds: ['Article'],
  check(page, site, { sentence = 45, paragraph = 33, paragraphWords = 90 } = {}) {
    const issues = [];
    for (const p of page.article.querySelectorAll('p')) {
      if (insideFigure(p) || p.closest('aside, figcaption, .essay-sources')) continue;
      const codes = [];
      const asWritten = (s) => s.replace(CODE, (_, i) => codes[i]);
      const loads = sentences(decode(prose(p, codes)).replace(/\s+/g, ' ').trim()).map((s) => ({ s, ...load(s) }));
      for (const l of loads) {
        if (l.load >= sentence) issues.push({ message: `This sentence has a lot to take in: ${describe(l)}.\n           "${asWritten(l.s)}"` });
      }
      if (!loads.length) continue;
      const words = loads.reduce((a, l) => a + l.words, 0);
      const mean = loads.reduce((a, l) => a + l.load, 0) / loads.length;
      const long = words >= paragraphWords;
      // A paragraph of one heavy sentence is already reported above.
      const heavy = loads.length >= 2 && mean >= paragraph && !loads.every((l) => l.load >= sentence);
      if (long || heavy) {
        const what = long && heavy ? `runs to ${words} words, and its sentences are heavy on average`
          : long ? `runs to ${words} words` : 'has sentences that are heavy on average';
        issues.push({ message: `This paragraph ${what}. It starts: "${asWritten(opening(loads[0].s))}"` });
      }
    }
    return issues;
  },
};
