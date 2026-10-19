import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {scenes,frames} from './model.mjs';
let checked=0;
for(const [scene,def] of Object.entries(scenes))for(const [choice] of def.options){
 const steps=frames(scene,choice);
 assert(steps.length>=3);
 for(const step of steps){
  assert.equal(step.panels.length,3);
  for(const text of [step.title,step.result,step.note,...step.panels.flatMap(p=>[p.name,p.state,p.detail])])assert.equal(typeof text,'string');
  checked++;
 }
}
const end=(scene,choice)=>frames(scene,choice).at(-1);
assert.equal(end('visibility','rc').panels[0].state,'remaining = 0');
assert.equal(end('visibility','rr').panels[0].state,'remaining = 1');
assert.equal(end('visibility','late').panels[0].state,'remaining = 0');
assert.match(end('locking','rr').panels[1].state,/New transaction/);
assert.equal(frames('locking','rr')[3].panels[1].state,'40001: abort');
assert.equal(frames('locking','guard')[3].panels[1].state,'0 returned rows');
assert.equal(end('locking','mysql').panels[1].state,'Ordinary read: 1');
assert.equal(end('staffing','rr').panels[2].state,'Mina × · Tariq ×');
assert.equal(end('staffing','serial').panels[2].state,'Mina × · Tariq ✓');
assert.equal(end('predicate','rr').panels[2].state,'2 bookings');
assert.equal(end('predicate','serial').panels[2].state,'1 booking');
assert.equal(end('ordering','serial').panels[1].state,'Suppose R reads 1');
assert.equal(end('ordering','strict').panels[1].state,'R reads 0');
const native=JSON.parse(readFileSync(new URL('../../../../docs/article-work/relational-writing-2026-10-19/nodes/a19/native-results.json',import.meta.url),'utf8'));
assert(native.pass&&native.cases.every(c=>c.pass));
for(const name of ['READ COMMITTED second read','REPEATABLE READ second read','BEGIN does not fix RR snapshot','REPEATABLE READ locking read outcome','READ COMMITTED guarded update outcome','SERIALIZABLE staffing commits','SERIALIZABLE predicate insert outcome','serial wrong query still breaks rule'])assert(native.cases.some(c=>c.name===name));
console.log(JSON.stringify({pass:true,model_states:checked,native_assertions:native.cases.length,scope:'Models are illustrative; PostgreSQL selected results checked separately; InnoDB and ordering are documentation/definition comparisons.'},null,2));
