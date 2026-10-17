---
title: A whiteboard shape vocabulary
description: Draw recognisable people, apps, services and messages with a few repeatable strokes, then give the whole board a consistent personality.
---

A useful whiteboard symbol is something you can draw again while listening. It should leave room for a name, survive an awkward pen stroke, and look enough like its neighbours that the board feels like one explanation. A browser window needs only a frame and a top bar. Drawing its tabs, address field and page contents rarely helps someone follow a repair request.

This vocabulary gives you a small set of shapes to practise. The shapes are suggested shorthand, not a formal notation. Write “Repair API” beside a service, “Repair DB” beside a database, and “stores request” beside the arrow between them. Those words let someone check your account of the system. The shapes help them find their way around it.

Here is the vocabulary doing a small job: a customer uses a booking site, the site submits a repair to the Repair API, and the API stores a request in Repair DB. This view stops at saving the request. Each shape has a name, and each arrow has a phrase you can read from its source to its destination.

<figure><img src='/images/drawing-systems/vocabulary-system-spare.svg' alt='In spare style, Customer uses Booking site, which submits repair to Repair API, which stores request in Repair DB.' width='500' height='790' loading='lazy'/><figcaption>The spare board carries the complete relationship model.</figcaption></figure>

[Open the printable reference sheet](/images/drawing-systems/whiteboard-reference.html) for the drawing steps and a five-minute exercise. Each illustration below is also an editable SVG: save the image to reuse or adapt it.

## A shape needs a name

Write the name before closing a box around it. You immediately discover how much room “Repair appointments” needs, and you avoid squeezing the last letters into a corner. With a person or cylinder, put the name below or alongside the silhouette. Keep the relationship labels in the gaps between objects.

Use a comfortable writing size and leave that size alone. When the board fills up, begin another view; shrinking the labels makes the last part of the explanation harder to discuss. Two or three words usually work for an object name. Put a longer explanation beside the drawing as a note.

Keep contours and arrows at roughly the same weight. You can press a little harder for the main route or use a second colour, but repeatedly tracing a wobbly box produces a dark object that attracts attention for no useful reason. Finish the line and continue. A slightly irregular rectangle with clear writing is easier to read than an immaculate rectangle with a cramped name.

<figure><img src='/images/drawing-systems/vocabulary-marks.svg' alt='Booking site keeps its name while browser dots are optional; the submits repair relationship keeps its arrowhead and verb.' width='500' height='350' loading='lazy'/><figcaption>Keep the information when simplifying: the object name and relationship survive after the small decorative marks disappear.</figcaption></figure>

## People and the applications they use

The construction drawings build from left to right. Blue identifies the marks added at each stage; it does not assign a colour to that kind of object.

### User and team

Draw a circle, a vertical trunk with a horizontal arm line, then two sloping legs. This gives you a user without deciding anything about their appearance. Label the role that matters: “Customer”, “Dispatcher” or “Repair technician”. A single figure can represent a role held by many people; it does not mean exactly one account exists.

<figure><img src='/images/drawing-systems/vocabulary-user.svg' alt='A user is built from a circle, a trunk and arms, then two legs.' width='500' height='260' loading='lazy'/><figcaption>The name identifies the role. A face or hairstyle is optional.</figcaption></figure>

For a team, draw two heads, two shoulder outlines and a shared baseline. Label it “Repair team”. The two figures mean a group here, not a staffing count. If the question is ownership of software, a labelled boundary around that software will usually say more than a team icon beside it.

<figure><img src='/images/drawing-systems/vocabulary-team.svg' alt='Two heads gain shoulder outlines and a shared baseline to form a team symbol.' width='500' height='260' loading='lazy'/><figcaption>Use the group symbol for people acting together; use an enclosure to show what they own.</figcaption></figure>

### Browser and mobile app

Draw a wide rectangle and a line across its upper part. You already have a browser window. Two dots in the top strip add familiarity, but can disappear when you are in a hurry. Label the application, such as “Booking site”, rather than “Browser” when that is the relevant distinction.

