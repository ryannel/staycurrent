import assert from 'node:assert/strict';
import {spawn,execFileSync} from 'node:child_process';
import {mkdtemp,mkdir,rm,writeFile,stat} from 'node:fs/promises';
import {createServer} from 'node:net';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {setTimeout as delay} from 'node:timers/promises';
import {createClient} from 'redis';
const binary=process.env.REDIS_SERVER||'redis-server';
assert.match(execFileSync(binary,['--version'],{encoding:'utf8'}),/v=8\.2\.2\b/,'Use Redis 8.2.2 for this lab');
const dir=await mkdtemp(path.join(process.platform==='darwin'?'/tmp':tmpdir(),'sc-recovery-'));
const processes=[],clients=[],sockets=new Set();let blackhole;
let aborted=false;
function abort(){aborted=true;for(const c of clients)if(c.isOpen)c.destroy();for(const p of processes)p.child.kill('SIGKILL');}
process.once('SIGINT',abort);process.once('SIGTERM',abort);
const deadline=setTimeout(abort,75000);
async function until(check,label,ms=15000){const end=Date.now()+ms;while(Date.now()<end){if(aborted)throw new Error('Lab interrupted or exceeded 75 seconds');if(await check())return;await delay(40);}throw new Error(`Timed out: ${label}`);}
async function unusedPort(){const s=createServer();await new Promise((r,j)=>s.listen(0,'127.0.0.1',r).once('error',j));const port=s.address().port;await new Promise(r=>s.close(r));return port;}
async function start(name,{port=0,extra=[],sentinel=false,restart=false}={}){
 const home=path.join(dir,name),socket=path.join(home,'s.sock');await mkdir(home,{recursive:true});
 // All clients use this owned Unix socket; ephemeral TCP ports are only for replication/Sentinel.
 if(restart)await rm(socket,{force:true});
 const options=['--port',String(port),'--bind','127.0.0.1','--protected-mode','yes','--unixsocket',socket,'--unixsocketperm','700','--dir',home];
 let args;
 if(sentinel){const config=path.join(home,'sentinel.conf');await writeFile(config,`port ${port}\nbind 127.0.0.1\nprotected-mode yes\nunixsocket ${socket}\nunixsocketperm 700\ndir ${home}\nsentinel monitor cache-primary 127.0.0.1 ${extra[0]} 2\nsentinel down-after-milliseconds cache-primary 600\nsentinel failover-timeout cache-primary 3000\nsentinel parallel-syncs cache-primary 1\n`);args=[config,'--sentinel'];}
 else args=[...options,'--save','','--appendonly','no','--repl-diskless-sync-delay','0',...extra];
 const child=spawn(binary,args,{stdio:['ignore','pipe','pipe']});let output='';child.stdout.on('data',d=>output+=d);child.stderr.on('data',d=>output+=d);
 const closed=new Promise((r,j)=>{child.once('close',r);child.once('error',j);});const item={child,closed,port};processes.push(item);
 await until(async()=>{if(child.exitCode!==null)throw new Error(output);return !!await stat(socket).catch(()=>null);},`${name} socket`);
 const client=createClient({socket:{path:socket,reconnectStrategy:false,connectTimeout:2000},disableOfflineQueue:true});client.on('error',()=>{});clients.push(client);await client.connect();item.client=client;return item;
}
async function stop(p,signal='SIGKILL'){if(p.client.isOpen)p.client.destroy();if(p.child.exitCode===null&&p.child.signalCode===null)p.child.kill(signal);await p.closed;}
const info=async(c,section)=>Object.fromEntries((await c.info(section)).split('\r\n').filter(l=>l.includes(':')).map(l=>{const i=l.indexOf(':');return[l.slice(0,i),l.slice(i+1)];}));
async function pair(prefix){const p=await start(`${prefix}-p`,{port:await unusedPort()});const r=await start(`${prefix}-r`,{port:await unusedPort(),extra:['--replicaof','127.0.0.1',String(p.port)]});await until(async()=>(await info(r.client,'replication')).master_link_status==='up','replica link');return[p,r];}
try{
 console.log('Redis 8.2.2 · controlled local processes · not a power-loss test');
 const[p,r]=await pair('loss');await p.client.set('card:42','12');assert.equal(await p.client.sendCommand(['WAIT','1','2000']),1);
 assert.equal(await r.client.get('card:42'),'12');
 blackhole=createServer(s=>{sockets.add(s);s.on('close',()=>sockets.delete(s));s.on('error',()=>{});s.resume();});await new Promise(r=>blackhole.listen(0,'127.0.0.1',r));
 // Disconnect the replica without discarding its old data. No live server is targeted.
 await r.client.sendCommand(['REPLICAOF','127.0.0.1',String(blackhole.address().port)]);
 await until(async()=>(await info(p.client,'replication')).connected_slaves==='0','primary notices disconnection');
 assert.equal(await p.client.del('card:42'),1);const acknowledged=await p.client.sendCommand(['WAIT','1','200']);assert.equal(acknowledged,0);assert.equal(await p.client.get('card:42'),null);
 console.log('DEL -> 1; WAIT 1 200 -> 0; primary GET -> null (no rollback)');
 await stop(p);await r.client.sendCommand(['REPLICAOF','NO','ONE']);assert.equal(await r.client.get('card:42'),'12');console.log('Manual promotion of disconnected replica: GET -> 12 (old cached value returns)');await stop(r);

 let snapshot=await start('rdb');await snapshot.client.set('card:42','12');await snapshot.client.set('short','expires',{PX:1200});await snapshot.client.sendCommand(['SAVE']);await snapshot.client.set('card:42','15');await stop(snapshot);await delay(1300);
 snapshot=await start('rdb',{restart:true});assert.equal(await snapshot.client.get('card:42'),'12');assert.equal(await snapshot.client.get('short'),null);console.log('RDB: SAVE at12, then SET15; crash/restart -> 12; expired saved key -> null');await stop(snapshot);

 const aofOptions={extra:['--appendonly','yes','--appendfsync','always']};let log=await start('aof',aofOptions);await log.client.set('card:42','12');await log.client.set('card:42','15');const synced=await log.client.sendCommand(['WAITAOF','1','0','1000']);assert.deepEqual(synced,[1,0]);await stop(log);
 log=await start('aof',{...aofOptions,restart:true});assert.equal(await log.client.get('card:42'),'15');console.log('AOF always: SET12, SET15, WAITAOF -> [1,0]; crash/restart -> 15');await stop(log);

 const[primary,replica]=await pair('sentinel');await primary.client.set('card:42','15');assert.equal(await primary.client.sendCommand(['WAIT','1','2000']),1);
 const sentinels=[];for(let i=0;i<3;i++)sentinels.push(await start(`sentinel-${i}`,{sentinel:true,port:await unusedPort(),extra:[primary.port]}));
 await until(async()=>{for(const s of sentinels){const peers=await s.client.sendCommand(['SENTINEL','SENTINELS','cache-primary']);if(peers.length!==2)return false;}return true;},'three Sentinels discover one another');
 await stop(primary);
 await until(async()=>{try{if(!replica.client.isOpen)await replica.client.connect();return (await replica.client.sendCommand(['ROLE']))[0]==='master';}catch{return false;}},'automatic promotion',20000);
 await until(async()=>{for(const s of sentinels){const addr=await s.client.sendCommand(['SENTINEL','get-master-addr-by-name','cache-primary']);if(addr?.[1]!==String(replica.port))return false;}return true;},'discovery converges');
 assert.equal(await replica.client.get('card:42'),'15');console.log('Sentinel: three monitors, quorum2; primary killed; replica promoted; all three report its address; GET -> 15');
 console.log('All recovery assertions passed. Local process failure only; no independent failure domains or client auto-reconnect claim.');
}finally{
 clearTimeout(deadline);process.removeListener('SIGINT',abort);process.removeListener('SIGTERM',abort);for(const c of clients)if(c.isOpen)c.destroy();for(const s of sockets)s.destroy();if(blackhole)await new Promise(r=>blackhole.close(r));
 for(const p of processes)if(p.child.exitCode===null&&p.child.signalCode===null)p.child.kill('SIGKILL');await Promise.allSettled(processes.map(p=>p.closed));await rm(dir,{recursive:true,force:true});
}
