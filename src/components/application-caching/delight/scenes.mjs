import { scenes as reuse } from './reuse-placement.mjs';
import { scenes as identity } from './identity-change.mjs';
import { scenes as capacity } from './burst-memory.mjs';
export const scenes = { ...reuse, ...identity, ...capacity };
