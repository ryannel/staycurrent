// The line under an article's title: its type, the reading time, and any version it depends on.
const segmentsOf = (el) => {
  const spans = el.querySelectorAll('span');
  const parts = spans.length ? spans.map((s) => s.text) : el.text.split('·');
  return parts.map((s) => s.replace(/\s+/g, ' ').trim()).filter(Boolean);
};

export default {
  id: 'title-line',
  why: 'Readers learn where to look for an article\'s type, length and version when every page puts them in the same place and words.',
  kinds: ['Article'],
  check(page, site, options = {}) {
    const types = options.types ?? [];
    const h1 = page.article.querySelector('h1');
    if (!h1) return [];
    const header = h1.parentNode;
    const line = header.childNodes.find((n) => n.nodeType === 1 && /(^|[\s-])meta(\s|$)/.test(n.getAttribute('class') ?? ''));
    if (!line) return [{ message: 'no line under the title (article type · About N minutes)' }];
    const parts = segmentsOf(line);
    const issues = [];
    const first = parts[0] ?? '';
    if (types.length && !types.some((t) => first === t || first.startsWith(`${t} to `))) {
      issues.push({ message: `"${first}" isn't an article type (${types.join(', ')})` });
    }
    if (!parts.some((p) => /^About \d+ minutes?$/.test(p))) issues.push({ message: `no "About N minutes" in "${parts.join(' · ')}"` });
    if (parts.some((p) => /\bmin read\b/i.test(p))) issues.push({ message: `"min read" in "${parts.join(' · ')}"; use "About N minutes"` });
    return issues;
  },
};
