import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
import {createClient} from 'redis';
import {setTimeout as delay} from 'node:timers/promises';
const clients=[];
const connect=async(password)=>{
 const client=createClient({RESP:3,socket:{path:process.env.REDIS_SOCKET,reconnectStrategy:false,connectTimeout:2000},disableOfflineQueue:true,...(password?{username:'cache-app',password}:{})});
 client.on('error',()=>{});clients.push(client);await client.connect();return client;
};
const info=(text)=>Object.fromEntries(text.split('\r\n').filter(line=>line&&!line.startsWith('#')).map(line=>{const i=line.indexOf(':');return[line.slice(0,i),line.slice(i+1)];}));
const waitFor=async(test)=>{for(let i=0;i<100;i++){if(test())return;await delay(10);}assert.ok(test(),'Expected detected disconnect');};
try{
 const admin=await connect();
 const oldSecret=randomBytes(24).toString('hex'),newSecret=randomBytes(24).toString('hex');
 await admin.sendCommand(['ACL','SETUSER','cache-app','reset','on','>'+oldSecret,'~cache:catalog:*','+get','+set','+del','+ping','+client|setinfo']);
 const app=await connect(oldSecret);
 console.log('Redis 8.2.2 · Node client 6.3.0 · private Unix-socket operations lab');
 assert.equal(await app.set('cache:catalog:42','12'),'OK');assert.equal(await app.get('cache:catalog:42'),'12');
 for(const command of [['GET','cache:orders:42'],['CONFIG','GET','maxmemory'],['FLUSHALL'],['SLOWLOG','GET','1']]){
  await assert.rejects(app.sendCommand(command),/NOPERM/);
 }
 assert.equal(await app.get('cache:catalog:42'),'12','Denied FLUSHALL must not delete anything');
 assert.equal(await admin.sendCommand(['ACL','DRYRUN','cache-app','SET','cache:catalog:42','would-change']),'OK');
 assert.equal(await app.get('cache:catalog:42'),'12','DRYRUN must not execute SET');
 const denials=await admin.sendCommand(['ACL','LOG','10']);
 assert.ok(denials.some(row=>row.reason==='key'));assert.ok(denials.some(row=>row.reason==='command'));
 console.log('App GET/SET in catalog prefix allowed; other prefix, CONFIG, FLUSHALL and SLOWLOG denied; ACL LOG records key/command reasons');
 console.log('ACL DRYRUN permits SET but does not change stored 12');
 await admin.sendCommand(['ACL','SETUSER','cache-app','off']);
 assert.equal(await app.get('cache:catalog:42'),'12');
 await assert.rejects(connect(oldSecret),/WRONGPASS/);
 console.log('User off: fresh authentication denied; already authenticated connection still reads 12');
 await admin.sendCommand(['ACL','SETUSER','cache-app','on','>'+newSecret]);
 const newApp=await connect(newSecret);assert.equal(await newApp.get('cache:catalog:42'),'12');
 await admin.sendCommand(['ACL','SETUSER','cache-app','<'+oldSecret]);
 await assert.rejects(connect(oldSecret),/WRONGPASS/);assert.equal(await app.get('cache:catalog:42'),'12');
 console.log('Overlapping credential rotation: new secret connects; removed old secret cannot reconnect, but old session still works');
 assert.equal(await admin.sendCommand(['CLIENT','KILL','USER','cache-app']),2);
 await waitFor(()=>!app.isOpen&&!newApp.isOpen);
 const rotated=await connect(newSecret);assert.equal(await rotated.get('cache:catalog:42'),'12');
 console.log('Explicit CLIENT KILL USER closes both owned app sessions; new secret reconnects successfully');
 const before=info(await admin.info('stats'));
 await rotated.get('cache:catalog:42');await rotated.get('cache:catalog:42');await rotated.get('cache:catalog:missing');
 const after=info(await admin.info('stats'));
 assert.equal(Number(after.keyspace_hits)-Number(before.keyspace_hits),2);
 assert.equal(Number(after.keyspace_misses)-Number(before.keyspace_misses),1);
 const runBefore=info(await admin.info('server')).run_id;
 await admin.sendCommand(['CONFIG','RESETSTAT']);
 const reset=info(await admin.info('stats'));
 assert.equal(reset.keyspace_hits,'0');assert.equal(reset.keyspace_misses,'0');assert.equal(info(await admin.info('server')).run_id,runBefore);
 console.log('Three GET lookups produce window deltas hits2/misses1; CONFIG RESETSTAT returns counters to zero without changing run_id');
 await admin.sendCommand(['CONFIG','SET','slowlog-log-slower-than','0','slowlog-max-len','8']);
 for(let i=0;i<12;i++)await rotated.get('cache:catalog:42');
 const slow=await admin.sendCommand(['SLOWLOG','GET','8']);
 assert.equal(slow.length,8);assert.ok(slow.some(row=>row[3][0].toLowerCase()==='get'));
 assert.ok(slow.every(row=>Number.isInteger(row[2])&&row[2]>=0));
 console.log('With test-only threshold0 and maxlen8, SLOWLOG retains 8 entries including GET and execution microseconds; this is not a latency benchmark');
 console.log('All operations assertions passed. No production service, real credentials or TLS connection were used.');
}finally{for(const client of clients)if(client.isOpen)client.destroy();}
