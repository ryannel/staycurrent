"""Copy only an assigned fresh author's namespace; freeze first returns separately."""
from pathlib import Path
import datetime
import hashlib
import json
import shutil
import sys

WORK = Path(__file__).resolve().parent
REPO = WORK.parents[2]
key = sys.argv[1]
mode = sys.argv[2] if len(sys.argv) > 2 else 'preview'
if mode not in ('preview', 'return'):
    raise SystemExit('mode must be preview or return')
workspace = Path('/private/tmp') / f'staycurrent-relational-20261024-{key}'
packet = WORK / 'writers' / key
if mode == 'return' and (packet / 'first-return').exists():
    raise SystemExit('First return already frozen; will not overwrite its snapshot')
manifest = json.loads((packet / 'workspace.json').read_text())
changed_inputs = [rel for rel, expected in manifest['files'].items()
                  if not (workspace / rel).is_file()
                  or hashlib.sha256((workspace / rel).read_bytes()).hexdigest() != expected]
if changed_inputs:
    raise SystemExit(f'Protected author inputs changed: {changed_inputs}')
fragment = Path('src/articles/relational-collection') / f'{key}.astro'
if not (workspace / fragment).is_file():
    raise SystemExit('No complete article fragment supplied')
files = [fragment]
components = Path('src/components/relational-collection') / key
if (workspace / components).exists():
    files += [p.relative_to(workspace) for p in (workspace / components).rglob('*')
              if p.is_file() and '__pycache__' not in p.parts and p.suffix != '.pyc']
# Keep only this author's current namespace; ordinary finishing can remove files.
removed = []
if (REPO / components).exists():
    for existing in (REPO / components).rglob('*'):
        if existing.is_file() and existing.relative_to(REPO) not in files:
            removed.append({'path': str(existing.relative_to(REPO)),
                            'sha256': hashlib.sha256(existing.read_bytes()).hexdigest()})
            existing.unlink()
for rel in files:
    target = REPO / rel
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(workspace / rel, target)
metadata = workspace / 'metadata.json'
if metadata.is_file():
    authored = json.loads(metadata.read_text())
    if not all(isinstance(authored.get(field, ''), str) for field in ('title', 'description')):
        raise SystemExit('Invalid authored metadata')
    target = REPO / 'src/articles/relational-collection' / f'{key}.meta.json'
    target.write_text(json.dumps({field: authored[field] for field in ('title', 'description') if field in authored}, indent=2) + '\n')
    files.append(target.relative_to(REPO))
packet = WORK / 'writers' / key
packet.mkdir(parents=True, exist_ok=True)
if (workspace / 'writer-record.md').exists():
    shutil.copy2(workspace / 'writer-record.md', packet / 'writer-record.md')
if (workspace / 'evidence').exists():
    shutil.copytree(workspace / 'evidence', packet / 'evidence', dirs_exist_ok=True,
                    ignore=shutil.ignore_patterns('venv', '.venv', 'node_modules', '__pycache__', '*.pyc'))
hashes = {str(rel): hashlib.sha256((REPO / rel).read_bytes()).hexdigest() for rel in files}
receipt = {'integrated_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'key': key,
           'mode': mode, 'workspace': str(workspace), 'sha256': hashes, 'removed_files': removed,
           'review_status': 'Author output; independent review not certified by integration.'}
(packet / 'integration.json').write_text(json.dumps(receipt, indent=2) + '\n')
if mode == 'return':
    frozen = packet / 'first-return'
    if frozen.exists():
        raise SystemExit('First return already frozen; will not overwrite its snapshot')
    for rel in files:
        target = frozen / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(REPO / rel, target)
    (packet / 'first-return.json').write_text(json.dumps(receipt, indent=2) + '\n')
print(json.dumps({'key': key, 'mode': mode, 'files': len(files)}, indent=2))
