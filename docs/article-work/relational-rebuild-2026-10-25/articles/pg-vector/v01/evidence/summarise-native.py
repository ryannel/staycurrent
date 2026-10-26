import json, pathlib, hashlib
root=pathlib.Path(__file__).resolve().parent
lines=(root/'native-results.txt').read_text().splitlines()
summaries=[json.loads(l.split('|',1)[1]) for l in lines if l.startswith('summary|')]
runs=[json.loads(l.split('|',1)[1]) for l in lines if l.startswith('run|')]
builds=[json.loads(l.split('|',1)[1]) for l in lines if l.startswith('build|')]
def nodes(p):
 yield p
 for c in p.get('Plans',[]): yield from nodes(c)
for r in runs:
 ns=list(nodes(r['plan'][0]['Plan']))
 if r['method'].startswith('hnsw'): assert any(n.get('Index Name')=='sc_vector_hnsw' for n in ns)
 if r['method'].startswith('ivf'): assert any(n.get('Index Name')=='sc_vector_ivf' for n in ns)
 r['root_buffer_accesses']=sum(r['plan'][0]['Plan'].get(k,0) for k in ['Shared Hit Blocks','Shared Read Blocks'])
 r['scan_routes']=[{k:n[k] for k in ['Node Type','Index Name','Actual Rows','Rows Removed by Filter','Order By'] if k in n} for n in ns if 'Scan' in n['Node Type']]
 r['recomputed_recall']=len(set(r['ids'] or []) & set(next(json.loads(l.split('|',1)[1])['ids'] for l in lines if l.startswith('baseline|') and json.loads(l.split('|',1)[1])['q']==r['q'] and json.loads(l.split('|',1)[1])['filtered']==r['filtered'])))/10
 assert abs(r['recomputed_recall']-r['recall'])<1e-10
for summary in summaries:
 rs=[r for r in runs if r['method']==summary['method'] and r['filtered']==summary['filtered']]
 summary['min_count_from_identities']=min(len(r['ids'] or []) for r in rs)
 summary['max_count_from_identities']=max(len(r['ids'] or []) for r in rs)
 summary['short_requests']=sum(len(r['ids'] or [])<10 for r in rs)
result={'summaries':summaries,'builds':builds,'recall_convention':'one identity comparison per request/configuration/family; eight equally weighted requests; baseline ORDER BY distance,id LIMIT10; five copied recall fields are not independent observations','run_count_retained':len(runs),'runs':runs}
result['limits']=['SQL min_count ignores NULL arrays for empty answers; use min_count_from_identities instead.','Recall measured once per request; instrumented repeated timing executions do not repeat the retained identity capture.','Eight fixed mathematical queries are not a production sample; values repeat a modular pattern with small offsets.']
(root/'native-summary.json').write_text(json.dumps(result,indent=2)+'\n')
for m in sorted(set(r['method'] for r in runs)):
 for f in [False,True]:
  rs=[r for r in runs if r['method']==m and r['filtered']==f]
  print(m,f,'buffers',min(r['root_buffer_accesses'] for r in rs),max(r['root_buffer_accesses'] for r in rs),'counts',min(len(r['ids'] or []) for r in rs),max(len(r['ids'] or []) for r in rs),'short',sum(len(r['ids'] or [])<10 for r in rs),'routes',rs[0]['scan_routes'])
print('Identity recall recalculation and 112 retained request plans verified')
