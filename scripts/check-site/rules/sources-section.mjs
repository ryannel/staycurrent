export default {
  id: 'sources-section',
  why: 'Readers check claims and find onward reading in the same place on every article.',
  kinds: ['Article'],
  check(page, site, options = {}) {
    const heading = options.heading ?? 'Sources and further reading';
    const h2s = page.article.querySelectorAll('h2');
    if (!h2s.length) return [];
    const last = h2s[h2s.length - 1].text.replace(/\s+/g, ' ').trim();
    return last === heading ? [] : [{ message: `last section is "${last}", not "${heading}"` }];
  },
};
