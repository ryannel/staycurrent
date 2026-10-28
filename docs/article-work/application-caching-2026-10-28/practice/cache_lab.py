#!/usr/bin/env python3
"""Run a disposable Redis application-cache lab. Python standard library only."""

import argparse
from contextlib import AbstractContextManager
from copy import deepcopy
from datetime import datetime, timezone
import hashlib
import json
import os
from pathlib import Path
import platform
import shutil
import signal
import socket
import subprocess
import tempfile
import time


KEY = "product:v1:north:P7:en-GB:GBP"
PRODUCT = {"id": "P7", "name": "Blue mug", "price_pence": 2000,
           "currency": "GBP", "revision": 1}


class RedisError(RuntimeError):
    pass


class Connection:
    """A small RESP2 client for this lab, not a production client library."""

    def __init__(self, path):
        self.socket = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        self.socket.settimeout(2)
        try:
            self.socket.connect(str(path))
            self.stream = self.socket.makefile("rb")
        except BaseException:
            self.socket.close()
            raise
        self.trace = []

    def close(self):
        self.stream.close()
        self.socket.close()

    def reply(self):
        line = self.stream.readline()
        if not line.endswith(b"\r\n"):
            raise ConnectionError("Incomplete Redis reply")
        marker, value = line[:1], line[1:-2]
        if marker == b"+":
            return value.decode()
        if marker == b"-":
            raise RedisError(value.decode())
        if marker == b":":
            return int(value)
        if marker == b"$":
            length = int(value)
            if length == -1:
                return None
            data = self.stream.read(length)
            if len(data) != length or self.stream.read(2) != b"\r\n":
                raise ConnectionError("Incomplete Redis bulk reply")
            return data.decode()
        if marker == b"*":
            length = int(value)
            return None if length == -1 else [self.reply() for _ in range(length)]
        raise ConnectionError("Unexpected RESP2 reply type")

    def command(self, *arguments):
        parts = [str(argument).encode() for argument in arguments]
        request = b"*" + str(len(parts)).encode() + b"\r\n"
        request += b"".join(b"$" + str(len(part)).encode() + b"\r\n"
                            + part + b"\r\n" for part in parts)
        self.socket.sendall(request)
        entry = {"command": [str(argument) for argument in arguments]}
        self.trace.append(entry)
        try:
            result = self.reply()
        except RedisError as error:
            entry["error"] = str(error)
            raise
        entry["reply"] = result
        return result


def info_fields(text):
    return dict(line.split(":", 1) for line in text.splitlines()
                if line and not line.startswith("#"))


class OwnedRedis(AbstractContextManager):
    """Own the process, its directory and its only socket from start to cleanup."""

    def __init__(self, binary):
        self.binary = str(Path(binary).resolve())
        self.directory = None
        self.process = None
        self.connection = None
        self.log = None
        self.identity = None

    def __enter__(self):
        # /tmp keeps the Unix socket path below macOS's small path-length limit.
        self.directory = Path(tempfile.mkdtemp(prefix="cache-lab-", dir="/tmp"))
        self.path = self.directory / "redis.sock"
        self.log = (self.directory / "redis.log").open("wb")
        self.arguments = [self.binary, "--port", "0", "--unixsocket", str(self.path),
                          "--unixsocketperm", "700", "--save", "", "--appendonly", "no",
                          "--daemonize", "no", "--dir", str(self.directory),
                          "--dbfilename", "unused.rdb"]
        # No host, URL, password, TLS or Redis CLI defaults are inherited.
        environment = {key: value for key, value in os.environ.items()
                       if not key.upper().startswith("REDIS")}
        try:
            self.process = subprocess.Popen(self.arguments, env=environment,
                                            stdin=subprocess.DEVNULL,
                                            stdout=self.log, stderr=subprocess.STDOUT)
            deadline = time.monotonic() + 5
            while not self.path.exists():
                if self.process.poll() is not None:
                    raise RuntimeError((self.directory / "redis.log").read_text())
                if time.monotonic() >= deadline:
                    raise TimeoutError("Owned Redis did not create its socket")
                time.sleep(0.01)
            self.connection = Connection(self.path)
            server = info_fields(self.connection.command("INFO", "server"))
            assert int(server["process_id"]) == self.process.pid, "Unexpected server PID"
            assert server["tcp_port"] == "0", "TCP should be disabled"
            assert server["run_id"], "Missing instance ID"
            configured = self.connection.command("CONFIG", "GET", "dir")
            assert Path(configured[1]).resolve() == self.directory.resolve()
            self.identity = {"redis_version": server["redis_version"],
                             "pid": self.process.pid, "run_id": server["run_id"],
                             "tcp_port": 0, "socket": str(self.path),
                             "directory": str(self.directory),
                             "launch_arguments": self.arguments}
            # The first data write happens only after these ownership checks.
            return self
        except BaseException:
            self.__exit__(None, None, None)
            raise

    def __exit__(self, *exception):
        if self.connection is not None:
            self.connection.close()
        if self.process is not None and self.process.poll() is None:
            self.process.terminate()
            try:
                self.process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.process.kill()
                self.process.wait(timeout=5)
        if self.log is not None:
            self.log.close()
        if self.directory is not None:
            shutil.rmtree(self.directory)
        return False


