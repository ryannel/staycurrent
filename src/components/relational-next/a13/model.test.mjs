import assert from 'node:assert/strict';
import {definitions,frame,renderFrame,holdFor,not,and,or,escapeHtml} from './model.mjs';
const truths=[true,false,null];
const conjunction=[[true,false,null],[false,false,false],[null,false,null]];
const disjunction=[[true,true,true],[true,false,null],[true,null,null]];
for(let i=0;i<3;i++)for(let j=0;j<3;j++){
 assert.equal(and(truths[i],truths[j]),conjunction[i][j]);
 assert.equal(or(truths[i],truths[j]),disjunction[i][j]);
}
assert.deepEqual(truths.map(not),[false,true,null]);
assert.deepEqual(frame('logic','positive').selected,[101]);
assert.deepEqual(frame('logic','negated').selected,[100,102,103]);
assert.deepEqual(frame('logic','review').selected,[101,106]);
assert.deepEqual(frame('logic','distinct').selected,[101,103,106]);
assert.equal(frame('defaults','106').payable,null);
assert.equal(frame('defaults','106').invented,0);
assert.equal(frame('defaults','102').payable,20);
assert.deepEqual(frame('text','exact').selected,['A']);
assert.deepEqual(frame('text','insensitive').selected,['A','B']);
assert.deepEqual(frame('text','unsafe').selected,['C','D']);
assert.deepEqual(frame('text','escaped').selected,['C']);
assert.deepEqual(frame('bounds','spring').selected,[202,203]);
assert.deepEqual(frame('bounds','autumn').selected,[202,203,205]);
assert.match(renderFrame(frame('calendar','spring')),/23/);
assert.match(renderFrame(frame('calendar','spring')),/13:00/);
assert.match(renderFrame(frame('calendar','autumn')),/25/);
assert.match(renderFrame(frame('calendar','autumn')),/11:00/);
assert.match(renderFrame(frame('arithmetic','division')),/2\.50/);
assert.match(renderFrame(frame('arithmetic','rounding')),/0\.02/);
assert.match(renderFrame(frame('arithmetic','overflow')),/ERROR/);
assert.equal(escapeHtml('<script>&"\''),'&lt;script&gt;&amp;&quot;&#39;');
let count=0;
for(const [scene,def] of Object.entries(definitions))for(const choice of def.options)for(let step=0;step<3;step++){
 const f=frame(scene,choice.value,step);const html=renderFrame(f);
 assert.ok(html.includes('<table>'));assert.ok(!/<h[1-6]/.test(html));
 assert.ok(Number.isFinite(holdFor(f))&&holdFor(f)>5000);
 if(step===2)assert.ok(!html.includes('next step'));
 count++;
}
console.log(`PASS: 18 truth-table operations, 3 negations, policy selections, default distinction, native-checked text and time IDs, arithmetic and calendar outputs; ${count} complete figure frames rendered with reading-time allowance.`);
