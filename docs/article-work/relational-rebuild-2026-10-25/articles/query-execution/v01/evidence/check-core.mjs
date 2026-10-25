import {PGlite} from '@electric-sql/pglite';
import fs from 'node:fs/promises';
import {baseline,repair,cases} from './queries.mjs';
const db=new PGlite();
try {
 const fixture=await fs.readFile(new URL('../public/relational-rebuild/query-execution/fixture.sql',import.meta.url),'utf8');
 await db.exec(fixture.split('INSERT INTO customers SELECT')[0]);
 const downloaded=await fs.readFile(new URL('../public/relational-rebuild/query-execution/report-queries.sql',import.meta.url),'utf8');
 const downloadResults=await db.exec(downloaded);
 const version=(await db.query('select version()')).rows[0].version;
 const params=cases[0].params;
 const a=(await db.query(baseline,params)).rows,b=(await db.query(repair,params)).rows;
 const expected=[{customer_id:2,line_value:'40.00'},{customer_id:1,line_value:'39.50'}];
 if(downloadResults.length!==2||downloadResults.some(r=>JSON.stringify(r.rows)!==JSON.stringify(expected))) throw Error('Download result mismatch');
 if(JSON.stringify(a)!==JSON.stringify(b)||JSON.stringify(b)!==JSON.stringify(expected)) throw Error('Core result mismatch');
 await db.exec(`INSERT INTO orders VALUES (900001,3,'2026-10-25 12:00+00','paid')`);
 const emptyA=(await db.query(baseline,params)).rows,emptyB=(await db.query(repair,params)).rows;
 if(JSON.stringify(emptyA)!==JSON.stringify(emptyB)||JSON.stringify(emptyB)!==JSON.stringify(expected)) throw Error('Empty-order mismatch');
 const missingGuard=baseline.replace('HAVING COUNT(*) > 0','');
 const counterexample=(await db.query(missingGuard,params)).rows;
 if(!counterexample.some(r=>r.customer_id===3&&r.line_value===null)) throw Error('Missing counterexample');
 await fs.writeFile(new URL('core-results.json',import.meta.url),JSON.stringify({runtime:'PGlite 0.5.8',version,expected,a,b,emptyA,emptyB,missingGuard:counterexample},null,2)+'\n');
} finally {await db.close();}
