"""Check local href destinations and fragments in the built site."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote
import json

root = Path('dist').resolve()

class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.ids, self.links = set(), []
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        if tag == 'a' and 'href' in attrs:
            self.links.append(attrs['href'])

pages = {p: Page(p.read_text()) for p in root.rglob('*.html')}
errors, count = [], 0
for path, page in pages.items():
    relative = '/' + str(path.relative_to(root))
    url = 'https://staycurrent.dev' + relative.removesuffix('index.html')
    for href in page.links:
        target = urlsplit(urljoin(url, href))
        if target.netloc != 'staycurrent.dev' or target.scheme not in ('http', 'https'):
            continue
        count += 1
        destination = root / unquote(target.path).lstrip('/')
        if destination.is_dir():
            destination /= 'index.html'
        if not destination.exists():
            errors.append({'page': relative, 'href': href, 'error': 'missing destination'})
        elif target.fragment and destination in pages and unquote(target.fragment) not in pages[destination].ids:
            errors.append({'page': relative, 'href': href, 'error': 'missing fragment'})
result = {'pages': len(pages), 'internal_links': count, 'errors': errors}
Path('docs/article-work/access-and-persistence/links.json').write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps(result, indent=2))
raise SystemExit(bool(errors))
