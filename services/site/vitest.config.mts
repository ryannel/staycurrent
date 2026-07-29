import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  // `services/site/` carries its own pnpm-lock.yaml, so Vite's default
  // workspace-root detection stops right here and denies fs access to
  // anything above it — which would otherwise 404 the bet-progress test file
  // below (two levels up, at the instance repo root's tests/). Widen the
  // allow-list to the repo root explicitly rather than move the test file;
  // its path is fixed by the bet's decomposition.
  server: {
    fs: {
      allow: [path.resolve(__dirname, "../..")],
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: [
      // Vitest's own default (unset otherwise once `include` is overridden).
      "**/*.{test,spec}.?(c|m)[jt]s?(x)",
      // Slice 1.2 (databases-catalogue bet) bet-progress test — named at
      // tests/bets/databases-catalogue/ per that bet's decomposition, wired
      // in here so `pnpm test` proves it alongside the permanent suite.
      "../../tests/bets/databases-catalogue/test_slice_1_site_catalogue_accessors.ts",
    ],
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
