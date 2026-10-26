import {PGlite} from '@electric-sql/pglite';
import {writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const db=new PGlite();
const evidence={runtime:'PGlite 0.5.8, WebAssembly PostgreSQL; SET ROLE checks, no client login/authentication evidence',checks:[]};
const check=async(label,sql,expected)=>{const rows=(await db.query(sql)).rows;if(JSON.stringify(rows)!==JSON.stringify(expected))throw Error(`${label}: ${JSON.stringify(rows)}`);evidence.checks.push({label,rows});};
try{
 evidence.version=(await db.query('select version()')).rows;
 await db.exec(`CREATE ROLE shop_runtime NOLOGIN NOBYPASSRLS; CREATE SCHEMA sc_access_verify;
 CREATE TABLE sc_access_verify.customers(tenant_id int,customer_id int PRIMARY KEY,name text);
 INSERT INTO sc_access_verify.customers VALUES(10,1,'Mina Shah'),(10,2,'Tariq Aziz'),(10,3,'Edda Berg'),(20,4,'Rowan Vale');
 GRANT USAGE ON SCHEMA sc_access_verify TO shop_runtime;
 GRANT SELECT,UPDATE ON sc_access_verify.customers TO shop_runtime; SET ROLE shop_runtime;`);
 await check('No RLS admits all rows','select count(*)::int as n from sc_access_verify.customers',[{n:4}]);
 await db.exec('RESET ROLE; ALTER TABLE sc_access_verify.customers ENABLE ROW LEVEL SECURITY; SET ROLE shop_runtime;');
 await check('Enabled with no policy denies','select count(*)::int as n from sc_access_verify.customers',[{n:0}]);
 await db.exec(`RESET ROLE; CREATE POLICY tenant ON sc_access_verify.customers TO shop_runtime USING(tenant_id=nullif(current_setting('shop.tenant_id',true),'')::int) WITH CHECK(tenant_id=nullif(current_setting('shop.tenant_id',true),'')::int); SET ROLE shop_runtime; BEGIN; SET LOCAL shop.tenant_id='10';`);
 await check('Context10 result','select array_agg(customer_id order by customer_id) as ids from sc_access_verify.customers',[{ids:[1,2,3]}]);
 await check('Rowan hidden','select customer_id from sc_access_verify.customers where customer_id=4',[]);
 const update=await db.exec('UPDATE sc_access_verify.customers SET name=name WHERE customer_id=4;');
 if(update[0].affectedRows!==0)throw Error('Expected UPDATE 0');evidence.checks.push({label:'Hidden target UPDATE',affectedRows:0});
 await db.exec('SAVEPOINT check_error;');
 try{await db.exec('UPDATE sc_access_verify.customers SET tenant_id=20 WHERE customer_id=1;');throw Error('Wrong tenant accepted');}catch(error){if(error.code!=='42501')throw error;evidence.checks.push({label:'Wrong proposed tenant',sqlstate:error.code});}
 await db.exec('ROLLBACK TO check_error; COMMIT;');
 await check('Local context ends at commit','select count(*)::int as n from sc_access_verify.customers',[{n:0}]);
 await db.exec('BEGIN; SET LOCAL shop.tenant_id=\'20\';');
 await check('Forged context exposes Rowan','select name from sc_access_verify.customers',[{name:'Rowan Vale'}]);
 await db.exec('ROLLBACK;');
 await check('Local context ends at rollback','select count(*)::int as n from sc_access_verify.customers',[{n:0}]);
 evidence.outcome='All ordinary SQL assertions passed';
}catch(error){evidence.outcome='FAILED';evidence.error={message:error.message,code:error.code};process.exitCode=1;}
finally{await db.close();evidence.verifier_sha256=createHash('sha256').update(await readFile(new URL('./pglite-access-verifier.mjs',import.meta.url))).digest('hex');await writeFile(new URL('./pglite-access-results.json',import.meta.url),JSON.stringify(evidence,null,2)+'\n');}
console.log(JSON.stringify(evidence,null,2));
