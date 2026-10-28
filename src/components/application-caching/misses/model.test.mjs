import test from 'node:test';
import assert from 'node:assert/strict';
import { burstTrace, admissionTrace } from './model.mjs';

test('a slower fill exposes the same arrivals to more independent misses', () => {
 const fast = burstTrace({ duration: 40 });
 const slow = burstTrace({ duration: 100 });
 assert.equal(fast.at(-1).started, 2);
 assert.equal(slow.at(-1).started, 4);
 assert.equal(Math.max(...fast.map(s => s.active)), 2);
 assert.equal(Math.max(...slow.map(s => s.active)), 4);
 assert.deepEqual(slow.at(-1).loaders.map(l => l.end), [100,120,140,160]);
 assert.equal(fast.at(-1).callers.filter(c => c.state === 'Cache hit').length, 2);
});

test('sharing removes duplicate work but retains the waiting callers', () => {
 const shared = burstTrace({ shared: true, duration: 100 });
 assert.equal(shared.at(-1).started, 1);
 assert.equal(shared.at(-1).answered, 4);
 assert.equal(shared.at(-1).time, 100);
 assert.equal(Math.max(...shared.map(s => s.waiting)), 4);
 assert.equal(shared.find(s => s.time === 60).active, 1);
 assert.equal(burstTrace({ shared: true, duration: 40 }).at(-1).started, 1);
});

test('a completed fill does not erase independent work already running', () => {
 const atFirstFill = burstTrace().find(s => s.time === 100);
 assert.equal(atFirstFill.answered, 1);
 assert.equal(atFirstFill.active, 3);
 assert.equal(atFirstFill.waiting, 3);
});

test('distinct misses respect both execution and queue bounds', () => {
 for (const duration of [100,200]) {
  const trace = admissionTrace({ duration });
  assert.ok(trace.every(s => s.active <= 2 && s.queued <= 2));
  assert.equal(trace.at(-1).started, 2);
  assert.equal(trace.at(-1).active, 0);
  assert.equal(trace.at(-1).jobs.filter(j => j.state === 'Rejected').length, 2);
 }
 const fast = admissionTrace().at(-1);
 assert.equal(fast.answered, 2);
 assert.equal(fast.rejected, 4);
});

test('caller deadlines leave running source work accounted until settlement', () => {
 const slow = admissionTrace({ duration: 200 });
 const deadline = slow.find(s => s.time === 150);
 assert.equal(deadline.active, 2);
 assert.equal(deadline.queued, 0);
 assert.equal(deadline.answered, 0);
 assert.equal(slow.at(-1).time, 200);
 assert.equal(slow.at(-1).answered, 0);
 assert.equal(slow.at(-1).jobs.filter(j => j.state === 'Late completion').length, 2);
});
