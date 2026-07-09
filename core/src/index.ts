// @staycurrent/core — public entry point.
//
// Slice 1.1 (bet first-living-topic, core-contract) shipped the exported contract
// types and the read-side Loading API + renderMarkdown. Slice 1.2 (publish-gate)
// added runPublishGate — the one place gate logic exists (ADR 0003). Slice 1.3
// (cut-mechanics) adds the write side: Cut mechanics (createTopic, stageCut,
// executeCut) and Session mechanics (convene, recordNoCut, discardSession,
// reconcile) — together the only functions that ever mutate `topics/` or seed
// `.staycurrent/staged/`.

export * from './types.js';
export * from './errors.js';

export { renderMarkdown } from './render/renderMarkdown.js';

export { listTopics } from './loaders/listTopics.js';
export { loadTopic } from './loaders/loadTopic.js';
export { loadChangelog } from './loaders/loadChangelog.js';
export { loadVersion } from './loaders/loadVersion.js';
export { loadResearchLog } from './loaders/loadResearchLog.js';

export { runPublishGate } from './runPublishGate.js';

export { createTopic } from './cut/createTopic.js';
export { stageCut } from './cut/stageCut.js';
export { executeCut } from './cut/executeCut.js';

export { convene } from './session/convene.js';
export { recordNoCut } from './session/recordNoCut.js';
export { discardSession } from './session/discardSession.js';
export { reconcile } from './session/reconcile.js';
