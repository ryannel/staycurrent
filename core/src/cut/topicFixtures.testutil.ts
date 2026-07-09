import path from 'node:path';
import { writeGateFixture, type GateFixtureOptions } from '../runPublishGate.testutil.js';
import { writeFile } from '../loaders/fixtures.testutil.js';

/**
 * Writes a complete, gate-passing committed topic at `root/topics/<slug>/` — the
 * full tree stageCut/convene/recordNoCut/discardSession/reconcile expect an
 * existing topic to already carry. `writeGateFixture` seeds everything except
 * `research-log.md` (every topic carries one from creation, 04-data-design.md;
 * `domain/topic.md`, Notes), so this wrapper adds it.
 */
export function writeCompleteTopic(root: string, slug: string, opts: GateFixtureOptions = {}): void {
  const topicDir = path.join(root, 'topics', slug);
  writeGateFixture(topicDir, slug, opts);
  writeFile(root, `topics/${slug}/research-log.md`, '# Fixture Topic — Research Log\n\n');
}
