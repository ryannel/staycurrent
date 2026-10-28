import assert from 'node:assert/strict';
import { stateAt, starts, duration } from './model.mjs';
import { scene } from './scene.mjs';

// Same workload, same answers; the cache avoids four reads and four builds.
for (const [cached, expected] of [[false,[5,5,5]],[true,[1,1,5]]]) {
  const s=stateAt(duration/1000,cached);
  assert.deepEqual([s.reads,s.builds,s.answers],expected);
}
// Cache starts empty and is filled only after the first source read and build.
assert.equal(stateAt(starts[0]+.5,true).saved,false);
assert.equal(stateAt(starts[0]+1.49,true).reads,0);
assert.equal(stateAt(starts[0]+2.64,true).builds,0);
assert.equal(stateAt(starts[0]+3.09,true).saved,false);
assert.equal(stateAt(starts[0]+3.1,true).saved,true);
for(let i=1;i<starts.length;i++) {
  const hit=stateAt(starts[i]+1.7,true), rebuilding=stateAt(starts[i]+1.7,false);
  assert.equal(hit.answers,i+1);
  assert.equal(rebuilding.answers,i);
  assert.deepEqual([hit.reads,hit.builds,hit.saved],[1,1,true]);
}
for(let i=0;i<=440;i++) {
  const t=i/440;
  assert(!/NaN|undefined|Infinity/.test(scene.render(t)));
  for(const cached of [false,true]) {
    const s=stateAt(t*duration/1000,cached);
    assert(s.reads>=s.builds);
    assert(s.answers<=5);
    if(cached&&s.answers>1)assert(s.saved);
  }
}
console.log('Cache-aside sequence and 441 rendered frames pass.');
