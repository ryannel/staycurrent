# Technical review: the Sequence diagrams family after the 18 October restructure

Reviewer's perspective: technical accuracy, figures, listings, links and the redirect.
Pages reviewed on the dev server on 18 October 2026:

- the deep dive, `/learn/drawing-systems/sequences/` (D);
- the companion, `/learn/drawing-systems/async-interactions/` (C);
- the redirect from `/learn/drawing-systems/sequence-syntax/`;
- the collection intro, `/learn/drawing-systems/`.

I read them against the writer's note (`restructure-2026-10-18.md`), the coverage map
section in `docs/coverage/drawing-systems.md` and the HEAD versions of all three old pages.

## Summary

The restructure is technically sound. Every listing parses. The redirect, links and
anchors all resolve, and every figure works from the keyboard, with reduced motion, at
both widths and in both themes. The quotations from RFC 6749, RFC 8446 and the C4 site
are exact, and the arithmetic in the new figures is right.

Three things need repair before the deep dive serves as a reference:

- The trust-boundary reading teaches the 2012 OAuth flow as if it were current practice,
  and calls it sign-in.
- The marks table understates PlantUML in two cells, and it lost the most practical warning
  from the retired syntax page.
- One new sentence says every figure has a Mermaid source, but five figures don't.

The moves also lost three small conditions from the old outbox and timeout teaching.

## What was checked, and how

- **Listings.** I extracted every `sequenceDiagram` constant from both pages: 11 in D and
  4 in C. That covers every visible listing and every *Mermaid source* panel. I parsed them
  with Mermaid 11.4.1, 11.10.1, 11.11.0, 11.17.2 and 12.2.0 (the current `latest` on npm),
  under jsdom. All of them parse on all five versions.
- **Inline snippets.** I also parsed the inline snippets the prose teaches: `box`, `rect`,
  `activate` after a note, `critical` with `option`, and the participant type syntax.
  - `participant Q@{ "type" : "queue" }` fails on 11.10.1 and parses on 11.11.0, which
    confirms D's "Mermaid 11.11 and later".
  - D's claim that every listing "parses on Mermaid 11.4.1 and 12.2.0" holds.
- **Redirect.** `/learn/drawing-systems/sequence-syntax/` returns 302 to
  `/learn/drawing-systems/sequences/#other-dialects`, and that id exists. The mechanism
  copies the relational one (`drawingAliases`, a `redirect` prop, `Astro.redirect`). In the
  last full build, the relational aliases came out as meta-refresh pages, for example
  `dist/learn/databases/relational/join-algorithms/index.html`, so the static build should
  do the same for this alias. I didn't run the build.
- **Links and anchors.** I fetched every internal link on D (45), C (44) and the intro (39)
  and checked that each target returns 200 and that each fragment exists as an `id`. There
  were no problems.
  - A grep of `src/` finds no remaining link to `sequence-syntax` or to any of the 20
    removed ids.
  - The intro's two changed lines (sections 51 and 108) read correctly, and line 49 now says
    "whose events happen in order from top to bottom". The writer's note still lists line 49
    as unfixed, so the note is stale on that point.
- **Figures.** I used headless Chromium (playwright-core 1.62.1) on four setups:
  - 375 px light with reduced motion;
  - 375 px dark;
  - 1280 px dark with reduced motion;
  - 1280 px light.

  On each setup, for every figure on both pages, I checked the following:
  - Every player reaches `data-ready`. No page logs console errors, and no page scrolls
    sideways. The marks table fits at 375 px (right edge at 359 px).
  - **Keyboard.** I focused each parameter button and pressed Enter for every option.
    Then, on the scrubber, Home and ArrowRight stepped from "Start" to "Step n of n" for
    every setting of every figure. Next twice and Back once, pressed from the keyboard,
    land on steps 2 and 1. Figure 12's ten-pass loop takes 33 presses, which is long but
    honest.
  - **Text.** I compared the bounding boxes of all visible SVG text after each setting.
    None overlaps another or falls outside the SVG on any figure at either width.
  - **Reduced motion.** Players open on the finished drawing and step from event to event,
    as the code intends.
  - **Still figures** (Figure 1 booking and Figure 13 OAuth): no controls, no scrubber, and
    `.seq-now` is hidden. The transcript and (for Figure 1) the source are present. Both
    re-lay out to the 327 px stage at 375 px.
  - **Screenshots.** I inspected Figures 10–13 in light and dark. The dashed group boxes
    and their labels use theme tokens and read well in both themes.

  Screenshots are in the session scratchpad (`techseq/shots/`).
