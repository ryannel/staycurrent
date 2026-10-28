# Reuse and placement: open design exploration

## What the human references do

The sequence article makes a dependency perceptible: waiting bars stay occupied while work happens elsewhere, and the later fork/stair comparison shows who owns the flow through its shape. The indexes article gives work a countable body: pages are visited, entries move into order, and changing one input changes the work seen. Storage's buffer-pool section teaches residence and eviction by keeping the same pages recognisable as they move between physical places. Their strength is object continuity and a controlled contrast, not a specific drawing style.

For these caching figures, the reader should recognise the blue-mug card all the way through; the long job should visibly remain idle on reuse; and process ownership should be something one can see by containment. Elaborate drawing and choreography are justified if the resulting reading is effortless.

## Figure 1: reuse

**Direction A — the little card workshop (chosen).** A tactile miniature contains a source book of facts, App A's assembly plinth and a nearby cache shelf. The first request visits the source. Its facts return to App A, where mug, price and card layers assemble. A duplicate peels away onto the cache shelf. The next request draws a card over a small arc; the workshop/source no longer works. Paper lift, spring settling, depth and restrained light make the mechanism pleasing to watch. The artwork should feel like a tiny crafted machine, without adding fictional machine operations to the explanation.

One optional **Another reader** action launches the already explained hit and increments the answer count while the source-read count remains one. It rewards a reader's curiosity without holding the lesson behind interaction. A static summary retains the card on the shelf, a completed first source visit and the short reuse route. Reduced motion uses that complete state rather than scattered frozen pieces.

**Direction B — a ribbon becomes a shortcut.** A request travels a long, luminous folded-paper ribbon through the source and back. Saving the result creates a short arch; subsequent cards skim over it. This is visually striking but risks implying that a cache changes a network route, or that the source fills the cache itself. The workshop gives App A's ownership a clearer physical home.

Technical constraints: source remains authoritative; App A owns reading, assembling and storing the copy; cache does not call source or build cards. P7 is north's English card in GBP. Time and geometry are explanatory, not measured latency. £20 must remain readable at phone width. The first request completes before reuse begins.

## Figure 2: placement

**Direction A — two rooms and one commons (chosen).** Two miniature process rooms sit in the upper world. App A has a card on its own little shelf; App B's matching shelf is empty. The lower world has the same two rooms, but one shared suspended shelf sits outside them. Curved, luminous bridges give the network an unmistakable visible cost. The card belongs to a place; the reader can see who can reach that place before any motion starts.

An automatic request pulse from App B stops at the empty local shelf in the upper world and receives a card from the shared shelf below. An optional **Ask from App A** action changes who asks: App A can use its own local copy, while its shared-cache request still crosses the network. The two worlds remain present together, so no mode selector or remembered previous screen is required. The physical move from room to commons should feel delightful through lifted planes, gentle shadow and an answer arriving with a small settling motion.

**Direction B — magnetic bubbles.** A card orbits inside App A's translucent process bubble while App B's orbit is empty; switching to shared opens a central orbit both can reach. This has charming motion but makes networking and memory boundaries abstract, and the switching adds memory work. The rooms/commons comparison gives both the containment and the network crossing a more legible body.

Technical constraints: a local copy belongs to one process, not one user; App B cannot read App A's local memory. Shared means a separate reachable service, not automatically replicated or failure-free. A local miss needs App B's own source work; the figure need not introduce that second fill in detail. Shared replies still cross a network. Do not imply that placement by itself changes freshness guarantees.

## Implemented trial

Both selected directions are implemented in the pair's scene and CSS files. The workshop uses procedural paper assembly, a retained cache copy, a damped settling motion and an optional additional hit. The rooms comparison changes the requesting process with its optional action, giving App A a local hit as well as a shared hit. Its default App B contrast remains a local miss versus shared hit. A source-render smoke check covers six progress points and every action. The coordinator's first desktop capture revealed the workshop's dotted source route crossing the App A label and result badge; the path and its travelling facts were rerouted around their left and lower edges before confirmation.
