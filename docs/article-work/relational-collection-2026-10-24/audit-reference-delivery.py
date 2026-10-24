"""Check exact reference chunks in a named agent's public tool outputs only."""
import datetime
import json
from pathlib import Path
import subprocess
import sys

REPO = Path(__file__).resolve().parents[3]
WORK = Path(__file__).resolve().parent
agent, key = sys.argv[1:3]
session = None
for folder in (Path.home() / '.codex/sessions/2026/10/23', Path.home() / '.codex/sessions/2026/10/24'):
    if not folder.exists():
        continue
    for path in folder.glob('*.jsonl'):
        with path.open() as handle:
            first = json.loads(next(handle))
        if first.get('type') == 'session_meta' and first.get('payload', {}).get('agent_path') == agent:
            session = path
if session is None:
    raise SystemExit('Agent public session log not located')

def texts(value):
    if isinstance(value, list):
        for item in value:
            yield from texts(item)
    elif isinstance(value, dict):
        # Promise.allSettled wraps each public tool result in `value`.
        for name in ('output', 'text', 'content', 'value'):
            if name in value:
                yield from texts(value[name])
    elif isinstance(value, str):
        yield value
        try:
            decoded = json.loads(value)
        except (ValueError, TypeError):
            return
        if not isinstance(decoded, str):
            yield from texts(decoded)

outputs = []
model = None
effort = None
for line in session.open():
    event = json.loads(line)
    payload = event.get('payload', {})
    if event.get('type') == 'turn_context':
        model = payload.get('model', model)
        effort = payload.get('effort', payload.get('reasoning_effort', effort))
    if event.get('type') == 'response_item' and payload.get('type') in ('function_call_output', 'custom_tool_call_output'):
        outputs.append((event['timestamp'], list(texts(payload.get('output')))))
events = []
missing = []
for article, total in (('sequences', 6), ('indexes', 7), ('storage', 6)):
    for part in range(1, total + 1):
        expected = subprocess.check_output(['python3', 'scripts/read-writing-reference.py', article, str(part)], cwd=REPO, text=True)
        match = next((stamp for stamp, values in outputs if any(expected in value for value in values)), None)
        events.append({'article': article, 'part': part, 'exact_chunk_delivered': bool(match), 'utc': match})
        if not match:
            missing.append(f'{article}:{part}')
result = {'checked_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'agent': agent,
          'source_log': str(session), 'model': model, 'effort': effort,
          'scope': 'Only public tool outputs; exact reference text checked, excluding private reasoning. Rendered reference study is separate.',
          'expected_parts': 19, 'delivered_parts': 19 - len(missing), 'missing_parts': missing,
          'complete_text_delivery_verified': not missing, 'events': events}
packet = WORK / 'writers' / key
packet.mkdir(parents=True, exist_ok=True)
(packet / 'reference-delivery.json').write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps({k: v for k, v in result.items() if k != 'events'}, indent=2))
if missing:
    raise SystemExit(1)
