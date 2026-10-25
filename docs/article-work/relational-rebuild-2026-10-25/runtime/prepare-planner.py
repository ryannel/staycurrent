from pathlib import Path
import json,shutil,sys
repo=Path('/Users/ryannel/Workspace/staycurrent');r=repo/'docs/article-work/relational-rebuild-2026-10-25';key=sys.argv[1]
tree=json.loads((r/'planning/accepted-map/collection-map.json').read_text());by={a['key']:a for a in tree['articles']};a=by[key]
w=Path('/private/tmp/staycurrent-relational-rebuild-'+key+'-planner-20261025');assert not w.exists();w.mkdir();(w/'input').mkdir();(w/'output').mkdir()
for skill in ['staycurrent-breakdown','staycurrent-write','staycurrent-figures','staycurrent-continuity']:shutil.copytree(repo/'.agents/skills'/skill,w/'.agents/skills'/skill)
shutil.copytree(repo/'src/reference-articles',w/'src/reference-articles');(w/'scripts').mkdir();shutil.copy2(repo/'scripts/read-writing-reference.py',w/'scripts/read-writing-reference.py')
shutil.copy2(r/'commission.md',w/'input/commission.md');shutil.copy2(repo/'docs/coverage/relational-rebuild-2026-10-25-example.md',w/'input/shop-example.md')
(w/'input/article.json').write_text(json.dumps(a,indent=2)+'\n')
relevant=[x for x in tree['articles'] if x['key']==a['parent_key'] or x['parent_key']==key or x['key'] in a['neighbouring_ownership']]
(w/'input/neighbours.json').write_text(json.dumps(relevant,indent=2)+'\n')
incoming=[{'from_key':x['key'],'from_title':x['title'],'responsibility':x['neighbouring_ownership'][key]} for x in tree['articles'] if key in x['neighbouring_ownership']]
(w/'input/incoming-ownership.json').write_text(json.dumps(incoming,indent=2)+'\n')
links=[{'key':x['key'],'title':x['title'],'href':'/learn/databases/relational/'+(x['slug']+'/' if x['slug'] else '')} for x in tree['articles']]
(w/'input/reading-links.json').write_text(json.dumps(links,indent=2)+'\n')

assignment=f'''Plan the one {a['title']} article under the supplied current staycurrent-breakdown skill. Your only local workspace is {w}. Read input/commission.md, input/article.json, input/neighbours.json, input/incoming-ownership.json, input/reading-links.json and input/shop-example.md. The complete collection ownership/prerequisite tree is accepted; respect its outcomes and parent–child boundaries. This is the detailed outline for this article as writing is prepared, not another complete collection review.

Read all bounded reference text parts separately with scripts/read-writing-reference.py and their END markers. Study comparable finished drawings at http://127.0.0.1:4584/review/examples/{{sequences,indexes,storage}}/. In a subagent create owned IAB tabs without visibility options (explicit visibility presets can fail). Use owned temporary tabs without viewport/theme changes or user-tab operations and close them afterwards. Do not read the main repository, old bodies, previous outlines/reviews, feedback or other workers' notes. Verify consequential claims against external primary sources; use the shared starting facts and propose scenario extensions centrally. Root is the sole preview/build/integration owner.

Return output/plan.yaml in the breakdown schema with concise reader-understanding briefs. Add contextual child stubs only for distinct deeper outcomes; propose changed/new ownership centrally rather than silently adding pages. Leave prose and visual design to the fresh reference-led writer. Return concise output/notes.md for reference exposure, sources, example decisions and unresolved boundaries. Plain British English. No article writing, implementation, delegation, reviews, builds, servers, commits or publication. Root integrates this outline; the eventual article review checks its delivered understanding without a separate per-node planning review.
'''
(w/'input/assignment.txt').write_text(assignment);(r/'assignments'/f'{key}-plan.txt').write_text(assignment)
p=r/'status.json';s=json.loads(p.read_text());s['articles'][key]={'state':'detailed planning'};p.write_text(json.dumps(s,indent=2)+'\n')
print(str(w))
