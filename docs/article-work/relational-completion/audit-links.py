from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse, unquote
import json

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.links=[]; self.ids=set(); self.feed(text)
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if 'id' in a: self.ids.add(a['id'])
        if tag=='a' and 'href' in a: self.links.append(a['href'])

root=Path('dist'); pages={p:Page(p.read_text()) for p in root.rglob('*.html')}
issues=[]; checked=0
for file,page in pages.items():
    for href in page.links:
        link=urlparse(href)
        if link.scheme or link.netloc or not link.path.startswith('/'): continue
        path=root/unquote(link.path.lstrip('/'))
        target=path/'index.html' if not path.suffix else path
        checked+=1
        if not target.exists(): issues.append({'page':str(file),'href':href,'error':'missing route'})
        elif link.fragment and target in pages and unquote(link.fragment) not in pages[target].ids:
            issues.append({'page':str(file),'href':href,'error':'missing fragment'})
result={'checked':checked,'issues':issues}
Path('docs/article-work/relational-completion/link-audit.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result,indent=2))
raise SystemExit(bool(issues))
