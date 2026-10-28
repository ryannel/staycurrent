// E7: what keyspace_hits and keyspace_misses count, and what a restart does to them.
import { connect } from './resp.mjs';
const r = await connect(7111);
await r.call('FLUSHALL'); await r.call('CONFIG', 'RESETSTAT');
await r.call('SET', 'p:1', 'x'); await r.call('HSET', 'h:1', 'name', 'lamp');
await r.call('SET', 'p:none', '__none__'); // a cached "not found" marker
const stats = async () => { const s = await r.call('INFO', 'stats'); return { hits: +s.match(/keyspace_hits:(\d+)/)[1], misses: +s.match(/keyspace_misses:(\d+)/)[1] }; };
const tryCmd = async (...args) => { const a = await stats(); await r.call(...args).catch(() => {}); const b = await stats(); console.log(`${args.join(' ').padEnd(28)} hits +${b.hits - a.hits}, misses +${b.misses - a.misses}`); };
await tryCmd('GET', 'p:1');
await tryCmd('GET', 'p:2');
await tryCmd('MGET', 'p:1', 'p:2', 'p:3');
await tryCmd('EXISTS', 'p:2');
await tryCmd('HGET', 'h:1', 'price');
await tryCmd('HGET', 'h:2', 'name');
await tryCmd('GET', 'p:none');
await tryCmd('SET', 'p:4', 'x');
await tryCmd('DEL', 'p:4');
await tryCmd('INCR', 'c:1');
await tryCmd('TTL', 'p:1');
console.log('uptime_in_seconds', (await r.call('INFO', 'server')).match(/uptime_in_seconds:(\d+)/)[1], 'counters', JSON.stringify(await stats()));
await r.call('FLUSHALL'); r.close();
