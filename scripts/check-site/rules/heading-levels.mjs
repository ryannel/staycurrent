export default {
  id: 'heading-levels',
  why: 'Skipping a level (an h2 followed by an h4) breaks the outline readers and assistive tools navigate by.',
  kinds: 'all',
  check(page) {
    const issues = [];
    let last = 0;
    for (const h of page.main.querySelectorAll('h1, h2, h3, h4, h5, h6')) {
      const level = Number(h.tagName[1]);
      if (last && level > last + 1) issues.push({ message: `h${last} is followed by h${level}: "${h.text.trim().slice(0, 60)}"` });
      last = level;
    }
    return issues;
  },
};
