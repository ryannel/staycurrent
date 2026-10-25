import {PGlite} from '@electric-sql/pglite';
import {ltree} from '@electric-sql/pglite/contrib/ltree';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
const sql=await fs.readFile(new URL('../public/relational-rebuild/hierarchies/hierarchy-example.sql',import.meta.url),'utf8');
const checks=await fs.readFile(new URL('./native-checks.sql',import.meta.url),'utf8');
const db=new PGlite({extensions:{ltree}});
try{
 await db.waitReady;
 const version=(await db.query('select version()')).rows;
 const setup=await db.exec(sql);
 const verification=await db.exec(checks);
 const final=(await db.query('select category_id,name,parent_id from hierarchy_lab.categories order by category_id')).rows;
 const result={runtime:'PGlite 0.5.8 / PostgreSQL 18.3 WebAssembly; single connection, no concurrency evidence',version,sqlSha256:crypto.createHash('sha256').update(sql).digest('hex'),checksSha256:crypto.createHash('sha256').update(checks).digest('hex'),setup,verification,final};
 await fs.writeFile(new URL('./pglite-results.json',import.meta.url),JSON.stringify(result,null,2));
 console.log(JSON.stringify({version,statements:setup.length+verification.length,final}));
}catch(e){console.error(JSON.stringify({message:e.message,code:e.code,detail:e.detail,where:e.where}));process.exitCode=1;}finally{await db.close()}
