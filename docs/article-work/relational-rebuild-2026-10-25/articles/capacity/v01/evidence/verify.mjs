import { PGlite } from '@electric-sql/pglite';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const article=await readFile('src/articles/current/article.astro','utf8');
const db=new PGlite();
try {
 const version=(await db.query('SELECT version()')).rows[0].version;
 await db.exec(`CREATE TABLE customers(customer_id integer PRIMARY KEY,name text NOT NULL);
 INSERT INTO customers VALUES(1,'Mina Shah'),(2,'Tariq Aziz'),(3,'Edda Berg');
 CREATE TABLE orders(order_id integer PRIMARY KEY,customer_id integer NOT NULL REFERENCES customers,placed_at timestamptz NOT NULL,status text NOT NULL CHECK(status IN('pending','paid','cancelled')));
 INSERT INTO orders VALUES (101,1,'2026-10-12 09:30+00','paid'),(102,2,'2026-10-14 16:05+00','paid'),(103,1,'2026-10-20 10:15+00','pending');`);
 const sql=article.match(/code=\{`(SELECT[\s\S]*?)`\}/)[1];
 const result=(await db.query(sql)).rows;
 assert.deepEqual(result.map(r=>[r.order_id,r.status]),[[103,'pending'],[101,'paid']]);
 const counts=await db.query('SELECT count(*)::integer AS count FROM orders');
 assert.equal(counts.rows[0].count,3);
 const links=JSON.parse(await readFile('input/reading-links.json','utf8'));
 const hrefs=[...article.matchAll(/href="(\/learn\/databases\/relational\/[^\"]*)"/g)].map(m=>m[1]);
 assert(hrefs.every(h=>links.some(x=>x.href===h)));
 const budgets=[4,6,10].map(instances=>({instances,application:instances*12,total:instances*12+20}));
 assert.deepEqual(budgets.map(x=>x.total),[68,92,140]);
 assert.equal(100*.04,4);assert.equal(100*.2,20);assert.equal(600/(100-80),30);assert.equal(600/100,6);
 const burst=[];
 for(const bounded of [true,false]) for(let step=0;step<5;step++){
  const max=bounded?4:7,done=Math.min(step*2,max),running=step<Math.ceil(max/2)?Math.min(2,max-done):0,queued=Math.max(0,max-done-running),refused=bounded?3:0;
  assert.equal(done+running+queued+refused,7);assert(running<=2);if(bounded)assert(queued<=2);
  burst.push({bounded,time:step*100,done,running,queued,refused});
 }
 const out={runtime:version,pglite:'0.5.8',storage:'owned in-memory instance; closed in finally',sql,result,counts:counts.rows,budgets,burst,linksChecked:hrefs,sourceSha256:createHash('sha256').update(article).digest('hex'),limits:'SQL rows only; all queue schedules and rates are assumed, no capacity or concurrency measured'};
 await writeFile('evidence/verification.json',JSON.stringify(out,null,2)+'\n');
 console.log(JSON.stringify(out,null,2));
} finally {await db.close();}
