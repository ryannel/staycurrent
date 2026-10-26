'use strict';
// ROOT executes only after checking the exact two supplied container identities.
// No default connection, environment PG settings, credential output or provisioning.
const fs=require('node:fs'); const path=require('node:path'); const assert=require('node:assert/strict');
const crypto=require('node:crypto'); const {spawn}=require('node:child_process');
const {Client,Query}=require('/private/tmp/staycurrent-rebuild-client-runtime-20261025/node_modules/pg/lib/index.js');
const base=path.resolve(__dirname,'..');
const source=JSON.parse(fs.readFileSync(path.join(base,'input/source-native-runtime.json')));
const target=JSON.parse(fs.readFileSync(path.join(base,'input/native-runtime.json')));
const secrets=JSON.parse(fs.readFileSync(source.connection_file));
const pgConfig={host:source.host,port:source.port,database:source.database,user:source.user,password:secrets.password,ssl:false,application_name:'sc-crdb-migration-verifier',connectionTimeoutMillis:5000,query_timeout:10000,options:''};
const crConfig={...target.connection,connectionTimeoutMillis:5000,query_timeout:10000,options:''};
assert.equal(pgConfig.host,'127.0.0.1');assert.equal(pgConfig.port,61838);assert.equal(crConfig.host,'127.0.0.1');assert.equal(crConfig.port,61832);
const log=[]; const clients=[];
const S='migration_source',T='migration_target',R='migration_return';
const returnDb='sc_pg_crdb_migration_return';
const pgRole='sc_pg_crdb_migration_runtime', crRole='sc_crdb_migration_runtime';
const tables=[
 ['customers','customer_id,name','customer_id'],
 ['products','product_id,name,price,stock','product_id'],
 ['orders','order_id,customer_id,placed_at,status','order_id'],
 ['order_items','order_id,line_no,product_id,quantity,unit_price','order_id,line_no'],
 ['payments','payment_id,order_id,amount,method','payment_id'],
 ['purchase_requests','customer_id,operation,request_id,payload,result','customer_id,operation,request_id'],
 ['outbox','work_id,order_id,payload,state','work_id']
];
const payload='P7:1@20.00;P3:2@4.50',result='order=103;status=pending;total=29.00',ack='order=103;status=pending;total=29.00';
async function connect(config){const c=new Client(config);clients.push(c); await c.connect();return c;}
async function q(c,s,p){return c.query(s,p);}
async function record(label,v){log.push({label,value:v});fs.writeFileSync(path.join(__dirname,'native-results.json'),JSON.stringify(log,null,2)+'\n');}
async function copy(c,sql,data){return new Promise((resolve,reject)=>{const chunks=[];let size=0;const query=new Query(sql,(e,r)=>e?reject(e):resolve(data===undefined?Buffer.concat(chunks):r));query.handleCopyData=m=>{size+=m.chunk.length;if(size>65536)throw Error('bounded fixture COPY exceeded 64 KiB');chunks.push(m.chunk);};if(data!==undefined)query.handleCopyInResponse=connection=>{assert(data.length<=65536);connection.sendCopyFromChunk(data);connection.endCopyFrom();};c.query(query);});}
function ddl(schema){return `CREATE SCHEMA ${schema};
CREATE TABLE ${schema}.customers(customer_id INT4 PRIMARY KEY,name TEXT NOT NULL);
CREATE TABLE ${schema}.products(product_id TEXT PRIMARY KEY,name TEXT NOT NULL,price NUMERIC(8,2) NOT NULL CHECK(price>=0),stock INT4 NOT NULL CHECK(stock>=0));
CREATE TABLE ${schema}.orders(order_id INT4 PRIMARY KEY,customer_id INT4 NOT NULL REFERENCES ${schema}.customers,placed_at TIMESTAMPTZ NOT NULL,status TEXT NOT NULL CHECK(status IN ('pending','paid','cancelled')));
CREATE TABLE ${schema}.order_items(order_id INT4 REFERENCES ${schema}.orders,line_no INT4,product_id TEXT NOT NULL REFERENCES ${schema}.products,quantity INT4 NOT NULL CHECK(quantity>0),unit_price NUMERIC(8,2) NOT NULL,PRIMARY KEY(order_id,line_no));
CREATE TABLE ${schema}.payments(payment_id INT4 PRIMARY KEY,order_id INT4 NOT NULL REFERENCES ${schema}.orders,amount NUMERIC(8,2) NOT NULL CHECK(amount>0),method TEXT NOT NULL);
CREATE TABLE ${schema}.purchase_requests(customer_id INT4 REFERENCES ${schema}.customers,operation TEXT,request_id TEXT,payload TEXT NOT NULL,result TEXT,PRIMARY KEY(customer_id,operation,request_id));
CREATE TABLE ${schema}.outbox(work_id TEXT PRIMARY KEY,order_id INT4 NOT NULL REFERENCES ${schema}.orders,payload TEXT NOT NULL,state TEXT NOT NULL CHECK(state IN ('ready','sent')));`;}
async function canonical(c,schema){const all={};for(const [name,cols,order] of tables){all[name]=(await q(c,`SELECT ${cols} FROM ${schema}.${name} ORDER BY ${order}`)).rows;}return JSON.parse(JSON.stringify(all));}
async function exportAll(c,schema,label,pg){await q(c,pg?'BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY':'BEGIN ISOLATION LEVEL SERIALIZABLE READ ONLY');try {const files={};for(const [name,cols,order] of tables){const b=await copy(c,`COPY (SELECT ${cols} FROM ${schema}.${name} ORDER BY ${order}) TO STDOUT WITH (FORMAT CSV, HEADER TRUE)`);files[name]=b;fs.writeFileSync(path.join(__dirname,`${label}-${name}.csv`),b);}const state=await canonical(c,schema);await q(c,'COMMIT');return {files,state};}catch(e){await q(c,'ROLLBACK');throw e;}}
async function load(c,schema,files){for(const [name,cols] of tables){await copy(c,`COPY ${schema}.${name} (${cols}) FROM STDIN WITH (FORMAT CSV, HEADER TRUE)`,files[name]);}}
async function grants(c,schema,role,open){await q(c,`${open?'GRANT':'REVOKE'} SELECT,INSERT,UPDATE,DELETE ON ALL TABLES IN SCHEMA ${schema} ${open?'TO':'FROM'} ${role}`);}
async function expectError(c,sql,code){let got;try{await q(c,sql);}catch(e){got=e.code;}assert.equal(got,code);return got;}
// Actual PG runtime connection via task container's Unix socket trust. No SET ROLE.
function pgRuntime(sql,db=source.database){return new Promise((resolve,reject)=>{const p=spawn('docker',['--config','/private/tmp/staycurrent-rebuild-docker-public-config','--host','unix:///Users/ryannel/.docker/run/docker.sock','exec','-i',source.container_id,'psql','-XAt','-v','ON_ERROR_STOP=1','-U',pgRole,'-d',db],{env:{PATH:process.env.PATH},stdio:['pipe','pipe','pipe']});let out='',err='';p.stdout.on('data',b=>out+=b);p.stderr.on('data',b=>err+=b);p.on('error',reject);p.on('close',code=>resolve({code,out:out.trim(),err:err.trim()}));p.stdin.end(sql);});}
async function purchase(c,schema,changed=false,decline=false){await q(c,'BEGIN ISOLATION LEVEL SERIALIZABLE');try {const claim=await q(c,`INSERT INTO ${schema}.purchase_requests VALUES(1,'purchase','purchase-103',$1,NULL) ON CONFLICT(customer_id,operation,request_id) DO NOTHING RETURNING request_id`,[payload]);const existing=claim.rowCount?{rowCount:0}:await q(c,`SELECT payload,result FROM ${schema}.purchase_requests WHERE customer_id=1 AND operation='purchase' AND request_id='purchase-103'`);if(existing.rowCount){if(existing.rows[0].payload!==(changed?'changed':payload))throw Error('request payload mismatch');await q(c,'COMMIT');return existing.rows[0].result;}
 // Guard each stock change and roll everything back if either product cannot supply it.
 assert.equal((await q(c,`UPDATE ${schema}.products SET stock=stock-2 WHERE product_id='P3' AND stock>=2`)).rowCount,1);
 const mug=await q(c,`UPDATE ${schema}.products SET stock=stock-1 WHERE product_id='P7' AND stock>=1`);if(mug.rowCount!==1)throw Error('out of stock');
 await q(c,`INSERT INTO ${schema}.orders VALUES(103,1,'2026-10-20 10:15:00+00','pending')`);
 await q(c,`INSERT INTO ${schema}.order_items VALUES(103,1,'P7',1,20.00),(103,2,'P3',2,4.50)`);
 await q(c,`UPDATE ${schema}.purchase_requests SET result=$1 WHERE customer_id=1 AND operation='purchase' AND request_id='purchase-103'`,[result]);
 await q(c,`INSERT INTO ${schema}.outbox VALUES('order-103-ack',103,$1,'ready')`,[ack]);await q(c,'COMMIT');return result;
 }catch(e){await q(c,'ROLLBACK');if(changed||decline)return e.message;throw e;}}
