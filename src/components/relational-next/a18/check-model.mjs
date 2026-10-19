import assert from 'node:assert/strict';
import {scenes,frames} from './model.mjs';
let count=0;
for(const [name,def] of Object.entries(scenes)){
 for(const [choice] of def.options){
  const steps=frames(name,choice);
  assert.ok(steps.length>=3);
  for(const step of steps){
   count++;
   assert.equal(step.panels.length,3);
   for(const p of step.panels)assert.ok(p.name&&p.state&&p.detail);
   assert.ok(step.title&&step.result&&step.note);
  }
 }
}
assert.equal(frames('coverage','rows')[1].title,'A runs its locking read');
assert.equal(frames('coverage','rows')[1].panels[0].state,'No rows locked');
assert.equal(frames('coverage','rows')[2].panels[1].state,'No rows locked');
assert.equal(frames('coverage','resource')[1].panels[0].state,'Lock acquired');
assert.equal(frames('coverage','resource')[2].panels[1].state,'Waiting');
assert.match(frames('coverage','rows').at(-1).panels[2].state,/2 of 1/);
assert.match(frames('coverage','resource').at(-1).panels[2].state,/1 of 1/);
assert.match(frames('visibility','same')[2].panels[1].detail,/count 0/);
assert.match(frames('visibility','separate')[3].panels[1].detail,/counts 1/);
assert.match(frames('modes','reference')[1].panels[1].state,/Waits/);
assert.match(frames('modes','read')[1].panels[1].state,/without waiting/);
assert.match(frames('order','opposite')[1].panels[2].state,/Cycle/);
assert.match(frames('order','ordered')[1].panels[2].state,/One-way/);
assert.match(frames('waiting','skip')[1].result,/Empty/);
assert.match(frames('waiting','skip')[1].note,/still exists/);
assert.match(frames('waiting','wait')[1].result,/55P03/);
assert.match(frames('waiting','nowait')[1].result,/55P03/);
console.log(JSON.stringify({pass:true,states:count,branches:Object.values(scenes).reduce((n,s)=>n+s.options.length,0),checks:'All fields plus distinct count, visibility, compatibility, cycle and policy outcomes.'}));
