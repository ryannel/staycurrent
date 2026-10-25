"""Prepare fixed-source, independent first-review handoffs for completed drafts."""
from pathlib import Path
import hashlib
import json
import sys

repo = Path('/Users/ryannel/Workspace/staycurrent')
work = repo / 'docs/article-work/relational-rebuild-2026-10-25'
number, *keys = sys.argv[1:]
assert number.isdigit() and keys
batch = work / 'batches' / f'batch-{int(number):02d}'
batch.mkdir(exist_ok=True)
entries = json.loads((repo / 'src/articles/relational-rebuild/collection.json').read_text())['entries']
manifest = {}
reading = []
for key in keys:
    entry = next(e for e in entries if e['key'] == key)
    assert entry['status'] in ['draft', 'reviewed']
    assert (work / 'articles' / key / 'v01/files.json').is_file()
    owned = [repo / f'src/articles/relational-rebuild/{key}{suffix}' for suffix in ['.astro', '.meta.json']]
    for folder in [f'src/components/relational-rebuild-{key}', f'src/article-downloads/relational-rebuild/{key}']:
        owned.extend(p for p in (repo / folder).rglob('*') if p.is_file())
    for path in owned:
        manifest[str(path.relative_to(repo))] = hashlib.sha256(path.read_bytes()).hexdigest()
    reading.append(f"- {key}: {entry['title']} — http://127.0.0.1:4606/review/relational-rebuild/{entry['slug']}/")
assert not (batch / 'review-source.json').exists(), 'Do not replace an assigned review version'
(batch / 'review-source.json').write_text(json.dumps(manifest, indent=2) + '\n')
common = f'''Perform the first independent review of these fixed first versions directly, without edits, delegation or additional reviewers:
{chr(10).join(reading)}

Audience: intelligent application engineers following the article's prerequisites. Use current staycurrent-review and relevant practitioner, teaching, editorial and visual perspectives. Fixed manifest: {batch}/review-source.json. Original first versions: {work}/articles/<key>/v01. Output reports to {batch}. Root owns previews, builds, integration and acceptance. No commits or publication. Do not read older manuscripts, earlier reviews, coordinator state or author quality verdicts.

Calibrate judgement against comparable bounded reference passages and finished drawings in src/reference-articles and http://127.0.0.1:4584/review/examples/{{sequences,indexes,storage}}/. Use owned IAB tabs without visibility options. Subagent tab inventories and viewports are isolated; main/reference-origin theme preferences are shared. Coordinate theme changes on those origins with root; private author-origin checks can run independently. Apply viewport overrides to a fresh owned article tab and verify its actual width. Report version, concise scope, actual limits and concrete findings with location, reader effect and evidence. Passing coverage needs only a short statement. Optional polish does not reopen delivery.
'''
technical = '''Cover technical accuracy, prerequisite depth and accepted ownership. Read each supplied plan, incoming ownership, canonical example facts and applicable primary technical sources, executable checks, model results and native execution provenance. Author input receipts refer to the original snapshot: use v01/input/shared-example.md for its hash when present; today's canonical facts may include later independent variations. Distinguish illustrative models from observed execution and inspect the actual source/artifact hashes. Reuse relevant existing execution evidence; ask root to reproduce only a concrete concern on an owned fixture. Do not target an existing/default database. Withhold authoring-checks and previous quality judgements. Save practitioner.md.
'''
reader = '''Combine the first blind editorial/teaching reading and actual rendered judgement. Read the figures, labels, captions and controls, then the article body. Save initial-notes.md BEFORE consulting plans, example facts, author notes or any verdict. Then consult the intended reader understanding and ownership to complete teaching coverage, without an automatic full reread. Judge actual language, headings and visual explanation against the references with concrete examples. Applicable authored mechanical observations may be retained after the initial blind notes; they are not quality verdicts. Once root grants the main-origin theme lease, inspect meaningful current figure states, representative phone and both themes and relevant controls, without repeating a complete mechanical matrix. Restore 1280×720/System, stop/reset players and close owned tabs before releasing the lease. Save reader.md, including actual browser/observation limits.
'''
for role, scope in [('practitioner', technical), ('reader', reader)]:
    path = work / 'assignments' / f'batch{int(number):02d}-{role}.txt'
    assert not path.exists()
    path.write_text(common + '\n' + scope)
print(batch)
