# Race 1 on a real Redis: readers fill on a miss after a simulated database read
# and a fill delay; a writer commits a new version then deletes. A sampler checks
# every 5 ms whether Redis holds an older version than the "database".
import threading, time, random, sys
sys.path.insert(0, '.')
from resp import Redis
def run(writes_per_s, fill_mean_ms, ttl_s, seconds, readers=2, read_gap=0.2, seed=1):
    random.seed(seed)
    setup = Redis(); setup.call('DEL', 'race:42')
    db = {'v': 0}; stop = time.time() + seconds
    stats = {'fills': 0, 'stale_fills': 0, 'samples': 0, 'stale_samples': 0, 'writes': 0}
    lock = threading.Lock()
    def reader(i):
        r = Redis(); rnd = random.Random(seed * 100 + i)
        while time.time() < stop:
            v = r.call('GET', 'race:42')
            if v is None:
                read_version = db['v']                         # the database read
                time.sleep(rnd.expovariate(1000.0 / fill_mean_ms))  # query, serialise, network, pauses
                r.call('SET', 'race:42', read_version, 'EX', ttl_s)
                with lock:
                    stats['fills'] += 1
                    if read_version < db['v']: stats['stale_fills'] += 1
            time.sleep(rnd.expovariate(1.0 / read_gap))
    def writer():
        r = Redis(); rnd = random.Random(seed * 7)
        while True:
            time.sleep(rnd.expovariate(writes_per_s))
            if time.time() >= stop: break
            db['v'] += 1                                       # commit
            r.call('DEL', 'race:42')                           # then delete
            stats['writes'] += 1
    def sampler():
        r = Redis()
        while time.time() < stop:
            v = r.call('GET', 'race:42'); cur = db['v']
            stats['samples'] += 1
            if v is not None and int(v) < cur: stats['stale_samples'] += 1
            time.sleep(0.005)
    ts = [threading.Thread(target=reader, args=(i,)) for i in range(readers)] + [threading.Thread(target=writer), threading.Thread(target=sampler)]
    for t in ts: t.start()
    for t in ts: t.join()
    share = stats['stale_samples'] / stats['samples']
    print(f"writes/s {writes_per_s}, mean fill {fill_mean_ms} ms, TTL {ttl_s} s, {seconds} s: writes {stats['writes']}, fills {stats['fills']}, stale fills {stats['stale_fills']}, share of samples stale {share*100:.2f}% (w x fill = {writes_per_s*fill_mean_ms/10:.2f}%)")
for args in [(1, 50, 5), (1, 50, 60), (0.2, 50, 5), (1, 10, 5)]:
    run(*args, seconds=60)
