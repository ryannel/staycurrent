import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {PGlite,protocol} from '@electric-sql/pglite';
import {choicesTutorials} from '../../../src/lib/sql-lessons/choices.ts';
async function run(db,sql){
 const parser=new protocol.Parser();const out={rows:[],errors:[],status:''};
 await db.execProtocolRawStream(protocol.serialize.query(sql),{onRawData:bytes=>parser.parse(bytes,m=>{
  if(m.name==='dataRow')out.rows.push(m.fields);
  if(m.name==='error')out.errors.push(m.code);
  if(m.name==='readyForQuery')out.status=m.status;
 })}); return out;
}
const report=[];
for(const lesson of choicesTutorials){
 const db=await PGlite.create();const steps=[];
 for(const step of lesson.steps){const r=await run(db,step.sql);assert.deepEqual(r.errors,step.expectedError?[step.expectedError]:[]);assert.equal(r.status,'I');steps.push(r);}
 const variations=[];
 if(lesson.id==='product-contract'){
  assert.deepEqual(steps[1].rows,[['2','18.01','36.02']]);
  assert.deepEqual(steps[3].rows,[['1','2','18.01','36.02']]);
  const v=await run(db,'UPDATE choice_lines SET unit_price=18.004 RETURNING unit_price,quantity*unit_price;');assert.deepEqual(v.rows,[['18.00','36.00']]);variations.push(v);
 }else if(lesson.id==='search-in-postgres'){
  assert.deepEqual(steps[1].rows,[['1','Blue mugs']]);assert(steps[2].rows[0][2].includes('ceram'));
  assert.deepEqual(steps[3].rows,[['1','Blue ceramic cup']]);
  const v=await run(db,"SELECT product_id FROM choice_products WHERE terms @@ plainto_tsquery('english','blu cup')");assert.equal(v.rows.length,0);variations.push(v);
 }else{
  assert.deepEqual(steps[1].rows,[['1','Blue mug','1']]);assert.equal(steps[2].rows.length,0);
  assert.deepEqual(steps[3].rows,[['1','2','Blue mug','f']]);assert.deepEqual(steps[4].rows,steps[3].rows);
  const v=await run(db,lesson.steps[4].sql.replace("(1,1,'Blue mug',true)","(1,3,'Blue mug',true)"));assert.deepEqual(v.rows,[['1','3','Blue mug','t']]);variations.push(v);
 }
 const reset=await run(db,lesson.steps[0].sql);assert.deepEqual(reset.errors,[]);
 report.push({id:lesson.id,steps,variations,reset});await db.close();console.log(`${lesson.id}: exact results, variation and reset passed`);
}
writeFileSync('docs/article-work/choices-completion/observed.json',JSON.stringify({checked:'2026-10-15',runtime:'PGlite 0.5.8 raw PostgreSQL protocol',report},null,2));
