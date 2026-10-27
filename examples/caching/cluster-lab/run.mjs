import assert from 'node:assert/strict';
import {spawn,execFileSync} from 'node:child_process';
import {mkdtemp,mkdir,rm,stat} from 'node:fs/promises';
import {createServer} from 'node:net';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {setTimeout as delay} from 'node:timers/promises';
import {createClient,createCluster} from 'redis';
const binary=process.env.REDIS_SERVER||'redis-server';
assert.match(execFileSync(binary,['--version'],{encoding:'utf8'}),/v=8\.2\.2\b/,'Use Redis 8.2.2');
const dir=await mkdtemp(path.join(process.platform==='darwin'?'/tmp':tmpdir(),'sc-cluster-'));
const processes=[],clients=[];let aborted=false;
function abort(){aborted=true;for(const c of clients)if(c.isOpen)c.destroy();for(const p of processes)p.child.kill('SIGKILL');}
process.once('SIGINT',abort);process.once('SIGTERM',abort);const deadline=setTimeout(abort,75000);
async function until(check,label,ms=15000){const end=Date.now()+ms;while(Date.now()<end){if(aborted)throw new Error('Lab interrupted or exceeded 75 seconds');if(await check())return;await delay(50);}throw new Error(`Timed out: ${label}`);}
async function unusedPort(){const s=createServer();await new Promise((r,j)=>s.listen(0,'127.0.0.1',r).once('error',j));const port=s.address().port;await new Promise(r=>s.close(r));return port;}
async function start(name){
 const home=path.join(dir,name);await mkdir(home);const socket=path.join(home,'s.sock'),port=await unusedPort();let bus=await unusedPort();while(bus===port)bus=await unusedPort();
 const child=spawn(binary,['--port',String(port),'--bind','127.0.0.1','--protected-mode','yes','--unixsocket',socket,'--unixsocketperm','700','--dir',home,'--save','','--appendonly','no','--repl-diskless-sync-delay','0','--cluster-enabled','yes','--cluster-config-file','nodes.conf','--cluster-node-timeout','1000','--cluster-port',String(bus),'--cluster-announce-ip','127.0.0.1','--cluster-announce-port',String(port),'--cluster-announce-bus-port',String(bus)],{stdio:['ignore','pipe','pipe']});
 let output='';child.stdout.on('data',d=>output+=d);child.stderr.on('data',d=>output+=d);const closed=new Promise((r,j)=>{child.once('close',r);child.once('error',j);});const p={child,closed,port,bus};processes.push(p);
 await until(async()=>{if(child.exitCode!==null)throw new Error(output);return !!await stat(socket).catch(()=>null);},`${name} socket`);
 const client=createClient({socket:{path:socket,reconnectStrategy:false,connectTimeout:1500},disableOfflineQueue:true});client.on('error',()=>{});clients.push(client);await client.connect();p.client=client;p.id=await client.sendCommand(['CLUSTER','MYID']);return p;
}
const command=(p,...args)=>p.client.sendCommand(args.map(String));
const parseInfo=s=>Object.fromEntries(s.split('\r\n').filter(l=>l.includes(':')).map(l=>{const i=l.indexOf(':');return[l.slice(0,i),l.slice(i+1)];}));
async function stop(p){if(p.client.isOpen)p.client.destroy();p.child.kill('SIGKILL');await p.closed;}
async function expectedError(p,args,prefix){await assert.rejects(command(p,...args),e=>e.message.startsWith(prefix));}
try{
 console.log('Redis 8.2.2 · six owned local nodes · classic slot migration');
 const nodes=[];for(let i=0;i<6;i++)nodes.push(await start(`n${i}`));const primaries=nodes.slice(0,3),replicas=nodes.slice(3);
 for(const p of nodes.slice(1))await command(nodes[0],'CLUSTER','MEET','127.0.0.1',p.port,p.bus);
 await until(async()=>{for(const p of nodes)if(Number(parseInfo(await command(p,'CLUSTER','INFO')).cluster_known_nodes)!==6)return false;return true;},'six-node discovery');
 const ranges=[[0,5460],[5461,10922],[10923,16383]];for(let i=0;i<3;i++)await command(primaries[i],'CLUSTER','ADDSLOTSRANGE',...ranges[i]);
 await until(async()=>{for(const p of nodes)if(Number(parseInfo(await command(p,'CLUSTER','INFO')).cluster_slots_assigned)!==16384)return false;return true;},'all slot assignments propagate');
 for(let i=0;i<3;i++)await command(replicas[i],'CLUSTER','REPLICATE',primaries[i].id);
 await until(async()=>{for(const p of primaries)if(parseInfo(await command(p,'CLUSTER','INFO')).cluster_state!=='ok')return false;for(const r of replicas)if(parseInfo(await r.client.info('replication')).master_link_status!=='up')return false;return true;},'healthy slots and replicas');
 // Reconnection drives this client's topology refresh; offline commands still fail promptly.
 const defaults={socket:{connectTimeout:1500,reconnectStrategy:retries=>retries<100?200:false},disableOfflineQueue:true};
 const cluster=createCluster({rootNodes:primaries.map(p=>({url:`redis://127.0.0.1:${p.port}`,...defaults})),defaults});cluster.on('error',()=>{});clients.push(cluster);await cluster.connect();
 const key='card:{42}:a',other='card:{42}:b';const slot=await command(nodes[0],'CLUSTER','KEYSLOT',key);assert.equal(await command(nodes[0],'CLUSTER','KEYSLOT',other),slot);const sourceIndex=ranges.findIndex(([a,b])=>slot>=a&&slot<=b),source=primaries[sourceIndex],target=primaries[(sourceIndex+1)%3];
 for(const k of['card:42','stock:42',key,other,'foo{}{bar}','café'])console.log(`KEYSLOT ${k} -> ${await command(nodes[0],'CLUSTER','KEYSLOT',k)}`);
 await cluster.set(key,'12');await cluster.set(other,'stock');assert.equal(await cluster.get(key),'12');await expectedError(target,['GET',key],'MOVED ');console.log('Direct GET on wrong primary -> MOVED; cluster client GET -> 12');
 assert.notEqual(await command(nodes[0],'CLUSTER','KEYSLOT','card:42'),slot);await expectedError(source,['MGET',key,'card:42'],'CROSSSLOT');assert.deepEqual(await command(source,'MGET',key,other),['12','stock']);console.log('Different slots MGET -> CROSSSLOT; same hash tag MGET -> [12,stock]');
 await command(target,'CLUSTER','SETSLOT',slot,'IMPORTING',source.id);await command(source,'CLUSTER','SETSLOT',slot,'MIGRATING',target.id);
 assert.equal(await command(source,'GET',key),'12');await command(source,'MIGRATE','127.0.0.1',target.port,key,0,2000);
 await expectedError(source,['GET',key],'ASK ');await expectedError(source,['MGET',key,other],'TRYAGAIN');await expectedError(target,['GET',key],'MOVED ');
 await command(target,'ASKING');assert.equal(await command(target,'GET',key),'12');assert.equal(await cluster.get(key),'12');console.log('Partial migration: old owner GET -> ASK; split MGET -> TRYAGAIN; target ASKING+GET and cluster client GET -> 12');
 await command(source,'MIGRATE','127.0.0.1',target.port,other,0,2000);
 // Destination first, then source, then other primaries: this ordering matters.
 for(const p of[target,source,...primaries.filter(p=>p!==source&&p!==target)])await command(p,'CLUSTER','SETSLOT',slot,'NODE',target.id);
 await expectedError(source,['GET',key],'MOVED ');assert.equal(await cluster.get(key),'12');assert.deepEqual(await cluster.mGet([key,other]),['12','stock']);console.log('Completed ownership change: old owner -> MOVED; cluster client MGET -> [12,stock]');
 let anchor='';for(let i=0;i<100;i++){const k=`survivor:${i}`;if(await command(nodes[0],'CLUSTER','KEYSLOT',k)<=5460){anchor=k;break;}}assert.ok(anchor);await command(primaries[0],'SET',anchor,'15');assert.equal(await command(primaries[0],'WAIT',1,2000),1);await stop(primaries[0]);
 await until(async()=>{try{if(!replicas[0].client.isOpen)await replicas[0].client.connect();return(await command(replicas[0],'ROLE'))[0]==='master';}catch{return false;}},'cluster replica promotion',25000);
 await until(async()=>{try{return await cluster.get(anchor)==='15';}catch{return false;}},'cluster client routes to promoted replica');console.log('Primary A killed: its replica becomes primary; cluster client GET -> 15');
 console.log('All Cluster assertions passed. Local processes only; no network partition or throughput benchmark.');
}finally{
 clearTimeout(deadline);process.removeListener('SIGINT',abort);process.removeListener('SIGTERM',abort);for(const c of clients)if(c.isOpen)c.destroy();for(const p of processes)if(p.child.exitCode===null&&p.child.signalCode===null)p.child.kill('SIGKILL');await Promise.allSettled(processes.map(p=>p.closed));await rm(dir,{recursive:true,force:true});
}
