from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json
root=Path('dist')
class Page(HTMLParser):
 def __init__(self,p):
  super().__init__();self.links=[];self.ids=set();self.feed(p.read_text())
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.add(a['id'])
  if tag=='a' and 'href' in a:self.links.append(a['href'])
pages={p:Page(p) for p in root.rglob('*.html')};errors=[];count=0
for p,obj in pages.items():
 for href in obj.links:
  u=urlsplit(href)
  if u.scheme or u.netloc or (u.path and not u.path.startswith('/')):continue
  target=root/unquote(u.path.lstrip('/')) if u.path else p
  if target.is_dir():target=target/'index.html'
  count+=1
  if not target.exists():errors.append([str(p),href,'missing file'])
  elif u.fragment and target in pages and unquote(u.fragment) not in pages[target].ids:errors.append([str(p),href,'missing fragment'])
result={'htmlPages':len(pages),'internalLinksChecked':count,'errors':errors}
Path('docs/article-work/deep-dives-batch/link-audit.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
