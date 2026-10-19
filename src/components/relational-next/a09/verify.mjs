import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';
const db = new PGlite();
const {rows:[row]} = await db.query(`SELECT version(), 9007199254740993::bigint AS id,
 20.005::numeric(8,2) AS fee, '007'::text AS code,
 timestamptz '2026-11-03 18:00:00.123456+00' AS instant,
 '{}'::jsonb AS older_options, '{"phone":null}'::jsonb AS explicit_null`);
assert.equal(row.id,9007199254740993n);
assert.equal(row.fee,'20.01');
assert.equal(row.code,'007');
assert.equal(row.instant.toISOString(),'2026-11-03T18:00:00.123Z');
assert.equal(Number(row.id).toString(),'9007199254740992');
assert.throws(()=>JSON.stringify(row),TypeError);
const payload = {id:row.id.toString(),fee:row.fee,code:row.code,instant:row.instant.toISOString(),options:row.older_options};
assert.equal(JSON.parse(JSON.stringify(payload)).id,'9007199254740993');
assert.equal(Object.hasOwn(row.older_options,'phone'),false);
assert.equal(Object.hasOwn(row.explicit_null,'phone'),true);
assert.equal(row.explicit_null.phone,null);
console.log(JSON.stringify({version:row.version,types:{id:typeof row.id,fee:typeof row.fee,instant:row.instant.constructor.name},unsafeNumber:Number(row.id).toString(),safePayload:payload},null,2));
// Application input policy before the database coerces the scale.
function wholeCentFee(input) {
 if (!/^[0-9]+(?:[.][0-9]{1,2})?$/.test(input)) throw new Error('Whole cents required');
 return input;
}
assert.throws(() => wholeCentFee('20.005'));
assert.equal(wholeCentFee('20.00'),'20.00');
assert.equal((await db.query('SELECT $1::numeric(8,2) AS fee',[wholeCentFee('20.00')])).rows[0].fee,'20.00');
// A deliberately small versioned shape policy, not a general JSON validator.
function readOptions(value) {
 if (!value || Array.isArray(value) || typeof value !== 'object') throw new Error('Object required');
 if (value.v !== undefined && value.v !== 1) throw new Error('Unsupported version');
 const notes = Object.hasOwn(value,'notes') ? value.notes : [];
 if (!Array.isArray(notes) || notes.some(x => typeof x !== 'string')) throw new Error('Notes must be text list');
 return notes;
}
assert.deepEqual(readOptions({}),[]);
assert.deepEqual(readOptions({v:1,notes:['By the window']}),['By the window']);
assert.throws(() => readOptions({v:1,notes:null}));
assert.throws(() => readOptions({v:2,notes:[]}));
await db.close();
