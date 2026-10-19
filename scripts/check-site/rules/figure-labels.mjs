// Figure labels are short elements reading "Figure N" or "Figure N · Title".
const LABEL = /^(Figure|Fig\.?|Animation|Diagram|Illustration)\s+(\d+)(\s*[·:.].*)?$/;

export default {
  id: 'figure-labels',
  why: 'Prose refers to figures by number, so every figure uses one word and the numbers run 1, 2, 3 in page order.',
  kinds: ['Article'],
  check(page) {
    const labels = [];
    for (const el of page.article.querySelectorAll('*')) {
      if (el.childNodes.some((c) => c.nodeType === 1 && !['SPAN', 'B', 'STRONG', 'EM'].includes(c.tagName))) continue;
      if (['A', 'P', 'LI', 'TD', 'TH', 'SUMMARY', 'BUTTON', 'OPTION', 'LABEL', 'TEXT', 'TSPAN'].includes(el.tagName)) continue;
      const text = el.text.replace(/\s+/g, ' ').trim();
      if (el.tagName !== 'FIGCAPTION' && text.length > 80) continue;
      const m = LABEL.exec(text);
      // A label repeated for the same figure (a fallback, a transcript) counts once.
      if (m && labels.at(-1)?.n !== Number(m[2])) labels.push({ el, word: m[1], n: Number(m[2]), text });
    }
    const issues = [];
    for (const l of labels) if (l.word !== 'Figure') issues.push({ message: `"${l.text}" uses "${l.word}"; label figures "Figure N"` });
    labels.forEach((l, i) => { if (l.n !== i + 1) issues.push({ message: `"${l.text}" is figure ${i + 1} in page order` }); });
    return issues;
  },
};
