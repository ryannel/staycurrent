import time, sys
sys.path.insert(0, '.')
from resp import Redis
r = Redis()
def fill(key, n):
    r.call('DEL', key)
    batch = 10000
    for i in range(0, n, batch):
        r.call('SADD', key, *[f'page:{j}' for j in range(i, min(n, i + batch))])
for n in (1000, 100000, 1000000):
    for cmd in ('DEL', 'UNLINK'):
        times = []
        for run in range(3):
            fill('tag:big', n)
            t = time.perf_counter(); r.call(cmd, 'tag:big'); times.append((time.perf_counter() - t) * 1000)
            time.sleep(0.3)
        print(f'{cmd} of a {n:,}-member set: ' + ', '.join(f'{x:.2f}' for x in times) + ' ms (client-observed, three runs)')
