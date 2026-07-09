// @staycurrent/core — public entry point.
//
// This slice (bet first-living-topic, 01-core-contract) ships the exported
// contract types and the read-side Loading API + renderMarkdown. The publish
// gate, cut mechanics, and session functions are later slices — nothing for
// them is exported yet, per the slice's scope boundary.

export * from './types.js';
export * from './errors.js';

export { renderMarkdown } from './render/renderMarkdown.js';

export { listTopics } from './loaders/listTopics.js';
export { loadTopic } from './loaders/loadTopic.js';
export { loadChangelog } from './loaders/loadChangelog.js';
export { loadVersion } from './loaders/loadVersion.js';
export { loadResearchLog } from './loaders/loadResearchLog.js';
