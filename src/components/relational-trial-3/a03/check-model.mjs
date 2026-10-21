import assert from 'node:assert/strict';
import {scenes, classes, customers, reservations, instructors} from './model.mjs';
assert.deepEqual(customers,[[1,'Mina Shah'],[2,'Tariq Aziz'],[3,'Edda Berg']]);
assert.deepEqual(classes,[[21,'Tea tasting',1,1],[22,'Mug painting',3,2]]);
assert.deepEqual(reservations,[['R7',22,2]]);
assert.deepEqual(instructors,[[21,'Lena',true],[21,'Ravi',true]]);
for(const [name,scene] of Object.entries(scenes))for(const [option] of scene.options){
 const frames=scene.steps(option);
 assert.ok(frames.length>=4);
 for(const frame of frames)assert.ok(frame.explanation);
 if(name==='atomicity') {
  assert.ok(frames.slice(1).every(frame=>frame.a==='R10 committed'));
  assert.ok(frames[2].b.includes('R11 not yet inserted'));
  assert.ok(frames[3].b.startsWith('R11 rejected;'));
 }
 const last=frames.at(-1);
 if(name==='staffing')assert.equal(last.available.filter(Boolean).length,option==='repeatable'?0:1);
 else {
  const capacity=name==='atomicity'?3:1;
  assert.equal(last.remaining+last.bookings.length===capacity,['together','guarded'].includes(option));
  for(const request of last.bookings)assert.ok(['R7','R8','R9','R10'].includes(request));
 }
}
console.log('Canonical rows and all six model outcomes pass. Unsafe options fail the invariant; protected options preserve it.');
