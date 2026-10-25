import assert from 'node:assert/strict';
import fs from 'node:fs';
import {rows,frame,keyTrace,byTime} from '../src/components/relational-rebuild-indexes/model.mjs';
const native=JSON.parse(fs.readFileSync(new URL('./native-comparison.json',import.meta.url)));
const projection=native.find(x=>x.projection).projection;
for(const r of rows){
 const p=projection.find(x=>x.order_id===r.id);
 assert(p,`native projection lacks ${r.id}`);
 assert.equal(r.c,p.customer_id);assert.equal(r.date,p.placed_at.slice(0,10));assert.equal(r.status,p.status);
}
const correct=rows.filter(r=>r.c===1001&&r.date>='2026-10-01').sort(byTime).slice(0,2).map(r=>r.id);
assert.deepEqual(correct,[100003,100042]);
const cases=[];
for(const [variant,entries,fetches] of [['customer',4,4],['history',2,2],['time',6,2]]){
 const t=keyTrace(variant);assert.equal(t.visited.length,entries);assert.equal(t.fetched.length,fetches);assert.deepEqual(t.result.map(r=>r.id),correct);
 for(let step=0;step<4;step++) assert(frame('keys',step,{variant}).explanation);
 cases.push({kind:'keys',variant,entries,fetches,result:correct});
}
for(const layout of ['scattered','grouped'])for(const maximum of ['1001','1002','1003']){
 const result=frame('locality',3,{layout,maximum});
 const matchCount=rows.filter(r=>r.c<=Number(maximum)).length;
 const pages=layout==='scattered'?4:Math.ceil(matchCount/3);
 assert(result.explanation.includes(`the ${pages} matching pages`));
 cases.push({kind:'locality',layout,maximum,matches:matchCount,pages});
}
for(const variant of ['key','include','partial'])for(const visibility of ['confirmed','check']){
 const result=frame('cover',3,{variant,visibility});
 const numbers=[...result.scene.matchAll(/<strong>(\d+)<\/strong>/g)].map(x=>Number(x[1]));
 const entries=variant==='partial'?1:3;
 const fetches=variant==='key'||visibility==='check'?entries:0;
 assert.deepEqual(numbers,[entries,fetches,1]);
 cases.push({kind:'cover',variant,visibility,entries,fetches,result:[100012]});
}
const groups=new Map();for(const d of native.filter(x=>x.label?.includes(':'))){const parameter=d.label.split(':').slice(1).join(':');const result=JSON.stringify(d.result);if(groups.has(parameter))assert.equal(result,groups.get(parameter));else groups.set(parameter,result);}
assert.equal(groups.size,8);
const day=native.filter(x=>['direct-utc-range','transformed-utc-day','expression-utc-day'].includes(x.label));assert.equal(day.length,3);day.forEach(x=>assert.deepEqual(x.result,day[0].result));
const report={passed:true,selectedRowsCrossChecked:rows.length,modelCases:cases,historyEquivalentParameterGroups:groups.size,dayEquivalentQueries:3};
fs.writeFileSync(new URL('./model-check-results.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({passed:true,selectedRows:rows.length,modelCases:cases.length,equivalentGroups:groups.size,dayRows:day[0].result.length}));
