"""Arithmetic checks for the article's conceptual models, not cluster tests."""
import itertools, json, sys
from pathlib import Path
layouts = [[3,0,0],[2,1,0],[1,1,1],[2,2,1]]
expected = [[0,3,3],[1,2,3],[2,2,2],[3,3,4]]
results=[]
for layout, wanted in zip(layouts, expected):
    n=sum(layout); q=n//2+1
    losses=[n-x for x in layout]
    assert losses==wanted
    # Exhaustive single-voter failures and region partitions for the fixed group.
    voters=[r for r,c in enumerate(layout) for _ in range(c)]
    assert n-1>=q
    for mask in itertools.product([False,True],repeat=3):
        a=sum(c for c,m in zip(layout,mask) if m)
        b=n-a
        assert not(a>=q and b>=q)
    split=[layout[0],sum(layout[1:])]
    results.append({'layout':layout,'majority':q,'after_region_loss':losses,'region_loss_passes':[x>=q for x in losses],'after_North_zone_1':n-1,'North_isolated_components':split})
assert 1*20+2*4.5==29
assert [12-2,1-1,4]==[10,0,4]
assert 40/90*100==44.44444444444444
# One West voter needs one of two remote votes. Fixed network-only RTT inputs.
assert min([40,90])==40
assert min([90])==90
# Composite uniqueness differs from the ID-only invariant.
pairs=[('North',103),('West',103)]
assert len(set(pairs))==2 and len({p[1] for p in pairs})==1
out={'kind':'illustrative arithmetic; no database or distributed cluster execution','runtime':'Python '+sys.version.split()[0],'layouts':results,'network_only_RTT_ms':{'West_North':40,'West_East':90,'healthy_required':40,'North_unavailable_required':90},'purchase':{'total':'29.00','stock_after':[10,0,4]},'composite_key_counterexample':pairs}
Path('evidence/model-results.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps(out,indent=2))
