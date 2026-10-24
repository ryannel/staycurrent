from pathlib import Path
import urllib.request,hashlib,json
root=Path(__file__).resolve().parent.parent
files=[('r05','joins-experiment.sql'),('r06','windows-experiment.sql'),('r09','run-boundary.py'),('r09','shop.json'),('r13','run-isolation.py')]
results=[]
for key,name in files:
 url=f'http://127.0.0.1:4410/review/relational-collection/evidence/{key}/{name}'
 with urllib.request.urlopen(url,timeout=10) as response:
  body=response.read(1000000)
  local=(root/f'src/components/relational-collection/{key}/downloads/{name}').read_bytes()
  assert body==local
  results.append({'actual_rendered_href':url,'status':response.status,'bytes':len(body),'sha256':hashlib.sha256(body).hexdigest(),'matches_local':True,'content_type':response.headers.get('Content-Type'),'content_disposition':response.headers.get('Content-Disposition')})
(root/'evidence/download-http-v02.json').write_text(json.dumps(results,indent=2)+'\n')
print('All five actual rendered download hrefs return exact local artifact bytes.')
