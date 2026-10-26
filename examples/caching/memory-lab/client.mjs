import assert from 'node:assert/strict';
import {createClient} from 'redis';
const c=createClient({socket:{path:process.env.REDIS_SOCKET,reconnectStrategy:false},disableOfflineQueue:true});c.on('error',()=>{});
const infoFields=text=>Object.fromEntries(text.split('\r\n').filter(x=>x.includes(':')).map(x=>{const i=x.indexOf(':');return[x.slice(0,i),x.slice(i+1)];}));
try{
 await c.connect();const base=infoFields(await c.info('memory'));const server=infoFields(await c.info('server'));
 console.log(JSON.stringify({experiment:'Native Redis memory and command work',redis:server.redis_version,arch_bits:server.arch_bits,allocator:base.mem_allocator,node:process.version,platform:process.platform,arch:process.arch}));
 const strings=[];
 for(const size of[0,16,1024,65536]){const key=`value:${size}`;await c.set(key,'x'.repeat(size));const bytes=await c.memoryUsage(key);assert.ok(bytes>=size);strings.push({payload_bytes:size,key_bytes:Buffer.byteLength(key),memory_usage:bytes,encoding:await c.sendCommand(['OBJECT','ENCODING',key])});}
 console.log('Strings: '+JSON.stringify(strings));
 const short='k',long='long:'.padEnd(100,'k');for(const k of[short,long])await c.set(k,'same-value');
 const keyNames=await Promise.all([short,long].map(async key=>({key_bytes:Buffer.byteLength(key),memory_usage:await c.memoryUsage(key)})));
 assert.ok(keyNames[1].memory_usage>keyNames[0].memory_usage);console.log('Identical values, different key lengths: '+JSON.stringify(keyNames));
 const config=await c.configGet(['hash-max-listpack-entries','hash-max-listpack-value']);console.log('Hash encoding thresholds: '+JSON.stringify(config));
 assert.equal(config['hash-max-listpack-entries'],'512');assert.equal(config['hash-max-listpack-value'],'64');
 const fields=Object.fromEntries(Array.from({length:512},(_,i)=>[`f${i}`,'small']));await c.hSet('hash',fields);
 const before={fields:await c.hLen('hash'),encoding:await c.sendCommand(['OBJECT','ENCODING','hash']),bytes:await c.memoryUsage('hash',{SAMPLES:0})};assert.equal(before.encoding,'listpack');
 const compactScan=await c.sendCommand(['HSCAN','hash','0','COUNT','1']);assert.equal(compactScan[0],'0');assert.equal(compactScan[1].length,1024);
 console.log('HSCAN compact hash with COUNT 1: '+JSON.stringify({cursor:compactScan[0],returned_fields:compactScan[1].length/2}));
 await c.hSet('hash','f512','small');const after={fields:await c.hLen('hash'),encoding:await c.sendCommand(['OBJECT','ENCODING','hash']),bytes:await c.memoryUsage('hash',{SAMPLES:0})};assert.equal(after.encoding,'hashtable');assert.ok(after.bytes>before.bytes);
 console.log('One added field crosses encoding threshold: '+JSON.stringify({before,after}));
 let cursor='0',calls=0,empty=0;do{const reply=await c.sendCommand(['SCAN',cursor,'MATCH','no-such-prefix:*','COUNT','1']);cursor=reply[0];calls++;if(reply[1].length===0)empty++;assert.ok(calls<1000);}while(cursor!=='0');assert.equal(calls,empty);assert.ok(calls>1);
 console.log('SCAN with no matching keys: '+JSON.stringify({calls,empty_batches:empty,final_cursor:cursor}));
 await c.configSet('slowlog-log-slower-than','0');await c.sendCommand(['SLOWLOG','RESET']);
 const one=await c.hGet('hash','f1'),all=await c.hGetAll('hash');assert.equal(one,'small');assert.equal(Object.keys(all).length,513);
 const entries=await c.sendCommand(['SLOWLOG','GET','10']);const measured=entries.filter(x=>['HGET','HGETALL'].includes(String(x[3][0]).toUpperCase())).map(x=>({command:x[3][0],execution_microseconds:x[2]}));
 assert.equal(measured.length,2);console.log('Reply work: '+JSON.stringify({hget_fields:1,hgetall_fields:513,slowlog:measured}));
 assert.equal(await c.unlink('hash'),1);assert.equal(await c.exists('hash'),0);console.log('UNLINK removes the key from lookup immediately; this lab does not infer when memory returns to the OS.');
 const final=infoFields(await c.info('memory'));console.log('INFO memory (observed, not additive categories): '+JSON.stringify(Object.fromEntries(['used_memory','used_memory_dataset','used_memory_overhead','used_memory_rss','mem_not_counted_for_evict','lazyfree_pending_objects'].map(k=>[k,final[k]]))));
 console.log('All native assertions passed. Byte counts and timings are environment-specific observations, not sizing constants or benchmarks.');
}finally{if(c.isOpen)c.destroy();}
