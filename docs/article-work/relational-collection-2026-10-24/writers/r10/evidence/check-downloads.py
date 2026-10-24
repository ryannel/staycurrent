from pathlib import Path
import hashlib,json,urllib.request,datetime
checks=[('r10','4394','access-paths.sql'),('r11','4394','query-work.sql'),('r12','4396','partition-lifecycle.sql'),('r12','4396','events.csv')]
records={}
for key,port,name in checks:
 base=Path('/private/tmp/staycurrent-relational-20261024-'+key)
 url=f'http://127.0.0.1:{port}/review/relational-collection/evidence/{key}/{name}'
 with urllib.request.urlopen(url,timeout=10) as response:
  data=response.read();status=response.status
 source=base/'src/components/relational-collection'/key/'downloads'/name
 assert data==source.read_bytes(),name
 records.setdefault(key,[]).append({'url':url,'status':status,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'equals_source':True,'checked_at':datetime.datetime.now(datetime.timezone.utc).isoformat()})
for key,items in records.items():
 (Path('/private/tmp/staycurrent-relational-20261024-'+key)/'evidence/download-check.json').write_text(json.dumps(items,indent=2))
print('All four rendered download URLs returned HTTP 200 and exact source bytes.')
