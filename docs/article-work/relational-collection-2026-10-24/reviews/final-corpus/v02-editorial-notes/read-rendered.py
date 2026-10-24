"""Bounded, unabridged article-only reading of the released built HTML."""
from html.parser import HTMLParser
from pathlib import Path
import hashlib, json, re, sys

HERE = Path(__file__).resolve().parent
MANIFEST = HERE.parent / 'v02' / 'manifest.json'
EXPECTED = 'f04b100a8b0cf47d2eae95f55037f3045b97abfe016188de697e7b324b29b21b'
assert hashlib.sha256(MANIFEST.read_bytes()).hexdigest() == EXPECTED
M = json.loads(MANIFEST.read_text())

class ArticleText(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.depth=0; self.skip=0; self.out=[]; self.map_depth=0; self.map_out=[]; self.side_depth=0; self.side_out=[]
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='main': self.depth += 1
        if not self.depth: return
        if tag=='details' and ('article-switcher' in a.get('class','').split() or self.side_depth): self.side_depth+=1
        if self.side_depth: return
        if tag=='nav' and ('draft-map' in a.get('class','').split() or self.map_depth): self.map_depth+=1
        if self.map_depth: return
        if tag in ('script','style'): self.skip+=1
        if self.skip: return
        if tag in ('h1','h2','h3','h4','p','li','pre','figure','tr','summary','caption','dt','dd','div','section','ol','ul','table','blockquote'): self.out.append('\n')
        if tag in ('td','th'): self.out.append(' | ')
        if tag=='br': self.out.append('\n')
        if tag in ('svg','img','input','select') and (a.get('aria-label') or a.get('alt')):
            self.out.append('[Label: '+(a.get('aria-label') or a.get('alt'))+'] ')
    def handle_endtag(self, tag):
        if not self.depth: return
        if self.side_depth:
            if tag=='details': self.side_depth-=1
            return
        if self.map_depth:
            if tag=='nav': self.map_depth-=1
            return
        if tag in ('script','style'):
            self.skip-=1; return
        if not self.skip and tag in ('h1','h2','h3','h4','p','li','pre','figure','tr','summary','caption','dt','dd','div','section','ol','ul','table','blockquote','button'): self.out.append('\n')
        if tag=='main': self.depth-=1
    def handle_data(self, text):
        if self.depth and self.side_depth: self.side_out.append(text)
        elif self.depth and self.map_depth: self.map_out.append(text)
        elif self.depth and not self.skip: self.out.append(text)

def get(k):
    p=Path(M['output'])/'review/relational-collection'/M['article_paths'][k]/'index.html'
    parser=ArticleText(); parser.feed(p.read_text())
    shared=' '.join(''.join(parser.map_out).replace('You’re here','').split())
    assert shared
    if k!='r00':
        p0=ArticleText(); p0.feed((Path(M['output'])/'review/relational-collection/index.html').read_text())
        assert shared==' '.join(''.join(p0.map_out).replace('You’re here','').split()), 'Changed common navigation: read separately'
        assert ' '.join(''.join(parser.side_out).replace('You’re here','').split())==' '.join(''.join(p0.side_out).replace('You’re here','').split()), 'Changed sidebar: read separately'
    text=''.join(parser.out)
    text=re.sub(r'[ \t\r\f\v]+',' ',text)
    text=re.sub(r'\n[ \t]+','\n',text)
    text=re.sub(r'\n{3,}','\n\n',text).strip()+'\n'
    chunks=[]
    while text:
        n=min(14000,len(text))
        if n<len(text):
            b=text.rfind('\n',n//2,n)
            if b>=0: n=b+1
        chunks.append(text[:n]); text=text[n:]
    return p,chunks

if len(sys.argv)==1:
    for k in M['keys']:
        p,parts=get(k)
        print(k,len(parts),'parts',sum(map(len,parts)),'chars',hashlib.sha256(p.read_bytes()).hexdigest())
else:
    k=sys.argv[1]; p,parts=get(k); n=int(sys.argv[2])
    assert 1<=n<=len(parts)
    print(f'RENDERED {k} PART {n}/{len(parts)} HTML_SHA256 {hashlib.sha256(p.read_bytes()).hexdigest()}')
    print(parts[n-1],end='')
    print(f'END RENDERED {k} PART {n}/{len(parts)}')
