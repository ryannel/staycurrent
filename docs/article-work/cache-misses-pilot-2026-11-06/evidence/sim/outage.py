# Redis unreachable: no fill is retained. Per-process coalescing joins an in-flight fill
# for the same key on the same instance. Optional admission: SLOTS executing + QUEUE waiting per instance.
import random, bisect, heapq, itertools
N=50_000; RATE=20_000; INST=20; FILL=0.020; BUDGET=0.150
H=sum(1/i for i in range(1,N+1)); cum=list(itertools.accumulate(1/i/H for i in range(1,N+1)))
def sim(slots=None, queue=0, fleet=False, seconds=5, seed=3):
    rnd=random.Random(seed); ev=[]; t=0; n=0
    inst=[{'busy':0,'q':[],'fl':{}} for _ in range(1 if fleet else INST)]
    fills=0; joined=0; full=0; refused=0
    def start(I,k,now):
        nonlocal fills
        I['busy']+=1; I['fl'][k]=1; fills+=1; heapq.heappush(ev,(now+FILL,id(I),k))
    byid={id(I):I for I in inst}
    while t<seconds:
        t+=rnd.expovariate(RATE)
        while ev and ev[0][0]<=t:
            when,iid,k=heapq.heappop(ev); I=byid[iid]; I['busy']-=1; full+=I['fl'].pop(k)
            while I['q'] and I['busy']<(slots or 1e9):
                arr,kk=I['q'].pop(0)
                if kk in I['fl']: I['fl'][kk]+=1; joined+=1
                elif when-arr+FILL<=BUDGET: start(I,kk,when)
                else: refused+=1
        k=bisect.bisect_left(cum,rnd.random()); I=inst[0 if fleet else n%INST]; n+=1
        if k in I['fl']: I['fl'][k]+=1; joined+=1; continue
        if slots is None or I['busy']<slots: start(I,k,t); continue
        if len(I['q'])<queue: I['q'].append((t,k)); continue
        refused+=1
    return dict(requests=n, fills_per_s=fills/seconds, coalesced_share=joined/n, full_share=full/n, refused_share=refused/n)
print("no admission, per-process:",sim())
print("no admission, fleet-wide :",sim(fleet=True))
print("2 slots + queue 1 per instance:",sim(slots=2,queue=1))
print("2 slots + queue 0:",sim(slots=2,queue=0))