<figure><img src='/images/drawing-systems/vocabulary-browser.svg' alt='A wide frame gains a top bar and optional dots to suggest a browser window.' width='500' height='260' loading='lazy'/><figcaption>A wide frame and top bar make the browser recognisable without drawing its interface.</figcaption></figure>

For a mobile app, make the frame tall, round the corners if comfortable, add a top bar and optionally a short home line near the bottom. This drawing can mean either a device or an app. Write “Technician app” when you mean software; write “Technician’s phone” when the physical device matters. Draw separate objects if you need to explain their relationship.

<figure><img src='/images/drawing-systems/vocabulary-mobile.svg' alt='A tall rounded frame gains a top bar and a short home line to suggest a mobile app.' width='500' height='260' loading='lazy'/><figcaption>Let the label resolve whether this is an application or a physical phone.</figcaption></figure>

## Work and stored information

These shapes help distinguish things that perform work from information they use. They do not specify deployment, replication or reliability. A single database cylinder may stand for a managed database with many machines behind it.

### Service and worker

A service can be a plain rectangle. Add a short corner stroke if you like having a small visual signature, then write “Repair API”. A tiny tick at the opposite corner is optional. Avoid filling it with rack doors, fans or status lights: those details suggest equipment when you may only mean a software boundary.

<figure><img src='/images/drawing-systems/vocabulary-service.svg' alt='A service starts as a rectangle, then receives an optional corner mark and small tick.' width='500' height='260' loading='lazy'/><figcaption>A named box is the complete fallback for a service.</figcaption></figure>

A worker uses the same box with a small prompt mark: an angle followed by a short underscore. Name its job, such as “Email worker”. The mark helps you recognise the worker again; it does not prove that it polls a queue, runs on a schedule or executes only one job at a time. Show whichever of those facts the discussion needs with relationships or notes.

<figure><img src='/images/drawing-systems/vocabulary-worker.svg' alt='A rectangular worker gains a prompt-like angle and underscore, with an optional corner tick.' width='500' height='260' loading='lazy'/><figcaption>Keep the service family resemblance while giving background work a recognisable cue.</figcaption></figure>

### Database and file

For a database, begin with a shallow oval. Drop a line from each side and join them with a curved base. An additional curved seam is optional. Keep the oval shallow enough that the shape reads as a cylinder rather than a ball. Write “Repair DB” beside it; add the technology only when it helps answer the current question.

<figure><img src='/images/drawing-systems/vocabulary-database.svg' alt='A shallow oval gains two sides and a curved base, then an optional seam, to form a database cylinder.' width='500' height='260' loading='lazy'/><figcaption>The cylinder identifies storage here. Its drawn layers do not count disks, replicas or tables.</figcaption></figure>

For a file, draw a rectangle with the upper-right corner cut off. Join the cut corner back to the top and side to make a fold. Two short lines can suggest contents. Use a concrete name such as “Repair report.pdf”. A file shape is useful when that document is passed, created or stored; it is less helpful as decoration inside every service that handles data.

<figure><img src='/images/drawing-systems/vocabulary-file.svg' alt='A rectangle with one cut corner gains a folded edge and optional text lines to represent a file.' width='500' height='260' loading='lazy'/><figcaption>A folded corner distinguishes a document from a software box.</figcaption></figure>

## Messages, outside systems and boundaries

### Queue and pub/sub topic

For a queue, draw two parallel rails and a few small message rectangles between them. An arrow along the rails can indicate a direction when that matters. Name it “Email jobs”. The three drawn cards are a recognition cue, not a measured backlog. If depth matters, write an explicit value and the time it was observed.

<figure><img src='/images/drawing-systems/vocabulary-queue.svg' alt='Parallel rails gain message cards and a direction arrow to form a queue symbol.' width='500' height='260' loading='lazy'/><figcaption>Message cards help recognition. They do not establish ordering, capacity or delivery guarantees.</figcaption></figure>

