// Colours belong in custom properties, so a theme changes them in one place.
const COLOUR = /#[0-9a-f]{3,8}\b|\brgba?\(|\bhsla?\(/i;

/** CSS in a file: whole .css files, and the <style> blocks of .astro files. */
export function cssOf(path, text) {
  const css = path.endsWith('.css') ? text : [...text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

/** Each declaration as [property, value]; selectors are skipped because they end in "{". */
export const declarations = (css) => [...css.matchAll(/([-\w]+)\s*:\s*([^;{}]+)(?=[;}])/g)].map((m) => [m[1], m[2].trim()]);

export default {
  id: 'raw-colour',
  why: 'A colour written into a rule doesn\'t follow the light and dark themes; a custom property does.',
  source: ['src/components', 'src/layouts', 'src/pages'],
  check(file) {
    return declarations(cssOf(file.path, file.text))
      .filter(([prop, value]) => !prop.startsWith('--') && COLOUR.test(value))
      .map(([prop, value]) => ({ message: `${prop}: ${value.slice(0, 70)}` }));
  },
};
