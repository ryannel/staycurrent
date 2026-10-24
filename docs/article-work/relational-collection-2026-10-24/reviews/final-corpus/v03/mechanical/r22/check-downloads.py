from urllib.request import urlopen
from pathlib import Path
import hashlib,json
out=[]
Path('evidence/served').mkdir(exist_ok=True)
for name in ['run-migration.py','shop.json']:
    url='http://127.0.0.1:4412/review/relational-collection/evidence/r22/'+name
    with urlopen(url,timeout=5) as response:
        data=response.read(200000)
        status=response.status
    expected=Path('src/components/relational-collection/r22/downloads',name).read_bytes()
    assert data==expected,(name,len(data),len(expected))
    Path('evidence/served',name).write_bytes(data)
    out.append({'actual_rendered_href':url,'status':status,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'source_equal':True})
Path('evidence/download-http.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps(out))
