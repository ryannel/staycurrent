import test from 'node:test';import assert from 'node:assert/strict';
import {burstState,jitterDeadlines,jitterHistogram} from './stampedes.mjs';
test('coalescing changes duplicate work and queueing, preserving all callers',()=>{
 assert.equal(burstState().jobs,12);assert.equal(burstState().queued,8);
 assert.equal(burstState({mode:'local'}).jobs,3);assert.equal(burstState({mode:'shared'}).jobs,1);
 assert.equal(burstState({time:500}).completed,4);assert.equal(burstState({time:500,mode:'local'}).completed,12);
 for(const mode of ['none','local','shared'])for(const processes of [1,3,6]){
  const initial=burstState({mode,processes});const done=burstState({mode,processes,time:initial.end});assert.equal(done.completed,12);assert.equal(done.queued,0);assert.equal(done.active,0);
 }
});
test('shortening jitter preserves the maximum lifetime and all entries',()=>{
 assert.equal(jitterHistogram(0).at(-1).count,60);
 for(const spread of [0,5,10,20]){const deadlines=jitterDeadlines(spread);assert.equal(deadlines.length,60);assert.ok(deadlines.every(t=>t<=60&&t>=60-spread));assert.equal(jitterHistogram(spread).reduce((s,b)=>s+b.count,0),60);}
 assert.ok(Math.max(...jitterHistogram(20).map(b=>b.count))<60);
});
import {leaseState,refreshInitial,refreshPhase,refreshStep} from './stampedes.mjs';
test('lease expiry permits overlapping work; late owner cannot safely fill or release',()=>{
 assert.equal(leaseState(3).owner,'B');assert.match(leaseState(3).a,/loading/);assert.equal(leaseState(3).b,'Loading');
 assert.equal(leaseState(4,true).owner,'B');assert.equal(leaseState(4,true).cache,null);assert.equal(leaseState(5,true).cache,15);
 assert.equal(leaseState(4,false).owner,'None');assert.equal(leaseState(5,false).cache,12);
});
test('refresh coalesces and failures never renew the hard age limit',()=>{
 let s=refreshInitial();for(const a of ['advance','advance','read','read'])s=refreshStep(s,a);
 assert.equal(s.attempts,1);assert.equal(s.reply,'£12 at 10 s');s=refreshStep(s,'failure');assert.equal(s.cached.observed,0);
 s=refreshStep(s,'read');assert.equal(s.attempts,1);s=refreshStep(s,'advance');s=refreshStep(s,'advance');assert.equal(refreshPhase(s),'expired');
 s=refreshStep(s,'read');assert.equal(s.reply,'Waiting at 20 s');s=refreshStep(s,'failure');assert.equal(s.reply,'Unavailable at 20 s');
});
test('completed refresh retains source observation age; an over-age result is discarded',()=>{
 let s=refreshInitial();for(const a of ['advance','advance','read','advance','success'])s=refreshStep(s,a);
 assert.equal(s.cached.observed,10);assert.equal(s.now,15);assert.equal(s.cached.value,15);
 let late=refreshInitial();for(const a of ['advance','advance','read','advance','advance','advance','advance','success'])late=refreshStep(late,a);
 assert.equal(late.cached.observed,0);assert.match(late.message,/Discard/);
});
test('a waiter deadline does not cancel a shared source operation',()=>{
 let s=refreshInitial();for(const a of ['advance','advance','advance','advance','read','timeout'])s=refreshStep(s,a);
 assert.equal(s.waiting,false);assert.ok(s.refresh);assert.equal(s.reply,'Unavailable at 20 s');
});
