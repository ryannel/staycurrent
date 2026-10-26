import test from 'node:test';import assert from 'node:assert/strict';
import {raceInitial,raceStep,runRace,racePresets,outboxInitial,outboxStep,guardedFill,initialiseGuard} from './invalidation.mjs';
test('post-commit deletion permits a stale refill; earlier deletion has a different race',()=>{
 for(const name of ['refill','early']){const p=racePresets[name],s=runRace(p.order,false,p.schedule);assert.equal(s.source,15);assert.equal(s.cache,12);assert.equal(s.held,12);}
 const p=racePresets.serial;assert.equal(runRace(p.order,false,p.schedule).cache,15);
});
test('generation validation rejects every old fill scheduled after invalidation',()=>{
 function interleave(r,w,p=[]){if(!r&&!w)return [p];return [...(r?interleave(r-1,w,[...p,'reader']):[]),...(w?interleave(r,w-1,[...p,'writer']):[])];}
 const schedules=interleave(3,2);assert.equal(schedules.length,10);
 for(const schedule of schedules){let s=raceInitial('after',true);for(const actor of schedule){s=raceStep(s,actor);if(s.writer===2)assert.notEqual(s.cache,12);}}
 const s=runRace('after',true,racePresets.refill.schedule);assert.equal(s.cache,null);assert.equal(s.held,12);assert.match(s.message,/Reject/);
});
test('missing guard fails closed and fresh initialisation cannot revive an older loader',()=>{
 let s={guard:null,value:12};assert.equal(guardedFill(s,'g1',10).value,12);s=initialiseGuard(s,'g3');assert.equal(s.value,null);assert.deepEqual(guardedFill(s,'g1',12),s);assert.equal(guardedFill(s,'g3',15).value,15);
});
test('outbox survives the process crash, while an unrecorded obligation is lost',()=>{
 let a=outboxInitial(false),b=outboxInitial(true);for(const action of ['commit','crash','restart','deliver','read']){a=outboxStep(a,action);b=outboxStep(b,action);}
 assert.equal(a.cache,12);assert.equal(a.pending,false);assert.equal(b.cache,15);assert.equal(b.reads,1);
 b=outboxStep(b,'duplicate');assert.equal(b.cache,null);b=outboxStep(b,'read');assert.equal(b.cache,15);assert.equal(b.reads,2);
});
