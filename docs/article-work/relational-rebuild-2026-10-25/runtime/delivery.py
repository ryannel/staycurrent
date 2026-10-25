from pathlib import Path
import sys,os,json,hashlib,subprocess,shutil,gzip
repo=Path('/Users/ryannel/Workspace/staycurrent')
role=sys.argv[2]; key='relational-introduction' if role=='introduction' else role
w=Path('/private/tmp/staycurrent-relational-rebuild-'+role+'-writer-20261025')
r=repo/'docs/article-work/relational-rebuild-2026-10-25/articles'/key
r.mkdir(parents=True,exist_ok=True)
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def sources():
 d={}
 for folder in ['src','public']:
  p=w/folder
  if p.exists():
   for f in sorted(p.rglob('*')):
    if f.is_file() and 'reference-articles' not in f.parts:d[str(f.relative_to(w))]=sha(f)
 for name in ['package.json','pnpm-lock.yaml','astro.config.mjs']:d[name]=sha(w/name)
 return d
mode=sys.argv[1]
if mode=='build':
 before=sources();assert 'src/articles/current/article.astro' in before
 env=os.environ.copy();env['ARTICLE_DRAFT_PREVIEW']='1';env['ASTRO_TELEMETRY_DISABLED']='1'
 p=subprocess.run(['/opt/homebrew/bin/node',str(repo/'node_modules/astro/astro.js'),'build'],cwd=w,env=env,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
 after=sources();(r/'latest-build.log').write_bytes(p.stdout)
 result={'exit_code':p.returncode,'source_unchanged_during_build':before==after,'source_files':after}
 (r/'latest-build.json').write_text(json.dumps(result,indent=2)+'\n')
 if p.returncode:print(p.stdout.decode(errors='replace')[-6500:])
 print(json.dumps({'key':key,'exit_code':p.returncode,'source_unchanged_during_build':before==after}))
 sys.exit(p.returncode)
elif mode=='freeze':
 built=json.loads((r/'latest-build.json').read_text());assert built['exit_code']==0 and built['source_unchanged_during_build'];assert sources()==built['source_files'],'source changed after compilation'
 dest=r/'v01';assert not dest.exists();(dest/'source').mkdir(parents=True)
 owned=[]
 for rel in built['source_files']:
  if rel.startswith(('src/articles/current/','src/components/relational-rebuild-','public/')):
   target=dest/'source'/rel;target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(w/rel,target);owned.append(rel)
 shutil.copytree(w/'evidence',dest/'evidence')
 shutil.copytree(w/'input',dest/'input')
 if (w/'docs/coverage/relational-rebuild-2026-10-25-example.md').exists():shutil.copy2(w/'docs/coverage/relational-rebuild-2026-10-25-example.md',dest/'input/shared-example.md')
 shutil.copy2(r/'latest-build.json',dest/'build.json')
 with gzip.open(dest/'build.log.gz','wb') as f:f.write((r/'latest-build.log').read_bytes())
 allhash={str(p.relative_to(dest)):sha(p) for p in sorted(dest.rglob('*')) if p.is_file()}
 (dest/'files.json').write_text(json.dumps(allhash,indent=2)+'\n')
 (r/'first-version.json').write_text(json.dumps({'key':key,'version':'v01','owned_files':owned,'source_matches_final_build':True,'independent_review':False},indent=2)+'\n')
 print(json.dumps({'key':key,'frozen_files':len(allhash),'owned_source_files':len(owned)}))
elif mode=='integrate':
 dest=r/'v01';assert dest.exists()
 transformations=[]
 def integrate_copy(source,target):
  target.parent.mkdir(parents=True,exist_ok=True)
  if source.suffix in ['.astro','.mjs','.js','.ts','.css']:
   original=source.read_text();updated=original.replace('../../../public/relational-rebuild/','../../article-downloads/relational-rebuild/')
   target.write_text(updated)
   if original!=updated:transformations.append({'file':str(target.relative_to(repo)),'baseline_sha256':sha(source),'integrated_sha256':sha(target),'change':'Rebase source asset imports from private public/ into nonpublic staged article-downloads/. Asset bytes and reader material unchanged.'})
  else:shutil.copy2(source,target)
 a=repo/'src/articles/relational-rebuild';integrate_copy(dest/'source/src/articles/current/article.astro',a/(key+'.astro'));integrate_copy(dest/'source/src/articles/current/article.meta.json',a/(key+'.meta.json'))
 for folder in ['src/components','public']:
  p=dest/'source'/folder
  if p.exists():
   for f in p.rglob('*'):
    if f.is_file():
     target=(repo/'src/article-downloads'/f.relative_to(dest/'source/public')) if folder=='public' else repo/f.relative_to(dest/'source')
     target.parent.mkdir(parents=True,exist_ok=True)
     if folder == 'public':shutil.copy2(f,target)
     else:integrate_copy(f,target)
 if transformations:(r/'integration.json').write_text(json.dumps({'baseline':'v01/source','transformations':transformations,'publication':'Assets remain nonpublic; author first source preserved.'},indent=2)+'\n')
 registry=a/'collection.json';x=json.loads(registry.read_text());entry=next(e for e in x['entries'] if e['key']==key);entry['status']='draft';registry.write_text(json.dumps(x,indent=2)+'\n')
 statusfile=repo/'docs/article-work/relational-rebuild-2026-10-25/status.json'
 if statusfile.exists():
  status=json.loads(statusfile.read_text());status['available_drafts']=sum(e['status'] in ['draft','reviewed'] for e in x['entries']);status['reviewed_drafts']=sum(e['status']=='reviewed' for e in x['entries'])
  status['articles'].setdefault(key,{}).update(state='first stable version frozen/integrated; independent review pending',writer_state='complete')
  statusfile.write_text(json.dumps(status,indent=2)+'\n')
 print(json.dumps({'integrated_first_version':key,'asset_import_rebases':len(transformations)}))
else:raise SystemExit('use build, freeze or integrate with article role')
