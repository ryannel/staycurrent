// E5: memory per cached product, from the growth of used_memory, for the sizing figure.
// 20,000 keys named product:<6 digits>, values of 2,000 bytes, each with a TTL.
import { connect } from './resp.mjs';
const r = await connect(7111);
await r.call('FLUSHALL');
const info = async () => Object.fromEntries((await r.call('INFO', 'memory')).split('\r\n').filter(l => l.includes(':')).map(l => l.split(':')));
const N = 20000, SIZE = 2000;
const before = await info();
for (let i = 0; i < N; i += 500) {
  const batch = [];
  for (let j = i; j < i + 500; j++) batch.push(r.call('SET', `product:${String(j).padStart(6, '0')}`, 'v'.repeat(SIZE), 'EX', '3600'));
  await Promise.all(batch);
}
const after = await info();
const per = (after.used_memory - before.used_memory) / N;
console.log(`keys ${N}, value ${SIZE} bytes, key name 14 bytes, TTL set`);
console.log(`used_memory before ${before.used_memory}, after ${after.used_memory}, per key ${per.toFixed(1)} bytes`);
console.log(`overhead beyond key+value: ${(per - SIZE - 14).toFixed(1)} bytes (${((per / (SIZE + 14) - 1) * 100).toFixed(1)}%)`);
console.log(`MEMORY USAGE product:000042 -> ${await r.call('MEMORY', 'USAGE', 'product:000042')}`);
console.log(`used_memory_rss ${after.used_memory_rss}, mem_fragmentation_ratio ${after.mem_fragmentation_ratio}, allocator ${after.mem_allocator}`);
await r.call('FLUSHALL');
r.close();