- **Sources.** I checked the following against the primary pages:
  - RFC 6749 §4.1 and §4.1.2;
  - RFC 9700 §2.1.1;
  - RFC 8446 §2 and RFC 5246 §7.3;
  - plantuml.com/sequence-diagram and mermaid.js.org/syntax/sequenceDiagram;
  - c4model.com/diagrams/dynamic;
  - the archived IBM RUP "Guidelines: Sequence Diagram".

## What works

- **The round-trip arithmetic.** In Figure 10, TLS 1.2 needs four one-way trips of 25 ms
  (100 ms) before the request, and TLS 1.3 needs two (50 ms). The legend paragraph matches
  RFC 8446 §2 exactly: `+` extension, `*` not always sent, `{}` handshake keys, `[]`
  application keys. The figure doesn't put square brackets around TLS 1.2's
  `ChangeCipherSpec`, which keeps RFC 5246's different meaning for brackets out of a figure
  that teaches RFC 8446's. "Read a ladder's legend before its arrows" is exactly the right
  lesson.
- **The OAuth quotations.** RFC 6749 §4.1.2 says the code "MUST expire shortly after it is
  issued to mitigate the risk of leaks", recommends 10 minutes at most, and says the client
  "MUST NOT use the authorization code more than once". D states all three correctly, and
  its "that is why" is supported by the RFC's own "to mitigate the risk of leaks".
- **The N+1 figure.** Ten 20 ms round trips make 200 ms, and the batched call makes 20 ms.
  The summary's "two round trips from the API instead of eleven" is right, the clock reads
  about 265 ms, and the request-cost `#repeated` link resolves.
- **The fork and stair guidance** matches RUP. The page says centralised control suits
  steps whose order "is likely to change" or when "you expect to insert new sub-event
  phases", and decentralised control suits steps that are "tightly coupled". The stair's
  cost paragraph (each caller waits for everything below it, so a slow deposit holds three
  services) follows correctly from Figure 11's bars.
- **The C4 claim** is exact. The C4 page says the collaboration and sequence styles "show
  the same information in a different way".
- **The `->o` row was dropped correctly** (see finding 2). The old row called PlantUML's
  `->o` "the filled circle the main article calls a lost message". PlantUML documents only
  "add a final "o" at arrow head" and never calls it a lost message.
