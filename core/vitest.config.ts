import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: [
      'src/**/*.test.ts',
      // Slice 1.1 (databases-catalogue bet) bet-progress test — named at
      // tests/bets/databases-catalogue/ per that bet's decomposition, wired
      // in here so `pnpm test` proves it alongside the permanent suite.
      '../tests/bets/databases-catalogue/test_slice_1_core_additive_frontmatter.ts',
    ],
  },
});
