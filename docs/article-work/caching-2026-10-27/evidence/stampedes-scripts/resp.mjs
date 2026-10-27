// A minimal Redis client for the stampede experiments: one TCP connection,
// commands pipelined, replies matched in order. Refuses any port but the lab's
// own (7106 for the first draft, 7116 for the round-1 repair).
const LAB_PORTS = [7106, 7116];
import net from 'node:net';

export async function connect(port = 7106) {
  if (!LAB_PORTS.includes(port)) throw new Error(`This lab only talks to ports ${LAB_PORTS.join(', ')}`);
  const socket = net.createConnection({ port, host: '127.0.0.1' });
  socket.setNoDelay(true);
  await new Promise((ok, fail) => { socket.once('connect', ok); socket.once('error', fail); });
  const waiting = [];
  let buffer = Buffer.alloc(0);
  socket.on('data', chunk => {
    buffer = buffer.length ? Buffer.concat([buffer, chunk]) : chunk;
    for (;;) {
      const parsed = parse(buffer, 0);
      if (!parsed) break;
      buffer = buffer.subarray(parsed.end);
      const w = waiting.shift();
      if (parsed.value instanceof Error) w.fail(parsed.value); else w.ok(parsed.value);
    }
  });
  const call = (...args) => new Promise((ok, fail) => {
    waiting.push({ ok, fail });
    let out = `*${args.length}\r\n`;
    for (const a of args) { const s = String(a); out += `$${Buffer.byteLength(s)}\r\n${s}\r\n`; }
    socket.write(out);
  });
  const info = await call('INFO', 'server');
  if (!new RegExp(`tcp_port:${port}\\r?\\n`).test(info)) throw new Error('Connected to the wrong server');
  return { call, close: () => socket.end() };
}

function line(buf, start) {
  const i = buf.indexOf('\r\n', start);
  return i < 0 ? null : { text: buf.toString('utf8', start + 1, i), next: i + 2 };
}
function parse(buf, start) {
  if (start >= buf.length) return null;
  const type = String.fromCharCode(buf[start]);
  const l = line(buf, start);
  if (!l) return null;
  if (type === '+') return { value: l.text, end: l.next };
  if (type === '-') return { value: new Error(l.text), end: l.next };
  if (type === ':') return { value: Number(l.text), end: l.next };
  if (type === '_') return { value: null, end: l.next };
  if (type === '$') {
    const n = Number(l.text);
    if (n < 0) return { value: null, end: l.next };
    if (buf.length < l.next + n + 2) return null;
    return { value: buf.toString('utf8', l.next, l.next + n), end: l.next + n + 2 };
  }
  if (type === '*') {
    const n = Number(l.text);
    if (n < 0) return { value: null, end: l.next };
    const out = []; let pos = l.next;
    for (let i = 0; i < n; i++) { const p = parse(buf, pos); if (!p) return null; out.push(p.value); pos = p.end; }
    return { value: out, end: pos };
  }
  throw new Error(`Unexpected reply type ${type}`);
}
