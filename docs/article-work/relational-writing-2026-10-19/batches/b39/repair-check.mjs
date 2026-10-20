import assert from 'node:assert/strict';
import {scenes as before} from './models-before-repair.mjs';
import {scenes as after} from '../../../../../src/components/relational-next/a36/models.mjs';
let states=0, changed=0;
for(const [key,scene] of Object.entries(before)){
 for(let v=0;v<scene.choices.length;v++){
  const a=scene.steps(v), b=after[key].steps(v);assert.equal(a.length,b.length);
  for(let i=0;i<a.length;i++){
   states++;
   if(JSON.stringify(a[i])!==JSON.stringify(b[i]))changed++;
   const repaired=structuredClone(b[i]);
   if(key==='dashboard'){
    const metric=repaired.panels[0].rows.find(r=>r.label==='Intended-arrival p95');
    metric.value=metric.value.replace('operation deadline','target');
    if(v===1&&(i===1||i===2))repaired.note=a[i].note;
   }
   if(key==='alerts'&&v===1&&i===3)repaired.panels[1].rows.find(r=>r.label==='Deadline').value=a[i].panels[1].rows.find(r=>r.label==='Deadline').value;
   assert.deepEqual(repaired,a[i],`${key}/${v}/${i}`);
  }
 }
}
console.log(JSON.stringify({states,changed,unchangedNumericModels:true,allowedChanges:'dashboard p95 labels and two qualifications; telemetry-only final response deadline'}));
