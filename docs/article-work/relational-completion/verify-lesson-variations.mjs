import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {PGlite,protocol} from '@electric-sql/pglite';
import {sandboxTutorials} from '../../../src/lib/sql-sandbox-tutorials.ts';

// Bounded checks for the three new educational variations, not a repeat of the full suite.
const seed=readFileSync('docs/article-work/designing-data/schema.sql','utf8')+'\nCREATE TABLE stock(product_id text PRIMARY KEY REFERENCES products,available integer NOT NULL CHECK(available>=0)); INSERT INTO stock VALUES (\'P7\',3);';
async function run(db,sql){
 const parser=new protocol.Parser(), out={rows:[],errors:[],status:''};
 await db.execProtocolRawStream(protocol.serialize.query(sql),{onRawData:b=>parser.parse(b,m=>{
  if(m.name==='dataRow')out.rows.push(m.fields);
  if(m.name==='error')out.errors.push(m.code);
  if(m.name==='readyForQuery')out.status=m.status;
 })}); return out;
}
const results=[];
for(const id of ['constraints','checkout','rollback']){
 const db=await PGlite.create();await db.exec(seed);
 const t=sandboxTutorials.find(t=>t.id===id);const observed=[];
 if(id==='constraints'){
  observed.push(await run(db,t.steps[1].sql));
  const denied=await run(db,t.steps[2].sql.replace('quantity = 0','quantity = -1'));
  assert.deepEqual(denied.errors,['23514']);assert.equal(denied.status,'I');observed.push(denied);
  const retained=await run(db,t.steps[3].sql);assert.deepEqual(retained.rows,[['O12','1','3']]);observed.push(retained);
  const accepted=await run(db,t.steps[2].sql.replace('quantity = 0','quantity = 4'));
  assert.deepEqual(accepted.errors,[]);assert.deepEqual(accepted.rows,[['4']]);observed.push(accepted);
 }else if(id==='checkout'){
  await run(db,t.steps[1].sql);
  const denied=await run(db,t.steps[2].sql.replaceAll('2','4'));assert.deepEqual(denied.rows,[]);assert.equal(denied.status,'T');observed.push(denied);
  await run(db,'ROLLBACK;');
  const state=await run(db,t.steps[5].sql);assert.deepEqual(state.rows,[['3','0','0']]);observed.push(state);
 }else{
  for(let i=0;i<3;i++)observed.push(await run(db,t.steps[i].sql));
  const valid=await run(db,t.steps[3].sql.replace("'P7', 0","'P7', 2"));assert.deepEqual(valid.errors,[]);observed.push(valid);
  const pending=await run(db,t.steps[4].sql);assert.deepEqual(pending.errors,[]);assert.deepEqual(pending.rows,[['1']]);assert.equal(pending.status,'T');observed.push(pending);
  await run(db,t.steps[5].sql);
  const final=await run(db,t.steps[6].sql);assert.deepEqual(final.rows,[['3','0','0']]);assert.equal(final.status,'I');observed.push(final);
 }
 results.push({id,observed});await db.close();console.log(id+': variation passed');
}
writeFileSync('docs/article-work/relational-completion/lesson-variations.json',JSON.stringify(results,null,2));
