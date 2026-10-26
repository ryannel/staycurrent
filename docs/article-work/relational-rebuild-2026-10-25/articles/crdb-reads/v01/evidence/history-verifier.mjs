import fs from 'node:fs';
import crypto from 'node:crypto';
import pg from '/private/tmp/staycurrent-rebuild-client-runtime-20261025/node_modules/pg/lib/index.js';
const cfg=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const out={verifier_sha256:crypto.createHash('sha256').update(fs.readFileSync(new URL(import.meta.url))).digest('hex'),started:new Date().toISOString(),purpose:'Only the article’s exact multi-statement follower_read_timestamp price and order_items snippet; earlier isolation and other checks are retained.',observations:[]};
const assert=(x,m)=>{if(!x)throw Error(m)};let client;
try{
 assert(cfg.host==='127.0.0.1'&&Number.isInteger(cfg.port)&&cfg.port>1024&&cfg.port<65536&&cfg.ssl===false,'Unexpected transport');
 assert(cfg.database.startsWith('sc_crdb_reads')&&cfg.user.startsWith('sc_crdb_reads')&&cfg.database!=='defaultdb','Unexpected database/principal');
 assert(/^[0-9a-f-]{36}$/.test(cfg.expectedClusterId)&&cfg.expectedMarker.startsWith('staycurrent-crdb-reads-20261025'),'Missing root fixture guard');
 client=new pg.Client({...cfg,connectionTimeoutMillis:5000,query_timeout:10000});await client.connect();
 const guard=(await client.query('SELECT current_database() AS db,current_user AS principal,version()')).rows[0];
 assert(guard.db===cfg.database&&guard.principal===cfg.user&&guard.version.includes('v26.2.8'),'Identity mismatch');
 await client.query('SET allow_unsafe_internals=true');
 const id=(await client.query('SELECT crdb_internal.cluster_id()::STRING AS id')).rows[0].id;
 assert(id===cfg.expectedClusterId,'UUID mismatch');
 const marker=(await client.query('SELECT marker FROM public.fixture_guard')).rows[0]?.marker;
 assert(marker===cfg.expectedMarker,'Marker mismatch');out.guard={...guard,id,marker,host:cfg.host,port:cfg.port};
 await client.query("SET statement_timeout='8s'");
 await client.query('CREATE SCHEMA historical_snippet; SET search_path=historical_snippet,public');
 await client.query("CREATE TABLE products(product_id STRING PRIMARY KEY,price DECIMAL(8,2)); CREATE TABLE order_items(order_id INT,line_no INT,product_id STRING,quantity INT,unit_price DECIMAL(8,2),PRIMARY KEY(order_id,line_no)); INSERT INTO products VALUES('P7',20.00); INSERT INTO order_items VALUES(103,1,'P7',1,20.00),(103,2,'P3',2,4.50)");
 await new Promise(r=>setTimeout(r,5000));
 await client.query("UPDATE products SET price=22.00 WHERE product_id='P7'");
 for(const sql of ['BEGIN','SET TRANSACTION AS OF SYSTEM TIME follower_read_timestamp()',"SELECT price FROM products WHERE product_id = 'P7'",'SELECT line_no, product_id, quantity, unit_price FROM order_items WHERE order_id = 103 ORDER BY line_no','COMMIT']){const r=await client.query(sql);out.observations.push({sql,rows:r.rows})}
 const price=out.observations[2].rows[0].price, lines=out.observations[3].rows;
 assert(price==='20.00','Expected pre-update price at historical time');
 assert(lines.length===2&&lines[0].product_id==='P7'&&lines[0].quantity==='1'&&lines[0].unit_price==='20.00'&&lines[1].product_id==='P3'&&lines[1].quantity==='2'&&lines[1].unit_price==='4.50','Order lines mismatch');
 const current=await client.query("SELECT price FROM products WHERE product_id='P7'");out.current=current.rows;assert(current.rows[0].price==='22.00','Current price mismatch');out.success=true;
}catch(e){out.success=false;out.failure={message:e.message,code:e.code};process.exitCode=1}
finally{if(client){try{await client.query('ROLLBACK')}catch{}try{await client.end()}catch{}}out.finished=new Date().toISOString();fs.writeFileSync(process.argv[3],JSON.stringify(out,null,2)+'\n')}
