import assert from 'node:assert/strict';
import { kinds, frame } from './model.mjs';
let checked = 0;
for (const [kind, config] of Object.entries(kinds)) {
 for (const [choice] of config.options) for (let step=0;step<4;step++) {
  const f = frame(kind,choice,step);
  assert.equal(f.cards.length,2);
  assert.ok(f.title && f.result && f.note);
  assert.deepEqual(f,frame(kind,choice,step));
  checked++;
 }
}
assert.match(frame('snapshot','snapshot',3).result,/4 Elm/);
assert.match(frame('snapshot','live',3).result,/9 Oak/);
assert.equal(frame('changes','states',1).cards[1].lines.length,1);
assert.equal(frame('changes','states',3).cards[1].lines.length,3);
assert.match(frame('periods','adjacent',1).result,/1 version — €22/);
assert.match(frame('periods','overlap',1).result,/2 versions/);
assert.match(frame('periods','gap',1).result,/0 versions/);
assert.match(frame('correction','then',3).result,/€20/);
assert.match(frame('correction','now',3).result,/€22/);
assert.deepEqual(frame('correction','then',3).cards[0].lines,['€20: 1 Nov onwards']);
assert.match(frame('correction','then',3).cards[1].lines.join(' '),/Selected: old assertion/);
assert.deepEqual(frame('correction','now',3).cards[0].lines,['€20: 1 Nov ≤ date < 10 Nov','€22: 10 Nov onwards']);
assert.match(frame('correction','now',3).cards[1].lines.join(' '),/Selected: replacement/);
assert.match(frame('removal','delete',1).result,/RESTRICT/);
assert.match(frame('removal','archive',2).result,/still finds C7/);
assert.match(frame('removal','tombstone',3).result,/C7 itself must never be reused/);
console.log(`PASS: ${checked} deterministic states; boundary, rejected-action, correction and removal outcomes verified.`);
