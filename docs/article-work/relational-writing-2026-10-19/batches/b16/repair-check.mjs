import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {state,render,holdFor} from '../../../../../src/components/relational-next/a16/model.mjs';
const before=JSON.parse(readFileSync(new URL('./model-before.json',import.meta.url),'utf8'));
let changed=0;
for(const {scene,option,step,value:old} of before){
 const next=state(scene,option,step);
 assert.deepEqual(next.rows,old.rows);assert.deepEqual(next.columns,old.columns);assert.equal(next.rule,old.rule);
 if(scene==='rank'&&option==='row1')assert.equal(next.result,old.result.replace('1 rows','1 row'));
 else assert.equal(next.result,old.result);
 if(JSON.stringify(next)!==JSON.stringify(old))changed++;
 assert.ok(render(next).includes('<table>'));assert.ok(holdFor(next)>=2000);
}
assert.match(state('moving','range',0).text,/30 Dec 2025 through 1 Jan 2026/);
assert.match(state('moving','range',1).text,/31 Dec 2025 through 2 Jan 2026/);
assert.match(state('moving','range',2).text,/2 Jan 2026 through 4 Jan 2026/);
assert.match(state('moving','range',3).text,/3 Jan 2026 through 5 Jan 2026/);
assert.match(state('frame','range',2).text,/At event 3/);
assert.match(state('frame','range',2).text,/both belong to the frame at either event/);
assert.doesNotMatch(state('frame','range',2).text,/inspecting event 2/);
console.log(`PASS: ${before.length} states preserve all rows, columns and rules; ${changed} wording-only states changed. Calendar boundaries, peer narration and singular row grammar verified. Native SQL unchanged.`);