For a pub/sub topic, draw a small hub, branch it towards several endpoints, then finish each endpoint with a dot. Label it “Repair events”. This suggests distribution to subscribers. The dots are illustrative; draw and name actual subscribers when the number or destination matters. A box labelled “Repair events · topic” is often quicker, especially once the real subscription arrows surround it.

<figure><img src='/images/drawing-systems/vocabulary-topic.svg' alt='A central hub gains several branches and endpoint dots to suggest a pub/sub topic.' width='500' height='260' loading='lazy'/><figcaption>This local shorthand distinguishes distribution from the queue’s waiting-work cue. It specifies no broker behaviour.</figcaption></figure>

### External system and group boundary

An external system is another named box. An outward-pointing cue and a short outside edge can distinguish it when the surrounding view is sparse. Its position outside the relevant ownership boundary makes the claim clearer. Label it “Mail provider”, not simply “External”; external to the repair team does not mean external to every organisation or network.

<figure><img src='/images/drawing-systems/vocabulary-external.svg' alt='An external system box gains an outward cue and a separate outside edge.' width='500' height='260' loading='lazy'/><figcaption>“External” needs a reference point. Use placement and a scope label when ownership matters.</figcaption></figure>

Draw a group boundary around existing members with generous padding. Leave a gap for its title, then write the scope: “Repair team”, “Production account” or “Customer device”. Those are different kinds of enclosure. A team boundary says nothing by itself about network access. Use one meaning per boundary and state it in the label.

<figure><img src='/images/drawing-systems/vocabulary-boundary.svg' alt='An enclosure gains a scope name and a member inside it; the label explains the grouping.' width='500' height='260' loading='lazy'/><figcaption>Plan the enclosure in advance, but draw its final edge after the members have enough space.</figcaption></figure>

## Three ways to give the board a personality

Choose a treatment you can repeat at conversation speed. **Spare** uses clean contours and few internal marks. **Soft** keeps those silhouettes but rounds corners and adds a small colour wash. **Expressive** keeps the main outlines clear and allows a little hair, an offset hatch or a short flourish. Extra marks belong away from arrow endpoints and labels.

<figure><img src='/images/drawing-systems/vocabulary-style-spare.svg' alt='Spare versions of Customer, Booking site, Repair API and Repair DB use minimal contours and details.' width='500' height='390' loading='lazy'/><figcaption>Spare: useful when you want the fastest repeatable marks.</figcaption></figure>

<figure><img src='/images/drawing-systems/vocabulary-style-soft.svg' alt='Soft versions of the same four objects retain their silhouettes with rounded corners and pale washes.' width='500' height='390' loading='lazy'/><figcaption>Soft: round the family consistently, rather than making one object look like a special button.</figcaption></figure>

<figure><img src='/images/drawing-systems/vocabulary-style-expressive.svg' alt='Expressive versions of the same four objects add a small hairstyle and restrained hatch marks.' width='500' height='390' loading='lazy'/><figcaption>Expressive: a few repeatable touches give character without adding parts to the system.</figcaption></figure>

Here are soft and expressive versions of the spare system at the beginning. A customer uses the Booking site; the site submits a repair to the Repair API; the API stores a request in Repair DB. The names, connections and arrow meanings stay the same. The style changes how the explanation feels, not what it asserts.

<figure><img src='/images/drawing-systems/vocabulary-system-soft.svg' alt='The soft version preserves the same Customer to Booking site to Repair API to Repair DB relationships.' width='500' height='790' loading='lazy'/><figcaption>Rounded corners and pale washes change the treatment while preserving every endpoint.</figcaption></figure>

<figure><img src='/images/drawing-systems/vocabulary-system-expressive.svg' alt='The expressive version preserves the same four objects and three labelled relationships with a few small flourishes.' width='500' height='790' loading='lazy'/><figcaption>The expressive board remains easy to copy because its character comes from a few marks.</figcaption></figure>

Practise one whole row of the same symbol rather than perfecting a single specimen. If a flourish makes the fourth repetition slow, omit it. You can change your preferred style between meetings; within a view, consistency helps people recognise repeated roles.

## Connectors carry the explanation

