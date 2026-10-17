import { before } from '../site.mjs';

export default {
  id: 'contents-after-opening',
  why: 'The opening tells a reader what the subject is; a list of section names before it tells them nothing yet.',
  kinds: ['Article'],
  check(page, site, options = {}) {
    const min = options.minSections ?? 3;
    const sections = page.article.querySelectorAll('h2');
    const nav = page.article.querySelectorAll('nav').find((n) => n.getAttribute('aria-label') === 'In this article');
    if (!nav) return sections.length >= min ? [{ message: `${sections.length} sections and no "In this article" contents list` }] : [];
    const issues = [];
    const firstParagraph = page.article.querySelectorAll('p').find((p) => before(page, page.article.querySelector('h1') ?? page.article, p) && !p.closest('header'));
    if (!firstParagraph || before(page, nav, firstParagraph)) issues.push({ message: 'the contents list comes before the opening' });
    if (sections[0] && before(page, sections[0], nav)) issues.push({ message: 'the contents list comes after the first section heading' });
    return issues;
  },
};
