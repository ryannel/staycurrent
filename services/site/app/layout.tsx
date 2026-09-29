import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Literata } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Sidebar, type SidebarCatalogue, type TopicNavEntry } from '@/components/shell/sidebar'
import { FreshnessCorrection } from '@/components/shell/freshness-correction'
import { getCatalogues, getTopic, getTopicCutDate, getTopicSlugs, type CatalogueEntry } from '@/lib/content'
import { isFresh } from '@/lib/freshness'
import './globals.css'

// Type Scale (docs/design-system.md § Graphical UI): three self-hosted,
// subsetted families, `font-display: swap` with size-adjusted fallbacks —
// next/font's own output already carries the subsetting and the
// ascent/descent/size-adjust fallback metrics; `weight: 'variable'` ships the
// true variable-font axis Literata/Inter both need (opsz auto, arbitrary
// intermediate weights like 550/640).
// Each next/font instance's own CSS variable is deliberately NOT named
// --font-serif/--font-sans/--font-mono directly — globals.css's `@theme inline`
// bridges these `-nextfont` variables to those token names, so Tailwind's
// generated `:root { --font-sans: var(--font-sans-nextfont); }` is a real
// alias rather than a self-referential `--font-sans: var(--font-sans)`.
const literata = Literata({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-serif-nextfont',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-sans-nextfont',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-mono-nextfont',
  display: 'swap',
})

// Unifies every page's <title> on "<Page> — Stay Current": the template
// applies to any descendant segment that supplies a plain string title (the
// topic pages' `generateMetadata` and the 404 route both do), and `default`
// covers the root route, which sets none of its own. A segment that already
// wants a bare title with no suffix would need `{ absolute: '...' }` instead
// of a string — none does.
export const metadata: Metadata = {
  title: {
    template: '%s — Stay Current',
    default: 'Stay Current',
  },
  description: 'A living article that states its version and last-researched date without being asked.',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f4ee' },
    { media: '(prefers-color-scheme: dark)', color: '#1c1a17' },
  ],
}

/**
 * Sidebar tree data (App Shell spec). Reuses the content-layer entry points
 * — `getTopicSlugs`/`getTopic`/`getCatalogues` — plus `getTopicCutDate` (all still `@staycurrent/core`'s
 * public Loading API, via `loadVersion`, never a direct `topics/` read).
 * Errors propagate uncaught: a broken `topics/` tree fails the whole build
 * here exactly as it fails the per-page render ("currency is never
 * guessed").
 *
 * Freshness keys on the CURRENT VERSION'S CUT DATE, not `last_researched` — a
 * no-cut research run updates the latter without lighting the dot. Computed
 * once per slug and looked up by both the grouped catalogue entries and the
 * leftover flat list below, rather than re-derived per branch.
 *
 * `getCatalogues` only groups topics that carry a non-blank `area`; every
 * topic it groups is excluded from the returned `topics` (flat) list so it
 * renders exactly once, inside its catalogue — "topics outside any
 * catalogue render exactly as today" (Required Capabilities). A topic whose
 * `area` is set but whose `register` didn't resolve to hub/foundation/profile
 * (`Catalogue.ungrouped`) is deliberately NOT treated as "inside" a catalogue
 * here — it has no group to render into — so it falls through to the flat list instead of vanishing
 * from the sidebar entirely.
 */
