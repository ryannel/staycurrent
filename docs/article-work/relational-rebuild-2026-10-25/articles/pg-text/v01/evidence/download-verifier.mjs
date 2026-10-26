import {PGlite} from '@electric-sql/pglite';
import {readFile,writeFile} from 'node:fs/promises';
const db=new PGlite();
try{
 const sql=await readFile(new URL('../public/relational-rebuild/pg-text/catalogue-search.sql',import.meta.url),'utf8');
 const results=await db.exec(sql);
 await writeFile(new URL('./download-results.json',import.meta.url),JSON.stringify(results,null,2));
 if((await db.query("SELECT to_regclass('pg_temp.catalogue_search') AS table_name")).rows[0].table_name!==null)throw new Error('Experiment table survived rollback');
 console.log('Reader download completed and rollback confirmed.');
}finally{await db.close();}
