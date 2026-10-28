"""Source-backed product cache. Python 3.14; redis-py 8.1.0.

Example limits, not production sizing. One instance per application event loop.
The source must implement async read(context) and commit_price(context, pence).
Only a successful read may return None, meaning an established absence.
"""
import asyncio
from contextlib import contextmanager
from dataclasses import asdict, dataclass
import json
import logging
import re

from redis.asyncio import Redis
from redis.asyncio.retry import Retry
from redis.backoff import NoBackoff
from redis.exceptions import (
    AuthenticationError, AuthorizationError, ConnectionError, MaxConnectionsError,
    OutOfMemoryError, RedisError, TimeoutError as RedisTimeoutError,
)


MISS = object()  # Different from None, a valid cached not-found result.
MAX_VALUE_BYTES = 4096


class Busy(RuntimeError):
    """Admission refused; the caller should shed work, not retry in a loop."""


class CacheFault(RuntimeError):
    """A cache access/configuration/command fault that needs repair."""


@dataclass(frozen=True)
class Context:
    shop: str = "north"
    id: str = "P7"
    locale: str = "en-GB"
    currency: str = "GBP"

    def __post_init__(self):
        for value in asdict(self).values():
            if not isinstance(value, str) or not re.fullmatch(r"[A-Za-z0-9-]{1,32}", value):
                raise ValueError("Context parts need the example's restricted alphabet")

    @property
    def key(self):
        return f"product:v1:{self.shop}:{self.id}:{self.locale}:{self.currency}"


class Gate:
    """Immediate admission on one event loop: no waiter queue or background work."""

    def __init__(self, limit, name):
        if limit < 1:
            raise ValueError("Admission limit must be positive")
        self.limit, self.name, self.active = limit, name, 0

    @contextmanager
    def slot(self):
        if self.active >= self.limit:
            raise Busy(f"{self.name} capacity exhausted")
        # No await between the check and increment, on this one event loop.
        self.active += 1
        try:
            yield
        finally:
            self.active -= 1


def product_valid(product, context):
    return (isinstance(product, dict)
            and set(product) == {"id", "name", "price_pence", "currency", "revision"}
            and product["id"] == context.id
            and isinstance(product["name"], str) and len(product["name"]) <= 200
            and type(product["price_pence"]) is int and product["price_pence"] >= 0
            and product["currency"] == context.currency
            and type(product["revision"]) is int and product["revision"] >= 1)


def encode(context, product):
    if product is not None and not product_valid(product, context):
        raise ValueError("Source returned an invalid product representation")
    envelope = {"schema": 1, "context": asdict(context),
                "kind": "not-found" if product is None else "product"}
    if product is not None:
        envelope["product"] = product
    raw = json.dumps(envelope, separators=(",", ":"), ensure_ascii=True).encode()
    if len(raw) > MAX_VALUE_BYTES:
        raise ValueError("Source representation exceeds example's byte limit")
    return raw


def decode(raw, context):
    """Unusable content is a miss. Redis command failures are handled separately."""
    if raw is None:
        return MISS
    if not isinstance(raw, bytes) or len(raw) > MAX_VALUE_BYTES:
        return MISS
    try:
        value = json.loads(raw)
    except (ValueError, UnicodeError, RecursionError):
        return MISS
    if (not isinstance(value, dict) or type(value.get("schema")) is not int
            or value["schema"] != 1 or value.get("context") != asdict(context)):
        return MISS
    if value.get("kind") == "not-found" and set(value) == {"schema", "context", "kind"}:
        return None
    if (value.get("kind") == "product"
            and set(value) == {"schema", "context", "kind", "product"}
            and product_valid(value["product"], context)):
        return value["product"]
    return MISS


def make_client(socket_path, max_connections=4):
    """The lab connects only to its owned Unix socket; it accepts no Redis URL."""
    return Redis(unix_socket_path=str(socket_path), decode_responses=False,
                 max_connections=max_connections, socket_connect_timeout=0.020,
                 socket_timeout=0.020, retry=Retry(NoBackoff(), 0),
                 protocol=2, client_name="staycurrent-product-adapter")


