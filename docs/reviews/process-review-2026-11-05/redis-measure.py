"""Load 100,000 x 500-byte cards into a local Redis, report memory per entry,
then time 40 sequential GETs against one MGET of the same 40 keys."""
import socket, time, statistics

s = socket.create_connection(('127.0.0.1', 6399))
f = s.makefile('rb')

def send(*args):
    out = [b'*%d\r\n' % len(args)]
    for a in args:
        a = a if isinstance(a, bytes) else str(a).encode()
        out.append(b'$%d\r\n%s\r\n' % (len(a), a))
    s.sendall(b''.join(out))

def read():
    line = f.readline()
    t, rest = line[:1], line[1:-2]
    if t in (b'+', b'-'):
        return rest
    if t == b':':
        return int(rest)
    if t == b'$':
        n = int(rest)
        if n < 0:
            return None
        data = f.read(n + 2)
        return data[:-2]
    if t == b'*':
        return [read() for _ in range(int(rest))]
    raise ValueError(line)

def call(*args):
    send(*args)
    return read()

def info_mem():
    text = call('INFO', 'memory').decode()
    return int([l for l in text.split('\r\n') if l.startswith('used_memory:')][0].split(':')[1])

call('FLUSHALL')
before = info_mem()
value = b'x' * 500
N = 100_000
batch = 1000
for start in range(0, N, batch):
    for i in range(start, start + batch):
        send('SET', 'product:v1:north:P%d:en-GB:GBP' % i, value)
    for _ in range(batch):
        read()
after = info_mem()
print('keys:', call('DBSIZE'))
print('memory for %d x 500-byte values: %.1f MiB, %.0f bytes per entry (%.0f over the value)'
      % (N, (after - before) / 2**20, (after - before) / N, (after - before) / N - 500))

keys = ['product:v1:north:P%d:en-GB:GBP' % i for i in range(40)]
seq, mget = [], []
for _ in range(500):
    t = time.perf_counter()
    for k in keys:
        call('GET', k)
    seq.append(time.perf_counter() - t)
    t = time.perf_counter()
    r = call('MGET', *keys)
    mget.append(time.perf_counter() - t)
    assert len(r) == 40 and all(v == value for v in r)
q = lambda xs, p: sorted(xs)[int(p * len(xs)) - 1] * 1000
print('40 sequential GETs: median %.3f ms, p99 %.3f ms' % (statistics.median(seq) * 1000, q(seq, .99)))
print('one MGET of 40:     median %.3f ms, p99 %.3f ms' % (statistics.median(mget) * 1000, q(mget, .99)))
