from pathlib import Path
import hashlib,json,urllib.request,datetime
base='http://127.0.0.1:4480/review/relational-collection/evidence/'
paths=['r10/access-paths.sql','r04/run-history.py','r04/shop.json','r04/history.json','r08/run-imports.py','r08/shop.json','r08/feed.json','r09/run-boundary.py','r09/shop.json']
results=[]
for relative in paths:
    url=base+relative
    with urllib.request.urlopen(url,timeout=5) as response:
        body=response.read(1000000)
        assert len(body)<1000000
        status=response.status
    article,name=relative.split('/')
    source=Path('src/components/relational-collection')/article/'downloads'/name
    assert status==200 and source.read_bytes()==body,relative
    results.append({'actual_page_href':url,'download_name':name,'status':status,'bytes':len(body),'sha256':hashlib.sha256(body).hexdigest(),'same_as_source':True})
Path('evidence/served-downloads-4480.json').write_text(json.dumps({'checked_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'method':'Actual hrefs captured from rendered main a[download]; bounded HTTP byte read only; browser saving unverified','results':results},indent=2)+'\n')
print(json.dumps(results,indent=2))
