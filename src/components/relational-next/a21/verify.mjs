import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {scenes, holdMilliseconds} from './models.mjs';

let frames=0;
for(const [name,model] of Object.entries(scenes)){
 for(const variant of [0,1]) for(const large of name==='multiply'?[false,true]:[false]) {
  const steps=model.steps(variant,large);
  assert.ok(steps.length>=3);
  for(const step of steps){
   assert.equal(step.count.length,3);
   assert.ok(step.count.every(n=>Number.isInteger(n)&&n>=0));
   assert.ok(step.title&&step.code&&step.note&&step.rows.length&&step.objects.length);
   assert.ok(holdMilliseconds(step)>=7500);
   frames++;
  }
 }
}
assert.deepEqual(scenes.lazy.steps(0).at(-1).count,[6,10,10]);
assert.deepEqual(scenes.lazy.steps(1).at(-1).count,[3,10,10]);
for(const n of [3,12]){
 const joined=scenes.multiply.steps(0,n===12), separate=scenes.multiply.steps(1,n===12);
 assert.equal(joined[1].rows.length,n*4);
 assert.deepEqual(joined.at(-1).count,[1,n*4,1+n+4]);
 assert.deepEqual(separate.at(-1).count,[3,1+n+4,1+n+4]);
 assert.equal(joined.at(-1).count[2],separate.at(-1).count[2]);
}
assert.deepEqual(scenes.page.steps(0).at(-1).count,[1,3,4]);
assert.deepEqual(scenes.page.steps(1).at(-1).count,[2,8,8]);
assert.deepEqual(scenes.stream.steps(0).at(-1).count,[1,300,100]);
assert.deepEqual(scenes.stream.steps(1).at(-1).count,[1,300,300]);
assert.equal(scenes.flush.steps(0).at(-1).count[0],3);
assert.equal(scenes.flush.steps(1).at(-1).count[0],2);
const native=JSON.parse(readFileSync(new URL('../../../../docs/article-work/relational-writing-2026-10-19/nodes/a21/evidence/native-results.json',import.meta.url),'utf8'));
assert.equal(native.status,'all assertions passed');
for(const [name,expected] of [['lazy_1',[3,4]],['lazy_3',[6,10]],['lazy_6',[10,29]],['joined',[1,6]],['batched',[3,10]],['projection',[1,6]],['joined_two_collections',[1,17]]]){
 assert.deepEqual([native.runs[name].statements,native.runs[name].returned_rows],expected);
}
assert.equal(native.runs.stream_discard.returned_rows,null);
assert.equal(native.runs.stream_discard.consumed_rows,1200);
console.log(`a21: ${frames} model states and native result invariants passed`);