def encoded(product):
    return json.dumps(product, separators=(",", ":"), sort_keys=True)


def put(redis, product):
    assert redis.command("SET", KEY, encoded(product), "EX", 30) == "OK"


def read(redis):
    result = redis.command("GET", KEY)
    return None if result is None else json.loads(result)


def change_source(source):
    # This assignment is the model's commit point, not a database experiment.
    source.update(price_pence=2200, revision=2)


def run_lab(redis):
    results = []
    source = deepcopy(PRODUCT)
    assert read(redis) is None
    put(redis, source)
    assert read(redis) == source
    ttl = redis.command("TTL", KEY)
    assert 0 < ttl <= 30
    results.append({"scenario": "miss-fill-hit", "price_pence": 2000,
                    "revision": 1, "ttl_seconds": ttl})

    # Use a short real Redis expiry so the lab does not wait 30 seconds.
    assert redis.command("SET", KEY, encoded(source), "PX", 150) == "OK"
    deadline = time.monotonic() + 3
    while read(redis) is not None:
        if time.monotonic() >= deadline:
            raise AssertionError("Short-lived entry did not expire")
        time.sleep(0.025)
    assert redis.command("TTL", KEY) == -2
    put(redis, source)
    assert redis.command("SET", KEY, encoded(source)) == "OK"
    assert redis.command("TTL", KEY) == -1
    put(redis, source)
    assert 0 < redis.command("TTL", KEY) <= 30
    results.append({"scenario": "expiry-and-replacement", "expired_ttl": -2,
                    "plain_set_ttl": -1, "set_ex_restores_expiry": True})

    change_source(source)
    assert redis.command("DEL", KEY) == 1
    assert read(redis) is None
    put(redis, source)
    assert read(redis)["revision"] == 2
    results.append({"scenario": "commit-then-invalidate", "revision_after_refill": 2})

    source = deepcopy(PRODUCT)
    put(redis, source)
    pending_fill = deepcopy(source)  # Snapshot read before the update; fill is delayed.
    change_source(source)
    assert redis.command("DEL", KEY) == 1
    put(redis, pending_fill)
    stale = read(redis)
    assert stale["revision"] == 1 and source["revision"] == 2
    results.append({"scenario": "late-fill-race", "source_revision": 2,
                    "cached_revision": 1, "cached_price_pence": stale["price_pence"],
                    "ttl_seconds": redis.command("TTL", KEY)})

    # Paired counterexample: TTL starts on insertion, after the read has waited.
    source = deepcopy(PRODUCT)
    observed_at = time.monotonic()
    pending_fill = deepcopy(source)
    change_source(source)
    redis.command("DEL", KEY)
    max_age = 1.0
    time.sleep(max_age + 0.1)
    age = time.monotonic() - observed_at
    put(redis, pending_fill)
    naive = read(redis)
    assert naive["revision"] == 1 and age > max_age
    ttl = redis.command("TTL", KEY)
    assert 0 < ttl <= 30

    # The guarded application refuses the delayed snapshot before filling or
    # returning it. Its timestamp is meaningful only within this one process.
    redis.command("DEL", KEY)
    accepted_old_fill = time.monotonic() - observed_at <= max_age
    assert not accepted_old_fill
    fresh_started_at = time.monotonic()
    fresh = deepcopy(source)
    assert time.monotonic() - fresh_started_at <= max_age
    put(redis, fresh)
    returned = read(redis)
    assert time.monotonic() - fresh_started_at <= max_age
    assert returned["revision"] == 2
    results.append({"scenario": "observation-age-guard", "max_age_seconds": max_age,
                    "delayed_snapshot_age_seconds": round(age, 3),
                    "unguarded_revision": naive["revision"],
                    "unguarded_ttl_seconds": ttl, "old_fill_accepted": accepted_old_fill,
                    "guarded_returned_revision": returned["revision"]})

    # A rejected optional cache write must not erase the successful source read.
    source_result = deepcopy(source)
    assert redis.command("CONFIG", "SET", "maxmemory-policy", "noeviction") == "OK"
    assert redis.command("CONFIG", "SET", "maxmemory", 1) == "OK"
    error = None
    try:
        redis.command("SET", KEY + ":new", encoded(source_result), "EX", 30)
    except RedisError as caught:
        error = str(caught)
        assert error.startswith("OOM"), error
    finally:
        redis.command("CONFIG", "SET", "maxmemory", 0)
    assert error is not None
    assert source_result["revision"] == 2
    results.append({"scenario": "cache-write-rejected", "error": "OOM",
                    "source_result_revision": source_result["revision"]})
    return results


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--redis-server", default=shutil.which("redis-server"),
                        help="local redis-server binary (default: found on PATH)")
    parser.add_argument("--json", type=Path, help="save the command trace and evidence")
    arguments = parser.parse_args()
    if not __debug__:
        parser.error("run without -O: the lab uses assertions to verify its results")
    if not arguments.redis_server:
        parser.error("install Redis locally or supply --redis-server")

    def interrupted(*_):
        raise KeyboardInterrupt

    signal.signal(signal.SIGTERM, interrupted)
    report = {"executed_at": datetime.now(timezone.utc).isoformat(),
              "python_version": platform.python_version(),
              "source_model": "in-process Python dictionary; no native source database",
              "script_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest()}
    with OwnedRedis(arguments.redis_server) as owned:
        report["identity"] = owned.identity
        report["scenarios"] = run_lab(owned.connection)
        report["commands"] = owned.connection.trace
    assert owned.process.poll() is not None and not owned.directory.exists()
    report["success_cleanup"] = True
    try:
        with OwnedRedis(arguments.redis_server) as failed:
            raise RuntimeError("Deliberate exercise of the cleanup path")
    except RuntimeError as error:
        assert str(error) == "Deliberate exercise of the cleanup path"
    assert failed.process.poll() is not None and not failed.directory.exists()
    report["exception_cleanup"] = True
    if arguments.json:
        arguments.json.write_text(json.dumps(report, indent=2) + "\n")
    print("Redis", report["identity"]["redis_version"], "· owned Unix socket · TCP disabled")
    print("PASS miss → source read → SET EX → hit: revision 1, GBP 20.00")
    print("PASS expiry: TTL -2; plain SET: TTL -1; SET EX restores expiration")
    print("PASS source update → DEL → refill: revision 2, GBP 22.00")
    print("PASS counterexample: late fill restores revision 1 after invalidation")
    print("PASS age guard: reject delayed revision 1; reread and return revision 2")
    print("PASS optional cache write: OOM does not discard source result")
    print("PASS cleanup after success and an injected exception")


if __name__ == "__main__":
    main()
