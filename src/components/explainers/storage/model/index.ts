import type { Scene } from './types';
import { dirtyCrash, walCommit, crashRecovery, asyncCommit } from './server';
import { pageFill, bufferRead } from './pages';
import { checkpoints, tornPage, flushPath, restoreTimeline, groupCommit } from './log';
import { poolScan } from './pool';

export const scenes: Record<string, Scene> = Object.fromEntries(
  [pageFill, bufferRead, dirtyCrash, walCommit, crashRecovery, checkpoints, tornPage, flushPath, asyncCommit, restoreTimeline, groupCommit, poolScan].map(scene => [scene.id, scene]),
);
