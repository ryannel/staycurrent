exec(open('cold2.py').read().split("for mode in ['demand']:")[0])
out,n=sim('demand',seconds=30)
pts=[(b,round(h,3)) for b,h,ok in out]
# coarser: keep 0.25 steps to 3 s, then each whole second
keep=[(b,h) for b,h in pts if b<3 or abs(b-round(b))<1e-9]
print(keep)
print('cached',n)
