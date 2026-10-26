// Coordinator-run only. Explicit task fixture identity is mandatory; no PG defaults.
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(process.env.STAYCURRENT_PG_PACKAGE);
const {Client} = require('pg');
const identity = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
for (const key of ['host','port','database','user','password','clusterId','marker','markerSql']) if (identity[key] === undefined) throw Error(`Missing identity ${key}`);
if(identity.host!=='127.0.0.1' || identity.database!=='sc_crdb_performance' || identity.user!=='sc_crdb_performance_writer') throw Error('Not the owned fixture');
const out = {};
async function connect(name){
 const c=new Client({host:identity.host,port:identity.port,database:identity.database,user:identity.user,password:identity.password,ssl:false,application_name:`sc_crdb_perf_${name}`,connectionTimeoutMillis:5000,query_timeout:30000}); await c.connect(); await c.query('SET allow_unsafe_internals = true');
 const a=(await c.query('SELECT current_database() AS db, current_user AS usr, version() AS version, crdb_internal.cluster_id()::STRING AS cluster')).rows[0];
 if(a.db!==identity.database||a.usr!==identity.user||!a.version.includes('v26.2.8')||a.cluster!==identity.clusterId) {await c.end();throw Error('Identity guard failed')}
 const mark=(await c.query(identity.markerSql)).rows[0]; if(!mark||Object.values(mark)[0]!==identity.marker){await c.end();throw Error('Marker guard failed')}
 await c.query("SET statement_timeout = '20s'"); return c;
}
const c=await connect('main');
const q=async(name,sql)=>{out[name]=(await c.query(sql)).rows};
try{
 await c.query(`CREATE TABLE orders (order_id INT8 PRIMARY KEY, customer_id INT8 NOT NULL, placed_at TIMESTAMPTZ NOT NULL, status STRING NOT NULL);
 INSERT INTO orders VALUES (101,1,'2026-10-12 09:30+00','paid'),(102,2,'2026-10-14 16:05+00','paid'),(103,1,'2026-10-20 10:15+00','pending');
 INSERT INTO orders SELECT 100001+n, CASE WHEN n%10<7 THEN 1001 ELSE 1002+(17*n+20261025)%999 END, timestamptz '2026-01-01 00:00+00'+(((37*n+20261025)%365)::INT)*INTERVAL '1 day',CASE WHEN (53*n+20261025)%100 < CASE WHEN (37*n+20261025)%365 BETWEEN 273 AND 303 THEN 90 ELSE 10 END THEN 'paid' ELSE 'pending' END FROM generate_series(0,119999) AS g(n);
 CREATE INDEX orders_history ON orders(customer_id, placed_at DESC, order_id DESC);
 CREATE STATISTICS perf_stats FROM orders;`);
 const history=(idx,customer=1001,bound='2026-10-01',paid=false)=>`SELECT order_id, placed_at, status FROM orders@${idx} WHERE customer_id=${customer} AND placed_at>=timestamptz '${bound} 00:00+00' ${paid?"AND status='paid'":''} ORDER BY placed_at DESC, order_id DESC LIMIT 10`;
 await q('identity','SELECT current_database(),current_user,version(),crdb_internal.cluster_id()');
 await q('counts','SELECT count(*) FROM orders');
 await q('uncovered',`EXPLAIN ANALYZE (VERBOSE) ${history('orders_history')}`);
 await c.query('CREATE INDEX orders_history_cover ON orders(customer_id, placed_at DESC, order_id DESC) STORING(status)');
 await q('covered',`EXPLAIN ANALYZE (VERBOSE) ${history('orders_history_cover')}`);
 out.results={};
 for(const customer of [1001,1002])for(const bound of ['2026-01-01','2026-10-01'])for(const paid of [false,true]){
 const a=(await c.query(history('orders_history',customer,bound,paid))).rows;const b=(await c.query(history('orders_history_cover',customer,bound,paid))).rows;if(JSON.stringify(a)!==JSON.stringify(b))throw Error('Result mismatch');out.results[`${customer}-${bound}-${paid}`]=a;
 }
 await q('automatic','EXPLAIN (OPT, VERBOSE) '+history('orders_history_cover').replace('@orders_history_cover',''));
 await c.query(`CREATE INDEX orders_history_hash ON orders(customer_id, placed_at DESC, order_id DESC) USING HASH WITH (bucket_count=4) STORING(status);
 CREATE INDEX orders_history_prefix ON orders(customer_id, placed_at DESC, order_id DESC) USING HASH WITH (bucket_count=4, shard_columns=(customer_id)) STORING(status)`);
 await q('hashPlan',`EXPLAIN ANALYZE (VERBOSE) ${history('orders_history_hash')}`);
 await q('prefixPlan',`EXPLAIN ANALYZE (VERBOSE) ${history('orders_history_prefix')}`);
 await q('indexes','SHOW INDEXES FROM orders');
 await q('ranges','SHOW RANGES FROM TABLE orders WITH DETAILS');
 await q('hotRangesSchema',"SHOW COLUMNS FROM crdb_internal.hot_ranges");
 await q('contentionSchema',"SHOW COLUMNS FROM crdb_internal.cluster_locks");
 await c.query("CREATE TABLE products (product_id STRING PRIMARY KEY, stock INT8 NOT NULL CHECK(stock>=0)); INSERT INTO products VALUES ('P3',12),('P7',1),('P9',4)");
 const a=await connect('holder'), b=await connect('waiter');
 try{
 await a.query('BEGIN');await a.query("SELECT * FROM products WHERE product_id='P7' FOR UPDATE");
 const pending=b.query("EXPLAIN ANALYZE (VERBOSE) UPDATE products SET stock=stock-1 WHERE product_id='P7' AND stock>=1 RETURNING stock");
 await new Promise(r=>setTimeout(r,300));
 await q('locks',"SELECT * FROM crdb_internal.cluster_locks WHERE database_name=current_database()");
 await a.query('COMMIT');out.contention=(await pending).rows;
 await q('finalStock',"SELECT * FROM products ORDER BY product_id");
 }finally{await a.query('ROLLBACK').catch(()=>{});await a.end();await b.end()}
}finally{fs.writeFileSync('evidence/native-results.json',JSON.stringify(out,null,2));await c.end()}
