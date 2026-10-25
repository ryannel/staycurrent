import { PGlite } from '@electric-sql/pglite';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {snippet,payload,accepted,refused,setup,reset,begin,insert,purchase,attempt,state} from './protocol.mjs';
const db=new PGlite();
const logs={runtime:(await db.query('SELECT version()')).rows,checks:[]};
try {
 await db.exec(setup+snippet('schema'));
 assert.deepEqual(await attempt(db),accepted);
 const first=await state(db); assert.deepEqual(first.stock.map(x=>x.stock),[10,0,4]);assert.equal(first.lines.length,2);assert.equal(first.payments.length,0);
 assert.deepEqual(await attempt(db),accepted);assert.deepEqual(await state(db),first);logs.checks.push({name:'Accepted and repeated fixed purchase',state:first});
 const changed=structuredClone(payload);changed.items[1].quantity=2;
 assert.equal((await attempt(db,changed)).outcome,'mismatch');assert.deepEqual(await state(db),first);logs.checks.push({name:'Changed payload refused without mutation',passed:true});
 await db.exec(reset);await attempt(db,payload,false);assert.equal((await state(db)).receipts.length,0);assert.deepEqual((await state(db)).stock.map(x=>x.stock),[12,1,4]);logs.checks.push({name:'Whole-attempt rollback removes receipt and purchase',passed:true});
 await db.exec(reset);await db.query("UPDATE products SET stock=0 WHERE product_id='P7'");assert.deepEqual(await attempt(db),refused);const refusalState=await state(db);assert.equal(refusalState.stock[0].stock,12);assert.equal(refusalState.orders.length,0);assert.deepEqual(await attempt(db),refused);logs.checks.push({name:'Refusal removes partial tea decrement and is recoverable',state:refusalState});
 await db.exec(reset);await attempt(db);await db.query(begin);const blind=await purchase(db);await db.query('ROLLBACK');assert.deepEqual(blind,refused);logs.checks.push({name:'Counterexample: blind repeat reports refusal after accepted order',observed:blind});
 await db.exec(reset);await db.query(begin);await db.query(insert,[JSON.stringify(payload)]);await purchase(db);await db.query('DELETE FROM purchase_requests');await db.query('COMMIT');assert.equal((await state(db)).orders.length,1);assert.equal((await state(db)).receipts.length,0);logs.checks.push({name:'Counterexample: purchase-first gap leaves order without receipt',passed:true});
 await db.exec(reset);await db.query(begin);await db.query(insert,[JSON.stringify(payload)]);await db.query(snippet('finish').split('\n\n')[0]);await db.query('COMMIT');assert.equal((await state(db)).orders.length,0);assert.deepEqual(await attempt(db),accepted);logs.checks.push({name:'Counterexample: answer-first gap returns success for absent order',passed:true});
} finally { await db.close(); }
await fs.writeFile(new URL('./sequential-results.json',import.meta.url),JSON.stringify(logs,null,2)+'\n');console.log(JSON.stringify({checks:logs.checks.length,runtime:logs.runtime},null,2));
