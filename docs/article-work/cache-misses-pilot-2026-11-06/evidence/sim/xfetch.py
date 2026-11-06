# XFetch on one key: Poisson arrivals, each request refreshes early if
# now - delta*beta*ln(U) >= expiry. A refresh takes delta; the new value lands then.
# Count refreshes started per expiry cycle (before the first one lands) and the lead time.
import random, math, statistics as st
def run(rate, delta, beta, trials=2000, seed=1):
    rnd = random.Random(seed)
    counts=[]; leads=[]
    for _ in range(trials):
        expiry = 30.0
        t = expiry - 10.0  # start well before
        first=None; n=0
        while True:
            t += rnd.expovariate(rate)
            if first is not None and t >= first + delta: break  # first refresh landed
            if t >= expiry:  # true miss: under XFetch a request at/after expiry recomputes too
                n += 1
                if first is None: first = t
                continue
            if t - delta*beta*math.log(rnd.random()) >= expiry:
                n += 1
                if first is None: first = t
        counts.append(n); leads.append(expiry-first)
    counts.sort()
    return st.mean(counts), counts[len(counts)//2], counts[int(.99*len(counts))], max(counts), st.mean(leads), st.median(leads)
for rate,delta,beta in [(400,.15,1),(400,.15,2),(250,.02,1),(40,.15,1),(4000,.15,1),(400,.6,1)]:
    m,med,p99,mx,ml,mdl=run(rate,delta,beta)
    print(f"rate={rate} delta={delta} beta={beta}: refreshes mean {m:.2f} median {med} p99 {p99} max {mx}; lead mean {ml:.3f}s median {mdl:.3f}s; formula {delta*beta*math.log(rate*delta*beta):.3f}")
