# Actual rendered download links

Read from the rendered repeat-procedure links on frozen4430, including their download attributes. Bounded HTTP reads (4s timeout,1MiB cap) returned200. Ordinary local socket access was restricted; the same read-only checks succeeded with sandbox escalation. These are byte checks, not browser-save checks.

| Actual href suffix under `/review/relational-collection/evidence/` | Download name | Bytes | SHA256 |
| --- | --- | ---: | --- |
| r04/run-history.py | run-history.py | 11194 | 7b9b5a3beb82bdcc485679aae5f6f9b8cdd4bb0d65722193288ad78b82fa6f3b |
| r04/shop.json | shop.json | 2879 | bdae3259a820ed6a81e7f3e95dabce8bcc7a03eae11ff0a1f09cbe1d2d46948c |
| r04/history.json | history.json | 319 | 43d65d3d5c6cd0e81d67f956554acc68d3538db235ee15dd954e6f3b6e8b28cf |
| r08/run-imports.py | run-imports.py | 11661 | e7515dda85bd6571373c6a7cf9060234035cce00f4080d5e9ceaa7f37a5bbb39 |
| r08/shop.json | shop.json | 2879 | bdae3259a820ed6a81e7f3e95dabce8bcc7a03eae11ff0a1f09cbe1d2d46948c |
| r08/feed.json | feed.json | 456 | e4f6351f98a805f821cdfd91640424388b961d2d7ac719a85f48f83a28f740f0 |

All hashes match the frozen manifest. Browser saving, native execution and operating-system portability are outside this visual confirmation.
