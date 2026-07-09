// @staycurrent/core — public entry point.
//
// Slice 1.1 (bet first-living-topic, core-contract) shipped the exported contract
// types and the read-side Loading API + renderMarkdown. Slice 1.2 (publish-gate)
// adds runPublishGate — the one place gate logic exists (ADR 0003). Cut mechanics
// and session functions remain later slices; nothing for them is exported yet.

export * from './types.js';
export * from './errors.js';

export { renderMarkdown } from './render/renderMarkdown.js';

export { listTopics } from './loaders/listTopics.js';
export { loadTopic } from './loaders/loadTopic.js';
export { loadChangelog } from './loaders/loadChangelog.js';
export { loadVersion } from './loaders/loadVersion.js';
export { loadResearchLog } from './loaders/loadResearchLog.js';

export { runPublishGate } from './runPublishGate.js';
