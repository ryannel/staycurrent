import assert from 'node:assert/strict';
import fs from 'node:fs';
const before=fs.readFileSync(new URL('./SecurityFigure-before-repair.astro',import.meta.url),'utf8');
const after=fs.readFileSync(new URL('../../../../../src/components/relational-next/a35/SecurityFigure.astro',import.meta.url),'utf8');
const line=s=>s.split('\n').find(x=>x.includes("explanation.textContent")&&x.includes("The client needs a route"));
assert.ok(line(before));assert.ok(line(after));assert.equal(after.replace(line(after),line(before)),before);
console.log('Only admission explanation assignment changed; all panels, gates, other scenes, styles and controls remain byte-identical.');
