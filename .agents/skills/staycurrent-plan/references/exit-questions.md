# Exit questions

Exit questions say what the reader can do after reading. A good set lets a reviewer tell
an expert-level article from a merely correct one.

Write 6–10 per article. Draw them from the dossier items the article owns. At least half
should be hard, asking the reader to:

- **estimate** a magnitude from stated conditions;
- **diagnose** a problem from output a practitioner would see;
- **choose and defend** a design against a named alternative;
- **predict** what happens when a condition changes;
- **write** the short piece of code or configuration at a decision point.

Avoid recall questions that a glossary could answer, and questions that belong to
another article's scope.

## Weak and strong

> Weak: What is a cache stampede?
>
> Strong: One cache shard holding an eighth of the keys fails at 20,000 requests a second
> and a 95% hit ratio. How many extra source reads arrive each second, and what stops
> them reaching the database?

> Weak: Name two ways to prevent duplicate fills.
>
> Strong: Why does a lease's lifetime not bound the source work it permits? What do you
> add so a late owner cannot publish over a newer value?

## Example set: Handling cache misses

1. A product page needs 40 cards and fetches them with sequential GETs over a 0.3 ms
   network hop. Roughly what does the cache cost the page before any other work, and
   what would you change?
2. One cache shard holding an eighth of the keys fails at 20,000 requests a second and a
   95% hit ratio. How many extra source reads arrive each second, and what stops them
   reaching the database?
3. Why does a lease's lifetime not bound the source work it permits, and what do you add?
4. Name the standard algorithm for spreading refreshes before expiry, and say when fixed
   jitter is enough.
5. Write a per-key in-flight wrapper that gives each caller its own deadline (about 15
   lines).
6. After a cold restart, source latency doubles and the hit ratio climbs slowly. Which
   two measurements tell you whether to hold traffic back, and what are you looking for?
