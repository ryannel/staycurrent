import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {example} from '../../../../src/components/coordinate-trial/example.mjs';
const root=new URL('../../../../',import.meta.url);
const read=path=>readFile(new URL(path,root),'utf8');
const html=await read('src/components/coordinate-trial/a00/editor.html');
const browser=(await read('src/components/coordinate-trial/a00/browser.mjs'))
 .replace("import { example } from '../example.mjs';",`const example = ${JSON.stringify(example,null,2)};`)
 .replaceAll('export function ','function ');
const figure=await read('src/components/coordinate-trial/a00/BrowserFigure.astro');
const markup=figure.slice(figure.indexOf('<div data-coordinate-editor>'),figure.indexOf('</Figure>'));
assert.ok(html.includes(browser),'download embeds current browser implementation and canonical example');
assert.ok(html.includes(markup),'download embeds current live SVG and control markup');
assert.ok(!html.includes("import { example } from"),'no shared-module import needed by standalone download');
const served=await read('dist/_astro/editor.qIdBwy6S.html');
assert.equal(served,html,'observed r05/r06 browser asset exactly matches current standalone source');
const sha=s=>createHash('sha256').update(s).digest('hex');
console.log(JSON.stringify({utc:new Date().toISOString(),checks:4,kind:'download freshness and served-asset applicability; not browser execution',asset:'/_astro/editor.qIdBwy6S.html',sha256:sha(html)},null,2));
