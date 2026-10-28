#!/usr/bin/env python3
"""Exercise cache_adapter.py against a new owned Redis and a dictionary source.

The driver never accepts an existing endpoint. Run without -O: assertions check
the results. FaultCache and SourceModel delays/errors are labelled injections.
"""
import argparse
import asyncio
from contextlib import ExitStack
from copy import deepcopy
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import platform
import shutil
import signal

import redis as redis_package
from redis.exceptions import AuthenticationError, ConnectionError, TimeoutError as RedisTimeoutError

from cache_lab import OwnedRedis, PRODUCT
from cache_adapter import Busy, CacheFault, Context, ProductCache, encode, make_client


class SourceModel:
    """An in-process dictionary, not a database, benchmark or transaction engine."""

    def __init__(self, price=2000):
        self.products = {"P7": {**deepcopy(PRODUCT), "price_pence": price}}
        self.calls = 0
        self.fail = False
        self.delay = 0
        self.started = asyncio.Event()

    async def read(self, context):
        if (context.shop, context.locale, context.currency) != ("north", "en-GB", "GBP"):
            raise ValueError("Source model supports only north/en-GB/GBP")
        self.calls += 1
        self.started.set()
        await asyncio.sleep(self.delay)
        if self.fail:
            raise RuntimeError("Injected source failure")
        return deepcopy(self.products.get(context.id))

    async def commit_price(self, context, pence):
        if (context.shop, context.locale, context.currency) != ("north", "en-GB", "GBP"):
            raise ValueError("Source model supports only north/en-GB/GBP")
        await asyncio.sleep(self.delay)
        if self.fail:
            raise RuntimeError("Injected source failure")
        product = self.products[context.id]
        # The assignment is this model's commit point, not a database commit.
        product.update(price_pence=pence, revision=product["revision"] + 1)
        return deepcopy(product)


class FaultCache:
    """Inject a failure/delay before one client method. Other calls reach Redis."""

    def __init__(self, real, method, *, error=None, delay=0):
        self.real, self.method, self.error, self.delay = real, method, error, delay
        self.started = asyncio.Event()
        self.completed = 0

    def __getattr__(self, name):
        async def call(*args, **kwargs):
            if name == self.method:
                self.started.set()
                await asyncio.sleep(self.delay)
                if self.error is not None:
                    raise self.error
            result = await getattr(self.real, name)(*args, **kwargs)
            if name == self.method:
                self.completed += 1
            return result
        return call


async def must_raise(kind, operation):
    try:
        await operation()
    except kind:
        return
    raise AssertionError(f"Expected {kind.__name__}")


