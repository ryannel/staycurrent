// E4: what an application sees when Redis is stopped versus when it hangs.
// CLIENT PAUSE makes a running Redis stop answering clients for a while, with
// their connections open: a safe way to rehearse a hung cache. A stopped
// server refuses the connection at once.
import net from 'node:net';
import { connect } from './resp.mjs';

const PORT = 7111;
const CLOSED_PORT = 7184; // a lab port with its server stopped for this test

// Send one GET on a fresh connection and time the outcome, giving up after `timeout` ms.
function timedGet(port, timeout) {
  return new Promise(resolve => {
    const t0 = performance.now();
    const done = what => { clearTimeout(timer); socket.destroy(); resolve({ what, ms: +(performance.now() - t0).toFixed(1) }); };
    const socket = net.createConnection({ port, host: '127.0.0.1' });
    const timer = setTimeout(() => done('timed out'), timeout);
    socket.on('error', e => done(`error ${e.code}`));
    socket.on('connect', () => socket.write('*2\r\n$3\r\nGET\r\n$7\r\nprobe:1\r\n'));
    socket.on('data', d => done(`reply ${JSON.stringify(d.toString().trim())}`));
  });
}

const admin = await connect(PORT);
console.log('normal GET, 50 ms timeout:', await timedGet(PORT, 50));
console.log('$ CLIENT PAUSE 3000 ALL ->', await admin.call('CLIENT', 'PAUSE', '3000', 'ALL'));
console.log('paused GET, 50 ms timeout:', await timedGet(PORT, 50));
console.log('paused GET, no practical timeout (10 s):', await timedGet(PORT, 10000));
console.log('GET to a port with no server, 50 ms timeout:', await timedGet(CLOSED_PORT, 50));
admin.close();
