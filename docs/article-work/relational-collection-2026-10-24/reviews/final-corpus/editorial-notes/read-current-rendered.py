from pathlib import Path
from html.parser import HTMLParser
import hashlib
import json
import re
import sys

HERE = Path(__file__).parent
MANIFEST = HERE.parent / 'v01/manifest.json'
EXPECTED = 'feacba81d85e69771eda4966a8ebebbc9d5296331c2a993fbfec1ad7b8c7cf97'
assert hashlib.sha256(MANIFEST.read_bytes()).hexdigest() == EXPECTED
manifest = json.loads(MANIFEST.read_text())

class Reader(HTMLParser):
    def __init__(self):
        super().__init__()
        self.main = False
        self.stack = []
        self.out = []
        self.pre = False
        self.block = {'p','h1','h2','h3','h4','li','tr','pre','figcaption','summary','button','dt','dd','details','table','figure'}
    def handle_starttag(self, tag, attrs):
        if tag == 'main':
            self.main = True
        if not self.main:
            return
        if tag in ('nav', 'script', 'style'):
            self.stack.append(tag)
        if self.stack:
            return
        a = dict(attrs)
        if tag in self.block:
            self.out.append('\n')
        if tag == 'pre':
            self.pre = True
        if tag in ('td','th'):
            self.out.append(' | ')
        if tag == 'img' and a.get('alt'):
            self.out.append('[Image: ' + a['alt'] + ']')
        if tag in ('input','select') and a.get('aria-label'):
            self.out.append('[Control: ' + a['aria-label'] + ']')
    def handle_endtag(self, tag):
        if not self.main:
            return
        if self.stack:
            if tag == self.stack[-1]:
                self.stack.pop()
            return
        if tag in self.block:
            self.out.append('\n')
        if tag == 'pre':
            self.pre = False
        if tag == 'main':
            self.main = False
    def handle_data(self, data):
        if self.main and not self.stack:
            self.out.append(data if self.pre else re.sub(r'\s+', ' ', data))

key = sys.argv[1]
path = Path(manifest['built_output']) / 'review/relational-collection' / manifest['article_paths'][key] / 'index.html'
reader = Reader()
reader.feed(path.read_text())
text = ''.join(reader.out)
text = re.sub(r'\n{3,}', '\n\n', text).strip()
parts = [text[i:i+11000] for i in range(0, len(text), 11000)]
if len(sys.argv) == 2:
    print(key, len(text), 'characters;',len(parts),'parts;',hashlib.sha256(path.read_bytes()).hexdigest())
else:
    part = int(sys.argv[2])
    print(f'CURRENT {key} PART {part}/{len(parts)} BEGIN; built HTML {path}; navigation/scripts/styles excluded, explanatory disclosures retained')
    print(parts[part-1])
    print(f'END CURRENT {key} PART {part}/{len(parts)}')
