from pathlib import Path
import urllib.request,hashlib,json,datetime
for key,f,port in [('r05','joins-experiment.sql',4368),('r06','windows-experiment.sql',4368),('r07','run-pagination.py',4368)]:
 root=Path('/private/tmp/staycurrent-relational-20261024-'+key)
 u='http://127.0.0.1:'+str(port)+'/review/relational-collection/evidence/'+key+'/'+f+'/'
 with urllib.request.urlopen(u,timeout=4) as r:
  data=r.read(1000000);headers=r.headers;status=r.status;final=r.url
 expected=(root/('src/components/relational-collection/'+key+'/downloads/'+f)).read_bytes()
 result={'checked_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'url':u,'final_url':final,'status':status,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'matches_source':data==expected,'content_type':headers.get('Content-type'),'content_disposition':headers.get('Content-Disposition'),'limit':'Bounded byte delivery checked on gated development route; no native browser save-path assertion.'}
 (root/'evidence/download-http.json').write_text(json.dumps(result,indent=2)+'\n')
 print(json.dumps(result));assert data==expected
