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
      // Slice 2.1 (databases-catalogue bet) bet-progress test — same
      // rationale as above.
      "../../tests/bets/databases-catalogue/test_slice_2_site_grouped_views.tsx",
      // Milestone 1 (databases-catalogue bet) front-door bet-progress test —
      // same rationale as above.
      "../../tests/bets/databases-catalogue/test_milestone_1_catalogue_contract.ts",
    ],
    alias: {
      "@": path.resolve(__dirname, "./"),
      // The Slice 2.1 bet-progress test above is a `.tsx` file living OUTSIDE
      // this package (two levels up, at the instance repo root's tests/,
      // same constraint as the `server.fs.allow` widening above). Vite
      // resolves a file's own bare imports (and the JSX transform's injected
      // `react/jsx-dev-runtime`) relative to THAT file's own directory, which
      // never reaches back into this package's node_modules — these packages
      // only exist here (`services/site/` carries its own lockfile, no
      // workspace hoisting to a shared root `node_modules`). Aliased to the
      // package DIRECTORY (not a specific file) so Vite's own resolution
      // still handles subpath imports correctly (`react/jsx-dev-runtime`).
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
      "@testing-library/react": path.resolve(__dirname, "node_modules/@testing-library/react"),
      "next-themes": path.resolve(__dirname, "node_modules/next-themes"),
      // Without this, `vi.mock('next/navigation', ...)` called FROM the
      // out-of-package test file resolves 'next/navigation' to a different
      // module id than sidebar.tsx's own `import { usePathname } from
      // 'next/navigation'` (resolved from INSIDE this package) — the mock
      // registers against the wrong id, sidebar.tsx gets the real Next.js
      // hook, and `usePathname()` returns `null` outside a router context
      // (silently breaking every pathname-dependent assertion; CONFIRMED via
      // a render-time console probe during Slice 2.1 review remediation).
      // Aliasing both sides to the identical resolved path is what makes
      // `vi.mock` actually intercept the import sidebar.tsx performs.
      next: path.resolve(__dirname, "node_modules/next"),
    },
  },
});
