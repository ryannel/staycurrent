"""Select concise author context from the reviewed plan without prescribing its media."""
from pathlib import Path
import json
import re
import shutil
import sys

WORK = Path(__file__).resolve().parent
REPO = WORK.parents[2]
key = sys.argv[1]
articles = json.loads((WORK / 'planning/articles.json').read_text())
node = next(a for a in articles if a['key'] == key)
by_id = {a['id']: a for a in articles}
packet = WORK / 'writers' / key
inputs = packet / 'input'
(inputs / 'finished-reading').mkdir(parents=True, exist_ok=True)
brief = [f"# {node['title']}", '', node['brief'], '', '## What the reader should understand', '']
brief.extend(f'- {outcome}' for outcome in node['outcomes'])
brief += ['', '## Starting knowledge', '', node.get('entry', ''), '',
          'This article contributes to the collection’s newcomer-to-practitioner journey. Teach its subject properly; neighbouring scopes below are boundaries and optional further reading, not a checklist of introductory coverage.', '',
          '## Neighbouring ownership', '']
brief.extend(f"- {by_id[identity]['title']}: {scope}" for identity, scope in node.get('neighbours', {}).items())
brief += ['', '## Prerequisite context', '']
for identity in node.get('prerequisites', []):
    other = by_id[identity]
    source = REPO / 'src/articles/relational-collection' / f"{other['key']}.astro"
    if source.exists():
        shutil.copy2(source, inputs / 'finished-reading' / source.name)
        preview = f"http://127.0.0.1:4368/review/relational-collection/{other['slug'] + '/' if other['slug'] else ''}"
        brief.append(f"- {other['title']}: supplied complete draft source ({source.name}); rendered context at {preview}. This is entry context, not an independent review verdict.")
    else:
        brief.append(f"- {other['title']}: planned starting knowledge: {'; '.join(other['outcomes'])}. Its finished draft is not yet available; do not infer wording from old versions.")
intro = REPO / 'src/articles/relational-collection/r00.astro'
if intro.exists():
    shutil.copy2(intro, inputs / 'finished-reading/r00.astro')
brief += ['', 'The supplied introduction establishes common entrance knowledge; its rendered context is http://127.0.0.1:4368/review/relational-collection/. The three fixed references remain the prose and teaching standard.', '',
          '## Output', '', f'Body fragment: src/articles/relational-collection/{key}.astro. Supporting components: src/components/relational-collection/{key}/. The orchestrator supplies shell, navigation, contents and final source disclosure. Choose the final title and description in metadata.json. Use public collection article URLs in body links; the preview shell remaps ready drafts.', '']
(inputs / 'brief.md').write_text('\n'.join(brief))
facts = (REPO / 'docs/coverage/relational-2026-10-24-example.md').read_text()
facts = facts.split('## The core example: a small online shop', 1)[1]
facts = ('# Shared shop facts\n\nThe report includes order 103. The purchase race starts before 103; its protected outcome includes 103 and excludes 104. Orders 101 and 102 are earlier history, not deductions from the stated starting stock. The amounts have no assigned currency.\n\n## A small online shop' + facts)
facts = re.sub(r'^## Accepted extension E\d+: (.+)$', lambda m: '## ' + m[1][0].upper() + m[1][1:], facts, flags=re.MULTILINE)
facts = facts.replace('Existing E2 session S501', 'Tea-class session S501')
facts = re.sub(r'\baccepted (?=variant\b)', '', facts)
(inputs / 'example-facts.md').write_text(facts)
links = {'purpose': 'Optional article destinations and neighbours, not a coverage checklist.', 'articles': [
    {'title': a['title'], 'url': f"/learn/databases/relational/{a['slug'] + '/' if a['slug'] else ''}"} for a in articles]}
(inputs / 'links.json').write_text(json.dumps(links, indent=2) + '\n')
workspace = f'/private/tmp/staycurrent-relational-20261024-{key}'
assignment = (WORK / 'writer-assignment-template.txt').read_text().format(workspace=workspace, key=key)
(inputs / 'assignment.txt').write_text(assignment)
(packet / 'plan-node.json').write_text(json.dumps(node, indent=2) + '\n')
print(packet)
