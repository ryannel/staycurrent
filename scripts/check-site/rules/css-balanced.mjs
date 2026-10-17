import { cssOf } from './raw-colour.mjs';

// The build only warns about broken CSS, and the browser drops everything
// after the break. Unbalanced braces or brackets are the usual cause.
export default {
  id: 'css-balanced',
  why: 'A missing ) or } silently disables every rule after it; the build only prints a warning.',
  source: ['src'],
  check(file) {
    const css = cssOf(file.path, file.text).replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, '""');
    const issues = [];
    const stack = [];
    const pairs = { '}': '{', ')': '(' };
    for (const [i, ch] of [...css].entries()) {
      if (ch === '{' || ch === '(') stack.push({ ch, i });
      else if (ch in pairs) {
        if (stack.at(-1)?.ch === pairs[ch]) stack.pop();
        else { issues.push({ message: `unexpected "${ch}" near: ${css.slice(Math.max(0, i - 50), i + 1).replace(/\s+/g, ' ')}` }); break; }
      }
    }
    if (!issues.length && stack.length) {
      const { ch, i } = stack.at(-1);
      issues.push({ message: `"${ch}" never closed near: ${css.slice(i, i + 60).replace(/\s+/g, ' ')}` });
    }
    return issues;
  },
};
