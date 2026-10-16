import type { Scene } from './types';
import { dirtyCrash, walCommit, crashRecovery, asyncCommit } from './server';
import { pageFill, bufferRead, rowVersions, vacuum } from './pages';
import { checkpoints, tornPage, flushPath } from './log';

export const scenes: Record<string, Scene> = Object.fromEntries(
  [pageFill, bufferRead, rowVersions, dirtyCrash, walCommit, crashRecovery, checkpoints, tornPage, flushPath, asyncCommit, vacuum].map(scene => [scene.id, scene]),
);
