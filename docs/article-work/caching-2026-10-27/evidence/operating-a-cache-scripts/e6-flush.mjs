// E6: FLUSHALL is a blocking operation by default in Redis 8.10.3; FLUSHALL ASYNC is not.
// 500,000 keys of 100 bytes, loaded twice; a second connection times PING every 2 ms meanwhile.
import { connect } from './resp.mjs';
const PORT = 7111;
const admin = await connect(PORT), probe = await connect(PORT);
async function load() {
  await admin.call('FLUSHALL');
  for (let i = 0; i < 500000; i += 5000) {
    const b = []; for (let j = i; j < i + 5000; j++) b.push(admin.call('SET', `k:${j}`, 'x'.repeat(100)));
    await Promise.all(b);
  }
  return admin.call('DBSIZE');
}
async function run(args) {
  const n = await load();
  let worst = 0, stop = false;
  const pinger = (async () => { while (!stop) { const t = performance.now(); await probe.call('PING'); worst = Math.max(worst, performance.now() - t); await new Promise(r => setTimeout(r, 2)); } })();
  await new Promise(r => setTimeout(r, 100));
  const t0 = performance.now();
  if (args[0] === 'MULTI') { await admin.call('MULTI'); await admin.call(...args.slice(1)); await admin.call('EXEC'); }
  else await admin.call(...args);
  const took = performance.now() - t0;
  await new Promise(r => setTimeout(r, 300));
  stop = true; await pinger;
  const lazy = (await admin.call('INFO', 'memory')).match(/lazyfree_pending_objects:(\d+)/)[1];
  console.log(`${args.join(' ')} on ${n} keys: reply after ${took.toFixed(1)} ms; worst PING from another client ${worst.toFixed(1)} ms; lazyfree_pending_objects 300 ms later: ${lazy}`);
}
console.log('lazyfree-lazy-user-flush', (await admin.call('CONFIG', 'GET', 'lazyfree-lazy-user-flush'))[1]);
await run(['FLUSHALL']);
await run(['FLUSHALL', 'ASYNC']);
await run(['FLUSHALL']);
await run(['FLUSHALL', 'ASYNC']);
// Inside a transaction Redis cannot hand the flush to a background thread (CLIENT_AVOID_BLOCKING_ASYNC_FLUSH in server.h).
await run(['MULTI', 'FLUSHALL']);
await run(['MULTI', 'FLUSHALL']);
admin.close?.(); probe.close?.();
process.exit(0);
