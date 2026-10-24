"""Make a minimal fresh author workspace; no old draft, feedback or Git history."""
import datetime
import hashlib
import json
from pathlib import Path
import shutil
import sys

REPO = Path(__file__).resolve().parents[3]
WORK = Path(__file__).resolve().parent
key = sys.argv[1]
packet = WORK / 'writers' / key
dest = Path('/private/tmp') / f'staycurrent-relational-20261024-{key}'
if dest.exists():
    raise SystemExit(f'Workspace already exists: {dest}')
allowlist = json.loads((REPO / 'docs/article-work/relational-first-version-2026-10-23/clean-workspace.json').read_text())['files']
paths = [p for p in allowlist if not p.startswith('input/') and p != 'docs/coverage/relational-example.md']
for rel in paths:
    source = REPO / rel
    if source.is_file():
        target = dest / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, target)
shutil.copytree(packet / 'input', dest / 'input')
example = dest / 'docs/coverage/relational-example.md'
example.parent.mkdir(parents=True, exist_ok=True)
shutil.copy2(packet / 'input/example-facts.md', example)
shutil.copy2(packet / 'input/example-facts.md', dest / 'docs/coverage/relational-2026-10-24-example.md')
shutil.copytree(REPO / 'src/lib/relational-collection', dest / 'src/lib/relational-collection', dirs_exist_ok=True)
(dest / 'node_modules').symlink_to(REPO / 'node_modules', target_is_directory=True)
files = {str(p.relative_to(dest)): hashlib.sha256(p.read_bytes()).hexdigest()
         for p in dest.rglob('*') if p.is_file() and 'node_modules' not in p.parts}
receipt = {'created_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
           'path': str(dest), 'files': files,
           'isolation': 'Minimal copied author inputs, references and shared primitives; no earlier draft, review, diagnostics or Git history. Shared node_modules link. This is input isolation, not an OS security boundary.'}
packet.mkdir(parents=True, exist_ok=True)
(packet / 'workspace.json').write_text(json.dumps(receipt, indent=2) + '\n')
print(dest)
