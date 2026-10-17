import { cssOf, declarations } from './raw-colour.mjs';

// A classic scrollbar takes about 17px from the page, so an element exactly
// 100vw wide overflows it. Centred and reduced by a margin, as in
// calc(100vw - 2rem), it fits, because the margin is wider than half the scrollbar.
const UNREDUCED = /(^|[\s,(])100vw(?!\s*-\s*\d)/;

export default {
  id: 'viewport-width',
  why: 'An element exactly 100vw wide is wider than the page when a classic scrollbar is showing, so the page scrolls sideways on Windows.',
  source: ['src'],
  check(file) {
    return declarations(cssOf(file.path, file.text))
      .filter(([, value]) => UNREDUCED.test(value))
      .map(([prop, value]) => ({ message: `${prop}: ${value.slice(0, 70)}` }));
  },
};
