// Reading time for an article, counted from the built page so it can't drift
// from the text. Uses Medium's published convention: 265 words a minute for
// prose, plus 12 seconds for each figure.
import { parse, type HTMLElement } from 'node-html-parser';

const WORDS_PER_MINUTE = 265;
const SECONDS_PER_FIGURE = 12;

const isFigure = (el: HTMLElement) =>
  el.tagName === 'FIGURE' || (el.getAttribute('class') ?? '').split(/\s+/).some((c) => c === 'figure' || c.endsWith('-figure'));

export function readingMinutes(html: string): number {
  const root = parse(html, { comment: false });
  const article = root.querySelector('article') ?? root.querySelector('main') ?? root;
  for (const el of article.querySelectorAll('script, style, nav, [data-reading-time]')) el.remove();
  // Outermost figures only: a figure inside a figure is one thing to look at.
  const insideFigure = (el: HTMLElement) => {
    for (let node = el.parentNode; node; node = node.parentNode) if (node.tagName && isFigure(node)) return true;
    return false;
  };
  const figures = article.querySelectorAll('*').filter((el) => isFigure(el) && !insideFigure(el));
  for (const figure of figures) figure.remove();
  const words = article.text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE + (figures.length * SECONDS_PER_FIGURE) / 60));
}

export const readingTimeLabel = (minutes: number) => `About ${minutes} minute${minutes === 1 ? '' : 's'}`;
