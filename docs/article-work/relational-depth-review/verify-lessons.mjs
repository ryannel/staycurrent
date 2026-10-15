import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { PGlite, protocol } from '@electric-sql/pglite';
import { btree_gist } from '@electric-sql/pglite/contrib/btree_gist';
import { sandboxTutorials } from '../../../src/lib/sql-sandbox-tutorials.ts';
const schema = readFileSync('docs/article-work/designing-data/schema.sql','utf8');
const seed = `${schema}\nCREATE TABLE stock(product_id text PRIMARY KEY REFERENCES products, available integer NOT NULL CHECK(available>=0)); INSERT INTO stock VALUES ('P7',3);`;
const ids = new Set();
const report=[];
for(const tutorial of sandboxTutorials) {
  assert(!ids.has(tutorial.id),`Duplicate lesson ${tutorial.id}`); ids.add(tutorial.id);
  const db=await PGlite.create({ extensions: { btree_gist } }); await db.exec(seed);
  const steps=[];
  for(const [index,step] of tutorial.steps.entries()) {
    const messages=await db.execProtocolStream(protocol.serialize.query(step.sql),{throwOnError:false});
    const errors=messages.filter(m=>m.name==='error').map(m=>({code:m.code,message:m.message}));
    assert.deepEqual(errors.map(e=>e.code),step.expectedError?[step.expectedError]:[],`${tutorial.id} step ${index+1}: ${JSON.stringify(errors)}`);
    steps.push({title:step.title,errors,status:messages.findLast(m=>m.name==='readyForQuery')?.status,rows:messages.filter(m=>m.name==='dataRow').map(m=>m.fields)});
  }
  assert.equal(steps.at(-1).status,'I',`${tutorial.id} leaves a transaction open or failed`);
  report.push({id:tutorial.id,steps}); await db.close();
  console.log(`${tutorial.id}: ${steps.length} steps, expected errors matched`);
}
writeFileSync('docs/article-work/relational-depth-review/lesson-execution.json',JSON.stringify({engine:'PGlite 0.5.8',checked:'2026-10-15',report},null,2));
console.log(`${report.length} lessons executed. Row assertions are also checked in each batch's focused verification.`);
