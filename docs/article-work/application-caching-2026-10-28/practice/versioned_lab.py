#!/usr/bin/env python3
"""Exercise conditional cache publication on an owned disposable Redis instance."""
import argparse
from copy import deepcopy
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import platform
import shutil
import signal

from cache_lab import OwnedRedis, KEY, PRODUCT, change_source, encoded


# One key is either absent, loading:<unique token>, or ready:<product JSON>.
# The example tokens below are unique within this controlled run, not a token
# generator for a deployment. A real attempt must generate a fresh identifier.
PUBLISH = """if redis.call('GET', KEYS[1]) ~= 'loading:' .. ARGV[1] then
  return 0
end
redis.call('SET', KEYS[1], 'ready:' .. ARGV[2], 'PX', ARGV[3])
return 1"""


def reserve(redis, token):
    return redis.command('SET', KEY, 'loading:' + token, 'NX', 'PX', 5000) == 'OK'


def publish(redis, token, product):
    return redis.command('EVAL', PUBLISH, 1, KEY, token, encoded(product), 30000)


def state(redis):
    raw = redis.command('GET', KEY)
    if raw is None:
        return {'state': 'absent'}
    if raw.startswith('loading:'):
        return {'state': 'loading', 'token': raw[8:]}
    return {'state': 'ready', 'product': json.loads(raw[6:])}


