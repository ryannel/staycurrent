import assert from 'node:assert/strict';
import net from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';
import { createRequire } from 'node:module';
import { createClient } from 'redis';
const require=createRequire(import.meta.url);
const socketPath=process.env.REDIS_SOCKET;
assert.ok(socketPath,'Use node run.mjs to supply a private Redis socket');
const clients=[];
function client(options={}){const c=createClient({socket:{path:socketPath,reconnectStrategy:false},...options});c.on('error',()=>{});clients.push(c);return c;}
const main=client(),admin=client();
try {
 await Promise.all([main.connect(),admin.connect()]);
 console.log('node-redis:',require('redis/package.json').version);
 console.log((await main.info('server')).split('\r\n').find(line=>line.startsWith('redis_version:')));
 console.log('\n1. Explicit pipeline preserves ordered results');
 const replies=await main.multi().set('card:42','12').get('card:42').get('missing').execAsPipeline();
 assert.deepEqual(replies,['OK','12',null]);console.log(JSON.stringify(replies));
 console.log('\n2. A failed command does not stop a later pipeline command');
 let error;try{await main.multi().set('text','abc').incr('text').set('after-error','saved').execAsPipeline();}catch(e){error=e;}
 assert.match(error?.message||'',/not an integer/);assert.equal(await main.get('after-error'),'saved');
 console.log('Second command failed; later SET independently confirmed: saved');
 console.log('\n3. A sent command outlives commandOptions.timeout in 6.3.0');
 await admin.sendCommand(['CLIENT','PAUSE','1000','ALL']);
 let settled=false;
 const sent=main.withCommandOptions({timeout:40}).set('late-command','15').finally(()=>{settled=true;});
 await delay(120);assert.equal(settled,false);
 console.log('After 120 ms, sent SET still pending despite timeout 40 ms');
 assert.equal(await sent,'OK');assert.equal(await admin.get('late-command'),'15');
 console.log('SET later resolves OK; independent GET confirms 15');
 console.log('\n4. Client queue while a connection is not ready');
 // Controlled TCP peer accepts but never answers the handshake. It is not a
 // Redis emulator and executes no commands. The real client's isReady is false.
 for(const disableOfflineQueue of [false,true]){
  const sockets=new Set();let received='',accepted;
  const connected=new Promise(resolve=>{accepted=resolve;});
  const peer=net.createServer(socket=>{sockets.add(socket);socket.on('data',data=>received+=data.toString());socket.on('error',()=>{});socket.on('close',()=>sockets.delete(socket));accepted();});
  await new Promise(resolve=>peer.listen(0,'127.0.0.1',resolve));
  const c=client({socket:{host:'127.0.0.1',port:peer.address().port,reconnectStrategy:false},disableOfflineQueue,commandsQueueMaxLength:8});
  const connecting=c.connect().catch(()=>{});
  try{
   await connected;assert.equal(c.isReady,false);
   let failure;try{await c.withCommandOptions({timeout:80}).get('unsent-marker');}catch(e){failure=e;}
   assert.equal(failure?.constructor.name,disableOfflineQueue?'ClientOfflineError':'TimeoutError');
   assert.equal(received.includes('unsent-marker'),false);
   console.log(`disableOfflineQueue=${disableOfflineQueue}: ${failure.constructor.name}; GET never reached peer`);
  }finally{if(c.isOpen)c.destroy();for(const socket of sockets)socket.destroy();await new Promise(resolve=>peer.close(resolve));await connecting;}
 }
 console.log('\n5. Queue capacity includes commands awaiting replies');
 const bounded=client({commandsQueueMaxLength:8});await bounded.connect();
 await admin.sendCommand(['CLIENT','PAUSE','700','ALL']);
 const pending=Array.from({length:8},()=>bounded.get('card:42'));
 await new Promise(resolve=>setImmediate(resolve));
 const extra=bounded.get('card:42').then(()=>null,e=>e);
 assert.equal((await extra)?.message,'The queue is full');
 assert.deepEqual(await Promise.all(pending),Array(8).fill('12'));
 console.log('Eight pending commands complete; ninth rejected: The queue is full');
 console.log('\nAll assertions passed. Fault intervals are not performance measurements.');
}finally{for(const c of clients)if(c.isOpen)c.destroy();}
