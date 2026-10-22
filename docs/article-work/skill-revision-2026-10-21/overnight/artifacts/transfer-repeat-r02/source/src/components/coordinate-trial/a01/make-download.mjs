import { example } from '../example.mjs';
import { freshState, presets, snapshot, groupMatrix } from './model.mjs';
import { svgMatrix, viewMatrix, translation } from '../geometry.mjs';

const pair = p => `(${p.x}, ${p.y})`;

// Build the handoff from the actual figure, rather than maintain another DOM contract.
export function makeDownload(component, modules) {
  let markup = component.slice(component.indexOf('<figure'), component.indexOf('\n<script>'));
  const initial = freshState();
  const substitutions = new Map([
    ['{presets.map(p=><option value={p.id}>{p.label}</option>)}', presets.map(p => `<option value="${p.id}">${p.label}</option>`).join('')],
    ['{svgMatrix(viewMatrix(initial.view))}', `"${svgMatrix(viewMatrix(initial.view))}"`],
    ['{svgMatrix(groupMatrix())}', `"${svgMatrix(groupMatrix())}"`],
    ['{svgMatrix(translation(initial.card.x,initial.card.y))}', `"${svgMatrix(translation(initial.card.x,initial.card.y))}"`],
    ...[['group','width'],['group','height'],['card','width'],['card','height'],['p','x'],['p','y']]
      .map(([entity,key]) => [`{example.${entity}.${key}}`, `"${example[entity][key]}"`]),
  ]);
  for (const [expression, value] of substitutions) {
    if (!markup.includes(expression)) throw Error(`Download markup changed: ${expression}`);
    markup = markup.replaceAll(expression, value);
  }
  const outcomes = presets.map(p => {
    const s = snapshot(p), wrong = snapshot(p, 'Card', true);
    return `<section><p class="outcome-title"><strong>${p.label}</strong></p><dl><dt>Pointer C</dt><dd>${pair(s.fromC)} → ${pair(s.targetC)}</dd><dt>Derived translation G</dt><dd>${pair(s.next.card)}</dd><dt>Divide-by-zoom grab C</dt><dd>${pair(wrong.landedC)}</dd></dl></section>`;
  }).join('');
  markup = markup.replace(/\{fixed\.map\([\s\S]*?\)\}/, outcomes);
  if (/[{}]/.test(markup)) throw Error('Unrendered Astro expression in download');
  const css = component.match(/<style>([\s\S]*?)<\/style>/)[1].replace(/:global\(([^)]+)\)/g, '$1');
  const script = Object.entries(modules).map(([name, contents]) => {
    const source = contents.replace(/^import .*;\n/gm, '').replace(/^export /gm, '');
    if (/^import |^export /m.test(source)) throw Error(`Unbundled dependency: ${name}`);
    return `// ===== ${name} =====\n${source}`;
  }).join('\n');
  return `<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Review gesture editor</title>
<style>
:root{color-scheme:light dark;--font-sans:system-ui,sans-serif;--font-mono:ui-monospace,monospace;--color-text:light-dark(#17283a,#edf2f7);--color-text-secondary:light-dark(#42566b,#bccbda);--color-surface:light-dark(#ffffff,#13202d);--color-surface-alt:light-dark(#edf2f7,#1c2d3f);--color-rule-strong:light-dark(#6d7e90,#8a9caf);--color-accent:light-dark(#006592,#6ac8ff)}
body{max-width:52rem;margin:2rem auto;padding:0 1rem;background:var(--color-surface);color:var(--color-text);font:1rem/1.6 var(--font-sans)}h1{font-size:1.8rem}a{color:var(--color-accent)}
${css}
</style></head><body>
<h1>Review gesture editor</h1><p>Save this file, open it in a current browser, edit its source and reload to experiment. All data, geometry, event handlers, controls and startup code are included. No packages, build step, server or network connection is needed. The labelled script sections below correspond to the article’s modules.</p>
${markup}
<script>
${script}
document.querySelectorAll('[data-gesture-comparison]').forEach(mount);
</script></body></html>`;
}
