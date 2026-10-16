from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import re,json,urllib.request
paths=list(Path('src/pages/learn/databases/object-storage').glob('*.md'))+[Path('src/pages/learn/databases/object-storage.astro')]
urls=sorted({url for p in paths for url in re.findall(r'https://[^\s<>"\)]+',p.read_text()) if 'app.example' not in url})
def check(url):
 try:
  with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'StayCurrentEditorialLinkCheck/1.0'}),timeout=25) as r:
   text=r.read().decode('utf-8',errors='replace');title=re.search(r'<title[^>]*>(.*?)</title>',text,re.S)
   return {'url':url,'status':r.status,'final':r.url,'title':re.sub(r'\s+',' ',title.group(1)).strip() if title else None}
 except Exception as e:return {'url':url,'error':str(e)}
with ThreadPoolExecutor(max_workers=5) as ex:results=list(ex.map(check,urls))
Path('docs/article-work/object-storage/external-links.json').write_text(json.dumps(results,indent=2))
print(json.dumps({'checked':len(results),'errors':[r for r in results if 'error'in r],'redirected':[r for r in results if 'final'in r and r['final'].split('#')[0]!=r['url'].split('#')[0]]},indent=2))
