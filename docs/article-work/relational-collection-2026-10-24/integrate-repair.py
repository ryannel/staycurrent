"""Integrate only an assigned repair's article namespaces after protecting its inputs."""
from pathlib import Path
import datetime
import hashlib
import json
import re
import shutil
import sys

work = Path(__file__).resolve().parent
root = work.parents[2]
name = sys.argv[1]
if not re.fullmatch(r'[a-z0-9-]+', name):
    raise SystemExit('Invalid repair record name')
record = work / 'repairs' / name
config = json.loads((record / 'workspace.json').read_text())
workspace = Path(config['path'])
if not workspace.resolve().is_relative_to(Path('/private/tmp')):
    raise SystemExit('Repair workspace must be owned temporary work')
changed_inputs = [relative for relative, expected in config['protected_files'].items()
                  if not (workspace / relative).is_file()
                  or hashlib.sha256((workspace / relative).read_bytes()).hexdigest() != expected]
if changed_inputs:
    raise SystemExit('Protected inputs changed: ' + ', '.join(changed_inputs))

files, removed = [], []
for key in config['keys']:
    if not re.fullmatch(r'r\d{2}', key):
        raise SystemExit('Invalid article key')
    article = Path(f'src/articles/relational-collection/{key}.astro')
    namespace = Path(f'src/components/relational-collection/{key}')
    incoming = [article] + [p.relative_to(workspace) for p in (workspace / namespace).rglob('*') if p.is_file()]
    if not (workspace / article).is_file():
        raise SystemExit(f'Missing repaired article {key}')
    if (root / namespace).exists():
        for existing in (root / namespace).rglob('*'):
            if existing.is_file() and existing.relative_to(root) not in incoming:
                removed.append({'path': str(existing.relative_to(root)),
                                'sha256': hashlib.sha256(existing.read_bytes()).hexdigest()})
                existing.unlink()
    for relative in incoming:
        destination = root / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(workspace / relative, destination)
        files.append({'path': str(relative), 'sha256': hashlib.sha256(destination.read_bytes()).hexdigest()})

if (workspace / 'repair-record.md').is_file():
    shutil.copyfile(workspace / 'repair-record.md', record / 'repair-record.md')
if (workspace / 'evidence').exists():
    shutil.copytree(workspace / 'evidence', record / 'evidence', dirs_exist_ok=True)
receipt = {'integrated_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
           'workspace': str(workspace), 'protected_inputs_verified': len(config['protected_files']),
           'files': files, 'removed_files': removed, 'scope': 'Preview integration, not review completion'}
(record / 'integration.json').write_text(json.dumps(receipt, indent=2) + '\n')
print(json.dumps({'repair': name, 'files': len(files), 'removed': len(removed)}))
