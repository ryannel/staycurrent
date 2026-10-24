import assert from 'node:assert/strict';
import {models,snapshotState,dutyState} from './model.mjs';
// Compare the model's visible outcomes with the schedules checked on native PG.
assert.equal(models.snapshots.steps,4);
for(const mode of ['rc','rr']){
 for(let step=0;step<4;step++)assert.ok(models.snapshots.explain(mode,step));
 const s=snapshotState(mode,3);assert.equal(s.committed,0);assert.ok(s.first&&s.second);
 assert.equal(s.secondOld,mode==='rr');
}
assert.equal(models.skew.steps,6);
for(const mode of ['rr','serial']){
 for(let step=0;step<6;step++)assert.ok(models.skew.explain(mode,step));
 const s=dutyState(mode,5);assert.equal(s.ada,false);assert.equal(s.tomas,mode==='serial');
 assert.equal(Number(s.ada)+Number(s.tomas),mode==='rr'?0:1);
 assert.equal(s.retry,mode==='serial');
}
assert.equal(dutyState('serial',3).retry,false);
assert.equal(dutyState('serial',4).retry,true);
console.log('Figure model outcomes and explanation coverage passed.');