(async()=>{let p,c,r,runtime;
 try{
 p=await connect(pgConfig); c=await connect(crConfig);
 const pi=(await q(p,"SELECT version(),current_database() db,current_user principal,current_setting('cluster_name') cluster")).rows[0];
 assert.equal(pi.db,source.database);assert.equal(pi.principal,source.user);assert.equal(pi.cluster,source.cluster_name);assert(pi.version.includes('18.6'));
 await q(c,'SET allow_unsafe_internals=true');
 const ci=(await q(c,'SELECT version(),current_database() db,current_user principal,crdb_internal.cluster_id()::TEXT cluster')).rows[0];
 assert.equal(ci.db,target.database);assert.equal(ci.principal,target.user);assert.equal(ci.cluster,target.cluster_id);assert(ci.version.includes('v26.2.8'));await record('exact SQL identities',{pi,ci});
 await q(p,"SET TIME ZONE 'UTC'");await q(c,"SET TIME ZONE 'UTC'");
 await q(p,`CREATE ROLE ${pgRole} LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION`);
 await q(c,`CREATE USER ${crRole}`);
 assert.equal((await q(p,'SELECT datname FROM pg_database WHERE datname=$1',[returnDb])).rowCount,0);
 await q(p,`CREATE DATABASE ${returnDb}`);r=await connect({...pgConfig,database:returnDb});
 assert.equal((await q(r,'SELECT current_database() db')).rows[0].db,returnDb);await q(r,"SET TIME ZONE 'UTC'");
 // These three uniquely owned schemas must be absent. Never overwrite an existing/default database.
 for(const [client,schema] of [[p,S],[r,R],[c,T]]){assert.equal((await q(client,'SELECT schema_name FROM information_schema.schemata WHERE schema_name=$1',[schema])).rowCount,0);await q(client,ddl(schema));}
 await q(p,`REVOKE ALL ON SCHEMA ${S} FROM PUBLIC; GRANT USAGE ON SCHEMA ${S} TO ${pgRole}`);
 await q(r,`REVOKE ALL ON SCHEMA ${R} FROM PUBLIC; GRANT USAGE ON SCHEMA ${R} TO ${pgRole}`);
 await q(c,`REVOKE ALL ON SCHEMA ${T} FROM PUBLIC; GRANT USAGE ON SCHEMA ${T} TO ${crRole}`);
 await q(p,`INSERT INTO ${S}.customers VALUES(1,'Mina Shah'),(2,'Tariq Aziz'),(3,'Edda Berg'); INSERT INTO ${S}.products VALUES('P3','Green tea, 50 g',4.50,12),('P7','Blue mug',20.00,1),('P9','Teapot',35.00,4); INSERT INTO ${S}.orders VALUES(101,1,'2026-10-12 09:30+00','paid'),(102,2,'2026-10-14 16:05+00','paid'); INSERT INTO ${S}.order_items VALUES(101,1,'P3',1,4.50),(101,2,'P9',1,35.00),(102,1,'P7',2,20.00); INSERT INTO ${S}.payments VALUES(501,101,30.00,'card'),(502,101,9.50,'gift card'),(503,102,40.00,'card')`);
 await grants(p,S,pgRole,true);
 assert.equal((await pgRuntime(`SELECT current_user; UPDATE ${S}.products SET name='Teapot (late writer)' WHERE product_id='P9';`)).code,0);
 assert.equal((await q(p,`SELECT name FROM ${S}.products WHERE product_id='P9'`)).rows[0].name,'Teapot (late writer)');
 await q(p,`UPDATE ${S}.products SET name='Teapot' WHERE product_id='P9'`);
 await record('source runtime before closure','Actual runtime changed P9 name despite a model route switch; administrative reset restores Teapot.');
 // One established snapshot holds the earlier values; it does not contain a later commit.
 const snap=await connect(pgConfig);await q(snap,'BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
 const earlier=await canonical(snap,S);await q(p,`UPDATE ${S}.products SET price=22.00 WHERE product_id='P7'`);
 assert.deepEqual(await canonical(snap,S),earlier);assert.notDeepEqual(await canonical(p,S),earlier);await q(snap,'COMMIT');
 await q(p,`UPDATE ${S}.products SET price=20.00 WHERE product_id='P7'`);await record('snapshot and late-commit counterexample','Established source snapshot kept P7 at 20.00 while later source read saw committed 22.00; reset before final export.');
 await grants(p,S,pgRole,false);
 const stale=await pgRuntime(`UPDATE ${S}.products SET name='Teapot (late writer)' WHERE product_id='P9';`);assert.notEqual(stale.code,0);assert(stale.err.includes('permission denied'));await record('source closed runtime refusal',{code:stale.code,message:'permission denied'});
 const f=await exportAll(p,S,'forward',true);await load(c,T,f.files);assert.deepEqual(await canonical(c,T),f.state);await record('forward full keys and values equal',Object.fromEntries(Object.entries(f.state).map(([k,v])=>[k,v.length])));
 // Equal row counts miss corruption; full comparison catches changed content.
 await q(c,`UPDATE ${T}.products SET name='Wrong mug' WHERE product_id='P7'`);assert.notDeepEqual(await canonical(c,T),f.state);await q(c,`UPDATE ${T}.products SET name='Blue mug' WHERE product_id='P7'`);await record('equal-count counterexample','P7 name corruption detected by complete-value comparison.');
 runtime=await connect({...crConfig,user:crRole});assert.equal((await q(runtime,'SELECT current_user')).rows[0].current_user,crRole);
 await record('target closed runtime refusal',await expectError(runtime,`UPDATE ${T}.products SET stock=stock WHERE product_id='P9'`,'42501'));
 await grants(c,T,crRole,true);
 await record('target purchase result',await purchase(runtime,T));assert.equal(await purchase(runtime,T),result);
 const before=await canonical(c,T);const mismatch=await purchase(runtime,T,true);assert.equal(mismatch,'request payload mismatch');assert.deepEqual(await canonical(c,T),before);await record('repeat and changed payload','Repeat returns retained result; changed payload rejected without data change.');
 assert.deepEqual(before.products.map(x=>x.stock),[10,0,4]);assert.equal(before.orders.length,3);assert.equal(before.order_items.length,5);assert.equal(before.payments.length,3);assert.equal(before.outbox[0].work_id,'order-103-ack');
 // Independent attempt with a new identity: tea guard changes 10->8, mug refuses, ROLLBACK restores tea.
 await q(runtime,'BEGIN ISOLATION LEVEL SERIALIZABLE');assert.equal((await q(runtime,`UPDATE ${T}.products SET stock=stock-2 WHERE product_id='P3' AND stock>=2`)).rowCount,1);assert.equal((await q(runtime,`UPDATE ${T}.products SET stock=stock-1 WHERE product_id='P7' AND stock>=1`)).rowCount,0);await q(runtime,'ROLLBACK');assert.deepEqual(await canonical(c,T),before);await record('unavailable purchase rollback','Tea remains 10, mug 0; no new order/payment/request/work.');
 assert.notDeepEqual(await canonical(p,S),before);await record('old PostgreSQL source stale','Source still has 2 orders, stock 12/1/4, no purchase-103 or order-103-ack.');
 await grants(c,T,crRole,false);await record('already connected target runtime after closure',await expectError(runtime,`UPDATE ${T}.products SET stock=stock WHERE product_id='P9'`,'42501'));
 const back=await exportAll(c,T,'return',false);await load(r,R,back.files);assert.deepEqual(await canonical(r,R),back.state);
 await grants(r,R,pgRole,true);const replay=await pgRuntime(`BEGIN ISOLATION LEVEL SERIALIZABLE; INSERT INTO ${R}.purchase_requests VALUES(1,'purchase','purchase-103','${payload}',NULL) ON CONFLICT(customer_id,operation,request_id) DO NOTHING RETURNING request_id; SELECT payload,result FROM ${R}.purchase_requests WHERE customer_id=1 AND operation='purchase' AND request_id='purchase-103'; SELECT work_id,payload,state FROM ${R}.outbox WHERE work_id='order-103-ack'; COMMIT;`,returnDb);assert.equal(replay.code,0);assert(replay.out.includes(result));assert(replay.out.includes('order-103-ack'));assert.deepEqual(await canonical(r,R),before);await record('return copy and actual runtime retained result',replay.out);
 await record('native arithmetic',{postgres:(await q(p,'SELECT (20::INT4 / 3::INT4)::TEXT value')).rows[0],cockroach:(await q(c,'SELECT (20::INT4 / 3::INT4)::TEXT value')).rows[0],explicit:(await q(c,'SELECT (20::DECIMAL / 3)::TEXT value')).rows[0]});
 await record('native integer range',{wide:(await q(c,'SELECT (2147483648::INT)::TEXT value')).rows[0],int4:await expectError(c,'SELECT 2147483648::INT4','22003'),postgres:await expectError(p,'SELECT 2147483648::INTEGER','22003')});
 await record('limits','Seven-table offline model; administrative load/acceptance, actual restricted runtime SQL privileges. PG Unix-socket trust and fixture-only CRDB insecure identity selection do not test production authentication. No replication, distributed survival, provider, retry scheduling, timings or production fencing evidence.');
 }catch(e){await record('FAILED',{name:e.name,code:e.code||null,message:e.message});process.exitCode=1;}
 finally{for(const client of clients.reverse()){try{await client.end();}catch{}}}
})();
