import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';
const db = new PGlite();
const source = await readFile('src/pages/learn/databases/relational/modelling.astro', 'utf8');
const sql = name => source.match(new RegExp(`const ${name} = \x60([\\s\\S]*?)\x60;`))[1];
await db.exec(await readFile('docs/article-work/designing-data/schema.sql', 'utf8'));
const receipt = await db.query(sql('receiptQuery'));
assert.equal(receipt.rows[0].line_total, '36.00');
await db.exec(sql('lineAttempt'));
await db.exec(sql('objectDefinition'));
await db.exec(sql('relatedDefinition'));
assert.equal((await db.query('SELECT capacity_ml FROM mug_details')).rows[0].capacity_ml, 350);
const objects = ['{"material":"ceramic"}', '{"capacity_ml":"large"}', '{}', '["ceramic","glazed"]', null];
for (const [i,value] of objects.entries()) {
  let accepted = true;
  try { await db.query('UPDATE products SET attributes=$1::jsonb WHERE product_id=\'P7\'', [value]); }
  catch { accepted = false; }
  assert.equal(accepted, i < 3);
}
let cases = 0;
for (let mask=0; mask<32; mask++) {
 const identity = !!(mask&1), required = !!(mask&2), positive = !!(mask&4), reference = !!(mask&8), product = !!(mask&16);
 await db.exec(`DROP TABLE IF EXISTS probe; CREATE TABLE probe (
 order_id text, line_no integer, product_id text ${reference ? 'REFERENCES products(product_id)' : ''},
 quantity integer ${required ? 'NOT NULL' : ''} ${positive ? 'CHECK(quantity>0)' : ''}
 ${identity ? ', PRIMARY KEY(order_id,line_no)' : ''}
 ${product ? ', UNIQUE(order_id,product_id)' : ''});
 INSERT INTO probe VALUES ('O12',1,'P7',2);`);
 for (const kind of ['same','bowl','duplicate','missing','zero','unknown']) {
   const line = kind==='duplicate' ? 1 : 2;
   const prod = kind==='bowl' ? 'P8' : kind==='unknown' ? 'P99' : 'P7';
   const qty = kind==='missing' ? null : kind==='zero' ? 0 : 1;
   const expected = !((identity && line===1) || (required && qty===null) || (positive && qty===0) || (reference && prod==='P99') || (product && prod==='P7'));
   await db.exec('BEGIN');
   let accepted = true;
   try { await db.query('INSERT INTO probe VALUES ($1,$2,$3,$4)', ['O12',line,prod,qty]); }
   catch { accepted=false; }
   await db.exec('ROLLBACK');
   assert.equal(accepted, expected, `${mask}/${kind}`);
   cases++;
 }
}
console.log(JSON.stringify({version:(await db.query('SELECT version()')).rows[0].version, receipt: receipt.rows, proposedRuleCases:cases, objectCases:objects.length, result:'All assertions passed'},null,2));
await db.close();
