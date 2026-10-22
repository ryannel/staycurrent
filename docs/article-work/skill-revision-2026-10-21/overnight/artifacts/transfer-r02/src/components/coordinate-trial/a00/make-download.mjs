import {readFile,writeFile} from 'node:fs/promises';
import {example} from '../example.mjs';
const figure=await readFile(new URL('./BrowserFigure.astro',import.meta.url),'utf8');
const html=figure.slice(figure.indexOf('<div data-coordinate-editor>'),figure.indexOf('</Figure>'));
const source=(await readFile(new URL('./browser.mjs',import.meta.url),'utf8'))
 .replace("import { example } from '../example.mjs';",`const example = ${JSON.stringify(example,null,2)};`)
 .replaceAll('export function ','function ');
await writeFile(new URL('./editor.html',import.meta.url),`<!doctype html>
<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>Review board: coordinate editor</title>
<style>body{max-width:900px;margin:2rem auto;padding:1rem;font:16px/1.6 system-ui;color:#182529;background:#fff}label{display:grid;gap:.3rem}input[type=number]{width:7rem}button,input{font:inherit}button{cursor:pointer}.controls{display:flex;flex-wrap:wrap;align-items:end;gap:1rem;margin:1rem 0}.size-control{display:flex;align-items:center}.editor-surface{border:1px solid #52656c;margin:1rem 0}svg{display:block;width:100%;height:auto;touch-action:pan-y}.paper{fill:#f2f5f5;stroke:#182529;stroke-width:1.4}.ink{fill:none;stroke:#182529;stroke-width:1.4}.mark{fill:#182529;stroke:#fff;stroke-width:1}text{fill:#182529;font:13px monospace}output{display:block}h1{line-height:1.2}</style>
<h1>Coordinates in a zoomable editor</h1><p>Review stays an 80 × 40 local rectangle. The controls change the world-to-view mapping. Move or tap in the SVG for the current client-to-card conversion. Angles use degrees; the angle control turns about the world origin, while the centre button resets and turns about V (400, 300).</p>
${html}<script type="module">${source}\ninstallEditor(document.querySelector('[data-coordinate-editor]'));<\/script></html>`);
console.log('Wrote self-contained editor.html from BrowserFigure markup and browser.mjs; canonical example embedded from shared module.');