async def scenarios(owned, report, initial_price):
    client = make_client(owned.path)
    results = report["scenarios"] = []
    context = Context()
    key = context.key
    try:
        # Verify that this client reaches the exact already-owned instance.
        info = await client.info("server")
        assert info["run_id"] == owned.identity["run_id"]
        assert info["process_id"] == owned.process.pid
        assert client.connection_pool.connection_kwargs["retry"]._retries == 0

        def fresh(redis=client, **kwargs):
            events = []
            source = SourceModel(initial_price)
            adapter = ProductCache(redis, source, observe=events.append, **kwargs)
            return adapter, source, events

        def record(name, mode, **fields):
            results.append({"scenario": name, "execution": mode, **fields})
            print("PASS", name, json.dumps(fields, sort_keys=True))

        cache, source, events = fresh()
        first, second = await cache.read(), await cache.read()
        assert first == second and first["price_pence"] == initial_price and source.calls == 1
        assert 0 < await client.ttl(key) <= 30
        record("miss-fill-hit", "real Redis; dictionary source", source_calls=source.calls,
               price_pence=second["price_pence"], events=events)

        # A short real expiry changes only test duration, not adapter defaults.
        await client.pexpire(key, 100)
        async with asyncio.timeout(2):
            while await client.exists(key):
                await asyncio.sleep(0.020)
        await cache.read()
        assert source.calls == 2
        record("expiry-refill", "real Redis PX expiry", source_calls=source.calls)

        valid = json.loads(encode(context, first))
        obsolete = {**valid, "schema": 0}
        wrong_context = {**valid, "context": {**valid["context"], "shop": "south"}}
        bad_values = [b"{broken", b"\xff", json.dumps(obsolete).encode(),
                      json.dumps(wrong_context).encode(), b"[]", b"x" * 4097,
                      json.dumps({**valid, "product": {**first, "price_pence": True}}).encode()]
        for raw in bad_values:
            before = source.calls
            await client.set(key, raw, ex=30)
            assert (await cache.read())["price_pence"] == initial_price
            assert source.calls == before + 1
            assert events[-3:][0]["outcome"] == "unusable"
        record("unusable-values", "real Redis stores each supplied byte sequence",
               rejected_variants=len(bad_values), source_calls=source.calls)

        zero = {**first, "price_pence": 0, "name": ""}
        before = source.calls
        await client.set(key, encode(context, zero), ex=30)
        assert (await cache.read()) == zero and source.calls == before
        negative = Context(id="P99")
        assert await cache.read(negative) is None
        before = source.calls
        assert await cache.read(negative) is None and source.calls == before
        assert 0 < await client.ttl(negative.key) <= 5
        record("zero-empty-and-negative-hit", "real Redis; dictionary absence",
               extra_source_calls_on_negative_hit=0, negative_ttl_seconds=5)

        await client.delete(negative.key)
        source.fail = True
        await must_raise(RuntimeError, lambda: cache.read(negative))
        assert await client.get(negative.key) is None
        source.fail = False
        record("source-error-is-not-absence", "injected dictionary-source failure",
               negative_entry_written=False)

        await client.delete(key)
        faults = FaultCache(client, "get", error=ConnectionError("Injected unavailable cache"))
        degraded, model, captured = fresh(faults)
        assert (await degraded.read())["price_pence"] == initial_price
        assert model.calls == 1 and captured[0]["kind"] == "connection"
        with degraded.sources.slot():
            # With limit 8 this holds only one; fill the rest explicitly.
            with ExitStack() as stack:
                for _ in range(degraded.sources.limit - 1):
                    stack.enter_context(degraded.sources.slot())
                await must_raise(Busy, degraded.read)
        assert model.calls == 1 and degraded.sources.active == 0
        record("unavailable-cache-bounded-fallback", "injected client ConnectionError",
               source_calls=1, saturated_source_refused=True)

        bad_auth = FaultCache(client, "get", error=AuthenticationError("Injected auth fault"))
        broken, model, captured = fresh(bad_auth)
        await must_raise(CacheFault, broken.read)
        assert model.calls == 0 and captured[0]["kind"] == "configuration"
        await client.delete(key)
        await client.lpush(key, "wrong Redis type")
        broken, model, captured = fresh()
        await must_raise(CacheFault, broken.read)
        assert model.calls == 0 and captured[0]["kind"] == "command"
        await client.delete(key)
        record("persistent-read-faults", "injected authentication error; real Redis WRONGTYPE",
               source_calls=0)

        # Actual OOM response on SET, on this owned disposable server only.
        cache, source, events = fresh()
        await client.config_set("maxmemory-policy", "noeviction")
        await client.config_set("maxmemory", 1)
        try:
            answer = await cache.read()
            assert answer["price_pence"] == initial_price
            assert events[-1] == {"outcome": "fill-error", "kind": "memory-rejected"}
            assert await client.get(key) is None
        finally:
            await client.config_set("maxmemory", 0)
        record("rejected-fill-keeps-source-answer", "real Redis OOM rejection",
               returned_price_pence=answer["price_pence"], entry_written=False)

        held = []
        cache, source, events = fresh()
        try:
            for _ in range(4):
                held.append(await client.connection_pool.get_connection())
            assert (await cache.read())["price_pence"] == initial_price
            assert events[0]["kind"] == "pool-exhausted"
            assert events[-1]["kind"] == "pool-exhausted"
        finally:
            for connection in held:
                await client.connection_pool.release(connection)
        record("pool-exhaustion", "real redis-py pool with all four connections held",
               source_calls=source.calls, source_answer_retained=True)

        cache, source, events = fresh(request_limit=1)
        with cache.requests.slot():
            await must_raise(Busy, cache.read)
        assert source.calls == 0
        record("request-admission", "local gate deliberately occupied", source_calls=0)

        # Counterexample: an unbounded optional SET would hold the answer 1s.
        slow_fill = FaultCache(client, "set", delay=1)
        cache, source, events = fresh(slow_fill)
        answer = await cache.read(deadline=asyncio.get_running_loop().time() + 0.080)
        assert answer["price_pence"] == initial_price and slow_fill.completed == 0
        assert events[-1] == {"outcome": "fill-error", "kind": "timeout"}
        assert await client.get(key) is None
        record("slow-fill-keeps-source-answer", "injected one-second client SET delay",
               delay_completed=False, returned_price_pence=answer["price_pence"])

        slow_get = FaultCache(client, "get", delay=1)
        cache, source, events = fresh(slow_get)
        assert (await cache.read())["price_pence"] == initial_price
        assert events[0]["kind"] == "timeout" and slow_get.completed == 0
        await client.delete(key)
        cache, source, events = fresh()
        source.delay = 1
        await must_raise(TimeoutError, lambda: cache.read(deadline=asyncio.get_running_loop().time() + 0.040))
        assert cache.sources.active == cache.requests.active == 0
        assert await client.get(key) is None
        record("read-and-source-deadlines", "injected client GET and dictionary delays",
               get_falls_back=True, source_timeout_propagates=True)

        # An external cancellation is not converted into a source fallback.
        slow_fill = FaultCache(client, "set", delay=1)
        cache, source, events = fresh(slow_fill)
        task = asyncio.create_task(cache.read())
        await slow_fill.started.wait()
        task.cancel()
        await must_raise(asyncio.CancelledError, lambda: task)
        assert cache.requests.active == cache.sources.active == 0 and slow_fill.completed == 0
        record("cancelled-request", "injected suspended SET; real task cancellation",
               detached_fills=0, active_requests=0)

        # Hold a native Redis reply, cancel it, and prove the one-slot client works.
        blocked = make_client(owned.path, max_connections=1)
        blocked.connection_pool.connection_kwargs["socket_timeout"] = 2
        blocked.connection_pool.connection_kwargs["client_name"] = "staycurrent-cancellation-test"
        task = None
        try:
            task = asyncio.create_task(blocked.blpop("adapter-cancellation-empty-list", timeout=5))
            async with asyncio.timeout(1):
                while True:
                    clients = await client.client_list()
                    if any(item.get("name") == "staycurrent-cancellation-test"
                           and item.get("cmd") == "blpop" for item in clients):
                        break
                    await asyncio.sleep(0.005)
            task.cancel()
            await must_raise(asyncio.CancelledError, lambda: task)
            assert len(blocked.connection_pool._in_use_connections) == 0
            assert await blocked.ping()
            assert await blocked.get(key) is None
            record("native-client-cancellation", "real Redis BLPOP observed blocked then cancelled",
                   pool_connections_in_use=0, next_ping=True, next_get=None)
        finally:
            if task is not None and not task.done():
                task.cancel()
                try:
                    await task
                except asyncio.CancelledError:
                    pass
            await blocked.aclose()

        cache, source, events = fresh()
        await cache.read()
        updated, confirmed = await cache.change_price(context, 2200)
        assert confirmed and updated["revision"] == 2 and await client.get(key) is None
        answer = await cache.read()
        assert answer["price_pence"] == 2200 and answer["revision"] == 2
        record("commit-invalidate-refill", "real Redis DEL; dictionary commit",
               price_pence=2200, revision=2)

        await client.delete(key)
        failed_del = FaultCache(client, "delete", error=RedisTimeoutError("Injected deletion timeout"))
        cache, source, events = fresh(failed_del)
        await cache.read()
        updated, confirmed = await cache.change_price(context, 2200)
        stale = await cache.read()
        assert not confirmed and updated["revision"] == 2 and stale["revision"] == 1
        record("failed-invalidation", "injected client DEL timeout before send",
               committed_revision=2, cached_revision=1, invalidation_confirmed=False)
        source.fail = True
        await must_raise(RuntimeError, lambda: cache.change_price(context, 2300))
        assert source.products["P7"]["revision"] == 2
        record("failed-source-update", "injected source rejection before model commit",
               source_revision=2)
    finally:
        await client.aclose()
        report["client_closed"] = True


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--redis-server", default=shutil.which("redis-server"))
    parser.add_argument("--json", type=Path)
    parser.add_argument("--initial-price-pence", type=int, default=2000,
                        help="change the dictionary price and inspect returned values/source calls")
    args = parser.parse_args()
    if not __debug__:
        parser.error("run without -O: assertions verify the scenarios")
    if not args.redis_server or args.initial_price_pence < 0:
        parser.error("supply a redis-server binary and a non-negative initial price")
    def interrupted(*_):
        raise KeyboardInterrupt
    signal.signal(signal.SIGTERM, interrupted)
    here = Path(__file__).parent
    report = {"executed_at": datetime.now(timezone.utc).isoformat(),
              "python_version": platform.python_version(), "redis_py_version": redis_package.__version__,
              "source_model": "in-process dictionary; no source database or production timings",
              "files_sha256": {name: hashlib.sha256((here / name).read_bytes()).hexdigest()
                               for name in ["cache_adapter.py", "adapter_demo.py", "cache_lab.py", "requirements.txt"]}}
    with OwnedRedis(args.redis_server) as owned:
        report["identity"] = owned.identity
        asyncio.run(scenarios(owned, report, args.initial_price_pence))
    assert owned.process.poll() is not None and not owned.directory.exists()
    report["owned_server_removed"] = True
    if args.json:
        args.json.write_text(json.dumps(report, indent=2) + "\n")
    print("PASS client closed; owned Redis stopped; temporary directory removed")


if __name__ == "__main__":
    main()
