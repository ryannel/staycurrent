import { PGlite } from '@electric-sql/pglite';
import { writeFileSync } from 'node:fs';
const db = new PGlite();
const out={};
try {
 out.version=(await db.query('select version()')).rows;
 await db.exec(`CREATE TABLE tags(label text,tags text[]); INSERT INTO tags VALUES ('P7',ARRAY['gift','ceramic']),('reversed',ARRAY['ceramic','gift']),('extra',ARRAY['gift','ceramic','sale']); CREATE INDEX ON tags USING gin(tags);`);
 out.contains=(await db.query(`SELECT label FROM tags WHERE tags @> ARRAY['gift','ceramic'] ORDER BY label`)).rows;
 out.equal=(await db.query(`SELECT label FROM tags WHERE tags=ARRAY['gift','ceramic'] ORDER BY label`)).rows;
 out.overlap=(await db.query(`SELECT tstzrange('2026-11-02 10:00+00','2026-11-02 11:00+00','[)') && tstzrange('2026-11-02 10:30+00','2026-11-02 11:30+00','[)') AS overlaps, tstzrange('2026-11-02 10:00+00','2026-11-02 11:00+00','[)') && tstzrange('2026-11-02 11:00+00','2026-11-02 12:00+00','[)') AS adjoining`)).rows;
 if(JSON.stringify(out.equal)!=='[{"label":"P7"}]'||out.contains.length!==3||!out.overlap[0].overlaps||out.overlap[0].adjoining) throw Error('Unexpected teaching results');
 out.passed=true;
} finally {await db.close();writeFileSync(new URL('./pglite-results.json',import.meta.url),JSON.stringify(out,null,2));}
