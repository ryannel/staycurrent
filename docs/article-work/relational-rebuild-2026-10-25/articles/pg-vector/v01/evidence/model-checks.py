import math,json,pathlib
vectors={'P7':(1.,0.),'P9':(.8,.6),'P3':(0.,1.)}
q=(1.,0.)
def scores(v):
 ip=sum(a*b for a,b in zip(v,q));norm=math.hypot(*v)
 return {'l2':math.dist(v,q),'cosine':1-ip/norm,'negative_ip':-ip}
rows={k:scores(v) for k,v in vectors.items()}
scaled=scores((1.6,1.2))
assert math.isclose(scaled['cosine'],rows['P9']['cosine'])
assert scaled['negative_ip']<rows['P7']['negative_ip']
ranked=sorted(vectors,key=lambda k:rows[k]['l2']);stock={'P3':10,'P7':0,'P9':4}
assert [k for k in ranked if stock[k]>0][:2]==['P9','P3']
assert [k for k in ranked[:2] if stock[k]>0]==['P9']
centres=[0,4,8];points={'A':.4,'B':2.1,'C':4,'D':8};query=1.9
assignment={k:min(centres,key=lambda c:abs(c-v)) for k,v in points.items()}
probes=sorted(centres,key=lambda c:abs(c-query))
answers={n:min((k for k in points if assignment[k] in probes[:n]),key=lambda k:abs(points[k]-query)) for n in [1,2]}
assert answers=={1:'A',2:'B'}
result={'shop_scores_double_precision':rows,'scaled_P9':scaled,'filter_first':['P9','P3'],'limit_first':['P9'],'ivf_assignment':assignment,'ivf_probe_order':probes,'ivf_answers':answers,'hnsw_model':'A9 -> C2 at upper layer; C2 neighbours B5,D3. Candidate width1 discardsD, stopsC; width2 retainsD, discoversE0.5. Selected graph, not captured execution.','limits':'Python arithmetic checks the declared illustrations; native small vector output separately records single-precision effects.'}
pathlib.Path(__file__).with_name('model-results.json').write_text(json.dumps(result,indent=2)+'\n')
print('Distance, scaling, filter-before-limit and list-boundary arithmetic verified')
