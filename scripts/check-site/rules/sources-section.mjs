// Not every article has sources worth listing. Where one does, readers find
// them under a familiar heading near the end. Only onward reading (links to
// what to read or try next) may follow them.
const SOURCES = /^sources\b/i;

export default {
  id: 'sources-section',
  why: 'Readers check claims in the same place on every article that cites sources.',
  kinds: ['Article'],
  check(page, site, options = {}) {
    const names = options.headings ?? ['Sources and further reading'];
    const onward = options.onward ?? ['Further reading'];
    const h2s = page.article.querySelectorAll('h2').map((h) => h.text.replace(/\s+/g, ' ').trim());
    const issues = [];
    for (const [i, text] of h2s.entries()) {
      if (!SOURCES.test(text)) continue;
      if (!names.includes(text)) issues.push({ message: `"${text}" isn't one of: ${names.join(', ')}` });
      const after = h2s.slice(i + 1).filter((h) => !onward.includes(h));
      if (after.length) issues.push({ message: `"${text}" is followed by "${after.join('", "')}"; sources come last` });
    }
    return issues;
  },
};
