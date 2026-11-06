# Cold restart at peak. 50,000 cards, Zipf s=1, 20,000 req/s over 20 instances.
# Admission: 2 executing slots per instance, fills take 20 ms (so 2,000 fills/s fleet-wide),
# queue of 1 per instance with a deadline check; a request that cannot start a fill in time
# gets a reduced answer. Per-process coalescing: a request for a key already being filled
# on the same instance waits for it. The cache is shared: a completed fill serves everyone after.
marks={500,900,950,990,1000}
import random, bisect, heapq, itertools, sys
N=50_000; RATE=20_000; INST=20; SLOTS=2; FILL=0.020; QUEUE=1; BUDGET=0.150
H=sum(1/i for i in range(1,N+1))
cum=list(itertools.accumulate(1/i/H for i in range(1,N+1)))
def share(k): return sum(1/i for i in range(1,k+1))/H
print("top1000 share %.3f top5000 %.3f P7 rate %.0f/s"%(share(1000),share(5000),RATE/7/H))
def sim(mode, seconds=30, seed=2, prewarm=None):
    rnd=random.Random(seed)
    cached=set(); events=[]  # (time, kind, ...)
    inst=[{'busy':0,'queue':[], 'inflight':{}} for _ in range(INST)]
    t=0.0; served=0; full=0; coalesced=0; reduced=0
    buckets={}
    top1000_back=None
    # prewarm: a background worker that uses some slots: modelled as list of keys
    pw=list(prewarm) if prewarm else []
    global top,seen
    top=set(); seen={}
    def start(i,key,now):
        inst[i]['busy']+=1
        inst[i]['inflight'][key]=1
        heapq.heappush(events,(now+FILL,1,i,key))
    nreq=0
    while t<seconds:
        t+=rnd.expovariate(RATE)
        while events and events[0][0]<=t:
            when,_,i,key=heapq.heappop(events)
            cached.add(key); inst[i]['busy']-=1
            if key<1000: top.add(key)
            if len(top) in marks and len(top) not in seen: seen[len(top)]=when
            w=inst[i]['inflight'].pop(key,0)
            # dequeue
            q=inst[i]['queue']
            while q and inst[i]['busy']<SLOTS:
                arr,k=q.pop(0)
                if when-arr+FILL<=BUDGET and k not in cached:
                    if k in inst[i]['inflight']: inst[i]['inflight'][k]+=1
                    else: start(i,k,when)
                # else: expired in queue -> reduced (already counted below as pending)
            # prewarm uses a free slot only if fills free and mode says so
            if pw and inst[i]['busy']<SLOTS and mode=='prewarm':
                start(i,pw.pop(),when)
        key=bisect.bisect_left(cum,rnd.random())
        i=nreq%INST; nreq+=1
        b=int(t*4)/4
        bk=buckets.setdefault(b,[0,0,0])
        bk[0]+=1
        if key in cached: bk[1]+=1; continue
        if key in inst[i]['inflight']: inst[i]['inflight'][key]+=1; bk[2]+=1; continue
        if inst[i]['busy']<SLOTS: start(i,key,t); bk[2]+=1; continue
        if len(inst[i]['queue'])<QUEUE: inst[i]['queue'].append((t,key)); bk[2]+=1; continue
        # reduced answer
        if top1000_back is None and all(k in cached for k in range(1000)): top1000_back=t
    out=[]
    for b in sorted(buckets):
        n,h,f=buckets[b]; out.append((b,h/n,(h+f)/n))
    print('top1000 counts reached at',{k:round(v,2) for k,v in sorted(seen.items())})
    return out,len(cached)
for mode in ['demand']:
    out,n=sim(mode)
    for b,h,ok in out:
        if b in (0,0.25,0.5,0.75,1,1.5,2,3,4,5,6,8,10,11.75): print(mode,b,"hit %.2f served-or-pending %.2f"%(h,ok))
    print("cached keys",n)
