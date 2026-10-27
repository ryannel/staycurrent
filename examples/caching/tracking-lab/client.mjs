import assert from 'node:assert/strict';
import {setTimeout as delay} from 'node:timers/promises';
import {createClient,BasicClientSideCache} from 'redis';
assert.ok(process.env.REDIS_SOCKET,'Run via the private-server runner');
const socket={path:process.env.REDIS_SOCKET,reconnectStrategy:false,connectTimeout:1500};
const cache=new BasicClientSideCache({ttl:60000,maxEntries:2,evictPolicy:'LRU'});
const reader=createClient({socket,RESP:3,disableOfflineQueue:true,clientSideCache:cache});
const writer=createClient({socket,disableOfflineQueue:true});
const broadcast=createClient({socket,RESP:3,emitInvalidate:true,disableOfflineQueue:true});
const clients=[reader,writer,broadcast];for(const c of clients)c.on('error',()=>{});
const invalidations=[];cache.on('invalidate',key=>invalidations.push(key===null?null:String(key)));
async function until(check,label){const end=Date.now()+4000;while(Date.now()<end){if(check())return;await delay(10);}throw new Error(`Timed out: ${label}`);}
async function getCalls(){const s=await writer.info('commandstats');return Number(s.match(/cmdstat_get:calls=(\d+)/)?.[1]??0);}
try{
 await writer.connect();await reader.connect();console.log('Redis 8.2.2 · node-redis 6.3.0 · RESP3 client-side cache');
 await writer.set('card:42','12');const before=await getCalls();assert.equal(await reader.get('card:42'),'12');assert.equal(await reader.get('card:42'),'12');assert.equal(await getCalls()-before,1);assert.equal(cache.stats().hitCount,1);assert.equal(cache.stats().missCount,1);console.log('Two GETs -> 12,12; Redis processed one GET; client stats: one miss, one hit');
 await writer.set('card:42','15');await until(()=>invalidations.includes('card:42')&&cache.size()===0,'invalidation of cached read');assert.equal(await reader.get('card:42'),'15');console.log('Other connection SET15 -> key-only invalidation; next GET ->15');
 assert.equal(await reader.strLen('card:42'),2);assert.equal(cache.size(),2);await writer.set('card:42','100');await until(()=>cache.size()===0,'GET and STRLEN invalidated together');assert.equal(await reader.get('card:42'),'100');assert.equal(await reader.strLen('card:42'),3);console.log('GET and STRLEN occupy two cached results; one key change invalidates both');
 cache.clear();assert.equal(await reader.get('card:missing'),null);await writer.set('card:missing','created');await until(()=>cache.size()===0,'missing-key invalidation');assert.equal(await reader.get('card:missing'),'created');console.log('Cached null invalidated when key created; next GET -> created');
 await reader.get('card:42');await writer.set('card:extra','x');await reader.get('card:extra');assert.equal(cache.size(),2);console.log('Third cached result with maxEntries2 -> cache retains two entries');
 cache.clear();assert.equal(await reader.get('card:42'),'100');assert.equal(cache.size(),1);const id=await reader.clientId();assert.equal(await writer.sendCommand(['CLIENT','KILL','ID',String(id)]),1);await until(()=>!reader.isOpen&&cache.size()===0,'disconnect clears local cache');await writer.set('card:42','21');await reader.connect();assert.equal(await reader.get('card:42'),'21');console.log('Reader connection killed -> local cache cleared; explicit reconnect then GET ->21');
 await writer.set('card:short','temporary',{PX:1000});assert.equal(await reader.get('card:short'),'temporary');await delay(1100);assert.equal(await writer.get('card:short'),null);await until(()=>invalidations.includes('card:short'),'expiry invalidation');assert.equal(await reader.get('card:short'),null);console.log('Redis expiry invalidates local copy despite its longer local TTL; GET -> null');
 const broadcasts=[];broadcast.on('invalidate',key=>broadcasts.push(key===null?null:String(key)));await broadcast.connect();await broadcast.sendCommand(['CLIENT','TRACKING','OFF']);await broadcast.sendCommand(['CLIENT','TRACKING','ON','BCAST','PREFIX','card:']);await writer.set('card:never-read','x');await until(()=>broadcasts.includes('card:never-read'),'broadcast for unread key');console.log('Raw BCAST PREFIX card: receives invalidation for card:never-read without reading it');
 console.log('All tracking assertions passed. No timing/throughput claim; disconnect is detected, not a silent network blackhole.');
}finally{for(const c of clients)if(c.isOpen)c.destroy();}
