import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {frames} from '../../../../../src/components/relational-next/a18/model.mjs';
const before=JSON.parse(readFileSync(new URL('./a18-model-before.json',import.meta.url),'utf8'));
let count=0;
for(const{name,choice,values}of before){
 const next=structuredClone(frames(name,choice));const old=structuredClone(values);count+=next.length;
 if(name==='coverage'&&choice==='rows'){
  assert.equal(next[1].title,'A runs its locking read');assert.equal(next[1].panels[0].state,'No rows locked');assert.equal(next[2].panels[1].state,'No rows locked');
  delete next[1].title;delete old[1].title;delete next[1].panels[0].state;delete old[1].panels[0].state;delete next[2].panels[1].state;delete old[2].panels[1].state;
 }
 assert.deepEqual(next,old);
}
assert.equal(frames('coverage','resource')[1].panels[0].state,'Lock acquired');assert.equal(frames('coverage','resource')[2].panels[1].state,'Waiting');
console.log(`PASS: ${count} states preserve every field except three corrected empty-read labels. Stable-row lock acquisition and wait states retained. Native SQL unchanged.`);