def scenarios(redis):
    results = []
    def reset():
        redis.command('DEL', KEY)
        return deepcopy(PRODUCT)
    def record(name, source, **extra):
        results.append({'scenario': name, 'source_revision': source['revision'],
                        'cache': state(redis), **extra})

    source = reset()
    old = deepcopy(source)
    change_source(source)
    redis.command('DEL', KEY)
    redis.command('SET', KEY, 'ready:' + encoded(old), 'EX', 30)
    assert state(redis)['product']['revision'] == 1
    record('unconditional-late-fill', source, candidate_revision=1, accepted=True)

    source = reset()
    assert reserve(redis, 'attempt-A')
    old = deepcopy(source)  # Read only AFTER reservation succeeds.
    change_source(source)
    assert redis.command('DEL', KEY) == 1
    assert publish(redis, 'attempt-A', old) == 0
    assert state(redis)['state'] == 'absent'
    record('delete-before-publish', source, candidate_revision=1, accepted=False,
           caller='revision 1 remains in App A; publication rejection is not a response decision')

    source = reset()
    assert reserve(redis, 'attempt-B')
    old = deepcopy(source)
    assert publish(redis, 'attempt-B', old) == 1
    change_source(source)
    assert redis.command('DEL', KEY) == 1
    assert state(redis)['state'] == 'absent'
    record('publish-before-delete', source, accepted=True, then_deleted=True)

    source = reset()
    assert reserve(redis, 'attempt-C')
    old = deepcopy(source)
    # A timestamp in the past gives deterministic real expiry without sleeps.
    assert redis.command('PEXPIREAT', KEY, 1) == 1
    assert state(redis)['state'] == 'absent'
    assert publish(redis, 'attempt-C', old) == 0
    record('expired-reservation', source, accepted=False)
    change_source(source)
    assert reserve(redis, 'attempt-D')
    fresh = deepcopy(source)  # New attempt performs a new source read.
    assert publish(redis, 'attempt-C', old) == 0
    assert publish(redis, 'attempt-D', fresh) == 1
    assert publish(redis, 'attempt-D', fresh) == 0
    assert state(redis)['product']['revision'] == 2
    record('new-token-and-duplicate-completion', source, old_token_accepted=False,
           new_read_revision=2, new_token_accepted=True, duplicate_accepted=False)

    source = reset()
    assert reserve(redis, 'attempt-E')
    old = deepcopy(source)
    change_source(source)
    assert publish(redis, 'attempt-E', old) == 1
    record('delayed-invalidation-stale-interval', source, accepted=True)
    assert redis.command('DEL', KEY) == 1
    assert reserve(redis, 'attempt-F')
    fresh = deepcopy(source)
    assert publish(redis, 'attempt-F', fresh) == 1
    assert redis.command('DEL', KEY) == 1
    record('repeated-delete-removes-newer-copy', source, removed_revision=2)

    source = reset()
    change_source(source)
    assert reserve(redis, 'attempt-G')
    lagging_read = deepcopy(PRODUCT)  # Explicit source-replica model, no replica measured.
    assert publish(redis, 'attempt-G', lagging_read) == 1
    record('lagging-source-model', source, candidate_revision=1, accepted=True)

    source = reset()
    old = deepcopy(source)  # Deliberately WRONG: source read before reservation.
    change_source(source)
    redis.command('DEL', KEY)
    assert reserve(redis, 'attempt-H')
    assert publish(redis, 'attempt-H', old) == 1
    record('reservation-after-read-counterexample', source, accepted=True)

    source = reset()
    assert reserve(redis, 'attempt-I')
    old = deepcopy(source)
    assert redis.command('GET', KEY) == 'loading:attempt-I'  # WRONG split check.
    change_source(source)
    redis.command('DEL', KEY)
    redis.command('SET', KEY, 'ready:' + encoded(old), 'EX', 30)
    record('split-check-write-counterexample', source, accepted=True)

    source = reset()
    old = deepcopy(source)
    change_source(source)
    redis.command('SET', KEY, 'known-revision:2')
    redis.command('DEL', KEY)  # Models lost metadata, not a measured eviction policy.
    remembered = redis.command('GET', KEY)
    strict_accepts = remembered is not None
    naive_accepts = old['revision'] >= (0 if remembered is None else 2)
    assert not strict_accepts and naive_accepts
    redis.command('SET', KEY, 'ready:' + encoded(old), 'EX', 30)
    record('lost-watermark-counterexample', source, missing_as_zero_accepts=True,
           missing_as_unknown_accepts=False, removal='DEL models eviction of metadata')
    return results


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--redis-server', default=shutil.which('redis-server'))
    parser.add_argument('--json', type=Path, required=True)
    args = parser.parse_args()
    if not __debug__ or not args.redis_server:
        parser.error('use normal Python (without -O) and a local Redis server binary')
    signal.signal(signal.SIGTERM, lambda *_: (_ for _ in ()).throw(KeyboardInterrupt()))
    report = {'executed_at': datetime.now(timezone.utc).isoformat(),
              'python_version': platform.python_version(),
              'source_model': 'in-process dictionary; no native source database or replicas',
              'script_sha256': hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
              'helper_sha256': hashlib.sha256(Path(__file__).with_name('cache_lab.py').read_bytes()).hexdigest()}
    with OwnedRedis(args.redis_server) as owned:
        report['identity'] = owned.identity
        report['scenarios'] = scenarios(owned.connection)
        owned.connection.command('DEL', KEY)
        assert reserve(owned.connection, 'before-empty-restart')
        report['commands'] = owned.connection.trace
    assert owned.process.poll() is not None and not owned.directory.exists()
    with OwnedRedis(args.redis_server) as restarted:
        assert publish(restarted.connection, 'before-empty-restart', PRODUCT) == 0
        assert state(restarted.connection)['state'] == 'absent'
        report['empty_restart'] = {'identity': restarted.identity,
                                   'old_token_accepted': False,
                                   'commands': restarted.connection.trace}
    assert restarted.process.poll() is not None and not restarted.directory.exists()
    try:
        with OwnedRedis(args.redis_server) as failed:
            raise RuntimeError('injected cleanup check')
    except RuntimeError as error:
        assert str(error) == 'injected cleanup check'
    assert failed.process.poll() is not None and not failed.directory.exists()
    report['success_cleanup'] = report['exception_cleanup'] = True
    args.json.write_text(json.dumps(report, indent=2) + '\n')
    print('Redis', report['identity']['redis_version'], '· owned Unix socket · TCP disabled')
    for result in report['scenarios']:
        print('PASS', result['scenario'])
    print('PASS empty restart rejects old token; cleanup on success and exception')


if __name__ == '__main__':
    main()
