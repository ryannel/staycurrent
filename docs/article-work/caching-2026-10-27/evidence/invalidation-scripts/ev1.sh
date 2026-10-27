#!/bin/bash
CLI="/opt/homebrew/opt/redis/bin/redis-cli -p 7105"
r() { echo "> $*"; $CLI "$@" | sed 's/^/  /'; }
port=$($CLI INFO server | tr -d '\r' | grep '^tcp_port:' | cut -d: -f2)
[ "$port" = "7105" ] || { echo "wrong server"; exit 1; }
echo "## A. Server and defaults"
$CLI INFO server | tr -d '\r' | grep -E "^(redis_version|tcp_port|os|arch_bits|mem_allocator)"
r CONFIG GET maxmemory-policy
r CONFIG GET notify-keyspace-events
r CONFIG GET lazyfree-lazy-user-del
r FLUSHALL
echo
echo "## B. Race 1: a slow reader refills an old value after the writer's delete"
echo "# Database holds price 39. Reader misses and reads 39 from the database (not shown: the database is the application's)."
r GET product:42
echo "# Writer commits 35 to the database, then deletes the cached copy. There is nothing to delete yet."
r DEL product:42
echo "# The reader resumes and stores the 39 it read earlier, with a one-hour TTL."
r SET product:42 '{"price":39}' EX 3600
r GET product:42
r TTL product:42
echo "# A second delete (for example from the next write) is the only thing besides expiry that removes it."
r DEL product:42
echo
echo "## C. Race 2: two writers update the cache out of order"
r SET product:42 '{"price":39}' EX 3600
echo "# Database order: W1 commits 37, then W2 commits 35. Their cache writes arrive W2 first, then W1."
r SET product:42 '{"price":35}' EX 3600
r SET product:42 '{"price":37}' EX 3600
r GET product:42
echo "# With delete-on-write the same reordering is harmless: two deletes in either order leave the key absent."
r DEL product:42
r DEL product:42
r EXISTS product:42
echo
echo "## D. SET ... IFEQ semantics (Redis 8.4+)"
r SET k old EX 100
r SET k new IFEQ wrong
r GET k
r SET k new IFEQ old
r GET k
r TTL k
echo "# IFEQ is an ordinary SET: without EX or KEEPTTL the old TTL is dropped (-1 above). With EX:"
r SET k newer IFEQ new EX 100
r TTL k
r SET k newest IFEQ newer KEEPTTL
r TTL k
echo "# On a missing key IFEQ fails:"
r DEL k
r SET k value IFEQ anything
r EXISTS k
echo "# IFEQ with GET returns the old value:"
r SET k a
r SET k b IFEQ a GET
r GET k
echo "# DELEX compare-and-delete:"
r DELEX k IFEQ a
r DELEX k IFEQ b
r EXISTS k
echo "# NX with a lease placeholder:"
r SET k 'lease:7f3a' NX PX 10000
r SET k 'lease:9c21' NX PX 10000
r GET k
r DEL k