- **The moved failure teaching keeps its key conditions.** The companion keeps all of
  these from the old deep dive:
  - three losses, one timeout;
  - silence is a note, an error is a reply;
  - a 502 or 504 from a gateway doesn't prove nothing happened;
  - each caller's limit must exceed its callee's;
  - `statement_timeout` and the lost rollback reply;
  - a key derived from the job, not the attempt;
  - key retention (Resend's 24 hours);
  - 27 stacked attempts;
  - the crash between `202` and "Mark J9 sent";
  - the dual write in both orders.
- **The new companion sentences are accurate.** Cross-host timestamps don't order events
  and causal links do. The memcache stale set is described as in NSDI 2013 §3.2.1.

## Findings

### 1. Trust boundaries teach the 2012 flow and call it sign-in (D `#trust-boundaries`, Figure 13). Consequential.

**Where.** "Figure 13 is Mina signing in to the repair app through a sign-in provider,
using OAuth 2.0’s authorization code flow", then "the app server, which proves who it is
with its client secret".

**What happens to the reader.** Two problems, both of which an expert reviewer would raise
at once on a page future writers will copy.

- **OAuth 2.0 doesn't sign anyone in.** RFC 6749 is about authorization. Signing in with a
  provider is OpenID Connect, which runs on this flow and adds an ID token. A reader who
  copies Figure 13 learns to treat an access token as proof of who Mina is, which is a
  known mistake.
- **The figure leaves out PKCE, which current practice expects for every client.**
  RFC 9700 (BCP 240, 2025) §2.1.1 says:
  - "Clients MUST prevent authorization code injection attacks";
  - "Public clients MUST use PKCE";
  - for confidential clients PKCE is "RECOMMENDED".

  The client secret proves which app is calling. It doesn't prove that this browser started
  this sign-in, so a stolen code can be injected into an attacker's session with the real
  app. The section's own review question ("what it carries and who could read or replay
  it") points straight at that weakness, then answers it with only the code's short life
  and single use. A reader reviewing a design with this figure would pass one without PKCE.

**Smallest repair.**

- Say "signing in with OpenID Connect, which uses OAuth 2.0’s authorization code flow" and
  label the token reply "ID token + access token".
- Add `code_challenge` to the first redirect label and `code_verifier` to
  `POST /token`.
- Add one sentence: the client secret proves which app is asking but not which browser
  started the flow, so the current security practice, RFC 9700, also binds the code to the
  browser that requested it with PKCE (RFC 7636).
- Add RFC 9700 to Sources.

The figure has room. The longest label, `POST /token: code + client secret`, already fits
at 375 px.

### 2. The marks table understates PlantUML and lost the most practical warning (D `#other-dialects`). Moderate.

- **The lost-message row.** The PlantUML cell reads "`->x` draws a cross". PlantUML's own
  docs say "add a final `x` to denote a lost message", so PlantUML, unlike Mermaid, *does*
  name it. Repair: "`->x`, which PlantUML calls a lost message (a cross)".
- **The found-message row.** The PlantUML cell gives `[->`, an arrow from the diagram's
  edge. PlantUML also documents `[o->`, which starts from a circle as UML's found message
  does. Repair: "`[->`, or `[o->` for UML's circle".
- **The `->o` drop.** I confirm the drop is correct: the docs describe `->o` only as an
  "o" arrowhead. The nearest visual match to UML's lost message is `A ->o]`, a circle off
  the right edge, but PlantUML doesn't call it that either, so leaving it out is right.
- **The lost trap.** The retired page's first trap was this: Mermaid's `->` and `-->` draw
  lines with *no arrowhead*, while PlantUML's `->` is a call. Copying `A->B` from one tool
  to the other turns a call into a bare line, or the reverse, without an error. The new
  prose warns about `->>` only. The table shows the call row (`->>` against `->`) but
  never says what Mermaid's `->` does, so a reader can't infer the trap. Repair: one
  sentence after the table. "The same characters differ: Mermaid’s `->` is a line with no
  head and its `->>` a call, while PlantUML’s `->` is a call and its `->>` an asynchronous
  message."
- **Minor.** "calls only `-)` asynchronous". Mermaid's table also labels `--)` "(async)".
  Repair: "calls only `-)` and its dotted form asynchronous".

### 3. "TLS 1.2 needs two round trips" needs one qualifier (D `#round-trips`). Moderate.

**Where.** "TLS 1.2 needs two round trips before the browser can send its request" and
Figure 10's note "Two round trips: 100 ms before the request can go".

**What happens to the reader.** This is true of the full handshake both specifications
draw. But browsers have long sent the request after one round trip on TLS 1.2 with False
Start (RFC 7918), and resumed sessions are shorter in both versions. A reader who measures a
real connection will find the article wrong.

The TLS 1.2 server flight also leaves out `ServerKeyExchange*`. That message is sent with
the ECDHE key exchange that modern TLS 1.2 uses. Without it, the drawn flight is the old
RSA key exchange, and the comparison with 1.3's `key_share` loses its parallel.

**Smallest repair.**

- Write "A full TLS 1.2 handshake needs two round trips…".
- Add a clause after the TCP sentence: "Resumed sessions, and TLS 1.2 with the False Start
  extension, can send sooner; the count here is the first full connection."
- Relabel the flight "ServerHello, Certificate*, ServerKeyExchange*, ServerHelloDone".
  Check the label's width at 375 px, or shorten it to "ServerHello … ServerHelloDone".
- Optional: "guesses which key exchange" could add "and if the guess is wrong, the server's
  HelloRetryRequest costs a second round trip". The word "guesses" invites that question.

### 4. "Each figure’s text form, in Mermaid, sits under *Mermaid source*" is false for five figures (D `#lifelines-and-messages`). Moderate.

**Where.** This sentence is new in this restructure. The old page said "Most figures".

**What happens.** Figures 5 (`scope`), 10 (`tls`), 11 (`control`), 12 (`chatty`) and 13
(`oauth`) have no source panel. A reader who looks for one under the new figures finds
nothing.

**Smallest repair.** Either change the sentence back to "Most figures", or add sources for
10–13. Mermaid can draw all four; Figure 13's three boxes are `box … end`, which parses.
Adding the Figure 13 source would also let the PKCE change in finding 1 appear in text.

### 5. Three conditions lost in the moves (C `#failing-part-way`, C `#timeouts-inside-timeouts`, C `#retries-and-idempotency-keys`). Minor, but these are the kind future writers copy.

- **Why the claim needs a lease as well as a lock.** The old deep dive said: "That lock
  lasts only until the claim commits, long before the email goes out. So the claim also
  takes a lease." The companion now says only that a worker claims with a locking read
  "and marks it as taken for five minutes". It drops the reason a reader would need to see
  why the lock alone doesn't protect the job during the provider call. Repair: restore the
  clause "the lock ends when the claim commits, long before the email goes out, so the
  claim also marks the job taken for five minutes".
  - Optional, and an expert case neither version had: the lease must outlast the worker's
    longest attempt, including its own 10-second timeouts and retries. Otherwise a second,
    live worker claims a job still in progress. It is the nested-timeout rule applied to
    the lease, and one sentence would join the two sections.
- **The booking key must be stored with the booking.** The old text said: "The API stores
  the key with the booking, so a retry with the same key finds R17". The companion keeps
  only "A retry with the same key finds R17". What makes it work, writing the key in the
  same transaction as the booking, is gone. Repair: "The API stores the key with the
  booking, in the same transaction, so a retry with the same key finds R17."
- **The reason for jitter.** "With a random amount added" lost "so workers don't all retry
  at once". Repair: restore the six words.

### 6. "The IBM Rational Unified Process guidelines, which named the two shapes" (D `#fork-and-stair`). Minor.

The archived RUP page uses "fork-shaped" and "stairway-shaped" but credits no one with
the names, and they are older than RUP: they go back to Jacobson's Objectory and OOSE work.
"Named" claims an origin the source doesn't support. Repair: "which describe the two
shapes".

### 7. The Lamport sentence drops the first rule (D `#order-gaps-and-time`). Minor.

"One event comes before another only if a chain of messages leads from the first to the
second." Lamport's relation also orders events in one process without any message, which
the paragraph's first two sentences state. Read alone, the sentence contradicts them.
Repair: "…only if they are in order on one line, or a chain of messages leads from the
first to the second".

## Verdict

**Ready after the listed repairs.** The mechanics are solid:

- every listing parses from Mermaid 11.4.1 to 12.2.0;
- the redirect lands on the right section;
- no link or anchor anywhere points at a removed id;
- the new figures and the `still` mode work by keyboard, with reduced motion, at 375 and
  1280 px, in both themes, with no overlapping text.

The quoted standards are quoted accurately. Findings 1 to 4 should be fixed before the
deep dive goes on serving as a house reference:

1. the OAuth reading teaches a flow that current security practice wouldn't pass, and
   calls it sign-in;
2. the dialects table loses the one copy-paste trap readers actually hit and undersells
   PlantUML;
3. the TLS count needs the word "full";
4. the source-panel sentence promises figures that aren't there.

Each repair is a sentence or a label. Finding 5 restores conditions the old pages had, and
6 and 7 are one-word fixes.
