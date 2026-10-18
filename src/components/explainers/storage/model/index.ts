import type { Scene } from './types';
import { dirtyCrash, walCommit, crashRecovery, asyncCommit } from './server';
import { pageFill, bufferRead, rowVersions, dirtyEvict } from './pages';
import { checkpoints, checkpointSizingScene, tornPage, flushPath, syncStandby, restoreTimeline, groupCommit } from './log';
import { poolScan } from './pool';

export const scenes: Record<string, Scene> = Object.fromEntries(
  [pageFill, bufferRead, rowVersions, dirtyCrash, walCommit, dirtyEvict, crashRecovery, checkpoints, checkpointSizingScene, tornPage, flushPath, asyncCommit, syncStandby, restoreTimeline, groupCommit, poolScan].map(scene => [scene.id, scene]),
);
