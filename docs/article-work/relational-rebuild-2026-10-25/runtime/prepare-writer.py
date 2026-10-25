from pathlib import Path
import shutil,json,sys
r=Path('/Users/ryannel/Workspace/staycurrent');work=r/'docs/article-work/relational-rebuild-2026-10-25';key=sys.argv[1];port=int(sys.argv[2]);w=Path('/private/tmp/staycurrent-relational-rebuild-'+key+'-writer-20261025');assert not w.exists();w.mkdir();base=Path('/private/tmp/staycurrent-relational-rebuild-query-results-writer-20261025')
for d in ['input','evidence','src/articles/current','src/pages/review','docs/coverage']:(w/d).mkdir(parents=True,exist_ok=True)
for rel in ['src/components/editorial','src/components/figures','src/components/explainers/querying','src/layouts','src/lib','src/scripts','src/styles']:
 src=base/rel
 if src.exists():shutil.copytree(src,w/rel,dirs_exist_ok=True)
# SQL component infrastructure only; no old article or specialised figure implementation.
if not (w/'src/components/explainers/querying/Sql.astro').exists():
 (w/'src/components/explainers/querying').mkdir(parents=True,exist_ok=True)
 shutil.copy2(r/'src/components/explainers/querying/Sql.astro',w/'src/components/explainers/querying/Sql.astro')
for rel in ['astro.config.mjs','package.json','pnpm-lock.yaml']:
 shutil.copy2(base/rel,w/rel)
p=w/'astro.config.mjs';p.write_text(p.read_text().replace("site: 'https://staycurrent.dev',","site: 'https://staycurrent.dev',\n  devToolbar: { enabled: false },"))
shutil.copy2(r/'src/styles/relational-rebuild-code.css',w/'src/styles/relational-rebuild-code.css')
(w/'node_modules').symlink_to(r/'node_modules',target_is_directory=True)
for skill in ['staycurrent-write','staycurrent-figures','staycurrent-continuity']:shutil.copytree(r/'.agents/skills'/skill,w/'.agents/skills'/skill)
shutil.copytree(r/'src/reference-articles',w/'src/reference-articles');(w/'scripts').mkdir();shutil.copy2(r/'scripts/read-writing-reference.py',w/'scripts/read-writing-reference.py')
shutil.copy2(work/'runtime/native-verification.md',w/'input/native-verification.md');shutil.copy2(work/'commission.md',w/'input/commission.md');shutil.copy2(work/'planning/articles'/key/'plan.yaml',w/'input/plan.yaml');shutil.copy2(r/'docs/coverage/relational-rebuild-2026-10-25-example.md',w/'docs/coverage/relational-rebuild-2026-10-25-example.md')
tree=json.loads((work/'planning/accepted-map/collection-map.json').read_text());by={a['key']:a for a in tree['articles']};a=by[key]
relevant=[x for x in tree['articles'] if x['key']==a['parent_key'] or x['parent_key']==key or x['key'] in a['neighbouring_ownership']]
(w/'input/neighbours.json').write_text(json.dumps(relevant,indent=2)+'\n')
incoming=[{'from_key':x['key'],'from_title':x['title'],'responsibility':x['neighbouring_ownership'][key]} for x in tree['articles'] if key in x['neighbouring_ownership']]
(w/'input/incoming-ownership.json').write_text(json.dumps(incoming,indent=2)+'\n')
links=[{'key':x['key'],'title':x['title'],'href':'/learn/databases/relational/'+(x['slug']+'/' if x['slug'] else '')} for x in tree['articles']]
(w/'input/reading-links.json').write_text(json.dumps(links,indent=2)+'\n')
(w/'input/article.json').write_text(json.dumps(a,indent=2)+'\n')
registry=json.loads((r/'src/articles/relational-rebuild/collection.json').read_text())
related={x['key'] for x in relevant}|{x['from_key'] for x in incoming}
finished=[{'key':x['key'],'title':x['title'],'url':'http://127.0.0.1:4606/review/relational-rebuild/'+(x['slug']+'/' if x['slug'] else '')} for x in registry['entries'] if x['key'] in related and x['status'] in ['draft','reviewed']]
(w/'input/finished-reading.json').write_text(json.dumps(finished,indent=2)+'\n')

