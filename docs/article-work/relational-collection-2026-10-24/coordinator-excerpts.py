from pathlib import Path
import json,re,html,sys
w=Path(__file__).resolve().parent
a={a['key']:a for a in json.loads((w/'planning/articles.json').read_text())}
base=Path('/private/tmp/staycurrent-relational-cockroach52-53-final2-author/review/relational-collection')
def clean(t):
 t=re.sub(r'<(?:script|style)\b[^>]*>.*?</(?:script|style)>','',t,flags=re.S)
 return ' '.join(html.unescape(re.sub('<[^>]+>',' ',t)).split())
for key in sys.argv[1:]:
 slug=a[key]['slug'];f=base/slug/'index.html';s=f.read_text();match=re.search(r'<article\b[^>]*>(.*?)</article>',s,re.S);body=match.group(1) if match else s
 body=re.split(r'<nav[^>]*id=\"collection\"',body)[0]
 ps=[clean(t) for t in re.findall(r'<p\b[^>]*>(.*?)</p>',body,re.S)]
 hs=[clean(t) for t in re.findall(r'<h[12]\b[^>]*>(.*?)</h[12]>',body,re.S)]
 print('\n###',key,a[key]['title']);print('HEADINGS:', ' | '.join(hs));print('OPENING:', '\n'.join(ps[:4]));print('ENDING:', '\n'.join(ps[-2:]));print('END EXCERPT',key)
