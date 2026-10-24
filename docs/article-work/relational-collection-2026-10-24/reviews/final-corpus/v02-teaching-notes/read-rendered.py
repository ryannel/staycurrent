from html.parser import HTMLParser
from pathlib import Path
import hashlib, json, re, sys

BASE = Path(__file__).resolve().parents[1] / 'v02'
BUILT = Path('/private/tmp/staycurrent-relational-final-local-all6-v02-clean/review/relational-collection')
MANIFEST = json.loads((BASE / 'manifest.json').read_text())

class Reader(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack=[]; self.active=False; self.skip=0; self.out=[]; self.href=[]
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag == 'main': self.active=True
        inherited = self.skip > 0
        ignored = inherited or tag in ('script','style','nav') or a.get('id') == 'collection'
        if tag not in ('area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'):
            self.stack.append((tag, ignored))
            if ignored: self.skip += 1
        if not self.active or self.skip: return
        if tag in ('p','div','section','h1','h2','h3','h4','table','caption','tr','li','pre','summary','figure','figcaption','ol','ul','dl','dt','dd','br'):
            self.out.append('\n')
        if tag in ('h1','h2','h3','h4'):self.out.append('#' * int(tag[1]) + ' ')
        if tag in ('td','th'): self.out.append(' | ')
        if tag == 'a': self.href.append(a.get('href',''))
        if tag in ('input','select','button'): self.out.append(' [control] ')
    def handle_endtag(self, tag):
        if self.active and not self.skip:
            if tag == 'a' and self.href:
                h=self.href.pop()
                if h: self.out.append(' ['+h+']')
            if tag in ('p','div','section','h1','h2','h3','h4','table','caption','tr','li','pre','summary','figure','figcaption','ol','ul','dl','dt','dd'): self.out.append('\n')
        if self.stack and self.stack[-1][0] == tag:
            _,ignored=self.stack.pop()
            if ignored:self.skip -= 1
        if tag == 'main':self.active=False
    def handle_data(self, data):
        if self.active and not self.skip:self.out.append(data)
    def text(self):
        t=''.join(self.out)
        t=re.sub(r'[ \t\r\f\v]+',' ',t)
        return re.sub(r'\n[ \t]*\n+', '\n\n',t).strip()

key=sys.argv[1]; part=int(sys.argv[2]) if len(sys.argv)>2 else 1
p=BUILT / MANIFEST['article_paths'][key] / 'index.html'
r=Reader();r.feed(p.read_text());text=r.text();size=int(sys.argv[3]) if len(sys.argv)>3 else 22000;n=(len(text)+size-1)//size
if not 1 <= part <= n:raise SystemExit(f'part must be 1..{n}')
print(f'RENDERED {key} PART {part}/{n} CHARS {(part-1)*size}:{min(part*size,len(text))} TOTAL {len(text)} HTML_SHA256 {hashlib.sha256(p.read_bytes()).hexdigest()}')
print(text[(part-1)*size:part*size]);print(f'\nEND RENDERED {key} PART {part}/{n}')
