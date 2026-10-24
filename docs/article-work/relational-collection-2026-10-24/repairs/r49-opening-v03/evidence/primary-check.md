# Primary check for the opening consequence

Checked 24 October 2026: https://docs.cockroachlabs.com/docs/v25.4/architecture/replication-layer

The official v25.4 page's Overview (retrieved lines 142–144) ties availability to tolerating offline nodes and explains that three replicas tolerate one failure. Leases (lines 225–229) requires communication by a majority for writes; the circuit-breaker overview (lines 193–195) describes errors from requests accessing an unavailable range.

The repaired opening makes only the possibility claim that the next server failure may make some data unavailable. In the article this is the plain-language consequence of the already-present two-available-of-three-voters case. It does not assert that every cluster is in that state or claim any new observed failure test. The distinction between process and physical failure domains remains in the article's unchanged local-check limits.

This is author source verification, not independent technical confirmation. No new native environment was started.
