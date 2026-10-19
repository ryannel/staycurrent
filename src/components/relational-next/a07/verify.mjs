import assert from 'node:assert/strict';
import { capacity, capacityHours, copyState, incidents, copySteps, readingDelay } from './models.mjs';
for (const rate of [4,12]) for (const hours of capacityHours) {
  const state=capacity(rate,hours);
  assert.equal(state.free+rate*hours,96);
  if(state.free>state.reserve) assert.equal(state.free-rate*state.hoursToReserve,state.reserve);
}
assert.equal(capacity(4,0).hoursToReserve,16);
assert.equal(capacity(12,0).hoursToReserve,64/12);
assert.equal(capacity(12,0).act,true);
assert.equal(capacity(12,6).free,24);
assert.equal(copyState('local',1).acknowledged,true);
assert.equal(copyState('standby',1).acknowledged,false);
assert.equal(copyState('standby',2).acknowledged,true);
assert.equal(copyState('standby',2).readable,'No order 103');
assert.equal(copyState('standby',3).readable,'Order 103 visible');
for (const wait of ['local','standby']) assert.equal(copyState(wait,5).readable,'103 deleted');
assert.equal(copySteps.length,6);assert.equal(incidents.length,7);
for(const step of incidents) assert.ok(readingDelay([step.note,...step.overload,...step.deletion].join(' '))>18000);
console.log('a07: capacity arithmetic, acknowledgement/replay boundaries, deletion propagation and reading delays passed. No server fault, failover or restore test claimed.');
