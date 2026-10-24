"""Freeze source, context and mechanical records for one independent article batch."""
from pathlib import Path
import datetime
import hashlib
import json
import re
import shutil
import sys
import yaml

root = Path(__file__).resolve().parents[3]
work = Path(__file__).resolve().parent
batch, version, *keys = sys.argv[1:]
if not keys or any(not re.fullmatch(r'r\d{2}', key) for key in keys):
    raise SystemExit('Usage: make-review-packet.py batch version rXX ...')
target = work / 'reviews' / batch / version
target.mkdir(parents=True, exist_ok=False)
source = target / 'source'
source.mkdir()

def copy(relative):
    src = root / relative
    dst = source / relative
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(src, dst)

queue = [Path('src/layouts/RelationalCollectionDraft.astro'),
         Path('src/pages/review/relational-collection/[...slug].astro'),
         Path('src/pages/review/relational-collection/evidence/[...file].ts')]
for key in keys:
    queue.append(Path(f'src/articles/relational-collection/{key}.astro'))
    meta = Path(f'src/articles/relational-collection/{key}.meta.json')
    if (root / meta).exists():
        queue.append(meta)
    namespace = root / ('src/components/relational-first-version' if key == 'r00'
                        else f'src/components/relational-collection/{key}')
    if namespace.exists():
        queue.extend(p.relative_to(root) for p in namespace.rglob('*') if p.is_file())

seen = set()
while queue:
    relative = queue.pop()
    if relative in seen:
        continue
    seen.add(relative)
    copy(relative)
    try:
        text = (root / relative).read_text()
    except UnicodeDecodeError:
        continue
    for path in re.findall(r'''(?:from\s*|import\s*\(?\s*)['"](\.[^'"\n]+)''', text):
        dependency = ((root / relative).parent / path.split('?')[0]).resolve()
        choices = [dependency] if dependency.suffix else [dependency.with_suffix(s) for s in ('.ts', '.mjs', '.js', '.astro', '.json')]
        match = next((p for p in choices if p.is_file() and p.is_relative_to(root)), None)
        if match:
            queue.append(match.relative_to(root))

context = target / 'context'
context.mkdir()
for src, name in [(work / 'commission.md', 'commission.md'),
                  (root / 'docs/coverage/relational-2026-10-24.yaml', 'tree.yaml'),
                  (root / 'docs/coverage/relational-2026-10-24-example.md', 'example.md')]:
    shutil.copyfile(src, context / name)
articles = json.loads((work / 'planning/articles.json').read_text())
(context / 'briefs.json').write_text(json.dumps([a for a in articles if a['key'] in keys], indent=2) + '\n')
# Keep each article's actual plan independently readable. The canonical tree is
# retained, but readers need not emit its entire recursive body in one tool call.
def local_plan(value):
    if isinstance(value, list):
        return [local_plan(item) for item in value]
    if isinstance(value, dict):
        return {name: ({field: item[field] for field in
                       ('id', 'key', 'slug', 'title', 'brief', 'outcomes', 'entry')
                       if field in item}
                      if name == 'nested_article' and isinstance(item, dict)
                      else local_plan(item)) for name, item in value.items()}
    return value

plans = context / 'plans'
plans.mkdir()
def collect_plans(value):
    if isinstance(value, dict):
        if value.get('id') and value.get('key'):
            (plans / f"{value['id']}.json").write_text(
                json.dumps(local_plan(value), indent=2) + '\n')
        for item in value.values():
            collect_plans(item)
    elif isinstance(value, list):
        for item in value:
            collect_plans(item)

collect_plans(yaml.safe_load((context / 'tree.yaml').read_text()))
for key in keys:
    evidence = work / 'writers' / key / 'evidence'
    if evidence.exists():
        for p in evidence.rglob('*'):
            if (p.is_file() and p.suffix not in ('.diff', '.pyc')
                    and not {'__pycache__', 'venv', '.venv', 'node_modules', '.cache'}.intersection(p.parts)
                    and not p.name.startswith(('reference', 'continuity', 'write-records', 'writer-record', 'author-', 'repair'))
                    and 'before' not in p.name
                    and (p.suffix != '.md' or p.name == 'sources.md')):
                # Markdown author study/reread records are not mechanical inputs.
                dst = target / 'mechanical' / key / p.relative_to(evidence)
                dst.parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(p, dst)

audience = ('An intelligent engineer learning relational databases, familiar with application requests and stored data. '
            'Each piece’s intended starting knowledge is listed below. '
            'The three fixed reference articles supply the writing and teaching standard. Plain British English.\n')
audience += '\n' + '\n'.join(f"- {a['key']} — {a['title']}: {a['entry']}" for a in articles if a['key'] in keys) + '\n'
(target / 'audience.md').write_text(audience)
manifest = {'version': f'{batch}-{version}', 'frozen_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
            'source_root': str(source), 'keys': keys, 'preview': None,
            'article_paths': {a['key']: a['slug'] + '/' if a['slug'] else ''
                              for a in articles if a['key'] in keys},
            'files': {str(p.relative_to(target)): hashlib.sha256(p.read_bytes()).hexdigest()
                      for p in target.rglob('*') if p.is_file()},
            'permitted_inputs': {'practitioner': ['source/', 'context/', 'mechanical/', 'rendered pieces'],
                                 'teaching': ['context/', 'complete rendered pieces', 'fixed references in full'],
                                 'editorial': ['audience.md', 'complete rendered pieces', 'fixed references in full'],
                                 'visual': ['rendered pieces and isolated figures', 'mechanical/', 'rendered fixed reference figures']},
            'limits': 'No author teaching notes, earlier quality verdicts or review findings are included. Mechanical records are author/root observations, not independent perspective verdicts. Frozen source is for verification, not a separate running checkout.'}
(target / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(target)
