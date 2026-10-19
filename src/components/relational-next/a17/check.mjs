import assert from 'node:assert/strict';
import fs from 'node:fs';
import {definitions,frames,units} from './model.mjs';
let count=0;
for(const [scene,def] of Object.entries(definitions)){
 for(const [choice] of def.options){
  const all=frames(scene,choice);assert.equal(all.length,3);
  for(const [index,f] of all.entries()){
   assert.ok(f.title&&f.sql&&f.note);assert.equal(f.panels.length,2);
   for(const p of f.panels)for(const row of p.rows)assert.equal(row.length,p.columns.length);
   const meter=units(scene,choice,index);if(meter){assert.equal(meter.before,5);assert.ok(meter.after>=0&&meter.after<=10);if(index<2)assert.equal(meter.after,5);}
   count++;
  }
 }
}
const last=(s,c)=>frames(s,c).at(-1);
assert.deepEqual(last('target','whole').panels[1].rows,[['1 / 101','cancelled'],['1 / 102','open'],['1 / 105','cancelled'],['2 / 101','open']]);
assert.equal(last('target','order').panels[1].rows[3][1],'cancelled');
assert.equal(last('target','null').panels[1].rows[0][1],'open');
assert.equal(last('insert','null').panels[0].rows.length,0);
assert.deepEqual(last('guard','three').panels[1].rows,[['1 / P7','2']]);
assert.equal(last('guard','six').panels[1].rows.length,0);
assert.equal(last('guard','missing').panels[1].rows.length,0);
assert.equal(last('source','sum').panels[0].rows[0][1],'5 → 10');
assert.equal(last('delete','protected').panels[0].rows[1][1],'2');
assert.equal(last('delete','cascade').panels[0].rows[1][1],'0');
assert.equal(last('conflict','add').panels[0].rows[0][1],'10');
assert.equal(last('conflict','replace').panels[1].rows[0][0],'INSERT 0 1');
assert.equal(last('conflict','keep').panels[1].rows[0][0],'INSERT 0 0');
assert.equal(last('transaction','rollback').panels[1].rows[0][1],'3');
const native=JSON.parse(fs.readFileSync(new URL('../../../../docs/article-work/relational-writing-2026-10-19/nodes/a17/native-results.json',import.meta.url)));
assert.equal(native.cases.length,27);assert.ok(native.cases.every(x=>x.passed));
for(const [name,expected]of [['ambiguous-source-observation','1|P7|7'],['source-update','1|P7|10'],['guard','1|P7|2'],['rollback-sequence-gap','2\n3']])assert.ok(native.cases.find(x=>x.name===name).stdout.includes(expected));
console.log(`${count} figure frames checked across all options; consequential outcomes agree with 27 native cases`);
