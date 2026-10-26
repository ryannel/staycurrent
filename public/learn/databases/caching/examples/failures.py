#!/usr/bin/env python3
"""Redis failure-semantics worksheet. Requires Python 3 and Docker.
Creates and removes an isolated Redis 8.2.2 container. Publishes no ports.
This is NOT a production client, cancellation implementation or latency benchmark.
"""
import json
import subprocess
import time
import uuid

name = 'staycurrent-failure-' + uuid.uuid4().hex[:10]
children = []


def docker(*args, check=True):
    return subprocess.run(['docker', *args], text=True, capture_output=True,
                          check=check, timeout=15)


def command(*args, port='6379'):
    return docker('exec', name, 'redis-cli', '--json', '-p', port, *args, check=False)


def value(*args):
    result = command(*args)
    assert result.returncode == 0, result.stderr
    return json.loads(result.stdout)


def delayed(*args):
    # Pause applies to this disposable server only. The pause acknowledges before
    # subsequent commands are suspended. Two seconds make the fault conspicuous;
    # neither interval is a suggested application setting.
    assert value('CLIENT', 'PAUSE', '2000', 'ALL') == 'OK'
    child = subprocess.Popen(['docker', 'exec', name, 'redis-cli', '--json', *args],
                             text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    children.append(child)
    try:
        child.communicate(timeout=0.1)
        raise AssertionError('Expected the caller deadline to expire during the pause')
    except subprocess.TimeoutExpired:
        print('Caller stopped waiting after 100 ms; child remains running:', child.poll() is None)
        assert child.poll() is None
    # communicate(timeout) does not kill the process. Explicitly collect it later.
    # This is the same distinction as abandoning a promise without cancelling its
    # underlying operation, not a claim about every Redis client's abort API.
    output, error = child.communicate(timeout=8)
    assert child.returncode == 0, error
    result = json.loads(output)
    print('Later command result:', result)
    return result


try:
    docker('run', '--detach', '--name', name, '--network', 'none', 'redis:8.2.2',
           'redis-server', '--save', '', '--appendonly', 'no')
    for _ in range(50):
        if command('PING').stdout.strip() == '"PONG"':
            break
        time.sleep(0.1)
    else:
        raise RuntimeError('Redis did not become ready')
    info = command('INFO', 'server').stdout
    print(next(line for line in info.splitlines() if line.startswith('redis_version:')))
    assert value('SET', 'product:42', '12') == 'OK'
    print('\n1. Hit, miss and connection error are different outcomes')
    assert value('GET', 'product:42') == '12'
    print('Present key:', value('GET', 'product:42'))
    assert value('GET', 'absent') is None
    print('Absent key: null (successful Redis reply)')
    refused = command('GET', 'product:42', port='1')
    assert refused.returncode != 0
    assert 'Connection refused' in refused.stderr
    print('Unused port: connection refused; non-zero exit; no nil reply')
    print('\n2. A read deadline does not establish a miss')
    assert delayed('GET', 'product:42') == '12'
    print('\n3. Abandoning a wait does not revoke a write')
    assert delayed('SET', 'late-fill', '15') == 'OK'
    assert value('GET', 'late-fill') == '15'
    print('Independent read confirms late-fill = 15')
    print('\nAll assertions passed. No source loads or throughput were measured.')
finally:
    for child in children:
        if child.poll() is None:
            child.kill()
        child.communicate()
    docker('rm', '--force', name, check=False)