function buildSidebarData(): { topics: TopicNavEntry[]; catalogues: SidebarCatalogue[] } {
  const slugs = getTopicSlugs().slice().sort()
  const freshBySlug = new Map<string, { isFresh: boolean; cutDate: string }>()
  for (const slug of slugs) {
    const { frontmatter } = getTopic(slug)
    const cutDate = getTopicCutDate(slug, frontmatter.version)
    freshBySlug.set(slug, { isFresh: isFresh(cutDate), cutDate })
  }

  const toNavEntry = (entry: CatalogueEntry): TopicNavEntry => {
    const fresh = freshBySlug.get(entry.slug)!
    return {
      slug: entry.slug,
      title: entry.title,
      isFresh: fresh.isFresh,
      cutDate: fresh.cutDate,
      ...(entry.core !== undefined && { core: entry.core }),
    }
  }

  const groupedSlugs = new Set<string>()
  const catalogues: SidebarCatalogue[] = getCatalogues().map((catalogue) => {
    if (catalogue.hub) groupedSlugs.add(catalogue.hub.slug)
    catalogue.movements.forEach((movement) => movement.entries.forEach((entry) => groupedSlugs.add(entry.slug)))
    catalogue.profiles.forEach((entry) => groupedSlugs.add(entry.slug))
    return {
      area: catalogue.area,
      hub: catalogue.hub ? toNavEntry(catalogue.hub) : null,
      movements: catalogue.movements.map((movement) => ({
        name: movement.name,
        entries: movement.entries.map(toNavEntry),
      })),
      profiles: catalogue.profiles.map(toNavEntry),
    }
  })

  const topics: TopicNavEntry[] = slugs
    .filter((slug) => !groupedSlugs.has(slug))
    .map((slug) => {
      const { frontmatter } = getTopic(slug)
      const fresh = freshBySlug.get(slug)!
      return { slug, title: frontmatter.title, isFresh: fresh.isFresh, cutDate: fresh.cutDate }
    })

  return { topics, catalogues }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  const { default: Providers } = await import('@/components/providers/default')
  const { topics, catalogues } = buildSidebarData()

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${literata.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        {/* No-JS fallback (Required Capability: every page fully readable and
            navigable with JS disabled). Below doc-shell.css's own drawer
            breakpoint the sidebar is normally an off-canvas drawer
            (`transform: translateX(-100%)`) that only the hamburger's React
            state can open — with no JS, that transform never lifts and the
            topic tree/Changelog/About become unreachable (CONFIRMED live).
            This keeps the sidebar in normal document flow instead (static,
            full-width, no drawer chrome) and hides the now-inert hamburger.
            The theme toggle is hidden everywhere, at every viewport, for the
            same reason — its click handler never attaches without JS, so it
            would otherwise render as an operable-looking button that does
            nothing. `<noscript>` content is inert (not applied) whenever JS
            *is* enabled, so this never fights the real drawer/toggle. */}
        <noscript>
          <style>{`
            @media (max-width: 899px) {
              .sidebar {
                position: static !important;
                inset: auto !important;
                height: auto !important;
                min-height: 0 !important;
                width: 100% !important;
                transform: none !important;
                box-shadow: none !important;
                z-index: auto !important;
              }
              .mobile-topbar .btn-ghost {
                display: none !important;
              }
            }
            .theme-toggle {
              display: none !important;
            }
          `}</style>
        </noscript>
        <ThemeProvider
          // Both mechanisms, in tandem: `data-theme` is doc-shell.css's own
          // (hand-authored) hook, while `class` is what Tailwind's
          // `@custom-variant dark (&:is(.dark *))` and brand.css's generated
          // `.dark { --gw-*: ... }` block both key on — `data-theme` alone
          // left every `dark:` utility and the atmosphere tokens' dark
          // variants permanently on their light values (dark mode split in
          // two, confirmed live). next-themes 0.4.6 supports the array form
          // (verified against its shipped `Attribute[]` type and script).
          attribute={['class', 'data-theme']}
          defaultTheme="system"
          enableSystem
          storageKey="theme"
          enableColorScheme={false}
        >
          <Providers>
            <a href="#main-content" className="skip-link">
              Skip to content
            </a>
            <div className="doc-shell">
              <Sidebar topics={topics} catalogues={catalogues} />
              <main id="main-content" className="doc-shell-main">
                {children}
              </main>
            </div>
            <FreshnessCorrection />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
