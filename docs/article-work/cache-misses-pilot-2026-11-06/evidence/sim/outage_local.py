# Redis unreachable at peak, with admission (2 executing slots + 1 waiting place per
# instance, deadline-checked) and local copies on each Server of the 1,000 most requested
# cards. Each instance refreshes its 1,000 local copies once every 30 s (one refresh every
# 30 ms per instance, 667 a second across the fleet); a refresh takes a slot like any fill
# and goes ahead of waiting demand. Requests for a top-1,000 card are served from the local
# copy. Other requests coalesce per process, start a fill, wait, or are refused.
# Optional: retain demand fills locally for 30 s as well (retain=True).
# Added by the repair of 6 November 2026 to answer: what share gets a usable card?
import random, bisect, heapq, itertools
N = 50_000; RATE = 20_000; INST = 20; FILL = 0.020; BUDGET = 0.150; TOP = 1000; TTL = 30.0
H = sum(1 / i for i in range(1, N + 1)); cum = list(itertools.accumulate(1 / i / H for i in range(1, N + 1)))

def sim(slots=2, queue=1, seconds=10, seed=3, retain=False):
    rnd = random.Random(seed); ev = []; t = 0; n = 0
    inst = [{'busy': 0, 'q': [], 'fl': {}, 'pending_refresh': 0, 'next_refresh': i * 0.0015, 'local': {}} for i in range(INST)]
    fills = refreshes = 0; joined = local = full = refused = 0
    def start(I, k, now):
        nonlocal fills
        I['busy'] += 1; I['fl'][k] = 1; fills += 1; heapq.heappush(ev, (now + FILL, id(I), k))
    def start_refresh(I, now):
        nonlocal refreshes
        I['busy'] += 1; refreshes += 1; heapq.heappush(ev, (now + FILL, id(I), None))
    byid = {id(I): I for I in inst}
    def drain(I, now):
        nonlocal joined, refused
        while I['busy'] < slots and I['pending_refresh']:
            I['pending_refresh'] -= 1; start_refresh(I, now)
        while I['q'] and I['busy'] < slots:
            arr, kk = I['q'].pop(0)
            if kk in I['fl']: I['fl'][kk] += 1; joined += 1
            elif now - arr + FILL <= BUDGET: start(I, kk, now)
            else: refused += 1
    while t < seconds:
        t += rnd.expovariate(RATE)
        # completions
        while ev and ev[0][0] <= t:
            when, iid, k = heapq.heappop(ev); I = byid[iid]; I['busy'] -= 1
            if k is not None:
                nonlocal_full = I['fl'].pop(k); full += nonlocal_full
                if retain: I['local'][k] = when + TTL
            drain(I, when)
        # scheduled refreshes of the local top-1,000 copies
        for I in inst:
            while I['next_refresh'] <= t:
                I['next_refresh'] += TTL / TOP
                if I['busy'] < slots: start_refresh(I, t)
                else: I['pending_refresh'] += 1
        k = bisect.bisect_left(cum, rnd.random()); I = inst[n % INST]; n += 1
        if k < TOP: local += 1; continue
        if retain and I['local'].get(k, -1) > t: local += 1; continue
        if k in I['fl']: I['fl'][k] += 1; joined += 1; continue
        if I['busy'] < slots and not I['pending_refresh']: start(I, k, t); continue
        if len(I['q']) < queue: I['q'].append((t, k)); continue
        refused += 1
    return dict(requests=n, demand_fills_per_s=round(fills / seconds), refreshes_per_s=round(refreshes / seconds),
                local_share=round(local / n, 3), full_from_fill_share=round(full / n, 3),
                usable_share=round((local + full) / n, 3), refused_share=round(refused / n, 3))

print("top-1000 share of requests:", round(sum(1 / i for i in range(1, TOP + 1)) / H, 3))
print("local top-1000 copies, 2 slots + queue 1:", sim())
print("same, demand fills also kept locally for 30 s:", sim(retain=True))
