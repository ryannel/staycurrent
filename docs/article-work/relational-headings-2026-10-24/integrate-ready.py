"""Integrate one frozen heading-only batch, proving body and anchor preservation."""
from pathlib import Path
import hashlib, json, re, shutil, sys
work=Path(__file__).resolve().parent
root=work.parents[2]
group,receipt_name=sys.argv[1:]
config=json.loads((work/f'workspace-{group}.json').read_text())
workspace=Path(config['workspace'])
receipt=json.loads((workspace/'output'/receipt_name).read_text())
baseline=json.loads((work/'baseline.json').read_text())['files']
rows=receipt.get('articles',receipt.get('pieces'))
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
mask=lambda s:re.sub(r'(<h([234])\b[^>]*>).*?(</h\2>)',r'\1HEADING\3',s,flags=re.S)
changes=[]
for row in rows:
 key=row.get('article',row.get('piece'));assert key in config['keys']
 relative=f'src/articles/relational-collection/{key}.astro'
 target=root/relative;incoming=workspace/relative
 expected=row.get('article_sha256',row.get('result_sha256',row.get('proof',{}).get('after_sha256')))
 assert sha(incoming)==expected,(key,'incoming changed after freeze')
 assert sha(target)==baseline[relative],(key,'target changed since baseline')
 before=target.read_text();after=incoming.read_text()
 assert mask(before)==mask(after),(key,'body/tag/ID change')
 old=re.findall(r'<h[234]\b[^>]*>(.*?)</h[234]>',before,re.S)
 new=re.findall(r'<h[234]\b[^>]*>(.*?)</h[234]>',after,re.S)
 assert len(old)==len(new)
 pairs=[{'old':a,'new':b} for a,b in zip(old,new) if a!=b]
 meta_relative=f'src/articles/relational-collection/{key}.meta.json'
 meta=root/meta_relative;new_meta=workspace/meta_relative
 if meta.exists():
  assert sha(meta)==baseline[meta_relative]
  a=json.loads(meta.read_text());b=json.loads(new_meta.read_text())
  assert {k:v for k,v in a.items() if k!='title'}=={k:v for k,v in b.items() if k!='title'},(key,'metadata outside title')
  if a!=b:shutil.copyfile(new_meta,meta)
 if before!=after:shutil.copyfile(incoming,target)
 changes.append({'key':key,'headings':pairs,'source_sha256':sha(target),'nonheading_bytes_and_anchor_ids_unchanged':True,'metadata_title_only_or_unchanged':True})
(work/f'integrated-{group}-{receipt_name}').write_text(json.dumps({'receipt':receipt,'coordinator_preservation':changes},indent=2)+'\n')
print(json.dumps({'batch':f'{group}/{receipt_name}','checked':len(changes),'heading_changes':sum(len(x['headings']) for x in changes)}))
