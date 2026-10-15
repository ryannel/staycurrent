import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {stripTypeScriptTypes} from 'node:module';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const pgliteURL=pathToFileURL(resolve('node_modules/@electric-sql/pglite/dist/index.js')).href;
const schema=readFileSync('docs/article-work/designing-data/schema.sql','utf8');
let src=readFileSync('src/lib/sql-sandbox-worker.ts','utf8').replace("from '@electric-sql/pglite'", `from '${pgliteURL}'`).replace("import schema from '../../docs/article-work/designing-data/schema.sql?raw';",`const schema=${JSON.stringify(schema)};`);
const out=[];globalThis.self={postMessage:m=>out.push(m)};
await import('data:text/javascript;base64,'+Buffer.from(stripTypeScriptTypes(src)).toString('base64'));
await self.onmessage({data:{type:'init'}});
const queries=[
"SELECT 1 AS a; BEGIN; SELECT 2 AS b;",
"SELECT 1/0;",
"ROLLBACK; SELECT 'NULL' AS text_null,NULL AS actual_null;",
"CREATE FUNCTION noisy() RETURNS int LANGUAGE plpgsql AS $$ BEGIN RAISE NOTICE 'hello'; RETURN 42; END $$; SELECT noisy() AS answer;",
Array.from({length:50},()=>"SELECT 1;").join('')+"SELECT 1/0;",
"SELECT repeat('x',2001) AS value;",
"SELECT generate_series(1,201);",
"COPY (SELECT 42 AS answer) TO STDOUT;",
];
for(let i=0;i<queries.length;i++){
 await self.onmessage({data:{type:'run',id:i+1,sql:queries[i]}});
 const x=out.at(-1);
 assert.equal(x.type,'result');
 if(i===0) assert.equal(x.status,'T');
 if(i===1) assert.equal(x.status,'E');
 if(i===2) { assert.equal(x.status,'I');assert.deepEqual(x.outputs.at(-1).rows,[['NULL',null]]); }
 if(i===3) assert.deepEqual(x.outputs.at(-1).rows,[['42']]);
 if(i===4) { assert.equal(x.outputs.length,50);assert.equal(x.outputs.at(-1).code,'22012');assert.equal(x.omitted,true); }
 if(i===5) assert.equal(x.outputs[0].cellsTruncated,true);
 if(i===6) { assert.equal(x.outputs[0].rows.length,200);assert.equal(x.outputs[0].truncated,true); }
 if(i===7) assert.ok(x.outputs.some(o=>o.text?.includes('COPY output is not displayed')));
 console.log(JSON.stringify({case:i+1,status:x.status,responses:x.outputs.length,omitted:x.omitted,passed:true}));
}
process.exit();
