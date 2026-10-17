import { insideFigure } from '../site.mjs';

export default {
  id: 'no-heading-in-figure',
  why: 'A figure title is a caption, not a section. As a heading it joins the page outline and the contents.',
  kinds: 'all',
  check(page) {
    return page.main.querySelectorAll('h1, h2, h3, h4, h5, h6')
      .filter(insideFigure)
      .map((h) => ({ message: `${h.tagName.toLowerCase()} inside a figure: "${h.text.trim().slice(0, 60)}"` }));
  },
};