layout=w/'src/layouts/ArticleDraft.astro';layout.write_text(layout.read_text().replace("type = 'Guide'","type = 'Deep dive'").replace("import '../styles/relational-design.css';","import '../styles/relational-design.css';\nimport '../styles/relational-rebuild-code.css';"))
(w/'src/pages/review/article.astro').write_text('''---\nimport ArticleDraft from '../../layouts/ArticleDraft.astro';\nexport function getStaticPaths() { return []; }\nconst fragments = import.meta.glob('../../articles/current/article.astro', { eager: true, import:'default' });\nconst metas = import.meta.glob('../../articles/current/article.meta.json', { eager:true, import:'default' });\nconst Component = Object.values(fragments)[0];\nconst meta = Object.values(metas)[0] || {title:'Draft',description:'Unpublished draft'};\n---\n<ArticleDraft {...meta}>{Component && <Component />}</ArticleDraft>\n'''.replace('export function getStaticPaths() { return []; }\n',''))
# No draft exists at dispatch. The writer composes from its plan/reference inputs.
assignment=f'''Write the first complete {a['title']} article using the current staycurrent-write, figures and continuity skills. Work only in {w}. Read input/commission.md, input/article.json, input/plan.yaml, input/neighbours.json, input/incoming-ownership.json, input/reading-links.json, input/finished-reading.json and docs/coverage/relational-rebuild-2026-10-25-example.md. The references lead writing and illustration; the plan supplies intended reader understanding and ownership. Child scopes are context rather than a coverage checklist. Incoming ownership records supply responsibilities assigned here by neighbouring articles; the link index supplies exact destinations. No older manuscript or feedback is supplied. Do the assignment directly, without delegation or independent review.

Read all19 bounded reference parts separately with scripts/read-writing-reference.py and verify END markers; recover clipped outputs. Study finished drawings at http://127.0.0.1:4584/review/examples/{{sequences,indexes,storage}}/ in owned tabs, using cua.createBrowserTab('iab', URL) without visibility options in a subagent. input/finished-reading.json gives currently complete neighbouring reading for factual and prerequisite context; the three fixed references lead the writing and teaching. Do not read main repository files, previous drafts, old plans/reviews, other workers' notes or published Stay Current bodies. Verify consequential claims against external primary sources. Shared rows are starting facts for coherent scenarios. Propose shared business-fact or ownership changes centrally; choose local illustrative assumptions yourself and record them accurately.

Own src/articles/current/article.astro and article.meta.json (title, description, optional supported type Introduction/Deep dive/Companion/Worked example/Assessment), src/components/relational-rebuild-{key}/ and optional public/relational-rebuild/{key}/ downloads/assets. Write only the article body fragment: the supplied page wrapper already applies ArticleBody/contents, header, navigation and source disclosure. Use supplied theme, Sql and player infrastructure; root owns server/build/integration/commits. Figure panel labels are captions/text, not document section headings. The wrapper supplies collection navigation/child reading and closes sources at the absolute bottom. Use canonical neighbour /learn/databases/relational/ links; the supplied collection wrapper handles destination availability labels. Source preview: http://127.0.0.1:{port}/review/article/.

Do not run pnpm, install dependencies, launch servers or edit infrastructure. Request a compilation once first complete source exists, then a final stable compilation if authoring changes invalidate it. Verify SQL/results with the installed @electric-sql/pglite0.5.8 (actual PostgreSQL18.3/WASM) in an owned disposable instance; import from supplied node_modules, close it afterwards, retain scripts/results and accurately identify runtime. Native initdb is currently unavailable on this host; do not retry it or target any existing/default database. Label conceptual schedules as such; report observed runs only with the actual runtime and evidence.

Finish the normal authoring reread, continuity, model/SQL checks and rendered/control checks under the skills. Your subagent tabs/viewport and private preview origin are independent of other writers. You may check that private preview's viewport/theme without a global lease; coordinate any main/reference-origin theme changes with root. Apply viewport overrides to a fresh owned article tab and verify its actual width. Use owned tabs; restore1280x720/System, stop playback and close tabs after UI work. Reference-study tabs retain existing settings. Keep concise evidence/reference-exposure.md, example-facts.md, technical-sources.md and authoring-checks.md, exact source hashes and actual limits. Send meaningful progress plus build/browser requests. Stop when the first complete stable source/checks are ready; root freezes it before independent review. No commits or publication commissioned to you.\n'''
assignment+='\nNative PostgreSQL verification is also available when the example depends on a server, real client connection, filesystem or concurrent sessions. Read input/native-verification.md; root can arrange an explicitly owned disposable fixture or run a verifier on request. PGlite remains suitable for ordinary SQL. Request missing client dependencies from root; never install into the main repository.\n'
(w/'input/writing-assignment.txt').write_text(assignment);(work/'assignments'/(key+'-writing.txt')).write_text(assignment)
print(str(w))
