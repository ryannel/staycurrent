import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {scenes,observations,readingMilliseconds} from './model.mjs';
const root=new URL('../../../../',import.meta.url);
const raw=JSON.parse(await readFile(new URL('docs/article-work/relational-writing-2026-10-19/nodes/a28/evidence/raw-results.json',root)));
assert.equal(raw.runs.length,14);assert.equal(raw.dropped,true);
for(const run of raw.runs){
 const m=run.summary;assert.equal(m.failures,0);assert.equal(m.rejected,0);assert.equal(m.totalCompleted,m.offered);assert.equal(m.revision,m.classes.update.count);
 assert.equal(m.completedWithinOffer+m.outstandingAt2s,m.offered);
 for(const j of run.records){assert(j.success);assert(j.intended<=j.offered+2);assert(j.offered<=j.queued);assert(j.queued<=j.admitted);assert(j.admitted<=j.dbStart);assert(j.dbStart<=j.end);}
 for(const kind of ['update','report']){const jobs=run.records.filter(j=>j.kind===kind);const sorted=jobs.map(j=>j.end-j.intended).sort((a,b)=>a-b);assert.equal(m.classes[kind].p95,sorted[Math.ceil(sorted.length*.95)-1]);}
}
for(const saved of observations){
 const original=raw.runs.find(r=>r.summary.label==='sweep'&&r.summary.phase===saved.summary.phase&&r.summary.limit===saved.summary.limit&&r.summary.rate===saved.summary.rate);assert.deepEqual(saved.summary,original.summary);
 for(const s of saved.snapshots){assert.equal(s.offered,original.records.filter(j=>j.offered<=s.t).length);assert.equal(s.completed,original.records.filter(j=>j.success&&j.end<=s.t).length);assert.equal(s.offered-s.completed,s.queue+s.active+s.preparing);}
}
for(const [name,model] of Object.entries(scenes))for(let v=0;v<model.choices.length;v++){
 const steps=model.steps(v);assert(steps.length>=2);
 for(const s of steps){assert(s.title&&s.note);for(const p of s.panels||[s]){assert(p.lanes.length);assert.equal(p.metrics.length,3);}}
 if(name==='boundary')for(const s of steps)assert.equal(s.segments.reduce((a,b)=>a+b,0),100);
 if(name==='arrivals')for(const s of steps)assert.equal(s.metrics[0].value-s.metrics[1].value,s.metrics[2].value);
}
assert(readingMilliseconds('word '.repeat(200))>67000);
console.log('a28 model, native evidence, snapshot and accounting checks passed');
