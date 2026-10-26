import test from 'node:test';
import assert from 'node:assert/strict';
import {failureFlow,failureDeadline,retryExpansion,breakerInitial,breakerStep} from './failures.mjs';
test('lost hits multiply source demand; all arrivals remain accounted for',()=>{
 for(const bounded of [false,true])for(const cold of [false,true])for(let time=0;time<=30;time++){
  const s=failureFlow({time,bounded,cold});assert.equal(s.totalArrivals,s.totalHits+s.totalDone+s.totalRejected+s.queued);
  assert.ok(s.history.every(r=>r.done<=100));if(bounded)assert.equal(s.queued,0);
 }
 const s=failureFlow({time:8});assert.equal(s.history[0].demand,50);assert.equal(s.history[2].demand,1000);assert.equal(s.history[7].percentage,0);assert.ok(s.queued>0);
});
test('recovery does not erase backlog; admission trades refusals for bounded work',()=>{
 const warm=failureFlow({time:8,cold:false}),cold=failureFlow({time:8,cold:true}),limited=failureFlow({time:8,bounded:true});
 assert.equal(warm.queued,4450);assert.equal(cold.queued,5400);assert.equal(limited.queued,0);assert.equal(limited.totalRejected,5400);
});
test('all sequential stages share a deadline and source must fit remaining budget',()=>{
 assert.equal(failureDeadline().sourceAllowed,true);assert.equal(failureDeadline({cacheWait:60,retry:true}).sourceAllowed,false);
 for(const retry of [true,false])for(let cacheWait=0;cacheWait<=300;cacheWait++){
  const s=failureDeadline({cacheWait,retry});assert.ok(s.elapsed<=200);assert.ok(s.remaining>=0);assert.equal(s.stages.reduce((sum,x)=>sum+x.duration,0),s.elapsed);
  for(let i=1;i<s.stages.length;i++)assert.equal(s.stages[i].start,s.stages[i-1].start+s.stages[i-1].duration);
 }
});
test('nested attempts multiply; one layer avoids hidden multiplication',()=>{
 for(let a=1;a<=3;a++)for(let b=1;b<=3;b++){const s=retryExpansion(a,b);assert.equal(s.branches.flat().length,a*b);assert.equal(s.leaves,a*b);}
 assert.equal(retryExpansion(3,3).leaves,9);assert.equal(retryExpansion(1,3).leaves,3);
});
test('open circuit bypasses and half-open permits one outstanding probe across bursts',()=>{
 let s=breakerStep(breakerInitial(),'burst','failure');assert.equal(s.attempts,5);assert.equal(s.mode,'open');
 s=breakerStep(s,'burst');assert.equal(s.attempts,5);assert.equal(s.rows.filter(r=>r.result==='source').length,2);
 s=breakerStep(s,'advance');s=breakerStep(s,'burst');assert.equal(s.attempts,6);assert.equal(s.probe,true);
 s=breakerStep(s,'burst');assert.equal(s.attempts,6);assert.equal(s.probe,true);
 s=breakerStep(s,'probe','failure');assert.equal(s.mode,'open');assert.equal(s.probe,false);
});
test('a successful miss closes the circuit but source admission remains bounded',()=>{
 let s=breakerStep(breakerInitial(),'burst','failure');s=breakerStep(s,'advance');s=breakerStep(s,'burst');s=breakerStep(s,'probe','miss');
 assert.equal(s.mode,'closed');assert.equal(s.rows.filter(r=>r.result==='source').length,2);assert.equal(s.rows.filter(r=>r.result==='rejected').length,3);
 s=breakerStep(s,'burst','miss');assert.equal(s.mode,'closed');assert.equal(s.rows.filter(r=>r.result==='source').length,2);
});
