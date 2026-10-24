from pathlib import Path
import datetime,hashlib,json,urllib.request,urllib.parse
from html.parser import HTMLParser
class Downloads(HTMLParser):
 def __init__(self):super().__init__();self.hrefs=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='a' and 'download' in a:self.hrefs.append(a['href'])
root=Path(__file__).resolve().parent.parent
# Download hrefs observed on4424; root confirms unchanged routes on4432.
# Verify the actual href in each final served4432 page before reading its bytes.
files={'r04':['run-history.py','shop.json','history.json'],'r08':['run-imports.py','shop.json','feed.json'],'r10':['access-paths.sql'],'r11':['query-work.sql'],'r12':['partition-lifecycle.sql','events.csv']}
receipts=[]
slugs={'r04':'data-lifecycle','r08':'updates-and-imports','r10':'indexes','r11':'query-execution','r12':'partitioning'}
for key,names in files.items():
 page='http://127.0.0.1:4432/review/relational-collection/'+slugs[key]+'/'
 with urllib.request.urlopen(page,timeout=10) as response:html=response.read(1000001).decode()
 parser=Downloads();parser.feed(html)
 actual={urllib.parse.urljoin(page,href) for href in parser.hrefs}
 for name in names:
  href=f'http://127.0.0.1:4432/review/relational-collection/evidence/{key}/{name}'
  assert href in actual,(href,actual)
  with urllib.request.urlopen(href,timeout=10) as response:
   data=response.read(512001);status=response.status
  source=root/f'src/components/relational-collection/{key}/downloads/{name}'
  receipt={'href':href,'status':status,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'local_source':str(source.relative_to(root)),'matches_source':data==source.read_bytes()}
  assert status==200 and len(data)<=512000 and receipt['matches_source'],receipt
  receipts.append(receipt)
(root/'evidence/served-downloads.json').write_text(json.dumps({'utc':datetime.datetime.now(datetime.UTC).isoformat(),'method':'bounded HTTP against actual DOM hrefs; no browser download event/path/save wait','receipts':receipts},indent=2)+'\n')
print(json.dumps({'checked':len(receipts),'all_200_and_exact':True}))
