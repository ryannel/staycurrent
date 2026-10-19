import assert from 'node:assert/strict';
import fs from 'node:fs';
import { specs, frame, holdMilliseconds } from './model.mjs';
for(const [scene,spec] of Object.entries(specs))for(const [choice] of spec.options){
 for(let s=0;s<spec.steps.length;s++){
  const f=frame(scene,choice,s);
  assert.ok(f.cards.length>=2&&f.cards.every(c=>c.name&&c.role));
  assert.equal(f.marks.filter(m=>m.on).length,s+1);
  const visible=[spec.title,spec.label,...spec.options.map(x=>x[1]),f.route,...f.cards.flatMap(c=>[c.name,c.role,...c.rows,c.log]),...f.marks.map(m=>m.label),f.result,f.outcome,f.note,'Play Back Next Reset Step 1 / 7'].join(' ');
  assert.ok(holdMilliseconds(visible)>=visible.trim().split(/\s+/).length/3.3*1000+1500);
 }
}
assert.match(frame('stream','on',5).result,/success/);
assert.equal(frame('stream','on',5).cards[1].rows.length,1);
assert.match(frame('stream','remote_apply',5).result,/waiting/);
assert.equal(frame('stream','remote_apply',6).cards[1].rows.length,2);
assert.equal(frame('promotion','fenced',2).result,'Exclusion confirmed; promotion pending');
assert.equal(frame('promotion','reachable',4).cards[1].rows.some(r=>r.includes('105')),false);
assert.match(frame('promotion','reachable',4).outcome,/A accepted 104/);
assert.doesNotMatch(frame('promotion','reachable',4).outcome,/105/);
assert.match(frame('promotion','reachable',5).outcome,/B: 105/);
assert.match(frame('promotion','reachable',5).result,/Two/);
assert.match(frame('promotion','reachable',5).cards[0].rows.join(' '),/104/);
assert.match(frame('promotion','fenced',5).cards[0].role,/Stopped/);
assert.match(frame('partitions','late',1).result,/Rejected/);
assert.equal(frame('partitions','correction',3).cards[0].rows.length,0);
assert.match(frame('partitions','correction',4).cards[0].role,/Detached/);
assert.match(frame('owners','report',2).route,/A \+ B/);
assert.match(frame('owners','transfer',3).note,/do not become one transaction/);
const evidence=JSON.parse(fs.readFileSync(new URL('../../../../docs/article-work/relational-writing-2026-10-19/nodes/a38/native-evidence-2.json',import.meta.url)));
const result=name=>evidence.records.find(r=>r.result===name);
assert.equal(result('remote-flush-before-visibility').standby,'101');
assert.equal(result('remote-apply-waits').wait_event,'SyncRep');
assert.deepEqual(result('unplanned-writer-loss').lost_acknowledged,[201]);
assert.equal(result('former-member-replaced').subsequent_order_replayed,109);
assert.equal(result('partition-lifecycle').correction_after,'events_nov');
assert.equal(result('partition-lifecycle').detached_rows,'1');
assert.match(evidence.cleanup,/all own clusters stopped/);
console.log('a38: all model variants, acknowledgement/visibility boundaries, authority failure, partition routing, ownership scope, whole-figure reading delays and native evidence assertions passed.');
