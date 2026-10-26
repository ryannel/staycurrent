import {PGlite} from '@electric-sql/pglite';
import {readFile,writeFile} from 'node:fs/promises';
const db = new PGlite();
try {
  const sql=await readFile(new URL('./native-verifier.sql',import.meta.url),'utf8');
  const results=await db.exec(sql);
  await writeFile(new URL('./pglite-results.json',import.meta.url),JSON.stringify({runtime:'@electric-sql/pglite 0.5.8, PostgreSQL 18.3 WASM',results},null,2));
  console.log('All assertions passed; '+results.length+' statement results retained.');
} finally { await db.close(); }
