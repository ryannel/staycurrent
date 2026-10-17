import { cssOf, declarations } from './raw-colour.mjs';

export default {
  id: 'viewport-width',
  why: '100vw includes a classic scrollbar, so a full-width element makes the page scroll sideways on Windows.',
  source: ['src'],
  check(file) {
    return declarations(cssOf(file.path, file.text))
      .filter(([, value]) => /\b100vw\b/.test(value))
      .map(([prop, value]) => ({ message: `${prop}: ${value.slice(0, 70)}` }));
  },
};
