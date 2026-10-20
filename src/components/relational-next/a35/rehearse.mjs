// Disposable PostgreSQL 18 security drill. Node >= 24, pg 8.23.1, OpenSSL.
// node rehearse.mjs --pg-bin /path/to/bin --pg-module /path/to/pg/esm/index.mjs --evidence ./new.json
import {mkdtemp,writeFile,readFile,chmod,rm,copyFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,dirname} from 'node:path';
import {pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createServer} from 'node:net';
const args=Object.fromEntries(process.argv.slice(2).reduce((a,x,i,v)=>i%2?a:[...a,[x.replace(/^--/,''),v[i+1]]],[]));
if(!args['pg-bin']||!args['pg-module']||!args.evidence)throw Error('Required: --pg-bin, --pg-module, --evidence (new filename)');
const out=resolve(args.evidence); const output=await import('node:fs/promises').then(f=>f.open(out,'wx'));
const driverPath=resolve(args['pg-module']);
const driverVersion=JSON.parse(await readFile(join(dirname(driverPath),'..','package.json'),'utf8')).version;
if(driverVersion!=='8.23.1')throw Error('This worksheet requires pg 8.23.1, got '+driverVersion);
const {Client}=await import(pathToFileURL(driverPath).href);
const work=await mkdtemp(join(tmpdir(),'staycurrent-a35-')); const data=join(work,'data');
const evidence={date:new Date().toISOString(),node:process.version,pgDriver:driverVersion,work,checks:[],commands:[],cleanup:{}};
const live=new Set(); let started=false;
function cmd(bin,argv){const value=execFileSync(bin==='openssl'?bin:join(args['pg-bin'],bin),argv,{encoding:'utf8',timeout:30000,stdio:['ignore','pipe','pipe']}); evidence.commands.push({bin,args:argv,stdout:value});return value;}
async function check(label,fn,code){let result;try{result=await fn();}catch(e){if(!code||!(e.code===code||e.message.includes(code)))throw e;evidence.checks.push({label,ok:true,rejected:e.code??null,message:e.message});return;}if(code)throw Error('Expected rejection was not observed: '+label);const compact=Array.isArray(result)?result.map(r=>({command:r.command,rows:r.rows})):result?.rows??result;evidence.checks.push({label,ok:true,result:compact});return result;}
async function connect(user='drill',password='dummy-one',extra={}){const c=new Client({host:'127.0.0.1',port,database:'shop',user,password,connectionTimeoutMillis:4000,query_timeout:5000,ssl:{ca:await readFile(join(work,'ca1.crt'),'utf8'),servername:'localhost',rejectUnauthorized:true},...extra});c.on('error',()=>{});live.add(c);await c.connect();return c;}
async function once(user,password,sql,extra={}){const c=await connect(user,password,extra);try{return await c.query(sql);}finally{await c.end();live.delete(c);}}
const port=await new Promise((ok,fail)=>{const s=createServer();s.on('error',fail);s.listen(0,'127.0.0.1',()=>{const p=s.address().port;s.close(()=>ok(p));});});
try{
 evidence.version=cmd('postgres',['--version']); evidence.openssl=cmd('openssl',['version']);
 for(const n of [1,2]){
  cmd('openssl',['req','-x509','-newkey','rsa:2048','-nodes','-keyout',join(work,`ca${n}.key`),'-out',join(work,`ca${n}.crt`),'-days','2','-subj',`/CN=a35 disposable CA ${n}`]);
  cmd('openssl',['req','-newkey','rsa:2048','-nodes','-keyout',join(work,`server${n}.key`),'-out',join(work,`server${n}.csr`),'-subj','/CN=localhost']);
  await writeFile(join(work,'extensions'),'subjectAltName=DNS:localhost\nextendedKeyUsage=serverAuth\n');
  cmd('openssl',['x509','-req','-in',join(work,`server${n}.csr`),'-CA',join(work,`ca${n}.crt`),'-CAkey',join(work,`ca${n}.key`),'-CAcreateserial','-out',join(work,`server${n}.crt`),'-days','2','-extfile',join(work,'extensions')]);
 }
 cmd('initdb',['-D',data,'-U','drill','--locale=C','--encoding=UTF8','--auth-local=trust','--auth-host=scram-sha-256']);
 await copyFile(join(work,'server1.key'),join(data,'server.key'));await chmod(join(data,'server.key'),0o600);await copyFile(join(work,'server1.crt'),join(data,'server.crt'));
 const config=`\nlisten_addresses='127.0.0.1'\nport=${port}\nunix_socket_directories='${work}'\nssl=on\nssl_cert_file='server.crt'\nssl_key_file='server.key'\npassword_encryption='scram-sha-256'\nmax_connections=12\nshared_buffers='32MB'\nstatement_timeout='5s'\nlog_connections='all'\nlog_disconnections=on\nlog_line_prefix='%m [%p] user=%u db=%d app=%a '\nlog_statement='none'\n`;
 await writeFile(join(data,'postgresql.auto.conf'),config);
 const hba=`local all drill trust\nlocal all all reject\nhostnossl all all 127.0.0.1/32 reject\nhostssl shop drill,app_old,app_new,reporter,migrator,outsider 127.0.0.1/32 scram-sha-256\nhost all all 127.0.0.1/32 reject\n`;
 await writeFile(join(data,'pg_hba.conf'),hba);evidence.configuration={config,hba,port,scope:'loopback only; local drill trust inside private temporary directory'};
 cmd('pg_ctl',['-D',data,'-l',join(work,'server.log'),'-w','-t','15','start']);started=true;
 cmd('createdb',['-h',work,'-p',String(port),'-U','drill','shop']);
 cmd('psql',['-X','-h',work,'-p',String(port),'-U','drill','-d','shop','-v','ON_ERROR_STOP=1','-c',`ALTER ROLE drill PASSWORD 'dummy-one';`]);
 const admin=await connect();
 await admin.query(`REVOKE ALL ON DATABASE shop FROM PUBLIC; REVOKE CREATE ON SCHEMA public FROM PUBLIC;
 CREATE ROLE shop_owner NOLOGIN; CREATE ROLE order_work NOLOGIN; CREATE ROLE report_work NOLOGIN;
 CREATE ROLE app_old LOGIN PASSWORD 'dummy-one'; CREATE ROLE app_new LOGIN PASSWORD 'dummy-two';
 CREATE ROLE reporter LOGIN PASSWORD 'dummy-one'; CREATE ROLE migrator LOGIN PASSWORD 'dummy-one'; CREATE ROLE outsider LOGIN PASSWORD 'dummy-one';
 GRANT CONNECT ON DATABASE shop TO app_old,app_new,reporter,migrator;
 GRANT order_work TO app_old,app_new WITH INHERIT TRUE, SET FALSE;
 GRANT report_work TO reporter WITH INHERIT TRUE, SET FALSE;
 GRANT shop_owner TO migrator WITH INHERIT FALSE, SET TRUE;
 CREATE SCHEMA orders AUTHORIZATION shop_owner; CREATE SCHEMA reports AUTHORIZATION shop_owner;
 SET ROLE shop_owner;
 CREATE TABLE orders.orders(id integer PRIMARY KEY, status text, address text);
 INSERT INTO orders.orders VALUES(101,'paid','dummy address');
 CREATE VIEW reports.order_status AS SELECT id,status FROM orders.orders;
 GRANT USAGE ON SCHEMA orders TO order_work; GRANT SELECT,INSERT,UPDATE ON orders.orders TO order_work;
 GRANT USAGE ON SCHEMA reports TO report_work; GRANT SELECT ON reports.order_status TO report_work;
 ALTER DEFAULT PRIVILEGES IN SCHEMA orders GRANT SELECT,INSERT,UPDATE ON TABLES TO order_work;
 ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
 RESET ROLE;`);
 await check('settings and identity',()=>admin.query(`SELECT version(),current_user,current_database(),inet_server_addr(),inet_server_port();`));
 const app=await connect('app_old');const reporter=await connect('reporter');const migration=await connect('migrator');
 await check('application reads and updates',()=>app.query(`UPDATE orders.orders SET status='packed' WHERE id=101 RETURNING id,status;`));
 await check('reporter approved projection',()=>reporter.query('SELECT * FROM reports.order_status'));
 await check('reporter raw addresses rejected',()=>reporter.query('SELECT address FROM orders.orders'),'42501');
 await check('app DDL rejected',()=>app.query('ALTER TABLE orders.orders ADD COLUMN stolen text'),'42501');
 await check('app cannot become owner',()=>app.query('SET ROLE shop_owner'),'42501');
 await check('app cannot delegate role membership',()=>app.query('GRANT order_work TO outsider'),'42501');
 await check('migrator has no implicit owner authority',()=>migration.query('CREATE TABLE orders.before_set(id integer)'),'42501');
 await check('app cannot grant effective access',async()=>{const r=await app.query('GRANT SELECT ON orders.orders TO outsider');const q=await admin.query("SELECT has_table_privilege('outsider','orders.orders','SELECT') AS granted");if(q.rows[0].granted)throw Error('unauthorised grant succeeded');return q;});
 await check('migrator explicitly becomes owner',()=>migration.query('SET ROLE shop_owner; CREATE TABLE orders.new_orders(id integer); CREATE FUNCTION orders.hidden() RETURNS integer LANGUAGE sql AS $$SELECT 1$$;'));
 await check('new table default grants apply',()=>app.query('SELECT * FROM orders.new_orders'));
 await check('new routine PUBLIC execute removed',()=>app.query('SELECT orders.hidden()'),'42501');
 await check('created object owner',()=>admin.query("SELECT relname,pg_get_userbyid(relowner) AS owner FROM pg_class WHERE oid='orders.new_orders'::regclass"));
 await check('app creates no schema objects',()=>app.query('CREATE TABLE public.unwanted(id integer)'),'42501');
 await check('ungranted CONNECT rejected',()=>once('outsider','dummy-one','SELECT 1'),'42501');
 await check('plaintext TCP rejected',()=>once('app_old','dummy-one','SELECT 1',{ssl:false}),'28000');
 await check('wrong password rejected',()=>once('app_old','incorrect','SELECT 1'),'28P01');
 await check('wrong TLS server name rejected',async()=>once('app_old','dummy-one','SELECT 1',{ssl:{ca:await readFile(join(work,'ca1.crt'),'utf8'),servername:'wrong.invalid',rejectUnauthorized:true}}),'ERR_TLS_CERT_ALTNAME_INVALID');
 await check('untrusted TLS issuer rejected',async()=>once('app_old','dummy-one','SELECT 1',{ssl:{ca:await readFile(join(work,'ca2.crt'),'utf8'),servername:'localhost',rejectUnauthorized:true}}),'UNABLE_TO_VERIFY_LEAF_SIGNATURE');
 await check('encrypted application connection',()=>app.query('SELECT ssl,version,cipher FROM pg_stat_ssl WHERE pid=pg_backend_pid()'));
 const passfile=join(work,'pgpass');await writeFile(passfile,`localhost:${port}:shop:app_old:dummy-one\n`);await chmod(passfile,0o600);
 const libpq=`host=localhost hostaddr=127.0.0.1 port=${port} dbname=shop user=app_old passfile=${passfile} sslmode=verify-full sslrootcert=${join(work,'ca1.crt')}`;
 await check('libpq verifies expected hostname',()=>cmd('psql',['-X','-w',libpq,'-v','ON_ERROR_STOP=1','-c','SELECT id FROM orders.orders']));
 await check('libpq rejects wrong hostname',()=>cmd('psql',['-X','-w',libpq.replace('host=localhost','host=wrong.invalid'),'-c','SELECT 1']),'does not match host name');
 await admin.query("ALTER ROLE app_old PASSWORD 'dummy-replaced'");
 await check('old password new connection fails',()=>once('app_old','dummy-one','SELECT 1'),'28P01');
 await check('existing session after password change',()=>app.query('SELECT id FROM orders.orders'));
 await admin.query("ALTER ROLE app_old VALID UNTIL '2000-01-01'");
 await check('expired password new connection fails',()=>once('app_old','dummy-replaced','SELECT 1'),'28P01');
 await check('existing session after password expiry',()=>app.query('SELECT id FROM orders.orders'));
 await admin.query("ALTER ROLE app_old VALID UNTIL 'infinity'; ALTER ROLE app_old NOLOGIN");
 await check('NOLOGIN rejects replacement password',()=>once('app_old','dummy-replaced','SELECT 1'),'28000');
 await check('existing session after NOLOGIN',()=>app.query('SELECT id FROM orders.orders'));
 await admin.query('REVOKE order_work FROM app_old');
 await check('membership revoke removes subsequent table access',()=>app.query('SELECT id FROM orders.orders'),'42501');
 await check('new identity performs permitted work',()=>once('app_new','dummy-two','SELECT id FROM orders.orders'));
 const oldPid=app.processID;
 await check('terminate selected retired session',()=>admin.query('SELECT pg_terminate_backend($1,2000) AS ended',[oldPid]));
 await check('retired session absent',()=>admin.query('SELECT count(*)::int AS remaining FROM pg_stat_activity WHERE pid=$1',[oldPid]));
 const ca1=await readFile(join(work,'ca1.crt'),'utf8'),ca2=await readFile(join(work,'ca2.crt'),'utf8');
 const before=await connect('app_new','dummy-two');
 await copyFile(join(work,'server2.key'),join(data,'server.key'));await chmod(join(data,'server.key'),0o600);await copyFile(join(work,'server2.crt'),join(data,'server.crt'));
 cmd('pg_ctl',['-D',data,'reload']);
 // Wait for a fresh TLS handshake to observe the new certificate, not just reload acknowledgement.
 let rotated=false;for(let i=0;i<30&&!rotated;i++){try{await once('app_new','dummy-two','SELECT 1',{ssl:{ca:ca2,servername:'localhost',rejectUnauthorized:true}});rotated=true;}catch{await new Promise(r=>setTimeout(r,50));}}if(!rotated)throw Error('certificate reload deadline');
 await check('old trust root rejects rotated server',()=>once('app_new','dummy-two','SELECT 1',{ssl:{ca:ca1,servername:'localhost',rejectUnauthorized:true}}),'UNABLE_TO_VERIFY_LEAF_SIGNATURE');
 await check('overlap trust accepts rotated server',()=>once('app_new','dummy-two','SELECT 1',{ssl:{ca:ca1+ca2,servername:'localhost',rejectUnauthorized:true}}));
 await check('new trust root accepts rotated server',()=>once('app_new','dummy-two','SELECT 1',{ssl:{ca:ca2,servername:'localhost',rejectUnauthorized:true}}));
 await check('old established TLS session remains usable',()=>before.query('SELECT id FROM orders.orders'));
 await admin.query("SET log_statement='ddl'");
 await admin.query('CREATE TABLE public.audit_marker(id integer)');
 await admin.query('DROP TABLE public.audit_marker');
 await admin.query("SET log_statement='none'");
 evidence.completed=true;
}catch(e){evidence.failure={message:e.message,stack:e.stack};process.exitCode=1;}
finally{
 for(const c of live){try{await c.end();}catch{}};
 if(started){try{cmd('pg_ctl',['-D',data,'-m','fast','-w','-t','15','stop']);evidence.cleanup.stopped=true;}catch(e){evidence.cleanup.stopError=e.message;process.exitCode=1;}}
 try{evidence.serverLog=await readFile(join(work,'server.log'),'utf8');}catch{}
 if(!started||evidence.cleanup.stopped){await rm(work,{recursive:true,force:true});evidence.cleanup.removed=true;}
 // Fixture passwords only. Redact them even though they are never production credentials.
 await output.writeFile(JSON.stringify(evidence,null,2).replace(/dummy-(one|two|replaced)/g,'[dummy credential]'));await output.close();
 console.log(JSON.stringify({completed:evidence.completed,checks:evidence.checks.length,cleanup:evidence.cleanup,evidence:out,failure:evidence.failure?.message}));
}
