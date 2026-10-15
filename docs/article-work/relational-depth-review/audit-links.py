from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse, urljoin, unquote, parse_qs
import json

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.links=[]; self.ids=set(); self.options=set(); self.lessons=set(); self.article=False; self.noindex=False; self.feed(text)
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if 'id' in a: self.ids.add(a['id'])
        if tag=='a' and 'href' in a: self.links.append(a['href'])
        if tag=='option' and a.get('value'): self.options.add(a['value'])
        if a.get('data-choose'): self.lessons.add(a['data-choose'])
        if tag=='article': self.article=True
        if tag=='meta' and a.get('name')=='robots' and 'noindex' in a.get('content',''): self.noindex=True

root=Path('dist'); pages={p:Page(p.read_text()) for p in root.rglob('*.html')}
sandbox='/learn/databases/relational/sandbox/'
lesson_ids=pages[root/sandbox.lstrip('/')/'index.html'].lessons
issues=[]; checked=0; coverage=[]
for file,page in pages.items():
    current='/'+str(file.relative_to(root)).removesuffix('index.html')
    lesson_links=set()
    for href in page.links:
        link=urlparse(urljoin(current,href))
        if link.scheme or link.netloc: continue
        path=root/unquote(link.path.lstrip('/'))
        target=path/'index.html' if not path.suffix else path
        checked+=1
        if not target.exists(): issues.append({'page':str(file),'href':href,'error':'missing route'})
        elif link.fragment and target in pages and unquote(link.fragment) not in pages[target].ids:
            issues.append({'page':str(file),'href':href,'error':'missing fragment'})
        if link.path==sandbox:
            for lesson in parse_qs(link.query).get('tutorial',[]):
                lesson_links.add(lesson)
                if lesson not in lesson_ids: issues.append({'page':str(file),'href':href,'error':'unknown lesson'})
    if current.startswith('/learn/databases/relational/') and page.article:
        coverage.append({'route':current,'lessons':sorted(lesson_links),'noindex':page.noindex})
        if current not in [sandbox,'/learn/databases/relational/practice/'] and not lesson_links:
            issues.append({'page':str(file),'error':'article has no direct lesson link'})
result={'checked':checked,'lessons':len(lesson_ids),'coverage':coverage,'issues':issues}
Path('docs/article-work/relational-depth-review/link-audit.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({'checked':checked,'lessons':len(lesson_ids),'articles':len(coverage),'issues':issues},indent=2))
raise SystemExit(bool(issues))
