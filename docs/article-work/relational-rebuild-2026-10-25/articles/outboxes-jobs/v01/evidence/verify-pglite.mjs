import { PGlite } from '@electric-sql/pglite';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const source = await readFile(new URL('../public/relational-rebuild/outboxes-jobs/outbox-experiment.sql',import.meta.url),'utf8');
const db = new PGlite();
try {
 const version=await db.query('SELECT version()');
 const results=await db.exec(source);
 const output={runtime:'@electric-sql/pglite 0.5.8; PostgreSQL/WASM; not native concurrent sessions',version:version.rows,sha256:createHash('sha256').update(source).digest('hex'),statements:results.length,finalResults:results.slice(-3,-1).map(x=>x.rows),allAssertionsPassed:true,limits:'Single session; expiry exercised by changing owned test deadlines; no external receiver or elapsed-time claim.'};
 await writeFile(new URL('pglite-results.json',import.meta.url),JSON.stringify(output,null,2));
 console.log(JSON.stringify(output,null,2));
} catch (error) { console.error(error.message); process.exitCode=1; } finally {await db.close();}
