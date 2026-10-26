import {PGlite} from '@electric-sql/pglite';
import {btree_gist} from '@electric-sql/pglite/contrib/btree_gist';
const db=new PGlite({extensions:{btree_gist}});
const run=async(label,sql)=>{const r=await db.query(sql);console.log(JSON.stringify({label,sql,rows:r.rows},null,2));return r.rows};
try {
 await run('runtime','SELECT version()');
 await run('range bounds',`SELECT tstzrange('2026-11-02 10:00+00','2026-11-02 11:00+00','[)') @> '2026-11-02 11:00+00'::timestamptz AS contains_11, tstzrange('2026-11-02 10:00+00','2026-11-02 11:00+00','[)') && tstzrange('2026-11-02 10:30+00','2026-11-02 11:30+00','[)') AS overlap_7002, tstzrange('2026-11-02 10:00+00','2026-11-02 11:00+00','[)') -|- tstzrange('2026-11-02 11:00+00','2026-11-02 12:00+00','[)') AS adjacent_7003`);
 await run('Cartesian point distance',`SELECT point(3,4) <-> point(0,0) AS a_distance, point(4,4) <-> point(0,0) AS b_distance, box(point(-5,-5),point(5,5)) @> point(4,4) AS b_box_candidate`);
 await db.exec('CREATE EXTENSION btree_gist;');
 await run('installed',`SELECT extname,extversion FROM pg_extension WHERE extname='btree_gist'`);
 await db.exec(`CREATE TABLE reservations (
 reservation_id integer PRIMARY KEY, room text NOT NULL, during tstzrange NOT NULL,
 CHECK(NOT isempty(during) AND NOT lower_inf(during) AND NOT upper_inf(during)
 AND lower_inc(during) AND NOT upper_inc(during)
 AND isfinite(lower(during)) AND isfinite(upper(during))),
 EXCLUDE USING gist(room WITH =,during WITH &&));
 INSERT INTO reservations VALUES(7001,'R1','[2026-11-02 10:00+00,2026-11-02 11:00+00)');`);
 await run('article overlap query',`SELECT reservation_id FROM reservations WHERE room='R1' AND during && tstzrange('2026-11-02 10:30+00','2026-11-02 11:30+00','[)')`);
 for(const [label,sql,state] of [
 ['overlap',`INSERT INTO reservations VALUES(7002,'R1','[2026-11-02 10:30+00,2026-11-02 11:30+00)')`,'23P01'],
 ['closed end',`INSERT INTO reservations VALUES(7003,'R1','[2026-11-02 11:00+00,2026-11-02 12:00+00]')`,'23514'],
 ['infinite explicit timestamp',`INSERT INTO reservations VALUES(7003,'R1','[2026-11-02 11:00+00,infinity)')`,'23514'],
 ['empty',`INSERT INTO reservations VALUES(7003,'R1','empty')`,'23514']]){
 try{await db.query(sql);throw Error('unexpected acceptance '+label)}catch(e){if(e.code!==state)throw e;console.log(JSON.stringify({label,rejected:e.code}));}
 }
 await db.exec(`BEGIN; INSERT INTO reservations VALUES(7003,'R1','[2026-11-02 11:00+00,2026-11-02 12:00+00)'); ROLLBACK;`);
 await run('extension members query',`SELECT count(*) AS members FROM pg_depend d JOIN pg_extension e ON e.oid=d.refobjid WHERE d.refclassid='pg_extension'::regclass AND d.deptype='e' AND e.extname='btree_gist'`);
 // Pure arithmetic checks for the illustrative Cartesian diagram, not PostGIS execution.
 for (const [x,y,expected] of [[3,4,true],[4,4,false],[6,0,false]]) {
   const candidate=Math.abs(x)<=5&&Math.abs(y)<=5,within=Math.hypot(x,y)<=5;
   if(within!==expected)throw Error('spatial arithmetic mismatch');
   console.log(JSON.stringify({model:'Cartesian units',x,y,candidate,distance:Math.hypot(x,y),within}));
 }
} finally {await db.close();console.log('owned PGlite closed');}
