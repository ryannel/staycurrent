// Owned disposable PostgreSQL check. Does not connect to a pre-existing server.
import { spawn, execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir, userInfo } from 'node:os';
import { join } from 'node:path';
import { createInterface } from 'node:readline';
import assert from 'node:assert/strict';
import { customers, products, orders, items, historyQuery, reserveQuery } from './data.mjs';

const bin = process.env.STAYCURRENT_PG_BIN || '/opt/homebrew/opt/postgresql@18/bin';
const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('PG')));
const root = mkdtempSync(join(tmpdir(), 'sc-relational-full-'));
const data = join(root, 'data');
const socket = join(root, 'socket');
mkdirSync(socket);
const port = '56823';
const sessions = [];
const evidence = { started: new Date().toISOString(), port, checks: [], source: 'data.mjs / introduction.astro / RaceFigure.astro', claims: 'Query rows and deterministic stock protocols only; no performance, crash or network experiment.' };
let running = false;
function session(name) {
 const child = spawn(join(bin,'psql'), ['-X','-qAt','-v','ON_ERROR_STOP=1','-h',socket,'-p',port,'-U',userInfo().username,'-d','postgres'], {env:{...env, PGAPPNAME:name},stdio:['pipe','pipe','pipe']});
 let active; let sequence=0; let stderr='';
 child.stderr.on('data', d=>{stderr+=d;});
 createInterface({input:child.stdout}).on('line',line=>{if(!active)return;if(line===active.marker){clearTimeout(active.timer);const result=active.lines;const resolve=active.resolve;active=null;resolve(result);}else active.lines.push(line);});
 child.on('exit',code=>{if(active){clearTimeout(active.timer);active.reject(new Error(`psql ${name} exited ${code}: ${stderr}`));active=null;}});
 const result={child, query(sql){assert(!active,'one pending command per connection');return new Promise((resolve,reject)=>{const marker=`DONE_${++sequence}`;const timer=setTimeout(()=>reject(new Error(`timeout ${name}: ${sql}`)),10000);active={marker,lines:[],resolve,reject,timer};child.stdin.write(`${sql}\n\\echo ${marker}\n`);});}};
 sessions.push(result);return result;
}
const literal = value => typeof value==='number'?String(value):`'${value.replaceAll("'","''")}'`;
const values = rows => rows.map(row=>`(${row.map(literal).join(',')})`).join(',');
const insertOrder = id => `INSERT INTO orders VALUES (${id},${id===103?1:2},'2026-10-20 10:15+00','pending'); INSERT INTO order_items VALUES ${values(id===103?items.filter(row=>row[0]===103):[[104,1,'P7',1,'20.00']])};`;
try {
 execFileSync(join(bin,'initdb'), ['-D',data,'--no-locale','--encoding=UTF8','--auth-local=trust','--auth-host=reject'], {env,stdio:'pipe'});
 execFileSync(join(bin,'pg_ctl'), ['-D',data,'-l',join(root,'server.log'),'-o',`-p ${port} -k ${socket} -c listen_addresses='' -c fsync=on -c synchronous_commit=on`,'-w','start'], {env,stdio:'pipe'});
 running=true;
 const admin=session('sc-full-admin'),a=session('sc-full-mina'),b=session('sc-full-tariq');
 evidence.identity=await admin.query("SELECT version(); SELECT current_setting('data_directory'); SHOW port; SHOW transaction_isolation; SHOW fsync; SHOW synchronous_commit;");
 assert.equal(evidence.identity[1],data);assert.equal(evidence.identity[2],port);
 await admin.query(`CREATE TABLE customers(customer_id integer PRIMARY KEY,name text NOT NULL);
 CREATE TABLE products(product_id text PRIMARY KEY,name text NOT NULL,price numeric(8,2) NOT NULL CHECK(price>=0),stock integer NOT NULL CHECK(stock>=0));
 CREATE TABLE orders(order_id integer PRIMARY KEY,customer_id integer NOT NULL REFERENCES customers,placed_at timestamptz NOT NULL,status text NOT NULL CHECK(status IN ('pending','paid','cancelled')));
 CREATE TABLE order_items(order_id integer REFERENCES orders,line_no integer,product_id text NOT NULL REFERENCES products,quantity integer NOT NULL CHECK(quantity>0),unit_price numeric(8,2) NOT NULL,PRIMARY KEY(order_id,line_no));
 CREATE TABLE payments(payment_id integer PRIMARY KEY,order_id integer NOT NULL REFERENCES orders,amount numeric(8,2) NOT NULL CHECK(amount>0),method text NOT NULL);
 INSERT INTO customers VALUES ${values(customers)};INSERT INTO products VALUES ${values(products)};
 INSERT INTO orders VALUES (101,1,'2026-10-12 09:30+00','paid'),(102,2,'2026-10-14 16:05+00','paid');
 INSERT INTO order_items VALUES ${values(items.filter(row=>row[0]!==103))};
 INSERT INTO payments VALUES(501,101,30,'card'),(502,101,9.50,'gift card'),(503,102,40,'card');
 ${insertOrder(103)}`);
 const history=await admin.query(historyQuery);
 assert.deepEqual(history,['101|paid|1|Green tea, 50 g|1|4.50','101|paid|2|Teapot|1|35.00','103|pending|1|Blue mug|1|20.00','103|pending|2|Green tea, 50 g|2|4.50']);
 const fanout=await admin.query('SELECT count(*) FROM orders o JOIN order_items i USING(order_id) JOIN payments p USING(order_id) WHERE o.order_id=101;');assert.deepEqual(fanout,['4']);
 evidence.checks.push({name:'Exact displayed history SQL and payment fan-out',history,fanout});
 const reset=async()=>admin.query("DELETE FROM order_items WHERE order_id>=103;DELETE FROM orders WHERE order_id>=103;UPDATE products SET stock=CASE product_id WHEN 'P7' THEN 1 WHEN 'P3' THEN 12 ELSE 4 END;");
 await reset();await a.query('BEGIN;');await b.query('BEGIN;');
 assert.deepEqual(await a.query("SELECT stock FROM products WHERE product_id='P7';"),['1']);
 assert.deepEqual(await b.query("SELECT stock FROM products WHERE product_id='P7';"),['1']);
 await a.query(`UPDATE products SET stock=0 WHERE product_id='P7';UPDATE products SET stock=stock-2 WHERE product_id='P3';${insertOrder(103)} COMMIT;`);
 await b.query(`UPDATE products SET stock=0 WHERE product_id='P7';${insertOrder(104)} COMMIT;`);
 const unsafe=await admin.query("SELECT stock FROM products WHERE product_id='P7';SELECT order_id FROM orders WHERE order_id>=103 ORDER BY order_id;");assert.deepEqual(unsafe,['0','103','104']);
 evidence.checks.push({name:'Counterexample: transactions plus non-negative stock still oversell after two stale reads',unsafe});
 await reset();await a.query('BEGIN;');await b.query('BEGIN;');
 assert.deepEqual(await a.query(reserveQuery),['0']);
 const pending=b.query(reserveQuery);
 let waited=false;
 for(let attempt=0;attempt<100;attempt++){
  const state=await admin.query("SELECT wait_event_type FROM pg_stat_activity WHERE application_name='sc-full-tariq' AND state='active';");
  if(state[0]==='Lock'){waited=true;break;}
  await new Promise(resolve=>setTimeout(resolve,20));
 }
 assert(waited,'Tariq was observed waiting on a lock before Mina committed');
 await a.query(`UPDATE products SET stock=stock-2 WHERE product_id='P3' AND stock>=2;${insertOrder(103)} COMMIT;`);
 const tariq=await pending;assert.deepEqual(tariq,[]);await b.query('ROLLBACK;');
 const protectedState=await admin.query("SELECT product_id,stock FROM products ORDER BY product_id;SELECT order_id FROM orders WHERE order_id>=103 ORDER BY order_id;");
 assert.deepEqual(protectedState,['P3|10','P7|0','P9|4','103']);
 evidence.checks.push({name:'Conditional change: observed lock wait, then no row for Tariq; order 103 only',waited,tariq,protectedState});
 await reset();await admin.query("UPDATE products SET stock=0 WHERE product_id='P3';");await a.query('BEGIN;');await a.query(reserveQuery);
 assert.deepEqual(await a.query("UPDATE products SET stock=stock-2 WHERE product_id='P3' AND stock>=2 RETURNING stock;"),[]);await a.query('ROLLBACK;');
 assert.deepEqual(await admin.query("SELECT stock FROM products WHERE product_id='P7';SELECT count(*) FROM orders WHERE order_id>=103;"),['1','0']);
 evidence.checks.push({name:'Failure on tea rolls back already-taken mug and commits no order',result:'passed'});
 evidence.finished=new Date().toISOString();
 console.log(JSON.stringify(evidence,null,2));
 if(process.argv[2])writeFileSync(process.argv[2],JSON.stringify(evidence,null,2)+'\n');
} finally {
 for(const {child} of sessions)child.kill('SIGTERM');
 if(running)execFileSync(join(bin,'pg_ctl'),['-D',data,'-m','fast','-w','stop'],{env,stdio:'pipe'});
 rmSync(root,{recursive:true,force:true});
}
