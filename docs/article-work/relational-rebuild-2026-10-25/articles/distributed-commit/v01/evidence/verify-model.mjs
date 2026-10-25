import assert from 'node:assert/strict';
import {purchase,commitPaths,recoveryPaths} from '../src/components/relational-rebuild-distributed-commit/model.mjs';

// Exhaustive finite safety model, not a cluster simulation or implementation.
// Message loss/delay and process stops remove opportunities to take a transition;
// they do not destroy the durable state represented here.
const initial={participants:['working','working'],decision:null};
const key=s=>JSON.stringify(s);
const next=s=>{
  const edges=[];
  const participant=(i,value,action)=>{const n=structuredClone(s);n.participants[i]=value;edges.push({action,state:n});};
  s.participants.forEach((p,i)=>{
    if(p==='working' && s.decision===null) {
      participant(i,'prepared',`${i} prepares durably`);
      participant(i,'abort',`${i} refuses before promising`);
    }
    if(p==='prepared' && s.decision==='commit')participant(i,'commit',`${i} learns COMMIT`);
    if(['prepared','working'].includes(p) && s.decision==='abort')participant(i,'abort',`${i} learns ABORT`);
  });
  if(s.decision===null){
    edges.push({action:'Record ABORT',state:{...structuredClone(s),decision:'abort'}});
    if(s.participants.every(p=>p==='prepared'))edges.push({action:'Record COMMIT',state:{...structuredClone(s),decision:'commit'}});
  }
  return edges;
};
const seen=new Set();const queue=[initial];let transitions=0;
while(queue.length){
  const s=queue.shift();if(seen.has(key(s)))continue;seen.add(key(s));
  assert(!(s.participants.includes('commit')&&s.participants.includes('abort')));
  if(s.decision==='commit')assert(s.participants.every(p=>['prepared','commit'].includes(p)));
  for(const e of next(s)){
    transitions++;
    s.participants.forEach((p,i)=>{if(['commit','abort'].includes(p))assert.equal(e.state.participants[i],p);});
    if(s.decision)assert.equal(e.state.decision,s.decision);
    queue.push(e.state);
  }
}
const timeoutCounterexample=[
  'A and P prepare; coordinator durably records COMMIT',
  'A learns COMMIT; P has not learnt it',
  'Unsafe extra rule: P times out and aborts',
  'A = COMMIT, P = ABORT: agreement violated'
];
const notifyFirstCounterexample=[
  'A and P prepare; coordinator has no durable decision',
  'Unsafe extra rule: coordinator tells A COMMIT before recording',
  'Coordinator crashes; recovery sees no final record and chooses ABORT',
  'P learns ABORT: A = COMMIT, P = ABORT'
];
for(const stages of Object.values(commitPaths))for(const s of stages)assert(!(s.a==='COMMIT'&&s.p==='ABORT')&&!(s.a==='ABORT'&&s.p==='COMMIT'));
assert.equal(commitPaths.ready.at(-1).c,'COMMIT');
assert.equal(commitPaths.refuse.at(-1).c,'ABORT');
assert.equal(recoveryPaths.classic.steps.at(-1).p,'PREPARED');
assert.equal(recoveryPaths.replicated.steps.at(-1).p,'COMMIT');
assert.equal(recoveryPaths.unavailable.steps.at(-1).p,'PREPARED');
assert(recoveryPaths.unavailable.steps.every(s=>s.a==='PREPARED'&&s.p==='PREPARED'));
assert.equal(purchase.lines.reduce((v,l)=>v+l.quantity*Number(l.price),0),29);
assert.deepEqual(Object.fromEntries(purchase.lines.map(l=>[l.product,purchase.before[l.product]-l.quantity])),purchase.after);
console.log(JSON.stringify({kind:'Illustrative finite safety model; no engine observations',states:seen.size,transitions,checks:['No opposing participant outcomes','Final decisions immutable','Final participant states stable','Commit requires every participant prepared','Figure terminal states and purchase arithmetic'],timeoutCounterexample,notifyFirstCounterexample},null,2));