def error_kind(error):
    # Auth errors inherit ConnectionError: classify these first.
    if isinstance(error, (AuthenticationError, AuthorizationError)):
        return "configuration"
    if isinstance(error, MaxConnectionsError):
        return "pool-exhausted"
    if isinstance(error, (TimeoutError, RedisTimeoutError)):
        return "timeout"
    if isinstance(error, ConnectionError):
        return "connection"
    if isinstance(error, OutOfMemoryError):
        return "memory-rejected"
    return "command"


class ProductCache:
    def __init__(self, redis, source, *, observe=None, request_limit=64,
                 source_limit=8, positive_ttl=30, negative_ttl=5):
        if min(positive_ttl, negative_ttl) < 1:
            raise ValueError("TTLs must be positive integer seconds")
        self.redis, self.source = redis, source
        self.requests, self.sources = Gate(request_limit, "request"), Gate(source_limit, "source")
        self.positive_ttl, self.negative_ttl = positive_ttl, negative_ttl
        self.observe = observe or (lambda event: logging.getLogger(__name__).info("cache %s", event))

    def event(self, outcome, **fields):
        self.observe({"outcome": outcome, **fields})

    async def lookup(self, context):
        try:
            # Includes acquisition, connection setup, sending and reading.
            async with asyncio.timeout(0.025):
                raw = await self.redis.get(context.key)
        except (RedisError, TimeoutError) as error:
            kind = error_kind(error)
            self.event("cache-read-error", kind=kind)
            if kind in {"configuration", "command", "memory-rejected"}:
                raise CacheFault(kind) from error
            return MISS
        value = decode(raw, context)
        self.event("miss" if raw is None else "unusable" if value is MISS else "hit")
        return value

    async def optional_write(self, operation, deadline, label):
        # Keep 5ms of the caller's remaining budget for returning its answer.
        remaining = deadline - asyncio.get_running_loop().time() - 0.005
        if remaining <= 0:
            self.event(label + "-skipped", kind="deadline")
            return False
        try:
            async with asyncio.timeout(min(0.020, remaining)):
                await operation()
            self.event(label + "-ok")
            return True
        except (RedisError, TimeoutError) as error:
            self.event(label + "-error", kind=error_kind(error))
            return False
        # CancelledError deliberately propagates. Nothing is detached or retried.

    async def read(self, context=Context(), *, deadline=None):
        """Return product or established absence; preserve source errors/cancellation.

        deadline is absolute event-loop time; default 200ms from this call.
        The caller should pass the remaining request deadline, not restart it.
        """
        loop = asyncio.get_running_loop()
        deadline = loop.time() + 0.200 if deadline is None else deadline
        with self.requests.slot():
            if loop.time() >= deadline:
                raise TimeoutError("Request deadline already passed")
            async with asyncio.timeout_at(deadline):
                value = await self.lookup(context)
                if value is not MISS:
                    return value
                with self.sources.slot():
                    self.event("source-read")
                    value = await self.source.read(context)
                # Validate source output before returning it or caching it.
                raw = encode(context, value)
            ttl = self.negative_ttl if value is None else self.positive_ttl
            await self.optional_write(lambda: self.redis.set(context.key, raw, ex=ttl),
                                      deadline, "fill")
            return value

    async def change_price(self, context, price_pence, *, deadline=None):
        """Commit source change, then try invalidation. No mutation retries.

        Return (committed_product, invalidation_confirmed). A source timeout is
        an uncertain outcome for a real database adapter, not proof of rollback.
        """
        if type(price_pence) is not int or price_pence < 0:
            raise ValueError("Price must be non-negative integer pence")
        loop = asyncio.get_running_loop()
        deadline = loop.time() + 0.200 if deadline is None else deadline
        with self.requests.slot():
            if loop.time() >= deadline:
                raise TimeoutError("Request deadline already passed")
            async with asyncio.timeout_at(deadline):
                with self.sources.slot():
                    value = await self.source.commit_price(context, price_pence)
            confirmed = await self.optional_write(lambda: self.redis.delete(context.key),
                                                  deadline, "invalidate")
            return value, confirmed
