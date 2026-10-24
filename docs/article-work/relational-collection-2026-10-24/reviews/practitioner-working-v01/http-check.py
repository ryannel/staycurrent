from pathlib import Path
from urllib.request import urlopen
from urllib.parse import urljoin
from html.parser import HTMLParser
import json,hashlib
r=Path(__file__).resolve().parent.parent
audit={}
class Page(HTMLParser):
 def __init__(self):super().__init__();self.links=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='a' and 'download' in a:self.links.append(a['href'])
for n in range(6,11):
 p=r/f'batch{n:02}/v01';m=json.loads((p/'manifest.json').read_text());bs=json.loads((p/'context/briefs.json').read_text())
 for b in bs:
  route=b['slug'];url=m['preview']+route+'/'
  print('Checking',b['key'],url,flush=True)
  with urlopen(url,timeout=10) as resp:content=resp.read(2000000);status=resp.status
  page=Page();page.feed(content.decode());row={'url':url,'http_status':status,'html_bytes':len(content),'downloads':[]}
  for href in page.links:
   target=urljoin(url,href)
   assert target.startswith(m['preview'])
   with urlopen(target,timeout=10) as resp:data=resp.read(1000000);code=resp.status
   name=target.rstrip('/').rsplit('/',1)[-1]
   src=p/f'source/src/components/relational-collection/{b["key"]}/downloads/{name}'
   row['downloads'].append({'actual_href':href,'status':code,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'matches_frozen':src.exists() and data==src.read_bytes()})
  audit[b['key']]=row
(r/'practitioner-working-v01/current-http.json').write_text(json.dumps(audit,indent=2))
for k,row in audit.items():print(k,row['http_status'],'downloads',[(x['actual_href'],x['matches_frozen']) for x in row['downloads']])
