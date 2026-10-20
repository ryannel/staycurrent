import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {scenes,holdMilliseconds} from '../../../../../../src/components/relational-next/a26/model.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../../../../../..');
const raw=JSON.parse(await readFile(new URL('./raw-results.json',import.meta.url),'utf8'));
assert.equal(raw.verified,true);assert.equal(raw.cleaned,true);
const nodes=n=>[n,...(n.Plans||[]).flatMap(nodes)];
const before=nodes(raw.captures.before_timed.Plan),after=nodes(raw.captures.after_timed.Plan);
assert.equal(before.find(n=>n['Relation Name']==='customers')['Plan Rows'],18);
assert.equal(after.find(n=>n['Relation Name']==='customers')['Plan Rows'],8000);
assert.equal(before.find(n=>n['Relation Name']==='order_lines')['Actual Loops'],80000);
assert.equal(raw.captures.before_timed.Plan['Shared Hit Blocks'],576098);
assert.equal(raw.captures.after_timed.Plan['Shared Hit Blocks'],2550);
assert.equal(scenes.estimates.steps(0)[0].counts[1],raw.captures.before_timed.Plan['Shared Hit Blocks']);
assert.equal(scenes.estimates.steps(1)[0].counts[1],raw.captures.after_timed.Plan['Shared Hit Blocks']);
for(const [v,key] of ['after_north','after_island','generic_north','generic_island'].entries()){
 const end=scenes.parameters.steps(v).at(-1);
 assert.equal(end.counts[1],raw.captures[key].Plan['Shared Hit Blocks']);
 assert.equal(end.counts[2],raw.captures[key]['Execution Time']);
 assert.ok(end.note.includes(`planning ${raw.captures[key]['Planning Time']} ms`));
}
let frames=0;
for(const s of Object.values(scenes))for(let v=0;v<s.choices.length;v++)for(const frame of s.steps(v)){
 assert.equal(frame.counts.length,s.metric.length);assert.ok(frame.title&&frame.note);
 for(const [label,value,unit]of frame.rows){assert.ok(label&&unit);assert.ok(Number.isFinite(value)&&value>=0);}
 assert.ok(holdMilliseconds(frame.note)>=8000);frames++;
}
assert.ok(holdMilliseconds('word '.repeat(200))>=63000);
for(const w of raw.workloads){assert.equal(w.completed,120);assert.equal(w.errors,0);assert.equal(w.summary.north.completed,16);assert.equal(w.summary.island.completed,4);for(const [p]of w.prepared){assert.equal(p.generic_plans,'0');assert.equal(p.custom_plans,'10');}}
const article=await readFile(resolve(root,'docs/article-work/relational-writing-2026-10-19/nodes/a26/article.astro'),'utf8');
const registry=JSON.parse(await readFile(resolve(root,'docs/article-work/relational-writing-2026-10-19/registry.json'),'utf8'));
const self=registry.find(n=>n.id==='a26');
for(const s of self.sections)assert.ok(article.includes(`id="${s.anchor}"`),s.anchor);
for(const [,link]of article.matchAll(/href="(\/review\/relational-next\/[^"#]*)(?:#[^"]*)?"/g))assert.ok(registry.some(n=>n.href===link),link);
const final=resolve(root,'src/articles/relational-next/a26.astro');
for(const [,link]of article.matchAll(/import \w+ from '([^']+)'/g))await access(resolve(dirname(final),link.replace(/\?.*$/,'')));
for(const path of ['docs/article-work/relational-writing-2026-10-19/nodes/a26/article.astro','src/components/relational-next/a26/PlanFigure.astro','src/components/relational-next/a26/model.mjs','docs/article-work/relational-writing-2026-10-19/nodes/a26/evidence/verify.mjs']){
 const text=await readFile(resolve(root,path),'utf8');assert.ok(!/[\t ]+$/m.test(text),`Trailing whitespace: ${path}`);
}
console.log(`a26: ${frames} figure frames; captured counters, parameters, workload outcomes, anchors, destinations, imports and whitespace passed`);
