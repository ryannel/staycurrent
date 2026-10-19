import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {frame} from '../../../../../src/components/relational-next/a38/model.mjs';
const old=JSON.parse(readFileSync(new URL('./model-before.json',import.meta.url),'utf8'));
let changed=0;
for(const {scene,choice,step,value}of old){
 const next=frame(scene,choice,step);
 if(scene==='promotion'&&choice==='fenced'&&step===2){assert.equal(next.result,'Exclusion confirmed; promotion pending');const {result:a,...left}=next;const {result:b,...right}=value;assert.deepEqual(left,right);changed++;}
 else if(scene==='promotion'&&choice==='reachable'&&step===4){assert.equal(next.cards[1].rows.some(r=>r.includes('105')),false);assert.match(next.outcome,/A accepted 104/);assert.doesNotMatch(next.outcome,/105/);const {outcome:a,...left}=next;const {outcome:b,...right}=value;assert.deepEqual(left,right);changed++;}
 else assert.deepEqual(next,value);
}
assert.equal(changed,2);assert.match(frame('promotion','reachable',5).outcome,/A: 104 · B: 105/);
console.log(`PASS: ${old.length} states compared; only two intermediate promotion text fields changed. Cards, routing, native claims and all other model outputs preserved.`);