Put the objects down before joining them. Stop each line at its destination’s boundary and add an arrowhead where direction has meaning. Leave space for a short verb phrase. “API → Repair DB” leaves the relationship open; “stores request” lets someone ask whether that operation happens before the API reports success.

A structural arrow can mean “uses”. A message-flow arrow can mean “information travels this way”. Those are different conventions: a worker uses a queue, but a job travels from the queue to the worker. State which view you are drawing. Use the [sequence diagram article](/learn/drawing-systems/sequences/) when the order of interactions becomes the question.

<figure><img src='/images/drawing-systems/vocabulary-connectors.svg' alt='Both panels put Email worker left and Email jobs right. The structural arrow points from worker to queue, labelled takes job from. The data-flow arrow points from queue to worker, labelled confirmation job.' width='500' height='440' loading='lazy'/><figcaption>The same pair has opposite arrow directions: the worker uses the queue, while the job moves from the queue to the worker.</figcaption></figure>

A dashed line does not universally mean “optional”, “asynchronous” or “uncertain”. Choose a meaning, write it in a small key, and use it consistently. For uncertainty, a nearby question such as “Queue owned by repair team?” is often more precise. Do not borrow a formal notation’s marks casually inside a diagram that claims to follow that notation.

Keep about five pens available: graphite or black for the structure, blue for the route under discussion, green for a proposed change marked “NEW”, red for a fault or concern marked “!”, and purple for an open question marked “?”. These are suggested meeting roles, not universal meanings. Add “proposed”, “fault” or “?” in words or marks so a monochrome photograph remains useful. [Layout, labels and five colours](/learn/drawing-systems/layout/) develops this into a whole-board treatment.

## Five minutes of practice

For this exercise, consider a variation that adds a separate email queue. Draw this situation without copying the finished pictures: a customer uses a booking site. The site submits a repair to the Repair API. The API stores the request and puts a confirmation job on Email jobs. An Email worker takes jobs and asks an outside Mail provider to send them. The repair team owns the API, database, queue and worker.

Spend one minute placing the names, two minutes adding shapes and connections, one minute reading the arrows aloud, and one minute removing unnecessary marks. Choose one personality. Use colour only after the drawing works in one pen.

A useful structural solution has six labelled relationships: Customer **uses** Booking site; Booking site **submits repair to** Repair API; Repair API **stores request in** Repair DB; Repair API **enqueues confirmation in** Email jobs; Email worker **takes job from** Email jobs; Email worker **requests email delivery from** Mail provider. The worker-to-queue arrow describes use. For a message-flow version, reverse that arrow and label it “confirmation job”.

<figure><img src='/images/drawing-systems/vocabulary-practice.svg' alt='Repair API stores request in Repair DB and enqueues a job in Email jobs. Email worker takes a job from Email jobs and requests email delivery from the external Mail provider. The four internal elements belong to Repair team.' width='500' height='780' loading='lazy'/><figcaption>The exercise adds a separate queue. This continuation uses plain named boxes so the ownership and relationships receive the attention.</figcaption></figure>

Enclose the API, Repair DB, Email jobs and Email worker in “Repair team”. Keep Mail provider outside. Check that no line accidentally ends on the enclosing boundary when it should reach a member. Your drawing need not match these silhouettes to express the same account.

The sketch leaves consequential questions open: can the request be saved while the job is lost? Can a retried job send two emails? Add those questions beside the relevant relationship if the meeting needs them. A queue icon cannot answer them.

If you run out of time, replace a difficult shape with a named rectangle. Preserve the names, group membership and labelled relationships. That gives the next person something they can understand and revise.

## Sources and further reading

[Drawing at the whiteboard](/learn/drawing-systems/whiteboarding/) follows the first few minutes of a meeting, including what to draw while the explanation is still changing.

[Julia Evans: How to teach technical concepts with cartoons](https://jvns.ca/teach-tech-with-cartoons/) shows how a small cast of recognisable shapes can support a technical explanation. Her discussion of missing information is especially useful: a charming picture still needs the parts that explain the behaviour.
