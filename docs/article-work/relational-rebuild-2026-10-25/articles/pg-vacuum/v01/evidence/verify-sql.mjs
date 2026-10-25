import { PGlite } from '@electric-sql/pglite';
import fs from 'node:fs';
import crypto from 'node:crypto';
const db = new PGlite();
const results={runtime:'PGlite 0.5.8, PostgreSQL WASM',checks:[]};
try {
 results.version=(await db.query('SELECT version()')).rows;
 await db.exec(`CREATE TABLE public.products(product_id text PRIMARY KEY, name text NOT NULL, price numeric(8,2) NOT NULL, stock integer NOT NULL); INSERT INTO products VALUES ('P3','Green tea, 50 g',4.50,10),('P7','Blue mug',20.00,0),('P9','Teapot',35.00,4);`);
 const article=fs.readFileSync(new URL('../src/articles/current/article.astro',import.meta.url),'utf8');
 results.article_sha256=crypto.createHash('sha256').update(article).digest('hex');
 const blocks=[...article.matchAll(/<Sql\s+label="([^"]+)"\s+code=\{`([\s\S]*?)`\}/g)];
 for(const [,label,sql] of blocks){
   try { const output=await db.exec(sql);results.checks.push({label,sql,passed:true,output:output.map(x=>({fields:x.fields,rows:x.rows,rowCount:x.rows.length}))}); }
   catch(e){results.checks.push({label,sql,passed:false,error:String(e)});}
 }
 results.arithmetic={default_trigger:50+.2*1e6,lower_trigger:50+.01*1e6,margin_seconds:50e6/10000,space:{live:6,old:18,before_pages:6,after_vacuum_pages:6,after_rewrite_pages:2}};
 results.passed=results.checks.length===6&&results.checks.every(x=>x.passed);
}finally{await db.close();}
fs.writeFileSync(new URL('sql-results.json',import.meta.url),JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify({version:results.version,passed:results.passed,checks:results.checks.map(({label,passed,error})=>({label,passed,error})),arithmetic:results.arithmetic},null,2));
if(!results.passed)process.exitCode=1;
